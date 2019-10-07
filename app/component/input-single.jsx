import React, { Component } from "react";
import { graphql } from "../../helper/api-helper";
import { getAuthUser } from "../redux/actions/auth-actions";
import InputSuggestion from "./input-suggestion";
import PropTypes from "prop-types";
import obj2arg from "graphql-obj2arg";

export default class InputSingle extends React.Component {
  constructor(props) {
    super(props);

    // fn binding
    this.inputOnChange = this.inputOnChange.bind(this);
    this.finishDbRequest = this.finishDbRequest.bind(this);
    this.onChooseSuggestion = this.onChooseSuggestion.bind(this);
    this.insertDB = this.insertDB.bind(this);
    this.authUser = getAuthUser();

    // // state
    this.state = {
      val: null
    };
  }

  componentWillMount() {
    this.setDefaultValue();
  }
  setDefaultValue() {}
  updateDB(i, multi_id) {}
  insertDB(v, i) {
    let ins = {
      table_name: this.props.table_name,
      entity: this.props.entity,
      entity_id: this.props.entity_id,
      val: v
    };
    let q = `mutation{add_single(${obj2arg(ins, { noOuterBraces: true })}) {
      ID
      entity
      entity_id
      val
      created_at
    }}`;
    graphql(q)
      .then(res => {
        let d = res.data.data.add_multi;
        this.finishDbRequest(i, d.ID);
      })
      .catch(err => {
        console.log("catch err", err);
        this.finishDbRequest(i, null, err);
      });
  }

  finishDbRequest(i, multi_id = null, err = null) {
    let isDuplicate = false;
    try {
      isDuplicate = err.response.data.indexOf("ER_DUP_ENTRY") >= 0;
    } catch (err) {}

    // ada error tapi bukan error duplicate, kita return
    if (err != null && !isDuplicate) {
      return;
    }

    let isInsert = !this.state.list[i].isSelected;
    let isDelete = this.state.list[i].isSelected;

    this.setState(pState => {
      let prevState = JSON.parse(JSON.stringify(pState));
      if (isDuplicate) {
        prevState.list.splice(i);
      } else {
        // toggle isSelected
        prevState.list[i].isSelected = !prevState.list[i].isSelected;

        // set loading to false
        prevState.list[i].loading = false;

        // update multi_id accordingly
        if (isInsert) {
          prevState.list[i].multi_id = multi_id;
        } else if (isDelete) {
          prevState.list[i].multi_id = null;
        }
      }

      return { list: prevState.list };
    });
  }
  onChooseSuggestion(v) {
    this.setState(prevState => {
      return { val: v };
    });
  }
  inputOnBlur(e) {
    let v = e.target.value;
    console.log("inputOnBlur", v);

    // insert or update db
  }
  inputOnChange(e) {
    this.setState({ val: e.target.value });
  }
  render() {
    var d = {};
    return (
      <div id={this.props.table_name} className="input-single">
        <div className="si-label">{this.props.label}</div>
        <div className="si-input">
          <InputSuggestion
            input_onChange={this.inputOnChange}
            input_onBlur={this.inputOnBlur}
            input_val={this.state.val}
            input_placeholder={this.props.input_placeholder}
            onChoose={this.onChooseSuggestion}
            table_name={this.props.table_name}
          ></InputSuggestion>
        </div>
        <div className="si-footer">{this.props.footer_content}</div>
      </div>
    );
  }
}

InputSingle.propTypes = {
  table_name: PropTypes.string,
  input_placeholder: PropTypes.string,
  entity: PropTypes.string,
  entity_id: PropTypes.number,
  label: PropTypes.string,
  footer_content: PropTypes.object
};
