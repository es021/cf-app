//Faizul Here

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { Loader } from "../../../component/loader";
import obj2arg from "graphql-obj2arg";
import ProfileCard, { getImageObj, PCType } from "../../../component/profile-card.jsx";
import {
  Prescreen,
  PrescreenEnum,
  SessionRequestEnum,
  EntityRemoved,
  GroupSessionJoin,
  LogEnum,
  CFSMeta
} from "../../../../config/db-config";
import { ButtonLink } from "../../../component/buttons.jsx";
import { ProfileListItem } from "../../../component/list";
import { Time } from "../../../lib/time";
import { showNotification } from "../../../lib/notification";
import { RootPath } from "../../../../config/app-config";
import { NavLink } from "react-router-dom";
import { getAuthUser, getCFObj } from "../../../redux/actions/auth-actions";
import { ActivityAPIErr } from "../../../../server/api/activity-api";
import UserPopup, { createUserDocLinkList } from "../popup/user-popup";
import {
  emitQueueStatus,
  emitHallActivity
} from "../../../socket/socket-client";
import {
  isUserOnline,
  isCompanyOnline
} from "../../../redux/actions/user-actions";
import * as layoutActions from "../../../redux/actions/layout-actions";
import * as activityActions from "../../../redux/actions/activity-actions";
import * as hallAction from "../../../redux/actions/hall-actions";

import { openSIAddForm, isNormalSI } from "../activity/scheduled-interview";
import Tooltip from "../../../component/tooltip";

import { isRoleRec, isRoleStudent } from "../../../redux/actions/auth-actions";
import { joinVideoCall } from "../session/chat";

import { getAxiosGraphQLQuery } from "../../../../helper/api-helper";
import * as HallViewHelper from "../../view-helper/hall-view-helper";
import ToogleTimezone from "../../../component/toggle-timezone";
import { openLiveSession } from "../hall/live-session";
import { addLog } from "../../../redux/actions/other-actions";
import ListBoard from "../../../component/list-board";
import InputEditable from "../../../component/input-editable";

import * as HallRecruiterHelper from "./hall-recruiter-helper";
import { animateHide } from "../../view-helper/view-helper";
import { _student_single } from "../../../redux/actions/text-action";
import { lang } from "../../../../helper/lang-helper";

// require("../../../css/border-card.scss");
export function getTimeStrNew(d) {
  let unixtime = d.appointment_time;
  let showTimeOnly = false;

  if (
    d.status == PrescreenEnum.STATUS_REJECTED ||
    d.status == PrescreenEnum.STATUS_ENDED
  ) {
    showTimeOnly = true;
  } else {
    showTimeOnly = false;
  }

  if (d.status == PrescreenEnum.STATUS_STARTED) {
    if (!d.is_expired && d.join_url != "" && d.join_url != null) {
      // nothing
    } else {
      if (d.is_expired) {
        showTimeOnly = true;
      } else {
        showTimeOnly = false;
      }
    }
  }

  // debug
  //unixtime = (1552804854865/1000) + 500;

  let passedText = "Waiting For Recruiter";
  let happeningIn = Time.getHapenningIn(unixtime, {
    passedText: isRoleStudent() ? passedText : null,
    // startCountMinute: 24 * 60 // 24 hours
    startCountMinute: 4000 * 60 // 24 hours
  });

  if (showTimeOnly || happeningIn == null) {
    return HallRecruiterHelper.getAppointmentTimeElement(d);
  } else {
    if (happeningIn != passedText) {
      happeningIn = <small>Starting In {happeningIn}</small>;
    }
    happeningIn = (
      <div
        style={{ marginBottom: "-6px", fontWeight: "bold" }}
        className="text-primary"
      >
        {happeningIn}
      </div>
    );
    return HallRecruiterHelper.getAppointmentTimeElement(d, happeningIn);
  }
}

class InterviewList extends React.Component {
  constructor(props) {
    super(props);
    this.updatePrescreen = this.updatePrescreen.bind(this);
    this.confirmUpdatePrescreen = this.confirmUpdatePrescreen.bind(
      this
    );
    this.LIMIT_SHOW_LESS = this.props.limitShowLess;
    this.authUser = getAuthUser();
    this.state = {
      time: Date.now()
    };
    this.interval = null;
    // this.UPDATE_INTERVAL = 30 * 1000;
  }

