import React, { Component } from "react";
import { Event, EventEnum } from "../../config/db-config";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { Time } from "../lib/time";
import GeneralFormPage from "../component/general-form";
import {
  getAuthUser, getCF, isRoleOrganizer,
  // getCF,
  // isRoleOrganizer,
  // isRoleAdmin,
  // isRoleRec
} from "../redux/actions/auth-actions";
import { getDataCareerFair } from "../component/form";
import { createCompanyTitle } from "./admin-company";
import { getEventAction } from "./view-helper/view-helper";
import { ButtonExport } from "../component/buttons";

// import PropTypes from "prop-types";
// import { AppPath } from "../../config/app-config";
// import List, { ProfileListWide } from "../component/list";
// import { NavLink } from "react-router-dom";
// import { InterestedButton } from "../component/interested";
// import ProfileCard from "../component/profile-card.jsx";
// import obj2arg from "graphql-obj2arg";
// import { getDataCareerFair } from "../component/form";
// import { socketOn, emitLiveFeed } from "../socket/socket-client";
// import { BOTH } from "../../config/socket-config";
// import * as layoutActions from "../redux/actions/layout-actions";
// import CompanyPopup from "./partial/popup/company-popup";
// import { Loader } from "../component/loader";
// import ToogleTimezone from "../component/toggle-timezone";


