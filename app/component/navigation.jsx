import React, { Component } from "react";

import {
  BrowserRouter,
  Route,
  NavLink,
  Switch,
  Redirect
} from "react-router-dom";

import { LandingUrl, IsNewHall, IsRecruiterNewHall, IsOnVideoResume } from "../../config/app-config";
import * as layoutActions from "../redux/actions/layout-actions";
import LandingPage from "../page/landing";
import VolunteerScheduledInterview from "../page/volunteer-scheduled-interview";
import LoginPage from "../page/login";
import SignUpPage from "../page/sign-up";
import AboutPage from "../page/about";
import LogoutPage from "../page/logout";
import UsersPage from "../page/users";
import AdminZoom from "../page/admin-zoom";
import CompaniesPage from "../page/admin-company";
import RecruiterPage from "../page/admin-recruiter";
import AdminCf from "../page/admin-cf";
import HallPage from "../page/hall";
import HallPageOld from "../page/hall-old";
import ActAccountPage from "../page/activate-account";
import EditProfilePage from "../page/edit-profile";
import ManageCompanyPage from "../page/manage-company";
import CompanyPage from "../page/company";
import ActivityPage from "../page/activity";
import ResumeDropPage from "../page/resume-drop";
import VacancyPage from "../page/vacancy";
import ExternalActionPage from "../page/external-action";
import SessionPage from "../page/session";
import { FaqPage, AllowCookiePage, ContactUsPage } from "../page/static";
import CompanyChatInbox, {
  CompanyChatStarter,
  StudentChatStarter
} from "../page/company-chat";
import NotFoundPage from "../page/not-found";
import ComingSoonPage from "../page/coming-soon";
import { AuditoriumFeed, AuditoriumManagement } from "../page/auditorium.jsx";
import DashboardPage from "../page/dashboard";
import TimeConverterPage from "../page/time-converter";
import PasswordResetPage from "../page/password-reset";
import PasswordForgotPage from "../page/password-forgot";
import ForumPage from "../page/forum";
import { Overview } from "../page/overview";
import { SupportPage } from "../page/support";
import AnalyticPage from "../page/analytics";
import { FeedbackForm } from "../page/partial/analytics/feedback";
import { addLog } from "../redux/actions/other-actions";
import { LogEnum, CFSMeta } from "../../config/db-config";
import { LangPickerHeader } from "../page/lang-picker";
import {
  isAuthorized,
  isRoleStudent,
  isRoleRec,
  getAuthUser,
  isRoleOrganizer,
  isRoleSupport,
  isRoleAdmin,
  isComingSoon,
  isRoleVolunteer,
  getCF_externalHomeUrl,
  getCF_guideUrl,
  getCF_hasGuideUrl,
  isCfFeatureOff,
  getCfCustomMeta
} from "../redux/actions/auth-actions";
import { NotificationFeed } from "../page/notifications";
import { ManageHallGallery } from "../page/partial/hall/hall-gallery";
import { ManageHallLobby } from "../page/partial/hall/hall-lobby";
import ListCompanies from "../page/list-companies";
import ListEventsWebinars from "../page/list-events-webinars";
import ListJobPosts from "../page/list-job-posts";
import EventManagement from "../page/event-management";
import ListEvent from "../page/list-events";
import ListInterviews from "../page/list-interviews";
import { BrowseStudent } from "../page/browse-student";
import HallRecruiterPage from "../page/hall-recruiter";
import { isHasLeftBar, hideLeftBar } from "../layout/left-bar-layout";
import { ChooseCfPage } from "./choose-cf";
import ListJobApplicants from "../page/list-job-applicants";
import { _student_plural } from "../redux/actions/text-action";
import { lang, isHasOtherLang } from "../lib/lang";
import AdminStudentPage from "../page/admin-student";
import ListJobApplied from "../page/list-job-applied";
import AdminMisc from "../page/admin-misc";
import ManageVacancy from "../page/manage-vacancy";
import OrganizerDashboard from "../page/organizer-dashboard";
import OrganizersPage from "../page/admin-organizer";
import { AnnouncementManagement } from "../page/announcement";
import ListStudentGroupCall from "../page/list-student-group-call";
import AdminManageGroupCall from "../page/admin-manage-group-call";
import CompanyDashboard from "../page/company-dashboard";

