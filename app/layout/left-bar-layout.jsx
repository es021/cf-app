import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import ProfileCard, { createImageElement } from '../component/profile-card.jsx';
import { isAuthorized, getAuthUser, isRoleAdmin, isRoleRec } from '../redux/actions/auth-actions';
import { getWindowWidth } from '../lib/util';
import { getPositionStr } from '../component/profile-card-img';
import { RootPath } from '../../config/app-config';
import store from '../redux/store';

export function isHasLeftBar() {
    return isRoleAdmin() || isRoleRec();
    //return isRoleRec() && IsRecruiterNewHall;
}

export function isLeftBarForSmallScreen() {
    return (getWindowWidth() <= 860);
}

export function showLeftBar() {
    if (!isLeftBarForSmallScreen()) {
        return;
    }
    try {
        document.getElementsByClassName("lbar-content")[0].style.right = 0
        document.getElementsByClassName("lbar-background")[0].style.display = "inherit"
    } catch (err) {
        console.error(err);
    }
}

export function hideLeftBar() {
    if (!isLeftBarForSmallScreen()) {
        return;
    }
    try {

        // this does not effect the left-bar yang sentiasa showing sebab ada
        document.getElementsByClassName("lbar-content")[0].style.right = "-215px";
        document.getElementsByClassName("lbar-background")[0].style.display = "none"
    } catch (err) {
        console.error(err);
    }
}

export default class LeftBarLayout extends React.Component {
    constructor(props) {
        super(props);
        // console.log("root path");
        // console.log(RootPath);
        this.state = {
            isSmall: isLeftBarForSmallScreen()
        }
    }

    componentWillMount() {
        window.addEventListener('resize', (event) => {
            if (isLeftBarForSmallScreen()) {
                if (!this.state.isSmall) {
                    this.setState(() => {
                        return { isSmall: true }
                    });
                }
            } else {
                if (this.state.isSmall) {
                    this.setState(() => {
                        return { isSmall: false }
                    });
                }
            }
        });
    }

    render() {
        console.log("Render Left Bar");
        var isAuth = isAuthorized();
        var authUser = Object.assign({}, getAuthUser());
        // if (this.state.isSmall && typeof authUser["img_pos"] !== "undefined" && authUser["img_pos"] !== null) {
        //     if (authUser["img_pos"].indexOf("px") > -1) {
        //         authUser["img_pos"] = getPositionStr(25, authUser["img_pos"], "px", true);
        //     }
        // }
        //<br></br>
        //<NavLink to={`${RootPath}/app/edit-profile/profile`} >Edit Profile</NavLink>
        var profile = "";
        if (isAuth) {
            // var pcBody = <small>
            //     <a>Edit Profile</a>
            // </small>;

            //var pcBody = <small>
            //    <i className="text-muted">{authUser.role.capitalize()}</i>
            //</small>;

            profile =
                [
                    <div className="left_bar_profile flex-center" style={{ alignItems: "center" }}>
                        <NavLink className="lbp-avatar" to={`${RootPath}/app/edit-profile/profile`} >
                            {createImageElement(authUser.img_url, authUser.img_pos, authUser.img_size, "60")}
                        </NavLink>
                        <div className="lbp-name">
                            <b>{authUser.first_name}</b><br></br>
                            <small>{authUser.last_name}</small><br></br>
                            <small>
                                <i><NavLink
                                    onClick={() => hideLeftBar()}
                                    className="btn-link"
                                    to={`${RootPath}/app/edit-profile/profile`}>Edit Profile</NavLink></i>
                            </small>

                        </div>
                    </div >,
                ];
        } else {
            profile = <br></br>;
        }

        var nav = <div className="left_bar_nav">
            {this.props.menuList}
        </div>;

        return (<left_bar>
            <div className="lbar-content">
                {profile}
                {nav}
            </div>
            <div className="lbar-background" onClick={() => { hideLeftBar() }}></div>
        </left_bar>);
    }
}