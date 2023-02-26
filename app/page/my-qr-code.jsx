import React, { Component } from "react";
import List from "../component/list";
import { getAxiosGraphQLQuery, postRequest } from "../../helper/api-helper";
import { Time } from "../lib/time";
import { getCF, getCFObj, getCompanyId, getUserId, isRoleRec, isRoleStudent } from "../redux/actions/auth-actions";
import * as layoutAction from "../redux/actions/layout-actions";
import ProfileCard, { createImageElement, PCType } from "../component/profile-card.jsx";
import { NotificationsEnum, Prescreen, PrescreenEnum, CFSMeta } from "../../config/db-config";
import * as hallAction from "../redux/actions/hall-actions";
import { ActivitySingle } from "./partial/notifications/activity-single";
import { ImgConfig, AssetCustomUrl, SiteUrl, UploadUrl } from "../../config/app-config";
import { AnnouncementSingle } from "./partial/notifications/announcement-single";
import { Loader } from "../component/loader";
import PropTypes from "prop-types";

// import { emitHallActivity } from "../socket/socket-client";
// import PropTypes from "prop-types";
// import { socketOn, emitLiveFeed } from "../socket/socket-client";
// import { BOTH } from "../../config/socket-config";

// require("../css/notification.scss");

export class MyQrCode extends React.Component {
  constructor(props) {
    super(props);
    this.cf = getCF();
    this.state = {
      data: null,
      loading: true
    };
  }

  componentDidMount() {
    let param = { cf: this.cf };
    let url = ""
    if (this.props.user_id) {
      url = "/qr/create-for-user"
      param["user_id"] = this.props.user_id;
    }
    if (this.props.company_id) {
      url = "/qr/create-for-company"
      param["company_id"] = this.props.company_id;
    }
    if (this.props.event_id) {
      url = "/qr/create-for-event"
      param["event_id"] = this.props.event_id;
    }
    postRequest(SiteUrl + url, param).then(res => {
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
      v = <div className={this.props.event_id ? 'pt-6' : ''} style={{ padding: this.props.user_id ? '40px 0px' : '' }}>
        <img src={UploadUrl + "/" + this.state.data.url} height="300px" className="rounded-3xl" />

        <div className={`${this.props.user_id || this.props.event_id ? 'pt-6' : 'pt-2 pb-3'} px-10`}>
          <a href={UploadUrl + "/" + this.state.data.url} target="_blank" download>
            <button className="btn btn-lg btn-round-10 btn-green btn-bold">
              Download
            </button>
          </a>

          <br></br>
          {this.props.user_id
            ? <div className="text-left pt-10 text-gray-500">
              ** Show this QR code to check in at the physical event. **
                <br></br>
                ** You can also let the exhibitors scan your QR code to share your profile and resume with them. **
              </div>
            : null
          }
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


MyQrCode.propTypes = {
  company_id: PropTypes.number,
  event_id: PropTypes.number,
  user_id: PropTypes.number,
};
