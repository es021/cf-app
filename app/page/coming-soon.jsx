import React, { Component } from 'react';
import SponsorList from './partial/static/sponsor-list';
import { getCF, getCFObj, isRoleStudent, getAuthUser } from '../redux/actions/auth-actions';
import { Time } from '../lib/time';
import PropTypes from 'prop-types';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import Form, { toggleSubmit, checkDiff } from '../component/form';
import { Prescreen, PrescreenEnum } from '../../config/db-config';
import obj2arg from 'graphql-obj2arg';
import { NavLink } from 'react-router-dom';

class RegisterPS extends React.Component {
    constructor(props) {
        super(props);
        this.CF = getCF();
        this.user_id = getAuthUser().ID;

        this.state = {
            coms: null,
            user_data: null,
            loading: true,
            disableSubmit: false,
            error: null,
            success: null,
            defaultValues: {}
        };


        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.hasResume = this.hasResume.bind(this);
    }

    componentWillMount() {
        var coms = false;
        var user_data = false;

        function finishLoad() {
            if (coms !== false && student !== false) {
                this.setState(() => {

                    // create form default value
                    var defaultValues = {};
                    defaultValues[Prescreen.COMPANY_ID]
                        = user_data.registered_prescreens.map((d, i) => {
                            return d.company_id;
                        });

                    return {
                        coms: coms,
                        reg_ps: reg_ps,
                        defaultValues: defaultValues,
                        loading: false
                    };
                });
            }
        }
        //load coms
        getAxiosGraphQLQuery(`query{companies(accept_prescreen:1){ID name}}`)
            .then((res) => {
                coms = res.data.data.companies;
                finishLoad();
            });

        //load student 
        getAxiosGraphQLQuery(`query{user(ID:${this.user_id})
            { doc_links{label} registered_prescreens{ID company_id status} }}`)
            .then((res) => {
                user_data = res.data.data.user;
                finishLoad();
            });
    }

    hasResume() {
        var hasResume = false;
        this.state.user_data.doc_links.map((d, i) => {
            var label = d.label.replaceAll(" ", "");
            if (label.toUpperCase() == "RESUME") {
                hasResume = true;
            }
        });
        return hasResume;
    }

    formOnSubmit(d) {
        console.log("form data");
        console.log(d);
        console.log("existing data");
        console.log(this.defaultValues[Prescreen.COMPANY_ID]);

        return;
        toggleSubmit(this, { error: null, success: null });

        var ins = {};
        ins[Prescreen.STUDENT_ID] = this.user_id;
        ins[Prescreen.STATUS] = PrescreenEnum.STATUS_PENDING;
        ins[Prescreen.COMPANY_ID] = d.ID;

        var insert = `mutation{add_prescreen(${obj2arg(ins, { noOuterBraces: true })})
        {ID}}`;

        getAxiosGraphQLQuery(insert).then((res) => {

        });
    }

    render() {

        var view = null

        if (this.state.loading) {
            view = <Loader size="2" text="Loading Prescreen Companies.."></Loader>;
        } else {
            // view = JSON.stringify(this.state.coms);
            // view += JSON.stringify(this.state.reg_ps);

            // create form item
            var dataComs = this.state.coms.map((d, i) => {
                return { key: d.ID, label: d.name };
            });

            var formItems = {
                label: "Select Company To Register",
                name: Prescreen.COMPANY_ID,
                type: "checkbox",
                data: dataComs
            }



            console.log("forms");
            console.log(formItems);
            console.log(this.state.defaultValues);

            view = <div>
                <Form className="form-row"
                    items={formItems}
                    onSubmit={this.formOnSubmit}
                    submitText='Submit Registration'
                    defaultValues={this.state.defaultValues}
                    disableSubmit={this.state.disableSubmit && this.hasResume}
                    error={this.state.error}
                    success={this.state.success}>
                </Form>
                {(!this.hasResume)
                    ? <div>Please upload a document with label <b>"Resume"</b> at
                        <NavLink to={`${path}/edit-profile/doc-link`}>
                            Document & Link
                        </NavLink> before you can register for pre-screens
                    </div>
                    : null}
            </div>;
        }

        return <div>
            <h3>Pre-Screens Registration</h3>
            {view}
        </div>;
    }
}

export default class ComingSoonPage extends React.Component {
    constructor(props) {
        super(props);
        this.CFObj = getCFObj();
    }

    componentWillMount() {
        this.timeStr = Time.getPeriodString(this.CFObj.start, this.CFObj.end);
    }

    render() {
        document.setTitle("Coming Soon");
        return (<div>
            <h1>
                <small>Coming Soon</small>
                <br></br>
                {this.CFObj.title}
                <br></br>
                <small>{this.timeStr}</small>
            </h1>

            // TODO add timer

            {isRoleStudent() ? <RegisterPS></RegisterPS> : null}

            <SponsorList type="coming-soon"></SponsorList>
        </div>
        );
    }
}


