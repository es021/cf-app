import React, { Component } from 'react';
import { passwordResetRequest } from '../redux/actions/auth-actions';
import Form, { toggleSubmit } from '../component/form';
import { AuthAPIErr } from '../../server/api/auth-api';
import {  NavLink } from 'react-router-dom';
import { RootPath } from '../../config/app-config';

export default class PasswordForgotPage extends React.Component {
    constructor(props) {
        super(props);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.state = {
            error: null,
            disableSubmit: false,
            success: null
        };
    }

    componentWillMount() {
        this.formItem = [{
            name: "user_email",
            type: "email",
            placeholder: "Please Enter Your Login Email",
            required: true
        }];

        this.defaultValues = {
            user_email : this.props.match.params.email
        };
    }

    formOnSubmit(d) {
        toggleSubmit(this, { error: null });

        passwordResetRequest(d.user_email)
            .then((res) => {
                var successMes = <span>
                    A link to reset your password has been sent to<br></br>
                    <b>{d.user_email}</b>
                    <br></br><small>**It may take a few minutes to arrive**</small>
                </span>;
                toggleSubmit(this, { error: null, success: successMes });
            }
            , (err) => {
                var errorMes = "Something went wrong. Please try again";
                if (err.response.data == AuthAPIErr.INVALID_EMAIL) {
                    errorMes = <span>There is no account registered with email <b>{d.user_email}</b>
                        <br></br><NavLink to={`${RootPath}/auth/sign-up`}>Register Now</NavLink>
                    </span>;
                }
                toggleSubmit(this, { error: errorMes, success: null });
            });

    }

    render() {
        document.setTitle("Request Password Reset");

        return (<div>
            <h3>Request Password Reset
                <br></br><small>We will email a link to reset your password</small>
            </h3>
            <Form className="form-row"
                items={this.formItem}
                disableSubmit={this.state.disableSubmit}
                submitText="Submit"
                defaultValues = {this.defaultValues}
                onSubmit={this.formOnSubmit}
                success={this.state.success}
                emptyOnSuccess={true}
                error={this.state.error}></Form>
        </div>
        );
    }
}




