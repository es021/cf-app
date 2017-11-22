import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';

import ProfileCard from '../component/profile-card';
import {isAuthorized, getAuthUser} from '../redux/actions/auth-actions';

import store from '../redux/store';

export default class LeftBarLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("Render Left Bar");
        
        var isAuth = isAuthorized();
        var authUser = getAuthUser();
        
        console.log(authUser);
        var profile = "";
        if (isAuth) {
            profile =
            (<div className="left_bar_profile">
                <NavLink  to={`/app/profile_edit`} >
                    <ProfileCard type="student" data={authUser}></ProfileCard>
                </NavLink>
            </div>);

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