  componentDidMount() {
    // this.interval = setInterval(() => {
    //   this.setState(() => {
    //     return { time: Date.now() };
    //   });
    // }, this.UPDATE_INTERVAL);
  }

  componentWillUnmount() {
    // clearInterval(this.interval);
  }


  getRemoveButton(d) {

    const confirmRemove = (parentEl, entity, entity_id) => {
      let ins = {};
      ins[EntityRemoved.ENTITY] = entity;
      ins[EntityRemoved.ENTITY_ID] = Number.parseInt(entity_id);
      ins[EntityRemoved.USER_ID] = this.authUser.ID;
      let q = `mutation { add_entity_removed (${obj2arg(ins, {
        noOuterBraces: true
      })}) { ID } }`;
      animateHide(parentEl, () => {
        this.props.onRemoveItem(entity_id)
      });
      getAxiosGraphQLQuery(q).then(data => { });
    };


    let entity = Prescreen.TABLE;
    let entity_id = d.ID;
    let confirmMes = <div>
      <div>{lang("Continue removing interview with")} <b>{d.student.first_name}{" "}{d.student.last_name}</b> ?</div>
      <small><i className="text-danger">* {lang("This action cannot be undone")} *</i></small>

    </div>
    return (
      <button
        onClick={e => {

          let entity = e.currentTarget.dataset.entity;
          let entity_id = e.currentTarget.dataset.entity_id;
          let parentButton = e.currentTarget.parentNode;
          let parentPcBody = parentButton.parentNode;
          let parentCard = parentPcBody.parentNode;
          let parentContainer = parentCard.parentNode;
          let parentLbList = parentContainer.parentNode;

          // console.log(parentLbList, entity, entity_id);
          layoutActions.confirmBlockLoader(confirmMes, () => {
            layoutActions.storeHideBlockLoader();
            confirmRemove(parentLbList, entity, entity_id);
          })

        }}
        data-entity={entity}
        data-entity_id={entity_id}
        className="btn btn-sm btn-gray btn-round-5 btn-block"
      >
        <i className="fa fa-trash left"></i>
        {lang("Remove Card")}
      </button>
    );
  }

  startVideoCallPreScreen(e) {
    HallViewHelper.startVideoCall(e, {
      type: HallViewHelper.TYPE_PRIVATE_SESSION,
      user_id: this.authUser.ID,
      bindedSuccessHandler: () => {
        hallAction.storeLoadActivity([hallAction.ActivityType.PRESCREEN]);
      }
    });
  }



  updatePrescreen(id, user_id, status) {
    layoutActions.loadingBlockLoader("Updating Scheduled Call Status..");

    if (typeof id === "string") {
      id = Number.parseInt(id);
    }
    if (typeof user_id === "string") {
      user_id = Number.parseInt(user_id);
    }

    let upd = {};
    upd[Prescreen.ID] = id;
    upd[Prescreen.UPDATED_BY] = user_id;
    upd[Prescreen.STATUS] = status;

    let query = `mutation{edit_prescreen(${obj2arg(upd, {
      noOuterBraces: true
    })}) {ID student_id company_id}}`;

    getAxiosGraphQLQuery(query).then(
      data => {
        let res = data.data.data.edit_prescreen;
        var toRefresh = [hallAction.ActivityType.PRESCREEN];
        hallAction.storeLoadActivity(toRefresh);
        layoutActions.storeHideBlockLoader();

        var sid = isRoleStudent() ? null : res.student_id;
        var cid = isRoleRec() ? null : res.company_id;
        emitHallActivity(hallAction.ActivityType.PRESCREEN, sid, cid);
      },
      err => {
        layoutActions.errorBlockLoader(err);
      }
    );
  }

