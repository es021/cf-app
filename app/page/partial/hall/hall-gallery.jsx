import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { Loader } from "../../../component/loader";
import { GeneralForm } from "../../../component/general-form";
import ProfileCard from "../../../component/profile-card";
import { ButtonLink } from "../../../component/buttons";
import { ProfileListItem } from "../../../component/list";
import { RootPath, IsGruveoEnable } from "../../../../config/app-config";
import { NavLink } from "react-router-dom";
import { getAuthUser } from "../../../redux/actions/auth-actions";
import { ActivityAPIErr } from "../../../../server/api/activity-api";
import {
  emitQueueStatus,
  emitHallActivity
} from "../../../socket/socket-client";
import Form, { toggleSubmit } from "../../../component/form";
import { createIconList } from "../../../component/list";
import * as activityActions from "../../../redux/actions/activity-actions";
import { createUserTitle2Line } from "../../users";
import { openSIAddForm, isNormalSI } from "../activity/scheduled-interview";
import Tooltip from "../../../component/tooltip";
import * as layoutActions from "../../../redux/actions/layout-actions";
import { Time } from "../../../lib/time";
import { getAxiosGraphQLQuery } from "../../../../helper/api-helper";
import AvailabilityView from "../../availability";

import obj2arg from "graphql-obj2arg";
import * as hallAction from "../../../redux/actions/hall-actions";
import React from "react";
import { getYoutubeIframe } from "../../../component/gallery";
import { HallGallery, HallGalleryEnum } from "../../../../config/db-config";

require("../../../css/hall-gallery.scss");
// remove limit join

const LIMIT = 5;
const LEFT_2 = "left-2";
const LEFT_1 = "left-1";
const CENTER = "center";
const RIGHT_1 = "right-1";
const RIGHT_2 = "right-2";
const CLASS_ARR = [LEFT_2, LEFT_1, CENTER, RIGHT_1, RIGHT_2];

