import React, { Component } from "react";
import { render } from "react-dom";
import {
  BrowserRouter,
  Route,
  Switch,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import PrimaryLayout from "./primary-layout.jsx";
import TestLayout from "./layout/test-layout.jsx";
import NoCfLayout from "./layout/no-cf-layout.jsx";

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
  "input-text",
  "input-checkbox",
  "list-board",
  "paging",
  "hall-recruiter",
  "label",
  "choose-cf",
  "banner-float",

  // kena letak bawah skali
  "custom-CIMB",
  "custom-IMPACT",
  "custom-INTEL",
  "custom-JPATC",
  "custom-MDCW",
  "custom-MICRON",
  "custom-MONASH",
  "custom-MSAJ",
  "custom-SHELL",
  "custom-SUNWAY",
  "custom-TARUC",
  "custom-UTM20",
  "custom-MASAF",
];

for (var i in scss) {
  require("./css/" + scss[i] + ".scss");
}


if (window) {
  window.generateRefSql = (table_name, raw_data) => {
    let r = raw_data.split("\n").map((d) => {
      return `INSERT INTO ${table_name} (val) VALUES ('${d.trim().replace("'","\\'")}');`
    }).join("\n");

    r = `
DROP TABLE IF EXISTS wp_career_fair.${table_name};

CREATE TABLE wp_career_fair.${table_name} 
( 
  ID INT NOT NULL AUTO_INCREMENT , 
  val VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
  PRIMARY KEY (ID), UNIQUE(val), INDEX (val)
) ENGINE = InnoDB;

${r}
`

    console.log(r)
  }
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
        <Route path={`${RootPath}/nocf`} component={NoCfLayout} />
      </Switch>
    </BrowserRouter>
  </Provider>
);
render(<App />, document.getElementById("app"));