  // for reject and cancel
  // trigger from card view button
  confirmUpdatePrescreen(e, status) {
    var other_name = e.currentTarget.dataset.other_name;
    var id = e.currentTarget.id;
    var user_id = this.authUser.ID;

    const confirmUpdate = () => {
      this.updatePrescreen(id, user_id, status);
    };

    // create confirm message
    var mes = "";
    if (status === PrescreenEnum.STATUS_ENDED) {
      mes += lang("Ending");
    }
    if (status === PrescreenEnum.STATUS_APPROVED) {
      mes += lang("Approving");
    }
    if (status === PrescreenEnum.STATUS_REJECTED) {
      mes += lang("Rejecting");
    }

    mes += ` ${lang("Scheduled Call with")} ${other_name} ?`;
    layoutActions.confirmBlockLoader(mes, confirmUpdate);
  }

  // addRemoveButton(body, hasRemove, removeEntity, removeEntityId) {
  //   body = [
  //     this.getRemoveButton(hasRemove, removeEntity, removeEntityId),
  //     body
  //   ]

  //   return body;
  // }

  // return action n subtitle
  renderHelper(d, obj) {
    var action = null;
    var rejoinLink = null;
    var status = null;
    var time = null;

    var status_obj = null;
    // var status_text = null;
    // var status_color = null;
    // var status_icon = null;

    var removeEntity = null;
    var removeEntityId = null;

    let btnJoinVCall = null;
    var btnStartVCall = null;
    var btnRejoinVCall = null;
    var btnRemoveVCall = null;
    var btnEndVCall = null;
    var btnAcceptReject = null;


    time = getTimeStrNew(d);

    //body = <div style={{ height: "30px" }}></div>;
    var ps_type =
      d.special_type == null || d.special_type == ""
        ? PrescreenEnum.ST_PRE_SCREEN
        : d.special_type;

    if (isNormalSI(ps_type)) {
      ps_type = lang("Scheduled Session");
    }

    switch (d.status) {
      case PrescreenEnum.STATUS_WAIT_CONFIRM:
        status_obj = HallRecruiterHelper.Status.STATUS_WAIT_CONFIRM;
        // status_text = "Pending";
        // status_color = "rgb(255, 169, 43)";
        // status_icon = "clock-o"

        break;
      case PrescreenEnum.STATUS_RESCHEDULE:
        status_obj = HallRecruiterHelper.Status.STATUS_RESCHEDULE;
        // status_text = "Reschedule Requested";
        // status_color = "rgb(17, 6, 26)";
        // status_icon = "calendar"

        break;
      case PrescreenEnum.STATUS_REJECTED:
        status_obj = HallRecruiterHelper.Status.STATUS_REJECTED;
        // status_text = "Rejected";
        // status_color = "red";
        // status_icon = "warning"

        // removeEntity = Prescreen.TABLE;
        // removeEntityId = d.ID;
        // btnRemoveVCall = this.getRemoveButton(removeEntity, removeEntityId);
        break;
      case PrescreenEnum.STATUS_APPROVED:
        if (
          d.is_onsite_call == 1 &&
          getCFObj()[CFSMeta.HALL_CFG_ONSITE_CALL_USE_GROUP] == 1
        ) {
          btnStartVCall = (
            <div
              data-appointment_time={d.appointment_time}
              data-participant_id={obj.ID}
              data-id={d.ID}
              data-company_id={d.company_id}
              onClick={e => {
                let eD = e.currentTarget.dataset;
                openLiveSession(eD.company_id);
                addLog(LogEnum.EVENT_CLICK_CONNECT_WITH_ONSITE, eD);
              }}
              className="btn btn-sm btn-success"
            >
              Connect With On-site
            </div>
          );
        } else {
          btnStartVCall = (
            <div
              data-appointment_time={d.appointment_time}
              data-participant_id={obj.ID}
              data-id={d.ID}
              onClick={this.startVideoCallPreScreen.bind(this)}
              className="btn btn-sm btn-green btn-round-5 btn-block btn-bold"
            >
              <i className="fa fa-video-camera left"></i>{lang("Start Call")}
            </div>
          );
        }
        // status_text = "Interview Accepted";
        status_obj = HallRecruiterHelper.Status.STATUS_APPROVED;
        // status_text = "Confirmed";
        // status_color = "#00ab1b";
        // status_icon = "check"

        break;
      case PrescreenEnum.STATUS_ENDED:
        // removeEntity = Prescreen.TABLE;
        // removeEntityId = d.ID;
        // btnRemoveVCall = this.getRemoveButton(removeEntity, removeEntityId);

        // status_text = "Video Call Ended";
        status_obj = HallRecruiterHelper.Status.STATUS_ENDED;
        // status_text = "Ended";
        // status_color = "red";
        // status_icon = "times"
        break;
      case PrescreenEnum.STATUS_STARTED:
        let isExpiredHandler = () => {
          var mes = (
            <div>
              {lang("Unable to join.")}
              <br />
              {lang("This 1-1 session has ended.")}
            </div>
          );
          layoutActions.errorBlockLoader(mes);
          let updData = {};
          updData[Prescreen.ID] = d.ID;
          updData[Prescreen.IS_EXPIRED] = 1;
          updData[Prescreen.STATUS] = PrescreenEnum.STATUS_ENDED;
          updData[Prescreen.UPDATED_BY] = this.authUser.ID;
          var q = `mutation {edit_prescreen (${obj2arg(updData, {
            noOuterBraces: true
          })}){ID}}`;
          getAxiosGraphQLQuery(q).then(res => {
            hallAction.storeLoadActivity([hallAction.ActivityType.PRESCREEN]);
          });
        };
        var hasStart = false;
        if (!d.is_expired && d.join_url != "" && d.join_url != null) {
          hasStart = true;
          status_obj = HallRecruiterHelper.Status.STATUS_STARTED;
          // status_text = "Ongoing";
          // status_color = "#0098e1";
          // status_icon = "dot-circle-o";
        } else {
          time = getTimeStrNew(d, true);

          // if (d.is_expired) {
          //   time = getTimeStrNew(d, true);
          // } else {
          //   time = getTimeStrNew(d, false);
          // }
        }
        if (hasStart) {
          // bukak start url
          // rejoinLink = <div>
          //   <a
          //     onClick={() =>
          //       joinVideoCall(
          //         d.join_url,
          //         null,
          //         isExpiredHandler,
          //         null,
          //         d.ID,
          //         d.start_url
          //       )
          //     }
          //     className="action btn-link"
          //   >
          //     <b><u>Click Here To Rejoin Video Call</u></b>
          //   </a>
          // </div>

          btnRejoinVCall = (
            <div
              id={d.ID}
              data-other_id={obj.ID}
              data-other_name={obj.name}
              onClick={() =>
                joinVideoCall(
                  d.join_url,
                  null,
                  isExpiredHandler,
                  null,
                  d.ID,
                  d.start_url
                )
              }
              className="btn btn-sm btn-blue-light btn-bold btn-round-5 btn-block"
            >
              <i className="fa fa-sign-in left"></i>{lang("Join Call")}
            </div>
          );

          btnEndVCall = (
            <div
              id={d.ID}
              data-other_id={obj.ID}
              data-other_name={obj.name}
              onClick={e => {
                this.confirmUpdatePrescreen(
                  e,
                  PrescreenEnum.STATUS_ENDED
                );
              }}
              className="btn btn-sm btn-red btn-bold btn-round-5 btn-block"
            >
              <i className="fa fa-times left"></i>{lang("End Call")}
            </div>
          );
        }

        break;
    }

    // @new_flow_cancel_interview - buang remove button
    // add remove button for certain2 status
    if ([
      // PrescreenEnum.STATUS_WAIT_CONFIRM,
      // PrescreenEnum.STATUS_RESCHEDULE,
      // PrescreenEnum.STATUS_APPROVED,
      PrescreenEnum.STATUS_ENDED,
      PrescreenEnum.STATUS_REJECTED
    ].indexOf(d.status) >= 0) {
      btnRemoveVCall = this.getRemoveButton(d);
    }

    // finalize action
    action = [
      btnStartVCall,
      btnRejoinVCall,
      btnEndVCall,
      d.status == PrescreenEnum.STATUS_WAIT_CONFIRM ? btnAcceptReject : null,
      d.status == PrescreenEnum.STATUS_STARTED ? btnJoinVCall : null,
      d.status == PrescreenEnum.STATUS_ENDED || PrescreenEnum.STATUS_REJECTED ? btnRemoveVCall : null,
    ]

    status = HallRecruiterHelper.getStatusElement(d, status_obj);

    return {
      time: time,
      action: action,
      status: status,
      rejoinLink: rejoinLink
    };
  }
  populateList() {
    return this.props.list.map((d, i) => {
      if (!this.props.isShowMore) {
        if (i >= this.LIMIT_SHOW_LESS) {
          return null;
        }
      }

      var action = null;
      var obj = d.student;
      if (typeof obj === "undefined") {
        return false;
      }
      obj.name = obj.first_name + " " + obj.last_name;

      // 1. name
      var title = (
        <div className="iv-title">
          <ButtonLink
            label={<div><b>{obj.first_name}</b>{" "}{obj.last_name}</div>}
            onClick={() =>
              layoutActions.storeUpdateFocusCard(
                obj.first_name + " " + obj.last_name,
                UserPopup,
                { id: obj.ID }
              )
            }
          />
        </div>
      );

      var objRenderHelper = this.renderHelper(d, obj);
      var action = objRenderHelper.action;
      var time = objRenderHelper.time;
      var status = objRenderHelper.status;
      var rejoinLink = objRenderHelper.rejoinLink;
      let isOnline = isUserOnline(this.props.online_users, obj.ID);
      let avatar = (
        <ProfileCard
          type={PCType.STUDENT}
          customStyleParent={{ margin: "0px" }}
          className="with-border"
          isOnline={isOnline}
          img_url={obj.img_url}
          img_pos={obj.img_pos}
          img_size={obj.img_size}
          img_dimension="50px"
        ></ProfileCard>
      );


      let pic = HallRecruiterHelper.getPicElement(d, "edit_prescreen", lang("Interviewer"));
      let note = HallRecruiterHelper.getNoteElement(d);
      // renderList
      return <li
        className="lb-list-item text-left">
        <div className="container-fluid">
          <div className="row" style={{ padding: "15px 10px" }}>
            {/* avatar */}
            <div className="col-md-1 padding-sm container-avatar">
              {avatar}<div className="show-on-md-and-less">{title}</div>
            </div>
            {/* name */}
            <div className="col-md-2 padding-sm show-on-lg-and-more">
              <div style={{ marginBottom: "8px", fontSize: "15px" }}>{title}</div>
            </div>
            {/* status */}
            <div className="col-md-2 padding-sm">
              <div style={{ marginBottom: "10px", fontSize: "12px" }}>{status}</div>
            </div>
            {/* time */}
            <div className="col-md-2 padding-sm">
              <div style={{ marginBottom: "4px", fontSize: "13px" }}>{time}</div>
            </div>
            {/* interviewer */}
            <div className="col-md-2 padding-sm">
              <div style={{ marginBottom: "4px", fontSize: "13px" }}>{pic}</div>
            </div>
            {/* note */}
            <div className="col-md-1 padding-sm">
              <div style={{ marginBottom: "10px", fontSize: "13px" }}>{note}</div>
            </div>
            {/* action */}
            <div className="col-md-2 padding-sm">
              <div style={{
                textAlign: "left", margin: "auto",
              }}>
                {action}
              </div>
            </div>
          </div>
        </div>

      </li>
    });
  }
  getHeader() {
    return <li
      className="lb-list-header text-left">
      <div className="container-fluid">
        <div className="row" style={{ padding: "15px 10px" }}>
          <div className="col-md-1 padding-sm container-avatar">{_student_single()}</div>
          <div className="col-md-2 padding-sm show-on-lg-and-more"></div>
          <div className="col-md-2 text-center padding-sm">Status</div>
          <div className="col-md-2 padding-sm">Appointment Time</div>
          <div className="col-md-2 padding-sm">Interviewer</div>
          <div className="col-md-2 padding-sm">Note</div>
          <div className="col-md-2 padding-sm"></div>
        </div>
      </div>
    </li>
  }

