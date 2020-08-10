import React, { PropTypes } from 'react';
import GeneralFormPage from '../../../component/general-form';
import { NavLink } from 'react-router-dom';
import { Loader } from '../../../component/loader';
import { getAxiosGraphQLQuery, graphql } from '../../../../helper/api-helper';
import { Time } from '../../../lib/time';
import { UserEnum, FeedbackQs, CFSMeta } from '../../../../config/db-config';
import { RootPath } from '../../../../config/app-config';
import { getAuthUser, isRoleRec, getCFObj, getCfCustomMeta } from '../../../redux/actions/auth-actions';
import { storeHideFocusCard, storeHideBlockLoader, customBlockLoader } from '../../../redux/actions/layout-actions';
import Form, { toggleSubmit, checkDiff } from '../../../component/form';
import { createUserTitle } from '../../users';
import Tooltip from '../../../component/tooltip';
import lang from '../../../lib/lang';


export function getExternalFeedbackBtn(url) {
    return <a target="_blank" href={url} onClick={() => {
        storeHideFocusCard();
        storeHideBlockLoader();
        graphql(`mutation{edit_user(ID:${getAuthUser().ID}, has_feedback_external:"1"){ ID }}`).then(res => { })
    }}>
        <button className="btn btn-round-10 btn-lg btn-blue-light">
            {lang("Open Feedback Form")}
        </button>
    </a>
}


// for recruiters
export function openFeedbackBlockRec_deprecated() {
    // disabled feedback
    return null;
}
// export function feedbackRec() {
//     // disabled feedback
//     // return null;
//     if (isRoleRec()) {
//         // check if last day
//         // var endtime = Time.convertDBTimeToUnix(getCFObj().end);
//         // var now = Time.getUnixTimestampNow();
//         // if (now >= endtime) {
//         var q = `query {has_feedback(user_id: ${getAuthUser().ID}) }`;
//         getAxiosGraphQLQuery(q).then((res) => {
//             if (!res.data.data.has_feedback) {
//                 var body = <div>
//                     <h3 style={{ color: "#286090" }}>
//                         Help Us To Improve
//                         <br></br>
//                         <small>Please answer a short feedback questions to continue viewing this page</small>
//                     </h3>
//                     {getExternalFeedbackBtn()}
//                 </div>;
//                 customBlockLoader(body, "Open Feedback Form", null, null, true);
//                 // customBlockLoader(body, "Open Feedback Form", null, `${RootPath}/app/feedback/recruiter`, true);
//             }
//         });
//         // }
//     }
// }


// for students
export function feedbackStudent() {
    let externalLink = getCfCustomMeta(CFSMeta.LINK_EXTERNAL_FEEDBACK_STUDENT, null);
    return <div>
        {lang("Your feedback is very valuable to us.")}
        <br></br>{lang("Please answer a short feedback questions to drop more resume.")}
        <br></br><br></br>
        {externalLink ? getExternalFeedbackBtn(externalLink)
            : <NavLink onClick={() => {
                storeHideFocusCard();
                storeHideBlockLoader();
            }} className="btn btn-blue-light btn-lg btn-round-10" to={`${RootPath}/app/feedback/student`}>
                {lang("Open Feedback Form")}
            </NavLink>
        }
    </div>;
}


// #########################################################################################################
// #########################################################################################################

export class FeedbackList extends React.Component {
    constructor(props) {
        super(props);
        this.loadFeedbackQs = this.loadFeedbackQs.bind(this);
        this.createFeedbackView = this.createFeedbackView.bind(this);

        this.authUser = getAuthUser();

        this.state = {
            loading: true,
            qs: {}
        }
    }

    loadFeedbackQs() {
        var q = `query{ feedback_qs {ID, question} }`;
        getAxiosGraphQLQuery(q).then((res) => {
            var qs = {}
            res.data.data.feedback_qs.map((d, i) => {
                qs[d.ID] = d.question;
            });
            this.setState({ qs: qs, loading: false });
        })
    }

    // return array of tds
    createFeedbackView(raw) {
        var data = JSON.parse(raw);
        console.log(data);
        var v = [];
        var style = { marginBottom: "5px" };
        for (var id in data) {
            var d = data[id];

            var qs = <Tooltip
                left="-204px"
                bottom="-11px"
                noArrow={true}
                content={<small><i><b>Question Id {id}</b></i></small>}
                tooltip={this.state.qs[id]}>
            </Tooltip>;

            v.push(<td style={style}>
                {qs}
                <br></br>{d}
            </td>);
        }

        return v;
    }

