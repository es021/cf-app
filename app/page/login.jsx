import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as authActions from '../redux/actions/auth-actions';
import { User, UserMeta } from '../../config/db-config';

import { bindActionCreators } from 'redux';
import Form, { getDataCareerFair } from '../component/form';

import { RootPath, isProd } from '../../config/app-config';
import { Redirect, NavLink } from 'react-router-dom';
//<NavLink to={`${RootPath}/auth/activation-link`}>Did Not Received Email?</NavLink>

import { ButtonLink } from '../component/buttons.jsx';
// import { AuthAPIErr } from '../../server/api/auth-api';
import { AuthAPIErr } from "../../config/auth-config";

import { getCF, isCookieEnabled } from '../redux/actions/auth-actions';
import { lang } from '../lib/lang';
import { ErrorMessage } from './sign-up';
import * as layoutActions from "../redux/actions/layout-actions";

//state is from redux reducer
// with multiple objects
function mapStateToProps(state, ownProps) {
    return {
        redux: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        login: authActions.login
    }, dispatch);
}


class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.getFormItem = this.getFormItem.bind(this);

        // @kpt_validation - init current
        this.currentKpt = "";
        this.currentIdUtm = "";

    }
    getFormItem() {
        let r = [
            {
                label: lang("Email"),
                name: User.EMAIL,
                type: "email",
                placeholder: "john.doe@gmail.com",
                required: true
            },
            {
                label: lang("Password"),
                name: User.PASSWORD,
                type: "password",
                placeholder: "*****",
                required: true
            },
            // {
            //     label: "Select Career Fair",
            //     name: User.CF,
            //     type: "radio",
            //     data: getDataCareerFair("login"),
            //     required: true
            // },
        ];

        // @kpt_validation - new field
        if (this.isNeedKptInput()) {
            r.push({
                label: lang("IC Number"),
                name: UserMeta.KPT,
                type: "number",
                placeholder: "Enter your IC number here",
                required: true
            })
        }

        // @id_utm_validation - new field
        if (this.isNeedIdUtmInput()) {
            r.push({
                label: lang("UTM Acid ID"),
                name: UserMeta.ID_UTM,
                type: "text",
                placeholder: "Enter your UTM Acid ID here",
                required: true
            })
        }

        return r;
    }
    componentWillMount() {


        // this.formItem = [
        //     {
        //         label: lang("Email"),
        //         name: User.EMAIL,
        //         type: "email",
        //         placeholder: "john.doe@gmail.com",
        //         required: true
        //     },
        //     {
        //         label: lang("Password"),
        //         name: User.PASSWORD,
        //         type: "password",
        //         placeholder: "*****",
        //         required: true
        //     },
        //     // {
        //     //     label: "Select Career Fair",
        //     //     name: User.CF,
        //     //     type: "radio",
        //     //     data: getDataCareerFair("login"),
        //     //     required: true
        //     // },

        // ];

        this.CF = getCF();
        this.defaultValues = {};


        // for sign up page only
        if (this.props.defaultLogin) {
            this.defaultValues[User.EMAIL] = this.props.defaultLogin
        }

        this.defaultValues[User.CF] = getCF();
    }

    // @kpt_validation
    isNeedKptInput() {
        return [
            AuthAPIErr.KPT_NOT_FOUND_IN_USER_RECORD,
            AuthAPIErr.KPT_NOT_JPA,
            AuthAPIErr.KPT_ALREADY_EXIST
        ].indexOf(this.props.redux.error) >= 0
    }

    isNeedIdUtmInput() {
        return [
            AuthAPIErr.ID_UTM_NOT_FOUND_IN_USER_RECORD,
            AuthAPIErr.ID_UTM_NOT_VALID,
            AuthAPIErr.ID_UTM_ALREADY_EXIST
        ].indexOf(this.props.redux.error) >= 0
    }

    formOnSubmit(d) {
        // @kpt_validation - set current
        this.currentKpt = d[UserMeta.KPT];

        // @id_utm_validation - set current
        this.currentIdUtm = d[UserMeta.ID_UTM];

        this.props.login({
            email: d[User.EMAIL],
            password: d[User.PASSWORD],
            cf: this.CF,
            kpt: d[UserMeta.KPT], // @kpt_validation - login - new param
            id_utm: d[UserMeta.ID_UTM], // @id_utm_validation - login - new param
        });
    }

    showGoogleChromeWarning() {
        if (!isProd || authActions.isRoleAdmin()) {
            return;
        }

        try {

            var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            if (!isChrome) {
                let message = <div style={{ fontSize: '15px', padding: "10px" }}>
                    <br></br>
                    <i className="fa fa-warning fa-3x"></i>
                    <br></br>
                    <br></br>
                    <small><b>We detected that you are not using Google Chrome.</b></small>
                    <br></br>
                    <br></br>
                    For best experience, we recommend you login again using Google Chrome.
                    <br></br>
                    <br></br>
                    <button onClick={() => {
                        layoutActions.storeHideBlockLoader();
                    }} className="btn btn-md btn-round-10 btn-bold btn-blue-light">
                        Okay
                    </button>

                </div>;

                layoutActions.customBlockLoader(null, null, null, null, true, message, true);
            }
        } catch (err) {

        }
    }

    render() {
        document.setTitle("Login");
        const defaultPath = `${RootPath}/app/`;

        console.log("from login render");
        console.log("this.props.location", this.props.location);
        var from = {};
        if (typeof this.props.location !== "undefined" && typeof this.props.location.state !== "undefined") {
            from = this.props.location.state.from;
        } else {
            from = { pathname: defaultPath };
        }
        console.log("from", from);


        //handle from logout
        if (from.pathname == `${RootPath}/app/logout`) {
            from.pathname = defaultPath;
        }

        var redirectToReferrer = this.props.redux.isAuthorized;
        var fetching = this.props.redux.fetching;
        var error = this.props.redux.error;

        switch (error) {
            case AuthAPIErr.INVALID_EMAIL:
                error = <span>
                    {lang("User does not exist.")}
                    <br></br>
                    <small><NavLink to={`${RootPath}/auth/sign-up`}>{lang("Sign Up Now")}</NavLink></small>
                </span>;
                break;
            case AuthAPIErr.NOT_ACTIVE:
                error = <span>
                    This account is <b>not active</b> yet.
                    <br></br>Please check your email for the activation link.
                    <br></br>If you did not received any email, contact us at <b>innovaseedssolution@gmail.com</b>
                </span>;
                // <small><NavLink to={`${RootPath}/auth/activation-link`}>Did Not Received Email?</NavLink></small>
                break;
            case AuthAPIErr.WRONG_PASS:
                error = <span>
                    {lang("Password incorrect.")}
                    <br></br>
                    <small><NavLink to={`${RootPath}/auth/password-forgot`}>{lang("Forgot Your Password?")}</NavLink></small>
                </span>;
                break;
            case AuthAPIErr.INVALID_CF:
                error = <span>
                    {lang("This account is not registered for the selected career fair.")}
                </span>;
                break;
        }


        // @kpt_validation
        if (error == AuthAPIErr.KPT_NOT_FOUND_IN_USER_RECORD
            || (error == AuthAPIErr.KPT_NOT_JPA && !this.currentKpt)) {
            error = <span>
                {lang("Please provide your IC number to continue.")}
            </span>;
        } else if (error == AuthAPIErr.KPT_NOT_JPA) {
            error = ErrorMessage.KPT_NOT_JPA(this.currentKpt);
        } else if (error == AuthAPIErr.KPT_ALREADY_EXIST) {
            error = ErrorMessage.KPT_ALREADY_EXIST(this.currentKpt);
        } else if (error == AuthAPIErr.JPA_OVER_LIMIT) {
            error = ErrorMessage.JPA_OVER_LIMIT(this.currentKpt);
        }

        // @id_utm_validation
        if (error == AuthAPIErr.ID_UTM_NOT_FOUND_IN_USER_RECORD
            || (error == AuthAPIErr.ID_UTM_NOT_VALID && !this.currentIdUtm)) {
            error = <span>
                {lang("Please provide your UTM Acid ID to continue.")}
            </span>;
        } else if (error == AuthAPIErr.ID_UTM_NOT_VALID) {
            error = ErrorMessage.ID_UTM_NOT_VALID(this.currentIdUtm);
        } else if (error == AuthAPIErr.ID_UTM_ALREADY_EXIST) {
            error = ErrorMessage.ID_UTM_ALREADY_EXIST(this.currentIdUtm);
        }

        if (error == null && !isCookieEnabled()) {
            error = <span>Cookies is needed to keep you signed in. You need to enable your browser cookies to use your account.<br></br>
                <small><NavLink to={`${RootPath}/auth/allow-cookie`}>Click Here To Learn How</NavLink></small>
            </span>;
            redirectToReferrer = false;
        }

        console.log("redirectToReferrer", redirectToReferrer);

        // if authorized redirect to from
        if (redirectToReferrer) {
            console.log("redirect to", from.pathname)

            this.showGoogleChromeWarning();

            return (
                <Redirect to={from} />
            );
        } else {
            return (
                <div>
                    {this.props.title ? this.props.title : <h3>{lang("Login")}</h3>}
                    <Form className="form-row"
                        items={this.getFormItem()}
                        disableSubmit={fetching}
                        defaultValues={this.defaultValues}
                        submitText={lang("Log In")}
                        onSubmit={this.formOnSubmit}
                        btnColorClass={"default"}
                        error={error}></Form>
                </div>
            );
        }
    }
}

//<div>You must log in to view the page at {from.pathname}</div>s

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
