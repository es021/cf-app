import React, { PropTypes } from 'react';
import { NavLink } from 'react-router-dom';
import GeneralFormPage from '../../../component/general-form';
import * as layoutActions from '../../../redux/actions/layout-actions';
import UserPopup, { createUserDocLinkList, createUserMajorList } from '../popup/user-popup';
import { SessionEnum, Prescreen, PrescreenEnum } from '../../../../config/db-config';
import { RootPath } from '../../../../config/app-config';
//importing for list
import List, { CustomList } from '../../../component/list';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import { Time } from '../../../lib/time';
import { createUserTitle } from '../../users';
import { createCompanyTitle } from '../../admin-company';
import { openSIAddForm } from '../../partial/activity/scheduled-interview';

export class SessionsList extends React.Component {

    constructor(props) {
        super(props);
        this.openNextRoundForm = this.openNextRoundForm.bind(this);
    }

    sessionStatusString(status, style = false) {
        switch (status) {
            case SessionEnum.STATUS_ACTIVE:
                var toRet = "Currently Active";
                if (!style) {
                    return toRet;
                } else {
                    return <b style={{ color: "green" }}>{toRet}</b>;
                }
                break;
            case SessionEnum.STATUS_EXPIRED:
                return "Ended by Recruiter";
            case SessionEnum.STATUS_LEFT:
                return "Left by Student";
        }
    }

    openNextRoundForm(student_id) {
        openSIAddForm(student_id, this.props.company_id, PrescreenEnum.ST_NEXT_ROUND);
    }

    componentWillMount() {
        this.entityQuery = (this.props.isRec)
            ? `company_id:${this.props.company_id},`
            : `participant_id:${this.props.student_id},`;

        this.offset = 10;


        //##########################################
        //  search
        this.searchParams = "";
        this.search = {};
        this.searchFormItem = null;

        if (this.props.isRec) {
            this.searchFormItem = [{ header: "Enter Your Search Query" }];
            this.searchFormItem.push(...[
                {
                    label: "Find Student",
                    name: "search_student",
                    type: "text",
                    placeholder: "Type student name or email"
                }, {
                    label: "Find University",
                    name: "search_university",
                    type: "text",
                    placeholder: "Type university name"
                }
            ]);
        } else {
            // this.searchFormItem.push({
            //     label: "Find Company",
            //     name: "search_company",
            //     type: "text",
            //     placeholder: "Type student name or email"
            // });
        }

        /*
        this.searchFormItem.push({
            label: "Status",
            name: "status",
            type: "select",
            data: [{
                key: ""
                , label: "All"
            }, {
                key: SessionEnum.STATUS_ACTIVE
                , label: this.sessionStatusString(SessionEnum.STATUS_ACTIVE)
            }, {
                key: SessionEnum.STATUS_EXPIRED
                , label: this.sessionStatusString(SessionEnum.STATUS_EXPIRED)
            }, {
                key: SessionEnum.STATUS_LEFT
                , label: this.sessionStatusString(SessionEnum.STATUS_LEFT)
            }]
        });
        */

        this.searchFormOnSubmit = (d) => {
            this.search = d;
            this.searchParams = "";
            if (d != null) {
                this.searchParams += (d.search_student != "") ? `search_student:"${d.search_student}",` : "";
                this.searchParams += (d.search_university != "") ? `search_university:"${d.search_university}",` : "";
                //this.searchParams += (d.status != "") ? `status:"${d.status}",` : "";
                //this.searchParams += (d.search_company) ? `search_company:"${d.search_company}",` : "";
            }
        };

        this.tableHeader = <thead>
            <tr>
                <th>Action</th>
                {this.props.isRec ? <th>Student</th> : <th>Company</th>}
                {this.props.isRec ? <th>Notes</th> : null}
                {this.props.isRec ? <th>Ratings</th> : null}
                {this.props.isRec ? <th>Major</th> : null}
                {this.props.isRec ? <th>Minor</th> : null}
                {this.props.isRec ? <th>University</th> : null}
                {this.props.isRec ? <th>Hosted By</th> : null}
                {this.props.isRec ? null : <th>Status</th>}
                {this.props.isRec ? null : <th>Started At</th>}
                {this.props.isRec ? null : <th>Ended At</th>}
            </tr>
        </thead>;

        this.renderRow = (d, i) => {
            var row = [];
            row.push(<td>
                {
                    (this.props.isRec)
                        ? <a className="btn btn-sm btn-block btn-default" id={d.student.ID} onClick={(ev) => { this.openNextRoundForm(ev.currentTarget.id) }}>
                            <i className="fa fa-plus left"></i>Add Next Round</a>
                        : null
                }
                <NavLink className="btn btn-sm btn-block btn-default" to={`${RootPath}/app/session/${d.ID}`}>
                    <i className="fa fa-commenting left"></i>
                    View Chat Log</NavLink>
            </td>);

            //row.push(<td><NavLink to={`${RootPath}/app/session/${d.ID}`}>Session {d.ID}</NavLink></td>);

            // entity
            var other = (this.props.isRec)
                ? <span>
                    {createUserTitle(d.student, this.search.search_student)}
                    <br></br><small>{createUserDocLinkList(d.student.doc_links, d.student.ID, true, false, true)}</small>
                </span>
                : createCompanyTitle(d.company, "");
            row.push(<td>{other}</td>);

            // status

            if (this.props.isRec) {
                var notes = d.session_notes.map((d, i) => d.note);
                row.push(<td>
                    <small>
                        <CustomList emptyMessage={null} items={notes} className="normal"></CustomList>
                    </small>
                </td>);

                var ratings = d.session_ratings.map((d, i) => `${d.category}-${d.rating}`);
                row.push(<td>
                    <small>
                        <CustomList emptyMessage={null} items={ratings} className="normal"></CustomList>
                    </small>
                </td>);

                row.push(...[
                    <td>{createUserMajorList(d.student.major)}</td>
                    , <td>{createUserMajorList(d.student.minor)}</td>
                    , <td>{d.student.university}</td>
                ]);

                row.push(<td>{createUserTitle(d.recruiter)}</td>);
            } else {
                row.push(<td>{this.sessionStatusString(d.status, true)}</td>);
                row.push(<td>{Time.getString(d.started_at)}</td>);
                row.push(<td>{Time.getString(d.ended_at)}</td>);
            }


            // other

            return row;
        }

        this.loadData = (page, offset) => {
            var extra = (this.props.isRec)
                ? `session_notes{note}
                    session_ratings{category rating}
                    student{ID first_name last_name user_email university major minor doc_links{url label} }
                    recruiter{ID first_name last_name user_email}`
                : "company{ID name} started_at ended_at";

            return getAxiosGraphQLQuery(`query{
                sessions(${ this.searchParams} ${this.entityQuery} page: ${page}, offset:${offset}, order_by:"ID desc"){
                ID host_id ${extra} status}}`);
        };

        this.getDataFromRes = (res) => {
            return res.data.data.sessions;
        }
    }

    render() {
        var title = "Past Sessions";
        document.setTitle(title);
        return (<div><h2>{title}</h2>
            <GeneralFormPage
                entity_singular={title}
                dataTitle={this.dataTitle}
                noMutation={true}
                dataOffset={this.offset}
                searchFormItem={this.searchFormItem}
                searchFormOnSubmit={this.searchFormOnSubmit}
                tableHeader={this.tableHeader}
                renderRow={this.renderRow}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
            ></GeneralFormPage>

        </div>);

    }
}

SessionsList.propTypes = {
    isRec: PropTypes.bool,
    company_id: PropTypes.number,
    student_id: PropTypes.number
}