import React, {
    PropTypes
} from 'react';
import GeneralFormPage from '../../../component/general-form';
import {
    NavLink
} from 'react-router-dom';
import {
    Loader
} from '../../../component/loader';
import {
    getAxiosGraphQLQuery
} from '../../../../helper/api-helper';
import {
    Time
} from '../../../lib/time';
import {
    QsPopup,
    QsPopupEnum,
    QsPopupAnswer,
    UserEnum
} from '../../../../config/db-config';

import {
    getAuthUser,
    isRoleRec,
    isRoleStudent
} from '../../../redux/actions/auth-actions';

import {
    storeHideFocusCard,
    storeHideBlockLoader,
    customBlockLoader
} from '../../../redux/actions/layout-actions';

import Form, {
    toggleSubmit,
    checkDiff
} from '../../../component/form';

import {
    createUserTitle
} from '../../users';
import obj2arg from 'graphql-obj2arg';

import Tooltip from '../../../component/tooltip';

require('../../../css/qs-popup.scss');

// #########################################################################################################
// #########################################################################################################

export class QsPopupView extends React.Component {
    constructor(props) {
        super(props);
        this.authUser = getAuthUser();
        this.loadQs = this.loadQs.bind(this);
        this.state = {
            loading: true,
            currentQs: null,
            currentAnswers: [],
            disableSubmit: false,
            error: ""
        };
    }

    componentWillMount() {
        this.loadQs();
    }


    loadQs() {

        if (!this.state.loading) {
            this.setState((prevState) => {
                return {
                    loading: true
                };
            })
        }
//type:"MCQ",
        var forWho = isRoleStudent() ? ", for_student: 1 " : ", for_rec: 1 ";
        var query = `query{ qs_popup( user_id: ${this.authUser.ID}, is_disabled:0 ${forWho}){
                        ID label type answers } }`;

        getAxiosGraphQLQuery(query).then((res) => {
            var qs = res.data.data.qs_popup;
            var ans = [];
            if (qs == null) {
                qs = "";
            } else {
                try {
                    ans = JSON.parse(qs.answers);
                } catch (err) {
                    ans = [];
                }
            }

            this.setState((prevState) => {
                return {
                    currentQs: qs,
                    currentAnswers: ans,
                    loading: false
                };
            })
        });

    }

    formOnSubmit(d) {
        this.setState((prevState) => {
            return { error: "" }
        })
        var qs = this.state.currentQs;

        var answers = "";
        if (qs.type === QsPopupEnum.TYPE_SUBJECTIVE) {
            answers = d.answer;
        }
        if (qs.type === QsPopupEnum.TYPE_MCQ) {
            answers = this.state.currentAnswers[d.answer];
        }


        if (typeof answers === "undefined") {
            this.setState((prevState) => {
                return { error: "Please choose an answer" }
            })

            return;
        }

        var param = {};
        param[QsPopupAnswer.USER_ID] = this.authUser.ID;
        param[QsPopupAnswer.QS_POPUP_ID] = qs.ID;
        param[QsPopupAnswer.ANSWER] = answers;
        console.log(param)

        var q = `mutation { add_qs_popup_answer(${obj2arg(param, { noOuterBraces: true })}) {ID} }`
        getAxiosGraphQLQuery(q).then(res => {
            this.loadQs();
        })

    }


    getQsView() {
        var qs = this.state.currentQs;

        if (qs == "") {
            return null;
        }

        var items = [

        ]

        if (qs.type === QsPopupEnum.TYPE_SUBJECTIVE) {
            items.push({
                label: qs.label,
                name: QsPopupAnswer.ANSWER,
                type: "textarea",
                required: true
            });
        }

        if (qs.type === QsPopupEnum.TYPE_MCQ) {
            var dataset = this.state.currentAnswers.map((d, i) => {
                return { key: i, label: d };
            });

            items.push({
                label: qs.label,
                name: QsPopupAnswer.ANSWER,
                type: "radio",
                data: dataset,
                required: true

            });
        }

        // on success reload question
        return <div className="qs-popup">
            <div className="qs-form">
                <Form className="form-row"
                    items={items}
                    btnColorClass={"default"}
                    onSubmit={(data) => { this.formOnSubmit(data) }}
                    submitText='Submit'
                    error={this.state.error}
                    disableSubmit={this.state.disableSubmit}
                    emptyOnSuccess={true}></Form>
            </div>
        </div>;
    }

    render() {
        var v = <Loader size="2" text=""></Loader>;

        if (!this.state.loading) {
            v = this.getQsView();
        }

        return <div>
            {v}
        </div>
    }
}



