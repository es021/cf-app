import React, { Component } from "react";
import PropTypes from "prop-types";
import List from "../../../component/list";
import { IsNewEventCard } from "../../../../config/app-config";
import { getAxiosGraphQLQuery } from "../../../../helper/api-helper";
import { Time } from "../../../lib/time";
import ProfileCard from "../../../component/profile-card.jsx";
import obj2arg from "graphql-obj2arg";
import {
  getAuthUser, isRoleStudent, getCF, isRoleRec,
} from "../../../redux/actions/auth-actions";
import { getEventTitle, getEventAction, getEventLocation } from "../../view-helper/view-helper";
import { lang } from "../../../lib/lang";
import { getGroupCallAction } from "./group-call-helper";

export class GroupCallStudentList extends React.Component {
  constructor(props) {
    super(props);

    this.loadData = this.loadData.bind(this);
    this.getDataFromRes = this.getDataFromRes.bind(this);
    this.renderList = this.renderList.bind(this);
    this.offset = 8;

    this.state = {
      extraData: [],
      key: 0
    };

    this.isInit = true;
  }

  componentWillMount() {

    this.getMainQueryParam = (page, offset) => {
      let param = { cf: getCF(), user_id: getAuthUser().ID };
      if (page && offset) {
        param["page"] = page;
        param["offset"] = offset;
      }
      return obj2arg(param, { noOuterBraces: true });
    }
    this.loadCount = () => {
      var query = `query{
        group_calls_count(${this.getMainQueryParam()})
       }`;

      return getAxiosGraphQLQuery(query);
    };

    this.getCountFromRes = (res) => {
      return res.data.data.group_calls_count
    }
  }

  // ##############################################################
  // function for list
  loadData(page, offset) {

    var query = `query{
        group_calls(${this.getMainQueryParam(page, offset)}) {
          ID
          url
          name
          appointment_time
          user_count
          is_canceled
          company {
            ID
            name
            img_url
            img_size
            img_position
          }
        }
      }`;
    return getAxiosGraphQLQuery(query);
  }

  getDataFromRes(res) {
    // this.hasUpNext = false;
    // this.hasNow = false;

    // if (this.isInit) {
    //   this.scrollTo = "top";
    //   this.isInit = false;
    // } else {
    //   this.scrollTo = "bottom";
    // }
    return res.data.data.group_calls;
  }


  renderList(d, i, isExtraData = false) {
    let img = (
      <div className="el-image">
        <ProfileCard
          type="company"
          img_url={d.company.img_url}
          img_pos={d.company.img_pos}
          img_size={d.company.img_size}
          img_dimension={"65px"}
          className={" with-border"}
          body={null}
        />
      </div>
    );

    let detailStyle = {
      position: "relative",
      fontSize: "14px",
      textAlign: "left"
    };

    let companyName = d.company.name;

    let notSpecified = <i className="text-muted">{lang("Not Speficied")}</i>;

    let time = d.appointment_time ? [Time.getString(d.appointment_time), <span className="text-muted">{" (" + lang("local time") + ")"}</span>] : notSpecified;


    let title = <div className="el-title">{d.name}</div>
    let details = (
      <div className="el-details" style={detailStyle}>
        <b>{title}</b>
        <span style={{ fontWeight: "normal" }}><i className="text-muted fa fa-clock-o left"></i>{time}</span>
      </div>
    );


    let action = getGroupCallAction(d);

    let viewStyle = {
      position: "relative",
    }
    if (this.props.isFullWidth) {
      viewStyle["width"] = "100%";
    }

    let v = (
      <div className={`event-list type-${this.props.type}`} style={viewStyle}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">{img}</div>
            <div className="break-15-on-md-and-less"></div>
            <div className="col-md-7">{details}</div>
            <div className="break-15-on-md-and-less"></div>
            <div className="col-md-3">{action}</div>
          </div>
        </div>
      </div>
    );
    return v;
  }

  render() {
    // kalau list semua
    let countParam = {}
    if (!this.props.limitLoad) {
      countParam = {
        loadCount: this.loadCount,
        getCountFromRes: this.getCountFromRes
      }
    }

    let offset = 0;
    if (this.props.limitLoad) {
      offset = this.props.limitLoad;
    }
    else if (this.props.customOffset) {
      offset = this.props.customOffset;
    }
    else {
      offset = this.offset;
    }

    return (
      <List
        {...countParam}
        isCenter={this.props.isCenter}
        divClass={"full-width"}
        key={this.state.key}
        isHidePagingTop={this.props.isHidePagingTop}
        type="list"
        listClass={this.props.listClass ? this.props.listClass : "flex-wrap"}
        pageClass="text-right"
        listRef={v => (this.dashBody = v)}
        getDataFromRes={this.getDataFromRes}
        loadData={this.loadData}
        isListNoMargin={this.props.isListNoMargin}
        extraData={this.state.extraData}
        hideLoadMore={this.props.limitLoad ? true : false}
        offset={offset}
        listAlign={this.props.listAlign}
        renderList={this.renderList}
      />
    );

  }
}

GroupCallStudentList.propTypes = {
  type: PropTypes.string,
  limitLoad: PropTypes.number,
  company_id: PropTypes.number,
  customOffset: PropTypes.number,
  listAlign: PropTypes.string,
  isListNoMargin: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  isCenter: PropTypes.bool,
  isHidePagingTop: PropTypes.bool
}

GroupCallStudentList.defaultProps = {
  type: "card"
}
