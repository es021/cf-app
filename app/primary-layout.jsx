import React, { Component } from "react";
//import { render } from "react-dom";
import {
  BrowserRouter,
  Route,
  NavLink,
  Switch,
  Redirect
} from "react-router-dom";
import { getAxiosGraphQLQuery } from "../helper/api-helper";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Loader } from "./component/loader";
import {
  isAuthorized,
  isComingSoon,
  setLocalStorageCf
} from "./redux/actions/auth-actions";

import { addLog } from "./redux/actions/other-actions";
import { LogEnum, CFSMetaObject } from "../config/db-config";

import * as Navigation from "./component/navigation.jsx";
import HeaderLayout from "./layout/header-layout.jsx";
import FooterLayout from "./layout/footer-layout";
import LeftBarLayout from "./layout/left-bar-layout.jsx";
import RightBarLayout from "./layout/right-bar-layout.jsx";

//singleton
import FocusCard from "./component/focus-card";
import { SupportChat } from "./page/support";
import BlockLoader from "./component/block-loader.jsx";
import { initSocket, socketOn } from "./socket/socket-client";
import { BOTH } from '../config/socket-config';



import * as hallAction from "./redux/actions/hall-actions";

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

  componentDidMount(){
    // takleh panggil ni store action kat dalam componentWillMount
    hallAction.storeLoadActivity(hallAction.ActivityType.NOTIFICATION_COUNT);
    hallAction.storeLoadActivity(hallAction.ActivityType.INBOX_COUNT);

    socketOn(BOTH.CHAT_MESSAGE, (data) => {
      hallAction.storeLoadActivity(hallAction.ActivityType.INBOX_COUNT);
    });

  }

  loadCf() {
    var query = `query{cfs(is_load:1){
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
    logo_height_hall
		logo_width_hall
		logo_margin_hall
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
    var headerMenu = Navigation.getBar(path, {
      COMING_SOON: COMING_SOON,
      isHeader: true,
      count_notification: this.props.notification_count,
      count_inbox: this.props.inbox_count
    });
    // var sideMenu = Navigation.getBar(path, {
    //   COMING_SOON: COMING_SOON,
    //   isHeader: false,
    //   count_notification: this.props.notification_count
    // });
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
          {/* <LeftBarLayout menuList={sideMenu} /> */}
          <div className="content">
            <div className="main">{route}</div>
            {/* <RightBarLayout /> */}
          </div>
          <FooterLayout />
        </div>
      );
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrimaryLayout);
