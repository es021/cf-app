import React, { Component } from "react";
import InputMulti from "../../../component/input-multi";
import InputSingle from "../../../component/input-single";
import * as Reg from "../../../../config/registration-config";
import {
  smoothScrollTo,
  focusOnInput,
  addClassEl,
  removeClassEl
} from "../../../../app/lib/util";
import PropTypes from "prop-types";

export default class ManageUserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.continueOnClick = this.continueOnClick.bind(this);
    this.inputDoneHandler = this.inputDoneHandler.bind(this);
    this.MARGIN = [
      <div style={{ marginTop: this.isEdit() ? "15vh" : "40vh" }}></div>
    ];

    this.SCROLL_OFFSET = -300;
    this.state = {
      isEmptyAndRequired: {},
      currentData: {}
    };
  }
  isEdit() {
    return this.props.isEdit;
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
    } catch (err) {}
    return false;
  }

  getFieldStudyListStr() {
    const DELIM = "::";
    //
    let field_study_raw = this.state.currentData[Reg.Multi.field_study];
    let field_study = null;
    try {
      if (Array.isArray(field_study_raw) && field_study_raw.length >= 0) {
        field_study = "";
        field_study_raw.map((d, i) => {
          if (d.isSelected) {
            field_study += `${d.val}${DELIM}`;
          }
        });

        // trim last delim
        field_study = field_study.substr(0, field_study.length - DELIM.length);
      }
    } catch (err) {
      field_study = null;
    }

    return field_study;
  }
  getInputChildren(id) {
    let r = {};
    r[Reg.Single.first_name] = [
      {
        // single
        type: "single",
        id: Reg.Single.last_name,
        key_input: Reg.Single.last_name,
        input_placeholder: "Last Name",
        is_required: true,
        hidden: false
      }
    ];
    r[Reg.Single.graduation_month] = [
      {
        // single
        type: "single",
        input_type: "select",
        id: Reg.Single.graduation_year,
        key_input: Reg.Single.graduation_year,
        ref_table_name: "year",
        is_required: true,
        hidden: false
      }
    ];

    return r[id];
  }
  getInputItems() {
    let field_study = this.getFieldStudyListStr();
    let country = this.state.currentData[Reg.Single.country_study];

    let r = [];
    if (this.isEdit()) {
      r.push({
        // single
        type: "single",
        label: "What is your name?",
        id: Reg.Single.first_name,
        key_input: Reg.Single.first_name,
        input_placeholder: "First Name",
        is_required: true,
        hidden: false
      });
    }
    r.push(
      ...[
        {
          // single
          type: "single",
          input_type: "select",
          label: "When is your graduation date?",
          id: Reg.Single.graduation_month,
          key_input: Reg.Single.graduation_month,
          // select_use_id_as_value: true,
          ref_order_by: "ID asc",
          ref_table_name: "month",
          is_required: true,
          hidden: false
        },
        {
          // defined multi choice
          type: "multi",
          id: Reg.Multi.looking_for_position,
          table_name: Reg.Multi.looking_for_position,
          label: "What are you looking for?",
          ref_table_name: "looking_for_position",
          hideInputSuggestion: true,
          ref_order_by: "val ASC",
          is_required: true,
          hidden: false
        },
        {
          // single
          type: "single",
          id: Reg.Single.country_study,
          key_input: Reg.Single.country_study,
          label: "Where are you studying",
          input_placeholder: "Malaysia",
          ref_table_name: "country",
          is_required: true,
          hidden: false
        },
        {
          // single
          type: "single",
          id: Reg.Single.university,
          key_input: Reg.Single.university,
          label: "What is your university?",
          input_placeholder: "Universiti Malaya",
          ref_table_name: "university",
          ref_filter_column: "country_id",
          ref_filter_val: country,
          ref_filter_find_id: true, // kena ubah kat ref-query
          is_required: true,
          hidden: false
        },
        {
          // single select
          type: "single",
          input_type: "select",
          id: Reg.Single.qualification,
          key_input: Reg.Single.qualification,
          label: "What is your highest level of certificate?",
          input_placeholder: "Type something here",
          ref_table_name: "qualification",
          is_required: true,
          hidden: false
        },
        // {
        //   // free multi choice (location)
        //   type: "multi",
        //   id: Reg.Multi.field_study,
        //   table_name: Reg.Multi.field_study,
        //   label: "What is your field of study?",
        //   input_placeholder: "Computer Science",
        //   list_title: null,
        //   ref_table_name: "major",
        //   ref_category: "computer-and-information-sciences", // ref suggestion by category
        //   is_required: true,
        //   hidden: false
        // },
        {
          // select multi choice
          type: "multi",
          input_type: "select",
          id: Reg.Multi.field_study,
          table_name: Reg.Multi.field_study,
          discard_ref_from_default: true,
          label: "What is your field of study?",
          sublabel : "You can choose more than one field of study",
          list_title: null,
          ref_table_name: "field_study",
          is_required: true,
          hidden: false
        },
        {
          // single
          type: "single",
          id: Reg.Single.grade,
          key_input: Reg.Single.grade,
          label: "What is your grade?",
          sublabel: "CGPA, First Class, etc",
          input_placeholder: "Type something here",
          is_required: true,
          hidden: false
        },
        {
          // single
          type: "single",
          id: Reg.Single.phone_number,
          key_input: Reg.Single.phone_number,
          label: "What is your phone number?",
          input_placeholder: "XXX-XXXXXXX",
          is_required: true,
          hidden: false
        },
        {
          // free multi choice
          type: "multi",
          id: Reg.Multi.interested_role,
          table_name: Reg.Multi.interested_role,
          label: "What types of jobs will you be searching for?",
          input_placeholder: "Web Developer",
          list_title: field_study ? `Popular job for your field of study` : "",
          ref_table_name: "job_role",
          suggestion_search_by_ref: "field_study", // ref suggestion by table refmap_suggestion
          suggestion_search_by_val: field_study, //  ref suggestion by table refmap_suggestion
          is_required: true,
          hidden: false
        },
        // {
        //   // select multi choice
        //   type: "multi",
        //   input_type: "select",
        //   id: Reg.Multi.interested_role,
        //   table_name: Reg.Multi.interested_role,
        //   discard_ref_from_default: true,
        //   label: "What types of jobs will you be searching for?",
        //   sublabel : "You can choose more than one job",
        //   list_title: null,
        //   ref_table_name: "field_study",
        //   is_required: true,
        //   hidden: false
        // },
        {
          // single
          type: "single",
          id: Reg.Single.where_in_malaysia,
          key_input: Reg.Single.where_in_malaysia,
          label: "Where are you from in Malaysia?",
          input_placeholder: "Cyberjaya, Selangor",
          ref_table_name: "location",
          is_required: true,
          hidden: false
        },
        {
          // free multi choice (location)
          type: "multi",
          id: Reg.Multi.interested_job_location,
          table_name: Reg.Multi.interested_job_location,
          location_suggestion: Reg.Multi.interested_job_location,
          label: "Where would you like to work in Malaysia?",
          input_placeholder: "Cyberjaya, Selangor",
          list_title: field_study
            ? `Popular job for your field of study`
            : "Popular in your area",
          ref_table_name: "location",
          is_required: true,
          hidden: false
        },
        {
          // free multi choice
          type: "multi",
          id: Reg.Multi.skill,
          table_name: Reg.Multi.skill,
          label: "What skills would you bring to your next job?",
          input_placeholder: "Leadership, Javascript, etc",
          // suggestion_search_by_ref: "major",
          // suggestion_search_by_val: major,
          //list_title: major ? `Popular job for major ${major}` : "",
          ref_order_by : "ID asc",
          ref_table_name: "skill",
          ref_offset : 11,
          is_required: true,
          hidden: false
        },
        {
          // single
          type: "single",
          input_type: "select",
          id: Reg.Single.sponsor,
          key_input: Reg.Single.sponsor,
          label: "Who is your sponsor?",
          input_placeholder: "Type something here",
          ref_table_name: "sponsor",
          is_required: false,
          hidden: false
        },
        // {
        //   // single
        //   type: "single",
        //   input_type: "textarea",
        //   id: Reg.Single.description,
        //   key_input: Reg.Single.description,
        //   label: "Tell more about yourself.",
        //   input_placeholder: "Type something here",
        //   is_required: false,
        //   hidden: false
        // }
      ]
    );

    // r = [ {
    //   // single
    //   type: "single",
    //   id: Reg.Single.university,
    //   key_input: Reg.Single.university,
    //   label: "What is your university?",
    //   input_placeholder: "Universiti Malaya",
    //   ref_table_name: "university",
    //   ref_filter_column : "country_id",
    //   ref_filter_val : country,
    //   is_required: true,
    //   hidden: false
    // },]

    return r;
  }
  isLastItem(curIndex) {
    return this.getNextItemId(curIndex) == null;
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
      // console.log("getNextItemId error", err);
      return null;
    }
    return null;
  }

  continueOnClick(e) {
    let index = e.currentTarget.dataset.index;
    let idToGo = this.getNextItemId(index);
    focusOnInput(idToGo);
    smoothScrollTo(idToGo, this.SCROLL_OFFSET);
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
  getInputLabelEl(id) {
    let elLabel = document
      .getElementById(id)
      .getElementsByClassName("input-label");

    if (elLabel.length > 0) {
      return elLabel[0];
    }
    return null;
  }
  labelBlinkRequired(id) {
    let elLabel = this.getInputLabelEl(id);
    setTimeout(() => {
      addClassEl(elLabel, "blink-required");
    }, 200);

    setTimeout(() => {
      removeClassEl(elLabel, "blink-required");
    }, 1200);
  }
  getDoneButton() {
    return (
      <div>
        <br></br>
        <br></br>
        <br></br>
        <button
          style={{ fontSize: "20px" }}
          className="btn btn-success btn-lg"
          onClick={e => {
            let arr = this.getItemEmptyAndRequired();
            if (arr.length > 0) {
              let firstEmpty = arr[0];
              focusOnInput(firstEmpty);
              smoothScrollTo(firstEmpty, this.SCROLL_OFFSET);
              this.labelBlinkRequired(firstEmpty);
            } else {
              if (this.props.completeHandler) {
                this.props.completeHandler();
              }
            }
          }}
        >
          Submit
        </button>
      </div>
    );
  }

  getInputElement(d, i, isChildren = false) {
    let isLastItem = this.isLastItem(i);
    let hideContinueButton = isLastItem;
    let discardMargin = isChildren || isLastItem;
    if (d.type == "single") {
      return [
        <InputSingle
          {...d}
          index={i}
          entity={"user"}
          entity_id={this.props.user_id}
          doneHandler={this.inputDoneHandler}
          continueOnClick={this.continueOnClick}
          isChildren={isChildren}
          hideContinueButton={
            isChildren || this.isEdit() ? true : hideContinueButton
          }
        ></InputSingle>,
        discardMargin ? null : this.MARGIN
      ];
    } else if (d.type == "multi") {
      return [
        <InputMulti
          {...d}
          index={i}
          entity={"user"}
          entity_id={this.props.user_id}
          doneHandler={this.inputDoneHandler}
          isChildren={isChildren}
          continueOnClick={this.continueOnClick}
          hideContinueButton={
            isChildren || this.isEdit() ? true : hideContinueButton
          }
        ></InputMulti>,
        discardMargin ? null : this.MARGIN
      ];
    }
  }
  render() {
    let view = this.getInputItems().map((d, i) => {
      if (d.hidden) {
        return null;
      }
      let children = this.getInputChildren(d.id);
      if (children && children.length >= 0) {
        d.children = [];
        for (var k in children) {
          d.children.push(this.getInputElement(children[k], -1, true));
        }
      }
      return this.getInputElement(d, i);
    });

    // done button
    view.push(this.getDoneButton());

    return (
      <div style={{ textAlign: "left", marginBottom: "200px" }}>
        {view}
        {/* {JSON.stringify(this.state)} */}
      </div>
    );
  }
}

ManageUserProfile.propTypes = {
  user_id: PropTypes.number.isRequired,
  completeHandler: PropTypes.func,
  isEdit: PropTypes.bool
};
