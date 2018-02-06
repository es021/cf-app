import React, { PropTypes } from 'react';
import GeneralFormPage from '../../../component/general-form';
import * as layoutActions from '../../../redux/actions/layout-actions';
import UserPopup from '../popup/user-popup';
import { SessionEnum } from '../../../../config/db-config';
//importing for list
import List from '../../../component/list';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import { Time } from '../../../lib/time';
import { createUserTitle } from '../../users';

export class SessionsList extends React.Component {

    constructor(props) {
        super(props);
    }

    sessionStatusString(status) {
        switch (status) {
            case SessionEnum.STATUS_ACTIVE:
                return "Currently Active";
            case SessionEnum.STATUS_EXPIRED:
                return "Ended by Recruiter";
            case SessionEnum.STATUS_LEFT:
                return "Left by Student";
        }
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
        this.searchFormItem = [{ header: "Enter Your Search Query" }];

        if (this.props.isRec) {
            this.searchFormItem.push({
                label: "Find Student",
                name: "search_student",
                type: "text",
                placeholder: "Type student name or email"
            });
        } else {
            this.searchFormItem.push({
                label: "Find Company",
                name: "search_company",
                type: "text",
                placeholder: "Type student name or email"
            });
        }

        this.searchFormItem.push({
            label: "Status",
            name: "status",
            type: "select",
            data: [{
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

        this.searchFormOnSubmit = (d) => {
            this.search = d;
            this.searchParams = "";
            if (d != null) {
                this.searchParams += (d.search_student) ? `search_student:"${d.search_student}",` : "";
                this.searchParams += (d.search_company) ? `search_company:"${d.search_company}",` : "";
            }
        };

        this.tableHeader = <thead>
            <tr>
                <th>ID</th>
                {this.props.isRec ? <th>Student</th> : <th>Company</th>}
                <th>Status</th>
                <th>Created At</th>
                <th>Started At</th>
                <th>Ended At</th>
            </tr>
        </thead>;

        this.renderRow = (d, i) => {
            var row = [];
            row.push(<td>{d.ID}</td>);

            var other = (this.props.isRec) ? createUserTitle(d.student, this.search.search_student) : null;
            row.push(<td>{other}</td>);

            return row;
        }

        this.loadData = (page, offset) => {
            return getAxiosGraphQLQuery(`query{
                sessions(${ this.searchParams} ${this.entityQuery} page: ${page}, offset:${offset}){
                ID
                host_id
                student{ID first_name last_name user_email}
                company{ID name}
                status
                started_at
                ended_at}}`);
        };


        this.getDataFromRes = (res) => {
            return res.data.data.sessions;
        }
    }

    render() {
        document.setTitle("Past Sessions");
        return (<div><h3>Past Sessions</h3>
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

SessionsList.propTypes = {
    isRec: PropTypes.bool,
    company_id: PropTypes.number,
    student_id: PropTypes.number
}