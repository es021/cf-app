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
    this.inputOnBlur = this.inputOnBlur.bind(this);
    this.inputOnChange = this.inputOnChange.bind(this);
    this.inputOnFocus = this.inputOnFocus.bind(this);
    this.onChooseSuggestion = this.onChooseSuggestion.bind(this);
    this.insertDB = this.insertDB.bind(this);
    this.authUser = getAuthUser();

    // // state
    this.state = {
      ID: null,
      dbVal: null,
      val: null,
      loading: false,
      doneUpdate: false
    };
  }
  componentWillMount() {
    this.setDefaultValue();
  }
  setDefaultValue() {
    this.loading();
    let inq = {
      entity: this.props.entity,
      entity_id: this.props.entity_id,
      key_input: this.props.key_input
    };

    let q = `query{single(${obj2arg(inq, { noOuterBraces: true })}) {
        ID val
      }}`;

    graphql(q)
      .then(res => {
        let d = res.data.data.single;
        console.log("d", d);
        if (d) {
          this.setState(prevState => {
            return { ID: d.ID, dbVal: d.val, val: d.val, loading: false };
          });
        }
      })
      .catch(err => {
        console.log("catch err", err);
      });
  }
  loading() {
    this.setState(prevState => {
      return { loading: true, doneUpdate: false };
    });
  }
  sendDataToDb(v) {
    // no changes
    if (this.state.dbVal === v) {
      return;
    }

    this.loading();
    if (this.state.ID) {
      this.updateDB(this.state.ID, v);
    } else {
      this.insertDB(v);
    }
  }
  updateDB(ID, v) {
    console.log("updateDB", ID, v);
    let upd = {
      ID: ID,
      val: v
    };

    let q = `mutation{edit_single(${obj2arg(upd, { noOuterBraces: true })}) {
      ID val
    }}`;

    graphql(q)
      .then(res => {
        this.setState(prevState => {
          let d = res.data.data.edit_single;
          return { dbVal: d.val, loading: false, doneUpdate: true };
        });
      })
      .catch(err => {
        console.log("catch err", err);
      });
  }
  insertDB(v) {
    console.log("insertDB", v);

    let ins = {
      key_input: this.props.key_input,
      entity: this.props.entity,
      entity_id: this.props.entity_id,
      val: v
    };

    let q = `mutation{add_single(${obj2arg(ins, { noOuterBraces: true })}) {
      ID val
    }}`;

    graphql(q)
      .then(res => {
        this.setState(prevState => {
          let d = res.data.data.add_single;
          return { dbVal: d.val, ID: d.ID, loading: false, doneUpdate: true };
        });
      })
      .catch(err => {
        console.log("catch err", err);
      });
  }
  onChooseSuggestion(v) {
    this.setState(prevState => {
      return { val: v };
    });

    this.sendDataToDb(v);
  }
  inputOnBlur(e) {
    let v = e.target.value;
    console.log("inputOnBlur", v);

    this.sendDataToDb(v);
  }
  inputOnFocus(e) {}
  inputOnChange(e) {
    let v = e.target.value;
    this.setState({ val: v });
  }
  render() {
    var d = {};
    return (
      <div className="input-single">
        <div className="si-label">{this.props.label}</div>
        <div className="si-input">
          <InputSuggestion
            icon_loading={this.state.loading}
            icon_done={this.state.doneUpdate}
            input_onChange={this.inputOnChange}
            input_onBlur={this.inputOnBlur}
            input_onFocus={this.inputOnFocus}
            input_val={this.state.val}
            input_placeholder={this.props.input_placeholder}
            onChoose={this.onChooseSuggestion}
            table_name={this.props.ref_table_name}
          ></InputSuggestion>
        </div>
        <div className="si-footer">{this.props.footer_content}</div>
      </div>
    );
  }
}

InputSingle.propTypes = {
  ref_table_name: PropTypes.string,
  key_val: PropTypes.string,
  input_placeholder: PropTypes.string,
  entity: PropTypes.string,
  entity_id: PropTypes.number,
  label: PropTypes.string,
  footer_content: PropTypes.object
};
