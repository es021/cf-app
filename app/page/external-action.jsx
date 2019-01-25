import React, { Component } from "react";
import PropTypes from "prop-types";
import { Loader } from "../component/loader";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import ProfileCard from "../component/profile-card";
import PageSection from "../component/page-section";
import { CustomList } from "../component/list";
import NotFoundPage from "./not-found";
import FacebookProvider, { Page, ShareButton } from "react-facebook";
import { AppConfig, RootPath, SiteUrl } from "../../config/app-config";
import { NavLink } from "react-router-dom";
import { addLog } from "../redux/actions/other-actions";
import { getAuthUser } from "../redux/actions/auth-actions";

import { Prescreen, PrescreenEnum } from "../../config/db-config";

import obj2arg from "graphql-obj2arg";

// http://localhost:8080/auth/external-action/acceptInterview/%7B%22studentId%22:136,%22interviewId%22:392,%22companyName%22:%22Shell%22,%22studentName%22:%22Wan%20Zulsarhan%22%7D

const Config = {
  Type: {
    ACCEPT_INTERVIEW: "acceptInterview",
    REJECT_INTERVIEW: "rejectInterview"
  },
  Param: {
    STUDENT_ID: "studentId",
    INTERVIEW_ID: "interviewId",
    COMPANY_NAME: "companyName",
    STUDENT_NAME: "studentName"
  }
};

export default class ExternalAction extends React.Component {
  constructor(props) {
    super(props);

    this.doAction = this.doAction.bind(this);

    this.type = null;
    this.param = null;
    this.error = null;
    this.title = null;
    this.viewDone = null;

    this.state = {
      data: null,
      loading: true
    };
  }

  componentWillMount() {
    if (this.props.match) {
      this.type = this.props.match.params.type;
      this.param = this.props.match.params.param;
    }

    try {
      this.param = JSON.parse(this.param);
    } catch (err) {
      this.error = `Unable to parse parameter (${this.param})`;
      return;
    }

    console.log(this.param);
    this.doAction();

    // var logData = {
    //     id: Number.parseInt(id),
    //     location: window.location.pathname
    // };
    // addLog(LogEnum.EVENT_VISIT_VACANCY, JSON.stringify(logData), getAuthUser().ID);

    // var query = `mutation {
    //       edit_prescreen(ID:${id}) {
    //         ID
    //         company_id
    //         company {ID name}
    //         title
    //         description
    //         requirement
    //         type
    //         application_url
    //         updated_at
    //     }}`;
  }

  doAction() {
    this.textLoading = "";
    let query = null;
    if (
      this.type == Config.Type.ACCEPT_INTERVIEW ||
      this.type == Config.Type.REJECT_INTERVIEW
    ) {
      let upd = {};
      upd[Prescreen.ID] = this.param[Config.Param.INTERVIEW_ID];
      upd[Prescreen.UPDATED_BY] = this.param[Config.Param.STUDENT_ID];
      upd[Prescreen.STATUS] =
        this.type == Config.Type.ACCEPT_INTERVIEW
          ? PrescreenEnum.STATUS_APPROVED
          : PrescreenEnum.STATUS_REJECTED;

      // view generation

      this.title = <h4>Hi {this.param[Config.Param.STUDENT_NAME]} !</h4>;

      let companyDetail = ` interview with ${
        this.param[Config.Param.COMPANY_NAME]
      }`;

      this.textLoading =
        this.type == Config.Type.ACCEPT_INTERVIEW ? `Accepting` : `Rejecting`;
      this.textLoading += companyDetail;

      this.viewDone = `Successfully `;
      this.viewDone +=
        this.type == Config.Type.ACCEPT_INTERVIEW ? "accepted" : "rejected";
      this.viewDone += companyDetail;

      query = `mutation{edit_prescreen(${obj2arg(upd, {
        noOuterBraces: true
      })}) {ID}}`;
    }

    console.log(query);
    // return;
    if (query !== null) {
      getAxiosGraphQLQuery(query).then(res => {
        this.setState(() => {
          return { loading: false };
        });
      });
    }
  }

  render() {
    var view = <div />;

    if (this.state.loading) {
      view = <Loader size="3" text={this.textLoading} />;
    } else {
      view = this.viewDone;
    }

    return (
      <div style={{ padding: "15px" }}>
        {this.title}
        {view}
      </div>
    );
  }
}
