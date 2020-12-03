import React, { Component } from "react";
import InputMulti from "../../../component/input-multi";
import InputSingle from "../../../component/input-single";
import * as Reg from "../../../../config/registration-config";
import { RefLocalOrOversea } from "../../../../config/db-config";
import {
  smoothScrollTo,
  focusOnInput,
  addClassEl,
  removeClassEl
} from "../../../../app/lib/util";
import PropTypes from "prop-types";
import { isRoleStudent, isRoleRec, getCF } from "../../../redux/actions/auth-actions";
import { lang, isCurrentEnglish } from "../../../lib/lang";

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
    } catch (err) { }
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
        input_placeholder: lang("Last Name"),
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
        ref_order_by: "ID asc",
        is_required: true,
        hidden: false
      }
    ];
    r[Reg.Single.working_availability_month] = [
      {
        // single
        type: "single",
        input_type: "select",
        id: Reg.Single.working_availability_year,
        key_input: Reg.Single.working_availability_year,
        ref_table_name: "year",
        ref_filter_raw: "val >= 2020",
        is_required: true,
        hidden: false
      }
    ];

    return r[id];
  }
  // 2. @custom_user_info_by_cf
  getInputItems() {
    let field_study = this.getFieldStudyListStr();
    let country = this.state.currentData[Reg.Single.country_study];
    let local_or_oversea_study = this.state.currentData[Reg.Single.local_or_oversea_study];
    let cf = getCF();
    let r = [];
    if (this.isEdit()) {
      r.push({
        // single
        type: "single",
        label: lang("What is your name?"),
        id: Reg.Single.first_name,
        key_input: Reg.Single.first_name,
        input_placeholder: lang("First Name"),
        is_required: true,
        hidden: false
      });
    }
    r.push(
      ...[
        {
          // single
          type: "single",
          input_type: "text",
          label: lang("Student ID"),
          id: Reg.Single.monash_student_id,
          key_input: Reg.Single.monash_student_id,
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.monash_student_id)
        },
        {
          // single
          type: "single",
          input_type: "text",
          label: lang("Matrix No / UTM Acid ID"),
          id: Reg.Single.id_utm,
          key_input: Reg.Single.id_utm,
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.id_utm)
        },
        {
          // single
          type: "single",
          input_type: "text",
          label: lang("Matrix Number"),
          id: Reg.Single.id_unisza,
          key_input: Reg.Single.id_unisza,
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.id_unisza)
        },
        {
          // single
          type: "single",
          input_type: "text",
          label: lang("IC Number"),
          id: Reg.Single.kpt,
          key_input: Reg.Single.kpt,
          is_required: false,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.kpt)
        },
        {
          // single
          type: "single",
          input_type: "date",
          label: lang("Date Of Birth"),
          id: Reg.Single.birth_date,
          key_input: Reg.Single.birth_date,
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.birth_date)
        },

        {
          // single
          type: "single",
          input_type: "select",
          label: lang("When is your graduation date?"),
          id: Reg.Single.graduation_month,
          key_input: Reg.Single.graduation_month,
          select_is_translate_label: true,
          // select_use_id_as_value: true,
          ref_order_by: "ID asc",
          ref_table_name: "month",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.graduation_month)
        },
        {
          // defined multi choice
          type: "multi",
          id: Reg.Multi.looking_for_position,
          table_name: Reg.Multi.looking_for_position,
          label: lang("What are you looking for?"),
          ref_table_name: "looking_for_position",
          hideInputSuggestion: true,
          select_is_translate_label: true,
          ref_order_by: "ID ASC",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Multi.looking_for_position)
        },
        {
          // single
          type: "single",
          input_type: "select",
          id: Reg.Single.local_or_oversea_study,
          key_input: Reg.Single.local_or_oversea_study,
          label: lang("Where are you studying/studied?"),
          ref_table_name: "local_or_oversea",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.local_or_oversea_study)
        },
        {
          // single
          type: "single",
          id: Reg.Single.country_study,
          key_input: Reg.Single.country_study,
          label: lang("Where are you studying"),
          input_placeholder: "Malaysia",
          ref_table_name: "country",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.country_study)
        },
        {
          // single - university select Malaysia only
          // (tie with local_or_oversea_study)
          type: "single",
          input_type: "select",
          id: Reg.Single.university,
          key_input: Reg.Single.university,
          label: lang("Which university you are studying/studied?"),
          sublabel: lang("In Malaysia"),
          ref_table_name: "university",
          ref_filter_column: "country_id",
          ref_filter_val: 1, // Malaysia
          is_required: true,
          hidden: !RefLocalOrOversea.isMalaysia(local_or_oversea_study) ||
            isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.university)
        },
        {
          // single - university free text without suggestion 
          // (tie with local_or_oversea_study)
          type: "single",
          id: Reg.Single.university,
          key_input: Reg.Single.university,
          label: lang("Which university you are studying/studied?"),
          sublabel: lang("Oversea"),
          input_placeholder: "",
          ref_table_name: "university",
          is_required: true,
          hidden: !RefLocalOrOversea.isOversea(local_or_oversea_study)
            || isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.university)
        },
        {
          // single - university with suggestion
          // (tie with country)
          type: "single",
          id: Reg.Single.university,
          key_input: Reg.Single.university,
          label: lang("What is your university?"),
          input_placeholder: "Universiti Malaya",
          ref_table_name: "university",
          ref_filter_column: "country_id",
          ref_filter_val: country,
          ref_filter_find_id: true, // kena ubah kat ref-query
          is_required: true,
          hidden: !RefLocalOrOversea.isEmpty(local_or_oversea_study) ||
            isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.university)
        },
        {
          // single
          label: lang("Faculty"),
          type: "single",
          input_type: "select",
          id: Reg.Single.unisza_faculty,
          key_input: Reg.Single.unisza_faculty,
          // input_placeholder: "Malaysia",
          ref_table_name: "unisza_faculty",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.unisza_faculty)
        },
        {
          // single
          label: lang("Course of Study"),
          type: "single",
          input_type: "select",
          id: Reg.Single.unisza_course,
          key_input: Reg.Single.unisza_course,
          // input_placeholder: "Malaysia",
          ref_table_name: "unisza_course",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.unisza_course)
        },
        {
          // single
          label: lang("Current Semester"),
          type: "single",
          input_type: "select",
          id: Reg.Single.current_semester,
          key_input: Reg.Single.current_semester,
          // input_placeholder: "Malaysia",
          ref_table_name: "current_semester",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.current_semester)
        },
        {
          // single
          label: lang("Status of Study Course"),
          type: "single",
          input_type: "select",
          id: Reg.Single.course_status,
          key_input: Reg.Single.course_status,
          // input_placeholder: "Malaysia",
          ref_table_name: "course_status",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.course_status)
        },
        {
          // single
          label: lang("If you have completed your study, what is your current employment status?"),
          type: "single",
          input_type: "select",
          id: Reg.Single.employment_status,
          key_input: Reg.Single.employment_status,
          // input_placeholder: "Malaysia",
          ref_table_name: "employment_status",
          ref_order_by: "ID asc",
          is_required: false,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.employment_status)
        },
        {
          // single
          type: "single",
          input_type: "select",
          id: Reg.Single.monash_school,
          key_input: Reg.Single.monash_school,
          label: lang("Which school are you from?"),
          // input_placeholder: "Malaysia",
          ref_table_name: "monash_school",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.monash_school)
        },
        {
          // single
          type: "single",
          input_type: "select",
          id: Reg.Single.sunway_faculty,
          key_input: Reg.Single.sunway_faculty,
          label: lang("Which school are you from?"),
          // input_placeholder: "Malaysia",
          ref_table_name: "sunway_faculty",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.sunway_faculty)
        },
        {
          // single
          type: "single",
          input_type: "select",
          id: Reg.Single.sunway_program,
          key_input: Reg.Single.sunway_program,
          label: lang("What is the name of your programme?"),
          // input_placeholder: "Malaysia",
          ref_table_name: "sunway_program",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.sunway_program)
        },
        {
          // single select
          type: "single",
          input_type: "select",
          id: Reg.Single.qualification,
          key_input: Reg.Single.qualification,
          label: lang("What is your highest level of certificate?"),
          input_placeholder: lang("Type something here"),
          select_is_translate_label: true,
          ref_table_name: "qualification",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.qualification)
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
        // @limit_field_of_study_2_before_deploy - uncomment
        {
          // single
          type: "single",
          input_type: "select",
          label: lang("What is your main field of study?"),
          id: Reg.Single.field_study_main,
          key_input: Reg.Single.field_study_main,
          ref_table_name: "field_study",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.field_study_main)
        },
        // @limit_field_of_study_2_before_deploy - uncomment
        {
          // single
          type: "single",
          input_type: "select",
          label: lang("What is your secondary field of study?"),
          sublabel: lang("If Applicable"),
          id: Reg.Single.field_study_secondary,
          key_input: Reg.Single.field_study_secondary,
          ref_table_name: "field_study",
          is_required: false,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.field_study_secondary)
        },
        // @limit_field_of_study_2_before_deploy - comment
        // {
        //   // select multi choice
        //   type: "multi",
        //   input_type: "select",
        //   id: Reg.Multi.field_study,
        //   table_name: Reg.Multi.field_study,
        //   discard_ref_from_default: true,
        //   label: lang("What is your field of study?"),
        //   sublabel: lang("You can choose more than one field of study"),
        //   list_title: null,
        //   ref_table_name: "field_study",
        //   is_required: true,
        //   hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Multi.field_study)
        // },
        {
          // single
          type: "single",
          id: Reg.Single.grade,
          key_input: Reg.Single.grade,
          label: lang("What is your grade?"),
          sublabel: lang("CGPA, GPA, First Class, WAM, etc"),
          input_placeholder: lang("Type something here"),
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.grade)
        },
        {
          // single
          type: "single",
          id: Reg.Single.phone_number,
          key_input: Reg.Single.phone_number,
          label: lang("What is your phone number?"),
          input_placeholder: "XXX-XXXXXXX",
          is_required: true,
          hidden: false || Reg.isCustomUserInfoOff(cf, Reg.Single.phone_number)
        },
        {
          // single
          type: "single",
          input_type: "select",
          label: lang("When will you be available to work?"),
          id: Reg.Single.working_availability_month,
          key_input: Reg.Single.working_availability_month,
          select_is_translate_label: true,
          // select_use_id_as_value: true,
          ref_order_by: "ID asc",
          ref_table_name: "month",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.working_availability_month)
        },
        {
          // single
          type: "single",
          input_type: "select",
          id: Reg.Single.local_or_oversea_location,
          key_input: Reg.Single.local_or_oversea_location,
          label: lang("Where are you currently located?"),
          ref_table_name: "local_or_oversea",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.local_or_oversea_location)
        },
        {
          // single
          type: "single",
          input_type: "select",
          id: Reg.Single.work_experience_year,
          key_input: Reg.Single.work_experience_year,
          label: lang("How many years of relevant working experiences in Engineering field?"),
          ref_table_name: "work_experience_year",
          ref_order_by: "ID asc",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.work_experience_year)
        },
        {
          // single
          type: "single",
          input_type: "select",
          id: Reg.Single.gender,
          key_input: Reg.Single.gender,
          label: lang("What is your gender?"),
          ref_table_name: "gender",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.gender)
        },
        {
          // single select
          type: "single",
          input_type: "select",
          id: Reg.Single.unemployment_period,
          key_input: Reg.Single.unemployment_period,
          label: lang("How long have you been unemployed?"),
          ref_table_name: "unemployment_period",
          ref_order_by: "ID asc",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.unemployment_period)
        },

        {
          // free multi choice
          type: "multi",
          id: Reg.Multi.interested_role,
          table_name: Reg.Multi.interested_role,
          label: lang("What types of jobs are you interested in?"),
          // label: "What types of jobs will you be searching for?",
          input_placeholder: lang("Web Developer, Graphic Design, etc"),
          list_title: field_study ? lang(`Popular job for your field of study`) : "",
          // ref_table_name: isCurrentEnglish() ? "job_role" : "empty",
          ref_table_name: "job_role",
          suggestion_search_by_ref: "field_study", // ref suggestion by table refmap_suggestion
          suggestion_search_by_val: field_study, //  ref suggestion by table refmap_suggestion
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Multi.interested_role)
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
          label: lang("Where are you from in Malaysia?"),
          input_placeholder: "Cyberjaya, Selangor",
          ref_table_name: "location_malaysia",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Single.where_in_malaysia)
        },
        {
          // free multi choice (location)
          type: "multi",
          id: Reg.Multi.interested_job_location,
          table_name: Reg.Multi.interested_job_location,
          location_suggestion: Reg.Multi.interested_job_location,
          label: lang("Where would you like to work in Malaysia?"),
          input_placeholder: "Cyberjaya, Selangor",
          list_title: field_study
            ? lang(`Popular location for your field of study`)
            : lang("Popular in your area"),
          ref_table_name: "location",
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Multi.interested_job_location)
        },
        {
          // free multi choice
          type: "multi",
          id: Reg.Multi.skill,
          table_name: Reg.Multi.skill,
          label: lang("What skills would you bring to your next job?"),
          input_placeholder: lang("Leadership, Javascript, etc"),
          // suggestion_search_by_ref: "major",
          // suggestion_search_by_val: major,
          //list_title: major ? `Popular job for major ${major}` : "",
          ref_order_by: "ID asc",
          ref_table_name: "skill",
          ref_offset: 11,
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Multi.skill)
        },
        {
          // free multi choice
          type: "multi",
          id: Reg.Multi.extracurricular,
          table_name: Reg.Multi.extracurricular,
          label: lang("Organization / Extracurricular Activities"),
          input_placeholder: "",
          ref_order_by: "ID asc",
          ref_table_name: "extracurricular",
          ref_offset: 11,
          is_required: true,
          hidden: isRoleRec() || Reg.isCustomUserInfoOff(cf, Reg.Multi.extracurricular)
        },
        // {
        //   // single
        //   type: "single",
        //   input_type: "select",
        //   id: Reg.Single.sponsor,
        //   key_input: Reg.Single.sponsor,
        //   label: "Who is your sponsor?",
        //   input_placeholder: "Type something here",
        //   ref_table_name: "sponsor",
        //   is_required: false,
        //   hidden: false
        // },
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

    r = Reg.pickAndReorderByCf(cf, r);
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
      <div style={{ marginLeft: "7px" }}>
        <br></br>
        <br></br>
        <br></br>
        {this.props.contentBeforeSubmit}
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
          {lang("Submit")}
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
      if (!d) {
        return null;
      }
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
  contentBeforeSubmit: PropTypes.object,
  user_id: PropTypes.number.isRequired,
  completeHandler: PropTypes.func,
  isEdit: PropTypes.bool
};
