import React from "react";
import { Prescreen, PrescreenEnum } from "../../../../config/db-config";
import { Time } from "../../../lib/time";
import {
  getAuthUser, isRoleStudent
} from "../../../redux/actions/auth-actions";
import InputEditable from "../../../component/input-editable";
import obj2arg from "graphql-obj2arg";
import { appointmentTimeValidation } from "../../partial/activity/scheduled-interview";
import * as layoutAction from "../../../redux/actions/layout-actions";
import * as hallAction from "../../../redux/actions/hall-actions";
import { emitHallActivity } from "../../../socket/socket-client";
import { lang } from "../../../lib/lang";
import Tooltip from "../../../component/tooltip";


// ##########################################################################################
// INTERVIEW STATUS

export const Status = {
  STATUS_WAIT_CONFIRM: { color: "rgb(255, 169, 43)", text: "Pending", icon: "clock-o" },
  STATUS_RESCHEDULE: { color: "rgb(17, 6, 26)", text: "Reschedule", icon: "calendar" },
  STATUS_REJECTED: { color: "red", text: "Rejected", icon: "warning" },
  STATUS_APPROVED: { color: "#00ab1b", text: "Confirmed", icon: "check" },
  STATUS_ENDED: { color: "red", text: "Ended", icon: "times" },
  STATUS_STARTED: { color: "#0098e1", text: "Ongoing", icon: "dot-circle-o" },
  STATUS_CANCEL: { color: "red", text: "Canceled", icon: "calendar-times-o" },
}
export function getStatusElementIconClass(icon, small = false) {
  if (small) {
    return `status-icon fa fa-${icon} left`
  } else {
    return `status-icon fa fa-${icon} fa-2x left`
  }
}
export function getStatusElementTextClass() {
  return "status-text"
}
export function getStatusElementId(ID) {
  return "interview-status-" + ID;
}
export function getStatusElementSmall(d, status_obj) {
  return getStatusElement(d, status_obj, true)
}
export function getStatusElement(d, status_obj, small = false) {
  return status_obj == null ? null :
    <div id={getStatusElementId(d.ID)}
      className="interview-status"
      style={{
        padding: "4px 2px",
        fontSize: "12px",
        color: status_obj.color, fontWeight: "bold"
      }}>
      <i className={getStatusElementIconClass(status_obj.icon, small)} ></i><br></br>
      <span className={getStatusElementTextClass()}>{lang(status_obj.text)}</span>
      {d.status == PrescreenEnum.STATUS_RESCHEDULE && isRoleStudent()
        ? <span><br></br>{Time.getString(d.reschedule_time)}</span>
        : null}
    </div>;
}
export function updateStatusViewToPending(ID) {
  let newStatus = Status.STATUS_WAIT_CONFIRM

  let el = document.getElementById(getStatusElementId(ID));
  let icon = el.getElementsByClassName("status-icon")[0];
  let text = el.getElementsByClassName("status-text")[0];

  el.style.color = newStatus.color;
  icon.className = getStatusElementIconClass(newStatus.icon, true)
  text.innerHTML = newStatus.text;
}



// ##########################################################################################
// INTERVIEW NOTE

export function getNoteElement(d) {
  let entity = "Note";
  return <InputEditable
    editTitle={`Add ${entity}`}
    val={d.note}
    data={{ ID: d.ID }}
    formItems={(fixedName) => {
      return [
        { header: `Add ${entity}` },
        {
          name: fixedName,
          type: "textarea",
          placeholder: "Note",
        }
      ]
    }}
    render={(val, loading, openEditPopup) => {
      let notAssigned = <span className="text-muted"><i>{lang("Note")}</i></span>;
      let editing = <span className="text-muted"><i>{lang("Updating")} {lang(entity)}. {lang("Please Wait")}.</i></span>;
      let editIcon = <a className="btn-link-bright" onClick={openEditPopup}><i className="fa fa-edit left"></i></a>;

      if (!loading && val) {
        return <Tooltip
          bottom={'1px'}
          left={'-44px'}
          width={'163px'}
          alignCenter={true}
          content={<div className="text-muted-dark text-truncate-2"><span>{editIcon}{val}</span></div>}
          tooltip={val}
        />
      }

      return <div className="text-muted-dark">
        {loading ? editing : <span>{editIcon}{notAssigned}</span>}
      </div >

    }}
    query={(data, newVal) => {
      let upd = {
        ID: data.ID,
        note: newVal,
        updated_by: getAuthUser().ID
      }
      return `mutation { edit_prescreen(${obj2arg(upd, { noOuterBraces: true })}) { ID } }`
    }}
  />
}

// ##########################################################################################
// INTERVIEW APPOINTMENT TIME

export function getRescheduleTimeElement(d) {
  return getAppointmentTimeElement(d, undefined, true);
}

