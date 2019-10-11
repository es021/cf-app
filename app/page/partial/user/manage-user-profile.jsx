import React, { Component } from "react";
import InputMulti from "../../../component/input-multi";
import InputSingle from "../../../component/input-single";
import { smoothScrollTo } from "../../../../app/lib/util";
import PropTypes from "prop-types";

export default class ManageUserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.continueOnClick = this.continueOnClick.bind(this);
    this.inputItems = this.getInputItems();
    this.MARGIN = [
      <br></br>,
      <br></br>,
      <br></br>,
      <br></br>,
      <br></br>,
      <br></br>
    ];
  }
  componentWillMount() {}
  getInputItems() {
    let r = [
      {
        type: "single",
        id: "university",
        key_input: "university",
        label: "University",
        input_placeholder: "Type something here",
        ref_table_name: "job_role",
        is_required: false,
        hidden: false
      },
      {
        type: "single",
        id: "major",
        key_input: "major",
        label: "Major",
        input_placeholder: "Type something here",
        ref_table_name: "job_role",
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
        suggestion_search_by_val: "Accounting And Finance",
        list_title: "Popular in your area",
        ref_table_name: "job_role",
        is_required: true,
        hidden: false
      }
    ];

    return r;
  }
  getNextItemId(curIndex) {
    try {
      curIndex = Number.parseInt(curIndex);
      for (var i = curIndex + 1; i < this.inputItems.length; i++) {
        let d = this.inputItems[i];
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
    smoothScrollTo(idToGo);
  }
  inputDoneHandler(id, meta) {
    console.log("inputDoneHandler", id, meta);
  }
  render() {
    let v = this.inputItems.map((d, i) => {
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

    return <div style={{textAlign:'left'}}>{v}</div>;
  }
}

ManageUserProfile.propTypes = {
  user_id: PropTypes.number.isRequired
};
