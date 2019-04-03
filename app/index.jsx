import React, { Component } from "react";
import { render } from "react-dom";
import {
  BrowserRouter,
  Route,
  NavLink,
  Switch,
  Redirect
} from "react-router-dom";
import { getAxiosGraphQLQuery } from "../helper/api-helper";
import { Provider } from "react-redux";
import { Loader } from "./component/loader";
import { store } from "./redux/store.js";

import {
  isAuthorized,
  isComingSoon,
  setLocalStorageCf,
  getAuthUser
} from "./redux/actions/auth-actions";

import { addLog } from "./redux/actions/other-actions";
import { LogEnum, CFSMetaObject, CFSMetaOrg } from "../config/db-config";
import PrimaryLayout from "./primary-layout.jsx";
//console.log(process.env.NODE_ENV);

require("./css/general.scss");

//console.log(User);

require("./lib/util.js");
//require("./lib/AutoComplete.js");

require("./css/app.scss");
require("./css/content.scss");
require("./css/header.scss");
require("./css/left-bar.scss");
require("./css/right-bar.scss");
//require("./lib/font-awesome-4.7.0/css/font-awesome.css");


import AuthorizedRoute from "./component/authorize-route";
import { RootPath } from "../config/app-config";
const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <AuthorizedRoute path={`${RootPath}/app`} component={PrimaryLayout} />
        <Route path={`${RootPath}/auth`} component={PrimaryLayout} />
      </Switch>
    </BrowserRouter>
  </Provider>
);
render(<App />, document.getElementById("app"));
