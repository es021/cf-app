import React, { PropTypes } from 'react';
import { NavLink } from 'react-router-dom';
import GeneralFormPage from '../../../component/general-form';
import * as layoutActions from '../../../redux/actions/layout-actions';
import UserPopup from '../popup/user-popup';
//importing for list
import List, { CustomList, ProfileListWide } from '../../../component/list';
import { getImageObj } from '../../../component/profile-card';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import { Time } from '../../../lib/time';
import { createUserTitle } from '../../users';
import { openSIFormNew } from '../../partial/activity/scheduled-interview';
import { createUserDocLinkList } from '../popup/user-popup';
import { openFeedbackBlockRec } from '../analytics/feedback';


export class StudentListing extends React.Component {

    constructor(props) {
        super(props);
        this.openSIForm = this.openSIForm.bind(this);
    }


    openSIForm(student_id) {
        openSIFormNew(student_id, this.props.company_id);
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
            }
        };


        this.renderRow = (d, i) => {
            var title = createUserTitle(d.student, this.search.search_student)
               

            var description = (d.student.description !== null && d.student.description != "")
                ? <p style={{ borderTop: "solid 1px darkgrey" }}>
                    <small>{d.student.description}</small>
                </p >
                : null;

            var details = <div>
                {createUserDocLinkList(d.student.doc_links, d.student_id, false)}
                <small> <i>{Time.getString(d.created_at)} </i> <br></br></small>
                {description}
            </div>

            var imgObj = getImageObj(d.student);

            var item =
                <ProfileListWide title={title}
                    img_url={imgObj.img_url}
                    img_pos={imgObj.img_pos}
                    img_size={imgObj.img_size}
                    img_dimension={"80px"}
                    body={details}
                    action_text={<small><i className="fa fa-plus left"></i>Schedule For Call</small>}
                    action_handler={() => { this.openSIForm(d.student.ID) }}
                    action_disabled={false}
                    type={(this.props.isRec ? "student" : "company")} key={i}>
                </ProfileListWide>;

            return item;

        }

        this.loadData = (page, offset) => {
            var query = `query{
                student_listing(${this.searchParams} company_id:${this.props.company_id}, page: ${page}, offset:${offset}) {
                    student_id
                    created_at
                    student{
                        ID first_name last_name user_email img_url img_pos img_size description
                        doc_links { type label url }
            }}}`;

            return getAxiosGraphQLQuery(query);
        };

        this.getDataFromRes = (res) => {
            return res.data.data.student_listing;
        }
    }

    render() {
        document.setTitle("Student Listing");
        return (<div><h2>Student Listing</h2>
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

StudentListing.propTypes = {
    company_id: PropTypes.number.isRequired,
    isRec : PropTypes.bool
}

StudentListing.defaultProps = {
    isRec : true
}