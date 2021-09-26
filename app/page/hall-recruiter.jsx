import React from "react";
import PropTypes from "prop-types";
import GroupCallList from "./partial/group-call/group-call-list";
import HallRecruiterEvent from "./partial/hall-recruiter/hall-recruiter-event";
import HallRecruiterInterview from "./partial/hall-recruiter/hall-recruiter-interview";
import HallRecruiterJobPosts from "./partial/hall-recruiter/hall-recruiter-job-posts";
import { RootPath } from "../../config/app-config";
import { Prescreen, PrescreenEnum, CompanyEnum, CFSMeta } from "../../config/db-config";
import { Time } from "../lib/time";
import {
  getCFObj,
  getAuthUser,
  loadCompanyPriv,
  getCfCustomMeta,
  isCfFeatureOff,
  isCfFeatureOn
} from "../redux/actions/auth-actions";
import { ButtonAction } from "../component/buttons";
import InputEditable from "../component/input-editable";
import obj2arg from "graphql-obj2arg";
import { appointmentTimeValidation } from "./partial/activity/scheduled-interview";
import { Loader } from "../component/loader";
import { _student_single, _student_plural, _student_plural_lower } from "../redux/actions/text-action";
import { lang } from "../lib/lang";

// require("../css/hall.scss");''
// export function getAppointmentTimeElement(d, happeningIn) {
//   return <InputEditable
//     editTitle={`Edit Appoinment Time`}
//     val={d.appointment_time}
//     data={{ ID: d.ID }}
//     formWillSubmit={(dForm) => {
//       let res = appointmentTimeValidation(dForm);

//       let val = typeof res !== "string" ? res : null;
//       let err = typeof res === "string" ? res : null;

//       // console.log("valFromForm", dForm);
//       // console.log("response", res);
//       // kalau takde error tapi value sama je dgn yang dulu
//       if (!err) {
//         if (val == d.appointment_time) {
//           err = "Please enter a different time from the current appointment time."
//           val = null;
//         }
//       }

//       return {
//         val: val,
//         error: err,
//       }
//     }}
//     formItems={(fixedName) => {
//       return [
//         {
//           header: <div>Current Appointment Time:<br></br>
//             <small className="text-muted">{Time.getString(d.appointment_time, true)}</small>
//             <br></br>
//             <br></br>
//           </div>
//         },
//         {
//           header: <div>Enter A New Appointment Time:
//           </div>
//         },
//         {
//           name: Prescreen.APPNMENT_TIME + "_DATE",
//           type: "date",
//           placeholder: ""
//         },
//         {
//           name: Prescreen.APPNMENT_TIME + "_TIME",
//           type: "time",
//           placeholder: ""
//         }
//       ]
//     }}
//     render={(val, loading, openEditPopup) => {
//       let include_timezone = false;
//       let timeStr = Time.getString(val, include_timezone);
//       // timeStr = [timeStr, happeningIn]

//       // let notAssigned = <span className="text-muted"><i>No {entity} Assigned</i></span>;
//       let editing = <span className="text-muted"><i>Updating Appointment Time. Please Wait.</i></span>;
//       let editIcon = null;
//       if (d.status == PrescreenEnum.STATUS_WAIT_CONFIRM) {
//         editIcon = <a className="btn-link-bright"><i onClick={openEditPopup} className="fa fa-edit left"></i></a>;
//       } else {
//         editIcon = <i className="text-muted fa fa-edit left"></i>;
//       }

//       return <span className="text-muted-dark">
//         {loading ? editing : <span>{editIcon}{timeStr}</span>}
//       </span >
//     }}
//     query={(data, newVal) => {
//       let upd = {
//         ID: data.ID,
//         appointment_time: newVal,
//         updated_by: getAuthUser().ID
//       }
//       return `mutation { edit_prescreen(${obj2arg(upd, { noOuterBraces: true })}) { ID appointment_time } }`
//     }}
//   />
// }
// export function getPicElement(d, mutation_edit, entity) {
//   let pic = <InputEditable
//     editTitle={`Edit ${entity}`}
//     val={d.pic}
//     data={{ ID: d.ID }}
//     formItems={(fixedName) => {
//       return [
//         { header: `Edit ${entity}` },
//         {
//           name: fixedName,
//           type: "text",
//           placeholder: "John Doe, Sarah Hopper",
//         }
//       ]
//     }}
//     render={(val, loading, openEditPopup) => {
//       let notAssigned = <span className="text-muted"><i>No {entity} Assigned</i></span>;
//       let editing = <span className="text-muted"><i>Assigning {entity}. Please Wait.</i></span>;

//       let content = null;

//       // ##########################################
//       // FOR EVENT
//       if (mutation_edit == "edit_event") {
//         let editIcon = <a className="btn-link-bright" onClick={openEditPopup}><i className="fa fa-edit right"></i></a>;
//         content = <small>
//           <i className="fa fa-user-circle left"></i>
//           <b>{entity}</b>
//           {" : "}
//           {loading ? editing : <span>{!val ? notAssigned : val}{editIcon}</span>}
//         </small>;
//       }
//       // ##########################################
//       // FOR PRESCREEN
//       else if (mutation_edit == "edit_prescreen") {
//         // val = [<b>{entity}</b>, " : ", val];
//         let editIcon = <a className="btn-link-bright" onClick={openEditPopup}><i className="fa fa-edit left"></i></a>;
//         content = <div>
//           {loading ? editing : <span>{editIcon}{!val ? notAssigned : val}</span>}
//         </div>
//       }

