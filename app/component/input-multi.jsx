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
    this.inputOnChange = this.inputOnChange.bind(this);
    this.continueOnClick = this.continueOnClick.bind(this);
    this.finishDbRequest = this.finishDbRequest.bind(this);
    this.onChooseSuggestion = this.onChooseSuggestion.bind(this);
    this.onClickListItem = this.onClickListItem.bind(this);
    this.insertDB = this.insertDB.bind(this);
    this.authUser = getAuthUser();

    // // state
    this.state = {
      list_loading: false,
      show_is_required: false,
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
  // updateRequiredWarning() {
  //   if (!this.hasSelectedItem()) {
  //     this.setState({
  //       show_is_required: this.props.is_required ? true : false
  //     });
  //   } else {
  //     this.setState({
  //       show_is_required: false
  //     });
  //   }
  // }
  isSelect() {
    return this.props.input_type == "select";
  }
  inputOnChange(e) {
    if (this.isSelect()) {
      let v = e.target.value;
      if (v != "" && v != null) {
        this.onChooseSuggestion(v);
      }
      e.target.value = "";
    }
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
  componentWillUpdate(nextProps) {
    let props = this.props.suggestion_search_by_val;
    let next = nextProps.suggestion_search_by_val;

    if (Array.isArray(props)) {
      props = JSON.stringify(props);
    }

    if (Array.isArray(next)) {
      next = JSON.stringify(next);
    }

    if (props !== next) {
      // console.log(
      //   this.props.id,
      //   "UPDATEEEE",
      //   nextProps.suggestion_search_by_val
      // );
      this.setDefaultList(nextProps);
    }
  }
  componentWillMount() {
    this.setDefaultList();
  }
  setDefaultList(customProps = null) {
    this.setState({ list_loading: true });
    let props = customProps ? customProps : this.props;

    let refList = [];
    let multiList = [];
    let loaded = 0;
    let toLoad = this.props.discard_ref_from_default ? 1 : 2;

    const finish = () => {
      loaded++;
      if (loaded >= toLoad) {
        //this.updateRequiredWarning();
        // console.log("finish");

        let multiMap = {};
        multiList.map((d, i) => {
          multiMap[d.val] = { ID: d.ID, val: d.val, inRef: false };
        });

        // console.log("refList", refList);
        // console.log("multiList", multiList);
        // console.log("multiMap", multiMap);

        let stateList = [];

        // add from ref
        for (var i in refList) {
          let r = refList[i];
          let rVal = r.val;
          let multi_id = null;
          if (typeof multiMap[rVal] !== "undefined") {
            multiMap[rVal].inRef = true;
            multi_id = multiMap[rVal].ID;
          }
          stateList.push({
            isSelected: multi_id != null ? true : false,
            val: rVal,
            multi_id: multi_id
          });
        }

        // add from multis
        for (var i in multiList) {
          let m = multiList[i];
          if (multiMap[m.val].inRef === true) {
            continue;
          }
          stateList.push({
            isSelected: true,
            val: m.val,
            multi_id: m.ID
          });
        }

        this.setState({
          list_loading: false,
          list: stateList,
          hasSuggestion: refList.length > 0
        });

        this.triggerDoneHandler();
      }
    };

    if (this.props.discard_ref_from_default === false) {
      // list of suggestion from ref
      let qRef = `query{
        refs(
          table_name :"${props.ref_table_name}"
          entity:"${props.entity}"
          entity_id:${props.entity_id}
          order_by:"${props.ref_order_by ? props.ref_order_by : "RAND ()"}"
          page:1, offset:${props.ref_offset}
          location_suggestion :"${props.location_suggestion}",
          category :"${props.ref_category}",
          search_by_ref :"${props.suggestion_search_by_ref}",
          search_by_val : "${props.suggestion_search_by_val}"
        ){
          ID
          val
        }
      }`;
      graphql(qRef).then(res => {
        let fetched = res.data.data.refs;
        refList = fetched;
        finish();
      });
    }

    // list of selected item in multi
    let qMulti = `query{
      multis(
        table_name :"${props.table_name}"
        entity:"${props.entity}"
        entity_id:${props.entity_id}
      ){
        ID val
      }
    }`;
    graphql(qMulti).then(res => {
      let fetched = res.data.data.multis;
      multiList = fetched;
      finish();
    });
  }
  triggerDoneHandler() {
    this.props.doneHandler(this.props.id, {
      type: "multi",
      list: this.state.list,
      isEmptyAndRequired: this.isEmptyAndRequired()
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
    let index = i;
    console.log("insertDB 1", index);

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
        console.log("insertDB", index);
        this.finishDbRequest(index, d.ID, null, d.val);
      })
      .catch(err => {
        console.log("catch err", err);
        this.finishDbRequest(index, null, err);
      });
  }
  onChooseSuggestion(v) {
    let index = -1;
    let iInList = this.indexOfValInList(v);
    if (iInList <= -1) {
      // kalau takde dlm list
      index = this.state.list.length;
      this.setState(pState => {
        let prevState = JSON.parse(JSON.stringify(pState));
        prevState.list.push({
          val: v,
          isSelected: false,
          loading: true
        });
        return { list: prevState.list };
      });
    } else {
      // kalau dah ada dlm list
      index = iInList;
      let isSelected = this.state.list[index].isSelected;
      if (isSelected) {
        index = this.state.list.length;
      }
    }
    this.insertDB(v, index);
  }
  indexOfValInList(val) {
    for (var i in this.state.list) {
      let v = this.state.list[i].val;
      if (val == v) {
        return Number.parseInt(i);
      }
    }

    return -1;
  }
  finishDbRequest(i, multi_id = null, err = null, val = null) {
    console.log("finishDbRequest", i);
    let isDuplicate = false;
    try {
      isDuplicate = err.response.data.indexOf("ER_DUP_ENTRY") >= 0;
    } catch (err) {}

    // ada error tapi bukan error duplicate, kita return
    if (err != null && !isDuplicate) {
      return;
    }

    if (this.isSelect() && isDuplicate) {
      return;
    }

    let isInsert = !this.state.list[i].isSelected;
    let isDelete = this.state.list[i].isSelected;

    this.setState(pState => {
      let prevState = JSON.parse(JSON.stringify(pState));
      if (isDuplicate) {
        prevState.list.splice(i);
      } else if (isDelete) {
        prevState.list[i].isSelected = !prevState.list[i].isSelected;
        prevState.list[i].multi_id = null;
        prevState.list[i].loading = false;
      } else if (isInsert) {
        prevState.list[i].isSelected = !prevState.list[i].isSelected;
        prevState.list[i].multi_id = multi_id;
        prevState.list[i].loading = false;
      }
      return { list: prevState.list };
    });

    this.triggerDoneHandler();
    // this.updateRequiredWarning();
  }

  isEmptyAndRequired() {
    return this.props.is_required && !this.hasSelectedItem();
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
    if (this.state.list_loading) {
      return (
        <div>
          Loading.... <i className={`fa fa-spinner fa-pulse`}></i>;
        </div>
      );
    }

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
    let continueBtn = null;
    if (!this.props.hideContinueButton) {
      continueBtn = [
        <br></br>,
        <button
          data-index={this.props.index}
          className="btn btn-success btn-lg"
          onClick={this.continueOnClick}
        >
          Continue
        </button>
      ];
    }

    let inputSuggestion = null;
    if (!this.props.hideInputSuggestion) {
      inputSuggestion = (
        <div className="mi-input">
          <InputSuggestion
            input_type={this.props.input_type}
            onChoose={this.onChooseSuggestion}
            input_onChange={this.inputOnChange}
            table_name={this.props.ref_table_name}
            input_placeholder={this.props.input_placeholder}
          ></InputSuggestion>
        </div>
      );
    }

    return (
      <div id={this.props.id} className="input-multi">
        <div className="mi-label input-label">
          {this.props.label}
          {this.props.is_required ? " *" : ""}
        </div>
        {this.props.sublabel ? (
          <div className="mi-sublabel input-sublabel">
            {this.props.sublabel}
          </div>
        ) : null}
        {inputSuggestion}
        <div className="mi-list-title">{this.getListTitle()}</div>
        <div className="mi-list">{this.getListView()}</div>
        <div className="mi-footer">{continueBtn}</div>
      </div>
    );
  }
}

InputMulti.propTypes = {
  input_type: PropTypes.string,
  index: PropTypes.number,
  is_required: PropTypes.bool,
  id: PropTypes.string,
  doneHandler: PropTypes.func,
  continueOnClick: PropTypes.func,
  table_name: PropTypes.string,
  ref_table_name: PropTypes.string,
  ref_order_by: PropTypes.string,
  input_placeholder: PropTypes.string,
  entity: PropTypes.string,
  entity_id: PropTypes.number,
  ref_offset: PropTypes.number,
  label: PropTypes.string,
  sublabel: PropTypes.string,
  list_title: PropTypes.string,
  location_suggestion: PropTypes.string,
  ref_category: PropTypes.string,
  suggestion_search_by_ref: PropTypes.string,
  suggestion_search_by_val: PropTypes.string,
  discard_ref_from_default: PropTypes.bool,
  hideContinueButton: PropTypes.bool,
  hideInputSuggestion: PropTypes.bool
};

InputMulti.defaultProps = {
  ref_offset: 10,
  discard_ref_from_default: false,
  ref_category: "",
  suggestion_search_by_ref: "",
  suggestion_search_by_val: "",
  hideInputSuggestion: false,
  hideContinueButton: false,
  doneHandler: () => {
    console.log("default doneHandler");
  }
};
