import React, { Component } from "react";
import { graphql } from "../../helper/api-helper";
import { getAuthUser } from "../redux/actions/auth-actions";
import SuggestionInput from "./suggestion-input";
import PropTypes from "prop-types";
import obj2arg from 'graphql-obj2arg';

export default class MultiInput extends React.Component {
  constructor(props) {
    super(props);

    // // constant
    // this.START_FETCH_LEN = 2;

    // fn binding
    this.finishDbRequest = this.finishDbRequest.bind(this);
    this.onChooseSuggestion = this.onChooseSuggestion.bind(this);
    this.onClickListItem = this.onClickListItem.bind(this);
    this.authUser = getAuthUser();

    // // state
    this.state = {
      list: [
        // {
        //   multi_id : num
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
    let q = `query{multi_refs(
        table_name :"${this.props.table_name}", 
        entity:"${this.props.entity}"
        entity_id:${this.props.entity_id}, 
        page:1, offset:10) 
        {
          val
          multi{
            ID
          }
      }}`;

    graphql(q).then(res => {
      let fetched = res.data.data.multi_refs;
      this.setState(prevState => {
        let list = [];
        for (var i in fetched) {
          let f = fetched[i];
          let multi_id = f.multi != null ? f.multi.ID : null
          list.push({
            isSelected: multi_id != null ? true : false,
            val: f.val,
            multi_id: multi_id
          });
        }
        return { list: list };
      });
    });
  }
  deleteDB(i, multi_id) {
    let del = {
      table_name: this.props.table_name,
      ID: multi_id,
    }
    let q = `mutation{ delete_multi(${obj2arg(del, { noOuterBraces: true })}) }`;
    graphql(q).then((res) => {
      this.finishDbRequest(i, res.data.data)
    }).catch((err) => {
      this.finishDbRequest(i, null, err);
    })
  }
  insertDB(v, i) {
    let ins = {
      table_name: this.props.table_name,
      entity: this.props.entity,
      entity_id: this.props.entity_id,
      val: v,
    }
    let q = `mutation{add_multi(${obj2arg(ins, { noOuterBraces: true })}) {
      ID
      entity
      entity_id
      val
      created_at
    }}`;
    graphql(q).then((res) => {
      let d = res.data.data.add_multi;
      this.finishDbRequest(i, d.ID)
    }).catch((err) => {
      console.log("catch err", err);
      this.finishDbRequest(i, null, err);
    })
  }
  onChooseSuggestion(v) {
    // console.log("onChooseSUggestion", v);
    let i = this.state.list.length;
    this.setState(prevState => {
      prevState.list.push({
        val: v,
        isSelected: false,
        loading: true
      });
      return { list: prevState.list };
    });

    this.insertDB(v, i);
  }
  finishDbRequest(i, multi_id = null, err = null) {


    let isInsert = !this.state.list[i].isSelected;
    let isDelete = this.state.list[i].isSelected;
    // console.log("finishDbRequest", "multi_id", multi_id)

    this.setState(prevState => {
      if (err != null) {
        prevState.list.splice(i);
      } else {
        // toggle isSelected
        prevState.list[i].isSelected = !prevState.list[i].isSelected;

        // set loading to false
        prevState.list[i].loading = false;

        // update multi_id accordingly
        if (isInsert) {
          prevState.list[i].multi_id = multi_id
        } else if (isDelete) {
          prevState.list[i].multi_id = null;
        }

      }

      return { list: prevState.list };
    });
  }
  onClickListItem(e) {
    let v = e.currentTarget.dataset.v;
    let i = e.currentTarget.dataset.i;
    let multi_id = e.currentTarget.dataset.multi_id;

    let isLoading = this.state.list[i].loading;
    if (isLoading) {
      return;
    }

    let isInsert = !this.state.list[i].isSelected;
    let isDelete = this.state.list[i].isSelected;

    // set the item to loading
    this.setState(prevState => {
      prevState.list[i].loading = true;
      return { list: prevState.list };
    });

    // start update db here


    if (isInsert) {
      // console.log("insert")
      // kalau tak selected, insert
      this.insertDB(v, i);
    } else if (isDelete) {
      // console.log("delete")
      try {
        multi_id = Number.parseInt(multi_id);
        if (multi_id != null && multi_id > 0 && typeof multi_id !== "undefined") {
          this.deleteDB(i, multi_id);
        }
      } catch (err) {
        console.log(err);
      }
    }


  }
  getListView() {
    if (this.state.list.length <= 0) {
      return null;
    } else {
      let v = this.state.list.map((d, i) => {
        let icon = null;
        if (d.loading) {
          icon = <i className={`fa fa-spinner fa-pulse`}></i>
        } else {
          icon = (
            <i className={`fa fa-${!d.isSelected ? "plus" : "times"}`}></i>
          );
        }
        return (
          <li
            onClick={this.onClickListItem}
            data-multi_id={d.multi_id}
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
        <div className="mi-label">{this.props.label}</div>
        <div className="mi-input">
          <SuggestionInput
            onChoose={this.onChooseSuggestion}
            table_name={this.props.table_name}
          ></SuggestionInput>
        </div>
        <div className="mi-list-title">{this.props.list_title}</div>
        <div className="mi-list">{this.getListView()}</div>
      </div>
    );
  }
}

MultiInput.propTypes = {
  table_name: PropTypes.string,
  entity: PropTypes.string,
  entity_id: PropTypes.number,
  label: PropTypes.string,
  list_title: PropTypes.string
};