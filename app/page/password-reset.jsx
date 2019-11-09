import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '../component/loader';
import Form, { toggleSubmit } from '../component/form';
import Restricted from './partial/static/restricted';
// import { AuthAPIErr } from '../../server/api/auth-api';
import {AuthAPIErr} from "../../config/auth-config";

import { passwordResetOld, passwordResetToken, getAuthUser, isAuthorized } from '../redux/actions/auth-actions';
import { NavLink } from 'react-router-dom';
import { RootPath } from '../../config/app-config';

export default class PasswordResetPage extends React.Component {
    constructor(props) {
        super(props);
        this.getFormItem = this.getFormItem.bind(this);
        this.finishFormSubmit = this.finishFormSubmit.bind(this);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.TYPE_TOKEN = "token";
        this.TYPE_OLD = "old";
        this.state = {
            error: null,
            disableSubmit: false,
            success: null
        };
    }

    componentWillMount() {
        this.token = null;
        this.user_id = null;
        if (this.props.match) {
            var url_params = this.props.match.params;
            this.token = (url_params.token) ? url_params.token : null;
            this.user_id = (url_params.user_id) ? Number.parseInt(url_params.user_id) : null;
            console.log(url_params);
            console.log(this.user_id);
            console.log(this.user_id);
            console.log(this.user_id);
            if (Number.isNaN(this.user_id)) {
                this.user_id = null;
            }
        }
        // open from reset password link
        if (this.token !== null && this.user_id !== null) {
            this.type = this.TYPE_TOKEN;
        }
        // open after login to change old password
        else if (isAuthorized()) {
            this.type = this.TYPE_OLD;
            this.user_id = getAuthUser().ID;
        }
        // invalid -- show error
        else {
            this.type = null;
        }

        this.formItem = this.getFormItem();
    }

    getFormItem() {
        var formItem = [];
        if (this.type == this.TYPE_OLD) {
            formItem.push({
                label: "Old Password",
                name: "old_password",
                type: "password",
                placeholder: "****",
                required: true
            });
        }

        formItem.push(...[{
            label: "New Password",
            name: "new_password",
            type: "password",
            placeholder: "****",
            required: true
        },
        {
            label: "Confirm New Password",
            name: "confirm_new_password",
            type: "password",
            placeholder: "****",
            required: true
        }
        ]);

        return formItem;
    }

    finishFormSubmit(res, err = null) {
        var errorMes = null;

        if (err != null) {
            var tokenMes = <span>Please request a new password reset link <NavLink to={`${RootPath}/auth/password-forgot`}>here</NavLink></span>;

            switch (err.response.data) {
                case AuthAPIErr.WRONG_PASS:
                    errorMes = "The old password given is incorrect";
                    break;
                case AuthAPIErr.TOKEN_INVALID:
                    errorMes = <span><b>Invalid Token</b><br></br>{tokenMes}</span>;
                    break;
                case AuthAPIErr.TOKEN_EXPIRED:
                    errorMes = <span><b>Token Has Expired</b><br></br>{tokenMes}</span>;
                    break;
            }
        }

        toggleSubmit(this,
            {
                error: errorMes,
                success: (res == null) ? null
                    : "Your password has been successfully set"
            }
        );
    }

    formOnSubmit(d) {
        toggleSubmit(this, { error: null });

        if (d.new_password !== d.confirm_new_password) {
            toggleSubmit(this, { error: "New Password Does Not Match" });
            return;
        }

        if (this.type == this.TYPE_OLD) {
            passwordResetOld(d.new_password, d.old_password, this.user_id)
                .then((res) => { this.finishFormSubmit(res) }
                , (err) => { this.finishFormSubmit(null, err) });

        } else if (this.type == this.TYPE_TOKEN) {
            passwordResetToken(d.new_password, this.token, this.user_id)
                .then(
                (res) => { this.finishFormSubmit(res) }
                , (err) => { this.finishFormSubmit(null, err) });
        }
    }

    render() {
        document.setTitle("Password Reset");

        if (!this.type) {
            return <Restricted></Restricted>;
        }

        return (<div>
            <h3>Password Reset</h3>
            <Form className="form-row"
                items={this.formItem}
                disableSubmit={this.state.disableSubmit}
                submitText="Submit"
                onSubmit={this.formOnSubmit}
                success={this.state.success}
                emptyOnSuccess={true}
                error={this.state.error}></Form>
        </div>
        );
    }
}


