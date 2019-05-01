import React, { Component } from "react";
import PropTypes from "prop-types";
import { Auditorium, AuditoriumEnum } from "../../config/db-config";
import List, { ProfileListWide } from "../component/list";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { Time } from "../lib/time";

import GeneralFormPage from "../component/general-form";
import ProfileCard from "../component/profile-card";
import {
  getAuthUser,
  getCF,
  isRoleOrganizer,
  isRoleAdmin
} from "../redux/actions/auth-actions";
import obj2arg from "graphql-obj2arg";
import { getDataCareerFair } from "../component/form";

import { socketOn, emitLiveFeed } from "../socket/socket-client";
import { BOTH } from "../../config/socket-config";
import * as layoutActions from "../redux/actions/layout-actions";
import CompanyPopup from "./partial/popup/company-popup";
import { Loader } from "../component/loader";

export class WebinarHall extends React.Component {
  constructor(props) {
    super(props);

    this.loadData = this.loadData.bind(this);
    this.getDataFromRes = this.getDataFromRes.bind(this);
    this.addFeedToView = this.addFeedToView.bind(this);
    //this.listComponentDidUpdate = this.listComponentDidUpdate.bind(this);
    this.renderList = this.renderList.bind(this);
    this.offset = 10;

    this.state = {
      extraData: []
    };

    this.isInit = true;
  }

  componentDidMount() {
    socketOn(BOTH.LIVE_FEED, data => {
      this.addFeedToView(data);
    });
  }


  // ##############################################################
  // function for list
  loadData(page, offset) {
    var query = `query{
                auditoriums(page:${page},offset:${offset},cf:"${getCF()}",order_by:"start_time asc",
                now_only:false) {
                  ID
                  company{ID name img_url img_position img_size}
                  type
                  title
                  link
                  recorded_link
                  moderator
                  start_time
                  end_time
                }
              }`;
    console.log(query);
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
    return res.data.data.auditoriums;
  }

  // from socket trigger
  addFeedToView(d) {
    this.scrollTo = "top";
    var newData = this.renderList(d, 0, true);
    // add to view
    this.setState(prevState => {
      prevState.extraData.push(newData);
      return { extraData: prevState.extraData };
    });
  }

  renderList(d, i, isExtraData = false) {


    let img = <div className="hw-image" ><ProfileCard type="company"
      img_url={d.company.img_url} img_pos={d.company.img_pos}
      img_size={d.company.img_size}
      img_dimension={"65px"}
      body={null}></ProfileCard></div>

    let detailStyle = {
      fontSize: "15px",
      textAlign: "left"
    }
    let details = <div className="hw-details" style={detailStyle}>
      <b>{d.title}</b><br></br>
      {"with "}
      <a
        onClick={() =>
          layoutActions.storeUpdateFocusCard(d.title, CompanyPopup, {
            id: d.company.ID,
            toggleable: false
          })
        }
      >
        {d.company.name}
      </a>
    </div>

    var action_disabled = true;
    var action_link = "";
    var action_text = "";
    var action_color = "";
    if (d.recorded_link != null && d.recorded_link != "") {
      action_disabled = false;
      action_link = d.recorded_link;
      action_text = "Watch Recorded Video";
      action_color = "success";
    } else if (d.link != null && d.link != "") {
      action_disabled = false;
      action_link = d.link;
      action_text = "Join Now";
      action_color = "blue";
    }

    let action = <div className="hw-action"></div>;
    if (!action_disabled) {
      action = <a className="hw-action" href={action_link} target="_blank">
        {action_text}
      </a>
    }

    let v = <div className="hall-webinar">
      {img}
      {details}
      {action}
    </div>
    return v;
  }

  render() {
    let title = "Webinar";
    let subtitle = null;
    let body = (
      <List
        type="append-bottom"
        appendText="Load More Webinar"
        listClass="db_body"
        listRef={v => (this.dashBody = v)}
        getDataFromRes={this.getDataFromRes}
        loadData={this.loadData}
        extraData={this.state.extraData}
        offset={this.offset}
        renderList={this.renderList}
      />
    );
    return (
      <div className={`border-card bc-vertical bc-rounded`}>
        <h4 className="bc-title">
          <span className="bc-title-back">{title}</span>
          <br />
          <small>{subtitle}</small>
        </h4>
        <div className="bc-body">{body}</div>
      </div>
    );
  }
}


