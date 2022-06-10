import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Prescreen, PrescreenEnum, CFSMeta } from "../../config/db-config";
import {
  getAxiosGraphQLQuery,
  getPHPNotificationApiAxios,
  graphql
} from "../../helper/api-helper";
import {
  getAuthUser,
  isRoleVolunteer,
  isRoleAdmin,
  getCFObj,
  isRoleOrganizer,
  getCF
} from "../redux/actions/auth-actions";
import * as layoutActions from "../redux/actions/layout-actions";
import { ActivityType } from "../redux/actions/hall-actions";
import PropTypes from "prop-types";
import { RootPath } from "../../config/app-config";
import { Time } from "../lib/time";
import GeneralFormPage from "../component/general-form";
import { StatisticFigure } from "../component/statistic";
import { createUserTitle } from "./users";
import { emitHallActivity } from "../socket/socket-client";
import Tooltip from "../component/tooltip";
import {
  createUserDocLinkList,
  createUserMajorList
} from "./partial/popup/user-popup";
import { createCompanyTitle } from "./admin-company";
import { Loader } from "../component/loader";
import { confirmUpdatePrescreen } from "./partial/hall-recruiter/hall-recruiter-interview";

// included in my-activity for recruiter
// add as form only in past session in my-activity
export default class VolunteerScheduledInterview extends React.Component {
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
    this.dataTitle = "Manage Scheduled Interview";

    this.loadCount();

    this.successAddHandler = d => {
      //   if (this.props.formOnly) {
      //     var link = isRoleAdmin()
      //       ? `${RootPath}/app/manage-company/${d.company_id}/scheduled-interview`
      //       : `${RootPath}/app/my-activity/scheduled-session`;
      //     var mes = (
      //       <div>
      //         New Session Have Been Successfully Scheduled
      //         <br></br>
      //         <NavLink
      //           onClick={() => {
      //             layoutActions.storeHideBlockLoader();
      //           }}
      //           to={link}
      //         >
      //           Manage Scheduled Session
      //         </NavLink>
      //       </div>
      //     );
      //     if (this.props.isFormStudentListing) {
      //       mes = (
      //         <div>
      //           New private call has been successfully scheduled. View call at{" "}
      //           <NavLink
      //             onClick={() => {
      //               layoutActions.storeHideBlockLoader();
      //             }}
      //             to={`${RootPath}/app/`}
      //           >
      //             Home Page
      //           </NavLink>{" "}
      //           under My Activity section.
      //         </div>
      //       );
      //     }
      //     layoutActions.successBlockLoader(mes);
      //     if (this.props.successAddHandlerExternal) {
      //       this.props.successAddHandlerExternal(d);
      //     }
      // after success add scheduled interview
      // emit to student only
      // emit to reload scheduled interview
    };


    this.getButtonApproveSession = d => {
      let toRet = null;
      if (
        [PrescreenEnum.STATUS_WAIT_CONFIRM,
        PrescreenEnum.STATUS_RESCHEDULE,
        PrescreenEnum.STATUS_REJECTED].indexOf(d.status) >= 0
      ) {
        toRet = (
          <button
            className="btn btn-success btn-sm btn-bold btn-round-5"
            data-student={d.student.first_name + " " + d.student.last_name}
            data-company={d.company.name}
            data-company_id={d.company_id}
            data-id={d.ID}
            onClick={e => {
              this.updateStatusOnClick(e, PrescreenEnum.STATUS_APPROVED);
            }}
          >
            Approve Session
          </button>
        );
      }

      return toRet;
    };

