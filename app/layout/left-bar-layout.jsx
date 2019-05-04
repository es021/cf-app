import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import ProfileCard from '../component/profile-card.jsx';
import { isAuthorized, getAuthUser } from '../redux/actions/auth-actions';
import { getWindowWidth } from '../lib/util';
import { getPositionStr } from '../component/profile-card-img';
import { RootPath } from '../../config/app-config';

import store from '../redux/store';

export default class LeftBarLayout extends React.Component {
    constructor(props) {
        super(props);
        console.log("root path");
        console.log(RootPath);
        this.state = {
            isMdWin: (getWindowWidth() <= 680)
        }
    }

    componentWillMount() {
        window.addEventListener('resize', (event) => {
            if (getWindowWidth() <= 680) {
                if (!this.state.isMdWin) {
                    this.setState(() => {
                        return { isMdWin: true }
                    });
                }
            } else {
                if (this.state.isMdWin) {
                    this.setState(() => {
                        return { isMdWin: false }
                    });
                }
            }
        });
    }

    render() {
        console.log("Render Left Bar");
        var isAuth = isAuthorized();
        var authUser = Object.assign({}, getAuthUser());
        if (this.state.isMdWin && typeof authUser["img_pos"] !== "undefined" && authUser["img_pos"] !== null) {
            if (authUser["img_pos"].indexOf("px") > -1) {
                authUser["img_pos"] = getPositionStr(25, authUser["img_pos"], "px", true);
            }
        }
        //<br></br>
        //<NavLink to={`${RootPath}/app/edit-profile/profile`} >Edit Profile</NavLink>
        var profile = "";
        if (isAuth) {
            var pcBody = <small>
                <a>Edit Profile</a>
            </small>;

            //var pcBody = <small>
            //    <i className="text-muted">{authUser.role.capitalize()}</i>
            //</small>;

            profile =
                (<div className="left_bar_profile">
                    <NavLink to={`${RootPath}/app/edit-profile/profile`} >
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

        return (<left_bar>
            {profile}
            {nav}
        </left_bar>);
    }
}