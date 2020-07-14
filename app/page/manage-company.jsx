import React, { Component } from "react";
import { Redirect, NavLink } from "react-router-dom";
import Form, {
  toggleSubmit,
  checkDiff,
  getDataCareerFair
} from "../component/form";
import {
  Session,
  Prescreen,
  PrescreenEnum,
  UserMeta,
  User,
  Vacancy,
  VacancyEnum,
  UserEnum,
  Skill
} from "../../config/db-config";
import {
  Company,
  CompanyEnum,
  DocLink,
  DocLinkEnum
} from "../../config/db-config";
import { ButtonLink } from "../component/buttons.jsx";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import obj2arg from "graphql-obj2arg";
import {
  getAuthUser,
  isRoleRec,
  updateAuthUser,
  isRoleOrganizer,
  isRoleAdmin,
  getCFObj
} from "../redux/actions/auth-actions";
import { Loader } from "../component/loader";
import ProfileCard from "../component/profile-card.jsx";
import { BANNER_HEIGHT, BANNER_WIDTH } from "../component/profile-card-img";
import SubNav from "../component/sub-nav";
import List, { CustomList } from "../component/list";
import * as layoutActions from "../redux/actions/layout-actions";
import CompanyPopup from "./partial/popup/company-popup";
import VacancyPopup from "./partial/popup/vacancy-popup";
import { store } from "../redux/store";
import DocLinkPage from "../component/doc-link-form.jsx";
import { SimpleListItem } from "../component/list";
import PropTypes from "prop-types";
import { RootPath, AppPath } from "../../config/app-config";
import { Time } from "../lib/time";
import GeneralFormPage from "../component/general-form";
import Restricted from "./partial/static/restricted";
import UserPopup from "./partial/popup/user-popup";
import { SessionsList } from "./partial/activity/session";
import { ResumeDrop } from "./partial/activity/resume-drop";

import { StudentListing } from "./partial/activity/student-listing.jsx";
import { ScheduledInterview } from "./partial/activity/scheduled-interview";
import CompanyPage from "./company";
import ManageTag from "./tag";

const PageUrl = `${RootPath}/app/manage-company/vacancy`;

class VacancySubPage extends React.Component {
  constructor(props) {
    super(props);
    const authUser = getAuthUser();
    this.company_id = this.props.company_id;
    this.user_id = authUser.ID;
  }

  componentWillMount() {
    //##########################################
    // List data properties
    this.renderRow = d => {
      var title = (
        <a
          onClick={() =>
            layoutActions.storeUpdateFocusCard(d.title, VacancyPopup, {
              id: d.ID
            })
          }
        >
          {d.title}
        </a>
      );

      return [
        <td>{d.ID}</td>,
        <td>
          <b>{title}</b>
        </td>,
        <td>{d.type}</td>,
        <td>{d.location}</td>,
        <td>{Time.getString(d.updated_at)}</td>
      ];
    };

    this.tableHeader = (
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Type</th>
          <th>Location</th>
          <th>Last Updated</th>
        </tr>
      </thead>
    );

    this.loadData = (page, offset) => {
      var param = {
        company_id: this.company_id,
        page: page,
        offset: offset,
        order_by: Vacancy.UPDATED_AT + " desc"
      };

      var query = `query{vacancies(${obj2arg(param, { noOuterBraces: true })})
            {ID title location type updated_at}}`;
      return getAxiosGraphQLQuery(query);
    };

    // get actual data from loadData
    // can alter any data here too
    this.getDataFromRes = res => {
      return res.data.data.vacancies;
    };

    //##########################################
    // form operation properties

    // if ever needed
    // hook before submit
    this.formWillSubmit = (d, edit) => {
      return d;
    };

    this.getEditFormDefault = ID => {
      const query = `query{
                vacancy(ID:${ID}) {
                  ID
                  title
                  location
                  description
                  requirement
                  type
                  application_url
                  location
                }
              }`;

      return getAxiosGraphQLQuery(query).then(res => {
        var vacan = res.data.data.vacancy;
        return vacan;
      });
    };

    // create form add new default
    this.newFormDefault = {};
    this.newFormDefault[Vacancy.COMPANY_ID] = this.company_id;
    this.newFormDefault[Vacancy.CREATED_BY] = this.user_id;

    this.getFormItem = edit => {
      return [
        { header: "Job Post Form" },
        {
          label: "Title",
          name: Vacancy.TITLE,
          type: "text",
          placeholder: "Software Developer",
          required: true
        },
        {
          label: "Company Id",
          name: Vacancy.COMPANY_ID,
          type: "number",
          disabled: true,
          hidden: true,
          required: !edit
        },
        {
          label: "Created By",
          name: Vacancy.CREATED_BY,
          type: "number",
          disabled: true,
          hidden: true,
          required: !edit
        },
        {
          label: "Type",
          name: Vacancy.TYPE,
          type: "select",
          required: true,
          data: [
            VacancyEnum.TYPE_FULL_TIME,
            VacancyEnum.TYPE_PART_TIME,
            VacancyEnum.TYPE_INTERN
          ]
        },
        {
          label: "Application Url",
          name: Vacancy.APPLICATION_URL,
          type: "text"
        },
        {
          label: "Location",
          name: "location",
          type: "input_suggestion",
          table_name: "location",
          required: true
        },
        {
          label: "Description",
          name: Vacancy.DESCRIPTION,
          type: "textarea",
          placeholder: "Tell more about the Job Post"
        },
        {
          label: "Requirement",
          name: Vacancy.REQUIREMENT,
          type: "textarea"
        }
      ];
    };
  }

