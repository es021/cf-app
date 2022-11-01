import React, { Component } from "react";
import InputMulti from "../../../component/input-multi";
import InputSingle from "../../../component/input-single";
import * as Reg from "../../../../config/registration-config";
import { UploadUrl } from '../../../../config/app-config.js';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import * as layoutActions from "../../../redux/actions/layout-actions";

import obj2arg from 'graphql-obj2arg';
import { RefLocalOrOversea, DocLink } from "../../../../config/db-config";
import {
  smoothScrollTo,
  focusOnInput,
  addClassEl,
  removeClassEl
} from "../../../../app/lib/util";
import PropTypes from "prop-types";
import { isRoleStudent, isRoleRec, getCF, getNoMatrixLabel, getAuthUser, isRoleOrganizer } from "../../../redux/actions/auth-actions";
import { lang, isCurrentEnglish } from "../../../lib/lang";
import { cfCustomFunnel } from "../../../../config/cf-custom-config";
import { FileType, Uploader, uploadFile } from "../../../component/uploader";
import UserFieldHelper from "../../../../helper/user-field-helper";

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
      currentResume: null,
      isEmptyAndRequired: {},
      currentData: {},
      inputItems: null,
    }
  }
  async componentWillMount() {
    this.setState({
      inputItems: UserFieldHelper.getProfileItems(getCF())
    })
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
  getInputChildren(id, childrenOf) {
    let r = {
    };

    // TODO HERE
    for (let item of childrenOf) {
      if (item["children_of"] == id) {
        if (!r[id]) {
          r[id] = []
        }
        r[id].push(item);
      }
    }

    console.log("childrenOf", childrenOf);

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
        ref_table_name: "year_latest",
        ref_order_by: "ID asc",
        // ref_filter_raw: "val >= 2020 or val = 'Not Applicable' ",
        is_required: true,
        hidden: false
      }
    ];

    return r[id];
  }
  // 2. @custom_user_info_by_cf
  getInputItems() {
    // let currentData = JSON.parse(JSON.stringify(this.state.currentData));
    // let cf = getCF();
    // let r = [];

    return this.state.inputItems;
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
    console.log("inputDoneHandler", id, meta);
    console.log("inputDoneHandler", id, meta);
    console.log("inputDoneHandler", id, meta);

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
            } else if (this.isUploadResumeRequired() && this.isHasUploadResume() && !this.state.currentResume) {
              layoutActions.errorBlockLoader("Please upload your resume");
            } else {
              if (this.isHasUploadResume() && this.state.currentResume) {
                layoutActions.loadingBlockLoader("Uploading resume");
                this.uploadFileAndSaveToDB({
                  label: "Resume",
                  user_id: this.props.user_id,
                  file: this.state.currentResume,
                  succes: () => {
                    layoutActions.storeHideBlockLoader();
                    if (this.props.completeHandler) {
                      this.props.completeHandler();
                    }
                  },
                  error: (err) => {
                    layoutActions.storeHideBlockLoader();
                    alert(`${err}`);
                  }
                })
              } else {
                if (this.props.completeHandler) {
                  this.props.completeHandler();
                }
              }
            }
          }}
        >
          {lang("Submit")}
        </button>
      </div>
    );
  }

  getUploadResume() {
    if (!this.isHasUploadResume()) {
      return null;
    }
    var uploader = <Uploader
      formClass="form-file-custom"
      label={lang(("Upload Your Resume") + (this.isUploadResumeRequired() ? " *" : ""))}
      name="resume"
      type={FileType.DOC}
      onSuccess={(file) => {
        this.setState(() => {
          return { currentResume: file };
        });
      }}
      onChange={(event) => { }}
      onError={(err) => {
        layoutActions.errorBlockLoader(err)
      }}></Uploader>

    return (<div>{this.MARGIN}{uploader}</div>);
  }

  isUploadResumeRequired() {
    return Reg.IsUploadResumeRequired.indexOf(getCF()) >= 0;
  }

  isHasUploadResume() {
    // return true;
    let validCF = Reg.IsHasUploadResume;
    return !this.props.isEdit && validCF.indexOf(getCF()) >= 0;
  }

  uploadFileAndSaveToDB({ label, user_id, file, succes, error }) {
    let labelFileName = label.replaceAll(" ", "-");
    var fileName = `${labelFileName}-${user_id}`;

    try {
      uploadFile(file, FileType.DOC, fileName).then((res) => {
        if (res.data.url !== null) {
          let url = `${UploadUrl}/${res.data.url}`;
          let d = {
            user_id: user_id,
            type: FileType.DOC,
            label: label,
            url: url,
          }
          var query = `mutation{ add_doc_link (${obj2arg(d, { noOuterBraces: true })}){ID}}`
          getAxiosGraphQLQuery(query).then((res) => {
            succes()
          });
        } else {
          if (error) {
            error("Failed to upload resume")
          }
        }
      }).catch((err => {
        if (error) {
          error(err)
        }
      }));
    } catch (err) {
      if (error) {
        error(err)
      }
    }
  }

  getInputElement(d, i, isChildren = false) {
    let isLastItem = this.isLastItem(i);
    let hideContinueButton = isLastItem;
    let discardMargin = isChildren || isLastItem;
    if (d.type == "single") {
      return [
        // <div>DEBUG : {d.id}</div>,
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
        ></InputSingle>
        ,
        discardMargin ? null : this.MARGIN
      ];
    } else if (d.type == "multi") {
      return [
        // <div>DEBUG : {d.id}</div>,
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
        ></InputMulti>
        ,
        discardMargin ? null : this.MARGIN
      ];
    }
  }

  filterInputItems(items) {
    let formItems = [];
    let childrenOf = [];

    for (let d of items) {
      if (d.children_of) {
        childrenOf.push(d);
      } else {
        formItems.push(d);
      }
    }

    return {
      formItems, childrenOf
    }
  }

  render() {
    let items = this.getInputItems();
    if (!items) {
      return null;
    }

    let { formItems, childrenOf } = this.filterInputItems(items)
    let view = formItems.map((d, i) => {
      if (!d) {
        return null;
      }
      if (d.hidden) {
        return null;
      }
      let children = this.getInputChildren(d.id, childrenOf);
      if (children && children.length >= 0) {
        d.children = [];
        for (var k in children) {
          d.children.push(this.getInputElement(children[k], -1, true));
        }
      }
      return this.getInputElement(d, i);
    });

    // upload resume
    view.push(this.getUploadResume());
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
