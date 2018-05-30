import React, { Component } from 'react';
import { ButtonLink } from '../component/buttons';
import LoginPage from './login';
import { RootPath, AppConfig, ImgConfig, LandingUrl } from '../../config/app-config';
import { Redirect, NavLink } from 'react-router-dom';
import { getCF, getCFObj } from '../redux/actions/auth-actions';
import SponsorList from './partial/static/sponsor-list';
import { Time } from '../lib/time';
import Timer from '../component/timer';
import { getCFTimeDetail } from './coming-soon';

require("../css/home.scss");

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
        this.body.style.backgroundImage = `url('${ImgConfig.getBanner(this.CFDetail.banner)}')`
        this.body.style.backgroundPosition =
            (this.CFDetail.banner_pos) ? this.CFDetail.banner_pos : "center center";

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
            var dateStr = Time.getPeriodString(this.CFDetail.start, this.CFDetail.end, this.CFDetail.dates);
            this.subtitle = <span style={{ fontSize: "85%" }}>
                {getCFTimeDetail(dateStr, this.CFDetail.time_str, this.CFDetail.time_str_mas)}
            </span>;
        }

    }

    componentWillUnmount() {
        this.body.className = "";
    }

    render() {
        //  <NavLink to={`${RootPath}/auth/sign-up-recruiter`} className="btn btn-lg btn-danger">
        //  <i className="fa fa-suitcase left"></i>Recruiter</NavLink>

        document.setTitle("Home");
        var register = <div>
            <h4>Register As</h4>
            <div style={{ boxShadow: "5px 5px 8px -1px rgba(0,0,0,0.5)" }}
                className="item-small btn-group btn-group-justified">
                <NavLink to={`${RootPath}/auth/sign-up`} className="btn btn-lg btn-success">
                    <i className="fa fa-user left"></i>Student</NavLink>
                <a target="blank" href={`${LandingUrl}/companies.html`} className="btn btn-lg btn-danger">
                    <i className="fa fa-suitcase left"></i>Recruiter</a>
            </div>
            <br></br>
            <br></br>
        </div>;

        var login = <div className="item-small item-login">
            <LoginPage></LoginPage></div>
        var welcome = <div id="home-welcome">
            <h1><small>WELCOME TO</small>
                <br></br>
                {this.CFDetail.title}
                <br></br>
                <div className="subtitle">{this.subtitle}
                    <Timer type="light" end={this.CFDetail.start}></Timer>
                </div>
            </h1>
            {register}
            {login}
        </div>;

        var homeBody = <div id="home-body">
            <br></br>
            <SponsorList type="landing"></SponsorList>
        </div>;

        return (<div id="home">
            {welcome}
            {homeBody}
        </div>);
    }
}


