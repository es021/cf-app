import React, { Component } from 'react';

import { BrowserRouter, Route, NavLink, Switch, Redirect } from 'react-router-dom';

import LandingPage from '../page/landing';
import LoginPage from '../page/login';
import SignUpPage from '../page/sign-up';
import AboutPage from '../page/about';
import LogoutPage from '../page/logout';
import UsersPage from '../page/users';
import CompaniesPage from '../page/companies';
import HallPage from '../page/hall';
import ActAccountPage from '../page/activate-account';
import EditProfilePage from '../page/edit-profile';
import ManageCompanyPage from '../page/manage-company';
import ResumeDropPage from '../page/resume-drop';
import VacancyPage from '../page/vacancy';
import SessionPage from '../page/session';
import FaqPage from '../page/faq';
import ContactUsPage from '../page/contact-us';
import NotFoundPage from '../page/not-found';
import ComingSoonPage from '../page/coming-soon';
import DashboardPage from '../page/dashboard';
import PasswordResetPage from '../page/password-reset';

import { isAuthorized, isRoleStudent, isRoleRec, getAuthUser, isRoleOrganizer, isRoleAdmin } from '../redux/actions/auth-actions';

function getHomeComponent(COMING_SOON) {
    var homeComponent = null;
    if (isAuthorized()) {
        if (COMING_SOON) {
            var homeComponent = ComingSoonPage;
        } else {
            if (isRoleStudent()) homeComponent = HallPage;
            else if (isRoleRec()) homeComponent = HallPage;
            else if (isRoleAdmin()) homeComponent = CompaniesPage;
        }
    } else {
        homeComponent = LandingPage;
    }
    return homeComponent;
}

function getMenuItem(COMING_SOON) {
    var homeComponent = getHomeComponent(COMING_SOON);

    var menuItem = [
        {
            url: "/",
            label: "Home",
            icon: "home",
            component: homeComponent,
            bar_app: true,
            bar_auth: true,
            hd_app: true,
            hd_auth: true
        },
        {
            url: "/manage-company/:id/:current",
            label: "My Company",
            icon: "building",
            component: ManageCompanyPage,
            bar_app: true,
            bar_auth: false,
            hd_app: false,
            hd_auth: false,
            routeOnly: isRoleAdmin() || isRoleOrganizer(),
            default_param: { id: getAuthUser().rec_company, current: "about" },
            disabled: !isRoleRec() && !isRoleAdmin() && !isRoleOrganizer()
        },
        { // Admin Only
            url: "/users",
            label: "Users",
            icon: "user",
            component: UsersPage,
            bar_app: true,
            bar_auth: false,
            hd_app: false,
            hd_auth: false,
            disabled: !isRoleAdmin() && !isRoleOrganizer()
        },
        { // Admin Only
            url: "/companies",
            label: "Companies",
            icon: "building",
            component: CompaniesPage,
            bar_app: true,
            bar_auth: false,
            hd_app: false,
            hd_auth: false,
            disabled: !isRoleAdmin() && !isRoleOrganizer()
        },
        { // Admin Only
            url: "/live-feed",
            label: "Live Feed",
            icon: "bullhorn",
            component: DashboardPage,
            bar_app: true,
            bar_auth: false,
            hd_app: false,
            hd_auth: false,
            disabled: !isRoleAdmin() && !isRoleOrganizer()
        },
        {
            url: "/auditorium",
            label: "Auditorium",
            icon: "microphone",
            component: HallPage,
            bar_app: true,
            bar_auth: false,
            hd_app: false,
            hd_auth: false,
            // is not coming soon and one of the row then show = !disabled
            disabled: !(!COMING_SOON && (isRoleStudent() || isRoleRec()))
        },
        {
            url: "/career-fair",
            label: "Career Fair",
            icon: "suitcase",
            component: HallPage,
            bar_app: true,
            bar_auth: false,
            hd_app: false,
            hd_auth: false,
            // is not coming soon and one of the row then show = !disabled
            disabled: !(!COMING_SOON && (isRoleStudent() || isRoleRec()))
        },
        {
            url: "/about",
            label: "About",
            icon: "question",
            component: null,
            href: "https://seedsjobfair.com/",
            bar_app: COMING_SOON,
            bar_auth: COMING_SOON,
            hd_app: true,
            hd_auth: true
        },
        {
            url: "/faq",
            label: "FAQ",
            icon: "question-circle",
            component: FaqPage,
            bar_app: true,
            bar_auth: true,
            hd_app: true,
            hd_auth: true
        },
        {
            url: "/contact",
            label: "Contact Us",
            icon: "envelope",
            component: ContactUsPage,
            bar_app: COMING_SOON,
            bar_auth: COMING_SOON,
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
    // ############################################################################/
    /**** ROUTE ONLY *******/
    menuItem.push(...[
        {
            url: "/session/:id",
            component: SessionPage,
            bar_app: true,
            bar_auth: false,
            hd_app: true,
            hd_auth: false,
            routeOnly: true
        },
        {
            url: "/password-reset/:token/:user_id",
            component: PasswordResetPage,
            bar_app: true,
            bar_auth: true,
            hd_app: true,
            hd_auth: true,
            routeOnly: true
        },
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

    return menuItem;
}

// ############################################################################/
/**** HELPER FUNCTION *******/

export function getRoute(path, COMING_SOON) {
    var isLog = isAuthorized();
    var menuItem = getMenuItem(COMING_SOON);
    var routes = menuItem.map(function (d, i) {
        //restricted
        if (d.disabled) {
            return false;
        }

        var exact = (d.url === "/") ? true : false;

        if (!d.allRoute) {
            if (isLog && !(d.hd_app || d.bar_app)) {
                return;
            }

            if (!isLog && !(d.hd_auth || d.bar_auth)) {
                return;
            }
        }

        return (<Route path={`${path}${d.url}`} exact={exact} key={i} component={d.component}></Route>);
    });

    return (<Switch>
        {routes}
        <Route path="*" component={NotFoundPage} />
    </Switch>);
}


// strictly for getBar only
// wont work for getRoute
function isBarValid(isHeader, isLog, d) {
    if (d.disabled) {
        return false;
    }

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


export function getBar(path, COMING_SOON, isHeader = false) {

    var isLog = isAuthorized();
    var menuItem = getMenuItem(COMING_SOON);

    var menuList = menuItem.map(function (d, i) {
        var exact = (d.url === "/") ? true : false;

        if (d.routeOnly) {
            return;
        }

        if (!isBarValid(isHeader, isLog, d)) {
            return;
        }

        var url = d.url;
        if (d.default_param) {
            for (var key in d.default_param) {
                url = url.replace(`:${key}`, d.default_param[key]);
            }
        }

        if (d.component === null && d.href != "") {
            return <a href={d.href} target="blank">
                <li>
                    {(isHeader) ? "" : <i className={`fa fa-${d.icon}`}></i>}
                    <span className="menu_label">{d.label}</span>
                </li>
            </a>
        }

        return (<NavLink to={`${path}${url}`} exact={exact} key={i} activeClassName="active">
            <li>
                {(isHeader) ? "" : <i className={`fa fa-${d.icon}`}></i>}
                <span className="menu_label">{d.label}</span>
            </li>
        </NavLink>);
    });

    return (<ul>{menuList}</ul>);
}
