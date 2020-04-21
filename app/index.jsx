import React, { Component } from "react";
import { render } from "react-dom";
import {
  BrowserRouter,
  Route,
  Switch,
} from "react-router-dom";
// import { getAxiosGraphQLQuery } from "../helper/api-helper";
import { Provider } from "react-redux";
// import { Loader } from "./component/loader";
import { store } from "./redux/store.js";

// import {
//   isAuthorized,
//   isComingSoon,
//   setLocalStorageCf,
//   getAuthUser
// } from "./redux/actions/auth-actions";

// import { addLog } from "./redux/actions/other-actions";
// import { LogEnum, CFSMetaObject, CFSMetaOrg } from "../config/db-config";
import PrimaryLayout from "./primary-layout.jsx";
import TestLayout from "./layout/test-layout.jsx";

//require("./lib/AutoComplete.js");
//require("./lib/font-awesome-4.7.0/css/font-awesome.css");

require("./lib/util.js");
let scss = [
  "action-box",
  "app",
  "availability",
  "block-loader",
  "border-card",
  "chat",
  "company-chat",
  "company-page",
  "company-sec",
  "company-sec-old",
  "content",
  "dashboard",
  "focus-card",
  "footer",
  "form",
  "forum",
  "gallery",
  "general",
  "general-layout",
  "group-session",
  "hall",
  "hall-gallery",
  "header",
  "home",
  "left-bar",
  "list",
  "list-row",
  "live-session",
  "notess",
  "notification",
  "overview",
  "page-sec",
  "profile-card",
  "qs-popup",
  "right-bar",
  "session-note",
  "sponsor",
  "sub-nav",
  "support-chat",
  "time-converter",
  "timer",
  "toogle-timezone",
  "tooltip",
  "input-suggestion",
  "input-single",
  "input-multi",
  "input-general",
  "vacancy",
  "event",
  "browse-student",
  "input-select",
  "input-checkbox",
  "list-board",
  "paging",
  "hall-recruiter",

  // kena letak bawah skali
  "custom-SHELL",
  "custom-CIMB"
];
for (var i in scss) {
  require("./css/" + scss[i] + ".scss");
}

import AuthorizedRoute from "./component/authorize-route";
import { RootPath } from "../config/app-config";
const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <AuthorizedRoute path={`${RootPath}/app`} component={PrimaryLayout} />
        <Route path={`${RootPath}/auth`} component={PrimaryLayout} />
        <Route path={`${RootPath}/test`} component={TestLayout} />
      </Switch>
    </BrowserRouter>
  </Provider>
);
render(<App />, document.getElementById("app"));
