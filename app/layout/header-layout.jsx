import React, { Component } from "react";
import { AppConfig, ImgConfig, AssetCustomUrl, RootPath, HeaderClass, FooterClass } from "../../config/app-config";
import * as CustomCf from "../../config/custom-cf-config";
import {
  getCFObj,
  getCFCustomStyle,
  getAuthUser,
  isAuthorized,
  isRedirectExternalHomeUrl
} from "../redux/actions/auth-actions";
import { ButtonIcon } from "../component/buttons.jsx";
import { createImageElement } from "../component/profile-card.jsx";
import { NavLink } from "react-router-dom";

export default class HeaderLayout extends React.Component {
  constructor(props) {
    super(props);

    this.iconUrl = AppConfig.HeaderIconUrl;
    this.icon = ImgConfig.AppIcon;
    this.title = getCFObj().title;
    this.desc = AppConfig.Desc;

    let style = getCFCustomStyle()
    if (style) {
      if (style[CustomCf.Style.HEADER_ICON_URL]) this.iconUrl = style[CustomCf.Style.HEADER_ICON_URL]
      if (style[CustomCf.Style.HEADER_ICON]) this.icon = AssetCustomUrl + style[CustomCf.Style.HEADER_ICON]
      if (style[CustomCf.Style.HEADER_DESC]) this.desc = style[CustomCf.Style.HEADER_DESC]
    }

    console.log("this.iconUrl", this.iconUrl)
    console.log("this.icon", this.icon)
    console.log("this.title", this.title)
    console.log("this.desc", this.desc)
    console.log("style",style);
  
  }

  render() {
    if (isRedirectExternalHomeUrl(this.props)) {
      return null;
    }

    let authUser = getAuthUser();
    let userIcon = isAuthorized() ? (
      <NavLink to={`${RootPath}/app/edit-profile/profile`}>
        {createImageElement(
          authUser.img_url,
          authUser.img_pos,
          authUser.img_size,
          "40px",
          "with-border hover-shadow"
        )}
        {/* <ProfileCard type="student" theme="dark"
        title={null} subtitle={null}
        img_url={authUser.img_url} img_pos={authUser.img_pos} img_size={authUser.img_size}
        body={null}></ProfileCard> */}
      </NavLink>
    ) : null;

    return (
      <header className={HeaderClass}>
        <div className="img">
          <a target="_blank" href={this.iconUrl}>
            <img src={this.icon} />
          </a>
        </div>
        <div className="title">
          <b>{this.title}</b>
          {/* <b>{AppConfig.Name}</b> */}
          <br />
          <small>{this.desc}</small>
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
