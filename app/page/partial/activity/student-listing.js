import React, { PropTypes } from 'react';
import { NavLink } from 'react-router-dom';
import GeneralFormPage from '../../../component/general-form';
import * as layoutActions from '../../../redux/actions/layout-actions';
import {isComingSoon} from '../../../redux/actions/auth-actions';
import UserPopup from '../popup/user-popup';
//importing for list
import List, { CustomList, ProfileListWide } from '../../../component/list';
import { getImageObj } from '../../../component/profile-card';
import { Loader } from '../../../component/loader';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import { Time } from '../../../lib/time';
import { createUserTitle } from '../../users';
import { openSIFormNew } from '../../partial/activity/scheduled-interview';
import { createUserDocLinkList } from '../popup/user-popup';
import { openFeedbackBlockRec } from '../analytics/feedback';
import { CompanyEnum } from '../../../../config/db-config';




export class StudentListing extends React.Component {

    constructor(props) {
        super(props);
        this.openSIForm = this.openSIForm.bind(this);

        this.state = {
            loadPriv : true,
            privs : []
        }
    }

    openSIForm(student_id) {
        openSIFormNew(student_id, this.props.company_id);
    }
    loadPriv(){
        var q = `query {company(ID:${this.props.company_id}) { priviledge } }`;
        getAxiosGraphQLQuery(q).then(res=>{
            this.setState((prevState)=>{
                return { loadPriv:false, privs: res.data.data.company.priviledge };
            })
        });
    }
    componentWillMount() {
        openFeedbackBlockRec();

        this.loadPriv();
        
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

            var canSchedule = CompanyEnum.hasPriv(this.state.privs, CompanyEnum.PRIV.SCHEDULE_PRIVATE_SESSION);
            const actionHandler = ()=>{
                if(canSchedule){
                    this.openSIForm(d.student.ID)
                } else {
                    layoutActions.errorBlockLoader("Opps.. It seems that you don't have priviledge to schedule 1-1 call yet.");
                }
            }

            var item =
                <ProfileListWide title={title}
                    img_url={imgObj.img_url}
                    img_pos={imgObj.img_pos}
                    img_size={imgObj.img_size}
                    img_dimension={"80px"}
                    body={details}
                    action_text={<small><i className="fa fa-plus left"></i>Schedule For Call</small>}
                    action_handler={actionHandler}
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

        var view = null; 
        if(this.state.loadPriv){
            view = <Loader size="2" text="Loading..."></Loader>
        }else{
            var hide = false;

            if(isComingSoon()){
                hide = !CompanyEnum.hasPriv(this.state.privs, CompanyEnum.PRIV.ACCESS_RS_PRE_EVENT);
            } else{
                hide = !CompanyEnum.hasPriv(this.state.privs, CompanyEnum.PRIV.ACCESS_RS_DURING_EVENT);
            }

            view = hide ? <div>
                <h4><i className="fa fa-3x fa-frown-o"></i><br></br><br></br>
                Opss.. It seems that you don't have access to this page.</h4>
            </div> 

            : <GeneralFormPage
                dataTitle={this.dataTitle}
                noMutation={true}
                dataOffset={this.offset}
                searchFormItem={this.searchFormItem}
                searchFormOnSubmit={this.searchFormOnSubmit}
                renderRow={this.renderRow}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
            ></GeneralFormPage>;
        }

        //        {isComingSoon() ? "isComingSoon()" : "not isComingSoon()"}
        //        {this.state.loadPriv} |  {this.state.privs}

        document.setTitle("Student Listing");
        return (<div><h2>Student Listing</h2>
            {view}
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