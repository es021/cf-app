import React, { Component } from 'react';

import ProfileCard from '../component/profile-card';
import {isAuthorized, getAuthUser} from '../redux/actions/auth-actions';

import store from '../redux/store';

export default class LeftBarLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var isAuth = isAuthorized();
        var profile = "";
        if (isAuth) {
            profile = <div className="left_bar_profile">
                <ProfileCard type="student" data={getAuthUser()}></ProfileCard>
            </div>;
        } else {

            profile = <br></br>;
        }

        var nav = <div className="left_bar_nav">
            {this.props.menuList}
        </div>;

        return(<left_bar>
            {profile}
            {nav}
        </left_bar>);
    }
}