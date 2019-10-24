import React, { Component } from "react";
import ManageUserProfile from "../page/partial/user/manage-user-profile";

import * as layoutActions from "../redux/actions/layout-actions";
import UserPopup from "../page/partial/popup/user-popup";
import FocusCard from "../component/focus-card";
import CompanyPage from "../page/company";

export default class TestLayout extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {}

  render() {
    document.setTitle("Test");

    // let authUser = {
    //   ID: 888,
    //   role: "student"
    // };
    // layoutActions.storeUpdateFocusCard("My Profile", UserPopup, {
    //   id: authUser.ID,
    //   role: authUser.role
    // });

    return (
      <div style={{ padding: "10px", background: "white" }}>
        <FocusCard></FocusCard>
        <CompanyPage id={12}></CompanyPage>
         {/* <ManageUserProfile isEdit={true} user_id={136}></ManageUserProfile> */}
      </div>
    );
  }
}