    this.getButtonEndSession = d => {
      let buttonEndSession = null;
      if (d.status != PrescreenEnum.STATUS_ENDED) {
        if (
          d.join_url
          // || (d.is_onsite_call == 1 && getCFObj()[CFSMeta.HALL_CFG_ONSITE_CALL_USE_GROUP] == 1)
        ) {
          buttonEndSession = (
            <button
              className="btn btn-danger btn-sm btn-bold btn-round-5"
              data-student={d.student.first_name + " " + d.student.last_name}
              data-company={d.company.name}
              data-company_id={d.company_id}
              data-id={d.ID}
              onClick={e => {
                this.updateStatusOnClick(e, PrescreenEnum.STATUS_ENDED);
              }}
            >
              End Session
            </button>
          );
        }
      }

      return buttonEndSession;
    };

    this.updateStatusOnClick = (e, status) => {
      let ID = e.currentTarget.dataset.id;
      let student = e.currentTarget.dataset.student;
      let company_id = e.currentTarget.dataset.company_id;
      let company = e.currentTarget.dataset.company;
      let mes = "";
      if (status == PrescreenEnum.STATUS_APPROVED) {
        mes = "Approving";
      }
      else if (status == PrescreenEnum.STATUS_ENDED) {
        mes = "Ending";
      }

      layoutActions.confirmBlockLoader(
        <div>
          {mes} video call session between <b>{student}</b> and{" "}<b>{company}</b>
          <br></br>
          <small><i>This action cannot be undone</i></small>
        </div>,
        () => {
          layoutActions.loadingBlockLoader("Please Wait..");

          if (status == PrescreenEnum.STATUS_APPROVED) {
            let q = `mutation { edit_prescreen(ID:${ID}, status:"${PrescreenEnum.STATUS_APPROVED}", updated_by: ${getAuthUser().ID}) {ID status} }`
            graphql(q).then(res => {
              layoutActions.successBlockLoader("Successfully Approve Session. Please refresh page to see the changes");
            })
          }
          else if (status == PrescreenEnum.STATUS_ENDED) {
            var pass_params = {
              ID: ID
            };
            getPHPNotificationApiAxios("delete-daily-co-room", pass_params).then(
              res => {
                if (
                  typeof res.data == "string" &&
                  res.data.indexOf("success") >= 0
                ) {
                  layoutActions.successBlockLoader("Successfully End Session");
                  this.setState(prevState => {
                    return { key: prevState.key + 1 };
                  });

                  emitHallActivity(ActivityType.PRESCREEN, null, company_id);
                } else {
                  layoutActions.errorBlockLoader("Error Message : " + res.data);
                }
              }
            );
          }



        },
        () => { }
      );
    };
    //##########################################
    // render table
    this.renderRow = d => {
      let labelClass = "";
      let labelText = "";
      switch (d.status) {
        case PrescreenEnum.STATUS_APPROVED:
          labelClass = "success";
          labelText = "Approved";
          break;
        case PrescreenEnum.STATUS_STARTED:
          labelClass = "primary";
          labelText = "Started";
          break;
        case PrescreenEnum.STATUS_ENDED:
          labelClass = "danger";
          labelText = "Ended";
          break;
        case PrescreenEnum.STATUS_CANCEL:
          labelClass = "default";
          labelText = "Canceled";
          break;
        case PrescreenEnum.STATUS_WAIT_CONFIRM:
          labelClass = "warning";
          labelText = "Pending";
          break;
        case PrescreenEnum.STATUS_RESCHEDULE:
          labelClass = "info";
          labelText = "Reschedule Requested";
          break;
        case PrescreenEnum.STATUS_REJECTED:
          labelClass = "danger";
          labelText = "Rejected";
          break;
      }
      let status = (
        <label className={`label label-${labelClass}`}>{labelText}</label>
      );

      let onsite_call =
        d[Prescreen.IS_ONSITE_CALL] == "1" ? (
          <label className={`label label-warning`}>On-site Call</label>
        ) : <label className={`label label-default`}>Virtual Call</label>;

      let studentInfo = <td>
        {createUserTitle(d.student, this.search.student)}
        <br></br>
        <b>{d.student.phone_number}</b>
        <br></br>
        <i>{d.student.university}</i>
      </td>;
      let companyInfo = <td>{createCompanyTitle(d.company)}</td>;
      let interviewerInfo = <td>{d.recruiter ? `${d.recruiter.first_name} ${d.recruiter.last_name}` : `-`}</td>
      let timeInfo = <td>{Time.getString(d[Prescreen.APPNMENT_TIME])}</td>;
      let actions = <td><btn className="btn btn-xs btn-default"
        id={d.ID}
        data-other_id={d.student.ID}
        data-other_name={d.student.first_name}
        onClick={e => {
          confirmUpdatePrescreen(
            e,
            PrescreenEnum.STATUS_CANCEL
          );
        }}>
        Cancel
        </btn>
      </td>
      return isRoleOrganizer()
        ? [
          <td>{d.ID}</td>,
          studentInfo,
          companyInfo,
          interviewerInfo,
          timeInfo,
          <td>{status}</td>,
          actions,
        ]
        : [
          <td>{d.ID}</td>,
          <td>{this.getButtonApproveSession(d)}<br></br>{this.getButtonEndSession(d)}</td>,
          <td>{d.cf.join(", ")}</td>,
          studentInfo,
          companyInfo,
          interviewerInfo,
          <td>{status}</td>,
          timeInfo,
          <td>{onsite_call}</td>,
          <td>{Time.getString(d[Prescreen.UPDATED_AT])}</td>,
          <td>
            <div style={{ width: "100px" }}>{d.join_url}</div>
          </td>
        ];
    };

