import React, { Component } from "react";
import PropTypes from "prop-types";
import { graphql } from "../../helper/api-helper";
import { Loader } from "./loader";
import * as layoutAction from "../redux/actions/layout-actions";
import Form from "./form";

export default class InputEditable extends Component {
  constructor(props) {
    super(props);
    this.openEditPopup = this.openEditPopup.bind(this);
    this.state = {
      loading: false,
      val: this.props.val
    };
    this.FIX_FORM_NAME = "FIX_FORM_NAME"
  }
  showError(err) {
    alert(err);
  }
  componentWillMount() { }
  // getFormEdit() {
  //   let defaultValues = {};
  //   defaultValues[this.FIX_FORM_NAME] = this.state.val;

  //   let form = <Form
  //     className="form-row"
  //     items={this.props.formItems(this.FIX_FORM_NAME)}
  //     defaultValues={defaultValues}
  //     onSubmit={(d) => {
  //       let newVal = null;
  //       if (this.props.formWillSubmit) {
  //         let res = this.props.formWillSubmit(d);
  //         if (res.error) {
  //           this.showError(res.error);
  //           return;
  //         } else {
  //           newVal = res.val
  //         }
  //       } else {
  //         newVal = d[this.FIX_FORM_NAME];
  //       }

  //       this.closeEditPopup();
  //       if (newVal != this.state.val) {
  //         this.submitEdit(newVal);
  //       }
  //     }}
  //     submitText="Save"
  //   ></Form>
  //   return form;
  // }
  openEditPopup() {
    let defaultValues = {};
    defaultValues[this.FIX_FORM_NAME] = this.state.val;

    // create focus card
    let focusCardClass = "popup-input-editable";
    let focusCardProps = {
      className: "form-row",
      items: this.props.formItems(this.FIX_FORM_NAME),
      defaultValues: defaultValues,
      onSubmit: (d) => {
        let newVal = null;
        if (this.props.formWillSubmit) {
          let res = this.props.formWillSubmit(d);
          if (res.error) {
            layoutAction.errorBlockLoader(res.error);
            return;
          } else {
            newVal = res.val
          }
        } else {
          newVal = d[this.FIX_FORM_NAME];
        }

        this.closeEditPopup();
        if (newVal != this.state.val) {
          this.submitEdit(newVal);
        }

        if (this.props.formDidSubmit) {
          this.props.formDidSubmit(d);
        }
      },
      submitText: "Save"
    };

    // open focus card
    layoutAction.storeUpdateFocusCard(this.props.editTitle,
      Form, focusCardProps, focusCardClass
    );

    // layoutAction.customBlockLoader(this.props.editTitle, null, null, null, noClose, form);
  }
  closeEditPopup() {
    layoutAction.storeHideFocusCard()
  }
  submitEdit(newVal) {
    this.setState({ loading: true })
    let q = this.props.query(this.props.data, newVal);
    graphql(q).then((res) => {
      this.setState({ loading: false, val: newVal })
      if (this.props.queryDone) {
        this.props.queryDone(res)
      }
    })
  }
  render() {
    return this.props.render(this.state.val, this.state.loading, this.openEditPopup)
  }
}


InputEditable.propTypes = {
  editTitle: PropTypes.string,
  formItem: PropTypes.object,
  val: PropTypes.any,
  data: PropTypes.object,
  render: PropTypes.func,
  query: PropTypes.func,
  queryDone: PropTypes.func,
  formDidSubmit: PropTypes.func,
  formWillSubmit: PropTypes.func, // return {val, error}
};

InputEditable.defaultProps = {

};
