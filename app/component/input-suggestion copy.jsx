import React, { Component } from "react";
import { graphql } from "../../helper/api-helper";
import PropTypes from "prop-types";

export default class InputSuggestion extends React.Component {
  constructor(props) {
    super(props);

    // constant
    this.START_FETCH_LEN = 2;

    // fn binding
    this.getSelectOptions = this.getSelectOptions.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClickSuggestion = this.onClickSuggestion.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.ref = {};

    // state
    this.state = {
      highlightIndex: null,
      showSuggestion: false,
      suggestion: [],
      dataset: {},
      loading: false
    };
  }
  isText() {
    return this.props.input_type == "text";
  }
  isSelect() {
    return this.props.input_type == "select";
  }
  isSelectMulti() {
    return this.props.input_type == "select_multi";
  }
  componentWillMount() {
    if (this.isSelect() || this.isSelectMulti()) {
      this.fetchDataset();
    }
  }
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
  // getValFromEl(e) {
  //   if (this.isText()) {
  //     return e.target.value;
  //   } else if (this.isSelect()) {
  //     return e.target.value;
  //   }
  // }
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

    if (this.props.input_onFocus) {
      this.props.input_onFocus(e);
    }
  }
  onChange(e) {
    // console.log("onChange", e);
    // console.log(this.ref.value);
    if (this.isSelect() || this.isSelectMulti()) {
    } else {
      let v = this.ref.value;
      if (v.length > this.START_FETCH_LEN) {
        this.fetchSuggestion(v);
      } else {
        this.setState(prevState => {
          return { suggestion: [] };
        });
      }
    }

    let v = e.target.value;
    console.log(v);
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
  fetchDataset() {
    this.setState({ loading: true });
    if (!this.props.table_name) {
      return;
    }

    let tbNames = [];

    if (!Array.isArray(this.props.table_name)) {
      tbNames = [this.props.table_name];
    } else {
      tbNames = this.props.table_name;
    }

    console.log(this.props.id, tbNames);

    let loaded = 0;
    let toLoad = tbNames.length;
    const finish = res => {
      loaded++;
      this.setState(prevState => {
        let data = res.data.data.refs;
        let table_name = data[0].table_name;
        let index = this.props.table_name.indexOf(table_name);
        prevState.dataset[index] = data;
        return { dataset: prevState.dataset };
      });

      if (loaded >= toLoad) {
        this.setState({ loading: false });
      }
    };

    for (var i in tbNames) {
      let q = `query{ 
        refs(table_name :"${tbNames[i]}") {
          val table_name
        }
      }`;

      graphql(q).then(res => {
        finish(res);
      });
    }
  }
  fetchSuggestion(v) {
    if (!this.props.table_name) {
      return;
    }

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
  getIconView() {
    let v = null;
    let icon = null;
    let color = null;
    let txt = null;

    if (this.props.icon_loading) {
      icon = "spinner fa-pulse";
      color = "gray";
    } else if (this.props.icon_done) {
      icon = "check";
      color = "green";
    } else if (this.props.icon_is_required) {
      icon = "exclamation-triangle";
      color = "red";
      txt = "This field is required";
    }

    if (icon != null) {
      v = [
        <i style={{ color: color }} className={`fa fa-${icon}`}></i>,
        <div className="icon-text" style={{ color: color }}>
          {txt}
        </div>
      ];
    }
    return v;
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
            dangerouslySetInnerHTML={{ __html: d.val }}
          ></li>
        );
      });

      let v = <ul>{suggestion}</ul>;
      return v;
    }
  }
  getSelectOptions(index = 0) {
    if (this.state.dataset[index].length <= 0) {
      return null;
    } else {
      let dataset = ["", ...this.state.dataset[index]];
      return dataset.map((d, i) => {
        let value = d.val;
        let label = d.val;
        return (
          <option key={i} value={value}>
            {label}
          </option>
        );
      });
    }
  }
  getFieldInput() {
    if (this.state.loading) {
      return "Loading";
    }

    if (this.isText()) {
      return (
        <input
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onChange={this.onChange}
          type={this.props.input_type}
          value={this.props.input_val}
          placeholder={this.props.input_placeholder}
          ref={r => {
            this.ref = r;
          }}
        />
      );
    } else if (this.isSelect()) {
      return (
        <select
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          ref={r => {
            this.ref = r;
          }}
          value={this.props.input_val}
          defaultValue={this.props.input_val}
        >
          {this.getSelectOptions()}
        </select>
      );
    } else if (this.isSelectMulti()) {
      return this.props.table_name.map((d,i)=>{
        return (
          <select
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            ref={r => {
              this.ref[i] = r;
            }}
            value={this.props.input_val}
            defaultValue={this.props.input_val}
          >
            {this.getSelectOptions(i)}
          </select>
        );
      })
    }
  }
  render() {
    return (
      <div onKeyDown={this.onKeyDown} className="input-suggestion">
        {JSON.stringify(this.state.dataset)}

        <div className="input-field">
          <div className="input-and-icon">
            {this.getFieldInput()}
            <div className="icon-input">{this.getIconView()}</div>
          </div>
          <div className="suggestion-list">{this.getSuggestionView()}</div>
        </div>
      </div>
    );
  }
}

InputSuggestion.propTypes = {
  input_type: PropTypes.string,
  icon_loading: PropTypes.bool,
  icon_done: PropTypes.bool,
  icon_is_required: PropTypes.bool,
  input_onChange: PropTypes.func,
  input_onBlur: PropTypes.func,
  input_val: PropTypes.string,
  input_placeholder: PropTypes.string,
  table_name: PropTypes.string,
  onChoose: PropTypes.func
};

InputSuggestion.defaultProps = {
  input_type: "text"
};