//       return <div className="text-muted-dark">
//         {content}
//       </div >
//     }}
//     query={(data, newVal) => {
//       let upd = {
//         ID: data.ID,
//         pic: newVal,
//         updated_by: getAuthUser().ID
//       }
//       return `mutation { ${mutation_edit}(${obj2arg(upd, { noOuterBraces: true })}) { ID pic } }`
//     }}
//   />

//   return pic;
// }

export default class HallRecruiterPage extends React.Component {
  constructor(props) {
    super(props);
    this.CFDetail = getCFObj();
    this.title = this.CFDetail.title;
    this.authUser = getAuthUser();

    this.company_id = this.authUser.rec_company
    this.state = {
      loading: false,
      isJobPostingOnly: false
    }
  }

  componentWillMount() {
    this.setState({ loading: true });

    loadCompanyPriv(this.company_id, (priv) => {
      let isJobPostingOnly = false;
      if (CompanyEnum.hasPriv(priv, CompanyEnum.PRIV.JOB_POSTING_ONLY)) {
        isJobPostingOnly = true;
      }
      this.setState({ loading: false, isJobPostingOnly: isJobPostingOnly })
    });
  }

  // componentWillUnmount() {
  //   unsetBodyFullWidth();
  // }
  getRecruiterAction() {
    return <div className="title-sectaion">
      <div className="">
        {this.state.isJobPostingOnly
          ?

          // ########################################
          // job posting only
          // ########################################
          <ButtonAction
            style={{ width: "350px", maxWidth: "70vw" }}
            btnClass="btn-lg btn-success"
            // to={`${RootPath}/app/my-activity/student-listing`}
            to={`${RootPath}/app/student-list-job-post`}
            icon="user"
            iconSize="3x"
            mainText={lang(_student_single() + " Listing")}
            // subText={`See who's interested in ${this.authUser.company.name}`}
            subText={lang(`Browse ${_student_plural_lower()} from job posts applicants`)}
          />

          // ########################################
          // normal
          // ########################################
          : [<ButtonAction
            style={{ width: "350px", maxWidth: "70vw" }}
            btnClass="btn-lg btn-success"
            // to={`${RootPath}/app/my-activity/student-listing`}
            to={`${RootPath}/app/browse-student`}
            icon="users"
            iconSize="3x"
            mainText={lang(`All ${_student_plural()}`)}
            // subText={`See who's interested in ${this.authUser.company.name}`}
            subText={lang(`Browse all ${_student_plural_lower()}`)}
          />,
          isCfFeatureOff(CFSMeta.FEATURE_RECRUITER_INTERESTED_STUDENT) ? null :
            <ButtonAction
              style={{ width: "350px", maxWidth: "70vw" }}
              btnClass="btn-lg btn-blue"
              // to={`${RootPath}/app/my-activity/student-listing`}
              to={`${RootPath}/app/browse-student?interested_only=1`}
              icon="user"
              iconSize="3x"
              mainText={lang(`Interested ${_student_plural()}`)}
              // subText={`See who's interested in ${this.authUser.company.name}`}
              subText={lang(`Browse ${_student_plural_lower()} interested in you`)}
            />
          ]
        }

      </div >
    </div >
  }

  getJobEventSection() {
    let job = <HallRecruiterJobPosts company_id={this.company_id}></HallRecruiterJobPosts>;
    let event = <HallRecruiterEvent company_id={this.company_id}></HallRecruiterEvent>;
    let groupCall = <GroupCallList company_id={this.company_id}></GroupCallList>;

    let isGroupCallOn = isCfFeatureOn(CFSMeta.FEATURE_GROUP_CALL);
    let isJobOff = isCfFeatureOff(CFSMeta.FEATURE_RECRUITER_JOB_POST);
    let isEventOff = isCfFeatureOff(CFSMeta.FEATURE_EVENT);

    let toRet = [];


    if (isGroupCallOn && !isJobOff && !isEventOff) {
      toRet.push(<div className="col-lg-6">{groupCall}</div>)
      toRet.push(<div className="col-lg-6">{job}{event}</div>)
    } else if (isGroupCallOn && !isEventOff) {
      toRet.push(<div className="col-lg-6">{groupCall}</div>)
      toRet.push(<div className="col-lg-6">{event}</div>)
    } else if (isGroupCallOn) {
      toRet.push(<div className="col-md-2"></div>)
      toRet.push(<div className="col-md-8">{groupCall}</div>)
      toRet.push(<div className="col-md-2"></div>)
    } else {
      if (!isJobOff) {
        toRet.push(<div className="col-md-6">{job}</div>)
      }
      if (!isEventOff) {
        toRet.push(<div className="col-md-6">{event}</div>)
      }
    }

    if (toRet.length == 0) {
      return null;
    } else {
      return toRet;
    }
  }

  render() {
    document.setTitle(lang("Recruiter Home Page"));
    let v = null;

    if (this.state.loading) {
      v = <Loader size="3" text={lang("Loading Company Information...")}></Loader>
    } else {
      v = <div className="hall-page">
        <h1 className="text-left"><b>{lang(getCfCustomMeta(CFSMeta.TEXT_SALUTATION_RECRUITER, "Welcome"))} {this.authUser.company.name} !</b></h1>
        {this.getRecruiterAction()}
        <br></br>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <HallRecruiterInterview></HallRecruiterInterview>
            </div>
          </div>
          <div className="row">
            {this.getJobEventSection()}
          </div>
        </div>
      </div>
    }


    return v;
  }
}

HallRecruiterPage.propTypes = {
  isPreEvent: PropTypes.bool
};

HallRecruiterPage.defaultProps = {
  isPreEvent: false
};
