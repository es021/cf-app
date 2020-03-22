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
  componentWillMount() { }
  getFormEdit() {
    let defaultValues = {};
    defaultValues[this.FIX_FORM_NAME] = this.state.val;

    let form = <Form
      className="form-row"
      items={this.props.formItems(this.FIX_FORM_NAME)}
      defaultValues={defaultValues}
      onSubmit={(d) => {
        let newVal = d[this.FIX_FORM_NAME];
        
        this.closeEditPopup();
        if (newVal != this.state.val) {
          this.submitEdit(newVal);
        }
      }}
      submitText="Save"
    ></Form>
    return form;
  }
  openEditPopup() {
    let form = this.getFormEdit();
    let noClose = false;
    layoutAction.customBlockLoader(this.props.editTitle, null, null, null, noClose, form);
  }
  closeEditPopup() {
    layoutAction.storeHideBlockLoader()
  }
  submitEdit(newVal) {
    this.setState({ loading: true })
    let q = this.props.query(this.props.data, newVal);
    graphql(q).then((res) => {
      this.setState({ loading: false, val: newVal })

    })
  }
  render() {
    return this.props.render(this.state.val, this.state.loading, this.openEditPopup)
  }
}


InputEditable.propTypes = {
  editTitle : PropTypes.string,
  formItem: PropTypes.object,
  val: PropTypes.any,
  data: PropTypes.object,
  render: PropTypes.func,
  query: PropTypes.func,
};

InputEditable.defaultProps = {

};
