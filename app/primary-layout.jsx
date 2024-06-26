import React, { Component } from "react";
//import { render } from "react-dom";
// import {
//   BrowserRouter,
//   Route,
//   NavLink,
//   Switch,
//   Redirect
// } from "react-router-dom";
import { getAxiosGraphQLQuery, graphql, graphqlAttr } from "../helper/api-helper";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Loader } from "./component/loader";
import {
  isAuthorized,
  isComingSoon,
  setLocalStorageCf,
  isRoleRec,
  getCF_externalHomeUrl,
  isRedirectExternalHomeUrl,
  getCF,
  isRoleAdmin,
  getAuthUser,
  isRoleOrganizer,
  isRoleStudent,
  setLocalStorageCfDatapointConfig,
  getCFObj
} from "./redux/actions/auth-actions";

import { addLog } from "./redux/actions/other-actions";
import { LogEnum, CFSMetaObject, CFS, CFSMeta, CFSMetaDiscardLoad } from "../config/db-config";
import { IsRecruiterNewHall, RootPath } from "../config/app-config";

import * as Navigation from "./component/navigation.jsx";
import HeaderLayout from "./layout/header-layout.jsx";
import FooterLayout from "./layout/footer-layout";
import LeftBarLayout, { isHasLeftBar } from "./layout/left-bar-layout.jsx";
//singleton
import FocusCard from "./component/focus-card";
import { SupportChat } from "./page/support";
import BlockLoader from "./component/block-loader.jsx";
import { initSocket, socketOn } from "./socket/socket-client";
import { BOTH } from '../config/socket-config';

import * as hallAction from "./redux/actions/hall-actions";
import { setCurrentCfLocalStorage } from "./redux/reducer/auth-reducer";

import ValidationStudentCompletedProfile from "./component/validation-student-completed-profile";



