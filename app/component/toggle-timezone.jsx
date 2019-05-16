import React from "react";
import PropTypes from "prop-types";
import { Time } from "../lib/time";
require("../css/toogle-timezone.scss");

export default class ToogleTimezone extends React.Component {
  constructor(props) {
    super(props);
    let defaultTime = Time.getString(this.props.unixtimestamp);

    this.state = {
      isDefaultTime: false,
      body: this.props.createBody(defaultTime)
    };

    this.myTimezone = Time.getTimezoneShort();
    this.defaultTimezone = "MYT";
    if (this.myTimezone == "MT") {
      this.myTimezone = this.defaultTimezone;
    }
  }

  onClickCheckbox() {
    this.setState(prevState => {
      let newBody = null;
      if (prevState.isDefaultTime) {
        newBody = this.props.createBody(
          Time.getString(this.props.unixtimestamp)
        );
      } else {
        newBody = this.props.createBody(
          Time.getStringMas(this.props.unixtimestamp)
        );
      }
      return {
        body: newBody,
        isDefaultTime: !prevState.isDefaultTime
      };
    });
  }
  render() {
    let toggler = (
      <label className="app-switch">
        <input
          type="checkbox"
          onClick={ev => {
            this.onClickCheckbox();
          }}
        />
        <span className="as-slider round">
          <div className="as-text-container">
            <div className="as-text text-left">{this.defaultTimezone}</div>
            <div className="as-text text-right">{this.myTimezone}</div>
          </div>
        </span>
      </label>
    );

    return <div>{this.props.createView(this.state.body, toggler)}</div>;
  }
}

ToogleTimezone.propTypes = {
  unixtimestamp: PropTypes.any.isRequired,
  createBody: PropTypes.func,
  createView: PropTypes.func
};

ToogleTimezone.defaultProps = {};
