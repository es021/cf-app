//Faizul Here

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { Loader } from "../../../component/loader";
import ToogleTimezone from "../../../component/toggle-timezone";

import { GeneralForm } from "../../../component/general-form";
import ProfileCard from "../../../component/profile-card.jsx";
import {
  CompanyEnum,
  UserEnum,
  PrescreenEnum,
  SessionRequestEnum,
  GroupSession,
  GroupSessionJoin
} from "../../../../config/db-config";
import { ButtonLink } from "../../../component/buttons.jsx";
import { ProfileListItem } from "../../../component/list";
import { RootPath, IsGruveoEnable } from "../../../../config/app-config";
import { NavLink } from "react-router-dom";
import { getAuthUser, doAfterValidateComingSoon } from "../../../redux/actions/auth-actions";
import { ActivityAPIErr } from "../../../../server/api/activity-api";
import {
  emitQueueStatus,
  emitHallActivity
} from "../../../socket/socket-client";
import Form, { toggleSubmit } from "../../../component/form";
import { createIconList } from "../../../component/list";

import * as activityActions from "../../../redux/actions/activity-actions";
import * as hallAction from "../../../redux/actions/hall-actions";
import { createUserTitle2Line } from "../../users";

import { openSIAddForm, isNormalSI } from "../activity/scheduled-interview";
import Tooltip from "../../../component/tooltip";

import { isRoleRec, isRoleStudent } from "../../../redux/actions/auth-actions";
import {
  joinVideoCall,
  addLogCreateCall,
  createGruveoLink,
  isGruveoLink
} from "../session/chat.jsx";

import * as layoutActions from "../../../redux/actions/layout-actions";
import UserPopup, { createUserDocLinkList } from "../popup/user-popup";
import { Time } from "../../../lib/time";
import {
  getAxiosGraphQLQuery,
  getWpAjaxAxios
} from "../../../../helper/api-helper";
import { createImageElement } from "../../../component/profile-card.jsx";
import AvailabilityView from "../../availability";
import obj2arg from "graphql-obj2arg";
import ValidationStudentAction, {
  ValidationSource
} from "../../../component/validation-student-action";
import CompanyPopup from "../popup/company-popup";

import * as HallViewHelper from "../../view-helper/hall-view-helper";

// #########################################################################
var w = null;
export function openLiveSession(company_id) {
  const getWindowId = (cId) => {
    return "SJF_LIVE_SESSION";
  }

  const doAction = () => {
    layoutActions.loadingBlockLoader("Please Wait..");
    let q = `query { company (ID:${company_id}) { group_url } }`;
    getAxiosGraphQLQuery(q).then((res) => {
      let c = res.data.data.company;
      layoutActions.loadingBlockLoader("Please Wait..");
      if (c.group_url) {
        let doTwice = false;
        if (w != null) {
          w.close();
        } else {
          doTwice = true;
        }

        w = window.open(c.group_url, getWindowId(company_id));
        // buat twice unutk focus to the key, kalau case dah bukak n user refresh
        if (doTwice) {
          w.close();
          w = window.open(c.group_url, getWindowId(company_id));
        }

        layoutActions.storeHideBlockLoader();
      } else {
        layoutActions.errorBlockLoader(<span>Live session link is not set for this company. Please contact us at <b>innovaseedssolutions@gmail.com</b></span>);
      }
    })
  }

  let subText = null;
  if (isRoleStudent()) {
    subText = <span>In the meantime, you can <b>RSVP for live session</b> on the left side of the page.</span>;
  }
  doAfterValidateComingSoon(doAction, subText);
}

const OFFSET_ENDED_MIN = 30 * 60;
function getSessionStatus(start_time) {
  let isNow = false;
  let isTimePassed = false;
  let timeNow = Time.getUnixTimestampNow()
  if (timeNow >= start_time && timeNow <= start_time + OFFSET_ENDED_MIN) {
    isNow = true;
  }
  else if (timeNow > start_time + OFFSET_ENDED_MIN) {
    isTimePassed = true;
  }

  if (isNow) {
    return "now"
  }
  else if (isTimePassed) {
    return "ended";
  } else {
    return "upcoming";
  }
}