export default class EventManagement extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = getAuthUser();
    this.company_id = this.props.company_id;
  }

  componentWillMount() {
    this.successAddHandler = d => {
    };

    //##########################################
    // List data properties
    this.renderRow = d => {
      return [
        isRoleOrganizer() ? null : <td>{d.ID}</td>,
        <td>
          <b>{d.title}</b>
          <small>
            {/* <ul className="normal"> */}
            <li>with <b>{createCompanyTitle(d.company)}</b></li>
            {/* </ul> */}
          </small>
        </td>,
        isRoleOrganizer() ? null : <td style={{ maxWidth: "200px" }}>{JSON.stringify(d.cf)}</td>,
        <td>
          <small>
            <ul className="normal">
              <li>
                <b>Start</b> : {Time.getString(d.start_time)}
              </li>
              <li>
                <b>End</b> : {Time.getString(d.end_time)}
              </li>
              {isRoleOrganizer() ? null : [<li>
                <b>Type</b> : {d.type}
              </li>,
              <li>
                <b>Location</b> : {d.location}
              </li>,
              <li>
                <b>RSVP Link</b> : {d.url_rsvp}
              </li>,
              <li>
                <b>Join Link</b> : {d.url_join}
              </li>,
              <li>
                <b>Recorded Link</b> : {d.url_recorded}
              </li>,
              <li>
                <b>Description</b> : {d.description}
              </li>]}
            </ul>
          </small>
        </td>,
        isRoleOrganizer() ? <td style={{ maxWidth: "200px" }}>{getEventAction(d, { isPopup: true })}</td> : null,
        isRoleOrganizer() ? <td style={{ maxWidth: "150px" }}>{<ButtonExport
          btnClass="green btn-bold btn-round-5 btn-block"
          action="event_webinar_log"
          text={<span>Download Activity Log</span>}
          filter={{
            cf: this.cf,
            event_name: d.title,
            event_id: d.ID,
          }} ></ButtonExport>
        }</td> : null,
      ];
    };

    this.tableHeader = (
      <thead>
        <tr>
          {[
            isRoleOrganizer() ? null : <th>ID</th>,
            <th>Event</th>,
            isRoleOrganizer() ? null : <th>CF</th>,
            <th>Details</th>,
            isRoleOrganizer() ? <th colSpan={2}>Action</th> : null,
          ]}
        </tr>
      </thead>
    );


    //##########################################
    //  search
    this.searchParams = "";
    this.search = {};
    this.searchFormItem = [{ header: "Enter Your Search Query" },
    {
      label: "Title : ",
      name: "title",
      type: "text",
      placeholder: ""
    },
    {
      label: "Career Fair : ",
      name: "cf",
      type: "text",
      placeholder: "SEEDS, IMPACT, CITRA"
    },
    ];

    this.searchFormOnSubmit = (d) => {
      this.search = d;
      this.searchParams = "";
      if (d != null) {
        this.searchParams += (d.title) ? ` title:"${d.title}", ` : "";
        this.searchParams += (d.cf) ? ` cf:"${d.cf}", ` : "";
      }


    };

    this.loadData = (page, offset) => {
      if (isRoleOrganizer() && this.searchParams.indexOf("cf:") <= -1) {
        this.searchParams += ` cf:"${getCF()}", `;
      }
      var query = `query{
                events(${this.searchParams} page:${page},offset:${offset}) {
                  ${isRoleOrganizer() ? "" : "cf"}
                  ID 
                  company_id
                  company{ID name img_url img_position img_size}
                  type
                  title
                  location
                  url_recorded
                  url_join
                  url_rsvp
                  description
                  start_time
                  end_time
                }
              }`;
      return getAxiosGraphQLQuery(query);
    };

    // get actual data from loadData
    // can alter any data here too
    this.getDataFromRes = res => {
      return res.data.data.events;
    };

    //##########################################
    // form operation properties

    // if ever needed
    // hook before submit
    this.formWillSubmit = (d, edit) => {
      // remove cf
      if (!edit) {
        delete d[Event.CF];
      }

      //udpated by
      if (edit) {
        d[Event.UPDATED_BY] = getAuthUser().ID;
      }

      // convert to number
      if (typeof d.company_id !== "undefined") {
        d[Event.COMPANY_ID] = Number.parseInt(d[Event.COMPANY_ID]);
      }

      // date time handling
      if (d[Event.START_TIME + "_DATE"]);
      d[Event.START_TIME] = Time.getUnixFromDateTimeInput(
        d[Event.START_TIME + "_DATE"],
        d[Event.START_TIME + "_TIME"]
      );

      delete d[Event.START_TIME + "_DATE"];
      delete d[Event.START_TIME + "_TIME"];

      d[Event.END_TIME] = Time.getUnixFromDateTimeInput(
        d[Event.END_TIME + "_DATE"],
        d[Event.END_TIME + "_TIME"]
      );

      delete d[Event.END_TIME + "_DATE"];
      delete d[Event.END_TIME + "_TIME"];


      if (d[Event.END_TIME] < d[Event.START_TIME]) {
        return "'End Time' cannot be less than 'Start Time'";
      }

      return d;
    };

    // date time need to be forced diff
    this.forceDiff = [
      Event.LOCATION,
      Event.DESCRIPTION,
      Event.URL_RSVP,
      Event.URL_JOIN,
      Event.URL_RECORDED,
      Event.START_TIME + "_DATE",
      Event.START_TIME + "_TIME",
      Event.END_TIME + "_DATE",
      Event.END_TIME + "_TIME"
    ];
    this.acceptEmpty = [
      Event.DESCRIPTION,
      Event.LOCATION,
      Event.URL_RSVP,
      Event.URL_JOIN,
      Event.URL_RECORDED
    ];

    this.getEditFormDefault = ID => {
      const query = `query{event(ID:${ID})
            {ID cf company_id type title description location url_recorded url_join url_rsvp start_time end_time}}`;
      return getAxiosGraphQLQuery(query).then(res => {
        var data = res.data.data.event;
        console.log(data);
        // setup time
        var start = Time.getInputFromUnix(data.start_time);
        data[Event.START_TIME + "_DATE"] = start.date;
        data[Event.START_TIME + "_TIME"] = start.time;

        var end = Time.getInputFromUnix(data.end_time);
        data[Event.END_TIME + "_DATE"] = end.date;
        data[Event.END_TIME + "_TIME"] = end.time;

        return data;
      });
    };

    // create form add new default
    this.newFormDefault = {};
    this.newFormDefault[Event.CREATED_BY] = this.authUser.ID;

    this.getFormItemAsync = edit => {
      return getAxiosGraphQLQuery(
        `query{companies(include_sponsor:1, order_by:"name asc"){ID name cf}}`
      ).then(res => {
        var companies = res.data.data.companies;

        var dataCF = getDataCareerFair();
        dataCF.push({ key: "NONE", label: "No Career Fair" });

        var ret = [{ header: "Event Form" }];
        let cfInput = edit
          ? {
            label: "Career Fair",
            name: Event.CF,
            type: "checkbox",
            data: dataCF
          } : {
            label: "Career Fair",
            disabled: true,
            sublabel: "Career fair can be choosen after you created the event. Click on edit button."
          };

        ret.push(
          ...[
            {
              label: "Type",
              name: Event.TYPE,
              type: "select",
              required: true,
              data: ["", EventEnum.TYPE_PHYSICAL, EventEnum.TYPE_VIRTUAL]
            },
            {
              label: "Company",
              name: Event.COMPANY_ID,
              type: "select",
              required: true,
              data: companies.map((d, i) => {
                return { key: d.ID, label: d.name };
              })
            },
            cfInput,
            {
              label: "Title",
              name: Event.TITLE,
              type: "text",
              placeholder: "",
              required: true
            },
            { header: "Event Details" },
            {
              label: "Start Date",
              sublabel: "Please enter your local time",
              name: Event.START_TIME + "_DATE",
              type: "date",
              placeholder: "",
              required: true
            },
            {
              label: "Start Time",
              sublabel: "Please enter your local time",
              name: Event.START_TIME + "_TIME",
              type: "time",
              placeholder: "",
              required: true
            },
            {
              label: "End Date",
              sublabel: "Please enter your local time",
              name: Event.END_TIME + "_DATE",
              type: "date",
              placeholder: "",
              required: true
            },
            {
              label: "End Time",
              sublabel: "Please enter your local time",
              name: Event.END_TIME + "_TIME",
              type: "time",
              placeholder: "",
              required: true
            },
            {
              label: "Location",
              name: Event.LOCATION,
              type: "text",
              placeholder: ""
            },
            {
              label: "RSVP Link",
              name: Event.URL_RSVP,
              type: "text",
            },
            {
              label: "Join Link",
              name: Event.URL_JOIN,
              type: "text",
            },
            {
              label: "Recorded Link",
              name: Event.URL_RECORDED,
              type: "text",
            },
            {
              label: "Description",
              name: Event.DESCRIPTION,
              type: "textarea",
              placeholder: "",
            },
            {
              label: "Created By",
              name: Event.CREATED_BY,
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
        tableOnly={this.props.tableOnly}
        noMutation={isRoleOrganizer()}
        isHidePagingTop={isRoleOrganizer()}
        dataTitle="Event Management"
        entity="event"
        entity_singular="Event"
        addButtonText="Add New Event"
        dataOffset={10}
        acceptEmpty={this.acceptEmpty}
        forceDiff={this.forceDiff}
        tableHeader={this.tableHeader}
        newFormDefault={this.newFormDefault}
        getEditFormDefault={this.getEditFormDefault}
        getFormItemAsync={this.getFormItemAsync}
        renderRow={this.renderRow}
        searchFormNonPopup={true}
        searchFormItem={this.searchFormItem}
        searchFormOnSubmit={this.searchFormOnSubmit}
        getDataFromRes={this.getDataFromRes}
        loadData={this.loadData}
        successAddHandler={this.successAddHandler}
        formWillSubmit={this.formWillSubmit}
      />
    );
  }
}