export class AuditoriumFeed extends React.Component {
  constructor(props) {
    super(props);

    this.loadData = this.loadData.bind(this);
    this.getDataFromRes = this.getDataFromRes.bind(this);
    this.addFeedToView = this.addFeedToView.bind(this);
    //this.listComponentDidUpdate = this.listComponentDidUpdate.bind(this);
    this.renderList = this.renderList.bind(this);
    this.offset = 10;

    this.state = {
      extraData: []
    };

    this.hasUpNext = false;
    this.hasNow = false;

    this.isInit = true;
  }

  componentDidMount() {
    socketOn(BOTH.LIVE_FEED, data => {
      this.addFeedToView(data);
    });
  }

  // listComponentDidUpdate() {
  //     //console.log("listComponentDidUpdate")
  //     //console.log(this.scrollTo);

  //     if (this.scrollTo == "bottom") {
  //         //scroll to bottom
  //         this.dashBody.scrollTop = 99999999;
  //         //console.log("go bottom");

  //     }

  //     if (this.scrollTo == "top") {
  //         //scroll to top
  //         this.dashBody.scrollTop = 0;
  //         //console.log("go top");
  //     }

  //     //console.log(this.dashBody.scrollTop);
  //     this.scrollTo == "";
  // }

  // ##############################################################
  // function for list
  loadData(page, offset) {
    var query = `query{
            auditoriums(page:${page},offset:${offset},cf:"${getCF()}",order_by:"start_time asc",
            now_only:false) {
              ID
              company{ID name img_url img_position img_size}
              type
              title
              link
              recorded_link
              moderator
              start_time
              end_time
            }
          }`;
    console.log(query);
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
    return res.data.data.auditoriums;
  }

  // from socket trigger
  addFeedToView(d) {
    this.scrollTo = "top";
    var newData = this.renderList(d, 0, true);
    // add to view
    this.setState(prevState => {
      prevState.extraData.push(newData);
      return { extraData: prevState.extraData };
    });
  }

  renderList(d, i, isExtraData = false) {
    var timeNow = Time.getUnixTimestampNow();

    // DEBUG for Now
    // if (i == 0 && false) {
    //     d.start_time = timeNow;
    //     d.end_time = timeNow;
    // }

    var item = [];

    // if (!this.hasNow && d.start_time >= timeNow && d.end_time <= timeNow) {
    //     item.push(<h3>Now</h3>);
    //     this.hasNow = true;
    // } else if (!this.hasUpNext) {
    //     item.push(<h3>Up Next</h3>);
    //     this.hasUpNext = true;
    // }

    var isNew = isExtraData;
    var details = (
      <div>
        {"with "}
        <a
          onClick={() =>
            layoutActions.storeUpdateFocusCard(d.title, CompanyPopup, {
              id: d.company.ID,
              displayOnly: true,
              toggleable: false
            })
          }
        >
          {d.company.name}
        </a>
        <br />
        <small>
          <i className="fa fa-calendar left" />
          {Time.getDate(d.start_time)}
          <br />
          <i className="fa fa-clock-o left" />
          {Time.getStringShort(d.start_time) +
            " - " +
            Time.getStringShort(d.end_time)}
          <br />
          {d.moderator != null && d.moderator != "" ? (
            <span>Moderator - {d.moderator}</span>
          ) : null}
        </small>
      </div>
    );

    var action_disabled = true;
    var action_link = "";
    var action_text = "";
    var action_color = "";
    if (d.recorded_link != null && d.recorded_link != "") {
      action_disabled = false;
      action_link = d.recorded_link;
      action_text = "Watch Recorded Video";
      action_color = "success";
    } else if (d.link != null && d.link != "") {
      action_disabled = false;
      action_link = d.link;
      action_text = "Join Now";
      action_color = "blue";
    }

    item.push(
      <ProfileListWide
        title={d.title}
        img_url={d.company.img_url}
        img_pos={d.company.img_position}
        img_size={d.company.img_size}
        img_dimension={"80px"}
        body={details}
        action_color={action_color}
        action_text={action_text}
        action_handler={() => {
          window.open(action_link);
        }}
        action_disabled={action_disabled}
        type="company"
        key={i}
      />
    );

    return item;
  }
  //<button onClick={() => this.addFeedToView({ ID: "a" })}>Add</button>