export function __IS_GROUP_SESSION_NOW(start_time) {
  return getSessionStatus(start_time) == "now";
}

export function __IS_GROUP_SESSION_ENDED(start_time) {
  return getSessionStatus(start_time) == "ended";
}

export function __IS_GROUP_SESSION_UPCOMING(start_time) {
  return getSessionStatus(start_time) == "upcoming";
}


export function getGroupSessionQueryFilter(cId) {
  return `company_id:${cId}, discard_expired:true, discard_canceled:true , order_by:"start_time asc"`;
}

export function createNewLiveSessionPopup(company_id, finishHandler) {

  layoutActions.loadingBlockLoader("Please Wait...");
  let q = `query { group_sessions(${getGroupSessionQueryFilter(company_id)} ) 
  {ID start_time} } `;

  getAxiosGraphQLQuery(q).then((res) => {
    let data = res.data.data.group_sessions;
    layoutActions.storeHideBlockLoader();
    layoutActions.storeUpdateFocusCard(
      "Live Session",
      NewLiveSessionPopup,
      {
        data: data,
        company_id: company_id,
        finishAdd: () => {
          this.finishHandler();
        }
      }
    );
  })

}

// #########################################################################
// require("../../../css/live-session.scss");
// remove limit join
const LIMIT_JOIN = -1;
class NewLiveSessionPopup extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = getAuthUser();
    this.state = {
      select_timestamp: -1,
      disableSubmit: false,
      error: null
    };
  }
  componentWillMount() {
    this.formItems = [
      // {
      //   label: "Live Session Title",
      //   sublabel: "What You Will Talk About?",
      //   name: GroupSession.TITLE,
      //   type: "text",
      //   len: 50,
      //   required: true
      // }
    ];

    this.countDataAv = {};
    for (var i in this.props.data) {
      var d = this.props.data[i];
      if (typeof this.countDataAv[d.start_time] === "undefined") {
        this.countDataAv[d.start_time] = 0;
      }
      this.countDataAv[d.start_time]++;
    }
  }
  onSelectTime(id, timestamp) {
    this.setState(prevState => {
      return { select_timestamp: timestamp };
    });
  }
  submitOnClick(d) {
    if (this.state.select_timestamp == -1) {
      this.setState(prevState => {
        return { disableSubmit: false, error: "Please select a time" };
      });
    } else {
      toggleSubmit(this, { error: null });
      this.createGs(d.title);
    }
  }
  createGs(title) {
    var d = {};
    d[GroupSession.TITLE] = "";
    d[GroupSession.COMPANY_ID] = this.props.company_id;
    d[GroupSession.START_TIME] = Number.parseInt(this.state.select_timestamp);
    d[GroupSession.LIMIT_JOIN] = LIMIT_JOIN;
    d[GroupSession.CREATED_BY] = this.authUser.ID;

    var query = `mutation{ add_group_session 
            (${obj2arg(d, { noOuterBraces: true })}){ID}
        }`;

    getAxiosGraphQLQuery(query).then(res => {
      this.setState(prevState => {
        return { disableSubmit: false };
      });
      // close popup terus
      layoutActions.storeHideFocusCard();
      this.successAddHandler();
    });
  }
  successAddHandler() {
    var mes = (
      <div>
        Successfully scheduled a live session on{" "}
        <u>{Time.getString(this.state.select_timestamp)}</u>
      </div>
    );
    layoutActions.successBlockLoader(mes);
    this.props.finishAdd();
  }
  getForm() {
    return (
      <div>
        <Form
          className="form-row"
          items={this.formItems}
          onSubmit={d => {
            this.submitOnClick(d);
          }}
          submitText="Schedule Live Session"
          btnColorClass="primary btn-lg"
          error={this.state.error}
          disableSubmit={this.state.disableSubmit}
        />
      </div>
    );
  }
  getUpcomingLiveSession() {

    return <div className="live-session-rec">
      <h3><b>Your Live Session</b></h3>
      <div>
        <LiveSessionView
          company_id={this.props.company_id}
          forRec={true}>
        </LiveSessionView>
      </div>
    </div>;
  }
  render() {

    return (
      <div>
        {this.getUpcomingLiveSession()}

        <div style={{ borderBottom: "solid 1px gray", margin: "30px 0px" }}></div>
        <div>
          <AvailabilityView
            select_timestamp={this.state.select_timestamp}
            for_general={true}
            select_for="New Live Session"
            count_data={this.countDataAv}
            onSelect={(id, timestamp) => {
              this.onSelectTime(id, timestamp);
            }}
          />
          <br />
          {this.getForm()}
        </div>
      </div>
    );
  }
}

