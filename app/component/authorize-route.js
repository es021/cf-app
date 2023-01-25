import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import { RootPath } from '../../config/app-config';
import * as layoutAction from "../redux/actions/layout-actions";

//state is from redux reducer
// with multiple objects
function mapStateToProps(state, ownProps) {
    return {
        redux: state.auth,
        //redirect : state.layout.redirect
    };
}

class AuthorizedRoute extends React.Component {
    render() {
        //  console.log("from AuthorizedRoute");
        //  console.log(this.props.location);
        //  console.log("this.props.location.state",this.props.location.state);

        //console.log("this.props.redirect",this.props.redirect);

        var to = {};
        if (this.props.redux.isAuthorized) {
            //to = {pathname: this.props.location.pathname, state: {from: this.props.location}};
            var match = { path: to.pathname };
            // console.log(match);
            const { component: Component } = this.props;
            return (<Component {...this.props} match={this.props.computedMatch} />);
        } else {
            //location.reload();
            //layoutAction.storeUpdateRedirect(this.props.location.pathname);
            let redirectPathname = `${RootPath}/auth`

            let pathname = this.props.location.pathname;
            if (pathname.indexOf("/app/qr-scan/") >= 0) {
                redirectPathname = `${RootPath}${pathname.replace("/app/", "/auth/")}`
            }
            to = { pathname: redirectPathname, state: { from: this.props.location } };
            return (<Redirect to={to} />);
        }
    }
}


export default connect(mapStateToProps)(AuthorizedRoute);
