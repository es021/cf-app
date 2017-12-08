import React, { Component } from 'react';
import {getAxiosGraphQLQuery} from '../../helper/api-helper';
import {Loader} from '../component/loader';
import {activateAccount} from '../redux/actions/auth-actions';
import {AuthAPIErr} from '../../server/api/auth-api';
import {NavLink} from 'react-router-dom';
export default class ActAccountPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: null,
            success: false
        }

    }

    componentWillMount() {
        var key = this.props.match.params.key
        var user_id = this.props.match.params.user_id

        activateAccount(key, user_id).then((res) => {
            this.setState(() => {
                return{
                    loading: false,
                    success: res.data.user_email
                }
            });
        }, (err) => {

            var error = err.response.data;
            var contact = "Please contact us to request for a new activation link.";
            switch (error) {
                case AuthAPIErr.INVALID_ACTIVATION:
                    error = <div>Invalid activation link.<br></br>{contact}</div>;
                    break;
            }

            this.setState(() => {
                return{
                    loading: false,
                    error: error
                }
            });
        });
    }

    render() {
        document.setTitle("Activate Account");
        var view = null;
        if (this.state.loading) {
            view = <Loader size="2" text="Activating Your Account"></Loader>;
        } else {

            if (!this.state.success) {
                view = <div>{this.state.error}</div>;
            } else {
                view = <div>Your account has been successfully activated.<br></br>
                    Please <NavLink to={`/auth/login`}>login </NavLink> 
                    using email <b>{this.state.success}</b>
                </div>;
            }
        }
        return (<div><h3>Account Activation</h3>{view}</div>);
    }
}


