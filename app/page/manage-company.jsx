import React, { Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import Form, { toggleSubmit, checkDiff, getDataCareerFair } from '../component/form';
import { Session, Prescreen, PrescreenEnum, UserMeta, User, Vacancy, VacancyEnum, UserEnum, Skill } from '../../config/db-config';
import { Company, CompanyEnum, DocLink, DocLinkEnum } from '../../config/db-config';
import { ButtonLink } from '../component/buttons';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import obj2arg from 'graphql-obj2arg';
import { getAuthUser, isRoleRec, updateAuthUser, isRoleOrganizer, isRoleAdmin, getCFObj } from '../redux/actions/auth-actions';
import { Loader } from '../component/loader';
import ProfileCard from '../component/profile-card';
import SubNav from '../component/sub-nav';
import List, { CustomList } from '../component/list';
import * as layoutActions from '../redux/actions/layout-actions';
import CompanyPopup from './partial/popup/company-popup';
import VacancyPopup from './partial/popup/vacancy-popup';
import { store } from '../redux/store';
import DocLinkPage from '../component/doc-link-form';
import { SimpleListItem } from '../component/list';
import PropTypes from 'prop-types';
import { RootPath } from '../../config/app-config';
import { Time } from '../lib/time';
import GeneralFormPage from '../component/general-form';
import { CareerFair } from '../../config/cf-config';
import Restricted from './partial/static/restricted';
import UserPopup from './partial/popup/user-popup';

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
        this.renderRow = (d) => {
            var title = <a
                onClick={() => layoutActions.storeUpdateFocusCard(d.title, VacancyPopup, { id: d.ID })}
            >{d.title}</a>;

            return [
                <td>{d.ID}</td>
                , <td><b>{title}</b></td>
                , <td>{d.type}</td>
                , <td>{Time.getString(d.updated_at)}</td>
            ];
        };

        this.tableHeader = <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Last Updated</th>
            </tr>
        </thead>;

        this.loadData = (page, offset) => {
            var param = {
                company_id: this.company_id,
                page: page,
                offset: offset,
                order_by: Vacancy.UPDATED_AT + " desc"
            };

            var query = `query{vacancies(${obj2arg(param, { noOuterBraces: true })})
            {ID title type updated_at}}`;
            return getAxiosGraphQLQuery(query);
        }

        // get actual data from loadData
        // can alter any data here too
        this.getDataFromRes = (res) => {
            return res.data.data.vacancies;
        }

        //##########################################
        // form operation properties

        // if ever needed
        // hook before submit
        this.formWillSubmit = (d, edit) => {
            return d;
        }

        this.getEditFormDefault = (ID) => {
            const query = `query{
                vacancy(ID:${ID}) {
                  ID
                  title
                  description
                  requirement
                  type
                  application_url
                }
              }`;

            return getAxiosGraphQLQuery(query).then((res) => {
                var vacan = res.data.data.vacancy;
                return vacan;
            });
        }

        // create form add new default
        this.newFormDefault = {};
        this.newFormDefault[Vacancy.COMPANY_ID] = this.company_id;
        this.newFormDefault[Vacancy.CREATED_BY] = this.user_id;


        this.getFormItem = (edit) => {
            return [
                { header: "Job Opportunity Form" },
                {
                    label: "Title",
                    name: Vacancy.TITLE,
                    type: "text",
                    placeholder: "Software Developer",
                    required: true
                }, {
                    label: "Company Id",
                    name: Vacancy.COMPANY_ID,
                    type: "number",
                    disabled: true,
                    hidden: true,
                    required: (!edit)
                }, {
                    label: "Created By",
                    name: Vacancy.CREATED_BY,
                    type: "number",
                    disabled: true,
                    hidden: true,
                    required: (!edit)
                }, {
                    label: "Type",
                    name: Vacancy.TYPE,
                    type: "select",
                    required: true,
                    data: [VacancyEnum.TYPE_FULL_TIME, VacancyEnum.TYPE_PART_TIME, VacancyEnum.TYPE_INTERN]
                }, {
                    label: "Application Url",
                    name: Vacancy.APPLICATION_URL,
                    type: "text"
                }, {
                    label: "Description",
                    name: Vacancy.DESCRIPTION,
                    type: "textarea",
                    placeholder: "Tell more about the job opportunity"
                }, {
                    label: "Requirement",
                    name: Vacancy.REQUIREMENT,
                    type: "textarea",
                }
            ];
        }
    }

    render() {
        return <GeneralFormPage
            dataTitle="Job Opportunities"
            entity="vacancy"
            entity_singular="Job Opportunity"
            addButtonText="Add New Job Opportunity"
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
    }
}
VacancySubPage.PropTypes = {
    company_id: PropTypes.number.isRequired
}

