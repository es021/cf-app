import React, { Component } from 'react';

import { BrowserRouter, Route, NavLink, Switch, Redirect}
from 'react-router-dom';

import HomePage from '../page/home';
import LoginPage from '../page/login';
import AboutPage from '../page/about';
import LogoutPage from '../page/logout';
import UserPage from '../page/user';
import UsersPage from '../page/users';
import HallPage from '../page/hall';

import {isAuthorized} from '../redux/actions/auth-actions';

export function getRoute(path){  
        var isAuth = isAuthorized();

    var route = (isAuth) 
    ?   <Switch>
            <Route path={`${path}/`} exact component={HomePage} />
            <Route path={`${path}/about`} component={AboutPage} />
            <Route path={`${path}/logout`} component={LogoutPage} />
            <Route path={`${path}/users`} component={UsersPage} />
            <Route path={`${path}/user/:id`} component={UserPage} />
        </Switch>
    :   <Switch>
            <Route path={`${path}/`} exact component={HomePage} />
            <Route path={`${path}/hall`} component={HallPage} />
            <Route path={`${path}/login`} component={LoginPage} />
            <Route path={`${path}/about`} component={AboutPage} />
        </Switch>
    ;
    
    return route;
}
export function getBar(path) {

    var menuItem = [
        {
            url: "/",
            label: "Home",
            icon: "home",
            app: true,
            auth: true
        },
        {
            url: "/about",
            label: "About",
            icon: "",
            app: true,
            auth: true
        },
        {
            url: "/users",
            label: "Users",
            icon: "",
            app: true,
            auth: true
        },
        {
            url: "/hall",
            label: "Hall",
            icon: "",
            app: true,
            auth: true
        },
        {
            url: "/login",
            label: "Login",
            icon: "",
            app: false,
            auth: true
        },
        {
            url: "/logout",
            label: "Logout",
            icon: "",
            app: true,
            auth: false
        }
    ];

    var isAuth = isAuthorized();

    var menuList = menuItem.map(function (d, i) {
        var exact = (d.url === "/") ? true : false;
        if (isAuth && !d.app) {
            return;
        }

        if (!isAuth && !d.auth) {
            return;
        }

        return(<NavLink to={`${path}${d.url}`} exact={exact} key={i}  activeClassName="active">
            <li>
                <i className={`fa fa-${d.icon}`}></i>
                {d.label}
            </li>
        </NavLink>);
    });

    return (<ul>{menuList}</ul>);
}