//state is from redux reducer
// with multiple objects
function mapStateToProps(state, ownProps) {
  return {
    notification_count: state.hall.activity.notification_count,
    inbox_count: state.hall.activity.inbox_count,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

class PrimaryLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingCf: true,
      count_notification: 0
    };
  }

  componentWillMount() {
    initSocket();
    this.loadCf();
  }

  componentDidMount() {
    // takleh panggil ni store action kat dalam componentWillMount
    this.updateTheme();

    if (isRoleOrganizer() || isRoleAdmin() || !isAuthorized()) {
      return;
    }

    hallAction.storeLoadActivity(hallAction.ActivityType.NOTIFICATION_COUNT);
    hallAction.storeLoadActivity(hallAction.ActivityType.INBOX_COUNT);

    // pooling every 5 minutes
    setInterval(() => {
      console.log("reload notification count")
      hallAction.storeLoadActivity(hallAction.ActivityType.NOTIFICATION_COUNT);
    }, 5 * 60 * 1000)

    socketOn(BOTH.CHAT_MESSAGE, (data) => {
      hallAction.storeLoadActivity(hallAction.ActivityType.INBOX_COUNT);
    });

  }

  updateTheme() {
    let cfObj = getCFObj();
    var r = document.querySelector(':root');
    if (cfObj[CFSMeta.COLOR_THEME]) {
      r.style.setProperty('--theme-color', cfObj[CFSMeta.COLOR_THEME]);
    }
    if (cfObj[CFSMeta.COLOR_HEADER_BACKGROUND]) {
      r.style.setProperty('--header-bg-color', cfObj[CFSMeta.COLOR_HEADER_BACKGROUND]);
    }
    if (cfObj[CFSMeta.COLOR_HEADER_MAIN]) {
      r.style.setProperty('--header-main-color', cfObj[CFSMeta.COLOR_HEADER_MAIN]);
    }
    if (cfObj[CFSMeta.COLOR_HEADER_SUB]) {
      r.style.setProperty('--header-sub-color', cfObj[CFSMeta.COLOR_HEADER_SUB]);
    }
  }

  async loadCf() {
    let metas = {};
    for (let k in CFSMeta) {
      if (CFSMetaDiscardLoad.indexOf(CFSMeta[k]) <= -1) {
        metas[k] = CFSMeta[k]
      }
    }

    let resAll = await Promise.all([
      graphql(`query{cfs(is_load:1){${graphqlAttr(CFS, metas)}}}`),
      graphql(`query{cf(name:"${getCF()}"){datapoint_config}}`)
    ]);
    let res = resAll[0];
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
    setLocalStorageCf(cfs);

    let resDatapoint = resAll[1];
    try {
      resDatapoint = resDatapoint.data.data.cf.datapoint_config;
      setLocalStorageCfDatapointConfig(resDatapoint);
    } catch (err) { }

    this.setState(prevState => {
      return {
        loadingCf: false,
      };
    });
  }
  setPageId() {
    let url = location.href;
    if (url.indexOf("/app/") >= 0) {
      url = url.split("/app/");
    } else if (url.indexOf("/auth/") >= 0) {
      url = url.split("/auth/");
    }
    url = url[1].split("/");

    this.pageId = url[0];
    if (this.pageId.indexOf("?") >= 0) {
      this.pageId = this.pageId.split("?")[0];
    }
  }
  // componentWillMount(){
  //   this.setPageId();

  // }
  componentWillUpdate() {
    this.setPageId();
    // this.setState(() => {
    //   
    //   return { pageId: pageId };
    // })
  }

  getLeftBar(sideMenu) {
    if (!isHasLeftBar()) {
      return null;
    }

    return <LeftBarLayout menuList={sideMenu}></LeftBarLayout>
  }

  getClassName(isAuthorized) {
    let cf = getCF();
    let r = `primary-layout custom-theme cf-${cf}`;
    if (!isAuthorized) {
      r += " landing-page";
    } else {
      if (isHasLeftBar()) {
        r += " with-left-bar"
      }
    }

    // console.log(r)
    // console.log(r)
    // console.log(r)
    // console.log(r)
    // console.log(r)
    // console.log(r)
    // console.log(r)
    // console.log(r)
    // console.log(r)
    return r;
  }
  render() {

    if (isRoleStudent()) {
      // alert("hi")
    }

    // save current cf to local storage
    // resolve issue when auth.cf set to null after logout
    setCurrentCfLocalStorage(getCF());

    if (isRedirectExternalHomeUrl(this.props)) {
      window.location = getCF_externalHomeUrl();
      return null;
    }

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
    var headerMenu = Navigation.getBar(path, {
      COMING_SOON: COMING_SOON,
      isHeader: true,
      count_notification: this.props.notification_count,
      count_inbox: this.props.inbox_count
    });

    var route = Navigation.getRoute(path, COMING_SOON);




    if (!isAuthorized()) {
      return (
        <div className={this.getClassName(false)}>
          <BlockLoader />
          <HeaderLayout {...this.props} menuList={headerMenu} />
          <div className="content content-landing-page">
            <div id={this.pageId} className="main">
              {route}
            </div>
          </div>
          <FooterLayout {...this.props} />
        </div>
      );
    } else {
      let sideMenu = Navigation.getBar(path, {
        COMING_SOON: COMING_SOON,
        isHeader: false,
        count_notification: this.props.notification_count,
        count_inbox: this.props.inbox_count
      });

      return (
        <div className={this.getClassName(true)}>
          <FocusCard />
          <SupportChat />
          <BlockLoader />
          <HeaderLayout {...this.props} sideMenuList={sideMenu} menuList={headerMenu} />
          <ValidationStudentCompletedProfile />
          {this.getLeftBar(sideMenu)}
          <div className="content">
            <div id={this.pageId} className="main">{route}</div>
            {/* <RightBarLayout /> */}
          </div>
          <FooterLayout {...this.props} />
        </div>
      );
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrimaryLayout);
