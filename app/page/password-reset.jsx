import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '../component/loader';
import Form, { toggleSubmit } from '../component/form';

import Restricted from './partial/static/restricted';
import { AuthAPIErr } from '../../server/api/auth-api';
import { passwordResetOld, passwordResetToken, getAuthUser } from '../redux/actions/auth-actions';

export default class PasswordResetPage extends React.Component {
    constructor(props) {
        super(props);
        this.getForm = this.getForm.bind(this);
        this.finishFormSubmit = this.finishFormSubmit.bind(this);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.state = {
            error: null,
            disableSubmit: false,
            success: null
        };
    }

    componentWillMount() {
        var url_params = this.props.match.params;
        this.token = (url_params.token != "0") ? url_params.token : null;
        this.user_id = (url_params.user_id != "0") ? url_params.user_id : null;

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

        this.formItem = this.getForm();
    }

    getForm() {
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
    }

    finishFormSubmit(res, err = null) {
        toggleSubmit(this,
            {
                error: err,
                success: (res == null) ? null
                    : "Your password has been successfully reseted"
            }
        );
    }

    formOnSubmit(d) {
        toggleSubmit(this, { error: null });
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
        if (this.type === null) {
            return <Restricted></Restricted>;
        }

        document.setTitle("Password Reset");

        return (<div>
            <h3>Password Reset</h3>
            <Form className="form-row"
                items={this.formItem}
                disableSubmit={this.state.loading}
                submitText="Submit"
                onSubmit={this.formOnSubmit}
                error={error}></Form>
        </div>
        );
    }
}


