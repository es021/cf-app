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

import { getAxiosGraphQLQuery, graphql } from "../../../../helper/api-helper";
import * as HallViewHelper from "../../view-helper/hall-view-helper";
import ToogleTimezone from "../../../component/toggle-timezone";
import { openLiveSession } from "../hall/live-session";
import { addLog } from "../../../redux/actions/other-actions";
import ListBoard from "../../../component/list-board";

// require("../../../css/border-card.scss");


class EventList extends React.Component {
  constructor(props) {
    super(props);
    this.LIMIT_SHOW_LESS = 2;
    this.authUser = getAuthUser();
    this.state = {
      time: Date.now()
    };
  }
  isShowItem(i) {
    if (!this.props.isShowMore) {
      if (i >= this.LIMIT_SHOW_LESS) {
        return false;
      }
    }

    return true;
  }
  populateList() {
    let toRet = [];
    for (var i in this.props.list) {
      let d = this.props.list[i];
      if (!this.isShowItem(i)) {
        continue;
      }
      toRet.push(this.renderItem(d, i));
    }
    return toRet;
  }

  renderItem(d, i) {
    let v = null;
    if (d._type == "cf") {
      let dateStr = Time.getPeriodString(
        d.start,
        d.end
      );
      v = <div className="lb-list-item text-left" style={{ padding: "10px 15px" }}>
        <div style={{ color: "#484848" }}><b>{d.title}</b></div>
        <div>
          <small className="text-muted">
            <i className="fa fa-calendar left"></i>
            {dateStr}
          </small>
          <br></br>
          <small className="text-muted">
            <i className="fa fa-clock-o left"></i>
            {d.time_str_mas ? d.time_str_mas : d.time_str}
          </small>
        </div>
      </div>
    } else {
      <div>{JSON.stringify(d)}</div>
    }

    return v;
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

EventList.propTypes = {
};

EventList.defaultProps = {
};

// ##################################################################################################################
// ##################################################################################################################
// ##################################################################################################################

class HallRecruiterEvent extends React.Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.state = {
      loading: true,
      data: []
    }
  }

  componentWillMount() {
    this.refresh()
  }

  componentDidUpdate() {
  }

  refresh() {
    this.setState({ loading: true })
    let q = `query{cfs(is_load:1){
      ID
      name
      title
      time_str
      time_str_mas
      start
      end
    }}`
    graphql(q).then(res => {
      this.setState({ data: res.data.data.cfs, loading: false })
    })
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
    // 3. list
    let listMyEvent = [];
    let listOtherEvent = [];
    for (var i in this.state.data) {
      let newObj = this.state.data[i];
      newObj._type = "cf"
      listMyEvent.push(newObj);
      listOtherEvent.push(newObj);
    }



    // 5. view
    let list = <div>
      <EventList
        toggleShowMore={() => { this.toggleShowMore("my_events") }}
        isShowMore={this.state["is_show_more_my_events"]}
        title="My Events"
        icon="star"
        fetching={this.state.loading}
        list={listMyEvent}
      />
      <EventList
        toggleShowMore={() => { this.toggleShowMore("other_events") }}
        isShowMore={this.state["is_show_more_other_events"]}
        title="Other Events"
        icon="clock-o"
        fetching={this.state.loading}
        list={listOtherEvent}
      />
    </div>

    var v = <div>
      <ListBoard
        action_icon="plus"
        action_text="Schedule New Interview"
        action_to={`browse-student`}
        icon={"calendar"}
        title={<a onClick={this.refresh} className="btn-link text-bold">Events</a>}
        customList={list}
      >
      </ListBoard>
    </div>

    return <div>{v}</div>;
  }
}

HallRecruiterEvent.defaultProps = {
}

HallRecruiterEvent.propTypes = {

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

export default connect(mapStateToProps, mapDispatchToProps)(HallRecruiterEvent);
