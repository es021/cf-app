import React, { Component } from "react";
import PropTypes from "prop-types";
import { getAuthUser } from "../redux/actions/auth-actions";
import { graphql } from "../../helper/api-helper";
import * as layoutActions from "../redux/actions/layout-actions";
import { Loader } from "./loader";
import List from "../component/list";
import { PCType, createImageElement } from "../component/profile-card";
import { createUserTitle, openUserPopup } from "../page/users";
import Tooltip from "../component/tooltip";

export class InterestedUserList extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.renderList = this.renderList.bind(this);
    this.authUser = getAuthUser();
    this.offset = 8;
  }

  loadData(page, offset) {
    // description
    return graphql(`query{ 
      interested_list(entity:"${this.props.entity}", 
      entity_id:${this.props.entity_id},
      page: ${page},
      offset: ${offset},
      is_interested : 1
      ){
      user_id
      user{ID first_name last_name img_url img_pos img_size}}}`);
  }

  componentWillMount() { }

  renderList(d, i) {
    let img = createImageElement(
      d.user.img_url,
      d.user.img_pos,
      d.user.img_size,
      "50px",
      "",
      PCType.STUDENT
    );

    // let action = <div>
    //   <button>Schedule Call</button>
    //   <button>Chat Now</button>
    // </div>
    return (
      <div
        className="flex-center"
        style={{ background: "white", padding: "0px 18px", borderRadius: "10px", margin: "10px", width: "400px", justifyContent: "flex-start" }}
      >
        <div>{img}</div>
        <div className="text-left" style={{ marginLeft: "10px" }}>
          {/* <b>{createUserTitle(d.user, {}, true, true)}</b> */}
          <div><b>{d.user.first_name}</b>{" "}{d.user.last_name}</div>
          <div><a className="btn-link" onClick={() => { openUserPopup(d.user) }}><b><small>View Profile</small></b></a></div>
        </div>
      </div>
    );
  }

  getDataFromRes(res) {
    return res.data.data.interested_list;
  }

  render() {
    let title = this.props.title ? this.props.title : "Liked By";
    return (
      <div style={{ padding: "10px" }}>
        <h3 className="text-left">{title}</h3>
        <List
          isHidePagingTop={true}
          type="list"
          listClass="flex-wrap-center"
          pageClass="text-left"
          getDataFromRes={this.getDataFromRes}
          loadData={this.loadData}
          offset={this.offset}
          renderList={this.renderList}
        />
      </div>
    );
  }
}

InterestedUserList.propTypes = {
  entity: PropTypes.string,
  entity_id: PropTypes.number,
  title : PropTypes.string
};

export class InterestedButton extends React.Component {
  constructor(props) {
    super(props);

    this.onClickModeCount = this.onClickModeCount.bind(this);
    this.onClickModeAction = this.onClickModeAction.bind(this);
    this.authUser = getAuthUser();


    this.icon = this.props.customType;
    this.className = this.props.customType;

    this.state = {
      loading: false,
      ID: this.props.ID,
      is_interested: this.props.is_interested,
      count: 0
    };
  }

  componentWillMount() {
    if (this.props.isModeCount) {
      this.setState({ loading: true });
      let q = `query{ 
        interested_count(entity:"${this.props.entity}", entity_id:${this.props.entity_id}, is_interested:1) 
        {
          total
        }
      }`;

      graphql(q).then(res => {
        this.setState({
          count: res.data.data.interested_count.total,
          loading: false
        });
      });
    }
  }
  onClickModeCount(e, title) {
    if (this.props.isNonClickable) {
      return;
    }

    if(!title){
      title = "Liked By";
    }

    layoutActions.storeUpdateFocusCard(title, InterestedUserList, {
      entity: this.props.entity,
      entity_id: this.props.entity_id,
      title : title
    });
  }
  onClickModeAction(e) {
    if (this.props.isNonClickable) {
      return;
    }
    if (this.state.loading) {
      return;
    }
    this.setState({
      loading: true
    });

    let mutation = "";
    let q = "";
    if (this.state.ID) {
      // update
      let new_is_interested = this.state.is_interested == 1 ? 0 : 1;
      mutation = "edit_interested";
      q = `mutation { edit_interested (
        ID:${this.state.ID}, 
        is_interested:${new_is_interested}
        ) {ID is_interested} }`;
    } else {
      // create
      mutation = "add_interested";
      q = `mutation { add_interested (
        user_id:${
        this.props.customUserId ? this.props.customUserId : this.authUser.ID
        }, 
        entity:"${this.props.entity}",
        entity_id:${this.props.entity_id}
        ) {ID is_interested} }`;
    }

    graphql(q).then(res => {
      let d = res.data.data[mutation];

      if (this.props.finishHandler) {
        this.props.finishHandler(d.is_interested);
      }

      this.setState({
        ID: d.ID,
        is_interested: d.is_interested,
        loading: false
      });
    });
  }

  render() {
    if (this.props.customView) {
      return this.props.customView({
        loading: this.state.loading,
        isModeCount: this.props.isModeCount,
        isModeAction: this.props.isModeAction,
        is_interested: this.state.is_interested,
        like_count: this.state.count,
        onClickModeCount: this.onClickModeCount,
        onClickModeAction: this.onClickModeAction
      });
    }

    let classBottom = this.props.isBottom ? "interested-bottom" : "";
    let v = null;
    if (this.props.isModeCount) {
      v = (
        <div
          style={this.props.customStyle}
          className={`interested ${classBottom} in-count ${this.className}`}
        >
          {this.state.loading ? (
            <i className="fa fa-spinner fa-pulse"></i>
          ) : (
              <div onClick={this.onClickModeCount}>
                <i className={`fa fa-${this.icon} left`}></i>
                {this.state.count}
              </div>
            )}
        </div>
      );
    } else if (this.props.isModeAction) {
      let iconLike = null;
      if (this.props.tooltipObj) {
        iconLike = (
          <Tooltip
            {...this.props.tooltipObj}
            alignCenter={true}
            content={
              <i onClick={this.onClickModeAction} className={`fa fa-${this.icon}`}></i>
            }

          />
        );
      } else {
        iconLike = <i onClick={this.onClickModeAction} className={`fa fa-${this.icon}`}></i>
      }

      v = (
        <div
          style={this.props.customStyle}
          className={`interested ${classBottom} ${this.className} in-action ${
            this.state.is_interested == 1 ? "selected" : ""
            }`}
        >
          {this.state.loading ? (
            <i className="fa fa-spinner fa-pulse"></i>
          ) : (
              iconLike
            )}
        </div>
      );
    }

    return v;
  }
}
InterestedButton.propTypes = {
  icon: PropTypes.string,
  tooltipObj: PropTypes.obj,
  finishHandler: PropTypes.func,
  customStyle: PropTypes.object,
  customType: PropTypes.oneOf(["user", "heart"]),
  isBottom: PropTypes.bool,
  customUserId: PropTypes.number,
  customView: PropTypes.func,
  isModeCount: PropTypes.bool,
  isModeAction: PropTypes.bool,
  isNonClickable: PropTypes.bool,
  ID: PropTypes.number,
  is_interested: PropTypes.number,
  entity: PropTypes.string,
  entity_id: PropTypes.number
};

InterestedButton.defaultProps = {
  customType: "heart",
  tooltipObj: null,
  customStyle: {},
  isBottom: false,
  isModeCount: false,
  isModeAction: false,
  isNonClickable: false
};