NewLiveSessionPopup.propTypes = {
  data: PropTypes.array.isRequired,
  finishAdd: PropTypes.func.isRequired,
  company_id: PropTypes.number.isRequired
};



class LiveSessionClass extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = getAuthUser();
    this.img_dimension = "30px";
    this.LIMIT_SEE_MORE = 5;
    this.loadData = this.loadData.bind(this);
    this.state = {
      data: [],
      isHiddenValidation: true,
      keyValidation: 0,
      currentId: null,
      loading: true
    };
  }
  componentWillMount() {
    this.loadData();
  }
  loadData() {
    this.setState(prevState => {
      return { loading: true, isHiddenValidation: true };
    });

    var q = `query { group_sessions(${getGroupSessionQueryFilter(this.props.company_id)})
        { ID
          start_time 
          is_expired
          join_url
          start_url
          title
          joiners{
                user{
                  ID
                  first_name
                  last_name
                  img_url
                  img_pos
                  img_size
                }
            } 
        created_at created_by} } `;

    getAxiosGraphQLQuery(q).then(res => {
      this.setState(prevState => {
        return { data: res.data.data.group_sessions, loading: false };
      });
    });
  }
  createSeeMoreLink({ d, i, joinersId }) {
    let styleSeeMore = {
      width: "35px",
      fontSize: "10px",
      lineHeight: "12px",
      marginLeft: "3px",
      marginTop: "-3px"
    };
    let classSeeMore = this.props.forRec ? "text btn-link" : "text-muted";
    const onClickSeeMore = e => {
      if (!this.props.forRec) {
        return;
      }
      // todo get from data-joiners
      console.log("huhuhuhuhu");
      let joiners = e.currentTarget.dataset.joiners;
      joiners = JSON.parse(joiners);
      let index = e.currentTarget.dataset.index;
      let joinersView = this.createJoinersViewPopup(index);
      const componentView = () => {
        return <div>{joinersView}</div>;
      };
      layoutActions.storeUpdateFocusCard("All Participants", componentView, {});
    };

    return (
      <div
        className={classSeeMore}
        onClick={onClickSeeMore}
        style={styleSeeMore}
        data-id={d.ID}
        data-index={i}
        data-joiners={JSON.stringify(joinersId)}
      >
        and {d.joiners.length - this.LIMIT_SEE_MORE} others
      </div>
    );
  }
  createJoinersViewPopup(index) {
    let d = this.state.data[index];
    var joiners = d.joiners.map((dj, di) => {
      dj = dj.user;
      // var imgView = createImageElement(dj.img_url, dj.img_pos
      //     , dj.img_size, this.img_dimension, "");
      // var name = createUserTitle(dj);
      var name = createUserTitle2Line(dj);
      return (
        <ProfileCard
          type="student"
          title={name}
          img_url={dj.img_url}
          img_pos={dj.img_pos}
          img_size={dj.img_size}
          body={null}
        />
      );
    });

    return (
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap"
        }}
      >
        {joiners}
      </div>
    );
  }
  createJoinersView(d, extraCount) {
    var joiners = d.joiners.map((dj, di) => {
      if (extraCount > 1 && di >= this.LIMIT_SEE_MORE) {
        return;
      }
      dj = dj.user;
      var imgView = createImageElement(
        dj.img_url,
        dj.img_pos,
        dj.img_size,
        this.img_dimension,
        ""
      );

      var studentName = null;
      var onClickJoiner = () => { };
      if (this.props.forRec) {
        studentName = dj.first_name + " " + dj.last_name;
        onClickJoiner = () =>
          layoutActions.storeUpdateFocusCard(studentName, UserPopup, {
            id: dj.ID
          });
      }

      return (
        <div className="join-item" onClick={onClickJoiner}>
          <Tooltip
            bottom="37px"
            left="-71px"
            width="140px"
            debug={false}
            alignCenter={true}
            content={imgView}
            tooltip={studentName}
          />
        </div>
      );
    });

    return joiners;
  }
  getListView(data) {
    let arrNow = [];
    let arrExpired = [];
    let arrUpcoming = [];

    data.map((d, i) => {
      let extraCount = d.joiners.length - this.LIMIT_SEE_MORE;
      var joiners = this.createJoinersView(d, extraCount);

      let isJoined = false;
      var joinersId = d.joiners.map((dj, di) => {
        dj = dj.user;
        if (dj.ID == this.authUser.ID) {
          isJoined = true;
        }
        return dj.ID;
      });

      // See More Punya Button
      if (extraCount > 1 && d.joiners.length > this.LIMIT_SEE_MORE) {
        joiners.push(
          this.createSeeMoreLink({
            d: d,
            i: i,
            joinersId: joinersId
          })
        );
      }

      if (d.joiners.length <= 0) {
        joiners = <small className="text-muted">No Participant Yet</small>;
      }

      var action = null;

      if (!this.props.forRec) {
        if (isJoined) {
          action = (
            <div
              className="action btn btn-success btn-sm btn-disabled"
              data-id={d.ID}
              disabled={"true"}
              onClick={e => {
              }}
            >
              RSVP'ed
            </div>
          );
        } else {
          action = (
            <div
              className="action btn btn-success btn-sm"
              data-id={d.ID}
              onClick={e => {
                this.joinGroupSession(e);
              }}
            >
              RSVP Now
            </div>
          );
        }
      }

      // if (d.is_expired) {
      //   action = (
      //     <div className="action btn btn-danger btn-sm" disabled="disabled">
      //       Ended
      //     </div>
      //   );
      // } else if (this.props.forRec) {
      //   if (d.join_url != null) {
      //     const isExpiredHandler = () => {
      //       var mes = <div>This group session has ended.</div>;
      //       layoutActions.errorBlockLoader(mes);
      //       var q = `mutation {edit_group_session(ID:${
      //         d.ID
      //         }, is_expired:1){ID}}`;
      //       getAxiosGraphQLQuery(q).then(res => {
      //         this.loadData();
      //       });
      //     };
      //     //  href={d.start_url}
      //     action = (
      //       <a
      //         onClick={() =>
      //           joinVideoCall(d.join_url, null, isExpiredHandler, d.ID)
      //         }
      //         className="action btn btn-primary btn-sm"
      //         target="_blank"
      //       >
      //         Started
      //       </a>
      //     );
      //   } else {
      //     action = (
      //       <div
      //         className="action btn btn-success btn-sm"
      //         data-id={d.ID}
      //         data-joiners={JSON.stringify(joinersId)}
      //         data-start_time={d.start_time}
      //         onClick={e => {
      //           HallViewHelper.startVideoCall(e, {
      //             type: HallViewHelper.TYPE_GROUP_SESSION,
      //             user_id: this.authUser.ID,
      //             bindedSuccessHandler: this.loadData
      //           });
      //         }}
      //       >
      //         Start Video Call
      //       </div>
      //     );
      //   }
      // } else {
      //   action = (
      //     <div
      //       className="action btn btn-success btn-sm"
      //       data-id={d.ID}
      //       onClick={e => {
      //         this.joinGroupSession(e);
      //       }}
      //     >
      //       RSVP
      //     </div>
      //   );
      // }

      var deleteBtn = null;
      if (this.props.forRec) {
        deleteBtn = (
          <div
            data-joiners={JSON.stringify(joinersId)}
            data-id={d.ID}
            onClick={e => {
              this.deleteGroupSession(e);
            }}
            className="btn btn-link delete"
          >
            <i className="fa fa-times" />
          </div>
        );
      }

      // let title =
      //   d.title == "" || d.title == null ? (
      //     <div className="text-muted">Untitled Session</div>
      //   ) : (
      //       d.title
      //     );

      // create time date
      var styleDate = { fontSize: "15px" };
      var styleTime = { fontSize: "20px" };
      // ToogleTimezone
      const createTime = (unix, isAlt) => {
        return [
          <div className="time">
            <i className="fa fa-calendar left" />
            <b>
              {isAlt ? Time.getDateDayStrMas(unix) : Time.getDateDayStr(unix)}
            </b>
            {" - "}
            {isAlt ? Time.getDateMas(unix) : Time.getDate(unix)}
          </div>,
          <div className="time">
            <i className="fa fa-clock-o left" />
            {isAlt ? Time.getStringShortMas(unix) : Time.getStringShort(unix)}
          </div>
        ];
      };

      const createBody = timeStr => {
        return timeStr;
      };

      const createView = (body, toggler) => {
        return (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>{body}</div>
            <div style={{ paddingRight: "10px" }}>{toggler}</div>
          </div>
        );
      };

      var timeDate = (
        <ToogleTimezone
          createDefaultTime={unix => {
            let isAlt = false;
            return createTime(unix, isAlt);
          }}
          createAlternateTime={unix => {
            let isAlt = true;
            return createTime(unix, isAlt);
          }}
          unixtimestamp={d.start_time}
          createBody={createBody}
          createView={createView}
        />
      );

      // let offsetExpiredMin = 30 * 60;
      // let isNow = false;
      // let isTimePassed = false;
      // let timeNow = Time.getUnixTimestampNow()
      // if (timeNow >= d.start_time && timeNow <= d.start_time + offsetExpiredMin) {
      //   isNow = true;
      // }
      // else if (timeNow > d.start_time + offsetExpiredMin) {
      //   isTimePassed = true;
      // }

      let label = "";
      let className = "";
      if (__IS_GROUP_SESSION_NOW(d.start_time)) {
        className = "gs-now";
        label = "Happening Now"
      }
      else if (__IS_GROUP_SESSION_ENDED(d.start_time)) {
        className = "gs-expired";
        label = "Ended"
      } else {
        className = "gs-upcoming";
        label = "Upcoming"
      }

      let toAdd = <div className={`gs-company ${className}`}>
        <div className="header">
          <div className={"header-container"}>
            {/* <div className="title" title={d.title}>
              <b>{isTimePassed ? "Ended" : "Upcoming"}</b>
            </div> */}
            <div className="gs-label text-left">
              <b>{label}</b>
            </div>
            {timeDate}
            {deleteBtn}
          </div>
        </div>
        <div className="joiner">{joiners}</div>
        {action}
      </div>

      if (__IS_GROUP_SESSION_NOW(d.start_time)) {
        arrNow.push(toAdd);
      }
      else if (__IS_GROUP_SESSION_ENDED(d.start_time)) {
        arrExpired.push(toAdd);
      } else {
        arrUpcoming.push(toAdd);
      }
    });

    return [...arrNow, ...arrUpcoming, ...arrExpired];
  }
  createView(data) {
    var list = this.getListView(data);
    return (
      <div className="live-session">
        {/* {this.props.forRec ? this.createAddNewGs() : null} */}
        {list}
        {list.length == 0 ? (
          <small className="text-muted text-left">
            {this.props.forStudent
              ? "This company does not have any live session scheduled yet. Check again later."
              : "It seems you don't have any live session scheduled yet."}
          </small>
        ) : null}
      </div>
    );
  }
  deleteGroupSession(e) {
    var id = e.currentTarget.dataset.id;
    var joiners = e.currentTarget.dataset.joiners;
    joiners = JSON.parse(joiners);

    layoutActions.confirmBlockLoader(
      "Cancel This Live Session?",
      () => {
        layoutActions.loadingBlockLoader("Canceling...");
        var q = `mutation { edit_group_session (ID:${id}, is_canceled:1) { ID } } `;
        getAxiosGraphQLQuery(q).then(res => {
          // emit to joiners to reload group session dorang
          for (var i in joiners) {
            emitHallActivity(
              hallAction.ActivityType.GROUP_SESSION_JOIN,
              joiners[i],
              null
            );
          }
          this.loadData();
          layoutActions.storeHideBlockLoader();
        });
      }
    );
  }

  openWhatsNextAlert(gs, greenMes) {
    var actData = [
      {
        icon: "envelope",
        color: "#007BB4",
        text: (
          <span>
            You will be <b>notified through email</b> an hour before the session
            started
          </span>
        )
      },
      {
        icon: "video-camera",
        color: "#007BB4",
        text: (
          <span>
            A link to join video call will be created under <b>'My Activity'</b>{" "}
            section in Home page
          </span>
        )
      }
    ];
    let list = createIconList("sm", actData, "400px", {
      customTextWidth: "325px",
      customIconDimension: "40px",
      customIconFont: "initial"
    });

    var mes = (
      <div>
        <h3 className="text-success">{greenMes}</h3>
        The group session will start on <u>
          {Time.getString(gs.start_time)}
        </u>{" "}
        (Your local time)
        <h3 className="text-primary">Whats Next?</h3>
        {list}
      </div>
    );

    // kkena tutup takut student boleh join 2 kali
    layoutActions.storeHideFocusCard();

    hallAction.storeLoadActivity([hallAction.ActivityType.GROUP_SESSION_JOIN]);
    emitHallActivity(
      hallAction.ActivityType.GROUP_SESSION_JOIN,
      null,
      this.props.company_id
    );
    layoutActions.customBlockLoader(
      mes,
      "Got It!",
      () => {
        layoutActions.storeHideBlockLoader();
        this.loadData();
      },
      undefined,
      true
    );
  }

  successHandlerForValidation() {
    // var e = this.state.eventForValidation;
    // var id = e.currentTarget.dataset.id;
    var id = this.state.currentId;
    var d = {};
    d[GroupSessionJoin.USER_ID] = this.props.user_id;
    d[GroupSessionJoin.GROUP_SESSION_ID] = Number.parseInt(id);
    console.log(d);

    layoutActions.loadingBlockLoader("Processing... Please Wait");

    // 1. backed validation check if still has space
    //var query = `query{group_session (ID:${id}){joiners{ID} limit_join start_time }}`;
    var query = `query{group_session (ID:${id}){joiners{ID} start_time }}`;
    getAxiosGraphQLQuery(query).then(res => {
      var gs = res.data.data.group_session;

      var err = activityActions.invalidJoinGroupSession(id);
      if (err !== false) {
        this.openWhatsNextAlert(gs, "You Already Rsvp'ed This Session!");
        return;
      }

      // remove limit join group session
      //var err = activityActions.invalidJoinGroupSession(this.props.company_id)

      // remove limit
      // if (gs.joiners.length >= gs.limit_join) {
      //     var mes = `Sorry. Only ${gs.limit_join} students are allowed to join in one session. Please choose another session`;
      //     layoutActions.errorBlockLoader(mes);
      //     return;
      // }


      // 2. add to db
      var query = `mutation { add_group_session_join 
        (${obj2arg(d, { noOuterBraces: true })}){ID}}`;

      getAxiosGraphQLQuery(query).then(res => {
        this.openWhatsNextAlert(gs, "Successfully Rsvp'ed!");

        // reload data
        //this.loadData();
        // console.log(res.data.data.add_group_session_join);
        // var mes = <div>
        //     <h3 className="text-success">Successfully Joined!</h3>
        //     The group session will start on <u>{Time.getString(gs.start_time)}</u>  (Your local time)
        //     <br></br>
        //     <h3 className="text-primary">Whats Next?</h3>
        //     You will be notified (through email) an hour before the session started.
        //     </div>;
        // hallAction.storeLoadActivity([hallAction.ActivityType.GROUP_SESSION_JOIN]);
        // emitHallActivity(hallAction.ActivityType.GROUP_SESSION_JOIN, null, this.props.company_id);
        // layoutActions.customBlockLoader(mes, "Got It!");
        // layoutActions.storeHideFocusCard();
      });
    });
  }
  joinGroupSession(ev) {
    var id = ev.currentTarget.dataset.id;
    this.setState(prevState => {
      return {
        isHiddenValidation: false,
        keyValidation: new Date().getTime(),
        currentId: id
      };
    });
  }
  startVideoCall(e) {
    var id = e.currentTarget.dataset.id;
    id = Number.parseInt(id);

    var start_time = e.currentTarget.dataset.start_time;
    start_time = Number.parseInt(start_time);

    var joiners = e.currentTarget.dataset.joiners;
    joiners = JSON.parse(joiners);

    const recDoStart = (join_url, start_url) => {
      var updateData = {};
      updateData[GroupSession.ID] = id;
      updateData[GroupSession.JOIN_URL] = join_url;
      updateData[GroupSession.START_URL] = start_url;
      updateData[GroupSession.UPDATED_BY] = this.authUser.ID;

      // update group session with join_url data
      var query = `mutation { edit_group_session 
                (${obj2arg(updateData, { noOuterBraces: true })})
                {ID}
            }`;

      getAxiosGraphQLQuery(query).then(res => {
        // emit to joiners to reload group session dorang
        for (var i in joiners) {
          emitHallActivity(
            hallAction.ActivityType.GROUP_SESSION_JOIN,
            joiners[i],
            null
          );
        }

        layoutActions.storeHideBlockLoader();

        this.loadData();
      });
    };

    const confirmCreateWithGruveo = () => {
      let url = createGruveoLink(id, true);
      addLogCreateCall({ isGruveo: true, group_session_id: id, url: url });
      recDoStart(url, url);
      window.open(url);
    };

    const confirmCreateWithZoom = () => {
      addLogCreateCall({ isZoom: true, group_session_id: id });

      layoutActions.loadingBlockLoader(
        "Creating Video Call Session. Please Do Not Close Window."
      );
      const successInterceptor = data => {
        /*
                {"uuid":"bou80/LrR6a0cmDKC4V5aA=="
                ,"id":646923659,"host_id":"-9e--206RFiZFE0hSh-RPQ"
                ,"topic":"Let's start a video call."
                ,"password":"","h323_password":""
                ,"status":0,"option_jbh":false
                ,"option_start_type":"video"
                ,"option_host_video":true,"option_participants_video":true
                ,"option_cn_meeting":false,"option_enforce_login":false
                ,"option_enforce_login_domains":"","option_in_meeting":false
                ,"option_audio":"both","option_alternative_hosts":""
                ,"option_use_pmi":false,"type":1,"start_time":""
                ,"duration":0,"timezone":"America/Los_Angeles"
                ,"start_url":"https://zoom.us/s/646923659?zpk=NcbawuQ7mSE9jfEBdcGMfwxumZzC21eWgm2v6bQ9S6k.AwckNGQwMWY3NWQtNDZhMC00MzU2LTg0M2MtNGVlNWI1MmUzOWY5Fi05ZS0tMjA2UkZpWkZFMGhTaC1SUFEWLTllLS0yMDZSRmlaRkUwaFNoLVJQURJ0ZXN0LnJlY0BnbWFpbC5jb21jAHBTRm01T3I3ZVprU0RGczJCeVRFTlZ5N1k0cE1Zcm5scFF5R3pQZ2RLQjY4LkJnUWdVMDVMU1U1cGNFVmpWeTlESzB0NVVGRm5SbWx3YnpNNFRFNVdWSGxZWjJrQUFBd3pRMEpCZFc5cFdWTXpjejBBAAAWcDF2Skd0YUJRV3k0WC15NzVGRmVtQQIBAQA"
                ,"join_url":"https://zoom.us/j/646923659","created_at":"2018-01-31T02:08:02Z"}
                */

        if (data == null || data == "" || typeof data != "object") {
          layoutActions.errorBlockLoader(
            "Failed to create video call session. Please check your internet connection"
          );
          return;
        }

        console.log("success createVideoCall", data);
        var body = (
          <div>
            <h4 className="text-primary">
              Successfully Created Video Call Session
            </h4>
            <br />
            <a
              href={data.start_url}
              target="_blank"
              className="btn btn-success btn-lg"
              onClick={() => {
                recDoStart(data.join_url, data.start_url);
              }}
            >
              Start Video Call
            </a>
          </div>
        );
        layoutActions.customBlockLoader(body, null, null, null);
      };

      var data = {
        query: "create_meeting",
        host_id: this.authUser.ID,
        group_session_id: id
      };

      getWpAjaxAxios("wzs21_zoom_ajax", data, successInterceptor, true);
    };

    // New Gruveo
    // choose between zoom or chrome
    const recConfirmCreate = () => {
      if (IsGruveoEnable) {
        let width = "100px";
        let v = (
          <div>
            <br />
            <div
              onClick={() => {
                confirmCreateWithGruveo();
              }}
              style={{ width: width }}
              className="btn btn-blue"
            >
              Chrome
            </div>

            <div
              onClick={() => {
                confirmCreateWithZoom();
              }}
              style={{ width: width }}
              className="btn btn-blue"
            >
              Zoom
            </div>
          </div>
        );
        layoutActions.customViewBlockLoader("Create Video Call With", v);
      } else {
        confirmCreateWithZoom();
      }
    };

    // open confirmation if time now is less than start time
    if (Time.getUnixTimestampNow() < start_time) {
      var title = (
        <div>
          It is not the time yet
          <br />
          <small>
            This session was scheduled on
            <br />
            <u>{Time.getString(start_time)}</u>
            <br />
            Continue to start video call now?
          </small>
        </div>
      );
      layoutActions.confirmBlockLoader(title, () => {
        recConfirmCreate();
      });
    } else {
      recConfirmCreate();
    }
  }

  // createAddNewGs() {
  //   const onClick = () => {
  //     layoutActions.storeUpdateFocusCard(
  //       "Schedule New Live Session",
  //       NewLiveSessionPopup,
  //       {
  //         data: this.state.data,
  //         company_id: this.props.company_id,
  //         finishAdd: () => {
  //           this.loadData();
  //         }
  //       }
  //     );
  //   };

  //   return (
  //     <div className="gs-company add" onClick={onClick}>
  //       <div>
  //         <i className="fa fa-plus fa-3x" />
  //       </div>
  //     </div>
  //   );
  // }
  render() {
    var view = <Loader size="2" text="Loading Live Session..." />;
    if (!this.state.loading) {
      view = this.createView(this.state.data);
    }

    var header = null;
    if (this.props.forStudent) {
      header = (
        <h4
          style={{
            textAlign: "left",
            marginTop: "10px",
            borderBottom: "solid darkgray 1px"
          }}
        >
          RSVP for Live Session
        </h4>
      );
      view = [view];
      view.push(
        <ValidationStudentAction
          source={ValidationSource.GROUP_SESSION}
          key={this.state.keyValidation}
          isHidden={this.state.isHiddenValidation}
          successHandler={() => {
            this.successHandlerForValidation();
          }}
        />
      );
    }

    // if (this.props.forRec) {
    //   header = (
    //     <h3
    //       onClick={() => {
    //         this.loadData();
    //       }}
    //     >
    //       <a className="btn-link">Live Session</a>
    //     </h3>
    //   );
    // }

    return (
      <div>
        {header}
        {view}
      </div>
    );
  }
}

// TODO status online
function mapStateToProps(state, ownProps) {
  return {
    online_users: state.user.online_users
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      //loadActivity: hallAction.loadActivity
    },
    dispatch
  );
}

LiveSessionClass.propTypes = {
  company_id: PropTypes.number.isRequired,
  user_id: PropTypes.number,
  forRec: PropTypes.bool,
  forStudent: PropTypes.bool
};

LiveSessionClass.defaultProps = {
  user_id: null,
  forRec: false,
  forStudent: false
};

export const LiveSessionView = connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveSessionClass);
