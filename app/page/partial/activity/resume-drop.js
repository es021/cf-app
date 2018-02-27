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

        this.tableHeader = null;

        this.renderRow = (d, i) => {
            var title = (this.props.isRec)
                ? createUserTitle(d.student, this.search.search_student)
                : createCompanyTitle(d.company, "");

            var addSI = <a id={d.student.ID} onClick={(ev) => { this.openSIForm(ev.currentTarget.id) }}>
                <i className="fa fa-plus left"></i>
                Schedule For Interview</a>;

            var details = <div>
                {Time.getStringShort(d.created_at)}
                <br></br>
                {JSON.stringify(d.doc_links)}
                <br></br>
                {addSI}
                <br></br>
                <p><small>{d.message}</small></p>
            </div>;

            var item =
                <ProfileListWide title={title}
                    img_url={d.company.img_url}
                    img_pos={d.company.img_position}
                    img_size={d.company.img_size}
                    img_dimension={"80px"}
                    body={details}
                    action_text="Scheduled Interview"
                    action_handler={() => { alert("do something") }}
                    action_disabled={false}
                    type="company" key={i}>
                </ProfileListWide>;

            return item;

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
        };

        this.getDataFromRes = (res) => {
            return res.data.data.resume_drops;
        }
    }

    render() {
        document.setTitle("Resume Drop");
        return (<div><h2>Resume Drop</h2>
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