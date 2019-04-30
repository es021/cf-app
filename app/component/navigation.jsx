import React, { Component } from "react";

import {
  BrowserRouter,
  Route,
  NavLink,
  Switch,
  Redirect
} from "react-router-dom";

import { LandingUrl } from "../../config/app-config";
import * as layoutActions from "../redux/actions/layout-actions";
import LandingPage from "../page/landing";
import LoginPage from "../page/login";
import SignUpPage from "../page/sign-up";
import AboutPage from "../page/about";
import LogoutPage from "../page/logout";
import UsersPage from "../page/users";
import CompaniesPage from "../page/companies";
import RecruiterPage from "../page/recruiters";
import HallPage from "../page/hall";
import ActAccountPage from "../page/activate-account";
import EditProfilePage from "../page/edit-profile";
import ManageCompanyPage from "../page/manage-company";
import ActivityPage from "../page/activity";
import ResumeDropPage from "../page/resume-drop";
import VacancyPage from "../page/vacancy";
import ExternalActionPage from "../page/external-action";
import SessionPage from "../page/session";
import { FaqPage, AllowCookiePage, ContactUsPage } from "../page/static";
import NotFoundPage from "../page/not-found";
import ComingSoonPage from "../page/coming-soon";
import { AuditoriumFeed, AuditoriumManagement } from "../page/auditorium.jsx";
import DashboardPage from "../page/dashboard";
import PasswordResetPage from "../page/password-reset";
import PasswordForgotPage from "../page/password-forgot";
import ForumPage from "../page/forum";
import { Overview } from "../page/overview";
import { SupportPage } from "../page/support";
import AnalyticPage from "../page/analytics";
import { FeedbackForm } from "../page/partial/analytics/feedback";
import { addLog } from "../redux/actions/other-actions";
import { LogEnum } from "../../config/db-config";

import {
  isAuthorized,
  isRoleStudent,
  isRoleRec,
  getAuthUser,
  isRoleOrganizer,
  isRoleSupport,
  isRoleAdmin,
  isComingSoon
} from "../redux/actions/auth-actions";
import { NotificationFeed } from "../page/notifications";

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

function isDisabled(page, COMING_SOON) {
  if (page == "auditorium" || page == "career-fair") {
    if ((isRoleStudent() || isRoleRec()) && !COMING_SOON) {
      return false;
    }
  }

  return true;
}