//###################################################################################################
//###################################################################################################

class CompanyDocLink extends React.Component {
    render() {
        return <DocLinkPage entity="company" id={this.props.company_id}></DocLinkPage>;
    }
}
CompanyDocLink.PropTypes = {
    company_id: PropTypes.number.isRequired
}

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
              rec_privacy
              accept_prescreen
              sponsor_only
          }}`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState(() => {
                return { data: res.data.data.company, init: false }
            })
        });

        this.formItems = [];

        // for admin
        if (isRoleAdmin() || isRoleOrganizer()) {
            var dataCF = getDataCareerFair();
            dataCF.push({ key: "NONE", label: "No Career Fair" });

            this.formItems.push(...[
                { header: "Admin Only" },
                {
                    label: "Name",
                    name: Company.NAME,
                    type: "text",
                    placeholder: "Company Name",
                    required: true
                }, {
                    label: "Type",
                    name: Company.TYPE,
                    type: "select",
                    data: [
                        { key: CompanyEnum.TYPE_NORMAL, label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_NORMAL) }
                        , { key: CompanyEnum.TYPE_GOLD, label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_GOLD) }
                        , { key: CompanyEnum.TYPE_SILVER, label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_SILVER) }
                        , { key: CompanyEnum.TYPE_BRONZE, label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_BRONZE) }
                        , { key: CompanyEnum.TYPE_PLATINUM, label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_PLATINUM) }
                        , { key: CompanyEnum.TYPE_SPECIAL, label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_SPECIAL) }
                    ],
                    required: true
                }, {
                    label: "Career Fair",
                    name: Company.CF,
                    type: "checkbox",
                    data: dataCF
                }, {
                    label: "Is Sponsor Only?",
                    sublabel: "Sponsor only company will have NO booth in job fair",
                    name: Company.SPONSOR_ONLY,
                    type: "radio",
                    required: true,
                    data: [{ key: 1, label: "Yes" }
                        , { key: 0, label: "No" }]
                }, {
                    label: "Accept Prescreen?",
                    name: Company.ACCEPT_PRESCREEN,
                    type: "radio",
                    required: true,
                    data: [{ key: 1, label: "Yes" }
                        , { key: 0, label: "No" }]
                }
            ]);
        }

        this.formItems.push(...[
            { header: "Basic Information" },
            {
                label: "Tagline",
                name: Company.TAGLINE,
                type: "text",
                placeholder: "Company Tagline"
            }, {
                label: "Description",
                name: Company.DESCRIPTION,
                type: "textarea",
                rows: 6,
                placeholder: "Tell more about your company"
            }, {
                label: "Additional Information",
                name: Company.MORE_INFO,
                type: "textarea",
                rows: 6,
                placeholder: "Anything you might want the student to know about the company. Upcoming events, benefits. culture, etc."
            },
            { header: "Advanced Settings" },
            {
                label: "Recruiter Information",
                name: Company.REC_PRIVACY,
                type: "radio",
                required: true,
                data: [{ key: CompanyEnum.REC_PRIVACY_PUBLIC, label: "Public" }
                    , { key: CompanyEnum.REC_PRIVACY_PRIVATE, label: "Private" }]
            }

        ]);
    }

    //return string if there is error
    filterForm(d) {
        return 0;
    }

    formOnSubmit(d) {
        var err = this.filterForm(d);
        if (err === 0) {
            toggleSubmit(this, { error: null, success: null });
            var update = checkDiff(this, this.state.data, d);
            if (update === false) {
                return;
            }

            update[Company.ID] = this.company_id;
            if (typeof update[Company.TYPE] !== "undefined") {
                update[Company.TYPE] = Number.parseInt(update[Company.TYPE]);
            }

            var edit_query = `mutation{edit_company(${obj2arg(update, { noOuterBraces: true })}) {ID}}`;
            getAxiosGraphQLQuery(edit_query).then((res) => {
                var newData = Object.assign(this.state.data, d);
                toggleSubmit(this, { data: newData, error: null, success: "Your Change Has Been Saved!" });
            }, (err) => {
                toggleSubmit(this, { error: err.response.data });
            });
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
            content = <div>
                <ProfileCard type="company"
                    id={this.state.data.ID}
                    add_img_ops={true}
                    title={this.state.data.name} subtitle={""}
                    img_url={this.state.data.img_url} img_pos={this.state.data.img_position} img_size={this.state.data.img_size}
                ></ProfileCard>

                <Form className="form-row"
                    items={this.formItems}
                    onSubmit={this.formOnSubmit}
                    submitText='Save Changes'
                    defaultValues={this.state.data}
                    disableSubmit={this.state.disableSubmit}
                    error={this.state.error}
                    success={this.state.success}>
                </Form>
            </div>;
        }

        return <div><h3>Edit Company</h3>{content}</div>;
    }
}

AboutSubPage.PropTypes = {
    company_id: PropTypes.number.isRequired
}

//###################################################################################################
//###################################################################################################
import { createUserTitle } from './users';

// included in my-activity for recruiter
// add as form only in past session in my-activity
export class ScheduledInterview extends React.Component {
    constructor(props) {
        super(props);
        this.authUser = getAuthUser();
        this.search = {};
    }

    componentWillMount() {
        this.dataTitle = <span>Scheduled Interview<br></br>
            <small>Manage Pre-Screen and Next Round Interview</small>
        </span>;

        this.successAddHandler = (d) => {
            if (this.props.formOnly) {
                var mes = <div>New Next Round Interview Have Been Successfully Scheduled
                    <br></br>
                    <NavLink onClick={() => { layoutActions.storeHideBlockLoader() }}
                        to={`${RootPath}/app/my-activity/${this.props.company_id}/scheduled-interview`}>
                        Manage Scheduled Interview</NavLink>
                </div>;
                layoutActions.successBlockLoader(mes);
            }
        };

        //##########################################
        // render table
        this.renderRow = (d) => {
            return [
                <td>{d.ID}</td>
                , <td>{createUserTitle(d.student, this.search.student)}</td>
                , <td>{d.special_type}</td>
                , <td>{d.status}</td>
                , <td>{Time.getString(d[Prescreen.APPNMENT_TIME])}</td>
                , <td>{Time.getString(d.updated_at)}</td>
            ];
        };

        this.tableHeader = <thead>
            <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Type</th>
                <th>Status</th>
                <th>Appointment Time</th>
                <th>Last Updated</th>
            </tr>
        </thead>;

        //##########################################
        //  search
        this.searchParams = "";
        this.searchFormItem = [{ header: "Enter Your Search Query" },
        {
            label: "Find Student",
            name: "student",
            type: "text",
            placeholder: "Type student name or email"
        }, {
            label: "Status",
            name: Prescreen.STATUS,
            type: "select",
            data: ["ALL", PrescreenEnum.STATUS_APPROVED, PrescreenEnum.STATUS_PENDING, PrescreenEnum.STATUS_DONE]
        }
        ];

        this.searchFormOnSubmit = (d) => {
            this.search = d;
            this.searchParams = "";
            if (d != null) {
                this.searchParams += (d.student) ? `student_name:"${d.student}",` : "";
                this.searchParams += (d.student) ? `student_email:"${d.student}",` : "";
                this.searchParams += (d.status && d.status != "ALL") ? `status:"${d.status}",` : "";
            }
        };

        //##########################################
        //  loadData
        this.loadData = (page, offset) => {
            var query = `query{
                prescreens(${this.searchParams}
                company_id:${this.props.company_id},page:${page}, offset:${offset},order_by:"updated_at desc") {
                  ID
                  status
                  special_type
                  appointment_time
                  updated_at
                  student{
                    ID
                    first_name last_name user_email
                  }
                }
              }`;

            return getAxiosGraphQLQuery(query);
        }

        // get actual data from loadData
        // can alter any data here too
        this.getDataFromRes = (res) => {
            var ps = res.data.data.prescreens;

            for (var i in ps) {
                var r = ps[i];
                if (r[Prescreen.SPECIAL_TYPE] == null || r[Prescreen.SPECIAL_TYPE] == "") {
                    ps[i][Prescreen.SPECIAL_TYPE] = PrescreenEnum.ST_PRE_SCREEN;
                }
            }

            return ps;
        }

        //##########################################
        // form operation properties

        // hook before submit
        this.formWillSubmit = (d, edit) => {

            // if approved time cannot be null
            if (d.status == PrescreenEnum.STATUS_APPROVED) {
                if (!d[Prescreen.APPNMENT_TIME + "_DATE"] || !d[Prescreen.APPNMENT_TIME + "_TIME"]) {
                    return "For status Approved, appointment date and time is needed";
                }
            }

            // there is no created_by column in this table,
            // malas nk tambah
            //udpated by for both create and update
            d[Prescreen.UPDATED_BY] = getAuthUser().ID;

            // convert to number
            if (typeof d[Prescreen.STUDENT_ID] !== "undefined") {
                d[Prescreen.STUDENT_ID] = Number.parseInt(d[Prescreen.STUDENT_ID]);
            }

            //for create new
            if (!edit) {
                d[Prescreen.COMPANY_ID] = this.props.company_id;
            }

            if (d.status == PrescreenEnum.STATUS_PENDING) {
                d[Prescreen.APPNMENT_TIME] = null;
            }
            // date time handling only for not pending only
            else if (d[Prescreen.APPNMENT_TIME + "_DATE"] || d[Prescreen.APPNMENT_TIME + "_TIME"]) {
                d[Prescreen.APPNMENT_TIME]
                    = Time.getUnixFromDateTimeInput(d[Prescreen.APPNMENT_TIME + "_DATE"]
                        , d[Prescreen.APPNMENT_TIME + "_TIME"]);

                //appointment time must be only on the last day
                if (!isRoleAdmin()) {
                    var lastDay = Time.convertDBTimeToUnix(getCFObj().end);
                    if (d[Prescreen.APPNMENT_TIME] < lastDay && d[Prescreen.SPECIAL_TYPE] == PrescreenEnum.ST_NEXT_ROUND) {
                        return `Next Round interview only allowed to be scheduled on the last day of the Career Fair. Please change the appoinment date and time to be later than ${Time.getString(lastDay)}`;
                    }
                }
            }

            delete (d[Prescreen.APPNMENT_TIME + "_DATE"]);
            delete (d[Prescreen.APPNMENT_TIME + "_TIME"]);

            return d;

        }

        // date time need to be forced diff
        this.forceDiff = [Prescreen.APPNMENT_TIME + "_DATE"
            , Prescreen.APPNMENT_TIME + "_TIME", Prescreen.SPECIAL_TYPE
        ];

        this.getEditFormDefault = (ID) => {
            const query = `query{prescreen(ID:${ID}){
                ID
                student_id
                status
                special_type
                appointment_time}}`;

            return getAxiosGraphQLQuery(query).then((res) => {
                var data = res.data.data.prescreen;
                // setup time
                if (data[Prescreen.APPNMENT_TIME]) {
                    var dt = Time.getInputFromUnix(data[Prescreen.APPNMENT_TIME]);
                    data[Prescreen.APPNMENT_TIME + "_DATE"] = dt.date;
                    data[Prescreen.APPNMENT_TIME + "_TIME"] = dt.time;
                }
                if (data[Prescreen.SPECIAL_TYPE] == null) {
                    data[Prescreen.SPECIAL_TYPE] = PrescreenEnum.ST_PRE_SCREEN;
                }

                return data;
            });
        }

        this.newFormDefault = this.props.defaultFormItem;

        // create form add new default
        this.getFormItemAsync = (edit) => {
            var singleStudent = this.props.formOnly;

            var query = (!singleStudent)
                ? // need  list of student for new
                `query{
                    sessions(distinct:"${Session.P_ID}", company_id:${this.props.company_id}){
                    student{
                        ID
                        first_name
                        last_name
                    }
                    }
                }`
                :// for student only
                `query{user(ID:${this.props.defaultFormItem[Prescreen.STUDENT_ID]})
                    {ID
                    first_name
                    last_name}}`;

            return getAxiosGraphQLQuery(query)
                .then((res) => {
                    var studentData = [];
                    if (singleStudent) {
                        var user = res.data.data.user;
                        studentData = [{ key: user.ID, label: user.first_name + " " + user.last_name }];
                    } else {
                        var session = res.data.data.sessions;
                        studentData = session.map((ses, i) => {
                            var d = ses.student;
                            return { key: d.ID, label: d.first_name + " " + d.last_name };
                        });
                    }


                    var ret = [
                        { header: "Scheduled Interview Form" },
                        {
                            label: "Type",
                            name: Prescreen.SPECIAL_TYPE,
                            type: "select",
                            required: true,
                            disabled: edit || this.props.formOnly,
                            data: ["", PrescreenEnum.ST_NEXT_ROUND, PrescreenEnum.ST_PRE_SCREEN]
                        }];

                    //for create only
                    if (!edit) {
                        ret.push(...[{
                            label: "Student",
                            sublabel: "Only showing students that already had session with the company",
                            name: Prescreen.STUDENT_ID,
                            type: "select",
                            data: studentData,
                            required: true,
                            disabled: this.props.formOnly
                        }]);
                    }

                    ret.push(...[{
                        label: "Status",
                        sublabel: "Only interview with status 'Approved' will be shown in Career Fair page",
                        name: Prescreen.STATUS,
                        type: "select",
                        required: true,
                        disabled: this.props.formOnly,
                        data: [PrescreenEnum.STATUS_APPROVED, PrescreenEnum.STATUS_PENDING, PrescreenEnum.STATUS_DONE]
                    }, {
                        label: "Appointment Date",
                        sublabel: "Please enter your local time",
                        name: Prescreen.APPNMENT_TIME + "_DATE",
                        type: "date",
                        placeholder: ""
                    }, {
                        label: "Appointment Time",
                        sublabel: "Please enter your local time",
                        name: Prescreen.APPNMENT_TIME + "_TIME",
                        type: "time",
                        placeholder: ""
                    }]);

                    return ret;
                });
        }
    }

    render() {
        return <GeneralFormPage
            dataTitle={this.dataTitle}
            entity="prescreen"
            entity_singular="Scheduled Interview"
            addButtonText="Add New"
            dataOffset={20}
            searchFormItem={this.searchFormItem}
            searchFormOnSubmit={this.searchFormOnSubmit}
            forceDiff={this.forceDiff}
            tableHeader={this.tableHeader}
            newFormDefault={this.newFormDefault}
            getEditFormDefault={this.getEditFormDefault}
            getFormItemAsync={this.getFormItemAsync}
            renderRow={this.renderRow}
            getDataFromRes={this.getDataFromRes}
            loadData={this.loadData}
            successAddHandler={this.successAddHandler}
            formWillSubmit={this.formWillSubmit}
            formOnly={this.props.formOnly}
        ></GeneralFormPage>
    }
}

ScheduledInterview.PropTypes = {
    company_id: PropTypes.number.isRequired,
    defaultFormItem: PropTypes.object,
    formOnly: PropTypes.bool // to create from past sessions list
};

ScheduledInterview.defaultProps = {
    formOnly: false,
    defaultFormItem: null
};

// For Recruiter ------------------------------------------------------/

export default class ManageCompanyPage extends React.Component {
    componentWillMount() {
        this.key = 1;
    }

    getSubNavItem() {
        this.sub_page = (this.props.match.params.current) ? this.props.match.params.current : "about";
        this.company_id = Number.parseInt(this.props.match.params.id);

        var item = {
            "about": {
                label: "Edit Company",
                component: AboutSubPage,
                props: { company_id: this.company_id },
                icon: "edit"
            },
            "vacancy": {
                label: "Job Opportunities",
                component: VacancySubPage,
                props: { company_id: this.company_id },
                icon: "star"
            },
            "doc-link": {
                label: "Document & Link",
                component: CompanyDocLink,
                props: { company_id: this.company_id },
                icon: "file-text"
            },
            "scheduled-interview": {
                label: "Scheduled Interview",
                component: ScheduledInterview,
                props: { company_id: this.company_id },
                icon: "clock-o"
            },
            "view": {
                label: "View Company",
                onClick: () => {
                    layoutActions.storeUpdateFocusCard("My Company", CompanyPopup, {
                        id: this.company_id
                    });
                },
                component: null,
                icon: "eye"
            }
        };

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

        if (!isRoleAdmin() && !isRoleOrganizer() && this.company_id != getAuthUser().rec_company) {
            return <Restricted
                title="Restricted Page"
                message="You Are Not Allowed Here"></Restricted>;
        }

        return <div key={this.key}>
            <SubNav route={`manage-company/${this.company_id}`} items={item} defaultItem={this.sub_page}></SubNav>
        </div>;
    }
}
