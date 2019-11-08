import React, { Component } from "react";
import ManageUserProfile from "../page/partial/user/manage-user-profile";

import * as layoutActions from "../redux/actions/layout-actions";
import UserPopup from "../page/partial/popup/user-popup";
import FocusCard from "../component/focus-card";
import UploaderVideo from "../component/uploader-video";
import CompanyPage from "../page/company";
import { VideoEnum } from "../../config/db-config";

// import { emitProgess, socketOn } from "../socket/socket-client";
// import { BOTH } from "../../config/socket-config";

export default class TestLayout extends React.Component {
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
        {/* <iframe width="800" height="450" 
src="https://www.dropbox.com/s/hv1df307tsqwhe5/user_137_resume_1573119937714.mp4?raw=1&autoplay=0" 
frameborder="0" allowfullscreen></iframe> */}

        {/* <video width="320" height="240" controls>
    <source src="https://www.dropbox.com/s/hv1df307tsqwhe5/user_137_resume_1573119937714.mp4?raw=1" type="video/mp4" />
</video> */}

        <UploaderVideo
          entity={"user"}
          entity_id={137}
          meta_key={VideoEnum.RESUME}
        ></UploaderVideo>
        {/* <FocusCard></FocusCard>
        {/* <CompanyPage id={12}></CompanyPage> */}
        {/* <ManageUserProfile isEdit={true} user_id={137}></ManageUserProfile> */}
      </div>
    );
  }
}
