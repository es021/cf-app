import React, { Component } from "react";
import { graphql } from "../../helper/api-helper";
import PropTypes from "prop-types";

export default class InputSuggestion extends React.Component {
  constructor(props) {
    super(props);

    // constant
    this.START_FETCH_LEN = 2;

    // fn binding
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClickSuggestion = this.onClickSuggestion.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    // state
    this.state = {
      highlightIndex: null,
      showSuggestion: false,
      suggestion: []
    };
  }
  componentWillMount() {}
  closeSuggestionList() {
    setTimeout(() => {
      this.setState(prevState => {
        return { showSuggestion: false, highlightIndex: null };
      });
    }, 150);
  }
  emptySuggestionList() {
    setTimeout(() => {
      this.setState(prevState => {
        return { suggestion: [], highlightIndex: null };
      });
    }, 150);
  }
  iterateHighlightedIndex(offset) {
    this.setState(prevState => {
      let v = prevState.highlightIndex;
      if (v == null) {
        v = 0;
      } else {
        v += offset;
      }

      if (v < 0) {
        v = 0;
      } else if (v >= prevState.suggestion.length) {
        v = prevState.suggestion.length - 1;
      }

      return { highlightIndex: v };
    });
  }
  onKeyDown(e) {
    // console.log("onKeyDown", e.key);
    switch (e.key) {
      case "ArrowDown":
        this.iterateHighlightedIndex(1);
        break;
      case "ArrowUp":
        this.iterateHighlightedIndex(-1);
        break;
      case "Enter":
        let v = null;
        if (
          this.state.highlightIndex != null &&
          this.state.highlightIndex >= 0 &&
          this.state.highlightIndex <= this.state.suggestion.length - 1
        ) {
          let obj = this.state.suggestion[this.state.highlightIndex];
          v = obj.val;
        } else if (this.state.suggestion.length == 1) {
          let obj = this.state.suggestion[0];
          v = obj.val;
        }
        // console.log("enter", v);
        if (v != null && typeof v === "string") {
          v = v.capitalizeAll();
          this.onClickSuggestion(null, v);
        }
        break;
    }
  }
  onBlur(e) {
    // console.log("onBlur", e);
    this.closeSuggestionList();

    if (this.props.input_onBlur) {
      this.props.input_onBlur(e);
    }
  }
  onFocus(e) {
    // console.log("onFocus", e);
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

    if (this.props.input_onChange) {
      this.props.input_onChange(e);
    }
  }
  onClickSuggestion(e, customVal = null) {
    let v = "";
    if (
      customVal != null
      // kalau ada satu je
    ) {
      v = customVal;
    } else {
      v = e.currentTarget.dataset.v;
    }

    this.ref.value = "";
    this.emptySuggestionList();

    if (this.props.onChoose) {
      this.props.onChoose(v);
    }
  }
  fetchSuggestion(v) {
    let q = `query{ 
      refs(table_name :"${this.props.table_name}", val:"${v}", page:1, offset:10) {
        val
      }
    }`;

    graphql(q).then(res => {
      this.setState(prevState => {
        let suggestion = res.data.data.refs;
        if (suggestion.length == 0) {
          suggestion.push({ val: v });
        } else {
          let inserted = [];

          // filter same val
          let filteredSuggestion = [];
          for (var i in suggestion) {
            let d = suggestion[i];
            let val = d.val;
            if (inserted.indexOf(val) >= 0) {
              continue;
            } else {
              inserted.push(val);
              filteredSuggestion.push(d);
            }
          }
          suggestion = filteredSuggestion;
        }

        return { suggestion: suggestion, showSuggestion: true };
      });
    });
  }
  getSuggestionView() {
    if (this.state.suggestion.length <= 0 || !this.state.showSuggestion) {
      return null;
    } else {
      let suggestion = this.state.suggestion.map((d, i) => {
        let val = d.val;
        let className = this.state.highlightIndex == i ? "highlight" : "";
        return (
          <li
            className={className}
            data-v={val}
            onClick={this.onClickSuggestion}
          >
            {d.val}
          </li>
        );
      });

      let v = <ul>{suggestion}</ul>;
      return v;
    }
  }
  render() {
    var d = {};
    return (
      <div onKeyDown={this.onKeyDown} className="input-suggestion">
        <div className="input-field">
          <input
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onChange={this.onChange}
            disabled={d.disabled}
            hidden={d.hidden}
            name={d.name}
            type={"text"}
            value={this.props.input_val}
            required={d.required}
            placeholder={this.props.input_placeholder}
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

InputSuggestion.propTypes = {
  input_onChange: PropTypes.func,
  input_onBlur: PropTypes.func,
  input_val: PropTypes.string,
  input_placeholder: PropTypes.string,
  table_name: PropTypes.string,
  onChoose: PropTypes.func
};
