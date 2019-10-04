import React, { Component } from "react";
import MultiInput from "../component/multi-input";

export default class TestLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  render() {
    document.setTitle("Test");
    return (
      <div style={{ padding: "10px", background: "white" }}>
        <h4>TESTING</h4>
        <MultiInput table_name={"interested_role"}></MultiInput>
        <h4>SOMETHING ELSE HERE</h4>
      </div>
    );
  }
}

// 0000468612480637 WAN ZULSARHAN BIN W* WOL000001