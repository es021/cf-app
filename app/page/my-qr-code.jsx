import React, { Component } from "react";
import List from "../component/list";
import { getAxiosGraphQLQuery, postRequest } from "../../helper/api-helper";
import { Time } from "../lib/time";
import { getAuthUser, getCF, getCFObj } from "../redux/actions/auth-actions";
import * as layoutAction from "../redux/actions/layout-actions";
import ProfileCard, { createImageElement, PCType } from "../component/profile-card.jsx";
import { NotificationsEnum, Prescreen, PrescreenEnum, CFSMeta } from "../../config/db-config";
import * as hallAction from "../redux/actions/hall-actions";
import { ActivitySingle } from "./partial/notifications/activity-single";
import { ImgConfig, AssetCustomUrl, SiteUrl, UploadUrl } from "../../config/app-config";
import { AnnouncementSingle } from "./partial/notifications/announcement-single";
import { Loader } from "../component/loader";

// import { emitHallActivity } from "../socket/socket-client";
// import PropTypes from "prop-types";
// import { socketOn, emitLiveFeed } from "../socket/socket-client";
// import { BOTH } from "../../config/socket-config";

// require("../css/notification.scss");

export class MyQrCode extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = getAuthUser();
    this.cf = getCF();
    this.state = {
      data: null,
      loading: true
    };
  }

  componentDidMount() {
    postRequest(SiteUrl + "/qr/create-for-check-in",
      { user_id: this.authUser.ID, cf: this.cf }
    ).then(res => {
      console.log("ReS", res);
      this.setState({ data: res.data, loading: false, });
    }).catch(err => {
      this.setState({ error: err.toString(), loading: false, });
    })
  }

  download() {
    var link = document.createElement("a");
    // If you don't know the name or want to use
    // the webserver default set name = ''
    link.setAttribute('download', "My QR Code.png");
    link.href = UploadUrl + "/" + this.state.data.url;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  render() {
    let v = null;
    if (this.state.loading) {
      v = <Loader />
    } else {
      v = <div style={{ padding: '40px 0px' }}>
        <img src={UploadUrl + "/" + this.state.data.url} height="300px" />
        <div>
          <br></br>
          Show this QR code when you arrived at the physical event.
          <br></br>
          <br></br>
          <a href={UploadUrl + "/" + this.state.data.url} target="_blank" download>
            <button className="btn btn-lg btn-round-10 btn-green btn-bold">
              Download
            </button>
          </a>
          <br></br>
        </div>
      </div>
    }
    return (
      <div>
        {v}
      </div>
    );
  }
}

MyQrCode.propTypes = {};
