import React, { Component } from "react";
import InputMulti from "../../../component/input-multi";
import InputSingle from "../../../component/input-single";
import { smoothScrollTo, focusOnInput } from "../../../../app/lib/util";
import PropTypes from "prop-types";

export default class ManageUserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.continueOnClick = this.continueOnClick.bind(this);
    this.inputDoneHandler = this.inputDoneHandler.bind(this);
    this.MARGIN = [
      <br></br>,
      <br></br>,
      <br></br>,
      <br></br>,
      <br></br>,
      <br></br>
    ];

    this.state = {
      isEmptyAndRequired: {},
      currentData: {}
    };
  }
  getItemEmptyAndRequired() {
    let ret = [];

    for (var k in this.state.isEmptyAndRequired) {
      if (this.state.isEmptyAndRequired[k] === true) {
        ret.push(k);
      }
    }

    return ret;
  }
  getItemById(id) {
    let inputItems = this.getInputItems();
    for (var i in inputItems) {
      if (inputItems[i].id == id) {
        return inputItems[i];
      }
    }

    return null;
  }
  isItemRequired(id) {
    try {
      let item = this.getItemById(id);
      if (item.is_required === true) {
        return true;
      }
    } catch (err) { }
    return false;
  }
  getInputItems() {
    let major = this.state.currentData["major"];
    // console.log("major",major)

    let r = [
      {
        type: "single",
        id: "university",
        key_input: "university",
        label: "University",
        input_placeholder: "Type something here",
        ref_table_name: "university",
        is_required: false,
        hidden: false
      },
      {
        type: "single",
        id: "major",
        key_input: "major",
        label: "Major",
        input_placeholder: "Type something here",
        ref_table_name: "major",
        is_required: true,
        hidden: false
      },
      {
        type: "multi",
        id: "interested_role",
        table_name: "interested_role",
        label: "Your Interested Role?",
        input_placeholder: "Type something here",
        suggestion_search_by_ref: "major",
        suggestion_search_by_val: major,
        list_title: major ? `Popular role for major ${major}` : "",
        ref_table_name: "job_role",
        is_required: true,
        hidden: false
      },
      {
        type: "multi",
        id: "interested_job_location",
        table_name: "interested_job_location",
        label: "Where do you want to work?",
        input_placeholder: "Type something here",
        location_suggestion: "interested_job_location",
        list_title: major ? `Popular job location for major ${major}` : "Popular in your area",
        ref_table_name: "location",
        is_required: true,
        hidden: false
      }
    ];

    return r;
  }
  getNextItemId(curIndex) {
    let inputItems = this.getInputItems();
    try {
      curIndex = Number.parseInt(curIndex);
      for (var i = curIndex + 1; i < inputItems.length; i++) {
        let d = inputItems[i];
        if (!d.hidden) {
          return d.id;
        }
      }
    } catch (err) {
      console.log("getNextItemId error", err);
    }
    return "";
  }

  continueOnClick(e) {
    let index = e.currentTarget.dataset.index;
    let idToGo = this.getNextItemId(index);
    focusOnInput(idToGo);
    smoothScrollTo(idToGo);
  }
  inputDoneHandler(id, meta) {
    // console.log("inputDoneHandler", id, meta);

    let data = null;
    let isEmptyAndRequired = false;
    if (meta.type == "single") {
      /** {type, val, isEmptyAndRequired} */
      if (meta.isEmptyAndRequired) {
        isEmptyAndRequired = true;
      }
      data = meta.val;
    } else if (meta.type == "multi") {
      /** {type, list, isEmptyAndRequired} */
      if (meta.isEmptyAndRequired) {
        isEmptyAndRequired = true;
      }
      data = meta.list;
    }

    this.setState(prevState => {
      prevState.isEmptyAndRequired[id] = isEmptyAndRequired;
      prevState.currentData[id] = data;
      return {
        isEmptyAndRequired: prevState.isEmptyAndRequired,
        currentData: prevState.currentData
      };
    });
  }
  getDoneButton() {
    return (
      <button
        className="btn btn-success btn-lg"
        onClick={e => {
          let arr = this.getItemEmptyAndRequired();
          if (arr.length > 0) {
            let firstEmpty = arr[0];
            focusOnInput(firstEmpty);
            smoothScrollTo(firstEmpty);
          } else {
            alert("Setel");
          }
        }}
      >
        Done
      </button>
    );
  }
  render() {
    let view = this.getInputItems().map((d, i) => {
      if (d.hidden) {
        return null;
      }
      if (d.type == "single") {
        return [
          <InputSingle
            {...d}
            index={i}
            entity={"user"}
            entity_id={this.props.user_id}
            doneHandler={this.inputDoneHandler}
            continueOnClick={this.continueOnClick}
          ></InputSingle>,
          this.MARGIN
        ];
      } else if (d.type == "multi") {
        return [
          <InputMulti
            {...d}
            index={i}
            entity={"user"}
            entity_id={this.props.user_id}
            doneHandler={this.inputDoneHandler}
            continueOnClick={this.continueOnClick}
          ></InputMulti>,
          this.MARGIN
        ];
      }
    });

    // done button
    view.push(this.getDoneButton());

    return (
      <div style={{ textAlign: "left" }}>
        {view}
        {JSON.stringify(this.state)}
      </div>
    );
  }
}

ManageUserProfile.propTypes = {
  user_id: PropTypes.number.isRequired
};
