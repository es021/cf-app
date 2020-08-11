//Faizul Here

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { Loader } from "../../../component/loader";
import obj2arg from "graphql-obj2arg";
import ProfileCard from "../../../component/profile-card.jsx";
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
import * as HallRecruiterHelper from "../hall-recruiter/hall-recruiter-helper";
import {lang} from "../../../lib/lang";

// require("../../../css/border-card.scss");

class ActvityList extends React.Component {
  constructor(props) {
    super(props);
    this.openSIForm = this.openSIForm.bind(this);
    this.cancelQueue = this.cancelQueue.bind(this);
    this.cancelJoinGroupSession = this.cancelJoinGroupSession.bind(this);
    this.updateSessionRequest = this.updateSessionRequest.bind(this);
    this.acceptRejectPrescreen = this.acceptRejectPrescreen.bind(this);
    this.confirmAcceptRejectPrescreen = this.confirmAcceptRejectPrescreen.bind(
      this
    );

    this.authUser = getAuthUser();
    this.state = {
      time: Date.now()
    };
    this.interval = null;

    // update every 30 secs
    this.UPDATE_INTERVAL = 30 * 1000;
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(() => {
        return { time: Date.now() };
      });
    }, this.UPDATE_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  cancelJoinGroupSession(e) {
    var company_name = e.currentTarget.dataset.company_name;
    var company_id = e.currentTarget.dataset.company_id;

    const id = e.currentTarget.id;
    const confirmCancel = () => {
      layoutActions.loadingBlockLoader("Canceling..");
      activityActions.cancelJoinGroupSession(id).then(
        res => {
          hallAction.storeLoadActivity([
            hallAction.ActivityType.GROUP_SESSION_JOIN
          ]);
          layoutActions.storeHideBlockLoader();

          emitQueueStatus(
            company_id,
            this.authUser.ID,
            "cancelJoinGroupSession"
          );
          emitHallActivity(
            hallAction.ActivityType.GROUP_SESSION_JOIN,
            null,
            company_id
          );
        },
        err => {
          layoutActions.errorBlockLoader(err);
        }
      );
    };

    layoutActions.confirmBlockLoader(
      `Canceling RSVP for live session with ${company_name}?`,
      confirmCancel
    );
  }

  getRemoveButton(hasRemove, entity, entity_id) {
    if (!hasRemove) {
      return null;
    }

    const onClickRemove = e => {
      let entity = e.currentTarget.dataset.entity;
      let entity_id = e.currentTarget.dataset.entity_id;

      let ins = {};
      ins[EntityRemoved.ENTITY] = entity;
      ins[EntityRemoved.ENTITY_ID] = Number.parseInt(entity_id);
      ins[EntityRemoved.USER_ID] = this.authUser.ID;
      let q = `mutation { add_entity_removed (${obj2arg(ins, {
        noOuterBraces: true
      })})
                { ID } }`;

      let parentButton = e.currentTarget.parentNode;
      let parentPcBody = parentButton.parentNode;
      let parentCard = parentPcBody.parentNode;
      parentCard.className = parentCard.className += "profile-card-hidden";
      //console.log(parentCard);
      setTimeout(() => {
        parentCard.hidden = true;
      }, 700);
      getAxiosGraphQLQuery(q).then(data => { });
    };

    return (
      <div
        onClick={e => {
          onClickRemove(e);
        }}
        data-entity={entity}
        data-entity_id={entity_id}
        className="btn btn-link btn-delete-card"
      >
        <i className="fa fa-times" />
      </div>
    );
  }

  cancelQueue(e) {
    var company_name = e.currentTarget.dataset.company_name;
    var company_id = e.currentTarget.dataset.company_id;

    const id = e.currentTarget.id;
    const confirmCancelQueue = () => {
      layoutActions.loadingBlockLoader("Canceling Queue..");
      activityActions.cancelQueue(id).then(
        res => {
          hallAction.storeLoadActivity([hallAction.ActivityType.QUEUE]);
          layoutActions.storeHideBlockLoader();

          emitQueueStatus(company_id, this.authUser.ID, "cancelQueue");
          emitHallActivity(hallAction.ActivityType.QUEUE, null, company_id);
        },
        err => {
          layoutActions.errorBlockLoader(err);
        }
      );
    };

    layoutActions.confirmBlockLoader(
      `Canceling Queue for ${company_name}`,
      confirmCancelQueue
    );
  }

