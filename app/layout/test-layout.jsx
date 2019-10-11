import React, { Component } from "react";
import InputMulti from "../component/input-multi";
import InputSingle from "../component/input-single";
import { getAuthUser } from "../redux/actions/auth-actions";
import { smoothScrollTo } from "../../app/lib/util";

export default class TestLayout extends React.Component {
  constructor(props) {
    super(props);
    this.continueOnClick = this.continueOnClick.bind(this);
  }

  componentWillMount() {}
  continueOnClick(e, idToGo) {
    console.log("continueOnClick");
    smoothScrollTo(idToGo);
  }
  inputDoneHandler(id, meta) {
    console.log("inputDoneHandler", id, meta);
  }
  render() {
    document.setTitle("Test");
    return (
      <div style={{ padding: "10px", background: "white" }}>
        <InputSingle
          id={"benda_tak_penting"}
          key_input={"benda_tak_penting"}
          label={"Test Not Required?"}
          input_placeholder={"Type something here"}
          is_required={false}
          entity={"user"}
          ref_table_name={"job_role"}
          // entity_id={getAuthUser().ID}
          entity_id={136}
          doneHandler={this.inputDoneHandler}

        ></InputSingle>
        <br></br>
        <InputSingle
          id={"country"}
          key_input={"country"}
          label={"Which Country Do You Study In?"}
          input_placeholder={"Type something here"}
          is_required={true}
          entity={"user"}
          ref_table_name={"job_role"}
          // entity_id={getAuthUser().ID}
          entity_id={136}
          doneHandler={this.inputDoneHandler}
        ></InputSingle>

        <br></br>
        <InputMulti
          id={"interested_role"}
          table_name={"interested_role"}
          is_required={true}
          suggestion_search_by_ref={"major"}
          suggestion_search_by_val={"Accounting And Finance"}
          label={"What Are You?"}
          input_placeholder={"Type something here"}
          list_title={"Popular in your area"}
          ref_table_name={"job_role"}
          entity={"user"}
          // entity_id={getAuthUser().ID}
          entity_id={136}
          continueOnClick={e => {
            this.continueOnClick(e, "country");
          }}
          doneHandler={this.inputDoneHandler}
        ></InputMulti>
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
