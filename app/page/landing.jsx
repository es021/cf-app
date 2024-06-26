import React, { Component } from "react";
import { ButtonLink } from "../component/buttons.jsx";
import LoginPage from "./login";
import {
  RootPath,
  AppConfig,
  ImgConfig,
  LandingUrl,
  ImageUrl
} from "../../config/app-config";
import { CFSMeta } from "../../config/db-config";
import { Redirect, NavLink } from "react-router-dom";
import { getCF, getCFObj, getCFOrg, getCF_externalHomeUrl, isAuthorized, isRedirectExternalHomeUrl, isCfFeatureOff } from "../redux/actions/auth-actions";
import SponsorList from "./partial/static/sponsor-list";
import { Time } from "../lib/time";
import Timer from "../component/timer";
import { getCFTimeDetail } from "./coming-soon";
import { getStyleImageObj } from "../component/profile-card.jsx";
import {lang} from "../lib/lang.js";

// require("../css/home.scss");

export default class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.CF = getCF();
    this.CFDetail = getCFObj();
  }

  componentWillMount() {
    // set banner image
    this.body = document.getElementsByTagName("body")[0];
    this.body.className += " landing-page top ";
    this.body.style.backgroundImage = `url('${ImgConfig.getBanner(
      this.CFDetail.banner
    )}')`;
    this.body.style.backgroundPosition = this.CFDetail.banner_pos
      ? this.CFDetail.banner_pos
      : "center center";
    this.body.style.backgroundSize = this.CFDetail.banner_size
      ? this.CFDetail.banner_size
      : "cover";

    //add scroll event listener
    this.body.onscroll = () => {
      if (window.pageYOffset > 40) {
        this.body.classList.remove("top");
      }

      if (window.pageYOffset < 40) {
        this.body.classList.add("top");
      }
    };

    // create subtitle from  date
    if (this.CFDetail.start != null && this.CFDetail.end != null) {
      var dateStr = Time.getPeriodString(
        this.CFDetail.start,
        this.CFDetail.end,
        this.CFDetail.dates
      );
      this.subtitle = (
        <span style={{ fontSize: "85%" }}>
          {getCFTimeDetail(
            dateStr,
            this.CFDetail.time_str,
            this.CFDetail.time_str_mas
          )}
        </span>
      );
    }

    var OrgConfig = getCFOrg();
    this.organizations = OrgConfig.map((d, i) => {
      let icons = d.data.map((_d, _i) => {
        return this.getOrgItem(_d, d.icon_size);
      });
      return d.data.length <= 0 ? null : (
        <div>
          <h1>{d.label}</h1>
          <ul className="sponsor-container">{icons}</ul>
          <br></br>
          <br></br>
        </div>
      );
    });
    // this.university = OrgConfig.University.map((d, i) => {
    //     return this.getOrgItem(d, 85);
    // });
    // this.org = OrgConfig.Organizer.map((d, i) => {
    //   return this.getOrgItem(d, 85);
    // });
    // this.collab = OrgConfig.Collaborator.map((d, i) => {
    //   return this.getOrgItem(d);
    // });
    // this.powered = OrgConfig.Powered.map((d, i) => {
    //   return this.getOrgItem(d, 100);
    // });
  }

  componentWillUnmount() {
    this.body.className = "";
  }

  // getCfLogo() {
  //   var logo = null;
  //   if (this.CFDetail.logo !== "undefined" && this.CFDetail.logo !== null) {
  //     let imgUrl = `${ImageUrl}${this.CFDetail.logo}`;
  //     var logoStyle = {
  //       backgroundImage: `url('${imgUrl}')`,
  //       backgroundPosition: this.CFDetail.logo_position,
  //       backgroundSize: this.CFDetail.logo_size,
  //       height: this.CFDetail.logo_height,
  //       width: this.CFDetail.logo_width,
  //       margin: "auto"
  //     };
  //     logo = <div style={logoStyle}></div>;
  //   }

  //   return logo;
  // }

  getOrgItem(d, size = 75) {
    var url = ImgConfig.getLogo(d.logo);
    var style = getStyleImageObj(
      "company",
      url,
      "cover",
      "center center",
      size
    );
    return (
      <li>
        <div className={`sponsor-card`}>
          <a target="_blank" href={d.url}>
            <div className="image" style={style}></div>
          </a>
        </div>
      </li>
    );
  }

  getOrgsSection() {
    return (
      <div>
        {this.organizations}
        {/* {this.university.length <= 0 ? null : (
          <div>
            <h1>Participating Universities</h1>
            <ul className="sponsor-container">{this.university}</ul>
          </div>
        )}
        {this.org.length <= 0 ? null : (
          <div>
            <h1>Organized By</h1>
            <ul className="sponsor-container">{this.org}</ul>
          </div>
        )}
        {this.collab.length <= 0 ? null : (
          <div>
            <h1>In Collaboration With</h1>
            <ul className="sponsor-container">{this.collab}</ul>
          </div>
        )}
        {this.powered.length <= 0 ? null : (
          <div>
            <h1>Powered By</h1>
            <ul className="sponsor-container">{this.powered}</ul>
          </div>
        )} */}
      </div>
    );
  }

  render() {
    if (isRedirectExternalHomeUrl(this.props)) {
      return null;
    }

    //  <NavLink to={`${RootPath}/auth/sign-up-recruiter`} className="btn btn-lg btn-danger">
    //  <i className="fa fa-suitcase left"></i>Recruiter</NavLink>

    document.setTitle("Home");
    // var register = (
    //   <div>
    //     {/* <h4>Register As</h4> */}
    //     <div
    //       style={{ boxShadow: "5px 5px 8px -1px rgba(0,0,0,0.5)" }}
    //       className="item-small btn-group btn-group-justified"
    //     >
    //       <NavLink
    //         to={`${RootPath}/auth/sign-up`}
    //         className="btn btn-lg btn-success"
    //       >
    //         <i className="fa fa-user-plus left"></i>Register Now
    //       </NavLink>
    //       <a
    //         target="blank"
    //         href={`${LandingUrl}#Companies`}
    //         className="btn btn-lg btn-danger"
    //       >
    //         <i className="fa fa-suitcase left"></i>Recruiter
    //       </a>
    //     </div>
    //     <br></br>
    //     <br></br>
    //   </div>
    // );

    var register = [
      <br></br>,
      <div
        style={{ boxShadow: "5px 5px 8px -1px rgba(0,0,0,0.5)" }}
        className="item-small btn-group btn-group-justified"
      >
        <NavLink
          to={`${RootPath}/auth/sign-up`}
          className="btn btn-lg btn-success"
        >
          <i className="fa fa-user-plus left"></i>{lang("Register As Student")}
        </NavLink>
      </div>,
      <br></br>,
      <br></br>
    ];

    var intro = (
      <h1 style={{ marginTop: "5px" }}>
        <small>{lang("WELCOME TO")}</small>
        <br></br>
        <span dangerouslySetInnerHTML={{ __html: this.CFDetail.title_landing ? this.CFDetail.title_landing : this.CFDetail.title }}></span>
        <br></br>
        <div className="subtitle">
          {this.subtitle}
          <Timer type="light" end={this.CFDetail.start}></Timer>
        </div>
      </h1>
    );

    // var intro = <h1>
    //     {this.CFDetail.title}
    //     <br></br>
    //     <div className="subtitle">{this.subtitle}
    //         <Timer type="light" end={this.CFDetail.start}></Timer>
    //     </div>
    // </h1>

    var login = (
      <div className="item-small item-login">
        <LoginPage {...this.props}></LoginPage>
      </div>
    );

    var welcome = (
      <div id="home-welcome">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 left-side">
              {/* {this.getCfLogo()} */}
              {intro}
            </div>
            <div className="col-lg-6 right-side">
              {register}
              {login}
            </div>
          </div>
        </div>
      </div>
    );

    let sponsorAndCompany = isCfFeatureOff(CFSMeta.FEATURE_SPONSOR) ? null : <SponsorList type="landing"></SponsorList>;
    var homeBody = (
      <div id="home-body">
        <br></br>
        {sponsorAndCompany}
        {this.getOrgsSection()}
      </div>
    );

    return (
      <div id="home">
        {welcome}
        {homeBody}
      </div>
    );
  }
}
