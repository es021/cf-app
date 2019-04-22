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

export class HallGallery extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = getAuthUser();

    let testData = [
      {
        title: "Test Image 1",
        type: "image",
        src: "http://localhost:4000/asset/image/banner/EUR.jpg"
      },
      {
        title: "Test Image 2",
        type: "image",
        src: "http://localhost:4000/asset/image/banner/EUR.jpg"
      },
      {
        title: "Test Image 3",
        type: "image",
        src: "http://localhost:4000/asset/image/banner/EUR.jpg"
      },
      {
        title: "Test Image 4",
        type: "image",
        src: "http://localhost:4000/asset/image/banner/EUR.jpg"
      },
      {
        title: "Test Image 5",
        type: "image",
        src: "http://localhost:4000/asset/image/banner/EUR.jpg"
      }
    ];

    this.state = {
      data: testData,
      currentIndex: 0
    };
  }
  nextOnClick() {
    this.setState(prevState => {
      let newIndex = prevState.currentIndex + 1;
      if (newIndex >= prevState.data.length) {
        newIndex = 0;
      }
      console.log("newIndex", newIndex);
      return { currentIndex: newIndex };
    });
  }
  prevOnClick() {
    this.setState(prevState => {
      let newIndex = prevState.currentIndex - 1;
      if (newIndex < 0) {
        newIndex = prevState.data.length - 1;
      }
      return { currentIndex: newIndex };
    });
  }
  componentWillMount() {
    // setInterval(() => {
    //   this.nextOnClick();
    // }, 1000);
  }
  getAllItem() {
    // to change if ada CR count
    let data = [];
    data.push(this.getItemByOffset(-2));
    data.push(this.getItemByOffset(-1));
    data.push(this.getItemByOffset(0));
    data.push(this.getItemByOffset(1));
    data.push(this.getItemByOffset(2));
    return data;
  }
  getItemClassName(i) {
    // to change if ada CR count
    let toRet = "";
    switch (i) {
      case 0:
        toRet = "left-2";
        break;
      case 1:
        toRet = "left-1";
        break;
      case 2:
        toRet = "center";
        break;
      case 3:
        toRet = "right-1";
        break;
      case 4:
        toRet = "right-2";
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

  getItemByOffset(offset) {
    if (offset == 0) {
      return this.state.data[this.state.currentIndex];
    }

    let offsetIndex = this.state.currentIndex + offset;
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
    let allItem = this.getAllItem();
    let itemViews = allItem.map((d, i) => {
      return this.createItemView(d, i);
    });

    let items = <div className="hg-item container">{itemViews}</div>;

    return <div className="hall-gallery">{items}</div>;
  }
}

HallGallery.propTypes = {};
