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
import InputEditable from "../../../component/input-editable";
import obj2arg from "graphql-obj2arg";

import * as HallRecruiterHelper from "./hall-recruiter-helper";

export default class HallRecruiterEvent extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.renderList = this.renderList.bind(this);
    this.getDataFromRes = this.getDataFromRes.bind(this);
    this.onClickCard = this.onClickCard.bind(this);
    this.authUser = getAuthUser();
    this.offset = 5;
  }

  loadData(page, offset) {
    var query = `query{
        events(${this.getMainQueryParam(page, offset)}) {
          cf
          ID
          pic
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
  // getJoinButton(d) {
  //   return <button
  //     className={`btn btn-sm btn-blue-light btn-round-5 btn-block btn-bold`}
  //     onClick={null}>
  //     <i className="fa left fa-sign-in"></i>Join Event
  //   </button>
  // }
  getRsvpButton(d) {
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
                className={`btn btn-sm btn-blue-light btn-round-5 btn-block btn-bold`}
                onClick={onClickModeCount}>
                <i className="fa left fa-user"></i>{mainText}
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


    let locationIcon = <i className="fa fa-map-marker left" style={{ marginRight: "7px" }}></i>;
    let locationText = <div className="el-location-text">{locationIcon}{d.location}</div>
    let location = <div className="el-location">
      {!d.location
        ? [locationIcon, notSpecified]
        : <span>
          {
            d.type == EventEnum.TYPE_VIRTUAL
              ? <b><a target="_blank" href={d.location}><u>{locationText}</u></a></b> // location jadi url utk virtual
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

    let title = <div style={{ color: "rgb(9, 23, 35)", marginBottom: "8px", fontSize: "16px" }}><b>{d.title}</b></div>

    // let pic = <InputEditable
    //   editTitle="Edit PIC / Interviewer"
    //   val={d.pic}
    //   data={{ ID: d.ID }}
    //   formItems={(fixedName) => {
    //     return [
    //       {
    //         name: fixedName,
    //         type: "text",
    //         placeholder: "John Doe, Sarah Hopper",
    //       }
    //     ]
    //   }}
    //   render={(val, loading, openEditPopup) => {
    //     let notAssigned = <span className="text-muted"><i>No PIC / Interviewer Assigned</i></span>;
    //     let editing = <span className="text-muted"><i>Editing.. Please Wait.</i></span>;
    //     let editIcon = <a><i onClick={openEditPopup} className="fa fa-pencil right btn-link"></i></a>;

    //     return <div className="text-muted-dark">
    //       <small>
    //         <i className="fa fa-user left"></i>
    //         {loading ? editing : <span>{!val ? notAssigned : val}{editIcon}</span>
    //         }
    //       </small>
    //     </div >
    //   }}
    //   query={(data, newVal) => {
    //     let upd = {
    //       ID: data.ID,
    //       pic: newVal,
    //       updated_by: getAuthUser().ID
    //     }
    //     return `mutation { edit_event(${obj2arg(upd, { noOuterBraces: true })}) {ID pic } }`
    //   }}
    // />

    let pic = HallRecruiterHelper.getPicElement(d, "edit_event", "PIC");
    v = <div className="text-left">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-8 no-padding" style={{ padding: "10px 15px" }}>
            {title}
            <div>
              <small className="text-muted-dark">
                <i className="fa fa-calendar left"></i>
                {dateStr}
              </small>
              <br></br>
              {pic}
              <small className="text-muted-dark">
                {location}
              </small>
            </div>
          </div>
          <div className="col-sm-4 no-padding" style={{ padding: "10px 15px", paddingBottom: "15px" }}>
            {this.getRsvpButton(d)}
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
        title="My Events"
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
