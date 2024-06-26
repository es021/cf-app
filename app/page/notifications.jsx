import React, { Component } from "react";
import List from "../component/list";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { Time } from "../lib/time";
import { getAuthUser, getCF, getCFObj } from "../redux/actions/auth-actions";
import * as layoutAction from "../redux/actions/layout-actions";
import ProfileCard, { createImageElement, PCType } from "../component/profile-card.jsx";
import { NotificationsEnum, Prescreen, PrescreenEnum, CFSMeta } from "../../config/db-config";
import * as hallAction from "../redux/actions/hall-actions";
import { ActivitySingle } from "./partial/notifications/activity-single";
import { ImgConfig, AssetCustomUrl } from "../../config/app-config";
import { AnnouncementSingle } from "./partial/notifications/announcement-single";

// import { emitHallActivity } from "../socket/socket-client";
// import PropTypes from "prop-types";
// import { socketOn, emitLiveFeed } from "../socket/socket-client";
// import { BOTH } from "../../config/socket-config";

// require("../css/notification.scss");

export class NotificationFeed extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = getAuthUser();
    this.cf = getCF();
    this.loadData = this.loadData.bind(this);
    this.getDataFromRes = this.getDataFromRes.bind(this);
    this.addFeedToView = this.addFeedToView.bind(this);
    this.itemOnClick = this.itemOnClick.bind(this);
    this.listComponentDidUpdate = this.listComponentDidUpdate.bind(this);
    this.renderList = this.renderList.bind(this);
    this.offset = 10;

    this.COLOR_RED = "#ff5454";
    this.COLOR_BLUE = "rgb(0, 152, 225)";
    this.COLOR_PURPLE = "rgb(230 91 255)";
    this.COLOR_GREEN = "rgb(47 201 47)";
    this.COLOR_BLACK = "rgb(17, 6, 26)";

    this.rawData = {};

    this.state = {
      extraData: []
    };
    this.isInit = true;
  }

  componentDidMount() {
    // socketOn(BOTH.LIVE_FEED, data => {
    //   this.addFeedToView(data);
    // });
  }

  listComponentDidUpdate() {
    // if (this.scrollTo == "bottom") {
    //   //scroll to bottom
    //   this.dashBody.scrollTop = 99999999;
    //   //console.log("go bottom");
    // }
    // if (this.scrollTo == "top") {
    //   //scroll to top
    //   this.dashBody.scrollTop = 0;
    //   //console.log("go top");
    // }
    // //console.log(this.dashBody.scrollTop);
    // this.scrollTo == "";
  }

  // ##############################################################
  // function for list
  loadData(page, offset) {
    // TODO-notification
    var query = `query{
            notifications(user_id:${this.authUser.ID}, 
            user_role:"${getAuthUser().role}"
            cf:"${this.cf}", 
            page:${page}, offset:${offset}){
            ID is_read type param created_at img_obj{img_pos img_url img_size} }}`;
    // console.log("query",query)
    // console.log("query",query)
    // console.log("query",query)
    // console.log("query",query)
    return getAxiosGraphQLQuery(query);
  }

  getDataFromRes(res) {
    if (this.isInit) {
      this.scrollTo = "top";
      this.isInit = false;
    } else {
      this.scrollTo = "bottom";
    }
    return res.data.data.notifications;
  }

  // from socket trigger
  addFeedToView(d) {
    this.rawData[d.ID] = d;

    this.scrollTo = "top";
    var newData = this.renderList(d, 0, true);
    // add to view
    this.setState(prevState => {
      prevState.extraData.push(newData);

      return { extraData: prevState.extraData };
    });
  }

  updateIsRead(id) {
    let d = this.rawData[id];
    if (d.is_read == 1) {
      return;
    }
    var query = `mutation{
      edit_notification(ID:${id}, user_id:${getAuthUser().ID}, is_read:1)
      { ID is_read }
    }`;
    getAxiosGraphQLQuery(query).then(res => {
      this.rawData[id].is_read = 1;
      hallAction.storeLoadActivity(hallAction.ActivityType.NOTIFICATION_COUNT);
    });
  }

  getParamObj(d) {
    let param = d.param;
    try {
      param = JSON.parse(param);
    } catch (err) {
      param = null;
    }
    return param;
  }
  itemOnClick(e) {
    let id = e.currentTarget.dataset.id;
    this.updateIsRead(id);

    let d = this.rawData[id];
    let param = this.getParamObj(d);

    if (d.type == NotificationsEnum.TYPE_CREATE_PRIVATE_SESSION
      || d.type == NotificationsEnum.TYPE_STATUS_SESSION_UPDATE) {
      if (param !== null) {
        let preScreenId = param["ps_id"];
        layoutAction.storeUpdateFocusCard("Scheduled Call", ActivitySingle, {
          id: preScreenId,
          type: hallAction.ActivityType.PRESCREEN
        });
      }
    } else if (d.type == NotificationsEnum.TYPE_ANNOUNCEMENT_ORGANIZER) {
      let announcementId = param["announcement_id"];
      // todo - follow vacancy
      layoutAction.storeUpdateFocusCard("Announcement", AnnouncementSingle, {
        id: announcementId,
      });
    }
    // switch (d.type) {
    //   case NotificationsEnum.TYPE_CREATE_PRIVATE_SESSION:
    //     if (param !== null) {
    //       let preScreenId = param["ps_id"];
    //       layoutAction.storeUpdateFocusCard("Scheduled Call", ActivitySingle, {
    //         id: preScreenId,
    //         type: hallAction.ActivityType.PRESCREEN
    //       });
    //     }
    //     break;
    // }
  }
  getNotificationText(d) {
    let toRet = '';
    let param = this.getParamObj(d);

    switch (d.type) {
      case NotificationsEnum.TYPE_CREATE_PRIVATE_SESSION:
        if (param !== null) {
          toRet += `${param["company_name"]} <b>scheduled a new call</b> with you on <u>${Time.getString(
            param["unix_time"]
          )}</u> (your local time)`;
        }
        break;
      case NotificationsEnum.TYPE_STATUS_SESSION_UPDATE:
        if (param !== null) {
          toRet += `${param["company_name"]} has <b>${this.getStatusAttribute("text", param["status"])}</b> a call with you`;
          if (param["status"] == PrescreenEnum.STATUS_RESCHEDULE) {
            toRet += ` to <u>${Time.getString(
              param["unix_time"]
            )}</u> (your local time)`
          }
        }
        break;
      case NotificationsEnum.TYPE_ANNOUNCEMENT_ORGANIZER:
        if (param !== null) {
          toRet += `<b>Announcement</b> - ${param["title"]}`;
        }
        break;
    }

    return toRet;
  }

  getStatusAttribute(attr, status) {
    let icon, color, text;


    if (status == PrescreenEnum.STATUS_STARTED) {
      icon = "dot-circle-o";
      color = this.COLOR_BLUE;
      text = "started";
    } else if (status == PrescreenEnum.STATUS_CANCEL) {
      icon = "times";
      color = this.COLOR_RED;
      text = "canceled";
    } else if (status == PrescreenEnum.STATUS_ENDED) {
      icon = "times";
      color = this.COLOR_RED;
      text = "ended";
    } else if (status == PrescreenEnum.STATUS_RESCHEDULE) {
      icon = "calendar";
      color = this.COLOR_BLACK;
      text = "rescheduled";
    }


    if (attr == "icon") return icon;
    if (attr == "color") return color;
    if (attr == "text") return text;

    return "";

  }
  renderList(d, i, isExtraData = false) {
    this.rawData[d.ID] = d;

    var isNew = d.is_read != "1";

    let img = null;
    if (d.type == NotificationsEnum.TYPE_ANNOUNCEMENT_ORGANIZER) {
      let img_url;
      let cfObj = getCFObj();
      if (cfObj[CFSMeta.IMAGE_HEADER_ICON]) {
        img_url = AssetCustomUrl + cfObj[CFSMeta.IMAGE_HEADER_ICON]
      } else {
        img_url = ImgConfig.AppIcon;
      }
      img = <div className="profile-card">
        <div
          className="pc-picture"
          style={{
            backgroundImage: `url("${img_url}")`,
            backgroundSize: `contain`,
            backgroundPosition: `center`,
            height: `50px`,
            width: `50px`,
          }}
        />
      </div>;

    } else {
      img = createImageElement(
        d.img_obj.img_url,
        d.img_obj.img_pos,
        d.img_obj.img_size,
        "50px",
        "",
        PCType.COMPANY
      );
    }

    let icon = "";
    let iconColor = "";

    switch (d.type) {
      case NotificationsEnum.TYPE_ANNOUNCEMENT_ORGANIZER:
        icon = "bullhorn";
        iconColor = this.COLOR_PURPLE;
        break;
      case NotificationsEnum.TYPE_CREATE_PRIVATE_SESSION:
        icon = "video-camera";
        iconColor = this.COLOR_GREEN;
        break;
      case NotificationsEnum.TYPE_STATUS_SESSION_UPDATE:
        let param = this.getParamObj(d);
        icon = this.getStatusAttribute("icon", param["status"]);
        iconColor = this.getStatusAttribute("color", param["status"]);
        break;
      case NotificationsEnum.TYPE_REMIND_PRIVATE_SESSION:
        icon = "bell";
        iconColor = this.COLOR_BLUE;
        break;
      case NotificationsEnum.TYPE_REMIND_GROUP_SESSION:
        icon = "bell";
        iconColor = this.COLOR_BLUE;
        break;
    }

    var item = (
      <div
        onClick={this.itemOnClick}
        data-id={d.ID}
        className={`not_item ${isNew ? "item_new" : ""} `}
      >
        <div className="not_item_img">{img}</div>
        <div className="not_item_content">
          <p
            className="not_item_text"
            dangerouslySetInnerHTML={{ __html: this.getNotificationText(d) }}
          />
          <div className="not_item_subtext">
            <div className="not_item_icon" style={{ background: iconColor }}>
              <i className={`fa fa-${icon}`} />
            </div>
            <div className="not_item_time">{Time.getAgo(d.created_at)}</div>
          </div>
        </div>
      </div>
    );

    return item;
  }
  //<button onClick={() => this.addFeedToView({ ID: "a" })}>Add</button>

  render() {
    return (
      <div className="notification">
        <List
          type="append-bottom"
          appendText="Load Older Notification"
          listClass="not_body"
          componentDidUpdate={this.listComponentDidUpdate}
          listRef={v => (this.dashBody = v)}
          getDataFromRes={this.getDataFromRes}
          loadData={this.loadData}
          extraData={this.state.extraData}
          offset={this.offset}
          renderList={this.renderList}
        />
      </div>
    );
  }
}

NotificationFeed.propTypes = {};