  // open form,
  // once completed update to approve
  openSIForm(sr_id, student_id) {
    openSIAddForm(
      student_id,
      this.authUser.rec_company,
      PrescreenEnum.ST_INTV_REQUEST,
      d => {
        this.updateSessionRequest(sr_id, SessionRequestEnum.STATUS_APPROVED);
      }
    );
  }

  updateSessionRequest(id, status) {
    layoutActions.loadingBlockLoader("Updating Session Request Status..");
    activityActions.updateSessionRequest(id, status).then(
      res => {
        var toRefresh = [hallAction.ActivityType.SESSION_REQUEST];
        if (status == SessionRequestEnum.STATUS_APPROVED) {
          toRefresh.push(hallAction.ActivityType.PRESCREEN);
        }

        hallAction.storeLoadActivity(toRefresh);
        layoutActions.storeHideBlockLoader();

        //emitQueueStatus(company_id, this.authUser.ID, "cancelQueue");

        var sid = isRoleStudent() ? null : res.student_id;
        var cid = isRoleRec() ? null : res.company_id;
        emitHallActivity(hallAction.ActivityType.SESSION_REQUEST, sid, cid);
      },
      err => {
        layoutActions.errorBlockLoader(err);
      }
    );
  }

  // for reject and cancel
  // trigger from card view button
  confirmUpdateSessionRequest(e, status) {
    var other_name = e.currentTarget.dataset.other_name;
    var other_id = e.currentTarget.dataset.other_id;
    var id = e.currentTarget.id;

    const confirmUpdate = () => {
      this.updateSessionRequest(id, status);
    };

    // create confirm message
    var mes = "";
    if (status === SessionRequestEnum.STATUS_CANCELED) {
      mes += "Canceling";
    }
    if (status === SessionRequestEnum.STATUS_REJECTED) {
      mes += "Rejecting";
    }
    if (status === SessionRequestEnum.STATUS_PENDING) {
      mes += "Canceling Rejection ";
    }

    mes += ` Interview Request for ${other_name}`;

    layoutActions.confirmBlockLoader(mes, confirmUpdate);
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

  createSession(e) {
    var invalid = activityActions.invalidSession();

    if (invalid !== false) {
      layoutActions.errorBlockLoader(invalid);
      return false;
    }

    var host_id = getAuthUser().ID;
    var participant_id = e.currentTarget.dataset.pid;
    var entity = e.currentTarget.dataset.entity;
    var entity_id = e.currentTarget.dataset.entity_id;

    layoutActions.loadingBlockLoader("Creating Session..");
    activityActions
      .createSession(host_id, participant_id, entity, entity_id)
      .then(
        res => {
          var m = (
            <div>
              Session Successfully Created
              <br />
              <NavLink
                onClick={() => layoutActions.storeHideBlockLoader()}
                to={`${RootPath}/app/session/${res.data.ID}`}
              >
                Go To Session
              </NavLink>
            </div>
          );

          if (entity === hallAction.ActivityType.QUEUE) {
            emitQueueStatus(
              getAuthUser().rec_company,
              participant_id,
              "cancelQueue"
            );
          }

          emitHallActivity(
            [hallAction.ActivityType.SESSION, entity],
            participant_id,
            null
          );

          layoutActions.successBlockLoader(m);
          hallAction.storeLoadActivity([
            hallAction.ActivityType.SESSION,
            entity
          ]);
        },
        err => {
          var m = "";
          switch (err.response.data) {
            case ActivityAPIErr.HAS_SESSION:
              m = "This student is currently engaged";
              break;
          }

          layoutActions.errorBlockLoader(m);
        }
      );
  }

  // ##########################
  // for prescreen

  acceptRejectPrescreen(id, user_id, status) {
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

        //emitQueueStatus(company_id, this.authUser.ID, "cancelQueue");

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
  confirmAcceptRejectPrescreen(e, status) {
    var other_name = e.currentTarget.dataset.other_name;
    var id = e.currentTarget.id;
    var user_id = this.authUser.ID;

    const confirmUpdate = () => {
      this.acceptRejectPrescreen(id, user_id, status);
    };

    // create confirm message
    var mes = "";
    if (status === PrescreenEnum.STATUS_APPROVED) {
      mes += "Accepting";
      mes += ` Interview Call with ${other_name} ?`;
    }
    if (status === PrescreenEnum.STATUS_REJECTED) {
      mes += "Rejecting";
      mes += ` Interview Call with ${other_name} ?`;
    }
    if (status === PrescreenEnum.STATUS_RESCHEDULE) {
      mes += "Requesting For Reschedule";
      mes += ` with ${other_name} ?`;
    }

    layoutActions.confirmBlockLoader(mes, confirmUpdate);
  }

  getTimeStrNew(unixtime, showTimeOnly, customText) {
    // debug
    //unixtime = (1552804854865/1000) + 500;
    // const className = "time-container";
    // if (
    //   unixtime === undefined &&
    //   showTimeOnly === undefined &&
    //   customText !== undefined
    // ) {
    //   return <div className={className}>{customText}</div>;
    // }

    let timeStr = Time.getString(unixtime);
    timeStr = <span className="text-muted"><i className="fa fa-clock-o left"></i>{timeStr}<br></br>(local time)</span>;

    return timeStr;

    // if (showTimeOnly) {
    //   return <div>{timeStr}</div>;
    // }

    // let passedText = "Waiting For Recruiter";
    // let happeningIn = Time.getHapenningIn(unixtime, {
    //   passedText: isRoleStudent() ? passedText : null,
    //   startCountMinute: 24 * 60 // 24 hours
    // });

    // if (happeningIn != null) {
    //   if (happeningIn != passedText) {
    //     happeningIn = <span>Starting In {happeningIn}</span>;
    //   }
    //   happeningIn = (
    //     <div
    //       style={{ marginBottom: "-6px", fontWeight: "bold" }}
    //       className="text-primary"
    //     >
    //       {happeningIn}
    //     </div>
    //   );
    //   return (
    //     <span>
    //       {happeningIn}
    //       <br />
    //       {timeStr}
    //     </span>
    //   );
    // } else {
    //   return timeStr;
    // }
  }

  addRemoveButton(body, hasRemove, removeEntity, removeEntityId) {
    body = (
      <div>
        {this.getRemoveButton(hasRemove, removeEntity, removeEntityId)}
        {body}
      </div>
    );

    return body;
  }

  // return body n subtitle
  // renderGroupSessionJoin(d, obj, title) {
  //   // 2. subtitle and body
  //   var subtitle = null;
  //   //var crtSession = null;
  //   var hasRemove = null;
  //   var removeEntity = null;
  //   var removeEntityId = null;
  //   var body = null;

  //   if (isRoleStudent()) {
  //     // if (d.title != null && d.title != "") {
  //     //   title = <small>{d.title}</small>;
  //     // } else {
  //     //   //title = <small>Group Session with {title}</small>;
  //     // }
  //     // title = <b>{title}</b>;

  //     var hasStart = false;
  //     //if (!d.is_expired && d.join_url != "" && d.join_url != null) {
  //     if (Time.getUnixTimestampNow() >= d.start_time) {
  //       hasStart = true;
  //       //subtitle = "Video Call Has Started";
  //       subtitle = this.getTimeStrNew(d.start_time, true);
  //     } else {
  //       if (d.is_canceled || d.is_expired) {
  //         subtitle = this.getTimeStrNew(d.start_time, true);
  //       } else {
  //         subtitle = this.getTimeStrNew(d.start_time, false);
  //       }
  //     }

  //     const isExpiredHandler = () => {
  //       var mes = (
  //         <div>
  //           Unable to join.
  //           <br />
  //           This group session has ended.
  //         </div>
  //       );
  //       layoutActions.errorBlockLoader(mes);
  //       var q = `mutation {edit_group_session(ID:${d.ID}, is_expired:1){ID}}`;
  //       getAxiosGraphQLQuery(q).then(res => {
  //         hallAction.storeLoadActivity([
  //           hallAction.ActivityType.GROUP_SESSION_JOIN
  //         ]);
  //       });
  //     };

  //     var btnJoin = (
  //       <a
  //         onClick={() => {
  //           //joinVideoCall(d.join_url, null, isExpiredHandler, d.ID)
  //           openLiveSession(d.company.ID);
  //         }}
  //         className="btn btn-sm btn-blue"
  //       >
  //         Join Video Call
  //       </a>
  //     );

  //     const openNotificationStart_GS = () => {
  //       // block loader to inform the video call has started
  //       // if time updated is less than bufferMin
  //       var bufferMin = 2;
  //       var diff =
  //         Time.getUnixTimestampNow() - Time.convertDBTimeToUnix(d.updated_at);
  //       if (diff <= bufferMin * 60) {
  //         var popupBody = (
  //           <div>
  //             <br />
  //             Group session with
  //             <br />
  //             <b>{obj.name}</b>
  //             <br />
  //             has started
  //             <br /> <br />
  //             {btnJoin}
  //           </div>
  //         );
  //         var notiId = `group-session-${d.ID}`;
  //         showNotification(notiId, popupBody);
  //       }
  //     };
  //     let isGsHasRemove = false;
  //     if (d.is_canceled) {
  //       body = (
  //         <button disabled="disabled" className="btn btn-sm btn-danger">
  //           Canceled
  //         </button>
  //       );
  //       isGsHasRemove = true;
  //     } else if (d.is_expired) {
  //       body = (
  //         <button disabled="disabled" className="btn btn-sm btn-danger">
  //           Ended
  //         </button>
  //       );
  //       isGsHasRemove = true;
  //     } else {
  //       if (hasStart) {
  //         openNotificationStart_GS();
  //         body = <div>{btnJoin}</div>;
  //       } else {
  //         body = (
  //           <div
  //             id={d.join_id}
  //             data-company_id={obj.ID}
  //             data-company_name={obj.name}
  //             onClick={this.cancelJoinGroupSession.bind(this)}
  //             className="btn btn-sm btn-primary"
  //           >
  //             Cancel RSVP
  //           </div>
  //         );
  //       }
  //     }

  //     if (isGsHasRemove) {
  //       hasRemove = true;
  //       removeEntity = GroupSessionJoin.TABLE;
  //       removeEntityId = d.join_id;
  //     }
  //   }

  //   body = this.addRemoveButton(body, hasRemove, removeEntity, removeEntityId);

  //   let topLabel = (
  //     <div className="label label-success">
  //       <i className="fa fa-users left" />
  //       Live Session
  //     </div>
  //   );

  //   return {
  //     body: body,
  //     subtitle: subtitle,
  //     title: title,
  //     topLabel: topLabel,
  //     topLabelClass: "success"
  //   };
  // }

  // return body n subtitle
  renderPreScreen(d, obj, title) {
    // 2. subtitle and body
    var time = null;
    var action = null;
    var hasRemove = null;
    var removeEntity = null;
    var removeEntityId = null;

    let btnJoinVCall = null;
    var btnStartVCall = null;
    // var btnEndedVCall = null;
    var btnAcceptReject = null;

    if (
      d.status == PrescreenEnum.STATUS_REJECTED ||
      d.status == PrescreenEnum.STATUS_ENDED
    ) {
      time = this.getTimeStrNew(d.appointment_time, true);
    } else {
      time = this.getTimeStrNew(d.appointment_time, false);
    }

    //body = <div style={{ height: "30px" }}></div>;
    var ps_type =
      d.special_type == null || d.special_type == ""
        ? PrescreenEnum.ST_PRE_SCREEN
        : d.special_type;

    if (isNormalSI(ps_type)) {
      ps_type = "Scheduled Session";
    }

    // label for status
    // New SI Flow
    var statusObj = {};
    switch (d.status) {
      case PrescreenEnum.STATUS_WAIT_CONFIRM:
        statusObj = HallRecruiterHelper.Status.STATUS_WAIT_CONFIRM
        btnAcceptReject = (
          <div>
            <div
              id={d.ID}
              data-other_id={obj.ID}
              data-other_name={obj.name}
              onClick={e => {
                this.confirmAcceptRejectPrescreen(
                  e,
                  PrescreenEnum.STATUS_APPROVED
                );
              }}
              className="btn btn-block btn-sm btn-bold btn-round-5 btn-blue-light"
            >
              Accept Interview
              </div>
            <div
              id={d.ID}
              data-other_id={obj.ID}
              data-other_name={obj.name}
              onClick={e => {
                this.confirmAcceptRejectPrescreen(
                  e,
                  PrescreenEnum.STATUS_RESCHEDULE
                );
              }}
              className="btn btn-block btn-sm btn-bold btn-round-5 btn-yellow"
            >
              Request For Reschedule
              </div>
            <div
              id={d.ID}
              data-other_id={obj.ID}
              data-other_name={obj.name}
              onClick={e => {
                this.confirmAcceptRejectPrescreen(
                  e,
                  PrescreenEnum.STATUS_REJECTED
                );
              }}
              className="btn btn-block btn-sm btn-bold btn-round-5 btn-red"
            >
              Reject Interview
              </div>
          </div>
        );
        break;
      case PrescreenEnum.STATUS_RESCHEDULE:
        statusObj = HallRecruiterHelper.Status.STATUS_RESCHEDULE;
        break;
      case PrescreenEnum.STATUS_REJECTED:
        statusObj = HallRecruiterHelper.Status.STATUS_REJECTED
        //crtSession = null;
        hasRemove = true;
        removeEntity = Prescreen.TABLE;
        removeEntityId = d.ID;
        break;
      case PrescreenEnum.STATUS_APPROVED:
        statusObj = HallRecruiterHelper.Status.STATUS_APPROVED
        break;
      case PrescreenEnum.STATUS_ENDED:
        statusObj = HallRecruiterHelper.Status.STATUS_ENDED
        // btnEndedVCall = (
        //   <div
        //     className="action btn btn-danger btn-sm"
        //     disabled="disabled">
        //     Ended
        //   </div>
        // );
        ///crtSession = null;
        hasRemove = true;
        removeEntity = Prescreen.TABLE;
        removeEntityId = d.ID;
        break;
      case PrescreenEnum.STATUS_STARTED:
        statusObj = HallRecruiterHelper.Status.STATUS_STARTED
        let isExpiredHandler = () => {
          var mes = (
            <div>
              Unable to join.
              <br />
              This 1-1 session has ended.
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
          // time = this.getTimeStrNew(
          //   undefined,
          //   undefined,
          //   "Video Call Has Started"
          // );
        } else {
          if (d.is_expired) {
            time = this.getTimeStrNew(d.appointment_time, true);
          } else {
            time = this.getTimeStrNew(d.appointment_time, false);
          }
        }
        if (hasStart) {
          // bukak join url
          btnJoinVCall = (
            <a
              onClick={() =>
                joinVideoCall(d.join_url, null, isExpiredHandler, null, d.ID)
              }
              className="btn btn-block btn-sm btn-bold btn-round-5 btn-green"
            >
              <i className="fa fa-sign-in left"></i>
              {lang("Join Video Call")}
            </a>
          );

          const openNotificationStart_PS = () => {
            // block loader to inform the video call has started
            // if time updated is less than bufferMin
            var bufferMin = 2;
            var diff =
              Time.getUnixTimestampNow() -
              Time.convertDBTimeToUnix(d.updated_at);
            if (diff <= bufferMin * 60) {
              var popupBody = (
                <div>
                  <br />
                  1-1 session with
                  <br />
                  <b>{obj.name}</b>
                  <br />
                  has started
                  <br />
                  <br />
                  {btnJoinVCall}
                </div>
              );
              var notiId = `pre-screen-${d.ID}`;
              showNotification(notiId, popupBody);
            }
          };
          openNotificationStart_PS();
        }
        break;
    }

    action = []
    if (d.status == PrescreenEnum.STATUS_WAIT_CONFIRM) {
      action.push(btnAcceptReject);
    }
    if (d.status == PrescreenEnum.STATUS_STARTED) {
      action.push(btnJoinVCall);
    }

    // action = this.addRemoveButton(action, hasRemove, removeEntity, removeEntityId);

    time = <div>{time}</div>

    return {
      title: title,
      time: time,
      action: action,
      statusObj: statusObj
    };
  }

  render() {
    var body = null;
    if (this.props.fetching) {
      body = <Loader isCenter={true} size="2" />;
    } else {
      body = this.props.list.map((d, i) => {
        var obj = d.company;
        if (typeof obj === "undefined") {
          return false;
        }
        var title = obj.name
        var objRender = null;
        let _type = d._type;
        switch (_type) {
          // #############################################################
          // Scheduled Session Card View
          case hallAction.ActivityType.PRESCREEN:
            objRender = this.renderPreScreen(d, obj, title);
            break;
        }

        // var img_position = isRoleRec() ? obj.img_pos : obj.img_position;
        let isOnlineCard = false;
        if (isRoleRec()) {
          isOnlineCard = isUserOnline(this.props.online_users, obj.ID);
        }
        if (isRoleStudent()) {
          isOnlineCard = isCompanyOnline(this.props.online_companies, obj.ID);
        }
        let img = <ProfileCard
          type="company"
          isOnline={isOnlineCard}
          img_url={obj.img_url}
          img_pos={obj.img_pos}
          img_size={obj.img_size}
          img_dimension={"65px"}
          className={" with-border"}
          body={null}
        />
        let details = <div>
          <b style={{ fontSize: "16px" }}>{objRender.title}</b>
          {objRender.time}
        </div>
        let action = objRender.action;
        let status = HallRecruiterHelper.getStatusElement(d, objRender.statusObj);

        return <div className={`student-interview type-${this.props.view_type}`}
          style={{ width: this.props.isFullWidth ? "100%" : "180px" }}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-2 sinv-image">{img}</div>
              {/* <div className="col-md-1 sinv-image">{status}</div> */}
              <div className="break-15-on-md-and-less"></div>
              <div className="col-md-5  text-left sinv-detail">{details}</div>
              <div className="break-15-on-md-and-less"></div>
              <div className="col-md-5  sinv-action">{action.length > 0 ? action : status}</div>
            </div>
          </div>
        </div>

        // return (
        //   <ProfileListItem
        //     isOnline={isOnlineCard}
        //     className=""
        //     //header={labelType}
        //     list_type="card"
        //     img_url={obj.img_url}
        //     custom_width={custom_width}
        //     img_pos={img_position}
        //     img_size={obj.img_size}
        //     img_dimension="50px"
        //     title={title}
        //     // body={body}
        //     // subtitle={subtitle}
        //     type="recruiter"
        //     key={i}
        //   />
        // );
      });

      if (this.props.list.length === 0) {
        body = (
          <div className="text-muted">
            <i>{lang("Nothing to show here")}</i>
          </div>
        );
      }
    }

    return <div className="flex-wrap">{body}</div>;
  }
}

ActvityList.propTypes = {
  isFullWidth: PropTypes.bool,
  noBorderCard: PropTypes.bool,
  type: PropTypes.oneOf([
    hallAction.ActivityType.SESSION,
    hallAction.ActivityType.QUEUE,
    hallAction.ActivityType.PRESCREEN
  ]).isRequired,
  title: PropTypes.string.isRequired,
  view_type: PropTypes.string,
  subtitle: PropTypes.string,
  bc_type: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  fetching: PropTypes.bool.isRequired,
  online_users: PropTypes.object.isRequired,
  online_companies: PropTypes.object.isRequired
};

ActvityList.defaultProps = {
  noBorderCard: false,
  subtitle: null
};

// ##################################################################################################################
// ##################################################################################################################
// ##################################################################################################################

export class ActivitySingle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {}
    };
  }
  componentWillMount() {
    this.loadData();
  }
  loadData() {
    let entity = null;
    switch (this.props.type) {
      case hallAction.ActivityType.PRESCREEN:
        entity = "prescreen";
        break;
    }
    if (entity == null) {
      this.setState(prevState => {
        return { loading: false };
      });
    } else {
      let q = ` query {${entity} (ID:${
        this.props.id
        }){ ${hallAction.getActivityQueryAttr(this.props.type)} } }`;
      getAxiosGraphQLQuery(q).then(res => {
        this.setState(prevState => {
          return { data: res.data.data[entity], loading: false };
        });
      });
    }
  }
  render() {
    let v = null;
    if (this.state.loading) {
      v = <Loader size="2" />;
    } else {
      let list = [this.state.data];
      v = (
        <ActvityList
          bc_type="vertical"
          online_users={{}}
          fetching={false}
          type={this.props.type}
          title={null}
          subtitle={null}
          list={list}
        />
      );
    }
    return v;
  }
}
ActivitySingle.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired
};

