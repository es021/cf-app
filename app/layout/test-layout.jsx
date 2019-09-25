import React, { Component } from "react";
export default class TestLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    document.setTitle("Test");
    return <div style={{ padding: "10px", background: "white" }}>Hello</div>;
  }
}
