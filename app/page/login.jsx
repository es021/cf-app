import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as authActions from '../redux/actions/auth-actions';
import { User } from '../../config/db-config';

import { bindActionCreators } from 'redux';
import Form, { getDataCareerFair } from '../component/form';

import { RootPath } from '../../config/app-config';
import { Redirect, NavLink } from 'react-router-dom';
//<NavLink to={`${RootPath}/auth/activation-link`}>Did Not Received Email?</NavLink>

import { ButtonLink } from '../component/buttons';
import { AuthAPIErr } from '../../server/api/auth-api';
import { getCF } from '../redux/actions/auth-actions';

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
    }

    componentWillMount() {
      

        this.formItem = [
            {
                label: "Email",
                name: User.EMAIL,
                type: "email",
                placeholder: "john.doe@gmail.com",
                required: true
            },
            {
                label: "Password",
                name: User.PASSWORD,
                type: "password",
                placeholder: "*****",
                required: true
            },
            {
                label: "Select Career Fair",
                name: User.CF,
                type: "radio",
                data: getDataCareerFair("login"),
                required: true
            },

        ];

        this.CF = getCF();
        this.defaultValues = {};
        this.defaultValues[User.CF] = getCF();
    }

    formOnSubmit(d) {
        //console.log("login", data);
        this.props.login(d[User.EMAIL], d[User.PASSWORD], d[User.CF]);
    }

    render() {
        document.setTitle("Login");
        const defaultPath = `${RootPath}/app/`;

        //console.log("from login render");
        //console.log(this.props.redux);
        var from = {};
        if (typeof this.props.location !== "undefined" && typeof this.props.location.state !== "undefined") {
            from = this.props.location.state;
        } else {
            from = { pathname: defaultPath };
        }


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
                    User does not exist.
                    <br></br>
                    <small><NavLink to={`${RootPath}/auth/sign-up`}>Sign Up Now</NavLink></small>
                </span>;
                break;
            case AuthAPIErr.NOT_ACTIVE:
                error = <span>
                    This account is not active yet.<br></br>Please check your email for the activation link.
                    <br></br>
                    <small><NavLink to={`${RootPath}/auth/activation-link`}>Did Not Received Email?</NavLink></small>
                </span>;
                break;
            case AuthAPIErr.WRONG_PASS:
                error = <span>
                    Password Incorrect
                    <br></br>
                    <small><NavLink to={`${RootPath}/auth/forgot-password`}>Forgot Your Password?</NavLink></small>
                </span>;
                break;
            case AuthAPIErr.INVALID_CF:
                error = <span>
                    This account is not registered for the selected career fair
                </span>;
                break;
        }

        // if authorized redirect to from
        if (redirectToReferrer) {
            return (
                <Redirect to={from} />
            );
        } else {
            return (
                <div><h3>Login</h3>

                    <Form className="form-row"
                        items={this.formItem}
                        disableSubmit={fetching}
                        defaultValues={this.defaultValues}
                        submitText="Log In"
                        onSubmit={this.formOnSubmit}
                        error={error}></Form>
                </div>
            );
        }
    }
}

//<div>You must log in to view the page at {from.pathname}</div>



export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
