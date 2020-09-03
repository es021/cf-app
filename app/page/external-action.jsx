import React, { Component } from "react";
import { Loader } from "../component/loader";
import { getAxiosGraphQLQuery, graphql } from "../../helper/api-helper";
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
    COMPANY_ID: "companyId",
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
      loadingInfo: true,
      loading: true,
      companyName: "",
      studentName: "",
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
    }

    console.log("type", this.type);
    console.log("param", this.param);
    console.log("error", this.error);


    // if(this.error != null){
    //   return;
    // }

    this.loadInfo();

  }

  loadInfo() {
    var toLoad = 2;
    var loaded = 0;
    const finish = () => {
      loaded++;
      if (loaded >= toLoad) {
        this.setState({ loadingInfo: false });
        this.doAction();
      }
    }

    // load user
    if (!this.param[Config.Param.STUDENT_ID]) {
      finish();
    } else {
      graphql(`query {user(ID:${this.param[Config.Param.STUDENT_ID]}) { first_name } }`).then(res => {
        let studentName = "";
        try {
          studentName = res.data.data.user.first_name;
        } catch (err) { };
        this.setState({ studentName: studentName });
        finish();
      });
    }

    // load company
    if (!this.param[Config.Param.COMPANY_ID]) {
      finish();
    } else {
      graphql(`query {company(ID:${this.param[Config.Param.COMPANY_ID]}) { name } }`).then(res => {
        let companyName = "";
        try {
          companyName = res.data.data.company.name;
        } catch (err) { };
        this.setState({ companyName: companyName });
        finish();
      });
    }

  }

  doAction() {
    console.log("Start do action")
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
      this.title = <h4>Hi {this.state.studentName} !</h4>;

      let companyDetail = ` interview `;
      if (this.state.companyName) {
        companyDetail += `with ${this.state.companyName}`;
      }

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


    console.log("query", query);
    // return;
    if (query !== null) {
      getAxiosGraphQLQuery(query).then(res => {
        this.setState(() => {
          return { loading: false };
        });
      });
    } else {
      console.log("query is null")
      this.setState(() => {
        return { loading: false };
      });
    }
  }

  render() {
    var view = <div />;
    if (this.state.loadingInfo) {
      view = <Loader size="3" text={"Loading info..."} />;
    }
    if (this.state.loading) {
      view = [this.title, <Loader size="3" text={this.textLoading} />];
    } else {
      view = [this.title, this.viewDone];
    }

    return (
      <div style={{ padding: "15px" }}>
        {view}
      </div>
    );
  }
}