  render() {
    var body = null;
    if (this.props.fetching) {
      body = <div style={{ padding: "20px 0px" }}><Loader isCenter={true} size="2" /></div>;
    } else {
      body = this.populateList();
      if (this.props.list.length === 0) {
        body = (
          <div className="text-muted list-empty-text">
            <i>{lang("Nothing to show here")}.</i>
          </div>
        );
      }
    }

    let btnToggleShowMore = null;
    if (this.props.list.length > this.LIMIT_SHOW_LESS) {
      btnToggleShowMore = <div
        className="lb-list-item text-left"
        style={{ padding: '5px 20px' }}>
        <a className="btn-link" onClick={this.props.toggleShowMore}>
          <small>
            <b>
              {
                this.props.isShowMore
                  ? <span><i className="fa fa-minus left"></i>{lang("Show Less")}</span>
                  : <span><i className="fa fa-plus left"></i>{lang("Show All")} ({this.props.list.length})</span>
              }
            </b>
          </small>
        </a>
      </div>;
    }

    return <div className="hall-recruiter-interview" style={{
      paddingBottom: "10px 0px",
      // borderBottom: "40px solid #f5f5f5"
    }}>
      {/* <div className="text-left lb-subtitle">
        <i className={`fa left fa-${this.props.icon}`}></i>
        {this.props.title} ({this.props.list.length})
      </div> */}
      <div className="show-on-lg-and-more">{this.getHeader()}</div>
      {body}
      {btnToggleShowMore}
    </div>;
  }
}

