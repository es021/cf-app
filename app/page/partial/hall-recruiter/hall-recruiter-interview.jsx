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
import ToogleTimezone from "../../../component/toggle-timezone";
import { openLiveSession } from "../hall/live-session";
import { addLog } from "../../../redux/actions/other-actions";
import ListBoard from "../../../component/list-board";

// require("../../../css/border-card.scss");

class InterviewList extends React.Component {
  constructor(props) {
    super(props);
    this.updatePrescreen = this.updatePrescreen.bind(this);
    this.confirmUpdatePrescreen = this.confirmUpdatePrescreen.bind(
      this
    );
    this.LIMIT_SHOW_LESS = 2;
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


  getRemoveButton(entity, entity_id) {
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
      <button
        onClick={e => {
          onClickRemove(e);
        }}
        data-entity={entity}
        data-entity_id={entity_id}
        className="btn btn-sm btn-gray btn-round-5 btn-block"
      >
        <i className="fa fa-trash left"></i>Remove Card
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
      mes += "Ending";
    }
    if (status === PrescreenEnum.STATUS_APPROVED) {
      mes += "Approving";
    }
    if (status === PrescreenEnum.STATUS_REJECTED) {
      mes += "Rejecting";
    }

    mes += ` Scheduled Call with ${other_name} ?`;
    layoutActions.confirmBlockLoader(mes, confirmUpdate);
  }


  getTimeStrNew(unixtime, showTimeOnly, customText) {
    // debug
    //unixtime = (1552804854865/1000) + 500;
    const className = "time-container";
    if (
      unixtime === undefined &&
      showTimeOnly === undefined &&
      customText !== undefined
    ) {
      return <div className={className}>{customText}</div>;
    }

    let include_timezone = true;
    let timeStr = Time.getString(unixtime, include_timezone);
    timeStr = <span><i className="fa fa-clock-o left"></i>{timeStr}</span>
    if (showTimeOnly) {
      return <div>{timeStr}</div>;
    }

    let passedText = "Waiting For Recruiter";
    let happeningIn = Time.getHapenningIn(unixtime, {
      passedText: isRoleStudent() ? passedText : null,
      startCountMinute: 24 * 60 // 24 hours
    });

    if (happeningIn != null) {
      if (happeningIn != passedText) {
        happeningIn = <span>Starting In {happeningIn}</span>;
      }
      happeningIn = (
        <div
          style={{ marginBottom: "-6px", fontWeight: "bold" }}
          className="text-primary"
        >
          {happeningIn}
        </div>
      );
      return (
        <span>
          {happeningIn}
          <br />
          {timeStr}
        </span>
      );
    } else {
      return timeStr;
    }
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
    var status_text = null;
    var status_text_color = null;
    var removeEntity = null;
    var removeEntityId = null;

    let btnJoinVCall = null;
    var btnStartVCall = null;
    var btnRemoveVCall = null;
    var btnEndVCall = null;
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

    switch (d.status) {
      case PrescreenEnum.STATUS_WAIT_CONFIRM:
        // New Flow
        if (isRoleStudent()) {
          btnAcceptReject = (
            <div>
              <div
                id={d.ID}
                data-other_id={obj.ID}
                data-other_name={obj.name}
                onClick={e => {
                  this.confirmUpdatePrescreen(
                    e,
                    PrescreenEnum.STATUS_APPROVED
                  );
                }}
                className="btn btn-sm btn-success"
              >
                Accept Interview
              </div>

              <div
                id={d.ID}
                data-other_id={obj.ID}
                data-other_name={obj.name}
                onClick={e => {
                  this.confirmUpdatePrescreen(
                    e,
                    PrescreenEnum.STATUS_REJECTED
                  );
                }}
                className="btn btn-sm btn-danger"
              >
                Reject Interview
              </div>
            </div>
          );
        }
        if (isRoleRec()) {
          status_text = "Waiting confirmation from student";
          status_text_color = "rgb(135, 107, 0)";
          //crtSession = null;
        }
        break;
      case PrescreenEnum.STATUS_REJECTED:
        status_text = "Interview rejected";
        status_text_color = "red"; 
        //crtSession = null;
        removeEntity = Prescreen.TABLE;
        removeEntityId = d.ID;
        btnRemoveVCall = this.getRemoveButton(removeEntity, removeEntityId);
        break;
      case PrescreenEnum.STATUS_APPROVED:
        if (isRoleRec()) {
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
                className="btn btn-sm btn-gray btn-round-5 btn-block"
              >
                <i className="fa fa-video-camera left"></i>Start Video Call
              </div>
            );
          }
          break;
        }