    this.tableHeader = isRoleOrganizer()
      ? (
        <thead>
          <tr>
            <th>Interview ID</th>
            <th>Participant</th>
            <th>Company</th>
            <th>Interviewer</th>
            <th>Appointment Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
      )
      : (
        <thead>
          <tr>
            <td>#</td>
            <th>Interview ID</th>
            <th>Action</th>
            <th>Career Fair</th>
            <th>Participant</th>
            <th>Company</th>
            <th>Interviewer</th>
            <th>Status</th>
            <th>Appointment Time</th>
            <th>Is On-site Call?</th>
            <th>Last Updated</th>
            <th>Join Url</th>
          </tr>
        </thead>
      );

    //##########################################
    //  search
    this.searchParams = "";
    this.searchFormItem = [
      {
        label: "Find Student",
        name: "student",
        type: "text",
        placeholder: "Type student name or email"
      },

    ];

    if (!isRoleOrganizer()) {
      this.searchFormItem.push({
        label: "Career Fair",
        name: "cf",
        type: "text",
        placeholder: "INTEL, MDEC, etc"
      })
    }

    this.searchFormOnSubmit = d => {
      this.search = d;
      this.searchParams = "";
      if (d != null) {
        this.searchParams += d.student ? `student_name:"${d.student}",` : "";
        this.searchParams += d.student ? `student_email:"${d.student}",` : "";
        this.searchParams += d.cf ? `cf:"${d.cf}",` : "";
        this.searchParams +=
          d.status && d.status != "ALL" ? `status:"${d.status}",` : "";
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
                  prescreens(${this.getQueryParam({ page: page, offset: offset, isCount: false })}) 
                  {
                    cf
                    ID
                    company_id
                    company{ID name cf}
                    status
                    special_type
                    recruiter{first_name last_name}
                    is_onsite_call
                    appointment_time
                    join_url
                    updated_at
                    student{
                      ID university phone_number major minor doc_links{url label}
                      first_name last_name user_email
                    }
                  }
                }`;
      return getAxiosGraphQLQuery(query);
    };

    // get actual data from loadData
    // can alter any data here too
    this.getDataFromRes = res => {
      var ps = res.data.data.prescreens;
      return ps;
    };

    //##########################################
    // form operation properties
    // hook before submit
    this.formWillSubmit = (d, edit) => {
      d[Prescreen.UPDATED_BY] = getAuthUser().ID;
      return d;
    };

    this.forceDiff = [];

    this.getEditFormDefault = ID => {
      const query = `query{prescreen(ID:${ID}){
                  ID
                  status
                }}`;

      return getAxiosGraphQLQuery(query).then(res => {
        var data = res.data.data.prescreen;
        return data;
      });
    };

    this.newFormDefault = this.props.defaultFormItem;

    // ni utk create from student listing
    this.getFormItem = edit => {
      return this.getFormData(edit);
    };

    // create form add new default
    this.getFormItemAsync = edit => {
      var singleStudent = this.props.formOnly;
      var studentId = this.props.defaultFormItem[Prescreen.STUDENT_ID];
      var query = "";
      if (typeof studentId !== "undefined") {
        query = `query{user(ID:${this.props.defaultFormItem[Prescreen.STUDENT_ID]
          })
                      {ID
                      first_name
                      last_name}}`;
      } else {
        // this not really needed
        query = `query{prescreen(ID:1){ID}}`;
      }

      return getAxiosGraphQLQuery(query).then(res => {
        var isNormal = false;
        var studentData = [];
        if (singleStudent) {
          var user = res.data.data.user;
          studentData = [
            { key: user.ID, label: user.first_name + " " + user.last_name }
          ];
        }

        if (this.props.company_id !== null) {
          return this.getFormData(edit, singleStudent, studentData, null);
        } else {
          var queryCompany = `query{
                              companies{
                                ID
                                name
                              }
                            }`;
          return getAxiosGraphQLQuery(queryCompany).then(resCompany => {
            var com = resCompany.data.data.companies;
            var companyData = com.map((d, i) => {
              return { key: d.ID, label: d.name };
            });
            return this.getFormData(
              edit,
              singleStudent,
              studentData,
              companyData
            );
          });
        }
      });
    };

    // kalau utk isFormStudentListing kita taknak load user or company info dulu
    if (this.props.isFormStudentListing === true) {
      this.getFormItemAsync = undefined;
    }
  }

  getQueryParam({ page, offset, isCount }) {
    return `
      , not_prescreen:1
      ${!isCount ? `${this.searchParams}` : ''}
      ${!isCount ? `, order_by:"appointment_time desc, status asc"` : ''}
      ${page && offset ? `, page:${page}` : ""}
      ${page && offset ? `, offset:${offset}` : ""}
      ${isRoleOrganizer() ? `,cf: "${getCF()}"` : ""}`
  }

  loadCount() {
    let q = `query{
      prescreens_count(${this.getQueryParam({ isCount: true })})
      
    }`;
    getAxiosGraphQLQuery(q).then(res => {
      var count = res.data.data.prescreens_count;
      this.setState({ count: count, loadingCount: false });
    });
  }

  getFormData(edit) {
    var ret = [
      { header: "Scheduled Session Form" },
      {
        label: "Status",
        sublabel:
          "Update to Ended if student had finish video call with recruiter",
        name: Prescreen.STATUS,
        type: "select",
        required: true,
        data: [PrescreenEnum.STATUS_APPROVED, PrescreenEnum.STATUS_ENDED]
      }
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
        isSearchOnLeft={isRoleOrganizer() ? true : false}
        contentBelowTitle={this.getCountAndExport()}
        searchFormNonPopup={true}
        dataTitle={isRoleOrganizer() ? "Interviews" : this.dataTitle}
        noMutation={true}
        actionFirst={true}
        canEdit={isRoleOrganizer() ? false : true}
        entity="prescreen"
        actionFirst={true}
        entity_singular="Scheduled Session"
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
        // getFormItemAsync={this.getFormItemAsync}
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

VolunteerScheduledInterview.PropTypes = {
  isFormStudentListing: PropTypes.bool,
  isFormHidden: PropTypes.func,
  company_id: PropTypes.number.isRequired,
  prescreen_only: PropTypes.bool,
  defaultFormItem: PropTypes.object,
  successAddHandlerExternal: PropTypes.func,
  formOnly: PropTypes.bool // to create from past sessions list
};

VolunteerScheduledInterview.defaultProps = {
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
