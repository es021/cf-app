import React, { Component } from "react";
import List from "../component/list";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { Time } from "../lib/time";
import { getAuthUser, getCF } from "../redux/actions/auth-actions";
import * as layoutAction from "../redux/actions/layout-actions";
import { createImageElement, PCType } from "../component/profile-card.jsx";
import { NotificationsEnum, Prescreen } from "../../config/db-config";
import * as hallAction from "../redux/actions/hall-actions";
import { ActivitySingle } from "./partial/notifications/activity-single";

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
    var query = `query{
            notifications(user_id:${this.authUser.ID}, 
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
      edit_notification(ID:${id}, is_read:1)
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
    switch (d.type) {
      case NotificationsEnum.TYPE_CREATE_PRIVATE_SESSION:
        if (param !== null) {
          let preScreenId = param["ps_id"];
          layoutAction.storeUpdateFocusCard("Scheduled Call", ActivitySingle, {
            id: preScreenId,
            type: hallAction.ActivityType.PRESCREEN
          });
        }
        break;
    }
  }
  getNotificationText(d) {
    let toRet = '';
    let param = this.getParamObj(d);

    switch (d.type) {
      case NotificationsEnum.TYPE_CREATE_PRIVATE_SESSION:
        if (param !== null) {
          toRet += `${param["company_name"]} scheduled a call with you on <u>${Time.getString(
            param["unix_time"]
          )}</u> (your local time)`;
        }
        break;
    }

    return toRet;
  }

  renderList(d, i, isExtraData = false) {
    this.rawData[d.ID] = d;

    var isNew = d.is_read != "1";

    let img = createImageElement(
      d.img_obj.img_url,
      d.img_obj.img_pos,
      d.img_obj.img_size,
      "50px",
      "",
      PCType.COMPANY
    );

    let icon = "";
    let iconColor = "";
    let blueColor = "#337ab7";
    let greenColor = "#449d44";

    switch (d.type) {
      case NotificationsEnum.TYPE_CREATE_PRIVATE_SESSION:
        icon = "video-camera";
        iconColor = greenColor;
        break;
      case NotificationsEnum.TYPE_REMIND_PRIVATE_SESSION:
        icon = "bell";
        iconColor = blueColor;
        break;
      case NotificationsEnum.TYPE_REMIND_GROUP_SESSION:
        icon = "bell";
        iconColor = blueColor;
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
