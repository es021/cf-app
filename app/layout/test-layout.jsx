import React, { Component } from "react";
import ToogleTimezone from "../component/toggle-timezone";

export default class TestLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    document.setTitle("Test");
    return (
      <div style={{ padding: "10px" }}>
        <ToogleTimezone
          unixtimestamp={1557995186}
          createBody={time => {
            console.log("time", time);
            return <div style={{ color: "white" }}>{time}</div>;
          }}
          createView={(body, toggler) => {
            return (
              <div className="text-center" style={{ width: "500px" }}>
                {body}
                {toggler}
              </div>
            );
          }}
        />
      </div>
    );
  }
}
