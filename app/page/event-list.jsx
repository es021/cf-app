import React, { Component } from "react";
import PropTypes from "prop-types";
import { EventEnum } from "../../config/db-config";
import List from "../component/list";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { Time } from "../lib/time";
import ProfileCard from "../component/profile-card.jsx";
import { InterestedButton } from "../component/interested";
import {
  getAuthUser, isRoleStudent, getCF,
  // getCF,
  // isRoleOrganizer,
  // isRoleAdmin,
  // isRoleRec
} from "../redux/actions/auth-actions";
import * as layoutActions from "../redux/actions/layout-actions";
import ToogleTimezone from "../component/toggle-timezone";


// import { AppPath } from "../../config/app-config";
// import { NavLink } from "react-router-dom";
// import GeneralFormPage from "../component/general-form";
// import obj2arg from "graphql-obj2arg";
// import { getDataCareerFair } from "../component/form";
// import { socketOn, emitLiveFeed } from "../socket/socket-client";
// import { BOTH } from "../../config/socket-config";
// import CompanyPopup from "./partial/popup/company-popup";
// import { Loader } from "../component/loader";

export class EventList extends React.Component {
  constructor(props) {
    super(props);

    this.loadData = this.loadData.bind(this);
    this.getDataFromRes = this.getDataFromRes.bind(this);
    // this.addFeedToView = this.addFeedToView.bind(this);
    this.renderList = this.renderList.bind(this);
    this.offset = 8;

    this.state = {
      extraData: [],
      key: 0
    };

    this.isInit = true;
  }

  componentWillMount() {
    // socketOn(BOTH.LIVE_FEED, data => {
    //   this.addFeedToView(data);
    // });

    this.getMainQueryParam = (page, offset) => {
      let param = "";

      if (page && offset) {
        param += `page:${page},offset:${offset},`;
      }

      if (this.props.company_id) {
        param += `company_id:${this.props.company_id},`;
      }

      // order_by:"end_time desc"
      param = `cf:"${getCF()}",user_id:${getAuthUser().ID},${param}`;
      param = param.substr(0, param.length - 1);
      return param;
    }
    this.loadCount = () => {
      var query = `query{
        events_count(${this.getMainQueryParam()})
       }`;

      return getAxiosGraphQLQuery(query);
    };

    this.getCountFromRes = (res) => {
      return res.data.data.events_count
    }
  }

