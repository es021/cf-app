import React from "react";
import PropTypes from "prop-types";
import { Time } from "../lib/time";
// require("../css/toogle-timezone.scss");

export default class ToogleTimezone extends React.Component {
  constructor(props) {
    super(props);

    this.defaultTimezone = Time.ALT_TIMEZONE_SHORT;
    this.myTimezone = Time.getTimezoneShort();

    let defaultTime = this.props.createDefaultTime(this.props.unixtimestamp, this.myTimezone);

    
    console.log("this.defaultTimezone",this.defaultTimezone);
    console.log("this.myTimezone",this.myTimezone);

    this.state = {
      isDefaultTime: false,
      body: this.props.createBody(defaultTime)
    };


   
  }

  onClickCheckbox() {
    this.setState(prevState => {
      let newBody = null;
      if (prevState.isDefaultTime) {
        newBody = this.props.createBody(
          this.props.createDefaultTime(this.props.unixtimestamp, this.myTimezone)
        );
      } else {
        newBody = this.props.createBody(
          this.props.createAlternateTime(this.props.unixtimestamp, this.defaultTimezone)
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
    let onClick = ev => {
      this.onClickCheckbox();
    }
    let toggler = null;
    if (this.props.createCustomToggler) {
      toggler = this.props.createCustomToggler(this.state.isDefaultTime, onClick);
    } else {
      toggler = (
        <label className="app-switch">
          <input
            type="checkbox"
            onClick={onClick}
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
    }
    return <div>{this.props.createView(this.state.body, toggler)}</div>;
  }
}

ToogleTimezone.propTypes = {
  createCustomToggler: PropTypes.func,
  unixtimestamp: PropTypes.any.isRequired,
  createBody: PropTypes.func,
  createView: PropTypes.func,
  createDefaultTime: PropTypes.func,
  createAlternateTime: PropTypes.func
};

ToogleTimezone.defaultProps = {};
