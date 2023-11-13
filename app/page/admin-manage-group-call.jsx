import React, { Component } from "react";
import {
  getAxiosGraphQLQuery,
} from "../../helper/api-helper";
import {
  getAuthUser,
  isRoleOrganizer,
} from "../redux/actions/auth-actions";
import PropTypes from "prop-types";
import { Time } from "../lib/time";
import GeneralFormPage from "../component/general-form";
import { StatisticFigure } from "../component/statistic";
import { createCompanyTitle } from "./admin-company";
import { Loader } from "../component/loader";

// included in my-activity for recruiter
// add as form only in past session in my-activity
export default class AdminManageGroupCall extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = getAuthUser();
    this.search = {};
    this.state = {
      key: 0,
      count: null,
      loadingCount: true
    };
  }

  componentWillMount() {
    this.dataTitle = "Manage Group Call";

    this.loadCount();

    this.successAddHandler = d => {
    };


    //##########################################
    // render table
    this.renderRow = d => {
      let companyInfo = <td>{createCompanyTitle(d.company)}</td>;
      let status = <td>{
        d.is_canceled == 1 ? <label className={`label label-danger`}>Canceled</label> : null
      }</td>

      return [<td>{d.ID}</td>,
        companyInfo,
      <td>{d.cf}</td>,
      <td>{d.name}</td>,
      <td>{d.url}</td>,
      <td>{Time.getString(d["appointment_time"])}</td>,
        status,
      <td>{Time.getString(d["updated_at"])}</td>,
      ]
    };

    this.tableHeader = (
      <thead>
        <tr>
          <th>#</th>
          <th>ID</th>
          <th>Company</th>
          <th>Career Fair</th>
          <th>Group Call Name</th>
          <th>Url</th>
          <th>Appointment Time</th>
          <th>Status</th>
          <th>Last Updated</th>
        </tr>
      </thead>
    );

    //##########################################
    //  search
    this.searchParams = "";
    this.searchFormItem = [
      {
        label: "Find By Company",
        name: "company",
        type: "text",
        placeholder: "Type company name"
      },

    ];

    this.searchFormItem.push({
      label: "Career Fair",
      name: "cf",
      type: "text",
      placeholder: "INTEL, MDEC, etc"
    })

    this.searchFormOnSubmit = d => {
      this.search = d;
      this.searchParams = "";
      if (d != null) {
        this.searchParams += d.company ? `company_name:"${d.company}",` : "";
        this.searchParams += d.cf ? `cf:"${d.cf}",` : "";
      }
    };

    //##########################################
    //  loadData
    /**
     ${this.searchParams}
                  , not_prescreen:1
                  , page:${page}
                  , offset:${offset}
                  , order_by:"appointment_time desc, status asc"
                  ${isRoleOrganizer() ? `,cf: "${getCF()}"` : ""}
     */
    this.loadData = (page, offset) => {
      var query = `query{
                  group_calls ${this.getQueryParam({ page: page, offset: offset, isCount: false })} 
                  {
                    ID
                    cf
                    is_canceled
                    name
                    company_id
                    company{ID name}
                    url
                    appointment_time
                    created_at
                    updated_at
                  }
                }`;
      return getAxiosGraphQLQuery(query);
    };

    // get actual data from loadData
    // can alter any data here too
    this.getDataFromRes = res => {
      var ps = res.data.data.group_calls;
      return ps;
    };

    //##########################################
    // form operation properties
    // hook before submit
    this.formWillSubmit = (d, edit) => {
      d["updated_by"] = getAuthUser().ID;
      return d;
    };

    this.forceDiff = [];

    this.getEditFormDefault = ID => {
      const query = `query{group_call(ID:${ID}){
                  ID
                  name 
                  url
                }}`;

      return getAxiosGraphQLQuery(query).then(res => {
        var data = res.data.data.group_call;
        return data;
      });
    };

    this.newFormDefault = this.props.defaultFormItem;

    // ni utk create from student listing
    this.getFormItem = edit => {
      return this.getFormData(edit);
    };

    // create form add new default


  }

  getQueryParam({ page, offset, isCount }) {
    let r = "";
    if (this.searchParams) {
      r += ` ${this.searchParams} `;
    }

    if (!isCount) {
      r += `
        order_by : "gc.updated_at desc"
        ${page && offset ? `, page:${page}` : ""}
        ${page && offset ? `, offset:${offset}` : ""}
      `
    }


    if (!r) {
      return "";
    }
    return `(${r})`;
  }

  loadCount() {
    let q = `query{
      group_calls_count ${this.getQueryParam({ isCount: true })}
      
    }`;
    getAxiosGraphQLQuery(q).then(res => {
      var count = res.data.data.group_calls_count;
      this.setState({ count: count, loadingCount: false });
    });
  }

  getFormData(edit) {
    var ret = [
      { header: "Group Call Form" },
      {
        label: "Group Call Name",
        name: "name",
        type: "text",
        required: true,
      },
      {
        label: "Url",
        name: "url",
        type: "text",
      },
    ];
    return ret;
  }

  getCountAndExport() {
    if (!isRoleOrganizer()) {
      return null;
    }

    if (this.state.loadingCount) {
      return <Loader></Loader>
    }
    return <div className="container-fluid" style={{ margin: '32px 0px' }}>
      <StatisticFigure title="Total Interviews" icon="comments" value={this.state.count} color="#469fec"></StatisticFigure>
    </div>
  }

  render() {
    return (
      <GeneralFormPage
        key={this.state.key}
        contentBelowTitle={this.getCountAndExport()}
        searchFormNonPopup={true}
        dataTitle={"Group Call"}
        noMutation={true}
        canEdit={true}
        actionFirst={true}
        entity="group_call"
        entity_singular="Group Call"
        addButtonText="Add New"
        noMutation={true}
        dataOffset={20}
        searchFormItem={this.searchFormItem}
        searchFormOnSubmit={this.searchFormOnSubmit}
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
        formOnly={this.props.formOnly}
      ></GeneralFormPage>
    );
  }
}

AdminManageGroupCall.PropTypes = {
  isFormStudentListing: PropTypes.bool,
  isFormHidden: PropTypes.func,
  company_id: PropTypes.number.isRequired,
  prescreen_only: PropTypes.bool,
  defaultFormItem: PropTypes.object,
  successAddHandlerExternal: PropTypes.func,
  formOnly: PropTypes.bool // to create from past sessions list
};

AdminManageGroupCall.defaultProps = {
  isFormStudentListing: false,
  isFormHidden: name => {
    return false;
  },
  prescreen_only: false,
  successAddHandlerExternal: false,
  prescreen_only: false,
  formOnly: false,
  defaultFormItem: {}
};
