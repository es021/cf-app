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
    this.finishDbRequest = this.finishDbRequest.bind(this);
    this.continueOnClick = this.continueOnClick.bind(this);
    this.inputOnBlur = this.inputOnBlur.bind(this);
    this.inputOnChange = this.inputOnChange.bind(this);
    this.inputOnFocus = this.inputOnFocus.bind(this);
    this.onChooseSuggestion = this.onChooseSuggestion.bind(this);
    this.insertDB = this.insertDB.bind(this);
    this.authUser = getAuthUser();

    // init state
    this.state = {
      lastSendTimestamp: null,
      ID: null,
      dbVal: null,
      val: null,
      loading: false,
      done_update: false,
      show_is_required: false
    };
  }
  componentWillMount() {
    this.setDefaultValue();
  }

  updateRequiredWarning(v) {
    if (this.isValueEmpty(v)) {
      this.setState({
        loading: false,
        done_update: false,
        show_is_required: this.props.is_required ? true : false
      });
    } else {
      this.setState({
        loading: false,
        done_update: false,
        show_is_required: false
      });
    }
  }
  getStateAfterDbRequest(d, ID = null) {
    let ret = {
      dbVal: d.val,
      loading: false,
      show_is_required: this.isEmptyAndRequired(d.val),
      done_update: !this.isValueEmpty() ? true : false
    };
    if (ID !== null) {
      ret.ID = ID;
    }
    return ret;
  }
  continueOnClick(e) {
    if (this.props.continueOnClick) {
      this.props.continueOnClick(e);
    }
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
        let v = null;
        // console.log("d", d);
        if (d) {
          this.setState({ ID: d.ID, dbVal: d.val, val: d.val, loading: false });
          v = d.val;
        } else {
          this.setState({ loading: false });
        }

        //this.updateRequiredWarning(v);
        this.triggerDoneHandler(v);
      })
      .catch(err => {
        console.log("catch err", err);
      });
  }
  loading() {
    this.setState({ loading: true, done_update: false });
  }
  setLastSendTimestamp() {
    let toSet = Date.now();
    this.lastSendTimestamp = toSet;
    console.log("setLastSendTimestamp", this.lastSendTimestamp);

    return toSet;
  }

  sendDataToDb(v) {
    const doSend = () => {
      console.log("sendDataToDb", v);

      if (this.state.dbVal === v) {
        return;
      }

      if (this.isValueEmpty()) {
        v = "";
      }

      this.loading();
      if (this.state.ID) {
        this.updateDB(this.state.ID, v);
      } else {
        this.insertDB(v);
      }
    };

    if (this.lastSendTimestamp == null) {
      let set = this.setLastSendTimestamp();
      setTimeout(() => {
        if (set == this.lastSendTimestamp) {
          doSend();
        }
      }, 200);
    } else {
      this.setLastSendTimestamp();
      doSend();
    }

  }
  triggerDoneHandler(v) {
    this.props.doneHandler(this.props.id, {
      isEmptyAndRequired: this.isEmptyAndRequired(v),
      type: "single",
      val: v
    });
  }
  finishDbRequest(v) {
    this.triggerDoneHandler(v);
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
          return this.getStateAfterDbRequest(d);
        });
        this.finishDbRequest(v);
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
          return this.getStateAfterDbRequest(d, d.ID);
        });
        this.finishDbRequest(v);
      })
      .catch(err => {
        console.log("catch err", err);
      });
  }
  onChooseSuggestion(v) {
    this.setState({ val: v });
    console.log("onChooseSuggestion", v);
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
    console.log("v", v);
    this.updateRequiredWarning(v);
  }
  // setIconTrue(key) {
  //   let ori = {
  //     loading: false,
  //     done_update: false,
  //     show_is_required: false
  //   };

  //   if (typeof ori[key] !== "undefined") {
  //     ori[key] = true;
  //   }

  //   return true;
  // }
  isValueEmpty(val) {
    if (typeof val === "undefined") {
      val = this.state.val;
    }
    return val == "" || val == null || typeof val === "undefined";
  }
  isEmptyAndRequired(v) {
    return this.isValueEmpty(v) && this.props.is_required;
  }
  render() {
    let continueBtn = null;
    if (!this.props.hideContinueButton) {
      continueBtn = continueBtn = [
        <br></br>,
        <button
          data-index={this.props.index}
          className="btn btn-success btn-lg"
          onClick={this.continueOnClick}
        >
          Continue
        </button>
      ];
    }

    let className = "input-single";
    if (this.props.isChildren) {
      className += " input-children";
    }

    return (
      <div id={this.props.id} className={className}>
        <div className="si-label input-label">
          {this.props.label}
          {this.props.is_required && !this.props.isChildren ? " *" : ""}
        </div>
        <div className="si-input">
          <InputSuggestion
            input_type={this.props.input_type}
            icon_loading={this.state.loading}
            icon_done={this.state.done_update}
            icon_is_required={this.state.show_is_required}
            input_onChange={this.inputOnChange}
            input_onBlur={this.inputOnBlur}
            input_onFocus={this.inputOnFocus}
            input_val={this.state.val}
            input_placeholder={this.props.input_placeholder}
            onChoose={this.onChooseSuggestion}
            table_name={this.props.ref_table_name}
          ></InputSuggestion>
        </div>

        <div className="si-footer">
          {this.props.children}
          {continueBtn}
        </div>
      </div>
    );
  }
}

InputSingle.propTypes = {
  children: PropTypes.array,
  index: PropTypes.number,
  id: PropTypes.string,
  input_type: PropTypes.string,
  doneHandler: PropTypes.func,
  continueOnClick: PropTypes.func,
  is_required: PropTypes.bool,
  ref_table_name: PropTypes.string,
  key_val: PropTypes.string,
  input_placeholder: PropTypes.string,
  entity: PropTypes.string,
  entity_id: PropTypes.number,
  label: PropTypes.string,
  hideContinueButton: PropTypes.bool,
  isChildren: PropTypes.bool
};

InputSingle.defaulProps = {
  isChildren: false,
  hideContinueButton: false,
  doneHandler: () => {
    console.log("default doneHandler");
  }
};
