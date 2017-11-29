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

        var profile = "";
        if (isAuth) {
            var pcBody = <small><NavLink  to={`/app/edit-profile`} >Edit Profile</NavLink></small>;
            profile =
                    (<div className="left_bar_profile">
                <NavLink  to={`/app/edit-profile`} >
                    <ProfileCard type="student" theme="dark"
                                 title={authUser.first_name} subtitle={authUser.last_name}
                                 img_url={authUser.img_url} img_pos={authUser.img_pos} img_size={authUser.img_size}    
                                 body={pcBody}></ProfileCard>
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