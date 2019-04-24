//Faizul Here

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { Loader } from "../../../component/loader";
import { GeneralForm } from "../../../component/general-form";
import ProfileCard from "../../../component/profile-card";
import {
  CompanyEnum,
  UserEnum,
  PrescreenEnum,
  SessionRequestEnum,
  GroupSession,
  GroupSessionJoin
} from "../../../../config/db-config";
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
import * as hallAction from "../../../redux/actions/hall-actions";
import { createUserTitle2Line } from "../../users";

import { openSIAddForm, isNormalSI } from "../activity/scheduled-interview";
import Tooltip from "../../../component/tooltip";

import * as layoutActions from "../../../redux/actions/layout-actions";
import { Time } from "../../../lib/time";
import { getAxiosGraphQLQuery } from "../../../../helper/api-helper";
import AvailabilityView from "../../availability";
import obj2arg from "graphql-obj2arg";

require("../../../css/hall-gallery.scss");
// remove limit join

const LIMIT = 5;
const LEFT_2 = "left-2";
const LEFT_1 = "left-1";
const CENTER = "center";
const RIGHT_1 = "right-1";
const RIGHT_2 = "right-2";
const CLASS_ARR = [LEFT_2, LEFT_1, CENTER, RIGHT_1, RIGHT_2];

export class HallGallery extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = getAuthUser();

    let defaultItems = [
      {
        ID: "1",
        title: "Test Image 1",
        type: "image",
        src: "http://localhost:4000/asset/image/banner/EUR.jpg"
      },
      {
        ID: "2",
        title: "Test Image 2",
        type: "image",
        src: "http://localhost:4000/asset/image/banner/EUR.jpg"
      },
      {
        ID: "3",
        title: "Test Image 3",
        type: "image",
        src: "http://localhost:4000/asset/image/banner/EUR.jpg"
      },
      {
        ID: "4",
        title: "Test Image 4",
        type: "image",
        src: "http://localhost:4000/asset/image/banner/EUR.jpg"
      },
      {
        ID: "5",
        title: "Test Image 5",
        type: "image",
        src: "http://localhost:4000/asset/image/banner/EUR.jpg"
      }
    ];

    this.state = {
      data: defaultItems
    };
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
      console.log("el", el);
      console.log("el.className", el.className);
      console.log("currentClass", currentClass);
      console.log("changeClass", changeClass);
      el.className = el.className.replaceAll(currentClass, changeClass);
    }

    console.log(document.getElementsByClassName("hg-item"));

    // console.log(el);
    // console.log(el.className);

    // return;
    // this.setState(prevState => {
    //   let newIndex = prevState.currentIndex + 1;
    //   if (newIndex >= prevState.data.length) {
    //     newIndex = 0;
    //   }
    //   console.log("newIndex", newIndex);
    //   return { currentIndex: newIndex };
    // });
  }
  prevOnClick() {
    // this.setState(prevState => {
    //   let newIndex = prevState.currentIndex - 1;
    //   if (newIndex < 0) {
    //     newIndex = prevState.data.length - 1;
    //   }
    //   return { currentIndex: newIndex };
    // });
  }
  componentWillMount() {
    // initialize all this
    this.currentIndex = 0;
    this.items = this.getAllItem();
    this.itemViews = this.items.map((d, i) => {
      return this.createItemView(d, i);
    });

    // setInterval(() => {
    //   this.nextOnClick();
    // }, 1000);
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

  createItemView(d, i, children = null) {
    let className = this.getItemClassName(i);
    return (
      <div className={`hg-item ${className}`}>
        {d.title} - {className}
        {children}
      </div>
    );
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

    console.log("offset", offset);
    console.log("offsetIndex", offsetIndex);
    console.log("realIndex", realIndex);

    if (realIndex != null) {
      return this.state.data[realIndex];
    } else {
      return {};
    }
  }

  render() {
    let items = <div className="hg-item container">{this.itemViews}</div>;

    return (
      <div id="hall-gallery" className="hall-gallery">
        {items}
        <button
          onClick={() => {
            this.prevOnClick();
          }}
        >
          Prev
        </button>
        <button
          onClick={() => {
            this.nextOnClick();
          }}
        >
          Next
        </button>
      </div>
    );
  }
}

HallGallery.propTypes = {};
