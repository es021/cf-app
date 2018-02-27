import React, { PropTypes } from 'react';
import { NavLink } from 'react-router-dom';
import GeneralFormPage from '../../../component/general-form';
import * as layoutActions from '../../../redux/actions/layout-actions';
import UserPopup from '../popup/user-popup';
import { SessionEnum, Prescreen, PrescreenEnum } from '../../../../config/db-config';
import { RootPath } from '../../../../config/app-config';
//importing for list
import List, { CustomList } from '../../../component/list';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import { Time } from '../../../lib/time';
import { createUserTitle } from '../../users';
import { createCompanyTitle } from '../../companies';
import { openSIAddForm } from '../../manage-company';

export class ResumeDrop extends React.Component {

    constructor(props) {
        super(props);
        this.openSIForm = this.openSIForm.bind(this);
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

    openSIForm(student_id) {
        openSIAddForm(student_id, this.props.company_id, PrescreenEnum.ST_SCHEDULED);
    }

    componentWillMount() {
        this.offset = 10;
        //##########################################
        //  search
        this.searchParams = "";
        this.search = {};
        this.searchFormItem = null;

        if (this.props.isRec) {
            this.searchFormItem.push({ header: "Enter Your Search Query" });
            this.searchFormItem.push({
                label: "Find Student",
                name: "search_student",
                type: "text",
                placeholder: "Type student name or email"
            });
        } else {
            // this.searchFormItem.push({
            //     label: "Find Company",
            //     name: "search_company",
            //     type: "text",
            //     placeholder: "Type student name or email"
            // });
        }

        this.searchFormOnSubmit = (d) => {
            this.search = d;
            this.searchParams = "";
            if (d != null) {
                this.searchParams += (d.search_student != "") ? `search_student:"${d.search_student}",` : "";
                this.searchParams += (d.status != "") ? `status:"${d.status}",` : "";
                //this.searchParams += (d.search_company) ? `search_company:"${d.search_company}",` : "";
            }
        };

        this.tableHeader = <thead>
            <tr>
                <th>Action</th>
                {this.props.isRec ? <th>Student</th> : <th>Company</th>}
                <th>Message</th>
                {this.props.isRec ? <th>Notes</th> : null}
                {this.props.isRec ? <th>Ratings</th> : null}
                {this.props.isRec ? <th>Hosted By</th> : null}
            </tr>
        </thead>;

        this.renderRow = (d, i) => {
            var row = [];

            row.push(<td>
                <a id={d.student.ID} onClick={(ev) => { this.openSIForm(ev.currentTarget.id) }}>
                    <i className="fa fa-plus left"></i>
                    Schedule For Interview</a>
            </td>);

            // entity
            var other = (this.props.isRec)
                ? createUserTitle(d.student, this.search.search_student)
                : createCompanyTitle(d.company, "");
            row.push(<td>{other}</td>);

            // status
            row.push(<td>{this.sessionStatusString(d.status, true)}</td>);

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

                row.push(<td>{createUserTitle(d.recruiter)}</td>);
            }

            // other
            //row.push(<td>{Time.getString(d.started_at)}</td>);
            //row.push(<td>{Time.getString(d.ended_at)}</td>);

            return row;
        }

        this.loadData = (page, offset) => {
            var entityQuery = (this.props.isRec)
                ? `company_id:${this.props.company_id},`
                : `student_id:${this.props.student_id},`;

            var extra = (this.props.isRec)
                ? `student{ID first_name last_name user_email img_url img_pos img_size}`
                : `company{ID name img_url img_position img_size}`;

            return getAxiosGraphQLQuery(`query{
            resume_drops(${ this.searchParams} ${entityQuery} page: ${page}, offset:${offset}, order_by:"created_at desc"){
                ID
                doc_links {
                    type
                    label
                    url
                }
                message
                created_at
                updated_at
                ${extra}
            }}`);

            //started_at
            //ended_at
        };


        this.getDataFromRes = (res) => {
            return res.data.data.sessions;
        }
    }

    render() {
        document.setTitle("Past Sessions");
        return (<div><h2>Past Sessions</h2>
            <GeneralFormPage
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

ResumeDrop.propTypes = {
    isRec: PropTypes.bool,
    company_id: PropTypes.number,
    student_id: PropTypes.number
}