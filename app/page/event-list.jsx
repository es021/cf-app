import React, { Component } from "react";
import PropTypes from "prop-types";
import { Auditorium, AuditoriumEnum } from "../../config/db-config";
import { AppPath } from "../../config/app-config";
import List, { ProfileListWide } from "../component/list";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { Time } from "../lib/time";
import { NavLink } from "react-router-dom";

import { InterestedButton } from "../component/interested";
import GeneralFormPage from "../component/general-form";
import ProfileCard from "../component/profile-card.jsx";
import {
  getAuthUser,
  getCF,
  isRoleOrganizer,
  isRoleAdmin,
  isRoleRec
} from "../redux/actions/auth-actions";
import obj2arg from "graphql-obj2arg";
import { getDataCareerFair } from "../component/form";

import { socketOn, emitLiveFeed } from "../socket/socket-client";
import { BOTH } from "../../config/socket-config";
import * as layoutActions from "../redux/actions/layout-actions";
import CompanyPopup from "./partial/popup/company-popup";
import { Loader } from "../component/loader";
import ToogleTimezone from "../component/toggle-timezone";

export class EventList extends React.Component {
  constructor(props) {
    super(props);

    this.loadData = this.loadData.bind(this);
    this.getDataFromRes = this.getDataFromRes.bind(this);
    // this.addFeedToView = this.addFeedToView.bind(this);
    this.renderList = this.renderList.bind(this);
    this.offset = 10;

    this.state = {
      extraData: [],
      key: 0
    };

    this.isInit = true;
  }

  componentDidMount() {
    // socketOn(BOTH.LIVE_FEED, data => {
    //   this.addFeedToView(data);
    // });
  }

  // ##############################################################
  // function for list
  loadData(page, offset) {
    var query = `query{
        events(user_id:${
      getAuthUser().ID
      }, page:${page},offset:${offset},
        order_by:"start_time asc") {
          ID
          company_id
          company{ID name img_url img_position img_size}
          type
          title
          location
          interested{ID is_interested}
          start_time
          end_time
        }
      }`;
    return getAxiosGraphQLQuery(query);
  }

  getDataFromRes(res) {
    this.hasUpNext = false;
    this.hasNow = false;

    if (this.isInit) {
      this.scrollTo = "top";
      this.isInit = false;
    } else {
      this.scrollTo = "bottom";
    }
    return res.data.data.events;
  }

  // from socket trigger
  // addFeedToView(d) {
  //   this.scrollTo = "top";
  //   var newData = this.renderList(d, 0, true);
  //   // add to view
  //   this.setState(prevState => {
  //     prevState.extraData.push(newData);
  //     return { extraData: prevState.extraData };
  //   });
  // }

  renderList(d, i, isExtraData = false) {
    let img = (
      <div className="el-image">
        <ProfileCard
          type="company"
          img_url={d.company.img_url}
          img_pos={d.company.img_pos}
          img_size={d.company.img_size}
          img_dimension={"65px"}
          className={"square with-border"}
          body={null}
        />
      </div>
    );

    let detailStyle = {
      position: "relative",
      fontSize: "14px",
      textAlign: "left"
    };

    let companyName = isRoleRec() ? (
      d.company.name
    ) : (
        <NavLink to={`${AppPath}/company/${d.company.ID}`}>
          {d.company.name}
        </NavLink>
      );

    // Display Time
    // ToogleTimezone
    const createBody = timeStr => {
      return timeStr;
    };
    const createView = (body, toggler) => {
      return (
        <div className="el-time">
          {body} {toggler}
        </div>
      );
    };
    const createCustomToggler = (isDefaultTime, onClick) => {
      return <div className="el-toggle-timezone" onClick={onClick}>{" "}Toggle Timezone {isDefaultTime}</div>
    }
    let time = (
      <ToogleTimezone
        createCustomToggler={createCustomToggler}
        createDefaultTime={(unix, timezone) => {
          return (
            <div><i className="fa fa-calendar left"></i> {Time.getDate(unix)} {Time.getStringShort(unix)} ({timezone}) </div>
          );
        }}
        createAlternateTime={(unix, timezone) => {
          return (
            <div><i className="fa fa-calendar left"></i> {Time.getDateMas(unix)} {Time.getStringShortMas(unix)} ({timezone})</div>
          );
        }}
        unixtimestamp={d.start_time}
        createBody={createBody}
        createView={createView}
      />
    );

    let location = <div><i className="fa fa-map-marker left"></i> {d.location}</div>



    let details = (
      <div className="el-details" style={detailStyle}>
        <b>{d.title}</b>
        <br />
        {time}
        {location}
      </div>
    );

    var action_disabled = true;
    var action_link = "";
    var action_text = "";
    var action_color = "";
    if (d.recorded_link != null && d.recorded_link != "") {
      // Has Recorded Video
      action_disabled = false;
      action_link = d.recorded_link;
      action_text = (
        <span>
          <i className="fa fa-play-circle" />
          <br />
          Watch
        </span>
      );
      action_color = "danger";
    } else if (d.link != null && d.link != "") {
      // Has Join Link
      action_disabled = false;
      action_link = d.link;
      action_text = (
        <span>
          <i className="fa fa-sign-in" />
          <br />
          Join Now
        </span>
      );
      action_color = "success";
    }




    let likeButton = (
      <InterestedButton
        customStyle={{
          top: "3px",
          left: "7px",
          width: "max-content",
        }}
        isModeCount={false}
        isModeAction={true}
        finishHandler={is_interested => {
          if (is_interested == 1) {
            layoutActions.successBlockLoader(
              <div>
                Successfully RSVP'ed for event
                <br></br>
                <b>{d.title}</b>
                <br></br>
                with {companyName}
              </div>
            );
          }

          // else {
          //   layoutActions.successBlockLoader(`YRSVP'ed for ${d.title} webinar`)
          // }
        }}
        ID={d.interested.ID}
        is_interested={d.interested.is_interested}
        entity={"event"}
        entity_id={d.ID}
      ></InterestedButton>
    );

    //likeButton = null;
    let v = (
      <div className="event-list" style={{ position: "relative" }}>
        {likeButton}
        {img}
        {details}
      </div>
    );
    return v;
  }

  render() {
    let body = (
      <List
        key={this.state.key}
        type="append-bottom"
        appendText="Load More Events"
        listClass="flex-wrap"
        listRef={v => (this.dashBody = v)}
        getDataFromRes={this.getDataFromRes}
        loadData={this.loadData}
        extraData={this.state.extraData}
        hideLoadMore={this.props.limitLoad ? true : false}
        offset={this.props.limitLoad ? this.props.limitLoad : this.offset}
        renderList={this.renderList}
      />
    );

    return body;
  }
}

EventList.propTypes = {
  limitLoad: PropTypes.number
}

EventList.defaultProps = {
}
