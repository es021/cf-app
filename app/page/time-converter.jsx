import React, { Component } from "react";
import PropTypes from "prop-types";
import { Time } from "../lib/time";
import { _GET } from "../lib/util";

// require("../css/buttons.scss");

export default class TimeConverterPage extends React.Component {
  componentWillMount() {}

  render() {
    let unix = _GET("t");
    let v = null;
    if (unix == null) {
      v = <div>Nothing To Show Here</div>;
    } else {
      v = (
        <div>
          {unix} - {Time.toString(unix)}
        </div>
      );
    }

    return v;
  }
}
