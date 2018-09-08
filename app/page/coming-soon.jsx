import React, { Component } from 'react';
import SponsorList from './partial/static/sponsor-list';
import { getCF, getCFObj, isRoleStudent, isRoleRec, getAuthUser } from '../redux/actions/auth-actions';
import { errorBlockLoader, storeHideBlockLoader } from '../redux/actions/layout-actions';
import { Time } from '../lib/time';
import PropTypes from 'prop-types';
import { Loader } from '../component/loader';
import Timer from '../component/timer';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import Form, { toggleSubmit, checkDiff } from '../component/form';
import { Prescreen, PrescreenEnum } from '../../config/db-config';
import obj2arg from 'graphql-obj2arg';
import { NavLink } from 'react-router-dom';
import { RootPath } from '../../config/app-config';
import { createCompanyTitle } from './companies';
import CompaniesSection from './partial/hall/companies';
import HallPage from './hall';


export function getCFTimeDetail(date, time, time_mas) {
    return <span>
        {(typeof date === "undefined" || date == null) ? null
            : <span><i className="fa fa-calendar left"></i>{date}</span>}
        <br></br>
        <span style={{ opacity: "0.8", fontSize: "90%" }}>
            {(typeof time === "undefined" || time == null) ? null
                : <span><i className="fa fa-clock-o left"></i>{time}</span>}
            <br></br>
            {(typeof time_mas === "undefined" || time_mas == null) ? null
                : <span><i className="fa fa-clock-o left"></i>{time_mas}</span>}
        </span>
    </span>;
}


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
            hasResume: false,
            defaultValues: {}
        };

        this.formOnSubmit = this.formOnSubmit.bind(this);
    }

    componentWillMount() {
        var coms = false;
        var user_data = false;

        const finishLoad = () => {
            if (coms !== false && user_data !== false) {
                this.setState(() => {

                    // create form default value
                    var defaultValues = {};
                    defaultValues[Prescreen.COMPANY_ID]
                        = user_data.registered_prescreens.map((d, i) => {
                            return d.company_id;
                        });

                    //check if has resume
                    var hasResume = false;
                    user_data.doc_links.map((d, i) => {
                        var label = d.label.replaceAll(" ", "");
                        if (label.toUpperCase() == "RESUME") {
                            hasResume = true;
                        }
                    });

                    return {
                        coms: coms,
                        user_data: user_data,
                        defaultValues: defaultValues,
                        hasResume: hasResume,
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

    formOnSubmit(d) {
        // check if has resume
        if (!this.state.hasResume) {
            var link = <NavLink onClick={() => { storeHideBlockLoader() }}
                to={`${RootPath}/app/edit-profile/doc-link`}>
                Document & Link</NavLink>;

            var mes = <div>Please upload a document with label <b>"Resume"</b> at {link}
                {" "} before registering for pre-screens</div>;

            errorBlockLoader(mes);
            return;
        }

        //start loading
        toggleSubmit(this, { error: null, success: null });

        var existed = this.state.defaultValues[Prescreen.COMPANY_ID];
        var newCom = "";
        var toInsert = 0;
        var inserted = [];
        const finishInsert = (company_id) => {
            inserted.push(company_id);
            if (inserted.length >= toInsert) {
                // finish loading and add inserted company to state
                this.setState((prevState) => {
                    // concat inserted company to state default values
                    prevState.defaultValues[Prescreen.COMPANY_ID]
                        = prevState.defaultValues[Prescreen.COMPANY_ID].concat(inserted);
                    return {
                        disableSubmit: false
                        , success: `Successfully submitted resume for ${inserted.length} company(s)`
                        , defaultValues: prevState.defaultValues
                        , error: null
                    };
                });
            }
        };

        // try insert
        if (typeof d.company_id !== "undefined") {
            d.company_id.map((cid, i) => {
                cid = Number.parseInt(cid);
                // if not aleary exist then insert
                if (existed.indexOf(cid) < 0) {
                    toInsert++;
                    var ins = {};
                    ins[Prescreen.STUDENT_ID] = this.user_id;
                    ins[Prescreen.STATUS] = PrescreenEnum.STATUS_PENDING;
                    ins[Prescreen.COMPANY_ID] = cid;
                    ins[Prescreen.SPECIAL_TYPE] = PrescreenEnum.ST_PRE_SCREEN;
                    ins[Prescreen.UPDATED_BY] = this.user_id;

                    var insert = `mutation{add_prescreen(${obj2arg(ins, { noOuterBraces: true })}){company_id}}`;
                    console.log(insert);
                    getAxiosGraphQLQuery(insert).then((res) => {
                        finishInsert(res.data.data.add_prescreen.company_id);
                    });
                }
            });
        }

        // empty new choice
        if (toInsert == 0) {
            toggleSubmit(this, { error: "Please select new company(s) to register" });
        }
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
                return { key: d.ID, label: createCompanyTitle(d) };
            });

            if (dataComs.length <= 0) {
                return null;
            } else {
                var formItems = [
                    { header: "Select Company To Submit Resume" },
                    {
                        name: Prescreen.COMPANY_ID,
                        type: "checkbox",
                        data: dataComs,
                        disabledOnChecked: <span className="label label-success label-pill">Registered</span>,
                    }
                ];
                console.log(this.state);
                view = <Form className="form-row"
                    items={formItems}
                    onSubmit={this.formOnSubmit}
                    btnColorClass="blue btn-block"
                    submitText='Submit Resume'
                    defaultValues={this.state.defaultValues}
                    disableSubmit={this.state.disableSubmit}
                    error={this.state.error}
                    success={this.state.success}>
                </Form>;
            }
        }

        return <div className="card-container">
            <h3>Submit Your Resume</h3>
            <br></br>
            <div style={{ maxWidth: "400px", margin: "auto" }}>
                Get reviewed earlier before the career fair!<br></br>
                Submit, and wait for confirmation for special time slot with recruiters if you are selected.
            </div>
            <br></br>
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
        this.dateStr = Time.getPeriodString(this.CFObj.start, this.CFObj.end, this.CFObj.dates);
    }

    render() {
        document.setTitle("Coming Soon");
        var doneMes = <div>
            Virtual Career Fair Starting Now
            <br></br>
            <small>Please Refresh Your Page</small>
            <br></br>
        </div>;
        //{isRoleStudent() ? <RegisterPS></RegisterPS> : null}
        let companySection = null;
        if (isRoleStudent()) {
            companySection = <div>
                <div className="line"></div>
                <div>
                    <div style={{ maxWidth: "400px", margin: "auto" }}>
                        <h3>Submit Your Resume</h3>
                        <div>
                            Get reviewed early!<br></br>
                            Submit and receive confirmation for special time slot with recruiters if you are selected.
                    </div>
                    </div>
                    <div style={{ maxWidth: "400px", margin: "auto" }}>
                        <h3>Join Group Session</h3>
                        <div>
                            Don’t forget to keep checking for<br></br>new group session time slots to join!
                    </div>
                    </div>
                    <br></br>
                </div>
                <CompaniesSection isPreEvent={true}></CompaniesSection>
                <br></br>
                <br></br>
                <div className="line"></div>
                <SponsorList type="coming-soon"></SponsorList>
            </div>;
        }

        let recHall = null;
        if (isRoleRec()) {
            recHall = <HallPage isPreEvent={true}></HallPage>
        }

        return (<div>
            <h1>
                <small>Coming Soon</small>
                <br></br>
                {this.CFObj.title}
                <br></br>
                <small>
                    {getCFTimeDetail(this.dateStr, this.CFObj.time_str, this.CFObj.time_str_mas)}
                </small>
            </h1>
            <Timer end={this.CFObj.start} doneMes={doneMes}>
            </Timer>
            {companySection}
            {recHall}
        </div>
        );
    }
}

