import React, { Component } from "react";
import PropTypes from "prop-types";
import { Time } from "../lib/time";
import { _GET } from "../lib/util";
import {lang} from "../lib/lang";

// require("../css/time-converter.scss");

export default class TimeConverterPage extends React.Component {
  componentWillMount() { }

  getBlock({ date, time, day, timezone, tcClass }) {
    return (
      <div className={`tc-block tc-block-${tcClass}`}>
        <div className="tcb-timezone">{timezone}</div>
        <div className="tcb-day">{day}</div>
        <div className="tcb-date">{date}</div>
        <div className="tcb-time">{time}</div>
      </div>
    );
  }
  render() {
    let unix = _GET("unix");
    // let title = _GET("title");

    let v = null;
    if (unix == null) {
      v = <div>{lang("Nothing To Show Here")}</div>;
    } else {
      unix = Number.parseInt(unix);
      let timeTitle = Time.getHappeningAgo(unix, {
        happeningHandler: txt => {
          return `${txt} to go`;
        },
        agoHandler: txt => {
          return `${txt}`;
        }
      });

      v = (
        <div className="time-converter">
          {/* <h4 className="tc-title">{title}</h4> */}
          <h4 className="tc-title">{timeTitle}</h4>
          <div className="block-container">
            {this.getBlock({
              date: Time.getDate(unix),
              time: Time.getStringShort(unix),
              day: Time.getDateDayStrFull(unix),
              timezone: "Your Local Time",
              tcClass: "left"
            })}
            {this.getBlock({
              date: Time.getDateMas(unix),
              time: Time.getStringShortMas(unix),
              day: Time.getDateDayStrMasFull(unix),
              timezone: "Malaysia Time",
              tcClass: "right"
            })}
          </div>
        </div>
      );
    }

    return v;
  }
}
