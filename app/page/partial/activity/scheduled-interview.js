
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Session, Prescreen, PrescreenEnum } from '../../../../config/db-config';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import { getAuthUser, isRoleAdmin, getCFObj } from '../../../redux/actions/auth-actions';
import * as layoutActions from '../../../redux/actions/layout-actions';
import { ActivityType } from '../../../redux/actions/hall-actions';
import PropTypes from 'prop-types';
import { RootPath } from '../../../../config/app-config';
import { Time } from '../../../lib/time';
import GeneralFormPage from '../../../component/general-form';
import { createUserTitle } from '../../users';
import { emitHallActivity } from '../../../socket/socket-client';
import Tooltip from '../../../component/tooltip';
import { createUserDocLinkList, createUserMajorList } from '../popup/user-popup';

// Normal SI is limited to today for appmnt time
export const isNormalSI = function (type) {
    var ar = [
        PrescreenEnum.ST_INTV_REQUEST,
        PrescreenEnum.ST_FORUM,
        PrescreenEnum.ST_RESUME_DROP
    ];

    return ar.indexOf(type) >= 0;
}

export function openSIAddForm(student_id, company_id, type, success) {
    var defaultFormItem = {};
    defaultFormItem[Prescreen.SPECIAL_TYPE] = type;
    defaultFormItem[Prescreen.STUDENT_ID] = student_id;
    defaultFormItem[Prescreen.STATUS] = PrescreenEnum.STATUS_APPROVED;

    if (isNormalSI(type)) {
        var dt = Time.getInputFromUnix(Time.getUnixTimestampNow());
        defaultFormItem[Prescreen.APPNMENT_TIME + "_DATE"] = dt.date;
    }

    layoutActions.storeUpdateFocusCard("Add A New Scheduled Session", ScheduledInterview
        , {
            company_id: company_id
            , formOnly: true
            , successAddHandlerExternal: success
            , defaultFormItem: defaultFormItem
        });
}

// included in my-activity for recruiter
// add as form only in past session in my-activity
export class ScheduledInterview extends React.Component {
    constructor(props) {
        super(props);
        this.authUser = getAuthUser();
        this.search = {};
    }

