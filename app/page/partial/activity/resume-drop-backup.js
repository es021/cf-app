import React, { PropTypes } from 'react';
import { NavLink } from 'react-router-dom';
import GeneralFormPage from '../../../component/general-form';
import * as layoutActions from '../../../redux/actions/layout-actions';
import UserPopup from '../popup/user-popup';
import { SessionEnum, Prescreen, PrescreenEnum } from '../../../../config/db-config';
import { RootPath } from '../../../../config/app-config';
//importing for list
import List, { CustomList, ProfileListWide } from '../../../component/list';
import { getImageObj } from '../../../component/profile-card.jsx';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import { Time } from '../../../lib/time';
import { createUserTitle } from '../../users';
import { createCompanyTitle } from '../../companies';
import { openSIAddForm } from '../../partial/activity/scheduled-interview';
import { createUserDocLinkList } from '../popup/user-popup';
import { openFeedbackBlockRec } from '../analytics/feedback';


export class ResumeDrop extends React.Component {

    constructor(props) {
        super(props);
        this.openSIForm = this.openSIForm.bind(this);
    }


    openSIForm(student_id) {
        openSIAddForm(student_id, this.props.company_id, PrescreenEnum.ST_RESUME_DROP);
    }

    componentWillMount() {
        openFeedbackBlockRec();
        
        this.offset = 10;
        //##########################################
        //  search
        this.searchParams = "";
        this.search = {};
        this.searchFormItem = null;

        if (this.props.isRec) {
            this.searchFormItem = [];
            this.searchFormItem.push({ header: "Enter Your Search Query" });
            this.searchFormItem.push({
                label: "Find Student",
                name: "search_student",
                type: "text",
                placeholder: "Type student name or email"
            });
        }

        this.searchFormOnSubmit = (d) => {
            this.search = d;
            this.searchParams = "";
            if (d != null) {
                this.searchParams += (d.search_student != "") ? `search_student:"${d.search_student}",` : "";
                this.searchParams += (d.search_company) ? `search_company:"${d.search_company}",` : "";
            }
        };


        this.renderRow = (d, i) => {
            var title = (this.props.isRec)
                ? createUserTitle(d.student, this.search.search_student)
                : createCompanyTitle(d.company, "");

            var message = (d.message)
                ? <p style={{ borderTop: "solid 1px darkgrey" }}>
                    <small>{d.message}</small>
                </p >
                : null;

            var details = <div>
                {createUserDocLinkList(d.doc_links, this.props.student_id, false)}
                <small> <i>submitted on {Time.getString(d.created_at)} </i> <br></br></small>
                {message}
            </div>

            var imgObj = (this.props.isRec) ? getImageObj(d.student) : getImageObj(d.company);



            var item =
                <ProfileListWide title={title}
                    img_url={imgObj.img_url}
                    img_pos={imgObj.img_pos}
                    img_size={imgObj.img_size}
                    img_dimension={"80px"}
                    body={details}
                    action_text={<small><i className="fa fa-plus left"></i>Schedule For Session</small>}
                    action_handler={() => { this.openSIForm(d.student.ID) }}
                    action_disabled={(!this.props.isRec)}
                    type={(this.props.isRec ? "student" : "company")} key={i}>
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

            var query = `query{
                        resume_drops(${ this.searchParams} ${entityQuery} page: ${page}, offset:${offset}, order_by:"created_at desc"){
                        ID
                        doc_links { type label url }
                        message
                        created_at
                        updated_at
                        ${extra}
                    }}`

            return getAxiosGraphQLQuery(query);
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