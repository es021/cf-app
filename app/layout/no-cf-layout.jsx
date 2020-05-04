import React, { Component } from "react";
import * as Navigation from "../component/navigation.jsx";
import { Redirect } from "react-router";
import { RootPath } from "../../config/app-config";

// import { emitProgess, socketOn } from "../socket/socket-client";
// import { BOTH } from "../../config/socket-config";

export default class NoCfLayout extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    // setInterval(() => {
    //   emitProgess({ stuffFromClient: true });
    // }, 2000);

    // socketOn(BOTH.PROGRESS, data => {
    //   console.log("from socket server", data);
    // });
  }
  isRedirectToChooseCf(){
    let NO_REDIRECT = ["activate-account", "choose-cf"];
    let pathname = this.props.location.pathname;

    for(var i in NO_REDIRECT){
      if(pathname.indexOf(NO_REDIRECT[i]) >= 0){
        return false;
      }
    }

    return true;
  }
  render() {
    document.setTitle("nocf");
    if(this.isRedirectToChooseCf()){
      return <Redirect to={`${RootPath}/nocf/choose-cf`}></Redirect>
    }
    var path = this.props.match.path;
    let isNoCf = true;
    var route = Navigation.getRoute(path, false, isNoCf);
    return (
      <div style={{ padding: "10px", background: "white" }}>
        {route}
      </div>
    );
  }
}
