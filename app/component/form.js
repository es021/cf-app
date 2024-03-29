import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { Loader } from "./loader";
import { ButtonLink } from "./buttons.jsx";
import { ImgConfig } from "../../config/app-config";
import { getAllCF } from "../redux/actions/auth-actions";
import InputSuggestion from "./input-suggestion";
import { lang } from "../lib/lang";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// require('../css/form.scss');

export function isValueEmpty(v) {
  return v == "" || typeof v === "undefined" || v == null;
}
export function toggleSubmit(obj, newState = {}) {
  obj.setState(prevState => {
    newState.disableSubmit = !prevState.disableSubmit;
    return newState;
  });
}

export function getDataCareerFair(type) {
  var ret = [];
  let CareerFair = getAllCF();
  for (var cf in CareerFair) {
    var d = CareerFair[cf];

    if (type == "login" && !d.can_login) {
      continue;
    }

    if (type == "register" && !d.can_register) {
      continue;
    }

    var newD = {
      key: cf,
      label: (
        <span>
          {/* <img src={ImgConfig.getFlag(d.flag, 24)}></img> */}
          <b>{`[ ${d.name} ]`}</b>{" - "}{d.title}
        </span>
      )
    };
    ret.push(newD);
  }
  return ret;
}

export function checkDiff(obj, original, d, discard = [], force = []) {
  var hasDiff = false;
  var update = {};

  //get differences
  for (var k in d) {
    if (discard.indexOf(k) >= 0) {
      continue;
    }

    if (force.indexOf(k) >= 0) {
      hasDiff = true;
      update[k] = d[k];
      continue;
    }

    if (typeof d[k] == "object" && typeof original[k] == "object") {
      if (JSON.stringify(d[k]) != JSON.stringify(original[k])) {
        hasDiff = true;
        update[k] = d[k];
      }
    } else if (d[k] != original[k]) {
      hasDiff = true;
      update[k] = d[k];
    }
  }

  //return;
  if (!hasDiff) {
    toggleSubmit(obj, { error: "No Changes Has Been Made" });
    return false;
  } else {
    return update;
  }
}

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.form = {};
    //this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.getSelectOptions = this.getSelectOptions.bind(this);

    this.state = {
      input_suggestion_form: {},
      isInit: true,
      multiple: {},
      warning: {}
    };

    this.hasInit = false;
  }
  onBlur(event) {
    var name = event.target.name;
    if (Object.keys(this.state.warning).length > 0) {
      this.hasError(name);
    }
  }

  hasError(defName = null) {
    // check if has warning
    var warning = {};
    var doHas = false;
    var toFocus = null;
    for (var i in this.form) {
      var w = "";
      var formObj = this.form[i];
      if (formObj == null) {
        continue;
      }

      if (formObj.hidden === true) {
        continue;
      }

      var name = formObj.name;
      var value = formObj.value;
      //console.log(name,value);
      if (defName !== null && name != name) {
        continue;
      }

      if (formObj.type == "number" && value == "" && formObj.required) {
        w = "Please enter a number";
      } else if (formObj.type == "email" && value != "") {
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(value)) {
          w = "Please enter a valid email";
        }
      } else if (formObj.required && value == "") {
        w = "This field is required";
      }

      if (w !== "") {
        doHas = true;
        warning[name] = w;
        if (toFocus === null) {
          toFocus = formObj;
        }

        if (formObj.type == "input_suggestion") {
          toFocus = formObj.el
        }
      }
    }

    this.setState(prevState => {
      return { warning: warning };
    });

    if (doHas && toFocus !== null && defName === null) {
      toFocus.focus();
      window.scrollBy(0, -80);
    }

    return doHas;
  }

  onSubmit(event) {
    event.preventDefault();
    var ignore = []; // to ignore multiple if any
    var data_form = {};

    if (this.hasError()) {
      return;
    }

    for (var i in this.form) {
      var formObj = this.form[i];

      if (formObj != null) {
        var name = formObj.name;
        var value = formObj.value;

        if (formObj.type == "input_suggestion") {
          value = formObj.val;
        }

        //parse to Number
        if (formObj.type == "number" && value !== "") {
          try {
            value = Number.parseFloat(value);
          } catch (err) { }
        }

        // ignore the multiple
        if (ignore.indexOf(name) >= 0) {
          continue;
        }

        // handle checkbox
        if (formObj.type == "checkbox") {
          var checkboxName = name.split("::")[0];
          console.log(checkboxName);
          if (formObj.checked) {
            if (!data_form[checkboxName]) {
              data_form[checkboxName] = [];
            }
            data_form[checkboxName].push(value);
          }
          continue;
        }

        // only one can be selected
        if (formObj.type == "radio") {
          var radioName = name.split("::")[0];
          if (formObj.checked) {
            data_form[radioName] = value;
          }
          continue;
        }

        // handle multiple input
        if (this.state.multiple[name]) {
          // if the parent of multiple is not empty,
          // search for child input as well
          if (value !== "") {
            value = [value];

            this.state.multiple[name].map((d, i) => {
              var multiName = `${name}::${i + 1}`;
              var multiValue = this.form[multiName].value;
              if (multiValue != "") {
                value.push(multiValue);
              }

              ignore.push(multiName);
            });
          }
        }

        data_form[name] = value;
      }
    }

    // major change here
    this.props.onSubmit(data_form);
  }

  getSelectOptions(data) {
    return data.map((d, i) => {
      console.log(typeof d);
      var value = typeof d == "object" ? d.key : d;
      var label = typeof d == "object" ? d.label : d;

      return (
        <option key={i} value={value}>
          {label}
        </option>
      );
    });
  }

  //called in renderItem and addMultiple::onClickAdd
  getChildMultipleItem(d, index, defaultVal = "") {
    var newData = Object.assign({}, d);
    newData.name += "::" + index;
    newData.required = false;
    return this.getInputElement(newData, defaultVal);
  }

  //called in render
  addMultiple(d) {
    if (!d.multiple) {
      return null;
    }

    const onClickAdd = () => {
      this.setState(prevState => {
        var multis = prevState.multiple[d.name];
        var newItem = this.getChildMultipleItem(d, multis.length + 1);
        prevState.multiple[d.name].push(newItem);
        return prevState;
      });
    };

    const onClickRemove = () => {
      this.setState(prevState => {
        prevState.multiple[d.name].pop();
        return prevState;
      });
    };

    //init multi into state
    if (!this.state.multiple[d.name]) {
      this.state.multiple[d.name] = [];
    }

    // create multi element from state
    var multi = this.state.multiple[d.name].map((d, i) => {
      var style = { marginTop: "5px" };
      return <div style={style}>{d}</div>;
    });

    return (
      <div>
        {multi}
        <ButtonLink onClick={onClickAdd} label={`Add`}></ButtonLink>{" "}
        {this.state.multiple[d.name].length <= 0 ? null : (
          <ButtonLink onClick={onClickRemove} label={`Remove`}></ButtonLink>
        )}
      </div>
    );
  }

  emptyForm() {
    for (var i in this.form) {
      if (this.form[i] !== null) {
        if (this.form[i].disabled !== true) {
          this.form[i].value = "";
        }
      }
    }
  }
  inputSuggestionOnChange(e, name) {
    let v = "";
    if (typeof e === "string") {
      v = e;
    } else {
      v = e.target.value;
    }
    this.form[name] = {
      type: "input_suggestion",
      val: v,
      name: name,
      el: e.target
    };
    this.setState(prevState => {
      prevState.input_suggestion_form[name] = v;
      return { input_suggestion_form: prevState.input_suggestion_form };
    });
  }
  getInputElement(d, defaultVal) {
    if (this.props.success && this.props.emptyOnSuccess) {
      defaultVal = "";
      this.emptyForm();
    }
    var item = null;
    var formClass = "form-control input-sm";
    switch (d.type) {
      case "custom":
        item = (
          <div>
            {this.props.renderCustomItem(d.name)}
          </div>
        )
        break;
      case "input_suggestion":
        item = (
          <div>
            <InputSuggestion
              is_in_normal_form={true}
              {...d}
              input_val={this.state.input_suggestion_form[d.name] || this.props.defaultValues[d.name]}
              onChoose={(v, name) => {
                this.inputSuggestionOnChange(v, name);
              }}
              input_onChange={(e, name) => {
                this.inputSuggestionOnChange(e, name);
              }}
              input_onBlur={(e, name) => {
                this.inputSuggestionOnChange(e, name);
              }}
            ></InputSuggestion>
          </div>
        );
        break;
      case "textarea":
        item = (
          <textarea
            className={formClass}
            hidden={d.hidden}
            onChange={d.onChange}
            disabled={d.disabled}
            name={d.name}
            rows={d.rows ? d.rows : 4}
            required={d.required}
            placeholder={lang(d.placeholder)}
            ref={v => (this.form[d.name] = v)}
            defaultValue={defaultVal}
          ></textarea>
        );
        break;
      case "select":
        item = (
          <select
            className={formClass}
            hidden={d.hidden}
            onChange={d.onChange}
            disabled={d.disabled}
            name={d.name}
            required={d.required}
            ref={v => (this.form[d.name] = v)}
            defaultValue={defaultVal}
          >
            {this.getSelectOptions(d.data)}
          </select>
        );
        break;
      case "checkbox":
        //onChange={this.onChange}
        item = d.data.map((data, i) => {
          var name = `${d.name}::${i + 1}`;
          var checked = false;
          var disabled = false;
          if (this.props.defaultValues[d.name]) {
            checked = this.props.defaultValues[d.name].indexOf(data.key) >= 0;
            if (checked && d.disabledOnChecked) {
              disabled = true;
              data.label = (
                <div>
                  {data.label} {d.disabledOnChecked}
                </div>
              );
            }
          }
          return (
            <div key={i} className="checkbox">
              <label className="checkbox-inline">
                <input
                  onBlur={this.onBlur}
                  onChange={d.onChange}
                  disabled={d.disabled || disabled}
                  hidden={d.hidden}
                  name={name}
                  type={d.type}
                  value={data.key}
                  defaultChecked={checked}
                  min={d.min}
                  max={d.max}
                  step={d.step}
                  required={d.required}
                  placeholder={lang(d.placeholder)}
                  defaultValue={defaultVal}
                  ref={v => (this.form[name] = v)}
                />
                {typeof data.label === "string" ?
                  <span dangerouslySetInnerHTML={{ __html: data.label }}></span>
                  : data.label}
              </label>
            </div>
          );
        });
        break;
      case "radio":
        item = d.data.map((data, i) => {
          var name = `${d.name}::${i + 1}`;
          var checked = this.props.defaultValues[d.name] == data.key;
          return (
            <div key={i} className="radio">
              <label className="radio-inline">
                <input
                  onBlur={this.onBlur}
                  onChange={d.onChange}
                  disabled={d.disabled}
                  hidden={d.hidden}
                  name={d.name}
                  type={d.type}
                  value={data.key}
                  defaultChecked={checked}
                  min={d.min}
                  max={d.max}
                  step={d.step}
                  required={d.required}
                  placeholder={lang(d.placeholder)}
                  defaultValue={defaultVal}
                  ref={v => (this.form[name] = v)}
                />
                {lang(data.label)}
              </label>
            </div>
          );
        });
        break;
      case "richtext":
        item = <ReactQuill
          placeholder={d.placeholder}
          theme="snow" value={defaultVal} onChange={(v) => {
            this.form[d.name] = {
              value: v,
              type: d.type,
              name: d.name,
              required: d.required,
              disabled: d.disabled,
              hidden: d.hidden,
            };
            if (d.onChange) {
              d.onChange(v);
            }
          }} />
        break;
      default:
        //onChange={this.onChange}
        item = (
          <input
            className={formClass}
            onBlur={this.onBlur}
            onChange={d.onChange}
            disabled={d.disabled}
            hidden={d.hidden}
            name={d.name}
            type={d.type}
            maxLength={d.len}
            min={d.min}
            max={d.max}
            step={d.step}
            required={d.required}
            placeholder={d.placeholder}
            defaultValue={defaultVal}
            ref={v => (this.form[d.name] = v)}
          />
        );
        break;
    }

    if (item !== null) {
      return item;
    } else {
      return null;
    }
  }

  //called in render
  getWarning(d) {
    if (!this.state.warning[d.name]) {
      return null;
    }

    return <div className="form-warning">{this.state.warning[d.name]}</div>;
  }

  //called in render
  renderItem(d) {
    //default value
    var defaultVal = "";

    if (this.props.defaultValues) {
      defaultVal = this.props.defaultValues[d.name];
      //default value for multiple
      if (d.multiple) {
        try {
          var defArray = JSON.parse(defaultVal);

          //the first item is parent
          defaultVal = defArray[0];

          //if have def array then add new item
          if (defArray !== null) {
            var newState = [];
            defArray.map((data, i) => {
              if (i > 0) {
                newState.push(this.getChildMultipleItem(d, i, data));
              }
            });

            if (this.state.isInit) {
              this.setState(prevState => {
                prevState.multiple[d.name] = newState;
                prevState.isInit = false;
                return prevState;
              });
            }
          }
        } catch (err) {
          console.log("Failed to parse multiple default value");
          //console.log(err);
          defaultVal = defaultVal;
        }
      }

      if (typeof defaultVal === "undefined" || defaultVal == null) {
        defaultVal = "";
      }
    }

    return this.getInputElement(d, defaultVal);
  }

  render() {
    //console.log("render form", this.props.defaultValues);
    // 1. form items ---------
    var formItems = this.props.items.map((d, i) => {
      // a. label ------
      var label = null;

      if (d.label != null && d.hidden !== true && d.hideLabel !== true && !d.is_resume && !d.is_accept_checkbox) {
        label = (
          <div className="form-label">
            {lang(d.label)}
            {d.required ? " *" : null}
          </div>
        );
      }

      //b. sublabel ----
      var sublabel =
        (d.sublabel || d.hint) && d.hidden !== true ? (
          <div className="form-sublabel">{lang(d.sublabel ? d.sublabel : d.hint)}</div>
        ) : null;

      // bootstrap form class
      //var formClass = "form-item form-group";
      var formClass = "form-group";
      if (this.state.warning[d.name]) {
        formClass += " has-feedback has-error";
      }

      return d.header ? (
        <div className={"form-header " + this.props.headerClassName} key={i}>
          {lang(d.header)}
        </div>
      ) : (
        <div className={"form-item " + this.props.itemClassName} >
          {lang(label)}
          {lang(sublabel)}
          <div className={formClass} key={i}>
            <div className="form-input">
              {this.renderItem(d)}
              {this.addMultiple(d)}
            </div>
            {this.getWarning(d)}
          </div>
        </div>
      );
    });

    // 2. form submit ---------
    var disableSubmit = this.props.disableSubmit;
    var submitText = this.props.submitText ? this.props.submitText : "Submit";
    if (disableSubmit) {
      submitText = <Loader text_pos="right" text={lang("Please Wait")}></Loader>;
    }

    var formSubmit = (
      <div className={"form-submit " + this.props.headerClassName}>
        <button
          type="submit"
          className={`btn btn-md btn-${this.props.btnColorClass}`}
          disabled={disableSubmit}
        >
          {lang(submitText)}
        </button>
      </div>
    );

    // 3. form error ---------
    var formError = this.props.error ? (
      <div className="form-error alert alert-danger">{lang(this.props.error)} </div>
    ) : null;

    // 4. form success ---------
    if (this.props.success) {
      window.scrollTo(0, 0);
    }
    var formSuccess = this.props.success ? (
      <div className="form-error alert alert-success">
        {this.props.success}{" "}
      </div>
    ) : null;

    return (
      <form
        noValidate="novalidate"
        className={this.props.className}
        onSubmit={this.onSubmit}
      >
        {this.props.contentTop}
        {formSuccess}
        {this.props.errorPosition === "top" ? formError : null}
        <div className="form-item-container">{formItems}</div>
        {this.props.errorPosition !== "top" ? formError : null}
        {this.props.contentBeforeSubmit}
        {this.props.hideSubmit ? null : formSubmit}
        {this.props.contentBottom}
      </form>
    );
  }
}
Form.propTypes = {
  contentBottom: PropTypes.object,
  contentBeforeSubmit: PropTypes.object,
  hideSubmit: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired, //function(data_form)
  //[{header} | {name,type,required,placeholder,rows,defaultValue}]
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  className: PropTypes.oneOf(["form-row", "form-col"]),
  disableSubmit: PropTypes.bool.isRequired,
  submitText: PropTypes.string,
  btnColorClass: PropTypes.string,
  itemClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  defaultValues: PropTypes.object,
  errorPosition: PropTypes.oneOf(["top"]),
  error: PropTypes.string,
  emptyOnSuccess: PropTypes.bool,
  success: PropTypes.string
};

Form.defaultProps = {
  hideSubmit: false,
  defaultValues: {},
  btnColorClass: "primary"
};