    componentWillMount() {

        this.loadFeedbackQs()

        this.ROLE_DATA = [UserEnum.ROLE_STUDENT, UserEnum.ROLE_RECRUITER];
        this.offset = 20;
        this.tableHeader = <thead>
            <tr>
                <th>User</th>
                <th>Role</th>
                <th>Feedback</th>
            </tr>
        </thead>;

        this.renderRow = (d, i) => {
            var row = [];
            row.push(<td>{createUserTitle(d)}</td>);
            row.push(<td>{d.role}</td>);
            row.push(...this.createFeedbackView(d.feedback));
            return row;
        }

        //##########################################
        //  search
        this.searchParams = "";
        this.search = {};
        this.searchFormItem = [{ header: "Enter Your Search Query" },
        {
            label: "Feedback From",
            name: "user_role",
            type: "select",
            data: this.ROLE_DATA
        }];

        this.searchFormOnSubmit = (d) => {
            this.search = d;
            this.searchParams = "";
            if (d != null) {
                this.searchParams += (d.user_role) ? `role:"${d.user_role}",` : "";
            }
        };

        this.loadData = (page, offset) => {
            return getAxiosGraphQLQuery(`query{
                users(has_feedback:1, ${ this.searchParams} page:${page}, offset:${offset}){
                ID
                first_name last_name 
                user_email feedback
                role }}`);
        };



        this.getDataFromRes = (res) => {
            return res.data.data.users;
        }

        this.formWillSubmit = (d, edit) => {
            if (typeof d.is_disabled === "string") {
                d.is_disabled = Number.parseInt(d.is_disabled);
            }
            if (edit) {
                d.updated_by = this.authUser.ID;
            } else {
                d.created_by = this.authUser.ID;
            }
            return d;
        }
    }

    render() {
        document.setTitle("User Feedback");

        var v = null;

        if (this.state.loading) {
            v = <Loader size="2" text="Loading user feedback"></Loader>;
        } else {
            v = <div>
                <h3>User Feedback</h3>
                <GeneralFormPage
                    dataTitle={this.dataTitle}
                    noMutation={true}
                    formWillSubmit={this.formWillSubmit}
                    dataOffset={20}
                    searchFormItem={this.searchFormItem}
                    searchFormOnSubmit={this.searchFormOnSubmit}
                    tableHeader={this.tableHeader}
                    renderRow={this.renderRow}
                    getDataFromRes={this.getDataFromRes}
                    loadData={this.loadData}></GeneralFormPage>
            </div>;
        }

        return (v);
    }
}


// #########################################################################################################
// #########################################################################################################

export class ManageFeedback extends React.Component {
    constructor(props) {
        super(props);
        this.authUser = getAuthUser();
    }

    componentWillMount() {
        this.ROLE_DATA = [UserEnum.ROLE_STUDENT, UserEnum.ROLE_RECRUITER];
        this.offset = 20;
        this.tableHeader = <thead>
            <tr>
                <th>ID</th>
                <th>User</th>
                <th>Question</th>
            </tr>
        </thead>;

        //##########################################
        //  search
        this.searchParams = "";
        this.search = {};
        this.searchFormItem = [{ header: "Enter Your Search Query" },
        {
            label: "Feedback For",
            name: "user_role",
            type: "select",
            data: this.ROLE_DATA
        }];

        this.searchFormOnSubmit = (d) => {
            this.search = d;
            this.searchParams = "";
            if (d != null) {
                this.searchParams += (d.user_role) ? `user_role:"${d.user_role}",` : "";
            }
        };

        this.loadData = (page, offset) => {
            return getAxiosGraphQLQuery(`query{
                        feedback_qs(${ this.searchParams} order_by: "is_disabled asc, ID"
                ,page:${page}, offset:${offset}){
                        ID
                  user_role
                    question
                  is_disabled
                }
              }`);
        };

        // create form add new default
        this.newFormDefault = {};

        this.getFormItem = (edit) => {
            var ret = [{ header: "Feeback Question Form" }];
            ret.push(...[
                {
                    label: "Question",
                    name: FeedbackQs.QUESTION,
                    type: "textarea",
                    required: true,
                    placeholder: "Write feedback question here.."
                }, {
                    label: "For User",
                    name: FeedbackQs.USER_ROLE,
                    type: "select",
                    data: this.ROLE_DATA,
                    required: true
                }
            ]);

            var extra = [];
            if (edit) {
                extra = [{
                    label: "Is Active",
                    name: FeedbackQs.IS_DISABLED,
                    type: "select",
                    data: [{ key: 0, label: "Yes" }, { key: 1, label: "No" }],
                    required: true
                }];
            }

            ret.push(...extra);

            return ret;
        }

        this.getEditFormDefault = (ID) => {
            const query = `query{
                        feedback_qs(ID: ${ID}){
                        ID
                  user_role
                    question
                  is_disabled
                }
              }`;

            return getAxiosGraphQLQuery(query).then((res) => {
                var qs = res.data.data.feedback_qs[0];
                return qs;
            });
        }

        this.renderRow = (d, i) => {
            var row = [];
            for (var key in d) {
                if (key == "is_disabled") {
                    var is_disabled = (d.is_disabled)
                        ? <label className="label label-danger">Not Active</label>
                        : <label className="label label-success">Active</label>;
                    row.push(<td className="text-center">{is_disabled}</td>);
                }
                else {
                    row.push(<td>{d[key]}</td>);
                }
            }
            return row;
        }

        this.getDataFromRes = (res) => {
            return res.data.data.feedback_qs;
        }

        this.formWillSubmit = (d, edit) => {
            if (typeof d.is_disabled === "string") {
                d.is_disabled = Number.parseInt(d.is_disabled);
            }
            if (edit) {
                d.updated_by = this.authUser.ID;
            } else {
                d.created_by = this.authUser.ID;
            }
            return d;
        }
    }

