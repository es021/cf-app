import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as authActions from '../redux/actions/auth-actions';
import {User}  from '../../config/db-config';

import { bindActionCreators } from 'redux';
import { Redirect} from 'react-router-dom';
import Form from '../component/form';

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
        this.formItems = [
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
            }
        ];


    }

    formOnSubmit(d) {
        //console.log("login", data);
        this.props.login(d[User.EMAIL], d[User.PASSWORD]);
    }

    render() {
        //console.log("from login render");
        //console.log(this.props.redux);

        var {from} = this.props.location.state || {from: {pathname: '/app'}};

        //handle from logout
        if (from.pathname == "/app/logout") {
            from.pathname = "/app";
        }

        var redirectToReferrer = this.props.redux.isAuthorized;
        var fetching = this.props.redux.fetching;
        var error = this.props.redux.error;

        //console.log(from.pathname);

        if (redirectToReferrer) {
            return (
                    <Redirect to={from}/>
                    );
        } else {
            return (
                    <div><h3>Login</h3>
                        <p>You must log in to view the page at {from.pathname}</p>
                    
                        <Form className="form-row" 
                              items={this.formItems} 
                              disableSubmit={fetching} 
                              submitText="Log In"
                              onSubmit={this.formOnSubmit}
                              error={error}></Form>
                    </div>
                    );
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
