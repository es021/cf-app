import React, { Component } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect} from 'react-router-dom';

//state is from redux reducer
// with multiple objects
function mapStateToProps(state, ownProps) {
    return {
        redux: state.auth
    };
}

class AuthorizedRoute extends React.Component {
    render() {
        //console.log("from AuthorizedRoute");
        //console.log(this.props);

        var to = {};
        if (this.props.redux.isAuthorized) {
            //to = {pathname: this.props.location.pathname, state: {from: this.props.location}};
            var match = {path:to.pathname};
            const { component: Component} = this.props;
            return (<Component {...this.props} match={this.props.computedMatch} />);
        } else {
            to = {pathname: '/auth/login', state: {from: this.props.location}};
            return(<Redirect to={to} />);
        }
    }
}


export default connect(mapStateToProps)(AuthorizedRoute);