function getMenuItem(COMING_SOON) {
  var homeComponent = getHomeComponent(COMING_SOON);

  var menuItem = [
    // {
    //   url: null,
    //   label: "Notification",
    //   icon: "bell",
    //   component: homeComponent,
    //   count_attr: "count_notification",
    //   is_popup: true,
    //   bar_app: true,
    //   bar_auth: false,
    //   hd_app: true,
    //   hd_auth: false
    // },
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
      hd_app: true,
      hd_auth: false,
      routeOnly: isRoleAdmin() || isRoleOrganizer(),
      default_param: { id: getAuthUser().rec_company, current: "about" },
      disabled: !isRoleRec() && !isRoleAdmin() && !isRoleOrganizer()
    },
    {
      // Admin Only
      url: "/students",
      label: "Students",
      icon: "user",
      component: UsersPage,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      disabled: !isRoleAdmin() && !isRoleOrganizer()
    },
    {
      // Admin Only
      url: "/companies",
      label: "Companies",
      icon: "building",
      component: CompaniesPage,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      disabled: !isRoleAdmin() && !isRoleOrganizer()
    },
    {
      // Admin Only
      url: "/recruiters",
      label: "Recruiters",
      icon: "black-tie",
      component: RecruiterPage,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      disabled: !isRoleAdmin() && !isRoleOrganizer()
    },
    {
      // Admin Only
      url: "/live-feed",
      label: "Live Feed",
      icon: "commenting-o",
      component: DashboardPage,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      disabled: !isRoleAdmin() && !isRoleOrganizer()
    },
    {
      // Admin Only
      url: "/analytics/:current",
      label: "Analytics",
      icon: "bar-chart",
      component: AnalyticPage,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      default_param: { current: "subscriber" },
      disabled: !isRoleAdmin()
    },
    {
      // Admin Only
      url: "/support",
      label: "Support",
      icon: "comments",
      component: SupportPage,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      disabled: !isRoleSupport()
    },
    {
      // Student Only
      url: "/edit-profile/:current",
      label: "My Profile",
      icon: "user",
      component: EditProfilePage,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      default_param: { current: "profile" },
      disabled: !isRoleStudent()
    },
    {
      // Student Only
      url: "/edit-profile/:current",
      label: "Upload Document",
      icon: "file-text",
      component: EditProfilePage,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      default_param: { current: "doc-link" },
      disabled: !isRoleStudent()
    },
    {
      // Student Only
      url: "/edit-profile/:current",
      label: "Add Skills",
      icon: "star",
      component: EditProfilePage,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      default_param: { current: "skills" },
      disabled: !isRoleStudent()
    },
    {
      // Student Only
      url: "/edit-profile/:current",
      label: "Manage Availability",
      icon: "clock-o",
      component: EditProfilePage,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      default_param: { current: "availability" },
      disabled: !isRoleStudent()
    },
    // Remove For Eur
    // {
    //     url: "/career-fair",
    //     label: "Career Fair",
    //     icon: "suitcase",
    //     component: HallPage,
    //     bar_app: true,
    //     bar_auth: false,
    //     hd_app: true,
    //     hd_auth: false,
    //     // is not coming soon and one of the row then show = !disabled
    //     disabled: isDisabled("career-fair", COMING_SOON)
    // },
    {
      url: "/my-activity/:current",
      label: isRoleRec() ? "Interested Candidates" : "My Activity",
      icon: isRoleRec() ? "users" : "list-ul",
      component: ActivityPage,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      default_param: { current: isRoleRec() ? "student-listing" : "session" },
      //disabled: (!isRoleRec() && !isRoleStudent()) || (isRoleStudent() && COMING_SOON) //for student disable first
      // remove mmy activity from student
      disabled: !isRoleRec() || (isRoleStudent() && COMING_SOON) //for student disable first
    },
    // {
    //   url: "/my-activity/:current",
    //   label: "All Student",
    //   icon: "address-book-o",
    //   component: ActivityPage,
    //   bar_app: true,
    //   bar_auth: false,
    //   hd_app: true,
    //   hd_auth: false,
    //   default_param: { current: "all-student" },
    //   disabled: !isRoleRec()
    // },
    {
      url: "/manage-company/:id/:current",
      label: "Add Job Opportunity",
      icon: "star",
      component: ManageCompanyPage,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      default_param: { id: getAuthUser().rec_company, current: "vacancy" },
      disabled: !isRoleRec()
    },
    {
      // Admin Only
      url: "/auditorium-management",
      // EUR FIX
      label: "Manage Webinar",
      //label: "Auditorium",
      icon: "microphone",
      component: AuditoriumManagement,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      disabled: !isRoleAdmin() && !isRoleOrganizer()
    },
    {
      url: "/auditorium",
      // EUR FIX
      //label: "Auditorium",
      label: "Webinar",
      icon: "microphone",
      component: AuditoriumFeed,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      disabled: false //isDisabled("auditorium", COMING_SOON)
    },
    {
      url: "/company-forum",
      label: "Forum",
      icon: "comments",
      component: ForumPage,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      disabled: !isRoleRec()
    },
    {
      url: "/overview",
      label: "Overview",
      icon: "desktop",
      component: Overview,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      // EUR FIX
      disabled: !isRoleAdmin()
      //disabled: COMING_SOON
      //,disabled: !isRoleAdmin() && !isRoleOrganizer() && !isRoleRec()
    },
    // {
    //   url: "/about",
    //   label: "About",
    //   icon: "question",
    //   component: null,
    //   href: LandingUrl,
    //   bar_app: COMING_SOON && !(isRoleOrganizer() || isRoleAdmin()),
    //   bar_app: COMING_SOON && !(isRoleOrganizer() || isRoleAdmin()),
    //   hd_app: true,
    //   hd_auth: true
    // },
    // {
    //     url: "/faq",
    //     label: "FAQ",
    //     icon: "question-circle",
    //     component: FaqPage,
    //     bar_app: false, //COMING_SOON && !(isRoleOrganizer() || isRoleAdmin()),
    //     //bar_app: COMING_SOON && !(isRoleOrganizer() || isRoleAdmin()),
    //     hd_app: true,
    //     hd_auth: true
    // },
    // {
    //     url: "/contact",
    //     label: "Contact Us",
    //     icon: "envelope",
    //     component: ContactUsPage,
    //     bar_app: false, //COMING_SOON && !(isRoleOrganizer() || isRoleAdmin()),
    //     //bar_app: COMING_SOON && !(isRoleOrganizer() || isRoleAdmin()),
    //     hd_app: true,
    //     hd_auth: true
    // },
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
    // {
    //   url: "/logout",
    //   label: "Logout",
    //   icon: "sign-out",
    //   component: LogoutPage,
    //   bar_app: false,
    //   bar_auth: false,
    //   hd_app: true,
    //   hd_auth: false
    // },
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
  menuItem.push(
    ...[
      {
        url: "/forum/:forum_id",
        component: ForumPage,
        bar_app: true,
        bar_auth: false,
        hd_app: true,
        hd_auth: false,
        routeOnly: true
      },
      {
        url: "/feedback/:user_role",
        component: FeedbackForm,
        bar_app: true,
        bar_auth: false,
        hd_app: true,
        hd_auth: false,
        routeOnly: true
      },
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
        url: "/allow-cookie",
        component: AllowCookiePage,
        bar_app: true,
        bar_auth: true,
        hd_app: true,
        hd_auth: true,
        routeOnly: true
      },
      {
        url: "/password-forgot",
        component: PasswordForgotPage,
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
      },
      // email
      {
        url: "/external-action/:type/:param",
        component: ExternalActionPage,
        bar_app: true,
        bar_auth: true,
        hd_app: true,
        hd_auth: true,
        routeOnly: true
      }
    ]
  );

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

    var exact = d.url === "/" ? true : false;

    if (!d.allRoute) {
      if (isLog && !(d.hd_app || d.bar_app)) {
        return;
      }

      if (!isLog && !(d.hd_auth || d.bar_auth)) {
        return;
      }
    }

    return (
      <Route
        path={`${path}${d.url}`}
        exact={exact}
        key={i}
        component={d.component}
      />
    );
  });

  return (
    <Switch>
      {routes}
      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
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

export function getBar(path, { COMING_SOON, isHeader, count_notification }) {
  var isLog = isAuthorized();
  var menuItem = getMenuItem(COMING_SOON);

  var menuList = menuItem.map(function (d, i) {
    var exact = d.url === "/" ? true : false;

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
      return (
        <a href={d.href} target="blank">
          <li>
            {isHeader ? "" : <i className={`fa fa-${d.icon}`} />}
            <span className="menu_label">{d.label}</span>
          </li>
        </a>
      );
    }

    // generate item
    const onClickBar = e => {
      let label = e.currentTarget.dataset.label;
      addLog(LogEnum.EVENT_CLICK_LEFT_BAR, label);

      // for popup
      let is_popup = e.currentTarget.dataset.is_popup;
      if (is_popup == "1") {
        let component = null;
        if (label == "Notification") {
          component = NotificationFeed;
        }
        if (component != null) {
          layoutActions.storeUpdateFocusCard(label, component, {}, "no-margin");
        } else {
          alert("popup component is null");
        }
      }
    };

    // get item count
    let item_count = null;
    if (d.count_attr !== "undefined") {
      let countVal = 0;
      switch (d.count_attr) {
        case "count_notification":
          countVal = count_notification;
          break;
      }

      if (typeof countVal !== "undefined" && countVal != null && countVal > 0) {
        item_count = <span className="menu_count">{countVal}</span>;
      }
    }

    // create item
    let item_li = (
      <li>
        <i className={`fa fa-${d.icon} left`} />
        {/* {isHeader ? "" : <i className={`fa fa-${d.icon}`} />} */}
        <span className="menu_label">{d.label}</span>
        {item_count}
      </li>
    );

    // handle for normal url or popup
    if (d.is_popup == true) {
      return (
        <a
          data-label={d.label}
          data-is_popup={"1"}
          key={i}
          onClick={onClickBar}
          activeClassName="active"
        >
          {item_li}
        </a>
      );
    } else {
      return (
        <NavLink
          to={`${path}${url}`}
          data-label={d.label}
          exact={exact}
          key={i}
          onClick={onClickBar}
          activeClassName="active"
        >
          {item_li}
        </NavLink>
      );
    }
  });

  return <ul>{menuList}</ul>;
}