function getHomeComponent(COMING_SOON) {
  var homeComponent = null;
  if (isAuthorized()) {
    if (isRoleOrganizer()) {
      homeComponent = OrganizerDashboard;
    }
    else if (isRoleRec() && IsRecruiterNewHall) {
      homeComponent = HallRecruiterPage;
    } else if (IsNewHall) {
      // new hall takde pegi page coming soon
      if (isRoleStudent()) homeComponent = HallPage;
      else if (isRoleRec()) homeComponent = HallPage;
      else if (isRoleAdmin()) homeComponent = HallPage;
      else if (isRoleVolunteer()) homeComponent = VolunteerScheduledInterview;
    } else {
      if (COMING_SOON) {
        var homeComponent = ComingSoonPage;
      } else {
        if (isRoleStudent()) homeComponent = HallPageOld;
        else if (isRoleRec()) homeComponent = HallPageOld;
        else if (isRoleAdmin()) homeComponent = CompaniesPage;
      }
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

export function isPageMyInbox() {
  return location.href.indexOf("my-inbox") >= 0;
}

function getMenuItem(COMING_SOON) {
  var homeComponent = getHomeComponent(COMING_SOON);

  var menuItem = [

    {
      url: "/",
      label: lang("Home"),
      icon: "home",
      component: homeComponent,
      has_external_url: getCF_externalHomeUrl() ? true : false,
      external_url: getCF_externalHomeUrl(),
      bar_app: true,
      bar_auth: true,
      hd_app: isHasLeftBar() ? false : true,
      hd_auth: true
    },
    // ###############################################################
    // ADMIN
    {
      // Admin Only
      url: "/companies",
      label: "Companies",
      icon: "building",
      component: CompaniesPage,
      bar_app: true,
      bar_auth: false,
      hd_app: false,
      hd_auth: false,
      disabled: !isRoleAdmin()
    },
    {
      url: "/manage-events",
      // EUR FIX
      //label: "Auditorium",
      label: "Manage Events",
      icon: "microphone",
      component: EventManagement,
      bar_app: true,
      bar_auth: false,
      hd_app: false,
      hd_auth: false,
      disabled: !isRoleAdmin()
    },
    {
      url: "/manage-cf",
      label: "Manage Career Fair",
      icon: "slack",
      component: AdminCf,
      bar_app: true,
      bar_auth: false,
      hd_app: false,
      hd_auth: false,
      disabled: !isRoleAdmin()
    },
    {
      // Admin Only
      url: "/admin-recruiter",
      label: "Recruiters",
      icon: "black-tie",
      component: RecruiterPage,
      bar_app: true,
      bar_auth: false,
      hd_app: false,
      hd_auth: false,
      disabled: !isRoleAdmin()
    },
    {
      // Admin Only
      url: "/admin-organizer",
      label: "Organizers",
      icon: "black-tie",
      component: OrganizersPage,
      bar_app: true,
      bar_auth: false,
      hd_app: false,
      hd_auth: false,
      disabled: !isRoleAdmin()
    },
    {
      // Admin Only
      url: "/hall-gallery",
      label: "Hall Gallery",
      icon: "image",
      component: ManageHallGallery,
      bar_app: true,
      bar_auth: false,
      hd_app: false,
      hd_auth: false,
      disabled: !isRoleAdmin()
    },
    {
      // Admin Only
      url: "/hall-lobby",
      label: "Hall Lobby",
      icon: "group",
      component: ManageHallLobby,
      bar_app: true,
      bar_auth: false,
      hd_app: false,
      hd_auth: false,
      disabled: !isRoleAdmin()
    },
    // ###############################################################
    // ORGANIZER
    {
      url: "/org-current-event",
      label: lang("Event"),
      icon: "slack",
      component: HallPage,
      bar_app: true,
      bar_auth: false,
      // hd_app: IsRecruiterNewHall ? false : true,
      hd_app: isHasLeftBar() ? false : true,
      hd_auth: false,
      disabled: !isRoleOrganizer()
    },
    {
      url: "/participant-listing",
      label: "Participant Listing",
      icon: "user",
      component: BrowseStudent,
      bar_app: true,
      bar_auth: false,
      hd_app: false,
      hd_auth: false,
      disabled: !isRoleOrganizer()
    },
    {
      url: "/exhibitor-listing",
      label: "Exhibitor Listing",
      icon: "building",
      component: ListCompanies,
      bar_app: true,
      bar_auth: false,
      hd_app: false,
      hd_auth: false,
      disabled: !isRoleOrganizer()
    },
    {
      url: "/job-positions",
      label: "Job Positions",
      icon: "suitcase",
      component: ManageVacancy,
      bar_app: true,
      bar_auth: false,
      hd_app: false,
      hd_auth: false,
      disabled: !isRoleOrganizer()
    },
    {
      url: "/interviews",
      label: "Interviews",
      icon: "comments",
      component: VolunteerScheduledInterview,
      bar_app: true,
      bar_auth: false,
      hd_app: false,
      hd_auth: false,
      disabled: !isRoleOrganizer()
    },
    {
      url: "/announcements",
      label: "Announcements",
      icon: "bullhorn",
      component: AnnouncementManagement,
      bar_app: true,
      bar_auth: false,
      hd_app: false,
      hd_auth: false,
      disabled: !isRoleOrganizer()
    },
    // ###############################################################
    // VOLUNTEER
    {
      url: "/manage-scheduled-interview",
      label: "Manage Scheduled Interview",
      icon: "building",
      component: VolunteerScheduledInterview,
      bar_app: true,
      bar_auth: false,
      hd_app: false,
      hd_auth: false,
      disabled: !isRoleVolunteer() && !isRoleAdmin()
    },
    {
      url: "/manage-group-call",
      label: "Manage Group Call",
      icon: "group",
      component: AdminManageGroupCall,
      bar_app: true,
      bar_auth: false,
      hd_app: false,
      hd_auth: false,
      disabled: !isRoleVolunteer() && !isRoleAdmin()
    },
    {
      // Admin Only
      url: "/analytics/:current",
      label: "Analytics",
      icon: "bar-chart",
      component: AnalyticPage,
      bar_app: true,
      bar_auth: false,
      hd_app: false,
      hd_auth: false,
      default_param: { current: "subscriber" },
      disabled: !isRoleAdmin()
    },
    {
      // Admin Only
      url: "/misc/:current",
      label: "Miscellaneous",
      icon: "sliders",
      component: AdminMisc,
      bar_app: true,
      bar_auth: false,
      hd_app: false,
      hd_auth: false,
      default_param: { current: "job-post-bundle" },
      disabled: !isRoleAdmin()
    },
    {
      // Student Only
      url: "/edit-profile/:current",
      label: lang("My Profile"),
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
      url: "/browse-student",
      // label: "All Students",
      label: lang("All " + _student_plural()),
      icon: "users",
      component: BrowseStudent,
      bar_app: true,
      bar_auth: false,
      hd_app: IsRecruiterNewHall ? false : true,
      hd_auth: false,
      disabled: !isRoleRec()
    },
    {
      url: "/my-inbox",
      label: lang("Inbox"),
      icon: "envelope-o",
      count_attr: "count_inbox",
      component: CompanyChatInbox,
      bar_app: true,
      bar_auth: false,
      hd_app: isHasLeftBar() ? false : true,
      hd_auth: false,
      disabled: !IsNewHall || (!isRoleRec() && !isRoleStudent()) || isCfFeatureOff(CFSMeta.FEATURE_CHAT)

      //disabled: COMING_SOON || !IsNewHall || (!isRoleRec() && !isRoleStudent())
    },
    // @noti
    {
      url: null,
      label: "Notification",
      icon: "bell",
      component: homeComponent,
      id: "notification",
      count_attr: "count_notification",
      is_popup: true,
      bar_app: true,
      bar_auth: false,
      hd_app: isHasLeftBar() ? false : true,
      hd_auth: false,
      // disabled: (!isRoleRec() && !isRoleStudent()),
      disabled: (!isRoleStudent()),
    },
    {
      url: "/browse-student-company/:id",
      component: BrowseStudent,
      bar_app: true,
      bar_auth: false,
      hd_app: IsRecruiterNewHall ? false : true,
      hd_auth: false,
      routeOnly: true,
      disabled: !isRoleAdmin() && !isRoleOrganizer()
    },
    {
      url: "/interested-student",
      label: lang("Interested Students"),
      icon: "heart",
      component: BrowseStudent,
      routeOnly: true,
      bar_app: false,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      disabled: !isRoleRec()
    },
    {
      url: "/student-list-job-post",
      label: lang("Student Listing"),
      icon: "user",
      component: BrowseStudent,
      routeOnly: true,
      bar_app: true,
      bar_auth: false,
      // hd_app: true,
      hd_auth: false,
      disabled: !isRoleRec()
    },
    {
      url: "/student-list-job-post-admin/:id",
      label: lang("Student Listing"),
      icon: "user",
      component: BrowseStudent,
      routeOnly: true,
      bar_app: true,
      bar_auth: true,
      // hd_app: true,
      hd_auth: true,
      disabled: !isRoleAdmin()
    },
    {
      url: "/auditorium",
      // EUR FIX
      //label: "Auditorium",
      label: lang("Webinar"),
      icon: "microphone",
      component: AuditoriumFeed,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      disabled: IsNewHall //isDisabled("auditorium", COMING_SOON)
    },
    {
      // Student Only
      url: "/edit-profile/:current",
      label: lang("Upload Resume/Document"),
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
      url: "/list-job-applied",
      label: lang(`${getCfCustomMeta(CFSMeta.TEXT_JOB_POST_CARD, "Jobs")} Applied`),
      icon: "check-square-o ",
      component: ListJobApplied,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      disabled: !isRoleStudent() || isCfFeatureOff(CFSMeta.FEATURE_STUDENT_JOB_POST)
    },
    {
      // Student Only
      url: "/edit-profile/:current",
      label: lang("Upload Video Resume"),
      icon: "youtube-play",
      component: EditProfilePage,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      default_param: { current: "video-resume" },
      disabled: !isRoleStudent() || !IsOnVideoResume
    },
    {
      // Student Only
      url: "/edit-profile/:current",
      label: lang("Manage Availability"),
      icon: "clock-o",
      component: EditProfilePage,
      bar_app: true,
      bar_auth: false,
      hd_app: true,
      hd_auth: false,
      default_param: { current: "availability" },
      //disabled: !isRoleStudent()
      disabled: IsNewHall
    },
    {
      url: "/company/:id/",
      label: lang("Company Profile"),
      icon: "building",
      component: CompanyPage,
      bar_app: true,
      bar_auth: false,
      hd_app: isHasLeftBar() ? false : true,
      hd_auth: false,
      default_param: { id: getAuthUser().rec_company },
      disabled: !isRoleRec()
    },
    {
      url: "/rec-current-event",
      label: lang("See Event"),
      icon: "slack",
      component: HallPage,
      bar_app: true,
      bar_auth: false,
      // hd_app: IsRecruiterNewHall ? false : true,
      hd_app: isHasLeftBar() ? false : true,
      hd_auth: false,
      disabled: !isRoleRec()
    },
    {
      url: "/rec-analytics",
      label: lang("Analytics"),
      icon: "bar-chart",
      component: CompanyDashboard,
      bar_app: true,
      bar_auth: false,
      // hd_app: IsRecruiterNewHall ? false : true,
      hd_app: isHasLeftBar() ? false : true,
      hd_auth: false,
      disabled: !isRoleRec()
    },
    {
      url: "/manage-company/:id/:current",
      label: lang("Manage Email Notification"),
      icon: "envelope",
      component: ManageCompanyPage,
      bar_app: true,
      bar_auth: false,
      hd_app: isHasLeftBar() ? false : true,
      hd_auth: false,
      default_param: { id: getAuthUser().rec_company, current: "manage_email" },
      disabled: !isRoleRec()
    },
    {
      url: "/manage-company/:id/:current",
      component: ManageCompanyPage,
      bar_app: true,
      bar_auth: false,
      // hd_app: IsRecruiterNewHall ? false : true,
      hd_app: true,
      hd_auth: false,
      routeOnly: true,
      default_param: { id: getAuthUser().rec_company, current: "about" },
      disabled: !isRoleRec() && !isRoleAdmin() && !isRoleOrganizer()
    },
    {
      url: "/manage-company/:id/:current",
      label: lang("Add Job Post"),
      icon: "suitcase",
      component: ManageCompanyPage,
      bar_app: false,
      bar_auth: false,
      hd_app: false,
      hd_auth: false,
      default_param: { id: getAuthUser().rec_company, current: "vacancy" },
      disabled: !isRoleRec()
    },
    {
      url: "/login",
      label: lang("Login"),
      icon: "sign-in",
      component: LoginPage,
      bar_app: false,
      bar_auth: true,
      hd_app: false,
      hd_auth: true,
      allRoute: true
    },
    {
      url: "/sign-up",
      label: lang("Sign Up"),
      icon: "user-plus",
      component: SignUpPage,
      bar_app: false,
      bar_auth: true,
      hd_app: false,
      hd_auth: true
    },
    {
      url: "/guide",
      label: lang("Guide"),
      icon: "question-circle",
      component: "",
      has_external_url: true,
      external_target: "_blank",
      external_url: getCF_guideUrl(),
      bar_app: getCF_hasGuideUrl(),
      bar_auth: getCF_hasGuideUrl(),
      hd_app: getCF_hasGuideUrl() && isRoleStudent(),
      hd_auth: getCF_hasGuideUrl()
    },
    {
      url: "/logout",
      label: lang("Logout"),
      icon: "sign-out",
      component: LogoutPage,
      bar_app: true,
      bar_auth: false,
      hd_app: isHasLeftBar() ? false : true,
      hd_auth: false
    },
    {
      url: "/language-picker",
      label: <span>Bahasa</span>,
      icon: "",
      component: "",
      isLangPicker: true,
      bar_app: isHasLeftBar() ? true : false,
      bar_auth: false,
      hd_app: isHasLeftBar() ? false : true,
      hd_auth: isHasLeftBar() ? false : true,
    },
  ];
  // ############################################################################/
  /**** ROUTE ONLY *******/
  menuItem.push(
    ...[
      {
        url: "/list-job-applicants/:id",
        component: ListJobApplicants,
        bar_app: true,
        bar_auth: true,
        hd_app: true,
        hd_auth: true,
        routeOnly: true
      },
      {
        url: "/list-interviews",
        component: ListInterviews,
        bar_app: true,
        bar_auth: true,
        hd_app: true,
        hd_auth: true,
        routeOnly: true
      },
      {
        url: "/list-group-call",
        component: ListStudentGroupCall,
        bar_app: true,
        bar_auth: true,
        hd_app: true,
        hd_auth: true,
        routeOnly: true
      },
      {
        url: "/list-events",
        component: ListEvent,
        bar_app: true,
        bar_auth: true,
        hd_app: true,
        hd_auth: true,
        routeOnly: true
      },
      {
        url: "/list-job-posts",
        component: ListJobPosts,
        bar_app: true,
        bar_auth: true,
        hd_app: true,
        hd_auth: true,
        routeOnly: true
      },
      {
        url: "/list-events-webinars",
        component: ListEventsWebinars,
        bar_app: true,
        bar_auth: true,
        hd_app: true,
        hd_auth: true,
        routeOnly: true
      },
      {
        url: "/list-companies",
        component: ListCompanies,
        bar_app: true,
        bar_auth: true,
        hd_app: true,
        hd_auth: true,
        routeOnly: true
      },
      {
        url: "/my-local-time",
        component: TimeConverterPage,
        bar_app: true,
        bar_auth: true,
        hd_app: true,
        hd_auth: true,
        routeOnly: true
      },
      {
        url: "/company-chat/:id",
        component: CompanyChatStarter,
        bar_app: true,
        bar_auth: false,
        hd_app: true,
        hd_auth: false,
        routeOnly: true
      },
      {
        url: "/student-chat/:id",
        component: StudentChatStarter,
        bar_app: true,
        bar_auth: false,
        hd_app: true,
        hd_auth: false,
        routeOnly: true
      },
      {
        url: "/company/:id",
        component: CompanyPage,
        bar_app: true,
        bar_auth: false,
        hd_app: true,
        hd_auth: false,
        routeOnly: true
      },
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
        routeOnly: true,
        enableInNoCf: true
      },
      {
        url: "/choose-cf",
        component: ChooseCfPage,
        bar_app: true,
        bar_auth: true,
        hd_app: true,
        hd_auth: true,
        routeOnly: true,
        enableInNoCf: true
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

export function getRoute(path, COMING_SOON, isNoCf = false) {
  var isLog = isAuthorized();
  var menuItem = getMenuItem(COMING_SOON);
  var routes = menuItem.map(function (d, i) {

    if (d.disabled) {
      return false;
    }

    // ##################################
    // validation for /nocf/
    if (isNoCf) {
      if (!d.enableInNoCf) {
        return false;
      }
    }
    // ##################################
    // validation for /auth/ and /app/
    else {
      var exact = d.url === "/" ? true : false;

      if (!d.allRoute) {
        if (isLog && !(d.hd_app || d.bar_app)) {
          return;
        }

        if (!isLog && !(d.hd_auth || d.bar_auth)) {
          return;
        }
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

export function getBar(
  path,
  { COMING_SOON, isHeader, count_notification, count_inbox }
) {
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

    if (d.isLangPicker) {
      return <LangPickerHeader></LangPickerHeader>
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
      let type = e.currentTarget.dataset.type;

      // kalau tekan kat left-bar yang hidden masa screen kecik tu
      // kita nk dia hide balik lepas tekan
      if (type == "left-bar") {
        hideLeftBar();
      }

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
        case "count_inbox":
          countVal = count_inbox;
          break;
      }

      if (typeof countVal !== "undefined" && countVal != null && countVal > 0) {
        if (countVal > 99) {
          countVal = "99+";
        }
        item_count = <div className="menu_count">{countVal}</div>;
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

    console.log("d.has_external_url", d.has_external_url);

    // handle for normal url or popup
    if (d.is_popup == true) {
      return (
        <a
          className={d.id ? "menu-" + d.id : null}
          data-label={d.label}
          data-is_popup={"1"}
          key={i}
          onClick={onClickBar}
          activeClassName="active"
        >
          {item_li}
        </a>
      );
    }
    else if (d.has_external_url == true) {
      return (
        <a
          key={i}
          href={d.external_url}
          target={d.external_target}
          activeClassName="active"
        >
          {item_li}
        </a>
      );
    }
    else {
      console.log("d", d);

      return (
        <NavLink
          to={`${path}${url}`}
          data-label={d.label}
          exact={exact}
          key={i}
          data-type={isHeader ? "header" : "left-bar"}
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
