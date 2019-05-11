import React, { Component } from "react";
import PropTypes from "prop-types";
import PageSection from "../component/page-section";
import { NavLink } from "react-router-dom";
import { ImageUrl } from '../../config/app-config';
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { Loader } from "../component/loader";
import {
  getCFObj,
  getAuthUser,
  isRoleRec,
  isRoleStudent,
  isRoleAdmin
} from "../redux/actions/auth-actions";

require("../css/action-box.scss");


// Ask a Question style instagram
export default class EmptyState extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.authUser = getAuthUser();
    this.cfObj = getCFObj();
  }

  componentWillMount() { }

  render() {
    let img = <img className="img img-responsive" style={{ height: "100px", margin: "auto" }}
      src={`${ImageUrl}/logo-only.png`}></img>
    let title = <h3 style={{ marginTop: "5px" }}>Hi {this.authUser.first_name}!</h3>

    return <div className="empty-state">
      {img}
      {title}
      {this.props.body}
    </div>;
  }
}

EmptyState.propTypes = {
  body: PropTypes.string,

};

EmptyState.defaultProps = {

};
