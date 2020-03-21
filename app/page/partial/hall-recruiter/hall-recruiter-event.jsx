//Faizul Here

import React from "react";
import { createImageElement, PCType } from "../../../component/profile-card.jsx";
import { getAuthUser, getCF, isRoleAdmin } from "../../../redux/actions/auth-actions";
import * as layoutActions from "../../../redux/actions/layout-actions";
import { RootPath } from "../../../../config/app-config";
import { EventEnum } from "../../../../config/db-config";
import { isRoleRec, isRoleStudent } from "../../../redux/actions/auth-actions";
import { getAxiosGraphQLQuery } from "../../../../helper/api-helper";
import ListBoard from "../../../component/list-board";
import VacancyPopup from "../popup/vacancy-popup";
import { InterestedButton } from "../../../component/interested.jsx";
import { EmptyCard } from "../../../component/card.jsx";
import { Time } from "../../../lib/time";
import { NavLink } from "react-router-dom";

export default class HallRecruiterEvent extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.renderList = this.renderList.bind(this);
    this.getDataFromRes = this.getDataFromRes.bind(this);
    this.onClickCard = this.onClickCard.bind(this);
    this.authUser = getAuthUser();
    this.offset = 3;
  }

  loadData(page, offset) {
    var query = `query{
        events(${this.getMainQueryParam(page, offset)}) {
          cf
          ID
          is_ended
          company_id
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
  componentWillMount() {

    this.getMainQueryParam = (page, offset) => {
      let paging = "";
      if (page && offset) {
        paging = `page:${page},offset:${offset}`;
      }

      // order_by:"end_time desc"
      return `company_id:${getAuthUser().rec_company}, user_id:${getAuthUser().ID}, 
        ${paging} `
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
  onClickCard(d) {
    layoutActions.storeUpdateFocusCard(d.title, VacancyPopup, {
      id: d.ID,
      isRecThisCompany: this.isRecThisCompany()
    });
  }
  isRecThisCompany() {
    return (
      (isRoleRec() && this.authUser.rec_company == this.props.company_id) ||
      isRoleAdmin()
    );
  }

  // renderList(d, i) {
  //   let detailStyle = {
  //     position: "relative",
  //     fontSize: "14px",
  //     textAlign: "left"
  //   };

  //   // let companyName = isRoleRec() ? (
  //   //   d.company.name
  //   // ) : (
  //   //     <NavLink to={`${AppPath}/company/${d.company.ID}`}>
  //   //       {d.company.name}
  //   //     </NavLink>
  //   //   );
  //   let companyName = d.company.name;
  //   let notSpecified = <i className="text-muted">Not Speficied</i>;

  //   let include_timezone = true;
  //   let time = d.start_time ? Time.getString(d.start_time, include_timezone) : notSpecified;

  //   let locationText = <div className="el-location-text">{d.location}</div>
  //   let location = <div className="el-location">
  //     <i className="fa fa-map-marker left" style={{ marginRight: "12px" }}></i>
  //     {!d.location
  //       ? notSpecified
  //       : <span>
  //         {
  //           d.type == EventEnum.TYPE_VIRTUAL
  //             ? <b><a target="_blank" href={d.location}>{locationText}</a></b> // location jadi url utk virtual
  //             : locationText // location biasa untuk physical
  //         }
  //       </span>
  //     }
  //   </div>

  //   let title = <div className="el-title"><b>{d.title}</b><br /></div>

  //   let details = (
  //     <div className="el-details" style={detailStyle}>
  //       {title}
  //       {time}
  //       {location}
  //     </div>
  //   );

  //   let rsvpButton = (
  //     <InterestedButton
  //       customStyle={{
  //         top: "3px",
  //         left: "7px",
  //         width: "max-content",
  //       }}
  //       customView={
  //         ({
  //           // loading,
  //           // isModeCount,
  //           // isModeAction,
  //           // like_count,
  //           // onClickModeCount,
  //           is_interested,
  //           onClickModeAction
  //         }) => {
  //           let r = null;

  //           // if (Time.getUnixTimestampNow() > d.end_time) {
  //           if (d.is_ended) {
  //             r = <div className="el-ended el-action-item">Event Ended</div>
  //           } else {
  //             if (is_interested) {
  //               r = <div className="el-rsvped el-action-item" onClick={onClickModeAction}><i className="fa fa-check left"></i>Registered</div>
  //             } else {
  //               r = <div className="el-rsvp el-action-item" onClick={onClickModeAction}><i className="fa fa-plus left"></i>RSVP For Event</div>
  //             }
  //           }

  //           return <div className="el-action">{r}</div>
  //         }
  //       }
  //       isModeCount={true}
  //       isModeAction={false}
  //       finishHandler={is_interested => {
  //         if (is_interested == 1) {
  //           layoutActions.successBlockLoader(
  //             <div>
  //               Successfully RSVP'ed for event
  //               <br></br>
  //               <b>{d.title}</b>
  //               <br></br>
  //               with {companyName}
  //             </div>
  //           );
  //         }

  //         // else {
  //         //   layoutActions.successBlockLoader(`YRSVP'ed for ${d.title} webinar`)
  //         // }
  //       }}
  //       ID={d.interested.ID}
  //       is_interested={d.interested.is_interested}
  //       entity={"event"}
  //       entity_id={d.ID}
  //     ></InterestedButton>
  //   );

  //   //rsvpButton = null;
  //   let v = (
  //     <div className="event-list" style={{ position: "relative" }}>
  //       {isRoleStudent() ? rsvpButton : null}
  //       {details}
  //     </div>
  //   );
  //   return v;
  // }
  getRsvpList(d) {
    return (
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
            onClickModeCount,
            // is_interested,
            // onClickModeAction
          }) => {

            let mainText = `See RSVP List`;
            return (
              <button
                className={`btn btn-md btn-gray btn-round-5 btn-block`}
                onClick={onClickModeCount}>
                <i className="fa left fa-users"></i>{mainText}
              </button>
            );
          }}
        ID={d.interested.ID}
        is_interested={d.interested.is_interested}
        entity={"event"}
        entity_id={d.ID}
      ></InterestedButton>
    );
  }
  renderList(d, i) {
    let v = null;
    // let companyName = d.company.name;
    let notSpecified = <i className="text-muted">Not Speficied</i>;

    let include_timezone = true;
    let dateStr = d.start_time ? Time.getString(d.start_time, include_timezone) : notSpecified;


    let locationIcon = <i className="fa fa-map-marker left" style={{ marginRight: "8px" }}></i>;
    let locationText = <div className="el-location-text">{locationIcon}{d.location}</div>
    let location = <div className="el-location">
      {!d.location
        ? [locationIcon, notSpecified]
        : <span>
          {
            d.type == EventEnum.TYPE_VIRTUAL
              ? <b><a target="_blank" href={d.location}>{locationText}</a></b> // location jadi url utk virtual
              : locationText // location biasa untuk physical
          }
        </span>
      }
    </div>


    let btnAction = <div style={{ marginTop: "5px" }}>
      <NavLink
        to={`${RootPath}/app/browse-student?filter_cf=${d.name}`}
        className="btn-sm btn btn-block btn-success">
        See All Student
        </NavLink>
    </div>

    let title = <div style={{ color: "#484848" }}><b>{d.title}</b></div>

    v = <div className="lb-list-item text-left">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-8 no-padding" style={{ padding: "10px 15px" }}>
            {title}
            <div>
              <small className="text-muted">
                <i className="fa fa-calendar left"></i>
                {dateStr}
              </small>
              <br></br>
              <small className="text-muted">
                {location}
              </small>
            </div>
          </div>
          <div className="col-sm-4 no-padding" style={{ padding: "10px 15px" , paddingBottom:"15px"}}>
            {this.getRsvpList(d)}
          </div>
        </div>
      </div>
    </div>


    return v;
  }

  getDataFromRes(res) {
    return res.data.data.events;
  }


  render() {

    // kalau list semua
    let countParam = {
      loadCount: this.loadCount,
      getCountFromRes: this.getCountFromRes
    }

    return (
      <ListBoard
        {...countParam}
        // hideLoadMore={this.props.limitLoad ? true : false}
        // action_icon="plus"
        // action_text="Add New Job Post"
        // action_to={`manage-company/${this.props.company_id}/vacancy`}
        title="My Event"
        icon="calendar"
        appendText={"Load More"}
        loadData={this.loadData}
        getDataFromRes={this.getDataFromRes}
        renderList={this.renderList}
        offset={this.offset}
      />
    );
  }
}
