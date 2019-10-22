import React, { Component } from "react";
import ManageUserProfile from "../page/partial/user/manage-user-profile";

export default class TestLayout extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {}

  render() {
    document.setTitle("Test");
    return (
      <div style={{ padding: "10px", background: "white" }}>
        <ManageUserProfile isEdit={true} user_id={136}></ManageUserProfile>
      </div>
    );
  }
}
