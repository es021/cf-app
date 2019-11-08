import React, { Component } from "react";
import PropTypes from "prop-types";
import { getAuthUser } from "../redux/actions/auth-actions";
import { graphql } from "../../helper/api-helper";
import * as layoutActions from "../redux/actions/layout-actions";
import { Loader } from "./loader";
import List from "../component/list";
import { PCType, createImageElement } from "../component/profile-card";
import { createUserTitle } from "../page/users";

export class InterestedUserList extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.renderList = this.renderList.bind(this);
    this.authUser = getAuthUser();
  }

  loadData(page, offset) {
    // description
    return graphql(`query{ 
      interested_list(entity:"${this.props.entity}", 
      entity_id:${this.props.entity_id},
      page: ${page},
      offset: ${offset},
      ){
      user_id
      user{ID first_name last_name img_url img_pos img_size}}}`);
  }

  componentWillMount() {
    this.offset = 8;
  }

  renderList(d, i) {
    let img = createImageElement(
      d.user.img_url,
      d.user.img_pos,
      d.user.img_size,
      "50px",
      "",
      PCType.STUDENT
    );

    return (
      <div className="flex-center" 
      style={{margin:"0px", width:"50%", justifyContent:"flex-start"}}>
        <div >{img}</div>
        <div className="text-left" style={{marginLeft:"10px"}}>
          <b>{createUserTitle(d.user,{}, true, true)}</b>
        </div>
      </div>
    );
  }

  getDataFromRes(res) {
    return res.data.data.interested_list;
  }

  render() {
    return (
      <div style={{ padding: "10px" }}>
        <h3 className="text-left">
          Liked By
        </h3>
        <List
          isHidePagingTop={true}
          type="list"
          listClass="flex-wrap-start"
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
  entity_id: PropTypes.number
};

export class InterestedButton extends React.Component {
  constructor(props) {
    super(props);
    this.onClickModeCount = this.onClickModeCount.bind(this);
    this.onClickModeAction = this.onClickModeAction.bind(this);
    this.authUser = getAuthUser();
    this.state = {
      loading: false,
      ID: this.props.ID,
      is_interested: this.props.is_interested,
      count: 0
    };
  }
  onClickModeCount(e) {
    layoutActions.storeUpdateFocusCard("Liked By", InterestedUserList, {
      entity: this.props.entity,
      entity_id: this.props.entity_id
    });
  }
  componentWillMount() {
    if (this.props.isModeCount) {
      this.setState({ loading: true });
      let q = `query{ 
        interested_count(entity:"${this.props.entity}", entity_id:${this.props.entity_id}) 
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
  onClickModeAction(e) {
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
        user_id:${this.authUser.ID}, 
        entity:"${this.props.entity}",
        entity_id:${this.props.entity_id}
        ) {ID is_interested} }`;
    }

    graphql(q).then(res => {
      let d = res.data.data[mutation];
      this.setState({
        ID: d.ID,
        is_interested: d.is_interested,
        loading: false
      });
    });
  }

  render() {
    let v = null;
    if (this.props.isModeCount) {
      v = (
        <div className={`interested in-count`}>
          {this.state.loading ? (
            <i className="fa fa-spinner fa-pulse"></i>
          ) : (
            <div onClick={this.onClickModeCount}>
              <i className="fa fa-heart left"></i>
              {this.state.count}
            </div>
          )}
        </div>
      );
    } else if (this.props.isModeAction) {
      v = (
        <div
          className={`interested in-action ${
            this.state.is_interested == 1 ? "selected" : ""
          }`}
        >
          {this.state.loading ? (
            <i className="fa fa-spinner fa-pulse"></i>
          ) : (
            <i onClick={this.onClickModeAction} className="fa fa-heart"></i>
          )}
        </div>
      );
    }
    return <div>{v}</div>;
  }
}
InterestedButton.propTypes = {
  isModeCount: PropTypes.bool,
  isModeAction: PropTypes.bool,
  ID: PropTypes.number,
  is_interested: PropTypes.number,
  entity: PropTypes.string,
  entity_id: PropTypes.number
};

InterestedButton.defaultProps = {
  isModeCount: false,
  isModeAction: false
};