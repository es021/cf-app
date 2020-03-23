import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { Loader } from "../../../component/loader";
import ProfileCard from "../../../component/profile-card.jsx";
import { ButtonLink } from "../../../component/buttons.jsx";
import { ProfileListItem } from "../../../component/list";
import { RootPath, IsGruveoEnable } from "../../../../config/app-config";
import { NavLink } from "react-router-dom";
import { getAuthUser, getCF } from "../../../redux/actions/auth-actions";
import { ActivityAPIErr } from "../../../../server/api/activity-api";
import Form, {
  toggleSubmit,
  getDataCareerFair,
  isValueEmpty
} from "../../../component/form";
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
import GeneralFormPage from "../../../component/general-form";
import {
  setBodyFullWidth,
  unsetBodyFullWidth
} from "../../../../helper/general-helper";

// require("../../../css/hall-gallery.scss");
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
      hall_galleries(cf :"${getCF()}", is_active: 1, page:1, offset:5) {
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

  getNextMap() {
    let nextMap = {};
    if (this.total() <= 3) {
      nextMap[CENTER] = LEFT_1;
      nextMap[RIGHT_1] = CENTER;
      nextMap[LEFT_1] = RIGHT_1;
    } else {
      nextMap[CENTER] = LEFT_1;
      nextMap[RIGHT_1] = CENTER;
      nextMap[RIGHT_2] = RIGHT_1;
      nextMap[LEFT_1] = LEFT_2;
      nextMap[LEFT_2] = RIGHT_2;
    }
    return nextMap;
  }

  nextOnClick() {
    let nextMap = this.getNextMap();
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
      if (!el) {
        continue;
      }
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

  total() {
    return this.state.data.length;
  }

  getAllItem() {
    // to change if ada CR count
    let data = [];
    if (this.total() <= 1) {
      data.push(this.getItemByOffset(null, this.currentIndex));
      data.push(this.getItemByOffset(null, this.currentIndex));
      data.push(this.getItemByOffset(0, this.currentIndex));
      data.push(this.getItemByOffset(null, this.currentIndex));
      data.push(this.getItemByOffset(null, this.currentIndex));
    } else if (this.total() <= 3) {
      data.push(this.getItemByOffset(null, this.currentIndex));
      data.push(this.getItemByOffset(-1, this.currentIndex));
      data.push(this.getItemByOffset(0, this.currentIndex));
      data.push(this.getItemByOffset(1, this.currentIndex));
      data.push(this.getItemByOffset(null, this.currentIndex));
    } else {
      data.push(this.getItemByOffset(-2, this.currentIndex));
      data.push(this.getItemByOffset(-1, this.currentIndex));
      data.push(this.getItemByOffset(0, this.currentIndex));
      data.push(this.getItemByOffset(1, this.currentIndex));
      data.push(this.getItemByOffset(2, this.currentIndex));
    }

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
    if (!d) {
      return null;
    }
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
        backgroundSize: d.img_size,
        backgroundRepeat: "no-repeat"
      };

      let titleDesc = d.title || d.description ?
        <div className={classNameTitle}>
          {!d.title ? null : <span>
            {d.title}
            <br />
          </span>}
          <small>{d.description}</small>
        </div>
        : null

      return (
        <div
          id={id}
          onClick={e => {
            onClick(e);
          }}
          className={className}
          style={imgStyle}
        >
          {titleDesc}
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
    // console.log("offsetIndex", offsetIndex)
    if (offsetIndex >= 0 && offsetIndex < this.state.data.length) {
      realIndex = offsetIndex;
    } else if (offsetIndex >= this.state.data.length) {
      realIndex = this.state.data.length - offsetIndex;
      realIndex = Math.abs(realIndex);
    } else {
      realIndex = this.state.data.length + offsetIndex;
    }

    if (realIndex == currentIndex) {
      // jangan kluarkan
      realIndex = null
    }

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
      if (this.state.data.length <= 0) {
        return null;
      }
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
          {this.total() <= 1 ? null : leftArrow}
          {this.itemViews}
          {this.total() <= 1 ? null : rightArrow}
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

// #########################################################################################################
// #########################################################################################################

export class ManageHallGallery extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = getAuthUser();
    this.cf = getCF();
  }

  componentWillUnmount() {
    unsetBodyFullWidth();
  }

  componentWillMount() {
    setBodyFullWidth();

    this.DATA_CF = getDataCareerFair();
    this.FIELD_SELECT =
      "ID cf is_active item_order title description type img_url img_pos img_size video_url";
    this.offset = 20;
    this.tableHeader = (
      <thead>
        <tr>
          <th>ID</th>
          <th>CF</th>
          <th>Is Active</th>
          <th>Item Order</th>
          <th>Title</th>
          <th>Description</th>
          <th>Type</th>
          <th>Meta</th>
        </tr>
      </thead>
    );

    //##########################################
    //  search
    this.searchParams = "";
    this.search = {};
    this.searchFormItem = [
      { header: "Enter Your Search Query" },
      {
        label: "Career Fair",
        name: HallGallery.CF,
        type: "radio",
        data: this.DATA_CF
      }
    ];

    this.searchFormOnSubmit = d => {
      this.search = d;
      this.searchParams = "";
      if (d != null) {
        this.searchParams += d.cf !== "" ? `cf:"${d.cf}",` : "";
      }
    };

    this.loadData = (page, offset) => {
      var q = `query{hall_galleries(${this.searchParams} 
              order_by: "cf asc, is_active desc, item_order asc", page:${page}, offset:${offset}) 
            { ${this.FIELD_SELECT} } }`;
      // console.log(q);
      return getAxiosGraphQLQuery(q);
    };

    this.getDataFromRes = res => {
      return res.data.data.hall_galleries;
    };

    // create form add new default
    this.newFormDefault = {};
    this.newFormDefault[HallGallery.CF] = this.cf;
    this.newFormDefault[HallGallery.IS_ACTIVE] = 1;
    this.newFormDefault[HallGallery.ITEM_ORDER] = 0;

    this.getFormItem = edit => {
      var ret = [{ header: "Hall Gallery Form" }];
      ret.push(
        ...[
          {
            label: "Career Fair",
            name: HallGallery.CF,
            type: "radio",
            data: this.DATA_CF,
            required: true
          },
          {
            label: "Title",
            name: HallGallery.TITLE,
            type: "text",
          },
          {
            label: "Description",
            name: HallGallery.DESCRIPTION,
            type: "textarea",
            rows: 2
          },
          {
            label: "Is Active?",
            name: HallGallery.IS_ACTIVE,
            type: "radio",
            data: [{ key: 1, label: "Yes" }, { key: 0, label: "No" }],
            required: true
          },
          {
            label: "Item Order",
            name: HallGallery.ITEM_ORDER,
            type: "number"
          },
          {
            label: "Type",
            name: HallGallery.TYPE,
            type: "select",
            data: ["", HallGalleryEnum.TYPE_IMAGE, HallGalleryEnum.TYPE_VIDEO],
            required: true
          },
          {
            label: "Image Url",
            name: HallGallery.IMG_URL,
            type: "text"
          },
          {
            label: "Image Position",
            name: HallGallery.IMG_POS,
            type: "text"
          },
          {
            label: "Image Size",
            name: HallGallery.IMG_SIZE,
            type: "text"
          },
          {
            label: "Video Url",
            name: HallGallery.VIDEO_URL,
            type: "text"
          }
        ]
      );

      var extra = [];
      if (edit) {
        // extra = [
        //   {
        //     label: "Is Active",
        //     name: HallGallery.IS_DISABLED,
        //     type: "select",
        //     data: [{ key: 0, label: "Yes" }, { key: 1, label: "No" }],
        //     required: true
        //   }
        // ];
      }

      ret.push(...extra);

      return ret;
    };

    this.getEditFormDefault = ID => {
      const query = `query
          {hall_galleries(ID: ${ID}){ ${this.FIELD_SELECT} }}`;

      return getAxiosGraphQLQuery(query).then(res => {
        var hg = res.data.data.hall_galleries[0];
        return hg;
      });
    };



    this.renderRow = (d, i) => {
      var row = [];
      var discard = ["img_pos", "img_size", "video_url"];
      for (var key in d) {
        if (discard.indexOf(key) >= 0) {
          continue;
        }
        if (key == "img_url") {
          let v = [
            <li>
              <b>Image Url</b> : <span>{d.img_url}</span>
            </li>,
            <li>
              <b>Image Position</b> : <span>{d.img_pos}</span>
            </li>,
            <li>
              <b>Image Size</b> : <span>{d.img_size}</span>
            </li>,
            <li>
              <br></br>
              <b>Video Url</b> : <span>{d.video_url}</span>
            </li>,
          ];
          row.push(
            <td>
              <ul><div style={{ maxWidth: "40vw" }}>{v}</div></ul>
            </td>
          );
        } else if (key == "is_active") {
          var is_active =
            d.is_active == "0" ? (
              <label className="label label-danger">Not Active</label>
            ) : (
                <label className="label label-success">Active</label>
              );
          row.push(<td className="text-center">{is_active}</td>);
        } else {
          row.push(<td>{d[key]}</td>);
        }
      }
      return row;
    };

    // if used in formWillSubmit, better put in force diff
    this.forceDiff = [
      HallGallery.TITLE,
      HallGallery.DESCRIPTION,
      HallGallery.IS_ACTIVE,
      HallGallery.TYPE,
      HallGallery.VIDEO_URL,
      HallGallery.IMG_URL,
      HallGallery.IMG_POS,
      HallGallery.IMG_SIZE
    ];

    this.formWillSubmit = (d, edit) => {
      for (var i in d) {
        if (d[i] == null) {
          d[i] = "";
        }
      }

      var parseInt = [HallGallery.IS_ACTIVE];

      for (var i in parseInt) {
        if (typeof d[parseInt[i]] === "string") {
          d[parseInt[i]] = Number.parseInt(d[parseInt[i]]);
        }
      }

      if (d[HallGallery.TYPE] === HallGalleryEnum.TYPE_IMAGE) {
        d[HallGallery.VIDEO_URL] = "";

        if (isValueEmpty(d[HallGallery.IMG_URL])) {
          return "Please fill in 'Image Url' field";
        } else {
          if (isValueEmpty(d[HallGallery.IMG_POS])) {
            d[HallGallery.IMG_POS] = "center center";
          }
          if (isValueEmpty(d[HallGallery.IMG_SIZE])) {
            d[HallGallery.IMG_SIZE] = "100%";
          }
        }
      }

      if (d[HallGallery.TYPE] === HallGalleryEnum.TYPE_VIDEO) {
        d[HallGallery.IMG_URL] = "";
        d[HallGallery.IMG_POS] = "";
        d[HallGallery.IMG_SIZE] = "";

        if (isValueEmpty(d[HallGallery.VIDEO_URL])) {
          return "Please fill in 'Video Url' field";
        }
      }

      if (edit) {
        d.updated_by = this.authUser.ID;
      } else {
        d.created_by = this.authUser.ID;
      }

      return d;
    };
  }

  render() {
    document.setTitle("Manage Hall Gallery");
    return (
      <div className="main-width main-width-lg">
        <h3>Manage Hall Gallery</h3>
        <GeneralFormPage
          entity_singular="Hall Gallery"
          entity="hall_gallery"
          addButtonText="Add New Hall Gallery"
          dataTitle={this.dataTitle}
          forceDiff={this.forceDiff}
          getFormItem={this.getFormItem}
          newFormDefault={this.newFormDefault}
          getEditFormDefault={this.getEditFormDefault}
          noMutation={true}
          formWillSubmit={this.formWillSubmit}
          canEdit={true}
          canAdd={true}
          dataOffset={20}
          searchFormItem={this.searchFormItem}
          searchFormOnSubmit={this.searchFormOnSubmit}
          tableHeader={this.tableHeader}
          renderRow={this.renderRow}
          getDataFromRes={this.getDataFromRes}
          loadData={this.loadData}
        />
      </div>
    );
  }
}
