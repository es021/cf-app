import React, { Component } from "react";
import { graphql } from "../../helper/api-helper";
import PropTypes from "prop-types";

export default class SuggestionInput extends React.Component {
  constructor(props) {
    super(props);

    // constant
    this.START_FETCH_LEN = 2;

    // fn binding
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClickSuggestion = this.onClickSuggestion.bind(this);

    // state
    this.state = {
      showSuggestion: false,
      suggestion: []
    };
  }
  componentWillMount() {}
  onBlur(e) {
    console.log("onBlur", e);
    setTimeout(() => {
      this.setState(prevState => {
        return { showSuggestion: false };
      });
    }, 150);
  }
  onFocus(e) {
    console.log("onFocus", e);
    this.setState(prevState => {
      return { showSuggestion: true };
    });
  }
  onChange(e) {
    // console.log("onChange", e);
    // console.log(this.ref.value);
    let v = this.ref.value;
    if (v.length > this.START_FETCH_LEN) {
      this.fetchSuggestion(v);
    } else {
      this.setState(prevState => {
        return { suggestion: [] };
      });
    }
  }
  onClickSuggestion(e) {
    let v = e.currentTarget.dataset.v;
    this.ref.value = "";

    console.log("v", v);
  }
  fetchSuggestion(v) {
    let q = `query{ 
      multi_refs(table_name :"${this.props.table_name}", val:"${v}", page:1, offset:10) {
        val
      }
    }`;

    graphql(q).then(res => {
      this.setState(prevState => {
        let fetchedData = res.data.data.multi_refs;
        if (fetchedData.length == 0) {
          fetchedData.push({ val: v });
        }
        return { suggestion: fetchedData, showSuggestion: true };
      });
    });
  }
  getSuggestionView() {
    if (this.state.suggestion.length <= 0 || !this.state.showSuggestion) {
      return null;
    } else {
      let inserted = [];
      let suggestion = this.state.suggestion.map((d, i) => {
        let val = d.val;
        if (inserted.indexOf(val) <= -1) {
          inserted.push(val);
          return (
            <li data-v={val} onClick={this.onClickSuggestion}>
              {d.val}
            </li>
          );
        }
      });
      let v = <ul>{suggestion}</ul>;
      return v;
    }
  }
  render() {
    var d = {};
    return (
      <div className="suggestion-input">
        <div className="input-field">
          <input
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onChange={this.onChange}
            disabled={d.disabled}
            hidden={d.hidden}
            name={d.name}
            type={d.type}
            value={d.value}
            required={d.required}
            placeholder={d.placeholder}
            ref={r => {
              this.ref = r;
            }}
          />
          <div className="suggestion-list">{this.getSuggestionView()}</div>
        </div>
      </div>
    );
  }
}

SuggestionInput.propTypes = {
  table_name: PropTypes.string,
  onChoose: PropTypes.func
};
