import React, { Component } from "react";
import { Auditorium, AuditoriumEnum, UserEnum, NotificationsEnum } from "../../config/db-config";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { Time } from "../lib/time";
import GeneralFormPage from "../component/general-form";
import {
  getAuthUser, getCF,
} from "../redux/actions/auth-actions";
import { addNotification } from "../../helper/notification-helper";


// ###########################################################################################
// AUDITORIUM MANAGEMENT PAGE ###########################################################

export class AnnouncementManagement extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = getAuthUser();
    this.CF = this.authUser.cf;
  }

  componentWillMount() {

    //##########################################
    // List data properties
    this.renderRow = d => {
      return [
        <td>{d.ID}</td>,
        <td><b>{d.title}</b></td>,
        <td>
          <p>
            {d.body}
          </p>
        </td>,
        <td><i className="text-muted">{Time.getString(d.created_at)}</i></td>,
        <td><i className="text-muted">{d.creator.first_name} {d.creator.last_name}</i></td>,

      ];
    };

    this.tableHeader = (
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Body</th>
          <th>Created At</th>
          <th>Created By</th>
        </tr>
      </thead>
    );

    this.loadData = (page, offset) => {
      var query = `query{
                announcements(page:${page},offset:${offset}, cf:"${this.CF}") {
                  ID title body created_at created_by creator{first_name last_name}
                }
              }`;
      return getAxiosGraphQLQuery(query);
    };

    // get actual data from loadData
    // can alter any data here too
    this.getDataFromRes = res => {
      return res.data.data.announcements;
    };

    //##########################################
    // form operation properties

    // if ever needed
    // hook before submit
    this.formWillSubmit = (d, edit) => {
      return d;
    };

    this.successAddHandler = (d, res) => {
      addNotification({
        user_id: 0,
        user_role: UserEnum.ROLE_STUDENT,
        param: {
          announcement_id: res["ID"],
          title: d["title"]
        },
        type: NotificationsEnum.TYPE_ANNOUNCEMENT_ORGANIZER,
      })
    };

    this.getEditFormDefault = ID => { };

    // create form add new default
    this.newFormDefault = {};
    this.newFormDefault["cf"] = this.CF;
    this.newFormDefault["created_by"] = this.authUser.ID;

    this.getFormItem = edit => {
      return [
        { header: "Enter announcement details" },
        {
          label: "Title",
          name: "title",
          type: "text",
          placeholder: "",
          required: true
        },
        {
          label: "Body",
          name: "body",
          type: "textarea",
          placeholder: "",
          required: true
        },
        {
          label: "CF",
          name: "cf",
          type: "text",
          disabled: true,
          hidden: true,
          required: !edit
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
    };
  }

  render() {
    return (
      <GeneralFormPage
        noMutation={true}
        canAdd={true}
        dataTitle="Announcement To Participant"
        entity="announcement"
        entity_singular="Announcement"
        addButtonText="Add New Announcement"
        dataOffset={10}
        acceptEmpty={this.acceptEmpty}
        forceDiff={this.forceDiff}
        tableHeader={this.tableHeader}
        newFormDefault={this.newFormDefault}
        getEditFormDefault={this.getEditFormDefault}
        getFormItem={this.getFormItem}
        renderRow={this.renderRow}
        getDataFromRes={this.getDataFromRes}
        loadData={this.loadData}
        successAddHandler={this.successAddHandler}
        formWillSubmit={this.formWillSubmit}
      />
    );
  }
}
