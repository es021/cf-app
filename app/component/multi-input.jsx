import React, { Component } from "react";
import { graphql } from "../../helper/api-helper";
import SuggestionInput from "./suggestion-input";
import PropTypes from "prop-types";

export default class MultiInput extends React.Component {
  constructor(props) {
    super(props);

    // // constant
    // this.START_FETCH_LEN = 2;

    // fn binding
    this.onChooseSuggestion = this.onChooseSuggestion.bind(this);
    this.onClickListItem = this.onClickListItem.bind(this);

    // // state
    this.state = {
      list: [
        // {
        //   isSelected : true/false
        //   val : ""
        // }
      ]
    };
  }

  componentWillMount() {
    this.setDefaultList();
  }
  setDefaultList() {
    // kena optimize based on major n sebagainya
    let q = `query{ 
      multi_refs(table_name :"${this.props.table_name}", page:1, offset:10) {
        val
      }
    }`;

    graphql(q).then(res => {
      let fetched = res.data.data.multi_refs;
      this.setState(prevState => {
        let list = [];
        for (var i in fetched) {
          list.push({
            isSelected: false,
            val: fetched[i].val
          });
        }
        return { list: list };
      });
    });
  }
  onChooseSuggestion(v) {
    this.setState(prevState => {
      prevState.list.push({
        val: v,
        isSelected: true
      });
      return { list: prevState.list };
    });
  }
  onClickListItem(e) {
    let v = e.currentTarget.dataset.v;
    let i = e.currentTarget.dataset.i;

    // toggle is selected
    this.setState(prevState => {
      console.log("prevState", prevState, i);

      prevState.list[i].isSelected = !prevState.list[i].isSelected;
      // updateDb here

      return { list: prevState.list };
    });
  }
  getListView() {
    if (this.state.list.length <= 0) {
      return null;
    } else {
      let v = this.state.list.map((d, i) => {
        let icon = <i className={`fa fa-${!d.isSelected ? "check" :"times"}`}></i>
        return (
          <li
            onClick={this.onClickListItem}
            data-v={d.val}
            data-i={i}
            className={`${d.isSelected ? "selected" : ""}`}
          >
            {d.val} {icon}
          </li>
        );
      });
      v = <ul>{v}</ul>;
      return v;
    }
  }
  render() {
    var d = {};
    return (
      <div className="multi-input">
        MultiInput<br></br>
        <SuggestionInput
          onChoose={this.onChooseSuggestion}
          table_name={this.props.table_name}
        ></SuggestionInput>
        <div className="multi-input-list">{this.getListView()}</div>
      </div>
    );
  }
}

MultiInput.propTypes = {
  table_name: PropTypes.string
};
