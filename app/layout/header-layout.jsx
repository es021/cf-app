import React, { Component } from "react";
import { CFSMeta } from "../../config/db-config";
import { AppConfig, ImgConfig, AssetCustomUrl, RootPath, HeaderClass, FooterClass } from "../../config/app-config";
import {
  getCFObj,
  getCFCustom,
  getAuthUser,
  isAuthorized,
  isRedirectExternalHomeUrl,
  isRoleRec,
  isRoleStudent
} from "../redux/actions/auth-actions";
import { ButtonIcon } from "../component/buttons.jsx";
import { showLeftBar, isHasLeftBar } from "./left-bar-layout";
import { createImageElement } from "../component/profile-card.jsx";
import { NavLink } from "react-router-dom";
import LeftBarLayout from "./left-bar-layout";
import { lang } from "../lib/lang";

export default class HeaderLayout extends React.Component {
  constructor(props) {
    super(props);

    // this.iconUrl = AppConfig.HeaderIconUrl;
    this.iconUrl = null;
    this.icon = ImgConfig.AppIcon;
    this.title = getCFObj().title;
    this.desc = AppConfig.Desc;

    let cfObj = getCFObj();

    if (cfObj[CFSMeta.LINK_EXTERNAL_HOME] && !isAuthorized()) this.iconUrl = cfObj[CFSMeta.LINK_EXTERNAL_HOME]
    if (cfObj[CFSMeta.IMAGE_HEADER_ICON]) this.icon = AssetCustomUrl + cfObj[CFSMeta.IMAGE_HEADER_ICON]
    if (cfObj[CFSMeta.IMAGE_HEADER_ICON_FULL]) this.icon = cfObj[CFSMeta.IMAGE_HEADER_ICON_FULL]
    if (cfObj[CFSMeta.TEXT_HEADER_TITLE]) this.title = cfObj[CFSMeta.TEXT_HEADER_TITLE]
    if (cfObj[CFSMeta.TEXT_HEADER_DESC]) this.desc = cfObj[CFSMeta.TEXT_HEADER_DESC]

    this.title = this.title.replaceAll("<br>", " ")

    // console.log("this.iconUrl", this.iconUrl)
    // console.log("this.icon", this.icon)
    // console.log("this.title", this.title)
    // console.log("this.desc", this.desc)
    // console.log("style", style);

  }

  render() {
    if (isRedirectExternalHomeUrl(this.props)) {
      return null;
    }

    let authUser = getAuthUser();
    let avatar = isHasLeftBar() ? null : createImageElement(
      authUser.img_url,
      authUser.img_pos,
      authUser.img_size,
      "40px",
      "with-border hover-shadow"
    )
    let userIcon = isAuthorized() ? (
      isRoleStudent()
        ? <NavLink to={`${RootPath}/app/edit-profile/profile`}>{avatar}</NavLink>
        : avatar
    ) : null;

    return (
      <header className={HeaderClass}>
        <div className="header-row">
          <div className="img">
            {this.iconUrl ?
              <a target="_blank" href={this.iconUrl}>
                <img src={this.icon} />
              </a>
              : <NavLink to={`${RootPath}/app`}>
                <img src={this.icon} />
              </NavLink>
            }
          </div>
          <div className="title">
            <b>{this.title}</b>
            {/* <b>{AppConfig.Name}</b> */}
            <br />
            <small>{lang(this.desc)}</small>
          </div>
          {isHasLeftBar()
            ? <div className="menu-small-new">
              <ButtonIcon size="lg" icon="bars" onClick={() => {
                showLeftBar()
              }} />
              {/* <div className="menu-hide-show">
              <LeftBarLayout menuList={this.props.sideMenuList}></LeftBarLayout>
            </div> */}
            </div>
            :
            // this one will only show the header
            <div className="menu-small">
              <ButtonIcon size="lg" icon="bars" />
              {this.props.menuList}
            </div>
          }
          {userIcon}
        </div>

        <div className="header-row">
          <div className="menu">{this.props.menuList}</div>
        </div>

      </header>
    );
  }
}
