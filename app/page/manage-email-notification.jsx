import React, { Component } from "react";
import { Redirect, NavLink } from "react-router-dom";
import Form, {
  toggleSubmit,
  checkDiff,
  getDataCareerFair
} from "../component/form";
import {
  Vacancy,
  VacancyEnum,
} from "../../config/db-config";
import { getAxiosGraphQLQuery, postRequest } from "../../helper/api-helper";
import obj2arg from "graphql-obj2arg";
import {
  getCF,
  getAuthUser,
  isRoleRec,
  isRoleOrganizer,
} from "../redux/actions/auth-actions";
import * as layoutActions from "../redux/actions/layout-actions";
import VacancyPopup from "./partial/popup/vacancy-popup";
import PropTypes from "prop-types";
import { RootPath, AppPath, StatisticUrl } from "../../config/app-config";
import { Time } from "../lib/time";
import GeneralFormPage from "../component/general-form";
import { lang } from "../lib/lang";
import { addVacancyInfoIfNeeded, getVacancyType, isVacancyInfoNeeded } from "../../config/vacancy-config";
import { InterestedButton } from "../component/interested";
import { Loader } from "../component/loader";
import { StatisticFigure } from "../component/statistic";
import { ButtonExport } from "../component/buttons";

export default class ManageEmailNotification extends React.Component {
  constructor(props) {
    super(props);
    const authUser = getAuthUser();
    this.company_id = this.props.company_id;
    this.user_id = authUser.ID;

    this.state = {
      count: null,
      loadingCount: true,
    }
  }

  componentWillMount() {
    this.loadCount();
    //##########################################
    // List data properties
    this.renderRow = d => {
      return [
        <td>{d.ID}</td>,
        <td>
          <b>{d.email}</b>
        </td>,
        <td>{Time.getString(d.updated_at)}</td>
      ];

    };

    this.tableHeader = <thead>
      <tr>
        <th>{lang("ID")}</th>
        <th>{lang("Email")}</th>
        <th>{lang("Last Updated")}</th>
      </tr>
    </thead>;

    this.loadData = (page, offset) => {


      // @custom_vacancy_info
      var query = `query{company_emails(${this.getQueryParam({ page: page, offset: offset, isCount: false })})
            { 
              ID email updated_at
            }
          }`;
      return getAxiosGraphQLQuery(query);
    };

    // can alter any data here too
    this.getDataFromRes = res => {
      return res.data.data.company_emails;
    };

    //##########################################
    this.formWillSubmit = (d, edit) => {
      if (edit) {
        d["updated_by"] = this.user_id;
      } else {
        d["company_id"] = this.company_id;
        d["created_by"] = this.user_id;
      }
      return d;
    };

    // @custom_vacancy_info
    this.getEditFormDefault = ID => {
      const query = `query{
                company_email(ID:${ID}) {
                  ID
                  email
                }
              }`;

      return getAxiosGraphQLQuery(query).then(res => {
        var ret = res.data.data.company_email;
        return ret;
      });
    };

    // create form add new default
    this.newFormDefault = {};

    // @custom_vacancy_info
    this.getFormItem = edit => {
      return [
        { header: "Add New Email" },
        {
          label: "Email",
          name: "email",
          type: "text",
          placeholder: "joe@email.com",
          required: true
        },
        // {
        //   label: "Company Id",
        //   name: "company_id",
        //   type: "number",
        //   disabled: true,
        //   hidden: true,
        //   required: !edit
        // },
        // {
        //   label: "Created By",
        //   name: "created_by",
        //   type: "number",
        //   disabled: true,
        //   hidden: true,
        //   required: !edit
        // },
        // {
        //   label: "Updated By",
        //   name: "updated_by",
        //   type: "number",
        //   disabled: true,
        //   hidden: true,
        //   required: edit
        // },
      ];
    };
  }

  getQueryParam({ page, offset, isCount }) {
    var param = isCount ? {} : {
      page: page,
      offset: offset,
    };
    param["company_id"] = this.company_id;
    return obj2arg(param, { noOuterBraces: true });
  }

  loadCount() {
    let q1 = `query{
      company_emails_count(${this.getQueryParam({ isCount: true })})
    }`;
    getAxiosGraphQLQuery(q1).then(res => {
      var count = res.data.data.company_emails_count;
      this.setState({ count: count, loadingCount: false });
    });
  }


  render() {
    return (
      <GeneralFormPage
        dataTitle="Manage Email Notification"
        contentBelowTitle={<div>
          <i>
            Add your email to receive notifications on
          <br></br><b>schedule call update</b> and <b>inbox message update</b>.
          </i>
          <br></br>
          <br></br>
          <br></br>
        </div>}
        entity="company_email"
        entity_singular="Email"
        addButtonText="Add New Email"
        dataOffset={20}
        tableHeader={this.tableHeader}
        newFormDefault={this.newFormDefault}
        getEditFormDefault={this.getEditFormDefault}
        getFormItem={this.getFormItem}
        renderRow={this.renderRow}
        getDataFromRes={this.getDataFromRes}
        loadData={this.loadData}
        formWillSubmit={this.formWillSubmit}
      ></GeneralFormPage>
    );
  }
}
ManageEmailNotification.PropTypes = {
  company_id: PropTypes.number.isRequired
};
