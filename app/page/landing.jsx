import React, { Component } from 'react';
import { ButtonLink } from '../component/buttons';
import LoginPage from './login';
import { Loader } from '../component/loader';
import { RootPath, AppConfig } from '../../config/app-config';
import { CompanyEnum } from '../../config/db-config';
import { Redirect, NavLink } from 'react-router-dom';
import { getCF } from '../redux/actions/auth-actions';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';


require("../css/home.scss");

export default class LandingPage extends React.Component {

    constructor(props) {
        super(props);
        this.CF = getCF();
        this.state = {
            coms: null,
            load_coms: true
        }
    }

    componentWillMount() {
        this.body = document.getElementsByTagName("body")[0];
        this.body.className += " landing-page";

        // load coms
        getAxiosGraphQLQuery(`query{companies(cf:"${this.CF}", include_sponsor:1){name cf type img_url img_position img_size}}`).then((res) => {
            this.setState(() => {
                return { coms: res.data.data.companies, load_coms: false };
            })
        });

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
            <h1><small>WELCOME TO</small><br></br>{AppConfig.Name} - {this.CF}</h1>
            {register}
            {login}
        </div>;

        var sponsor = <Loader size="3" text="Loading sponsors.."></Loader>;
        var part_com = <Loader size="3" text="Loading companies.."></Loader>;
        if (!this.state.load_coms && this.state.coms != null) {
            sponsor = [];
            part_com = [];
            this.state.coms.map((d, i) => {
                if (d.type == 4) {
                    part_com.push(<li>{d.name}</li>);
                } else {
                    sponsor.push(<li>{d.name} - {CompanyEnum.getTypeStr(d.type)}</li>);
                }
            });


        }

        var homeBody = <div id="home-body">
            <br></br>
            <h1>Sponsors</h1>
            <ul>{sponsor}</ul>
            <h1>Participating Companies</h1>
            <ul>{part_com}</ul>
        </div>;

        return (<div id="home">
            {welcome}
            {homeBody}
        </div>);
    }
}