export class HallGalleryView extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = getAuthUser();

    let defaultItems = [
      {
        ID: "1",
        title: "Test Video 1",
        type: HallGalleryEnum.TYPE_VIDEO,
        // img_url: "http://localhost:4000/asset/image/banner/EUR.jpg",
        // img_pos: "center center",
        // img_size: "cover",
        video_url: "https://youtu.be/RNMTDv-w9MU"
      },
      {
        ID: "2",
        title: "Test Image 2",
        type: "image",
        img_url: "http://localhost:4000/asset/image/banner/EUR.jpg",
        img_pos: "center center",
        img_size: "cover"
      },
      {
        ID: "3",
        title: "Test Image 3",
        type: "image",
        img_url: "http://localhost:4000/asset/image/banner/EUR.jpg",
        img_pos: "center center",
        img_size: "cover"
      },
      {
        ID: "4",
        title: "Test Image 4",
        type: "image",
        img_url: "http://localhost:4000/asset/image/banner/EUR.jpg",
        img_pos: "center center",
        img_size: "cover"
      },
      {
        ID: "5",
        title: "Test Image 5",
        type: "image",
        img_url: "http://localhost:4000/asset/image/banner/EUR.jpg",
        img_pos: "center center",
        img_size: "cover"
      }
    ];

    this.state = {
      data: defaultItems,
      loading: true
    };
  }
  componentWillMount() {
    // initialize all this
    // debug
    // this.currentIndex = 0;
    // this.items = this.getAllItem();
    // this.itemViews = this.items.map((d, i) => {
    //   return this.createItemView(d, i);
    // });
    // this.setState(prevState => {
    //   return { loading: false };
    // });
    // return;

    // load data
    let q = `query{
      hall_galleries(cf :"EUR", is_active: 1, page:1, offset:5) {
        ID
        item_order
        is_active
        title
        description
        type
        img_url
        img_size
        img_pos
        video_url
      }
    }`;

    getAxiosGraphQLQuery(q).then(res => {
      this.setState(prevState => {
        let hg = res.data.data.hall_galleries;
        return { loading: false, data: hg };
      });
    });
  }

  nextOnClick() {
    let nextMap = {};
    nextMap[CENTER] = LEFT_1;
    nextMap[RIGHT_1] = CENTER;
    nextMap[RIGHT_2] = RIGHT_1;
    nextMap[LEFT_1] = LEFT_2;
    nextMap[LEFT_2] = RIGHT_2;

    let parent = document.getElementById("hall-gallery");

    let elObj = {};

    for (var i in CLASS_ARR) {
      let currentClass = CLASS_ARR[i];
      let el = parent.getElementsByClassName(CLASS_ARR[i]);
      el = el[0];

      elObj[currentClass] = el;
    }

    for (var currentClass in elObj) {
      let el = elObj[currentClass];
      let changeClass = nextMap[currentClass];
      // console.log("el", el);
      // console.log("el.className", el.className);
      // console.log("currentClass", currentClass);
      // console.log("changeClass", changeClass);
      el.className = el.className.replaceAll(currentClass, changeClass);
    }
  }
  prevOnClick() {
    let prevMap = {};
    prevMap[CENTER] = RIGHT_1;
    prevMap[RIGHT_1] = RIGHT_2;
    prevMap[RIGHT_2] = LEFT_2;
    prevMap[LEFT_1] = CENTER;
    prevMap[LEFT_2] = LEFT_1;

    let parent = document.getElementById("hall-gallery");

    let elObj = {};

    for (var i in CLASS_ARR) {
      let currentClass = CLASS_ARR[i];
      let el = parent.getElementsByClassName(CLASS_ARR[i]);
      el = el[0];

      elObj[currentClass] = el;
    }

    for (var currentClass in elObj) {
      let el = elObj[currentClass];
      let changeClass = prevMap[currentClass];
      // console.log("el", el);
      // console.log("el.className", el.className);
      // console.log("currentClass", currentClass);
      // console.log("changeClass", changeClass);
      el.className = el.className.replaceAll(currentClass, changeClass);
    }
  }

  getAllItem() {
    // to change if ada CR count
    let data = [];
    data.push(this.getItemByOffset(-2, this.currentIndex));
    data.push(this.getItemByOffset(-1, this.currentIndex));
    data.push(this.getItemByOffset(0, this.currentIndex));
    data.push(this.getItemByOffset(1, this.currentIndex));
    data.push(this.getItemByOffset(2, this.currentIndex));
    return data;
  }
  getItemClassName(i) {
    // to change if ada CR count
    let toRet = "";
    switch (i) {
      case 0:
        toRet = LEFT_2;
        break;
      case 1:
        toRet = LEFT_1;
        break;
      case 2:
        toRet = CENTER;
        break;
      case 3:
        toRet = RIGHT_1;
        break;
      case 4:
        toRet = RIGHT_2;
        break;
    }

    return toRet;
  }

  createItemView(d, i) {
    let className = this.getItemClassName(i);
    className = `hg-item ${className}`;

    let classNameTitle = "hg-item-title";
    let id = `hg-item-id-${d.ID}`;

    const onClick = e => {
      let curClass = e.currentTarget.className;
      // console.log(curClass);
      // console.log(id);
      if (curClass.indexOf(CENTER) >= 0) {
        return;
      } else if (curClass.indexOf(LEFT_2) >= 0) {
        this.prevOnClick();
        this.prevOnClick();
      } else if (curClass.indexOf(LEFT_1) >= 0) {
        this.prevOnClick();
      } else if (curClass.indexOf(RIGHT_1) >= 0) {
        this.nextOnClick();
      } else if (curClass.indexOf(RIGHT_2) >= 0) {
        this.nextOnClick();
        this.nextOnClick();
      }
    };

    // #######################################
    // start create view
    if (d.type == HallGalleryEnum.TYPE_IMAGE) {
      let imgStyle = {
        backgroundImage: `url('${d.img_url}')`,
        backgroundPosition: d.img_pos,
        backgroundSize: d.img_size
      };
      return (
        <div
          id={id}
          onClick={e => {
            onClick(e);
          }}
          className={className}
          style={imgStyle}
        >
          <div className={classNameTitle}>
            {d.title}
            <br />
            <small>{d.description}</small>
          </div>
        </div>
      );
    } else if (d.type == HallGalleryEnum.TYPE_VIDEO) {
      return (
        <div
          id={id}
          onClick={e => {
            onClick(e);
          }}
          className={className}
        >
          {getYoutubeIframe(d.video_url)}
        </div>
      );
    }
  }

  getItemByOffset(offset, currentIndex) {
    if (offset == 0) {
      return this.state.data[currentIndex];
    }

    let offsetIndex = currentIndex + offset;
    let realIndex = null;
    if (offsetIndex >= 0 && offsetIndex < this.state.data.length) {
      realIndex = offsetIndex;
    } else if (offsetIndex >= this.state.data.length) {
      realIndex = this.state.data.length - offsetIndex;
      realIndex = Math.abs(realIndex);
    } else {
      realIndex = this.state.data.length + offsetIndex;
    }

    // console.log("offset", offset);
    // console.log("offsetIndex", offsetIndex);
    // console.log("realIndex", realIndex);

    if (realIndex != null) {
      return this.state.data[realIndex];
    } else {
      return {};
    }
  }

  render() {
    let v = null;
    if (this.state.loading) {
      v = <Loader text="Loading Gallery..." size="3" />;
    } else {
      this.currentIndex = 0;
      this.items = this.getAllItem();
      this.itemViews = this.items.map((d, i) => {
        return this.createItemView(d, i);
      });

      let leftArrow = (
        <div
          className="hg-arrow left-arrow"
          onClick={() => {
            this.prevOnClick();
          }}
        >
          <i className="fa fa-angle-left" />
        </div>
      );

      let rightArrow = (
        <div
          className="hg-arrow right-arrow"
          onClick={() => {
            this.nextOnClick();
          }}
        >
          <i className="fa fa-angle-right" />
        </div>
      );

      v = (
        <div className="hg-item hg-container">
          {leftArrow}
          {this.itemViews}
          {rightArrow}
        </div>
      );
    }

    return (
      <div id="hall-gallery" className="hall-gallery">
        {v}
      </div>
    );
  }
}

HallGallery.propTypes = {};