  render() {
    return (
      <GeneralFormPage
        dataTitle="Job Posts"
        entity="vacancy"
        entity_singular="Job Post"
        addButtonText="Add New Job Post"
        dataOffset={10}
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
VacancySubPage.PropTypes = {
  company_id: PropTypes.number.isRequired
};

//###################################################################################################
//###################################################################################################

class CompanyDocLink extends React.Component {
  render() {
    return (
      <DocLinkPage entity="company" id={this.props.company_id}></DocLinkPage>
    );
  }
}
CompanyDocLink.PropTypes = {
  company_id: PropTypes.number.isRequired
};

//###################################################################################################
//###################################################################################################

class AboutSubPage extends React.Component {
  constructor(props) {
    super(props);
    this.formOnSubmit = this.formOnSubmit.bind(this);
    this.state = {
      error: null,
      disableSubmit: false,
      init: true,
      data: null,
      success: null
    };
  }

  getDataPriv() {
    let dataPriv = [
      { key: "0", label: "No Privilege" },
      {
        key: CompanyEnum.PRIV.ACCESS_ALL_STUDENT,
        label: "Access ALL Student Resume"
      },
      {
        key: CompanyEnum.PRIV.ACCESS_RS_PRE_EVENT,
        label: "Access Resume Drop BEFORE Event"
      },
      {
        key: CompanyEnum.PRIV.ACCESS_RS_DURING_EVENT,
        label: "Access Resume Drop DURING Event"
      },
      {
        key: CompanyEnum.PRIV.SCHEDULE_PRIVATE_SESSION,
        label: "Schedule 1-1 Session"
      }
    ];

    let allKeys = dataPriv.map((d, i) => {
      return d.key;
    });
    for (var i in CompanyEnum.PRIV) {
      if (allKeys.indexOf(CompanyEnum.PRIV[i]) <= -1) {
        dataPriv.push({
          key: CompanyEnum.PRIV[i],
          label: CompanyEnum.PRIV[i]
        });
      }
    }

    return dataPriv;
  }

  componentWillMount() {
    this.company_id = this.props.company_id;

    var query = `query {
            company(ID:${this.company_id}) {
              ID
              name
              cf
              type
              tagline
              description
              more_info
              img_url
              img_position
              img_size
              banner_url
              banner_position
              banner_size
              priviledge
              status
              message_drop_resume
              group_url
              rec_privacy
              accept_prescreen
              sponsor_only
          }}`;

    getAxiosGraphQLQuery(query).then(res => {
      this.setState(() => {
        var com = res.data.data.company;
        com[Company.PRIVILEDGE] = CompanyEnum.parsePrivs(
          com[Company.PRIVILEDGE]
        );
        return { data: res.data.data.company, init: false };
      });
    });

    this.formItems = [];

    // for admin
    if (isRoleAdmin() || isRoleOrganizer()) {
      var dataCF = getDataCareerFair();
      dataCF.push({ key: "NONE", label: "No Career Fair" });

      this.formItems.push(
        ...[
          { header: "Admin Only" },
          {
            label: "Name",
            name: Company.NAME,
            type: "text",
            placeholder: "Company Name",
            required: true
          },
          {
            label: "Priviledge",
            name: Company.PRIVILEDGE,
            type: "checkbox",
            data: this.getDataPriv()
          },
          {
            label: "Type",
            name: Company.TYPE,
            type: "select",
            data: [
              {
                key: CompanyEnum.TYPE_NORMAL,
                label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_NORMAL)
              },
              {
                key: CompanyEnum.TYPE_GOLD,
                label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_GOLD)
              },
              {
                key: CompanyEnum.TYPE_SILVER,
                label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_SILVER)
              },
              {
                key: CompanyEnum.TYPE_BRONZE,
                label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_BRONZE)
              },
              {
                key: CompanyEnum.TYPE_PLATINUM,
                label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_PLATINUM)
              },
              {
                key: CompanyEnum.TYPE_SPECIAL,
                label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_SPECIAL)
              }
            ],
            required: true
          },
          {
            label: "Career Fair",
            name: Company.CF,
            type: "checkbox",
            data: dataCF
          },
          {
            label: "Status",
            name: Company.STATUS,
            type: "select",
            data: [
              CompanyEnum.STS_OPEN,
              CompanyEnum.STS_CLOSED,
              CompanyEnum.STS_PS,
              CompanyEnum.STS_RD,
              CompanyEnum.STS_GS
            ],
            required: true
          },
          {
            label: "Group Session Url",
            sublabel: `Please make sure status has been set to '${CompanyEnum.STS_GS}'`,
            name: Company.GROUP_URL,
            type: "text",
            placeholder: "Enter Zoom Url Here"
          },
          {
            label: "Is Sponsor Only?",
            sublabel: "Sponsor only company will have NO booth in job fair",
            name: Company.SPONSOR_ONLY,
            type: "radio",
            required: true,
            data: [{ key: 1, label: "Yes" }, { key: 0, label: "No" }]
          },
          {
            label: "Accept Prescreen?",
            name: Company.ACCEPT_PRESCREEN,
            type: "radio",
            required: true,
            data: [{ key: 1, label: "Yes" }, { key: 0, label: "No" }]
          }
        ]
      );
    }

    this.formItems.push(
      ...[
        { header: "Basic Information" },
        {
          label: "Tagline",
          name: Company.TAGLINE,
          type: "text",
          placeholder: "Company Tagline"
        },
        {
          label: "Description",
          name: Company.DESCRIPTION,
          type: "textarea",
          rows: 6,
          placeholder: "Tell more about your company"
        },
        {
          label: "Additional Information",
          name: Company.MORE_INFO,
          type: "textarea",
          rows: 6,
          placeholder:
            "Anything you might want the student to know about the company. Upcoming events, benefits. culture, etc."
        },
        { header: "Advanced Settings" },
        {
          label: "Custom Message After Drop Resume",
          name: Company.MESSAGE_DROP_RESUME,
          type: "textarea",
          rows: 6,
          placeholder:
            "Write down custom message for students after they drop their resume"
        },
        {
          label: "Recruiter Information",
          name: Company.REC_PRIVACY,
          type: "radio",
          required: true,
          data: [
            { key: CompanyEnum.REC_PRIVACY_PUBLIC, label: "Public" },
            { key: CompanyEnum.REC_PRIVACY_PRIVATE, label: "Private" }
          ]
        }
      ]
    );
  }

  //return string if there is error
  filterForm(d) {
    return 0;
  }

  formOnSubmit(d) {
    var err = this.filterForm(d);
    if (err === 0) {
      toggleSubmit(this, { error: null, success: null });
      var update = checkDiff(
        this,
        this.state.data,
        d,
        [],
        [Company.PRIVILEDGE]
      );
      if (update === false) {
        return;
      }

      // fix priviledge
      update[Company.PRIVILEDGE] = JSON.stringify(update[Company.PRIVILEDGE]);

      update[Company.ID] = this.company_id;
      if (typeof update[Company.TYPE] !== "undefined") {
        update[Company.TYPE] = Number.parseInt(update[Company.TYPE]);
      }

      var edit_query = `mutation{edit_company(${obj2arg(update, {
        noOuterBraces: true
      })}) {ID}}`;
      getAxiosGraphQLQuery(edit_query).then(
        res => {
          var newData = Object.assign(this.state.data, d);
          toggleSubmit(this, {
            data: newData,
            error: null,
            success: "Your Change Has Been Saved!"
          });
        },
        err => {
          toggleSubmit(this, { error: err.response.data });
        }
      );
    } else {
      //console.log("Err", err);
      this.setState(() => {
        return { error: err };
      });
    }
  }

  render() {
    var content = null;
    if (this.state.init) {
      content = <Loader size="2" text="Loading Company Information"></Loader>;
    } else {
      content = (
        <div>
          <ProfileCard
            type="banner"
            customStyleParent={{ margin: "auto" }}
            custom_width={BANNER_WIDTH + "px"}
            id={this.state.data.ID}
            add_img_ops={true}
            img_url={this.state.data.banner_url}
            img_pos={this.state.data.banner_position}
            img_size={this.state.data.banner_size}
          ></ProfileCard>

          <div style={{ marginTop: "-90px" }}>
            <ProfileCard
              type="company"
              img_dimension={"130px"}
              id={this.state.data.ID}
              add_img_ops={true}
              title={<h3>{this.state.data.name}</h3>}
              subtitle={""}
              img_url={this.state.data.img_url}
              img_pos={this.state.data.img_position}
              img_size={this.state.data.img_size}
            ></ProfileCard>
            <Form
              className="form-row"
              items={this.formItems}
              onSubmit={this.formOnSubmit}
              submitText="Save Changes"
              defaultValues={this.state.data}
              disableSubmit={this.state.disableSubmit}
              error={this.state.error}
              success={this.state.success}
            ></Form>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h3>Edit Company</h3>
        {content}
      </div>
    );
  }
}

