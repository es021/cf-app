import React, { Component } from "react";
import { AppConfig, ImgConfig, RootPath } from "../../config/app-config";
import { getCFObj } from "../redux/actions/auth-actions";
import { ButtonIcon } from "../component/buttons";
import { NavLink } from "react-router-dom";

export default class HeaderLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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
      </header>
    );
  }
}
