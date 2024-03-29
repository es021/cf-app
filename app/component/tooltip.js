import React, { Component } from "react";
import PropTypes from "prop-types";

// require('../css/tooltip.scss');

export default class Tooltip extends React.Component {
  constructor(props) {
    super(props);
    this.debug = this.props.debug;

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.state = {
      show: this.debug ? true : false
    };
  }

  onMouseEnter() {
    if (this.props.tooltip === null) {
      return;
    }

    this.setState(() => {
      return { show: true };
    });
  }

  onMouseLeave() {
    if (this.props.tooltip === null || this.debug) {
      return;
    }

    this.setState(() => {
      return { show: false };
    });
  }

  render() {
    var style = {
      bottom: this.props.bottom,
      left: this.props.left,
      width: this.props.width
    };

    if (this.props.alignCenter) {
      style.textAlign = "center";
    }

    let arrow = null;
    if (!this.props.noArrow) {
      switch (this.props.arrowPosition) {
        case "bottom":
          arrow = <div className="my-tt-arrow"></div>;
          break;
        case "right":
          arrow = <div className="my-tt-arrow-right"></div>;
          break;
        case "left":
          arrow = <div className="my-tt-arrow-left"></div>;
          break;
      }
    }

    var tooltip = this.state.show ? (
      <div className="my-tt-container" style={style}>
        <div className="my-tt-mes">{this.props.tooltip}</div>
        {arrow}
      </div>
    ) : null;

    return (
      <span
        className="my-tooltip"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <span className="my-tt-content">{this.props.content}</span>
        {tooltip}
      </span>
    );
  }
}

Tooltip.propTypes = {
  content: PropTypes.any.isRequired,
  tooltip: PropTypes.element.isRequired,
  debug: PropTypes.bool,
  arrowPosition: PropTypes.string,
  bottom: PropTypes.string,
  width: PropTypes.string,
  left: PropTypes.string,
  alignCenter: PropTypes.bool,
  noArrow: PropTypes.bool
};

Tooltip.defaultProps = {
    arrowPosition: "bottom",
  debug: false,
  noArrow: false,
  width: "200px",
  bottom: "30px",
  left: "-90px",
  alignCenter: false
};
