import React, { Component } from "react";
import { AppConfig, ImgConfig, RootPath } from "../../config/app-config";
import { getCFObj, getAuthUser, isAuthorized } from "../redux/actions/auth-actions";
import { ButtonIcon } from "../component/buttons";
import { createImageElement } from '../component/profile-card';
import { NavLink } from "react-router-dom";

export default class HeaderLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let authUser = getAuthUser();
    let userIcon = isAuthorized() ? <NavLink to={`${RootPath}/app/edit-profile/profile`} >
      {createImageElement(authUser.img_url, authUser.img_pos, authUser.img_size, "40px", "with-border")}
      {/* <ProfileCard type="student" theme="dark"
        title={null} subtitle={null}
        img_url={authUser.img_url} img_pos={authUser.img_pos} img_size={authUser.img_size}
        body={null}></ProfileCard> */}
    </NavLink> : null;

    console.log("authUser", authUser);
    console.log("authUser", authUser);

    return (
      <header>
        <div className="img">
          <NavLink to={`${RootPath}/app/`}>
            <img src={ImgConfig.AppIcon} />
          </NavLink>
        </div>
        <div className="title">
          <b>{getCFObj().title}</b>
          {/* <b>{AppConfig.Name}</b> */}
          <br />
          <small>{AppConfig.Desc}</small>
        </div>
        <div className="menu">{this.props.menuList}</div>
        <div className="menu-small">
          <ButtonIcon size="lg" icon="bars" />
          {this.props.menuList}
        </div>
        {userIcon}
      </header>
    );
  }
}
