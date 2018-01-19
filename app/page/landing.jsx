import React, { Component } from 'react';
import { ButtonLink } from '../component/buttons';
import LoginPage from './login';
import { RootPath, AppConfig, ImgConfig } from '../../config/app-config';
import { Redirect, NavLink } from 'react-router-dom';
import { getCF, getCFObj } from '../redux/actions/auth-actions';
import SponsorList from './partial/static/sponsor-list';
import { Time } from '../lib/time';
import Timer from '../component/timer';

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
        this.body.className += " landing-page";
        this.body.style.backgroundImage = `url('${ImgConfig.getBanner(this.CFDetail.banner)}')`
        this.body.style.backgroundPosition =
            (this.CFDetail.banner_pos) ? this.CFDetail.banner_pos : "center center";

        // create subtitle from  date
        if (this.CFDetail.start != null && this.CFDetail.end != null) {
            this.subtitle = Time.getPeriodString(this.CFDetail.start, this.CFDetail.end);
        }
    }

    componentWillUnmount() {
        this.body.className = "";
    }

    render() {
        document.setTitle("Home");
        var register = <div>
            <h4>Register As</h4>
            <div style={{ boxShadow: "5px 5px 8px -1px rgba(0,0,0,0.5)" }}
                className="item-small btn-group btn-group-justified">
                <NavLink to={`${RootPath}/auth/sign-up`} className="btn btn-lg btn-success">
                    <i className="fa fa-user left"></i>Student</NavLink>
                <NavLink to={`${RootPath}/auth/sign-up-recruiter`} className="btn btn-lg btn-danger">
                    <i className="fa fa-suitcase left"></i>Recruiter</NavLink>
            </div>
            <br></br>
            <br></br>
        </div>;

        var login = <div className="item-small item-login">
            <h4>Login</h4>
            <LoginPage></LoginPage></div>
        var welcome = <div id="home-welcome">
            <h1><small>WELCOME TO</small>
                <br></br>
                {this.CFDetail.title}
                <br></br>
                <div className="subtitle">{this.subtitle}
                    <Timer type="light" end={this.CFDetail.end}></Timer>
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


