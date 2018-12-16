import React, { Component } from 'react';
import { getAuthUser } from '../redux/actions/auth-actions';
import { storeHideFocusCard } from '../redux/actions/layout-actions';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { ResumeDrop, UserEnum } from '../../config/db-config';
import Form, { toggleSubmit, checkDiff } from '../component/form';
import ValidationStudentAction from '../component/validation-student-action';
import { Loader } from '../component/loader';
import PropTypes from 'prop-types';

import { RootPath } from '../../config/app-config';
import { NavLink } from 'react-router-dom';
import obj2arg from 'graphql-obj2arg';
import { Time } from '../lib/time';
import { hasResume } from '../component/doc-link-form.jsx';

import { getFeedbackPopupView } from './partial/analytics/feedback';

export default class ResumeDropPage extends React.Component {

    constructor(props) {
        super(props);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.state = {
            error: null,
            disableSubmit: false,
            success: null,
            loading: true,
            data: {
                resume_drop: null,
                company: null,
                doc_links: null,
                resume_drops_limit: null
            }
        };
    }

    componentWillMount() {
        if (this.props.match) {
            this.company_id = this.props.match.params.company_id
        } else {
            this.company_id = this.props.company_id;
        }

        this.company_id = Number.parseInt(this.company_id);
        this.defaultValues = {};
        this.isEdit = false;
        this.formItems = [{
            name: ResumeDrop.DOC_LINKS,
            type: "checkbox",
            // EUR CHANGES
            label: "Document To Be Submitted",
            //label: "Select Documents",
            required: true,
            disabled: true,
            sublabel: <NavLink onClick={() => { storeHideFocusCard() }}
                to={`${RootPath}/app/edit-profile/doc-link`}>Add More Documents</NavLink>,
            data: null,
        },
            // {
            //     name: ResumeDrop.MESSAGE,
            //     type: "textarea",
            //     label: "Message (optional)",
            //     placeholder: "Write Down Your Message Here..."
            // }
        ];
        this.loadData();
    }

    loadData() {
        var data = {
            resume_drop: null,
            company: null,
            doc_links: null
        }

        var loaded = 0;
        var toLoad = 3;

        var user_id = getAuthUser().ID;

        const finishLoad = () => {
            loaded++;

            if (loaded >= toLoad) {
                this.setState(() => {
                    return { data: data, loading: false };
                });
            }
        }

        // load company info
        var query = `query{company(ID:${this.company_id}){
             name}}`;
        getAxiosGraphQLQuery(query).then((res) => {
            data.company = res.data.data.company;
            finishLoad();
        });

        //load if there is any resume_drops_limit
        var query = `query{resume_drops_limit(user_id:${user_id})}`;
        getAxiosGraphQLQuery(query).then((res) => {
            data.resume_drops_limit = res.data.data.resume_drops_limit;
            finishLoad();
        });

        // load document
        var query = `query{user(ID:${user_id}){ doc_links{ID label url} }}`;
        getAxiosGraphQLQuery(query).then((res) => {
            var userData = res.data.data.user;
            var dl = userData.doc_links;

            if (hasResume(dl)) {
                data.doc_links = dl;
            } else {
                data.doc_links = null;
            }

            finishLoad();
        });

        // load existing resume drop
        var query = `query{resume_drop(student_id:${user_id}, company_id:${this.company_id}){
                    ID doc_links{ID label url} message updated_at}}`;

        getAxiosGraphQLQuery(query).then((res) => {
            data.resume_drop = res.data.data.resume_drop;
            if (data.resume_drop !== null) {
                this.isEdit = true;
            }
            finishLoad();
        });
    }