    render() {
        document.setTitle("Manage Feedback");
        return (<div>
            <h3>Manage Feedback</h3>
            <NavLink className="btn btn-success" to={`${RootPath}/app/feedback/student`}>
                Student Feedback</NavLink>
            <NavLink className="btn btn-blue" to={`${RootPath}/app/feedback/recruiter`}>
                Recruiter Feedback</NavLink>

            <GeneralFormPage
                entity_singular="Feedback Question"
                entity="feedback_qs"
                addButtonText="Add New Feedback Question"
                dataTitle={this.dataTitle}
                getFormItem={this.getFormItem}
                newFormDefault={this.newFormDefault}
                getEditFormDefault={this.getEditFormDefault}
                noMutation={true}
                formWillSubmit={this.formWillSubmit}
                canEdit={true}
                canAdd={true}
                dataOffset={20}
                searchFormItem={this.searchFormItem}
                searchFormOnSubmit={this.searchFormOnSubmit}
                tableHeader={this.tableHeader}
                renderRow={this.renderRow}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}></GeneralFormPage>
        </div>);
    }
}



// #########################################################################################################
// #########################################################################################################

export class FeedbackForm extends React.Component {
    constructor(props) {
        super(props);
        this.authUser = getAuthUser();
        this.user_role = this.props.match.params.user_role;

        this.state = {
            error: null,
            disableSubmit: false,
            success: null,
            qs: [],
            formLoading: true
        };
    }

    componentWillMount() {
        //load forms
        var query = `query{ feedback_qs(user_role: "${this.user_role}", is_disabled:0){
                        ID question } }`;

        getAxiosGraphQLQuery(query).then((res) => {
            var qs = res.data.data.feedback_qs;
            this.setState(() => {
                return { qs: qs, formLoading: false };
            })
        });

        this.formOnSubmit = (d) => {
            //toggleSubmit(this, { error: null });
            var value = JSON.stringify(d);
            value = JSON.stringify(value);

            var query = `mutation{
                        edit_user(ID: ${this.authUser.ID},feedback:${value}){ID}}`;

            getAxiosGraphQLQuery(query).then((res) => {
                var edit = res.data.data.edit_user;
                if (edit.ID == this.authUser.ID) {
                    toggleSubmit(this, { success: true });
                } else {
                    toggleSubmit(this, { error: "Something went wrong. Failed to submit form" });
                }
            });
        }
    }

    getForm(qs) {
        if (qs == null || qs.length == 0) {
            return <div className="text-muted">Invalid url</div>;
        }

        var formItem = [];
        for (var i in qs) {
            var q = qs[i];
            formItem.push({
                label: q.question,
                name: q.ID,
                required: true,
                type: "textarea"
            });
        }

        return <Form className="form-row"
            items={formItem}
            onSubmit={this.formOnSubmit}
            submitText="Submit"
            disableSubmit={this.state.disableSubmit}
            error={this.state.error}
            errorPosition="bottom"
            success={this.state.success}>
        </Form>;
    }

    render() {
        var v = null;
        if (this.state.formLoading) {
            v = <Loader text="Loading Feedback Form.."></Loader>
        } else if (this.state.success == null) {
            v = this.getForm(this.state.qs);
        } else {
            window.scrollTo(0, 0);
            v = <div>Your feedback has been successfully submitted
                <br></br>Thank you for your time.
                <br></br><br></br>
                <NavLink className="btn btn-blue" to={`${RootPath}/app/`}>
                    Go Back To Career Fair</NavLink>
            </div>;
        }

        return <div>
            <h3>Feedback<br></br><small>{this.user_role.capitalize()}</small></h3>
            {v}
        </div>;
    }
}