// #########################################################################################################
// #########################################################################################################

export class QsPopupList extends React.Component {
    constructor(props) {
        super(props);
        this.createFeedbackView = this.createFeedbackView.bind(this);

        this.authUser = getAuthUser();

        this.state = {
            loading: true,
            qs: {}
        }
    }

    loadQs() {
        var q = `query{ qs_popups {ID type label} }`;
        getAxiosGraphQLQuery(q).then((res) => {
            var qs = {}
            res.data.data.qs_popups.map((d, i) => {
                qs[d.ID] = d;
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
                content={<small><i><b>Question Id
                bottom="-11px"
                noArrow={true} {id}</b></i></small>}
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

        this.loadQs()
        this.ROLE_DATA = [{ key: "", label: "ALL USER TYPE" }, UserEnum.ROLE_STUDENT, UserEnum.ROLE_RECRUITER];
        this.offset = 20;
        this.tableHeader = <thead>
            <tr>
                <th>Question ID</th>
                <th>Question</th>
                <th>Question Type</th>
                <th>Answer</th>
            </tr>
        </thead>;

        this.renderRow = (d, i) => {
            var row = [];
            for (var k in d) {
                if (k == "qs_popup_id") {
                    var qs = this.state.qs[d[k]];
                    row.push(<td>{d[k]}</td>);
                    row.push(<td>{qs.label}</td>);
                    row.push(<td>{qs.type}</td>);
                } else {
                    row.push(<td>{d[k]}</td>);

                }
            }
            return row;
        }

        //##########################################
        //  search
        this.searchParams = "";
        this.search = {};
        this.searchFormItem = [{ header: "Enter Your Search Query" },
        {
            label: "Answer From?",
            name: "user_role",
            type: "select",
            data: this.ROLE_DATA
        }];

        this.searchFormOnSubmit = (d) => {
            this.search = d;
            this.searchParams = "";
            if (d != null) {
                this.searchParams += (d.user_role !== "") ? `user_role:"${d.user_role}",` : "";
                this.searchParams += (d.qs_popup_id !== "") ? `qs_popup_id:${d.qs_popup_id},` : "";
            }
        };

        this.loadData = (page, offset) => {
            return getAxiosGraphQLQuery(`query{
                qs_popup_answers(${this.searchParams} page:${page}, offset:${offset}){
                qs_popup_id answer }}`);
        };



        this.getDataFromRes = (res) => {
            return res.data.data.qs_popup_answers;
        }
    }

    addQsPopupIdFilter() {
        var data = [{ key: "", label: "ALL QUESTIONS" }];
        for (var id in this.state.qs) {
            var label = id + " - " + this.state.qs[id].label;
            data.push({ key: id, label: label });
        }
        this.searchFormItem.push(
            {
                label: "Select Question",
                name: "qs_popup_id",
                type: "select",
                data: data
            }
        );
    }

    render() {
        document.setTitle("User Answers");

        var v = null;

        if (this.state.loading) {
            v = <Loader size="2" text="Loading user answers"></Loader>;
        } else {
            this.addQsPopupIdFilter();
            v = <div>
                <h3>User Answers</h3>
                <GeneralFormPage
                    dataTitle={this.dataTitle}
                    noMutation={true}
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

export class ManageQsPopup extends React.Component {
    constructor(props) {
        super(props);
        this.authUser = getAuthUser();
    }

    componentWillMount() {
        this.BOTH = "BOTH";
        this.ROLE_DATA = [UserEnum.ROLE_STUDENT, UserEnum.ROLE_RECRUITER, this.BOTH];
        this.offset = 20;
        this.tableHeader = <thead>
            <tr>
                <th>ID</th>
                <th>For Student?</th>
                <th>For Recruiter?</th>
                <th>Question</th>
                <th>Type</th>
                <th>Answer Choice</th>
                <th>Status</th>
            </tr>
        </thead>;

        //##########################################
        //  search
        this.searchParams = "";
        this.search = {};
        this.searchFormItem = [{ header: "Enter Your Search Query" },
        {
            label: "Question For",
            name: "user_role",
            type: "select",
            data: this.ROLE_DATA
        }];

        this.searchFormOnSubmit = (d) => {
            this.search = d;
            this.searchParams = "";
            if (d != null) {
                if (d.user_role == UserEnum.ROLE_STUDENT) {
                    this.searchParams = ` for_student:1, `
                } else if (d.user_role == UserEnum.ROLE_RECRUITER) {
                    this.searchParams = `  for_rec:1, `
                }
            }
        };

        this.loadData = (page, offset) => {
            var q = `query{qs_popups(${this.searchParams} 
                order_by: "is_disabled asc, ID", page:${page}, offset:${offset}){
                ID for_student for_rec label type answers   is_disabled}}`;
            console.log(q)
            return getAxiosGraphQLQuery(q);
        };


        this.getDataFromRes = (res) => {
            return res.data.data.qs_popups;
        }

        // create form add new default
        this.newFormDefault = {};
        this.newFormDefault[QsPopup.FOR_STUDENT] = 0;
        this.newFormDefault[QsPopup.FOR_REC] = 0;

        this.getFormItem = (edit) => {
            var ret = [{ header: "Question Popup Form" }];
            ret.push(...[
                {
                    label: "Question",
                    name: QsPopup.LABEL,
                    type: "textarea",
                    rows: 2,
                    required: true,
                    placeholder: "Write question here.."
                }, {
                    label: "For Student?",
                    name: QsPopup.FOR_STUDENT,
                    type: "radio",
                    data: [{ key: 1, label: "Yes" }, { key: 0, label: "No" }],
                    required: true
                }, {
                    label: "For Recruiter?",
                    name: QsPopup.FOR_REC,
                    type: "radio",
                    data: [{ key: 1, label: "Yes" }, { key: 0, label: "No" }],
                    required: true
                }, {
                    label: "Type",
                    name: QsPopup.TYPE,
                    type: "select",
                    data: ["", QsPopupEnum.TYPE_MCQ, QsPopupEnum.TYPE_SUBJECTIVE],
                    required: true,
                }, {
                    label: "Answer Choice",
                    sublabel: "For type 'MCQ' only",
                    name: QsPopup.ANSWERS,
                    type: "text",
                    multiple: true,
                },
            ]);

            var extra = [];
            if (edit) {
                extra = [{
                    label: "Is Active",
                    name: QsPopup.IS_DISABLED,
                    type: "select",
                    data: [{ key: 0, label: "Yes" }, { key: 1, label: "No" }],
                    required: true
                }];
            }

            ret.push(...extra);

            return ret;
        }

        this.getEditFormDefault = (ID) => {
            const query = `query
            {qs_popup(ID: ${ID}){ID label type answers for_student for_rec  is_disabled}}`;

            return getAxiosGraphQLQuery(query).then((res) => {
                var qs = res.data.data.qs_popup;
                return qs;
            });
        }

        this.forceDiff = [QsPopup.TYPE];

        this.renderRow = (d, i) => {
            var row = [];
            for (var key in d) {
                if (key == "is_disabled") {
                    var is_disabled = (d.is_disabled)
                        ? <label className="label label-danger">Not Active</label>
                        : <label className="label label-success">Active</label>;
                    row.push(<td className="text-center">{is_disabled}</td>);
                } else if (key == "for_student" || key == "for_rec") {
                    var forRole = (d[key])
                        ? <label className="label label-success">Yes</label>
                        : <label className="label label-danger">No</label>;
                    row.push(<td className="text-center">{forRole}</td>);
                }
                else {
                    row.push(<td>{d[key]}</td>);
                }
            }
            return row;
        }


        this.formWillSubmit = (d, edit) => {

            var parseInt = [QsPopup.IS_DISABLED, QsPopup.FOR_REC, QsPopup.FOR_STUDENT];

            for (var i in parseInt) {
                if (typeof d[parseInt[i]] === "string") {
                    d[parseInt[i]] = Number.parseInt(d[parseInt[i]]);
                }
            }

            //d[QsPopup.ANSWERS] = JSON.stringify(d[QsPopup.ANSWERS])

            if (d[QsPopup.TYPE] === QsPopupEnum.TYPE_MCQ) {
                var ans = d[QsPopup.ANSWERS];
                if (!Array.isArray(ans) || ans.length < 2) {
                    return "Please enter at least two answer choice";
                }
                d[QsPopup.ANSWERS] = JSON.stringify(d[QsPopup.ANSWERS])
            } else {
                delete (d[QsPopup.ANSWERS]);
            }

            if (edit) {
                d.updated_by = this.authUser.ID;
            } else {
                d.created_by = this.authUser.ID;
            }

            // for edit takde param for type
            // we just need it to validate answers
            if (edit) {
                delete (d[QsPopup.TYPE]);
            }

            return d;
        }
    }

    render() {
        document.setTitle("Manage Question Popup");
        return (<div>
            <h3>Manage Question Popup</h3>

            <GeneralFormPage
                entity_singular="Question Popup"
                entity="qs_popup"
                addButtonText="Add New Question Popup"
                dataTitle={this.dataTitle}
                forceDiff={this.forceDiff}
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
