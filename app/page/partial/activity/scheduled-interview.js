
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

export function openSIAddForm(student_id, company_id, type, success) {
    var defaultFormItem = {};
    defaultFormItem[Prescreen.SPECIAL_TYPE] = type;
    defaultFormItem[Prescreen.STUDENT_ID] = student_id;
    defaultFormItem[Prescreen.STATUS] = PrescreenEnum.STATUS_APPROVED;

    layoutActions.storeUpdateFocusCard("Add A New Scheduled Interview", ScheduledInterview
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
        this.dataTitle = <span>Scheduled Interview<br></br>
            <small>Manage Pre-Screen and Next Round Interview</small>
        </span>;

        this.successAddHandler = (d) => {
            if (this.props.formOnly) {
                var mes = <div>New Interview Have Been Successfully Scheduled
                    <br></br>
                    <NavLink onClick={() => { layoutActions.storeHideBlockLoader() }}
                        to={`${RootPath}/app/my-activity/scheduled-interview`}>
                        Manage Scheduled Interview</NavLink>
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
                            data: ["", PrescreenEnum.ST_SCHEDULED, PrescreenEnum.ST_NEXT_ROUND, PrescreenEnum.ST_PRE_SCREEN]
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
    successAddHandlerExternal: PropTypes.func,
    formOnly: PropTypes.bool // to create from past sessions list
};

ScheduledInterview.defaultProps = {
    successAddHandlerExternal: false,
    formOnly: false,
    defaultFormItem: null
};
