import React, { Component } from "react";
import PropTypes from "prop-types";
import PageSection from "../component/page-section";
import { NavLink } from "react-router-dom";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { Loader } from "../component/loader";
import {
  getAuthUser,
  isRoleRec,
  isRoleStudent,
  isRoleAdmin,
  doAfterValidateComingSoon
} from "../redux/actions/auth-actions";
import { emitQueueStatus, emitHallActivity } from "../socket/socket-client";
require("../css/action-box.scss");


// Ask a Question style instagram
export default class ActionBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideSubmit: true
    };
    this.inputName = "inputName";
    this.inputPlaceHolder = "Type here";
    this.inputRef = null;
    this.inputVal = "";
  }

  componentWillMount() { }

  v_Input() {
    const onChange = () => {
      let v = this.inputRef.value;
      this.inputVal = v;
      if (v == "" || v == null) {
        // empty
        this.setState(prevState => {
          return { hideSubmit: true };
        });
      }

      if (this.state.hideSubmit) {
        this.setState(prevState => {
          return { hideSubmit: false };
        });
      }
    };
    var formClass = "form-control input-sm";
    var input = (
      <textarea
        className={formClass}
        onChange={() => {
          onChange();
        }}
        name={this.inputName}
        rows={1}
        placeholder={this.inputPlaceHolder}
        ref={r => (this.inputRef = r)}
      />
    );

    return input;
  }
  v_BtnSubmit() {
    const onClickSubmit = () => {
      if (this.props.qs_onSubmit) {
        this.props.qs_onSubmit(this.inputVal);
      }
    };
    return this.state.hideSubmit ? null : (
      <button
        className={`btn btn-sm btn-block btn-${this.props.btnClass}`}
        onClick={() => {
          onClickSubmit();
        }}
      >
        Submit
      </button>
    );
  }
  v_BtnClick() {
    const onClickBtn = () => {
      const doAction = () => {
        if (this.props.btn_onClick) {
          this.props.btn_onClick();
        }
        if (this.props.isNavLink) {
          this.props.history.push(this.props.navlink_url);
        }
      }

      if (this.props.isDoAfterComingSoon) {
        doAfterValidateComingSoon(doAction);
      } else {
        doAction();
      }
    };
    return (
      <button
        className={`btn btn-sm btn-block btn-${this.props.btnClass}`}
        onClick={() => {
          onClickBtn();
        }}
      >
        Click Here
      </button>
    );
  }
  render() {
    return (
      <div className="action-box">
        <div className="ab-title">{this.props.title}</div>
        {this.props.isQuestion ? (
          <div className="ab-input">{this.v_Input()}</div>
        ) : null}
        {this.props.isQuestion ? (
          <div className="ab-btn-submit">{this.v_BtnSubmit()}</div>
        ) : null}
        {this.props.isButton ? (
          <div className="ab-btn-click">{this.v_BtnClick()}</div>
        ) : null}
        {this.props.isNavLink ? (
          <div className="ab-btn-click">{this.v_BtnClick()}</div>
          // <NavLink className="ab-btn-click" to={this.props.navlink_url}>{this.v_BtnClick()}</NavLink>
        ) : null}
      </div>
    );
  }
}

ActionBox.propTypes = {
  isDoAfterComingSoon: PropTypes.bool,
  title: PropTypes.string.isRequired,

  isNavLink: PropTypes.bool,
  navlink_url: PropTypes.string,

  isQuestion: PropTypes.bool,
  qs_onSubmit: PropTypes.func,

  isButton: PropTypes.bool,
  btn_onClick: PropTypes.func,

  btnClass: PropTypes.string
};

ActionBox.defaultProps = {
  isDoAfterComingSoon: false,
  isQuestion: false,
  isButton: false,
  isNavLink: false,
  btnClass: "success"
};
