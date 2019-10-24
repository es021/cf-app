import React, { Component } from "react";
import PropTypes from "prop-types";
import { getAuthUser } from "../redux/actions/auth-actions";
import { graphql } from "../../helper/api-helper";

export class InterestedButton extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.authUser = getAuthUser();
    this.state = {
      loading: false,
      ID: this.props.ID,
      is_interested: this.props.is_interested
    };
  }
  onClick(e) {
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
    return (
      <div
        className={`interested ${
          this.state.is_interested == 1 ? "selected" : ""
        }`}
      >
        {this.state.loading ? (
          <i className="fa fa-spinner fa-pulse"></i>
        ) : (
          <i onClick={this.onClick} className="fa fa-heart"></i>
        )}
      </div>
    );
  }
}
InterestedButton.propTypes = {
  ID: PropTypes.number,
  is_interested: PropTypes.number,
  entity: PropTypes.number,
  entity_id: PropTypes.number
};