  render() {
    // EUR FIX Auditorium -> Webinar
    return (
      <div>
        <h2>
          Webinar
          <br />
          <small>
            Stay tuned for more webinar session with various companies
          </small>
        </h2>
        <List
          type="append-bottom"
          appendText="Load More Event"
          listClass="db_body"
          listRef={v => (this.dashBody = v)}
          getDataFromRes={this.getDataFromRes}
          loadData={this.loadData}
          extraData={this.state.extraData}
          offset={this.offset}
          renderList={this.renderList}
        />
      </div>
    );
  }
}

// ###########################################################################################
// AUDITORIUM MANAGEMENT PAGE ###########################################################

export class AuditoriumManagement extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = getAuthUser();
    this.CF = this.authUser.cf;
    console.log(this.CF);
    this.company_id = this.props.company_id;
  }

  componentWillMount() {
    this.successAddHandler = d => {
      //emitLiveFeed(d.title, d.content, d.type, d.cf, Time.getUnixTimestampNow());
    };

    //##########################################
    // List data properties
    this.renderRow = d => {
      return [
        <td>{d.ID}</td>,
        <td>{d.cf}</td>,
        <td>
          <b>{d.title}</b>
          <small>
            <ul className="normal">
              <li>with {d.company.name}</li>
            </ul>
          </small>
        </td>,
        <td>
          <small>
            <ul className="normal">
              <li>
                <b>Start</b> : {Time.getString(d.start_time)}
              </li>
              <li>
                <b>End</b> : {Time.getString(d.end_time)}
              </li>
              <li>
                <b>Join Link</b> : {d.link}
              </li>
              <li>
                <b>Recorded Video Link</b> : {d.recorded_link}
              </li>
              <li>
                <b>Moderator</b> : {d.moderator}
              </li>
            </ul>
          </small>
        </td>
      ];
    };

    this.tableHeader = (
      <thead>
        <tr>
          <th>ID</th>
          <th>CF</th>
          <th>Event</th>
          <th>Details</th>
        </tr>
      </thead>
    );

    this.loadData = (page, offset) => {
      var query = `query{
                auditoriums(page:${page},offset:${offset},now_only:false) {
                  ID cf
                  company{ID name img_url img_position img_size}
                  type
                  title
                  link
                  recorded_link
                  moderator
                  start_time
                  end_time
                }
              }`;
      return getAxiosGraphQLQuery(query);
    };

    // get actual data from loadData
    // can alter any data here too
    this.getDataFromRes = res => {
      return res.data.data.auditoriums;
    };

    //##########################################
    // form operation properties

    // if ever needed
    // hook before submit
    this.formWillSubmit = (d, edit) => {
      //udpated by
      if (edit) {
        d[Auditorium.UPDATED_BY] = getAuthUser().ID;
      }

      // convert to number
      if (typeof d[Auditorium.COMPANY_ID] !== "undefined") {
        d[Auditorium.COMPANY_ID] = Number.parseInt(d[Auditorium.COMPANY_ID]);
      }

      // date time handling
      if (d[Auditorium.START_TIME + "_DATE"]);
      d[Auditorium.START_TIME] = Time.getUnixFromDateTimeInput(
        d[Auditorium.START_TIME + "_DATE"],
        d[Auditorium.START_TIME + "_TIME"]
      );

      delete d[Auditorium.START_TIME + "_DATE"];
      delete d[Auditorium.START_TIME + "_TIME"];

      d[Auditorium.END_TIME] = Time.getUnixFromDateTimeInput(
        d[Auditorium.END_TIME + "_DATE"],
        d[Auditorium.END_TIME + "_TIME"]
      );

      delete d[Auditorium.END_TIME + "_DATE"];
      delete d[Auditorium.END_TIME + "_TIME"];

      return d;
    };

    // date time need to be forced diff
    this.forceDiff = [
      Auditorium.START_TIME + "_DATE",
      Auditorium.START_TIME + "_TIME",
      Auditorium.END_TIME + "_DATE",
      Auditorium.END_TIME + "_TIME"
    ];

    this.acceptEmpty = [Auditorium.LINK, Auditorium.RECORDED_LINK];

    this.getEditFormDefault = ID => {
      const query = `query{auditorium(ID:${ID})
            {cf ID company_id type title link recorded_link moderator start_time end_time}}`;
      return getAxiosGraphQLQuery(query).then(res => {
        var data = res.data.data.auditorium;
        console.log(data);
        // setup time
        var start = Time.getInputFromUnix(data.start_time);
        data[Auditorium.START_TIME + "_DATE"] = start.date;
        data[Auditorium.START_TIME + "_TIME"] = start.time;

        var end = Time.getInputFromUnix(data.end_time);
        data[Auditorium.END_TIME + "_DATE"] = end.date;
        data[Auditorium.END_TIME + "_TIME"] = end.time;

        return data;
      });
    };

    // create form add new default
    this.newFormDefault = {};
    this.newFormDefault[Auditorium.CF] = this.CF;
    this.newFormDefault[Auditorium.CREATED_BY] = this.authUser.ID;

    this.getFormItemAsync = edit => {
      return getAxiosGraphQLQuery(
        `query{companies(include_sponsor:1){ID name cf}}`
      ).then(res => {
        var companies = res.data.data.companies;
        var ret = [{ header: "Auditorium Event Form" }];

        ret.push(
          ...[
            {
              label: "Select Career Fair",
              name: Auditorium.CF,
              type: "radio",
              data: getDataCareerFair("login"),
              required: true
            },
            {
              label: "Type",
              name: Auditorium.TYPE,
              type: "select",
              required: true,
              data: [AuditoriumEnum.TYPE_WEBINAR]
            },
            {
              label: "Company",
              name: Auditorium.COMPANY_ID,
              type: "select",
              required: true,
              data: companies.map((d, i) => {
                return { key: d.ID, label: d.name };
              })
            },
            {
              label: "Title",
              name: Auditorium.TITLE,
              type: "text",
              placeholder: "",
              required: true
            },
            { header: "Event Details" },
            {
              label: "Start Date",
              sublabel: "Please enter your local time",
              name: Auditorium.START_TIME + "_DATE",
              type: "date",
              placeholder: "",
              required: true
            },
            {
              label: "Start Time",
              sublabel: "Please enter your local time",
              name: Auditorium.START_TIME + "_TIME",
              type: "time",
              placeholder: "",
              required: true
            },
            {
              label: "End Date",
              sublabel: "Please enter your local time",
              name: Auditorium.END_TIME + "_DATE",
              type: "date",
              placeholder: "",
              required: true
            },
            {
              label: "End Time",
              sublabel: "Please enter your local time",
              name: Auditorium.END_TIME + "_TIME",
              type: "time",
              placeholder: "",
              required: true
            },
            {
              label: "Join Link",
              name: Auditorium.LINK,
              type: "text",
              placeholder: ""
            },
            {
              label: "Recorded Video Link",
              sublabel:
                "If both 'Recorded Video Link' and Join Link exist, only 'Recorded Video Link' will be shown",
              name: Auditorium.RECORDED_LINK,
              type: "text",
              placeholder: ""
            },
            {
              label: "Moderator",
              name: Auditorium.MODERATOR,
              type: "text",
              placeholder: ""
            },
            {
              label: "Created By",
              name: Auditorium.CREATED_BY,
              type: "number",
              disabled: true,
              hidden: true,
              required: !edit
            }
          ]
        );
        return ret;
      });
    };
  }

  render() {
    return (
      <GeneralFormPage
        dataTitle="Auditorium Event Management"
        entity="auditorium"
        entity_singular="Auditorium Event"
        addButtonText="Add New Auditorium Event"
        dataOffset={10}
        acceptEmpty={this.acceptEmpty}
        forceDiff={this.forceDiff}
        tableHeader={this.tableHeader}
        newFormDefault={this.newFormDefault}
        getEditFormDefault={this.getEditFormDefault}
        getFormItemAsync={this.getFormItemAsync}
        renderRow={this.renderRow}
        getDataFromRes={this.getDataFromRes}
        loadData={this.loadData}
        successAddHandler={this.successAddHandler}
        formWillSubmit={this.formWillSubmit}
      />
    );
  }
}
