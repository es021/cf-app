import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as authActions from '../redux/actions/auth-actions';

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
    }

    componentWillMount() {
        this.formItems = [
            {
                label: "Email *",
                name: "email",
                type: "email",
                placeholder: "john.doe@gmail.com",
                required: true
            },
            {
                label: "Password *",
                name: "password",
                type: "password",
                placeholder: "*****",
                required: true
            }
        ];

        this.formOnSubmit = (data) => {
            //console.log("login", data);
            this.props.login(data.email, data.password);
        };
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
                        <Form className="row-form" items={this.formItems} onSubmit={this.formOnSubmit}>
                        </Form>
                        <p>You must log in to view the page at {from.pathname}</p>
                    
                        {(fetching) ? "Logging In" : ""}
                        {(error !== null) ? error : ""}
                    </div>
                    );
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