    formOnSubmit(d) {
        toggleSubmit(this, { error: null, success: null });

        if (!d[ResumeDrop.DOC_LINKS]) {
            toggleSubmit(this, { error: "Please Select A Document", success: null });
            return;
        }

        var doc_links = JSON.stringify(d[ResumeDrop.DOC_LINKS].map((d, i) => Number.parseInt(d)));
        var query = null;

        //edit
        if (this.isEdit) {
            var original = this.defaultValues;
            d[ResumeDrop.DOC_LINKS] = doc_links;
            original[ResumeDrop.DOC_LINKS] = JSON.stringify(original[ResumeDrop.DOC_LINKS]);

            var update = checkDiff(this, this.defaultValues, d);
            if (update === false) {
                return;
            }
            update[ResumeDrop.ID] = this.state.data.resume_drop.ID;

            query = `mutation{edit_resume_drop(${obj2arg(update, { noOuterBraces: true })}) {
            ID doc_links{ID label url} message updated_at}}`;
        }
        // create new 
        else {
            var ins = d;
            ins[ResumeDrop.DOC_LINKS] = doc_links;
            ins[ResumeDrop.STUDENT_ID] = getAuthUser().ID;
            ins[ResumeDrop.COMPANY_ID] = this.company_id;
            query = `mutation{add_resume_drop(${obj2arg(ins, { noOuterBraces: true })}) {
            ID doc_links{ID label url} message updated_at}}`;
        }

        getAxiosGraphQLQuery(query).then((res) => {
            var data = this.state.data;
            data.resume_drop = (this.isEdit) ? res.data.data.edit_resume_drop : res.data.data.add_resume_drop;

            var m = "Successfully " + ((this.isEdit) ? "Edit" : "Added New") + " Record";

            this.isEdit = true;

            toggleSubmit(this, { error: null, data: data, success: m });
        }, (err) => {
            toggleSubmit(this, { error: err.response.data });
        });
    }

    render() {
        if (!this.props.company_id) {
            document.setTitle(`Resume Drop`);
        }

        var view = null
        if (this.state.loading) {
            view = <Loader text="Loading information..." size="3"></Loader>;

        } else {
            var v = null;
            var existed = null;

            var no_doc_link = typeof this.state.data.doc_links === "undefined"
                || this.state.data.doc_links === null
                || this.state.data.doc_links.length === 0;


            // has limit need to fill feedback
            if (this.state.data.resume_drops_limit !== null && !this.isEdit) {
                v = getFeedbackPopupView();
            }
            // no doc
            else if (no_doc_link) {
                v = [];
                if (no_doc_link) {
                    v.push(<div>
                        It seems that you don't have any<br></br><b>Resume</b> or <b>Academic Transcript</b> uploaded in your profile yet.
                        <br></br><br></br>
                        <NavLink onClick={storeHideFocusCard}
                            className="btn btn-primary"
                            to={`${RootPath}/app/edit-profile/doc-link`}>Upload Resume Now</NavLink>
                    </div>);
                }

            } else {
                // EUR CHANGES
                // changes to select all by default
                this.defaultValues[ResumeDrop.DOC_LINKS] = this.state.data.doc_links.map((d, i) => {
                    if (d == null) return;
                    return d.ID
                });

                // already submitted, create for default values
                if (this.isEdit) {
                    // this.defaultValues[ResumeDrop.DOC_LINKS] = this.state.data.resume_drop.doc_links.map((d, i) => {
                    //     if (d == null) return;
                    //     return d.ID
                    // });
                    this.defaultValues[ResumeDrop.MESSAGE] = this.state.data.resume_drop.message;

                    existed = <i className="text-success">
                        {`Resume submitted on ${Time.getString(this.state.data.resume_drop.updated_at)}`}
                        <br></br><br></br></i>;

                }

                // create document checbox
                var docs = this.state.data.doc_links.map((d, i) => {
                    if (d == null) return;

                    return { key: d.ID, label: <a href={d.url} target="_blank">{d.label}</a> };
                });
                if (this.formItems[0].data === null) {
                    this.formItems[0].data = docs;
                }

                // create form
                var v = <Form className="form-row"
                    items={this.formItems}
                    onSubmit={this.formOnSubmit}
                    submitText={(this.isEdit) ? "Save Change" : "Submit"}
                    defaultValues={this.defaultValues}
                    disableSubmit={this.state.disableSubmit}
                    error={this.state.error}
                    success={this.state.success}></Form>;
            }

            var title = (this.props.company_id) ? <br></br> : <h4>{this.state.data.company.name}</h4>;

            if (!this.props.company_id) {
                document.setTitle(`Resume Drop - ${this.state.data.company.name}`);
            }

            view = <div>{title}
                {existed}
                {v}
            </div>;
        }

        return (<div>
            {(this.props.company_id) ? null : <h3>Resume Drop</h3>}
            {view}
        </div >);


    }
}

ResumeDrop.propTypes = {
    company_id: PropTypes.number
};