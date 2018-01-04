import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as authActions from '../redux/actions/auth-actions';

import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';

//state is from redux reducer
// with multiple objects
function mapStateToProps(state, ownProps) {
    return {
        redux: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        logout: authActions.logout
    }, dispatch);
}

class LogoutPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.logout();
    }

    render() {
        return (<div>Logging Out</div>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutPage);