InterviewList.propTypes = {
};

InterviewList.defaultProps = {
};


// ##################################################################################################################
// ##################################################################################################################
// ##################################################################################################################

class HallRecruiterInterview extends React.Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.onRemoveItem = this.onRemoveItem.bind(this);
    this.FILTER_TODAY = "FILTER_TODAY";
    this.COUNTS = {};
    this.FILTERS = [
      {
        key: this.FILTER_TODAY,
        label: lang("Show Today's Only"),
        defaultChecked: false,
      },
      {
        key: PrescreenEnum.STATUS_WAIT_CONFIRM,
        label: lang("Pending"),
        defaultChecked: true,
      },
      {
        key: PrescreenEnum.STATUS_RESCHEDULE,
        label: lang("Reschedule Requested"),
        defaultChecked: true,
      },
      {
        key: PrescreenEnum.STATUS_APPROVED,
        label: lang("Confirmed"),
        defaultChecked: true,
      },
      {
        key: PrescreenEnum.STATUS_STARTED,
        label: lang("Started"),
        defaultChecked: true,
      },
      {
        key: PrescreenEnum.STATUS_ENDED,
        label: lang("Ended"),
        defaultChecked: false,
      },
      {
        key: PrescreenEnum.STATUS_REJECTED,
        label: lang("Rejected"),
        defaultChecked: true,
      }
    ]

    this.state = {
      removedId: [],
    }

    for (var i in this.FILTERS) {
      let f = this.FILTERS[i]
      this.state[f.key] = f.defaultChecked
    }

  }

  componentWillMount() {
    this.props.loadActivity();
  }

  componentDidUpdate() {
  }

  refresh() {
    this.props.loadActivity(hallAction.ActivityType.PRESCREEN);
  }
  toggleShowMore(key) {
    this.setState((prevState) => {
      let k = "is_show_more_" + key;
      let toRet = {};
      toRet[k] = prevState[k] ? false : true;
      return toRet;
    })
  }

  getFilterItem({ key, label, defaultChecked }) {
    let count = this.COUNTS[key];
    count = count ? count : 0;
    if (key == this.FILTER_TODAY) {
      count = null
    } else {
      count = ` (${count}) `;
    }

    return <div className="checkbox-style-1" style={{ marginRight: "20px" }}>
      <label className={`cb1-container medium green text-muted ${this.state[key] ? "text-bold" : ""}`}>
        {label}{count}
        <input
          disabled={false}
          className={"bsf-input"}
          type="checkbox"
          defaultChecked={this.state[key]}
          // checked={}
          data-key={key}
          onChange={(e) => {
            let key = e.currentTarget.dataset.key;
            let checked = e.currentTarget.checked;
            this.updateFilter(key, checked);
          }} />
        <span className="cb1-checkmark"></span>
      </label>
    </div>
  }
  updateFilter(key, checked) {
    this.setState((prevState) => {
      let toRet = {};
      toRet[key] = checked;
      return toRet;
    })
  }
  getFilter() {
    // return null;
    return <div className="flex-wrap-start" style={{ padding: "10px 15px" }}>
      {this.FILTERS.map((d, i) => {
        return this.getFilterItem(d);
      })}
    </div>
  }

  filterList(list) {
    let toRet = [];
    let counts = {};
    var pushed = {};
    // counts[this.FILTER_TODAY] = 0;

    const pushItem = (toRet, d) => {
      if (!pushed[d.ID]) {
        pushed[d.ID] = true;
        toRet.push(d)
      }
      return toRet;
    }

    let statusChecked = [];
    for (let key in this.state) {
      if (this.state[key] === true) {
        statusChecked.push(key);
      }
    }

    for (let i in list) {
      let d = list[i];

      if (this.state.removedId.indexOf(d.ID + "") >= 0) {
        continue;
      }

      // by status
      if (!counts[d.status]) {
        counts[d.status] = 0;
      }
      counts[d.status]++;
      if (statusChecked.indexOf(d.status) >= 0) {
        if (this.state[this.FILTER_TODAY]) {
          if (Time.isUnixToday(d.appointment_time)) {
            toRet = pushItem(toRet, d);
          }
        } else {
          toRet = pushItem(toRet, d);
        }
      }

      // by this.FILTER_TODAY
      // if (Time.isUnixToday(d.appointment_time)) {
      //   counts[this.FILTER_TODAY]++;
      //   if (this.state[this.FILTER_TODAY]) {
      //     toRet = pushItem(toRet, d);
      //   }
      // }

    }

    this.COUNTS = counts;
    return toRet;
  }
  onRemoveItem(ID) {
    this.setState((prevState) => {
      let r = this.state.removedId;
      r.push(ID);
      return { removedId: r }
    })
  }
  render() {
    var d = this.props.activity;

    // 3. list
    // let listActive = [];
    // let listPending = [];
    // let listEnded = [];
    // for (var i in d.prescreens) {

    //   let newObj = d.prescreens[i];
    //   newObj._type = hallAction.ActivityType.PRESCREEN;

    //   switch (newObj.status) {
    //     case PrescreenEnum.STATUS_WAIT_CONFIRM:
    //       listPending.push(newObj);
    //       break;
    //     case PrescreenEnum.STATUS_ENDED:
    //       listEnded.push(newObj);
    //       break;
    //     case PrescreenEnum.STATUS_REJECTED:
    //       listEnded.push(newObj);
    //       break;
    //     default:
    //       listActive.push(newObj);
    //       break;
    //   }

    // }


    // 4. fetching
    let fetching = d.fetching.prescreens;
    let list = d.prescreens
    // let grandTotal = list.length;
    list = this.filterList(list);
    // let total = list.length;

    // 5. view
    let listView = <InterviewList
      limitShowLess={50}
      toggleShowMore={() => { this.toggleShowMore("all_list") }}
      isShowMore={this.state["is_show_more_all_list"]}
      // title="My Interviews"
      // icon="star"
      online_users={this.props.online_users}
      online_companies={this.props.online_companies}
      fetching={fetching}
      list={list}
      onRemoveItem={this.onRemoveItem}
    />

    var v = <div>
      <ListBoard
        key={JSON.stringify(this.state)}
        action_icon="plus"
        action_text={lang("Schedule New Interview")}
        action_to={`browse-student`}
        icon={"video-camera"}
        title={
          <span>
            {lang("My Interviews")}
            {/* <small>{grandTotal > 0 ? ` (showing ${total}/${grandTotal}) ` : null}</small> */}
            {" "}
            <a onClick={this.refresh} className="btn-link text-bold">
              <small><i className="fa fa-refresh"></i></small>
            </a>
          </span>
        }
        filter={this.getFilter()}
        customList={listView}
      >
      </ListBoard>
    </div>

    return <div>{v}</div>;
  }
}

HallRecruiterInterview.defaultProps = {
}

HallRecruiterInterview.propTypes = {

}

// TODO status online
function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    activity: state.hall.activity,
    online_users: state.user.online_users,
    online_companies: state.user.online_companies
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadActivity: hallAction.loadActivity
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HallRecruiterInterview);
