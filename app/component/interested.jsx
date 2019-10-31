import React, { Component } from "react";
import PropTypes from "prop-types";
import { getAuthUser } from "../redux/actions/auth-actions";
import { graphql } from "../../helper/api-helper";
import * as layoutActions from "../redux/actions/layout-actions";
import { Loader } from "./loader";

export class InterestedUserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: []
    };
  }
  componentWillMount() {
    this.setState({ loading: true });
    let q = `query{ 
      interested_list(entity:"${this.props.entity}", entity_id:${this.props.entity_id}) 
      {
        user_id
        user{
          first_name last_name
          img_url img_pos img_size
        }
      }
    }`;

    graphql(q).then(res => {
      this.setState({
        data: res.data.data.interested_list,
        loading: false
      });
    });
  }

  render() {
    let v = null;
    if (this.state.loading) {
      v = <Loader></Loader>;
    } else {
      v = (
        <div>
          InterestedUserList<br></br>
          {JSON.stringify(this.state.data)}
        </div>
      );
    }
    return v;
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
