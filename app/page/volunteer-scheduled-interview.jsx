import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Prescreen, PrescreenEnum, CFSMeta } from "../../config/db-config";
import {
  getAxiosGraphQLQuery,
  getPHPNotificationApiAxios
} from "../../helper/api-helper";
import {
  getAuthUser,
  isRoleVolunteer,
  isRoleAdmin,
  getCFObj
} from "../redux/actions/auth-actions";
import * as layoutActions from "../redux/actions/layout-actions";
import { ActivityType } from "../redux/actions/hall-actions";
import PropTypes from "prop-types";
import { RootPath } from "../../config/app-config";
import { Time } from "../lib/time";
import GeneralFormPage from "../component/general-form";
import { createUserTitle } from "./users";
import { emitHallActivity } from "../socket/socket-client";
import Tooltip from "../component/tooltip";
import {
  createUserDocLinkList,
  createUserMajorList
} from "./partial/popup/user-popup";
import { createCompanyTitle } from "./admin-company";

// included in my-activity for recruiter
// add as form only in past session in my-activity
export default class VolunteerScheduledInterview extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = getAuthUser();
    this.search = {};
    this.state = {
      key: 0
    };
  }

  componentWillMount() {
    this.dataTitle = "Manage Scheduled Interview";

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

    this.getButtonEndSession = d => {
      let buttonEndSession = null;
      if (d.status != PrescreenEnum.STATUS_ENDED) {
        if (
          d.join_url ||
          (d.is_onsite_call == 1 &&
            getCFObj()[CFSMeta.HALL_CFG_ONSITE_CALL_USE_GROUP] == 1)
        ) {
          buttonEndSession = (
            <button
              className="btn btn-danger btn-sm"
              data-student={d.student.first_name + " " + d.student.last_name}
              data-company={d.company.name}
              data-company_id={d.company_id}
              data-id={d.ID}
              onClick={e => {
                this.endSessionOnClick(e);
              }}
            >
              End Session
            </button>
          );
        }
      }

      return buttonEndSession;
    };

    this.endSessionOnClick = e => {
      let ID = e.currentTarget.dataset.id;
      let student = e.currentTarget.dataset.student;
      let company_id = e.currentTarget.dataset.company_id;
      let company = e.currentTarget.dataset.company;

      layoutActions.confirmBlockLoader(
        <div>
          Ending video call session between <b>{student}</b> and{" "}
          <b>{company}</b>
          <br></br>
          <small>
            <i>This action cannot be undone</i>
          </small>
        </div>,
        () => {
          layoutActions.loadingBlockLoader("Ending Session.. Please Wait..");
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


      return [
        <td>{d.ID}</td>,
        <td>{this.getButtonEndSession(d)}</td>,
        <td>{d.cf.join(", ")}</td>,
        <td>
          {createUserTitle(d.student, this.search.student)}
          <br></br>
          <b>{d.student.phone_number}</b>
          <br></br>
          <i>{d.student.university}</i>
        </td>,
        <td>{createCompanyTitle(d.company)}</td>,
        <td>{status}</td>,
        <td>{Time.getString(d[Prescreen.APPNMENT_TIME])}</td>,
        <td>{onsite_call}</td>,
        <td>{Time.getString(d[Prescreen.UPDATED_AT])}</td>,
        <td>
          <div style={{ width: "100px" }}>{d.join_url}</div>
        </td>
      ];
    };

    this.tableHeader = (
      <thead>
        <tr>
          <td>#</td>
          <th>ID</th>
          <th>End Session</th>
          <th>Career Fair</th>
          <th>Student</th>
          <th>Company</th>
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
      {
        label: "Career Fair",
        name: "cf",
        type: "text",
        placeholder:"INTEL, MDEC, etc"
      }
    ];

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
    this.loadData = (page, offset) => {
      var query = `query{
                  prescreens(${this.searchParams}
                  , not_prescreen:1
                  , page:${page}
                  , offset:${offset}
                  , order_by:"appointment_time desc, status asc"
                  ) 
                  {
                    cf
                    ID
                    company_id
                    company{ID name cf}
                    status
                    special_type
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

  render() {
    return (
      <GeneralFormPage
        key={this.state.key}
        searchFormNonPopup={true}
        dataTitle={this.dataTitle}
        noMutation={true}
        actionFirst={true}
        canEdit={true}
        entity="prescreen"
        actionFirst={true}
        entity_singular="Scheduled Session"
        addButtonText="Add New"
        noMutation={true}
        canEdit={true}
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
