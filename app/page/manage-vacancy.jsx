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
  CFSMeta,
} from "../../config/db-config";
import { getAxiosGraphQLQuery, postRequest } from "../../helper/api-helper";
import obj2arg from "graphql-obj2arg";
import {
  getCF,
  getAuthUser,
  isRoleRec,
  isRoleOrganizer,
  getCfCustomMeta,
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

export default class ManageVacancy extends React.Component {
  constructor(props) {
    super(props);
    const authUser = getAuthUser();
    this.company_id = this.props.company_id;
    this.user_id = authUser.ID;

    this.state = {
      countJobPost: null,
      countApplication: null,
      loadingCountJobPost: true,
      loadingCountApplication: true,
    }
  }

  componentWillMount() {
    this.loadCount();
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

      if (isRoleOrganizer()) {
        let companyTitle = d.company ? d.company.name : <div><span className="text-muted">Not Specified</span></div>
        let interestedBtn = (
          <InterestedButton
            customStyle={{ fontSize: "14px", position: 'initial' }}
            customType={"user"}
            isModeCount={true}
            isModeAction={false}
            ID={null}
            is_interested={null}
            popupTitle={"Applicants"}
            user_cf={getCF()}
            entity={"vacancies"}
            entity_id={d.ID}
            tooltipObj={{
              arrowPosition: "right",
              left: "-110px",
              bottom: "-2px",
              width: "97px",
              tooltip: "Show Interest",
              debug: false
            }}
          ></InterestedButton>
        );
        return [
          <td>
            <b>{title}</b>
          </td>,
          <td>{companyTitle}</td>,
          <td>{d.type}</td>,
          <td className="text-center">{interestedBtn}</td>
        ];
      } else {
        // @custom_vacancy_info
        let info = [
          <div><b>Type</b> : {d.type}</div>,
          <div><b>Location</b> : {d.location}</div>,
          <div><b>Application Url</b> : {d.application_url}</div>,
          isVacancyInfoNeeded(getCF(), "specialization") ?
            <div><b>Specialization</b> : {d.specialization}</div>
            : null
        ]

        return [
          <td>{d.ID}</td>,
          <td>
            <b>{title}</b>
          </td>,
          <td>{info}</td>,
          <td>{Time.getString(d.updated_at)}</td>
        ];
      }

    };

    this.tableHeader = isRoleOrganizer() ?
      <thead>
        <tr>
          <th>{lang("Job Title")}</th>
          <th>{lang("Company")}</th>
          <th>{lang("Job Type")}</th>
          <th>{lang("Applicants")}</th>
        </tr>
      </thead>
      :
      <thead>
        <tr>
          <th>{lang("ID")}</th>
          <th>{lang("Title")}</th>
          <th>{lang("Info")}</th>
          <th>{lang("Last Updated")}</th>
        </tr>
      </thead>;

    this.loadData = (page, offset) => {


      // @custom_vacancy_info
      var query = `query{vacancies(${this.getQueryParam({ page: page, offset: offset, isCount: false })})
            { 
              ID title location application_url type updated_at 
              ${isRoleOrganizer() ? `company {ID name}` : ""}
              ${addVacancyInfoIfNeeded(getCF(), "specialization")} 
            }
          }`;
      return getAxiosGraphQLQuery(query);
    };

    // get actual data from loadData
    // can alter any data here too
    this.getDataFromRes = res => {
      return res.data.data.vacancies;
    };

    //##########################################
    this.formWillSubmit = (d, edit) => {
      return d;
    };

    // @custom_vacancy_info
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
                  ${addVacancyInfoIfNeeded(getCF(), "specialization")}
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

    // @custom_vacancy_info
    this.getFormItem = edit => {
      return [
        { header: `${getCfCustomMeta(CFSMeta.TEXT_JOB_POST_REC, "Job Post")} Form` },
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
          data: getVacancyType(getCF())
        },
        {
          label: "Job Specialization",
          name: Vacancy.SPECIALIZATION,
          required: true,
          type: "select",
          data: [
            "",
            VacancyEnum.ENGINEERING,
            VacancyEnum.NON_ENGINEERING
          ],
          disabled: !isVacancyInfoNeeded(getCF(), Vacancy.SPECIALIZATION),
          hidden: !isVacancyInfoNeeded(getCF(), Vacancy.SPECIALIZATION),
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

  getQueryParam({ page, offset, isCount }) {
    var param = isCount ? {} : {
      page: page,
      offset: offset,
    };
    if (isRoleOrganizer()) {
      param["cf"] = getCF();
      param["order_by"] = "company_id asc"
    } else {
      param["company_id"] = this.company_id;
      param["order_by"] = Vacancy.UPDATED_AT + " desc"
    }
    return obj2arg(param, { noOuterBraces: true });
  }

  loadCount() {
    let q1 = `query{
      vacancies_count(${this.getQueryParam({ isCount: true })})
    }`;
    getAxiosGraphQLQuery(q1).then(res => {
      var count = res.data.data.vacancies_count;
      this.setState({ countJobPost: count, loadingCountJobPost: false });
    });

    postRequest(StatisticUrl + "/vacancy-application", { cf: getCF(), is_count: true }).then(res => {
      var count = "N/A"
      try {
        count = res.data.total;
      } catch (err) {
      }
      this.setState({ countApplication: count, loadingCountApplication: false });
    })
  }


  getCountAndExport() {
    if (!isRoleOrganizer()) {
      return null;
    }

    if (this.state.loadingCountJobPost && this.state.loadingCountApplication) {
      return <Loader></Loader>
    }
    return [<div className="container-fluid" style={{ margin: '32px 0px' }}>
      <StatisticFigure
        title="Total Job Posts" icon="suitcase"
        value={this.state.countJobPost}
        color="#469fec"
        footer={<ButtonExport
          btnClass="link st-footer-link"
          action="job_posts_by_cf"
          text={`Download Job Posts List`}
          filter={{
            cf: getCF(),
          }}></ButtonExport>}
      ></StatisticFigure>
    </div>,
    <div className="container-fluid" style={{ margin: '32px 0px' }}>
      <StatisticFigure title="Total Applications"
        icon="user"
        value={this.state.countApplication}
        color="#3bb44a"
        footer={<ButtonExport
          btnClass="link st-footer-link"
          action="job_posts_application_by_cf"
          text={`Download Application List`}
          filter={{
            cf: getCF(),
          }}></ButtonExport>}
      >
      </StatisticFigure>
    </div>]
  }


  render() {
    return (
      <GeneralFormPage
        isSearchOnLeft={isRoleOrganizer() ? true : false}
        contentBelowTitle={this.getCountAndExport()}
        noMutation={isRoleOrganizer()}
        dataTitle={getCfCustomMeta(CFSMeta.TEXT_JOB_POST_REC, "Job Posts")}
        entity="vacancy"
        entity_singular={getCfCustomMeta(CFSMeta.TEXT_JOB_POST_REC, "Job Post")}
        addButtonText={`Add New ${getCfCustomMeta(CFSMeta.TEXT_JOB_POST_REC, "Job Post")}`}
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
ManageVacancy.PropTypes = {
  company_id: PropTypes.number.isRequired
};
