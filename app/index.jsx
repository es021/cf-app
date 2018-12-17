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
  setLocalStorageCf
} from "./redux/actions/auth-actions";

import { addLog } from "./redux/actions/other-actions";
import { LogEnum, CFSMetaObject, CFSMetaOrg } from "../config/db-config";

//console.log(process.env.NODE_ENV);

//import {User} from '../config/db-config';
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

import * as Navigation from "./component/navigation";
import HeaderLayout from "./layout/header-layout";
import FooterLayout from "./layout/footer-layout";
import LeftBarLayout from "./layout/left-bar-layout.jsx";
import RightBarLayout from "./layout/right-bar-layout";

//singleton
import FocusCard from "./component/focus-card";
import { SupportChat } from "./page/support";
import BlockLoader from "./component/block-loader";
import { initSocket } from "./socket/socket-client";

class PrimaryLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingCf: true
    };
  }

  componentWillMount() {
    initSocket();
    this.loadCf();
  }

  loadCf() {
    var query = `query{cfs(is_active:1){
		ID
		name
		country
		time
		is_active
		created_at
		updated_at
		title
		flag
		banner
		banner_pos
		schedule
		override_coming_soon
		logo
		logo_height
		logo_width
		logo_position
		logo_size
		start
		end
		time_str
		time_str_mas
		test_start
		test_end
		page_url
		page_banner
		can_login
    can_register
    Organizer
    Collaborator
    Powered
  }}`;

    getAxiosGraphQLQuery(query).then(res => {
      var cfs = res.data.data.cfs;
      let attrObj = CFSMetaObject;
      for (var i in cfs) {
        for (var cfKey in cfs[i]) {
          if (attrObj.indexOf(cfKey) >= 0) {
            let val = cfs[i][cfKey];
            if (val != null) {
              try {
                val = JSON.parse(val);
              } catch (err) {
                console.log(`err in parsing ${cfKey} for`, cfs[i]);
                val = null;
              }
            }
            cfs[i][cfKey] = val;
          }
        }
      }

      console.log(cfs);
      setLocalStorageCf(cfs);

      this.setState(prevState => {
        return {
          loadingCf: false
        };
      });
    });
  }

  render() {
    //scroll to top
    console.log("PrimaryLayout");

    if (this.state.loadingCf) {
      let initStyle = {
        textAlign: "center",
        display: "flex",
        height: "100vh",
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        flexFlow: "column"
      };
      return (
        <div style={initStyle}>
          <Loader size="3" />
          <div>Initializing Career Fair</div>
        </div>
      );
    }

    window.scrollTo(0, 0);
    var path = this.props.match.path;

    var logData = window.location.pathname;
    logData = logData.replace(path, "");
    addLog(LogEnum.EVENT_OPEN_PAGE, logData);

    var COMING_SOON = isComingSoon();
    var headerMenu = Navigation.getBar(path, COMING_SOON, true);
    var sideMenu = Navigation.getBar(path, COMING_SOON);
    var route = Navigation.getRoute(path, COMING_SOON);

    if (!isAuthorized()) {
      return (
        <div className="primary-layout landing-page">
          <HeaderLayout menuList={headerMenu} />
          <div className="content">
            <div className="main">{route}</div>
          </div>
          <FooterLayout />
        </div>
      );
    } else {
      return (
        <div className="primary-layout">
          <FocusCard />
          <SupportChat />
          <BlockLoader />
          <HeaderLayout menuList={headerMenu} />
          <LeftBarLayout menuList={sideMenu} />
          <div className="content">
            <div className="main">{route}</div>
            <RightBarLayout />
          </div>
          <FooterLayout />
        </div>
      );
    }
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
      </Switch>
    </BrowserRouter>
  </Provider>
);
render(<App />, document.getElementById("app"));