    componentWillMount() {
        this.dataTitle = (this.props.prescreen_only)
            ? <span>Pre-Screen<br></br><small>Click edit to set appointment time.</small></span>
            : <span>Scheduled Session
            <Tooltip
                    left="-62px"
                    bottom="28px"
                    width="150px"
                    content={<small>{" "}<i className="fa fa-question-circle"></i></small>}
                    tooltip={"Manage scheduled session from Next Round, Pre-Screen, Forum, Session Request and Resume Drop"}>
                </Tooltip>
            </span>;

        this.successAddHandler = (d) => {
            if (this.props.formOnly) {
                var mes = <div>New Session Have Been Successfully Scheduled
                    <br></br>
                    <NavLink onClick={() => { layoutActions.storeHideBlockLoader() }}
                        to={`${RootPath}/app/my-activity/scheduled-session`}>
                        Manage Scheduled Session</NavLink>
                </div>;
                layoutActions.successBlockLoader(mes);

                if (this.props.successAddHandlerExternal) {
                    this.props.successAddHandlerExternal(d);
                }

                // after success add scheduled interview
                // emit to student only
                // emit to reload scheduled interview
                emitHallActivity(ActivityType.PRESCREEN, d.student_id);
            }
        };

        //##########################################
        // render table
        this.renderRow = (d) => {
            return [
                <td>{d.ID}</td>
                , <td>{createUserTitle(d.student, this.search.student)}
                    <br></br><small>{createUserDocLinkList(d.student.doc_links, d.student.ID, true, false, true)}</small>
                </td>
                , <td>{createUserMajorList(d.student.major)}</td>
                , <td>{createUserMajorList(d.student.minor)}</td>
                , <td>{d.student.university}</td>
                , <td>{d.status}</td>
                , <td>{Time.getString(d[Prescreen.APPNMENT_TIME])}</td>
                , <td>{d.special_type}</td>
                , <td>{Time.getString(d.updated_at)}</td>
            ];
        };

        this.tableHeader = <thead>
            <tr>
                <td>#</td>
                <th>ID</th>
                <th>Student</th>
                <th>Major</th>
                <th>Minor</th>
                <th>University</th>
                <th>Status</th>
                <th>Appointment Time</th>
                <th>Type</th>
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
        }];

        if (!this.props.prescreen_only) {
            this.searchFormItem.push({
                label: "Type",
                name: Prescreen.SPECIAL_TYPE,
                type: "select",
                data: ["ALL", PrescreenEnum.ST_PRE_SCREEN
                    , PrescreenEnum.ST_NEXT_ROUND
                    , PrescreenEnum.ST_FORUM
                    , PrescreenEnum.ST_INTV_REQUEST
                    , PrescreenEnum.ST_RESUME_DROP]
            });
        }

        this.searchFormOnSubmit = (d) => {
            this.search = d;
            this.searchParams = "";
            if (d != null) {
                this.searchParams += (d.student) ? `student_name:"${d.student}",` : "";
                this.searchParams += (d.student) ? `student_email:"${d.student}",` : "";
                this.searchParams += (d.special_type && d.special_type != "ALL") ? `special_type:"${d.special_type}",` : "";
                this.searchParams += (d.status && d.status != "ALL") ? `status:"${d.status}",` : "";
            }
        };

        //##########################################
        //  loadData
        this.loadData = (page, offset) => {
            var st = (this.props.prescreen_only) ? `special_type:"${PrescreenEnum.ST_PRE_SCREEN}",` : "";
            var query = `query{
                prescreens(${this.searchParams} ${st}
                company_id:${this.props.company_id},page:${page}, offset:${offset},order_by:"updated_at desc") {
                  ID
                  status
                  special_type
                  appointment_time
                  updated_at
                  student{
                    ID university major minor doc_links{url label}
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

            if (d.status == PrescreenEnum.STATUS_PENDING) {
                if (d[Prescreen.APPNMENT_TIME + "_DATE"] || d[Prescreen.APPNMENT_TIME + "_TIME"]) {
                    return "For status Pending, appointment date and time must be blank. To set appointment time, set status to Approved";
                }
            }

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
            , Prescreen.APPNMENT_TIME + "_TIME", Prescreen.SPECIAL_TYPE, Prescreen.STATUS
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
            var studentId = this.props.defaultFormItem[Prescreen.STUDENT_ID];
            var query = "";
            if (typeof studentId !== "undefined") {
                query = `query{user(ID:${this.props.defaultFormItem[Prescreen.STUDENT_ID]})
                    {ID
                    first_name
                    last_name}}`;
            } else {
                // this not really needed
                query = `query{prescreen(ID:1){ID}}`;
            }

            /*
            var query = (!singleStudent)
                ? // need  list of student for new
                
                :// for student only
                `query{user(ID:${this.props.defaultFormItem[Prescreen.STUDENT_ID]})
                    {ID
                    first_name
                    last_name}}`;
            */

            return getAxiosGraphQLQuery(query)
                .then((res) => {
                    var isNormal = isNormalSI(this.props.defaultFormItem[Prescreen.SPECIAL_TYPE]);
                    var studentData = [];
                    if (singleStudent) {
                        var user = res.data.data.user;
                        studentData = [{ key: user.ID, label: user.first_name + " " + user.last_name }];
                    }

                    var ret = [
                        { header: "Scheduled Session Form" },
                        {
                            label: "Type",
                            name: Prescreen.SPECIAL_TYPE,
                            type: "select",
                            sublabel: "Created From",
                            required: true,
                            disabled: edit || this.props.formOnly,
                            data: ["", PrescreenEnum.ST_INTV_REQUEST
                                , PrescreenEnum.ST_RESUME_DROP
                                , PrescreenEnum.ST_NEXT_ROUND
                                , PrescreenEnum.ST_FORUM
                                , PrescreenEnum.ST_PRE_SCREEN]
                        }];

                    //for create only
                    if (!edit && singleStudent) {
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
                        sublabel: "Only session with status 'Approved' will be shown in Career Fair page under Scheduled Session",
                        name: Prescreen.STATUS,
                        type: "select",
                        required: true,
                        disabled: this.props.formOnly,
                        data: [PrescreenEnum.STATUS_APPROVED, PrescreenEnum.STATUS_PENDING, PrescreenEnum.STATUS_DONE]
                    }, {
                        label: "Appointment Date",
                        sublabel: <span>Please enter your local time
                            {(isNormal)
                                ? <span><br></br>Date cannot be change</span>
                                : ""}
                        </span>,
                        name: Prescreen.APPNMENT_TIME + "_DATE",
                        type: "date",
                        placeholder: "",
                        // for schedule interview must is disabled
                        // set to todays date only
                        disabled: isNormal,
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
            noMutation={true}
            actionFirst={true}
            canEdit={true}
            entity="prescreen"
            entity_singular="Scheduled Session"
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
    prescreen_only: PropTypes.bool,
    defaultFormItem: PropTypes.object,
    successAddHandlerExternal: PropTypes.func,
    formOnly: PropTypes.bool // to create from past sessions list
};

ScheduledInterview.defaultProps = {
    prescreen_only: false,
    successAddHandlerExternal: false,
    formOnly: false,
    defaultFormItem: {}
};
