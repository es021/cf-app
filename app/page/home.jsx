import React, { Component } from 'react';
import {ButtonLink} from '../component/buttons';
import LoginPage from './login';

import {RootPath, AppConfig} from '../../config/app-config';
import { Redirect, NavLink} from 'react-router-dom';

require("../css/home.scss");

export default class HomePage extends React.Component {
    componentWillMount() {
        this.body = document.getElementsByTagName("body")[0];
        this.body.className += " landing-page";
    }

    componentWillUnmount() {
        this.body.className = ""; 
    }

    render() {
        var img = "https://seedsjobfair.com/image/home/1_sm.jpg";
        var style = {
            backgroundImage: `url('${img}')`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundAttachement: "fixed",
            width: "100vw",
            height: "200px"
        } 

        document.setTitle("Home");
        
        var welcome = <div id="home-welcome">
            <h1><small>WELCOME TO</small><br></br>{AppConfig.Name}</h1>
            <div className="item-small item-login"><LoginPage></LoginPage></div>
            <div>
                <h2><small>Register As</small></h2>
                <div className="item-small btn-group btn-group-justified">
                    <NavLink to={`${RootPath}/auth/sign-up`} className="btn btn-lg btn-success">
                        STUDENT
                    </NavLink>
                    <NavLink to={`${RootPath}/auth/sign-up-recruiter`} className="btn btn-lg btn-danger">
                        RECRUITER
                    </NavLink>
                </div> 
            </div> 
        </div>;
  
        var sponsor = <div id="home-body">cqwuivgcb2iqurlbe</div>;

        return (<div id="home">
            {welcome}
            {sponsor}
        </div>);
    }
}