export function getAppointmentTimeElement(d, happeningIn, isButtonReschedule) {
  var originalVal = d.appointment_time;

  return <InputEditable
    editTitle={`Edit Appoinment Time`}
    val={d.appointment_time}
    data={{ ID: d.ID }}
    queryDone={(res) => {
      let sid = d.student.ID;
      emitHallActivity(hallAction.ActivityType.PRESCREEN, sid, null);
    }}
    formDidSubmit={(dForm) => {
      updateStatusViewToPending(d.ID)
      layoutAction.successBlockLoader(<div>
        Appointment time successfully updated and the interview status has changed to <b>Pending</b>.
      </div>)
    }}
    formWillSubmit={(dForm) => {
      let res = appointmentTimeValidation(dForm);

      let val = typeof res !== "string" ? res : null;
      let err = typeof res === "string" ? res : null;

      // console.log("valFromForm", dForm);
      // console.log("response", res);
      // kalau takde error tapi value sama je dgn yang dulu
      if (!err) {
        if (val == d.appointment_time) {
          err = "Please enter a different time from the current appointment time."
          val = null;
        }
      }

      return {
        val: val,
        error: err,
      }
    }}
    formItems={(fixedName) => {
      return [
        {
          header: <div>
            Current Time:<br></br>
            <small className="text-muted">{Time.getString(d.appointment_time, true)}</small>
            <br></br>
            <br></br>
            Interviewee's Suggested Time:<br></br>
            <small className="text-muted">{Time.getString(d.reschedule_time, true)}</small>
            <br></br>
            <br></br>
          </div>
        },
        {
          header: <div>Enter A New Time:
          </div>
        },
        {
          name: Prescreen.APPNMENT_TIME + "_DATE",
          type: "date",
          placeholder: ""
        },
        {
          name: Prescreen.APPNMENT_TIME + "_TIME",
          type: "time",
          placeholder: ""
        }
      ]
    }}
    render={(val, loading, openEditPopup) => {
      if (isButtonReschedule) {
        if (originalVal != val) {
          hallAction.storeLoadActivity([hallAction.ActivityType.PRESCREEN]);
        }
        return <div
          onClick={openEditPopup}
          className="btn btn-sm btn-black btn-round-5 btn-block btn-bold btn-130"
        >
          <i className="fa fa-calendar left"></i>{lang("Reschedule Call")}
        </div>
      }

      let include_timezone = false;
      let timeStr = Time.getString(val, include_timezone);
      // timeStr = [timeStr, happeningIn]

      // let notAssigned = <span className="text-muted"><i>No {entity} Assigned</i></span>;
      let editing = <span className="text-muted"><i>{lang("Updating Appointment Time")}. {lang("Please Wait")}.</i></span>;
      let editIcon = null;
      if (d.status == PrescreenEnum.STATUS_RESCHEDULE) {
        // remove because we use reschedule button
        // editIcon = <a className="btn-link-bright"><i onClick={openEditPopup} className="fa fa-edit left"></i></a>;
      } else {
        // editIcon = <i className="text-muted fa fa-edit left"></i>;
        editIcon = null;
      }

      return <span className="text-muted-dark">
        {loading ? editing : <span>{editIcon}{timeStr}</span>}
      </span >
    }}
    query={(data, newVal) => {
      let upd = {
        ID: data.ID,
        status: PrescreenEnum.STATUS_WAIT_CONFIRM,
        appointment_time: newVal,
        updated_by: getAuthUser().ID
      }
      return `mutation { edit_prescreen(${obj2arg(upd, { noOuterBraces: true })}) { ID appointment_time } }`
    }}
  />
}


// ##########################################################################################
// INTERVIEW / EVENT PIC

export function getPicElement(d, mutation_edit, entity) {
  let pic = <InputEditable
    editTitle={`${lang("Edit")} ${lang(entity)}`}
    val={d.pic}
    data={{ ID: d.ID }}
    formItems={(fixedName) => {
      return [
        { header: `${lang("Edit")} ${lang(entity)}` },
        {
          name: fixedName,
          type: "text",
          placeholder: "John Doe, Sarah Hopper",
        }
      ]
    }}
    render={(val, loading, openEditPopup) => {
      // let notAssigned = <span className="text-muted"><i>{lang(`No`)} {lang(entity)} {lang("Assigned")}</i></span>;
      let notAssigned = <span className="text-muted"><i>{lang(entity)}</i></span>;
      let editing = <span className="text-muted"><i>{lang("Assigning")}{lang(entity)}. {lang("Please Wait")}.</i></span>;

      let content = null;

      // ##########################################
      // FOR EVENT
      if (mutation_edit == "edit_event") {
        let editIcon = <a className="btn-link-bright" onClick={openEditPopup}><i className="fa fa-edit right"></i></a>;
        content = <small>
          <i className="fa fa-user-circle left"></i>
          <b>{entity}</b>
          {" : "}
          {loading ? editing : <span>{!val ? notAssigned : val}{editIcon}</span>}
        </small>;
        return <div className="text-muted-dark">
          {content}
        </div >
      }


      // ##########################################
      // FOR PRESCREEN
      else if (mutation_edit == "edit_prescreen") {
        // val = [<b>{entity}</b>, " : ", val];
        let editIcon = <a className="btn-link-bright" onClick={openEditPopup}><i className="fa fa-edit left"></i></a>;
        // content = <div>
        //   {loading ? editing : <span>{editIcon}{!val ? notAssigned : val}</span>}
        // </div>
        if (!loading && val) {
          return <Tooltip
            bottom={'1px'}
            left={'-44px'}
            width={'163px'}
            alignCenter={true}
            content={<div className="text-muted-dark text-truncate-2">
              <span>{editIcon}{val}</span>
            </div>}
            tooltip={val}
          />
        }
        return <div className="text-muted-dark text-truncate-2">
          {loading ? editing : <span>{editIcon}{notAssigned}</span>}
        </div >
      }


    }}
    query={(data, newVal) => {
      let upd = {
        ID: data.ID,
        pic: newVal,
        updated_by: getAuthUser().ID
      }
      return `mutation { ${mutation_edit}(${obj2arg(upd, { noOuterBraces: true })}) { ID pic } }`
    }}
  />

  return pic;
}
