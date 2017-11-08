import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as authActions from '../redux/actions/auth-actions';

import { bindActionCreators } from 'redux';
import { Redirect} from 'react-router-dom';

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

        this.login = this.login.bind(this);
    }

    login() {
        console.log("do login");
        this.props.login('wzs21', "1234");
    }

    render() {
        console.log("from login render");
        //console.log(this.props.redux);

        var {from} = this.props.location.state || {from: {pathname: '/app'}};
        
        //handle from logout
        if (from.pathname == "/app/logout"){
            from.pathname = "/app";
        }
        
        var redirectToReferrer = this.props.redux.isAuthorized;
        var fetching = this.props.redux.fetching;


        if (redirectToReferrer) {
            return (
                    <Redirect to={from}/>
                    );
        } else {
            return (
                    <div>
                        <p>You must log in to view the page at {from.pathname}</p>
                        <button onClick={this.login}>Log in</button>
                        {(fetching) ? "Logging In" : ""}
                    </div>
                    );
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