  // ##############################################################
  // function for list
  loadData(page, offset) {
    var query = `query{
        events(${this.getMainQueryParam(page, offset)}) {
          ID
          is_ended
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

    // let companyName = isRoleRec() ? (
    //   d.company.name
    // ) : (
    //     <NavLink to={`${AppPath}/company/${d.company.ID}`}>
    //       {d.company.name}
    //     </NavLink>
    //   );
    let companyName = d.company.name;

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
    // let time = (
    //   <ToogleTimezone
    //     createCustomToggler={createCustomToggler}
    //     createDefaultTime={(unix, timezone) => {
    //       return (
    //         <div><i className="fa fa-clock-o left"></i> {Time.getDate(unix)} {Time.getStringShort(unix)} ({timezone}) </div>
    //       );
    //     }}
    //     createAlternateTime={(unix, timezone) => {
    //       return (
    //         <div><i className="fa fa-clock-o left"></i> {Time.getDateMas(unix)} {Time.getStringShortMas(unix)} ({timezone})</div>
    //       );
    //     }}
    //     unixtimestamp={d.start_time}
    //     createBody={createBody}
    //     createView={createView}
    //   />
    // );
    // let time = <div><i className="fa fa-clock-o left"></i> {Time.getDateMas(d.start_time)} {Time.getStringShortMas(d.start_time)} (MYT)</div>;
    let notSpecified = <i className="text-muted">Not Speficied</i>;

    let include_timezone = true;
    let time = d.start_time ? Time.getString(d.start_time, include_timezone) : notSpecified;

    let locationText = <div className="el-location-text">{d.location}</div>
    let location = <div className="el-location">
      <i className="fa fa-map-marker left" style={{ marginRight: "12px" }}></i>
      {!d.location
        ? notSpecified
        : <span>
          {
            d.type == EventEnum.TYPE_VIRTUAL
              ? <b><a target="_blank" href={d.location}>{locationText}</a></b> // location jadi url utk virtual
              : locationText // location biasa untuk physical
          }
        </span>
      }
    </div>

    let title = <div className="el-title"><b>{d.title}</b><br /></div>

    let details = (
      <div className="el-details" style={detailStyle}>
        {title}
        {time}
        {location}
      </div>
    );

    // var action_disabled = true;
    // var action_link = "";
    // var action_text = "";
    // var action_color = "";
    // if (d.recorded_link != null && d.recorded_link != "") {
    //   // Has Recorded Video
    //   action_disabled = false;
    //   action_link = d.recorded_link;
    //   action_text = (
    //     <span>
    //       <i className="fa fa-play-circle" />
    //       <br />
    //       Watch
    //     </span>
    //   );
    //   action_color = "danger";
    // } else if (d.link != null && d.link != "") {
    //   // Has Join Link
    //   action_disabled = false;
    //   action_link = d.link;
    //   action_text = (
    //     <span>
    //       <i className="fa fa-sign-in" />
    //       <br />
    //       Join Now
    //     </span>
    //   );
    //   action_color = "success";
    // }




    let rsvpButton = (
      <InterestedButton
        customStyle={{
          top: "3px",
          left: "7px",
          width: "max-content",
        }}
        customView={
          ({
            // loading,
            // isModeCount,
            // isModeAction,
            // like_count,
            // onClickModeCount,
            is_interested,
            onClickModeAction
          }) => {
            let r = null;

            // if (Time.getUnixTimestampNow() > d.end_time) {
            if (d.is_ended) {
              r = <div className="el-ended el-action-item">Event Ended</div>
            } else {
              if (is_interested) {
                r = <div className="el-rsvped el-action-item" onClick={onClickModeAction}><i className="fa fa-check left"></i>Registered</div>
              } else {
                r = <div className="el-rsvp el-action-item" onClick={onClickModeAction}><i className="fa fa-plus left"></i>RSVP For Event</div>
              }
            }

            return <div className="el-action">{r}</div>
          }
        }
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

    //rsvpButton = null;
    let viewStyle = {
      position : "relative",
    }
    if(this.props.isFullWidth){
      viewStyle["width"] = "100%";
    }
    
    let v = (
      <div className="event-list" style={viewStyle}>
        {isRoleStudent() ? rsvpButton : null}
        {img}
        {details}
      </div>
    );
    return v;
  }

  render() {
    // kalau list semua
    let countParam = {}
    if (!this.props.limitLoad) {
      countParam = {
        loadCount: this.loadCount,
        getCountFromRes: this.getCountFromRes
      }
    }

    let offset = 0;
    if (this.props.limitLoad) {
      offset = this.props.limitLoad;
    }
    else if (this.props.customOffset) {
      offset = this.props.customOffset;
    }
    else {
      offset = this.offset;
    }

    return (
      <List
        {...countParam}
        key={this.state.key}
        type="list"
        listClass={this.props.listClass ? this.props.listClass : "flex-wrap"}
        pageClass="text-right"
        listRef={v => (this.dashBody = v)}
        getDataFromRes={this.getDataFromRes}
        loadData={this.loadData}
        extraData={this.state.extraData}
        hideLoadMore={this.props.limitLoad ? true : false}
        offset={offset}
        listAlign={this.props.listAlign}
        renderList={this.renderList}
      />
    );

  }
}

EventList.propTypes = {
  limitLoad: PropTypes.number,
  company_id: PropTypes.number,
  customOffset: PropTypes.number,
  listAlign : PropTypes.string,
  isFullWidth : PropTypes.bool,
}

EventList.defaultProps = {
}