AboutSubPage.PropTypes = {
  company_id: PropTypes.number.isRequired
};

// For Recruiter ------------------------------------------------------/

export default class ManageCompanyPage extends React.Component {
  componentWillMount() {
    this.key = 1;
  }

  getSubNavItem() {
    this.sub_page = this.props.match.params.current
      ? this.props.match.params.current
      : "about";
    this.company_id = Number.parseInt(this.props.match.params.id);
    var item = {
      about: {
        label: "Edit Company",
        component: AboutSubPage,
        props: { company_id: this.company_id },
        icon: "building"
      },
      vacancy: {
        label: "Job Opportunities",
        component: VacancySubPage,
        props: { company_id: this.company_id },
        routeOnly: isRoleRec(),
        icon: "star"
      },
      "tag": {
        label: "Tags",
        component: ManageTag,
        props: { entity: "company", entity_id: this.company_id },
        icon: "slack"
      },
      "doc-link": {
        label: "Document & Link",
        component: CompanyDocLink,
        props: { company_id: this.company_id },
        icon: "file-text"
      },
      view: {
        label: "View Company",
        onClick: () => {
          this.props.history.push(`${AppPath}/company/${this.company_id}`);
          // layoutActions.storeUpdateFocusCard("My Company", CompanyPopup, {
          //     id: this.company_id
          // });
        },
        component: null,
        icon: "eye"
      }
    };

    if (isRoleAdmin()) {
      item["student-listing"] = {
        label: "Student Listing",
        component: StudentListing,
        props: {
          title: "Student Listing",
          company_id: this.company_id
        },
        icon: "users"
      };
      //.. kita tak payah guna ni sebab kita boleh guna priviledge ACCESS_ALL_STUDENT untuk contol kat page student listing
      item["all-student"] = {
        label: "All Student",
        component: StudentListing,
        props: {
          title: "All Student",
          company_id: this.company_id,
          isAllStudent: true
        },
        icon: "address-book-o"
      };
      item["session"] = {
        label: "Past Sessions",
        component: SessionsList,
        props: {
          company_id: this.company_id,
          student_id: this.student_id,
          isRec: true
        },
        icon: "comments"
      };
      item["resume-drop"] = {
        label: "Resume Drop",
        component: ResumeDrop,
        props: {
          company_id: this.company_id,
          student_id: this.student_id,
          isRec: true
        },
        icon: "download"
      };
      item["pre-screen"] = {
        label: "Pre-Screen",
        component: ScheduledInterview,
        props: { company_id: this.company_id, prescreen_only: true },
        icon: "filter"
      };
      item["scheduled-interview"] = {
        label: "Scheduled Interview",
        component: ScheduledInterview,
        props: { company_id: this.company_id },
        icon: "clock-o"
      };
    }

    var title = item[this.sub_page].label;
    document.setTitle(title);

    return item;
  }

  render() {
    if (this.company_id !== this.props.match.params.id) {
      this.key++;
    }

    // updated prop in here
    var item = this.getSubNavItem();

    if (
      !isRoleAdmin() &&
      !isRoleOrganizer() &&
      this.company_id != getAuthUser().rec_company
    ) {
      return (
        <Restricted
          title="Restricted Page"
          message="You Are Not Allowed Here"
        ></Restricted>
      );
    }

    return (
      <div key={this.key}>
        <SubNav
          route={`manage-company/${this.company_id}`}
          items={item}
          defaultItem={this.sub_page}
        ></SubNav>
      </div>
    );
  }
}
