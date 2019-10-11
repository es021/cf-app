import React, { Component } from "react";
import { graphql } from "../../helper/api-helper";
import { getAuthUser } from "../redux/actions/auth-actions";
import InputSuggestion from "./input-suggestion";
import PropTypes from "prop-types";
import obj2arg from "graphql-obj2arg";

export default class InputMulti extends React.Component {
  constructor(props) {
    super(props);

    // // constant
    // this.START_FETCH_LEN = 2;

    // fn binding
    this.continueOnClick = this.continueOnClick.bind(this);
    this.finishDbRequest = this.finishDbRequest.bind(this);
    this.onChooseSuggestion = this.onChooseSuggestion.bind(this);
    this.onClickListItem = this.onClickListItem.bind(this);
    this.insertDB = this.insertDB.bind(this);
    this.authUser = getAuthUser();

    // // state
    this.state = {
      hasSuggestion: false,
      list: [
        // {
        //   multi_id : num
        //   isSelected : true/false
        //   val : ""
        // }
      ]
    };
  }
  hasSelectedItem() {
    let hasSelected = false;
    for (var i in this.state.list) {
      if (this.state.list[i].isSelected == true) {
        return true;
      }
    }
    return hasSelected;
  }
  componentWillMount() {
    this.setDefaultList();
  }
  setDefaultList() {
    let q = `query{
        refs(
          table_name :"${this.props.ref_table_name}"
          multi_table_name :"${this.props.table_name}"
          entity:"${this.props.entity}"
          entity_id:${this.props.entity_id}
          page:1, offset:10
          is_suggestion :true,
          search_by_ref :"${this.props.suggestion_search_by_ref}",
          search_by_val : "${this.props.suggestion_search_by_val}"
        ){
          ID
          val
          multi{
            ID
          }
        }
      }`;

    graphql(q).then(res => {
      let fetched = res.data.data.refs;
      this.setState(prevState => {
        let list = [];
        for (var i in fetched) {
          let f = fetched[i];
          let multi_id = f.multi != null ? f.multi.ID : null;
          list.push({
            isSelected: multi_id != null ? true : false,
            val: f.val,
            multi_id: multi_id
          });
        }

        let hasSuggestion = false;
        if (list.length > 0) {
          hasSuggestion = true;
        }
        return { list: list, hasSuggestion: hasSuggestion };
      });
    });
  }
  continueOnClick(e) {
    if (this.props.continueOnClick) {
      this.props.continueOnClick(e);
    }
  }
  deleteDB(i, multi_id) {
    let del = {
      table_name: this.props.table_name,
      ID: multi_id
    };
    let q = `mutation{ delete_multi(${obj2arg(del, {
      noOuterBraces: true
    })}) }`;
    graphql(q)
      .then(res => {
        this.finishDbRequest(i, res.data.data);
      })
      .catch(err => {
        this.finishDbRequest(i, null, err);
      });
  }
  insertDB(v, i) {
    let ins = {
      table_name: this.props.table_name,
      entity: this.props.entity,
      entity_id: this.props.entity_id,
      val: v
    };
    let q = `mutation{add_multi(${obj2arg(ins, { noOuterBraces: true })}) {
      ID
      entity
      entity_id
      val
      created_at
    }}`;
    graphql(q)
      .then(res => {
        let d = res.data.data.add_multi;
        this.finishDbRequest(i, d.ID);
      })
      .catch(err => {
        console.log("catch err", err);
        this.finishDbRequest(i, null, err);
      });
  }
  onChooseSuggestion(v) {
    // console.log("onChooseSUggestion", v);
    let i = this.state.list.length;
    this.setState(pState => {
      let prevState = JSON.parse(JSON.stringify(pState));
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
    let isDuplicate = false;
    try {
      isDuplicate = err.response.data.indexOf("ER_DUP_ENTRY") >= 0;
    } catch (err) {}

    // ada error tapi bukan error duplicate, kita return
    if (err != null && !isDuplicate) {
      return;
    }

    let isInsert = !this.state.list[i].isSelected;
    let isDelete = this.state.list[i].isSelected;

    this.setState(pState => {
      let prevState = JSON.parse(JSON.stringify(pState));
      if (isDuplicate) {
        prevState.list.splice(i);
      } else {
        // toggle isSelected
        prevState.list[i].isSelected = !prevState.list[i].isSelected;

        // set loading to false
        prevState.list[i].loading = false;

        // update multi_id accordingly
        if (isInsert) {
          prevState.list[i].multi_id = multi_id;
        } else if (isDelete) {
          prevState.list[i].multi_id = null;
        }
      }
      return { list: prevState.list };
    });

    this.props.doneHandler(this.props.id, {
      type: "multi",
      list: this.state.list,
      hasSelected: this.hasSelectedItem()
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
    // let isInsert = true;
    // let isDelete = false;

    // set the item to loading
    this.setState(pState => {
      let prevState = JSON.parse(JSON.stringify(pState));
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
        if (
          multi_id != null &&
          multi_id > 0 &&
          typeof multi_id !== "undefined"
        ) {
          this.deleteDB(i, multi_id);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  getListTitle() {
    if (this.state.list.length <= 0 || !this.state.hasSuggestion) {
      return null;
    } else {
      return this.props.list_title;
    }
  }
  getListView() {
    if (this.state.list.length <= 0) {
      return null;
    } else {
      let v = this.state.list.map((d, i) => {
        let icon = null;
        if (d.loading) {
          icon = <i className={`fa fa-spinner fa-pulse`}></i>;
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
      <div id={this.props.id} className="input-multi">
        <div className="mi-label">
          {this.props.label}
          {this.props.is_required ? " *" : ""}
        </div>
        <div className="mi-input">
          <InputSuggestion
            onChoose={this.onChooseSuggestion}
            table_name={this.props.ref_table_name}
            input_placeholder={this.props.input_placeholder}
          ></InputSuggestion>
        </div>
        <div className="mi-list-title">{this.getListTitle()}</div>
        <div className="mi-list">{this.getListView()}</div>
        <div className="mi-footer">
          <br></br>
          <button
            data-index={this.props.index}
            className="btn btn-success btn-lg"
            onClick={this.continueOnClick}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }
}

InputMulti.propTypes = {
  index: PropTypes.number,
  is_required: PropTypes.bool,
  id: PropTypes.string,
  doneHandler: PropTypes.func,
  continueOnClick: PropTypes.func,
  table_name: PropTypes.string,
  ref_table_name: PropTypes.string,
  input_placeholder: PropTypes.string,
  entity: PropTypes.string,
  entity_id: PropTypes.number,
  label: PropTypes.string,
  list_title: PropTypes.string,
  suggestion_search_by_ref: PropTypes.string,
  suggestion_search_by_val: PropTypes.string
};

InputMulti.defaulProps = {
  doneHandler: () => {
    console.log("default doneHandler");
  }
};
