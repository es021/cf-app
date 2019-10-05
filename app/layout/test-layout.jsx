import React, { Component } from "react";
import MultiInput from "../component/multi-input";
import { getAuthUser } from "../redux/actions/auth-actions";

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
        <MultiInput
          label={"What Are You?"}
          list_title={"Popular in your area"}
          table_name={"interested_role"}
          entity={"user"}
          entity_id={getAuthUser().ID}
        ></MultiInput>
        <h4>SOMETHING ELSE HERE</h4>
      </div>
    );
  }
}

// 0000468612480637 WAN ZULSARHAN BIN W* WOL000001