        status_text = "Accepted";
        break;
      case PrescreenEnum.STATUS_ENDED:
        // btnRemoveVCall = (
        //   <div className="action btn btn-danger btn-sm" disabled="disabled">
        //     Ended
        //   </div>
        // );

        removeEntity = Prescreen.TABLE;
        removeEntityId = d.ID;
        btnRemoveVCall = this.getRemoveButton(removeEntity, removeEntityId);


        break;
      case PrescreenEnum.STATUS_STARTED:
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
          status_text = "Video call started";
          status_text_color = "#17a917";

        } else {
          if (d.is_expired) {
            time = this.getTimeStrNew(d.appointment_time, true);
          } else {
            time = this.getTimeStrNew(d.appointment_time, false);
          }
        }
        if (hasStart && isRoleStudent()) {
          // bukak join url
          btnJoinVCall = (
            <a
              onClick={() =>
                joinVideoCall(d.join_url, null, isExpiredHandler, null, d.ID)
              }
              className="btn btn-sm btn-gray btn-round-5 btn-block"
            >
              <i className="fa fa-sign-in left"></i>Join Video Call
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
        if (hasStart && isRoleRec()) {
          // bukak start url
          rejoinLink = <div>
            <a
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
              className="action btn-link"
            >
              <b>Click Here To Rejoin Video Call</b>
            </a>
          </div>

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
              className="btn btn-sm btn-gray btn-round-5 btn-block"
            >
              <i className="fa fa-times left"></i>End Video Call
              </div>
          );
        }

        break;
    }

    // finalize action
    action = [
      btnStartVCall,
      btnEndVCall,
      d.status == PrescreenEnum.STATUS_WAIT_CONFIRM ? btnAcceptReject : null,
      d.status == PrescreenEnum.STATUS_STARTED ? btnJoinVCall : null,
      d.status == PrescreenEnum.STATUS_ENDED || PrescreenEnum.STATUS_REJECTED ? btnRemoveVCall : null,
    ]

    // finalize status
    status = status_text == null ? null :
      <div style={{color:status_text_color}}>
        <i className="fa fa-info-circle left" ></i>
        {status_text}
      </div>;

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
      );

      var objRenderHelper = this.renderHelper(d, obj);
      var action = objRenderHelper.action;
      var time = objRenderHelper.time;
      var status = objRenderHelper.status;
      var rejoinLink = objRenderHelper.rejoinLink;

      // var img_position = isRoleRec() ? obj.img_pos : obj.img_position;
      let isOnlineCard = false;
      if (isRoleRec()) {
        isOnlineCard = isUserOnline(this.props.online_users, obj.ID);
      }
      if (isRoleStudent()) {
        isOnlineCard = isCompanyOnline(this.props.online_companies, obj.ID);
      }

      /**
       * <div className="flex-start">
          <div className="flex-grow-2" style={{ padding: "10px 17px" }}>
            <div>{title}</div>
            <div className="text-muted"><small>{time}</small></div>
            {
              status
                ? <div className="text-muted"><small>{status}</small></div>
                : null
            }
            {
              rejoinLink
                ? <div className="text-muted" style={{ marginTop: "5px" }}><small>{rejoinLink}</small></div>
                : null
            }
          </div>
          <div className="flex-grow-1 flex-self-center-start">
            {action}
          </div>
        </div>
       */
      return <li
        className="lb-list-item text-left">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-8 no-padding">
              {/* left */}
              <div style={{ padding: "10px 17px" }}>
                <div>{title}</div>
                <div className="text-muted"><small>{time}</small></div>
                {
                  status
                    ? <div className="text-muted"><small>{status}</small></div>
                    : null
                }
                {
                  rejoinLink
                    ? <div className="text-muted" style={{ marginTop: "5px" }}><small>{rejoinLink}</small></div>
                    : null
                }
              </div>
            </div>
            {/* right */}
            <div className="col-sm-4 no-padding">
              <div style={{ textAlign:"left", margin: "auto", margin: "10px 17px", marginBottom : "17px" }}>
                {action}
              </div>

            </div>

          </div>
        </div>

      </li>

      // return (<li>
      //   <ProfileListItem
      //     isOnline={isOnlineCard}
      //     className=""
      //     //header={labelType}
      //     title={title}
      //     list_type="card"
      //     img_url={obj.img_url}
      //     custom_width={custom_width}
      //     img_pos={img_position}
      //     img_size={obj.img_size}
      //     img_dimension="50px"
      //     body={body}
      //     badge={badge}
      //     badge_tooltip={badge_tooltip}
      //     subtitle={subtitle}
      //     type="recruiter"
      //     key={i}
      //   />
      //   );
      // </li>

    });
  }
  render() {
    var body = null;
    if (this.props.fetching) {
      body = <Loader isCenter={true} size="2" />;
    } else {
      body = this.populateList();
      if (this.props.list.length === 0) {
        body = (
          <div className="text-muted" style={{ padding: "15px 5px" }}>
            <i>Nothing to show here</i>
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
                  ? <span><i className="fa fa-minus left"></i>Show Less</span>
                  : <span><i className="fa fa-plus left"></i>Show More</span>
              }
            </b>
          </small>
        </a>
      </div>;
    }


    return <div style={{
      paddingBottom: "10px 0px",
      borderBottom: "20px solid #f5f5f5"
    }}>
      <div className="text-left lb-subtitle">
        <i className={`fa left fa-${this.props.icon}`}></i>
        {this.props.title} ({this.props.list.length})
      </div>
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

const sec = "act-sec";
class HallRecruiterInterview extends React.Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);

    this.state = {
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

  render() {
    var d = this.props.activity;

    // 3. list
    let listActive = [];
    let listPending = [];
    let listEnded = [];
    for (var i in d.prescreens) {

      let newObj = d.prescreens[i];
      newObj._type = hallAction.ActivityType.PRESCREEN;

      switch (newObj.status) {
        case PrescreenEnum.STATUS_WAIT_CONFIRM:
          listPending.push(newObj);
          break;
        case PrescreenEnum.STATUS_ENDED:
          listEnded.push(newObj);
          break;
        case PrescreenEnum.STATUS_REJECTED:
          listEnded.push(newObj);
          break;
        default:
          listActive.push(newObj);
          break;
      }

    }


    // 4. fetching
    let fetching = d.fetching.prescreens;

    // 5. view
    let list = <div>
      <InterviewList
        toggleShowMore={() => { this.toggleShowMore("active") }}
        isShowMore={this.state["is_show_more_active"]}
        title="Active Interviews"
        icon="star"
        online_users={this.props.online_users}
        online_companies={this.props.online_companies}
        fetching={fetching}
        list={listActive}
      />
      <InterviewList
        toggleShowMore={() => { this.toggleShowMore("pending") }}
        isShowMore={this.state["is_show_more_pending"]}
        title="Pending Interviews"
        icon="clock-o"
        online_users={this.props.online_users}
        online_companies={this.props.online_companies}
        fetching={fetching}
        list={listPending}
      />
      <InterviewList
        toggleShowMore={() => { this.toggleShowMore("ended") }}
        isShowMore={this.state["is_show_more_ended"]}
        title="Ended / Rejected Interviews"
        icon="check-circle"
        online_users={this.props.online_users}
        online_companies={this.props.online_companies}
        fetching={fetching}
        list={listEnded}
      />
    </div>

    var v = <div>
      <ListBoard
        action_icon="plus"
        action_text="Schedule New Interview"
        action_to={`browse-student`}
        icon={"users"}
        title={
          <span>
            My Interviews
          {" "}
            <a onClick={this.refresh} className="btn-link text-bold">
              <small><i className="fa fa-refresh"></i></small>
            </a>
          </span>
        }
        customList={list}
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
