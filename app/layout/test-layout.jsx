import React, { Component } from "react";
import InputMulti from "../component/input-multi";
import InputSingle from "../component/input-single";
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
        <InputSingle
          label={"Which Country Do You Study In?"}
          input_placeholder={"Type something here"}
          key_input={"country"}
          entity={"user"}
          ref_table_name={"job_role"}
          // entity_id={getAuthUser().ID}
          entity_id={136}
        ></InputSingle>

        <br></br>
        {/* <InputMulti
          suggestion_search_by_ref={"major"}
          suggestion_search_by_val={"Accounting And Finance"}
          label={"What Are You?"}
          input_placeholder={"Type something here"}
          list_title={"Popular in your area"}
          table_name={"interested_role"}
          ref_table_name={"job_role"}
          entity={"user"}
          // entity_id={getAuthUser().ID}
          entity_id={136}
        ></InputMulti> */}
      </div>
    );
  }
}

// 0000468612480637 WAN ZULSARHAN BIN W* WOL000001

/**
 * /* <h4>TESTING</h4>
        <InputMulti
          label={"What Are You?"}
          list_title={"Popular in your area"}
          table_name={"interested_role"}
          entity={"user"}
          entity_id={getAuthUser().ID}
        ></InputMulti>
        <h4>SOMETHING ELSE HERE</h4> 
*/
