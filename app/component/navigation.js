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
import NotFoundPage from '../page/not-found';


import {isAuthorized} from '../redux/actions/auth-actions';

const menuItem = [
    {
        url: "/",
        label: "Home",
        icon: "home",
        component: HomePage,
        app: true,
        auth: true,
        header: true
    },
    {
        url: "/about",
        label: "About",
        icon: "question-circle",
        component: AboutPage,
        app: true,
        auth: true,
        header: true
    },
    {
        url: "/faq",
        label: "FAQ",
        icon: "question",
        component: HomePage,
        header: true
    },
    {
        url: "/contact",
        label: "Contact Us",
        icon: "contact",
        component: HomePage,
        header: true
    },
    {
        url: "/users",
        label: "Users",
        icon: "user",
        component: UsersPage,
        app: true,
        auth: false
    },
    {
        url: "/user/:id",
        component: UserPage,
        app: true,
        auth: true,
        routeOnly: true
    },
    {
        url: "/hall",
        label: "Hall",
        icon: "comments",
        component: HallPage,
        app: true,
        auth: true
    },
    {
        url: "/login",
        label: "Login",
        icon: "sign-in",
        component: LoginPage,
        app: false,
        auth: true,
        header: true
    },
    {
        url: "/logout",
        label: "Logout",
        icon: "sign-out",
        component: LogoutPage,
        app: true,
        auth: false
    },
    {
        url: "/sign-up",
        label: "Sign Up",
        icon: "question",
        component: HomePage,
        header: true,
        app: false
    },
];



export function getRoute(path) {
    var isAuth = isAuthorized();

    var routes = menuItem.map(function (d, i) {
        var exact = (d.url === "/") ? true : false;
        if (isAuth && !d.app) {
            return;
        }

        if (!isAuth && !d.auth) {
            return;
        }

        return(<Route path={`${path}${d.url}`} exact={exact} key={i}  component={d.component}></Route>);
    });

    return (<Switch>
{routes}
<Route path="*" component={NotFoundPage}/>
</Switch>);

    /*
     var route = (isAuth) 
     ?   <Switch>
     <Route path={`${path}/`} exact component={HomePage} />
     <Route path={`${path}/about`} component={AboutPage} />
     <Route path={`${path}/hall`} component={HallPage} />
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
     */
}

export function getBar(path, isHeader = false) {

    var isAuth = isAuthorized();

    var menuList = menuItem.map(function (d, i) {
        var exact = (d.url === "/") ? true : false;

        if (isHeader) {
            if (!d.header) {
                return;
            } else if (isAuth && d.app === false) {
                return;
            }
        } else {
            if (d.routeOnly === true) {
                return;
            }

            if (isAuth && !d.app) {
                return;
            }

            if (!isAuth && !d.auth) {
                return;
            }
        }

        return(<NavLink to={`${path}${d.url}`} exact={exact} key={i}  activeClassName="active">
            <li>
                {(isHeader) ? "" : <i className={`fa fa-${d.icon}`}></i>}
                <span className="menu_label">{d.label}</span>
            </li>
        </NavLink>);
    });

    return (<ul>{menuList}</ul>);
}