// ##################################################################################################################
// ##################################################################################################################
// ##################################################################################################################

const sec = "act-sec";
class ActivitySection extends React.Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
  }

  componentWillMount() {
    this.props.loadActivity();
  }

  componentDidUpdate() {
  }

  refresh(type) {
    this.props.loadActivity(type);
  }

  createTitleWithTooltip(title, tooltip = null) {
    return (
      <span>
        {title}
        {tooltip != null ? (
          <Tooltip
            debug={false}
            bottom="22px"
            content={
              <small>
                {" "}
                <i className="fa fa-question-circle" />
              </small>
            }
            tooltip={tooltip}
          />
        ) : null}
      </span>
    );
  }

  render() {
    // var d = this.props.activity;

    // var subtitle_p = null;

    // var tt_p = isRoleStudent()
    //   ? "Upcoming one-to-one sessions will be shown here. Check your email for confirmation."
    //   : "You can schedule private sessions with students through Student Listing page";
    // var title_p = this.createTitleWithTooltip(
    //   <a onClick={() => this.refresh(hallAction.ActivityType.PRESCREEN)}>
    //     Private Session{/* Scheduled Private Session */}
    //   </a>,
    //   tt_p
    // );

    // var tt_gs =
    //   "Upcoming group session that you signed up for will be shown here.";
    // var title_gs = this.createTitleWithTooltip(
    //   <a
    //     onClick={() => this.refresh(hallAction.ActivityType.GROUP_SESSION_JOIN)}
    //   >
    //     Group Session
    //   </a>,
    //   tt_gs
    // );
    // var subtitle_gs = null;

    // var size_p = isRoleRec() ? "12" : "12";

    //Group Session
    // var gs =
    //   <ActvityList
    //     bc_type="vertical"
    //     online_users={this.props.online_users}
    //     fetching={d.fetching.group_session_joins}
    //     type={hallAction.ActivityType.GROUP_SESSION_JOIN}
    //     title={title_gs}
    //     subtitle={subtitle_gs}
    //     list={d.group_session_joins}></ActvityList>

    // //Scheduled Session
    // var p = (
    //   <ActvityList
    //     bc_type="vertical"
    //     online_users={this.props.online_users}
    //     fetching={d.fetching.prescreens}
    //     type={hallAction.ActivityType.PRESCREEN}
    //     title={title_p}
    //     subtitle={subtitle_p}
    //     list={d.prescreens}
    //   />
    // );

    // ############################3
    // Gabung ps and gs

    // 1. title
    // var title = this.createTitleWithTooltip(
    //   <a
    //     onClick={() => {
    //       let toRefresh = [hallAction.ActivityType.PRESCREEN];
    //       if (isRoleStudent()) {
    //         toRefresh.push(hallAction.ActivityType.GROUP_SESSION_JOIN);
    //       }
    //       this.refresh(toRefresh);
    //     }}
    //   >
    //     My Activity
    //   </a>,
    //   "You can access your private call and live call here"
    // );

    // // 2. subtitle
    // var subtitle = null;

    var d = this.props.activity;

    // 3. list
    let list = [];
    for (var i in d.prescreens) {
      if (i >= this.props.limitLoad) {
        break;
      }
      let newObj = d.prescreens[i];
      newObj._type = hallAction.ActivityType.PRESCREEN;
      list.push(newObj);
    }
    //// 3.b  add live call (for student only)
    // if (isRoleStudent()) {
    //   for (var i in d.group_session_joins) {
    //     let newObj = d.group_session_joins[i];
    //     newObj._type = hallAction.ActivityType.GROUP_SESSION_JOIN;
    //     list.push(newObj);
    //   }
    // }

    // 4. fetching
    let fetching = d.fetching.prescreens;
    // if (isRoleStudent()) {
    //   fetching = d.fetching.prescreens || d.fetching.group_session_joins;
    // } else {
    //   fetching = d.fetching.prescreens;
    // }

    // 5. view
    var ps_gs = (
      <ActvityList
        view_type={this.props.type}
        isFullWidth={this.props.isFullWidth}
        limitLoad={this.props.limitLoad}
        noBorderCard={true}
        bc_type="vertical"
        online_users={this.props.online_users}
        online_companies={this.props.online_companies}
        fetching={fetching}
        type={null}
        title={""}
        subtitle={""}
        list={list}
      />
    );

    // todos
    return <div>{ps_gs}</div>;
  }
}

ActivitySection.defaultProps = {
  limitLoad: PropTypes.number,
  isFullWidth: PropTypes.bool,
  type: PropTypes.string,
}

ActivitySection.propTypes = {
  type: "card"
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

export default connect(mapStateToProps, mapDispatchToProps)(ActivitySection);
