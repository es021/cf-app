import React, { Component } from "react";
import PropTypes from "prop-types";
import List from "../component/list";
import { EventEnum } from "../../config/db-config";
import { IsNewEventCard } from "../../config/app-config";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { Time } from "../lib/time";
import ProfileCard from "../component/profile-card.jsx";
import * as layoutActions from "../redux/actions/layout-actions";
import { InterestedButton } from "../component/interested";
import {
  getAuthUser, isRoleStudent, getCF, isRoleRec,
  // getCF,
  // isRoleOrganizer,
  // isRoleAdmin,
  // isRoleRec
} from "../redux/actions/auth-actions";
import { getEventTitle, getEventAction, getEventLocation } from "./view-helper/view-helper";
import {lang} from "../lib/lang";

export class EventList extends React.Component {
  constructor(props) {
    super(props);

    this.loadData = this.loadData.bind(this);
    this.getDataFromRes = this.getDataFromRes.bind(this);
    this.renderList = this.renderList.bind(this);
    this.offset = 8;

    this.state = {
      extraData: [],
      key: 0
    };

    this.isInit = true;
  }

  componentWillMount() {

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
          url_recorded
          url_join
          url_rsvp
          start_time
          end_time

          location
          interested{ID is_interested}
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
          className={" with-border"}
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
    // const createBody = timeStr => {
    //   return timeStr;
    // };
    // const createView = (body, toggler) => {
    //   return (
    //     <div className="el-time">
    //       {body} {toggler}
    //     </div>
    //   );
    // };
    // const createCustomToggler = (isDefaultTime, onClick) => {
    //   return <div className="el-toggle-timezone" onClick={onClick}>{" "}Toggle Timezone {isDefaultTime}</div>
    // }
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
    let notSpecified = <i className="text-muted">{lang("Not Speficied")}</i>;

    let time = d.start_time ? [Time.getString(d.start_time), <span className="text-muted">{" (" + lang("local time") + ")"}</span>] : notSpecified;

    // let locationText = <div className="el-location-text">{d.location}</div>
    // let location = <div className="el-location">
    //   <i className="fa fa-map-marker left" style={{ marginRight: "12px" }}></i>
    //   {!d.location
    //     ? notSpecified
    //     : <span>
    //       {
    //         d.type == EventEnum.TYPE_VIRTUAL
    //           ? <b><a target="_blank" href={d.location}>{locationText}</a></b> // location jadi url utk virtual
    //           : locationText // location biasa untuk physical
    //       }
    //     </span>
    //   }
    // </div>

    let title = <div className="el-title">{getEventTitle(d)}</div>
    let details = (
      <div className="el-details" style={detailStyle}>
        <b>{title}</b>
        <span style={{ fontWeight: "normal" }}><i className="text-muted fa fa-clock-o left"></i>{time}</span>
        {getEventLocation(d)}
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

    let action = getEventAction(d, { companyName: companyName });
    let viewStyle = {
      position: "relative",
    }
    if (this.props.isFullWidth) {
      viewStyle["width"] = "100%";
    }

    let v = (
      <div className={`event-list type-${this.props.type}`} style={viewStyle}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">{img}</div>
            <div className="break-15-on-md-and-less"></div>
            <div className="col-md-7">{details}</div>
            <div className="break-15-on-md-and-less"></div>
            {IsNewEventCard ? <div className="col-md-3">{action}</div> : action}

          </div>
        </div>
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
        isCenter={this.props.isCenter}
        divClass={"full-width"}
        key={this.state.key}
        isHidePagingTop={this.props.isHidePagingTop}
        type="list"
        listClass={this.props.listClass ? this.props.listClass : "flex-wrap"}
        pageClass="text-right"
        listRef={v => (this.dashBody = v)}
        getDataFromRes={this.getDataFromRes}
        loadData={this.loadData}
        isListNoMargin={this.props.isListNoMargin}
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
  type: PropTypes.string,
  limitLoad: PropTypes.number,
  company_id: PropTypes.number,
  customOffset: PropTypes.number,
  listAlign: PropTypes.string,
  isListNoMargin: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  isHidePagingTop: PropTypes.bool
}

EventList.defaultProps = {
  type: "card"
}
