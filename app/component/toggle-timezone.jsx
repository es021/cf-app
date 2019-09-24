import React from "react";
import PropTypes from "prop-types";
import { Time } from "../lib/time";
// require("../css/toogle-timezone.scss");

export default class ToogleTimezone extends React.Component {
  constructor(props) {
    super(props);
    let defaultTime = this.props.createDefaultTime(this.props.unixtimestamp);

    this.state = {
      isDefaultTime: false,
      body: this.props.createBody(defaultTime)
    };

    this.defaultTimezone = Time.ALT_TIMEZONE_SHORT;

    this.myTimezone = Time.getTimezoneShort();
    this.myTimezone = this.replaceTimezone(this.myTimezone);
  }

  replaceTimezone(tz) {
    if (tz == "MT") {
      return "MYT";
    }

    return tz;
  }

  onClickCheckbox() {
    this.setState(prevState => {
      let newBody = null;
      if (prevState.isDefaultTime) {
        newBody = this.props.createBody(
          this.props.createDefaultTime(this.props.unixtimestamp)
        );
      } else {
        newBody = this.props.createBody(
          this.props.createAlternateTime(this.props.unixtimestamp)
        );
      }

      return {
        body: newBody,
        isDefaultTime: !prevState.isDefaultTime
      };
    });
  }
  getTextStyle(txt) {
    let toRet = {}
    if (txt.length > 3) {
      toRet["fontSize"] = "75%";
    }

    return toRet;
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
            <div style={this.getTextStyle(this.defaultTimezone)}
              className="as-text text-left flex-center">{this.defaultTimezone}</div>
            <div style={this.getTextStyle(this.myTimezone)}
              className="as-text text-right flex-center">{this.myTimezone}</div>
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
  createView: PropTypes.func,
  createDefaultTime: PropTypes.func,
  createAlternateTime: PropTypes.func
};

ToogleTimezone.defaultProps = {};
