import React, { Component } from 'react';

import { BrowserRouter, Route, NavLink, Switch, Redirect}
from 'react-router-dom';

import HomePage from '../page/home';
import LoginPage from '../page/login';
import SignUpPage from '../page/sign-up';
import AboutPage from '../page/about';
import LogoutPage from '../page/logout';
import UsersPage from '../page/users';
import HallPage from '../page/hall';
import ActAccountPage from '../page/activate-account';
import EditProfilePage from '../page/edit-profile';
import ResumeDropPage from '../page/resume-drop';
import VacancyPage from '../page/vacancy';
import NotFoundPage from '../page/not-found';


import {isAuthorized} from '../redux/actions/auth-actions';

const menuItem = [
    {
        url: "/",
        label: "Home",
        icon: "home",
        component: HomePage,
        bar_app: true,
        bar_auth: true,
        hd_app: true,
        hd_auth: true
    },
    {
        url: "/about",
        label: "About",
        icon: "question",
        component: AboutPage,
        bar_app: false,
        bar_auth: true,
        hd_app: true,
        hd_auth: true
    },

    {
        url: "/contact",
        label: "Contact Us",
        icon: "envelope",
        component: NotFoundPage,
        bar_app: false,
        bar_auth: false,
        hd_app: true,
        hd_auth: true
    },
    {
        url: "/users",
        label: "Users",
        icon: "user",
        component: UsersPage,
        bar_app: true,
        bar_auth: false,
        hd_app: false,
        hd_auth: false
    },
    {
        url: "/auditorium",
        label: "Auditorium",
        icon: "microphone",
        component: HallPage,
        bar_app: true,
        bar_auth: false,
        hd_app: false,
        hd_auth: false
    },
    {
        url: "/job-fair",
        label: "Job Fair",
        icon: "suitcase",
        component: HallPage,
        bar_app: true,
        bar_auth: false,
        hd_app: false,
        hd_auth: false
    },
    {
        url: "/faq",
        label: "FAQ",
        icon: "question-circle",
        component: NotFoundPage,
        bar_app: true,
        bar_auth: true,
        hd_app: true,
        hd_auth: true
    },
    {
        url: "/login",
        label: "Login",
        icon: "sign-in",
        component: LoginPage,
        bar_app: false,
        bar_auth: true,
        hd_app: false,
        hd_auth: true,
        allRoute: true
    },
    {
        url: "/logout",
        label: "Logout",
        icon: "sign-out",
        component: LogoutPage,
        bar_app: false,
        bar_auth: false,
        hd_app: true,
        hd_auth: false
    },
    {
        url: "/sign-up",
        label: "Sign Up",
        icon: "user-plus",
        component: SignUpPage,
        bar_app: false,
        bar_auth: true,
        hd_app: false,
        hd_auth: true
    }
];

/**** ROUTE ONLY *******/
menuItem.push(...[
    {
        url: "/edit-profile/:current",
        component: EditProfilePage,
        bar_app: true,
        bar_auth: false,
        hd_app: true,
        hd_auth: false,
        routeOnly: true
    },
    {
        url: "/activate-account/:key/:user_id",
        component: ActAccountPage,
        bar_app: true,
        bar_auth: true,
        hd_app: true,
        hd_auth: true,
        routeOnly: true
    },
    {
        url: "/resume-drop/:company_id",
        component: ResumeDropPage,
        bar_app: true,
        bar_auth: false,
        hd_app: true,
        hd_auth: false,
        routeOnly: true
    },
    {
        url: "/vacancy/:id",
        component: VacancyPage,
        bar_app: true,
        bar_auth: true,
        hd_app: true,
        hd_auth: true,
        routeOnly: true
    }
]);

export function getRoute(path) {
    var isLog = isAuthorized();

    var routes = menuItem.map(function (d, i) {
        var exact = (d.url === "/") ? true : false;

        if (!d.allRoute) {
            if (isLog && !(d.hd_app || d.bar_app)) {
                return;
            }

            if (!isLog && !(d.hd_auth || d.bar_auth)) {
                return;
            }
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

function isRouteValid(isHeader, isLog, d) {
    // Header and is logged in
    if (isHeader && isLog && !d.hd_app) {
        return false;
    }

    // Header and is logged out
    if (isHeader && !isLog && !d.hd_auth) {
        return false;
    }

    // Bar and is logged in
    if (!isHeader && isLog && !d.bar_app) {
        return false;
    }

    // Bar and is logged out
    if (!isHeader && !isLog && !d.bar_auth) {
        return false;
    }

    return true;

}

export function getBar(path, isHeader = false) {

    var isLog = isAuthorized();

    var menuList = menuItem.map(function (d, i) {
        var exact = (d.url === "/") ? true : false;

        if (d.routeOnly) {
            return;
        }

        if (!isRouteValid(isHeader, isLog, d)) {
            return;
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
