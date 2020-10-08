import React, { Component } from "react";
import PropTypes from "prop-types";

export default class BannerFloat extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div
      style={this.props.parentStyle}
      className={"banner-float " + this.props.parentClass}>
      <div className="bf-banner">
        <div className="bf-arrow-back"></div>
        {this.props.body}
      </div>
    </div>;
  }
}

BannerFloat.propTypes = {
  parentClass: PropTypes.string,
  parentStyle: PropTypes.obj,
  body: PropTypes.any,
};
