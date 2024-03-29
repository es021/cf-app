import React, { Component } from "react";
import PropTypes from "prop-types";
import * as layoutActions from "../redux/actions/layout-actions";
import { getAxiosGraphQLQuery, postAxiosGraphQLQuery } from "../../helper/api-helper";
import obj2arg from "graphql-obj2arg";
import Form, { toggleSubmit, checkDiff } from "./form";
import List, { CustomList } from "./list";
import ConfirmPopup from "../page/partial/popup/confirm-popup";
import { lang } from "../lib/lang";

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      disableSubmit: false,
      success: null
    };
  }

  componentWillMount() {
    this.formItem = this.props.formItem;
  }

  render() {
    var form = (
      <Form
        className="form-row"
        items={this.formItem}
        onSubmit={this.props.formOnSubmit}
        submitText={
          <span>
            <i className="fa fa-search left"></i>{lang("Search")}
          </span>
        }
        btnColorClass={"success"}
        disableSubmit={this.state.disableSubmit}
        error={this.state.error}
        errorPosition="top"
        emptyOnSuccess={true}
        success={this.state.success}
        contentTop={this.props.contentTop}
        contentBottom={this.props.contentBottom}
      ></Form>
    );

    return <div>{form}</div>;
  }
}

SearchForm.propTypes = {
  formItem: PropTypes.object.isRequired,
  formOnSubmit: PropTypes.func.isRequired,
  contentBottom: PropTypes.object
};

class GeneralForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      disableSubmit: false,
      success: null,
      currentFile: null
    };
    this.formOnSubmit = this.formOnSubmit.bind(this);
    this.Entity = this.props.entity_singular;
  }

  componentWillMount() {
    this.formDefault = this.props.formDefault;
    this.formItem = this.props.formItem;
  }

  async formOnSubmit(d) {
    toggleSubmit(this, { error: null });

    // empty field become null
    for (var i in d) {
      if (this.props.acceptEmpty.indexOf(i) >= 0) {
        continue;
      }
      if (d[i] == "") {
        d[i] = null;
      }
    }

    // for edit
    if (this.props.edit) {
      var discardDiff = ["ID"];
      if (this.props.discardDiff) {
        discardDiff.push(...this.props.discardDiff);
      }
      var update = checkDiff(
        this,
        this.props.edit,
        d,
        discardDiff,
        this.props.forceDiff
      );

      if (update === false) {
        return;
      }
      update.ID = this.props.edit.ID;
      d = update;
    }

    // hook before submit to alter the data one last time
    if (this.props.formWillSubmit) {
      d = this.props.formWillSubmit(d, this.props.edit);
      if (d.then) {
        d = await d;
      }
      //if error will return string
      if (typeof d === "string") {
        toggleSubmit(this, { error: d });
        return;
      }

    }

    var queryKey = `${this.props.edit ? "edit" : "add"}_${this.props.entity}`;
    var query = `mutation{
            ${queryKey}
            (${obj2arg(d, { noOuterBraces: true })}){ID}}`;

    // postAxiosGraphQLQuery(query).then(
    getAxiosGraphQLQuery(query).then(
      res => {
        var mes = this.props.edit
          ? `${lang("Successfully Edit")} ${lang(this.Entity)}!`
          : `${lang("Successfully Added New")} ${lang(this.Entity)}!`;
        toggleSubmit(this, { error: null, success: mes });
        if (this.props.onSuccessNew) {
          try {
            res = res.data.data[queryKey]
          } catch (err) {
            res = {};
          }
          console.log("onSuccessNew", res);
          console.log("onSuccessNew", res);
          console.log("onSuccessNew", res);
          console.log("onSuccessNew", res);
          this.props.onSuccessNew(d, res);
        }
      },
      err => {
        toggleSubmit(this, { error: err.response.data });
      }
    );
  }

  render() {
    var form = (
      <Form
        className={"form-row " + this.props.formClassName}
        headerClassName={this.props.headerClassName}
        itemClassName={this.props.itemClassName}
        items={this.formItem}
        onSubmit={this.formOnSubmit}
        submitText={`${this.props.edit ? lang("Edit") : lang("Add")} ${this.props.entity_singular
          }`}
        defaultValues={this.formDefault}
        btnColorClass={this.props.btnColorClass}
        disableSubmit={this.state.disableSubmit}
        error={this.state.error}
        errorPosition="bottom"
        emptyOnSuccess={true}
        success={this.state.success}
      ></Form>
    );

    return <div>{form}</div>;
  }
}

GeneralForm.propTypes = {
  headerClassName: PropTypes.string,
  itemClassName: PropTypes.string,
  formClassName: PropTypes.string,
  entity: PropTypes.string.isRequired,
  entity_singular: PropTypes.string.isRequired,
  formItem: PropTypes.array.isRequired,
  edit: PropTypes.obj, // edit object
  formDefault: PropTypes.object,
  onSuccessNew: PropTypes.func,
  btnColorClass: PropTypes.string,
  formWillSubmit: PropTypes.func,
  discardDiff: PropTypes.array,
  forceDiff: PropTypes.array,
  acceptEmpty: PropTypes.array
};

GeneralForm.defaultProps = {
  acceptEmpty: [],
  btnColorClass: "primary"
};

export default class GeneralFormPage extends React.Component {
  constructor(props) {
    super(props);
    this.addPopup = this.addPopup.bind(this);
    this.searchPopup = this.searchPopup.bind(this);
    this.getAddForm = this.getAddForm.bind(this);
    this.onSuccessOperation = this.onSuccessOperation.bind(this);
    this.state = {
      error: null,
      disableSubmit: false,
      success: null,
      loading: true,
      key: 1,
      loadingDelete: false,
      hasFilter: false
    };
    this.Entity = this.props.entity_singular;
  }

  onSuccessOperation(action, data = null, res = null) {
    console.log("onSuccessOperation", data);
    console.log("onSuccessOperation", data);
    console.log("onSuccessOperation", data);
    // @form - successAddHandler
    if (action == "add" && this.props.successAddHandler) {
      this.props.successAddHandler(data, res);
    }

    if (this.props.isOnFocusCard) {
      layoutActions.storePreviousFocusCard();
      if (action == "delete") {
        layoutActions.storePreviousFocusCard();
      }
    } else {
      layoutActions.storeHideFocusCard();
    }
    // this is how to update the child component use state keyy
    // damnnn
    this.reloadList();
  }

  reloadList() {
    this.setState(prevState => {
      return { key: prevState.key + 1 };
    });
  }

  // if showAddForm is set to true, in session-notes
  getAddForm() {
    return (
      <GeneralForm
        headerClassName={this.props.headerClassName}
        itemClassName={this.props.itemClassName}
        formClassName={this.props.formClassName}
        emptyMessage={this.props.emptyMessage}
        entity={this.props.entity}
        entity_singular={this.props.entity_singular}
        formItem={this.props.getFormItem(false)}
        formDefault={this.props.newFormDefault}
        onSuccessNew={this.onSuccessOperation}
        btnColorClass={this.props.btnColorClass}
        formWillSubmit={this.props.formWillSubmit}
      ></GeneralForm>
    );
  }

  // create general form for add new record
  addPopup() {
    const generateForm = formItem => {
      layoutActions.storeUpdateFocusCard(`${lang("Add")} ${this.Entity}`, GeneralForm, {
        headerClassName: this.props.headerClassName,
        itemClassName: this.props.itemClassName,
        formClassName: this.props.formClassName,
        emptyMessage: this.props.emptyMessage,
        discardDiff: this.props.discardDiff,
        forceDiff: this.props.forceDiff,
        entity: this.props.entity,
        entity_singular: this.props.entity_singular,
        formItem: formItem,
        formDefault: this.props.newFormDefault,
        // @form - onSuccessNew
        onSuccessNew: (d, res) => {
          this.onSuccessOperation("add", d, res);
        },
        formWillSubmit: this.props.formWillSubmit
      });
    };

    if (this.props.getFormItemAsync) {
      this.props.getFormItemAsync(false).then(formItem => {
        generateForm(formItem);
      });
    } else {
      generateForm(this.props.getFormItem(false));
    }
  }

  // create general form for edit record
  editPopup(e) {
    const id = e.currentTarget.id;
    let curElement = e.currentTarget;

    const generateForm = formItem => {
      layoutActions.loadingBlockLoader(lang("Fetching information.."));
      this.props.getEditFormDefault(id, curElement).then(res => {
        layoutActions.storeHideBlockLoader();
        layoutActions.storeUpdateFocusCard(
          `${lang("Editing")} ${this.Entity} #${id}`,
          GeneralForm,
          {
            headerClassName: this.props.headerClassName,
            itemClassName: this.props.itemClassName,
            formClassName: this.props.formClassName,
            emptyMessage: this.props.emptyMessage,
            discardDiff: this.props.discardDiff,
            forceDiff: this.props.forceDiff,
            acceptEmpty: this.props.acceptEmpty,
            entity: this.props.entity,
            entity_singular: this.props.entity_singular,
            formItem: formItem,
            formDefault: res,
            onSuccessNew: (d, res) => {
              this.onSuccessOperation("edit", d, res);
            },
            formWillSubmit: this.props.formWillSubmit,
            edit: res
          }
        );
      });
    };

    if (this.props.getFormItemAsync) {
      this.props.getFormItemAsync(true).then(formItem => {
        generateForm(formItem);
      });
    } else {
      generateForm(this.props.getFormItem(true));
    }
  }

  deletePopup(e) {
    var id = e.currentTarget.id;
    const onYes = () => {
      var del_query = `mutation{delete_${this.props.entity}(ID:${id})}`;
      layoutActions.storeUpdateProps({ loading: true });
      getAxiosGraphQLQuery(del_query).then(
        res => {
          this.onSuccessOperation("delete");
        },
        err => {
          alert(err.response.data);
        }
      );
    };

    layoutActions.storeUpdateFocusCard(
      lang("Confirm Delete Item"),
      ConfirmPopup,
      { title: lang("Continue delete this item ?"), onYes: onYes },
      "small"
    );
  }

  searchPopup() {
    console.log("searchPopup");
    layoutActions.storeUpdateFocusCard(
      lang("Search") + " " + this.props.entity_singular,
      SearchForm,
      {
        contentBottom: this.props.searchFormContentBottom,
        formItem: this.props.searchFormItem,
        formOnSubmit: d => {
          this.props.searchFormOnSubmit(d);
          this.onSuccessOperation("search");
          this.setState(prevState => {
            return { hasFilter: true };
          });
        }
      }
    );
  }

  resetFilter() {
    this.setState(prevState => {
      return { hasFilter: false };
    });
    this.props.searchFormOnSubmit({});
    this.onSuccessOperation("search");
  }

  render() {
    if (this.props.formOnly) {
      this.addPopup();
      return <div></div>;
    }

    // wrap data with key to force it recreate new component when needed
    const listType = this.props.tableHeader !== null ? "table" : "list";

    var view = null;
    const renderList = (d, i) => {
      let extra = {};
      if (this.props.getExtraEditData) {
        extra = this.props.getExtraEditData(d);
      }

      let actionClass = this.props.isMutationUseIcon ? "badge" : null;

      var editAct = (
        <a className={actionClass} id={d.ID} {...extra} onClick={this.editPopup.bind(this)}>
          {this.props.isMutationUseIcon ? <i className="fa fa-edit"></i> : lang("Edit")}
        </a>
      );

      var delAct = (
        <a className={actionClass} id={d.ID} {...extra} onClick={this.deletePopup.bind(this)}>
          {this.props.isMutationUseIcon ? <i className="fa fa-times"></i> : lang("Delete")}
        </a>
      );


      var action = null;
      var row = [];
      if (!this.props.noMutation || (this.props.canEdit && this.props.canDelete)) {
        action = (
          <td className="text-right">
            {!this.props.customAction ? null :
              this.props.customAction({ id: d.ID, actionClass: actionClass, extra: extra})
            }
            {editAct}
            {" | "}
            {delAct}
          </td>
        );
      } else if (this.props.canEdit) {
        action = <td className="text-right">{editAct}</td>;
      }

      if (this.props.customRenderRow) {
        row.push(this.props.customRenderRow(d, editAct, delAct));
      } else if (this.props.actionFirst) {
        row.push(action);
        row.push(this.props.renderRow(d));
      } else {
        row.push(this.props.renderRow(d));
        row.push(action);
      }

      // var row = [];
      // if (this.props.actionFirst) {
      //     row = addAction(row);
      //     row.push(this.props.renderRow(d));
      // } else {
      //     row = this.props.renderRow(d);
      //     row = addAction(row);
      // }

      if (listType == "table") {
        return <tr>{row}</tr>;
      } else {
        return row;
      }
    };

    var datas = (
      <div key={this.state.key}>
        <List
          isHidePagingTop={this.props.isHidePagingTop}
          isHidePagingBottom={this.props.isHidePagingBottom}
          emptyMessage={this.props.emptyMessage}
          listClass={this.props.listClass}
          loadCount={this.props.loadCount}
          getCountFromRes={this.props.getCountFromRes}
          type={listType}
          tableHeader={this.props.tableHeader}
          getDataFromRes={this.props.getDataFromRes}
          loadData={this.props.loadData}
          hideLoadMore={this.props.hideLoadMore}
          offset={this.props.offset || this.props.dataOffset}
          renderList={renderList}
        ></List>
      </div>
    );

    /*
        {
            !this.props.showAddForm
            ? <a className="btn btn-success btn-sm" onClick={this.addPopup}>{this.props.addButtonText}</a>
            : this.getAddForm()
        }
        */

    var addForm = null;
    if (this.props.canAdd || !this.props.noMutation) {
      addForm = !this.props.showAddForm ? (
        <h4>
          <a onClick={this.addPopup}>
            <i className="fa fa-plus left"></i>
            {lang(this.props.addButtonText)}
          </a>
        </h4>
      ) : (
        this.getAddForm()
      );
    }

    // console.log("this.props.searchFormItem ", this.props.searchFormItem);
    // console.log("this.props.searchFormItem ", this.props.searchFormItem);
    // console.log("this.props.searchFormItem ", this.props.searchFormItem);
    // console.log("this.props.searchFormItem ", this.props.searchFormItem);
    // console.log("this.props.searchFormItem ", this.props.searchFormItem);

    let showFilter = this.props.hasResetFilter && this.state.hasFilter;
    let searchForm = null;
    let resetFilterView = showFilter ? (
      <div className="reset-filter">
        <a
          onClick={() => {
            this.resetFilter();
          }}
        >
          <i className="fa fa-refresh left"></i>{lang("Reset Filter")}
        </a>
      </div>
    ) : null;

    if (this.props.searchFormItem) {
      if (this.props.searchFormNonPopup) {
        searchForm =
          <div className="container-fluid">
            <div className="row form-flex search-form-flex">
              <div className={`col-sm-${this.props.searchFormContentRight ? '9' : '12'} no-padding`}>
                <div className="">
                  <SearchForm
                    formItem={this.props.searchFormItem}
                    contentTop={
                      <div style={{ marginBottom: "7px" }}>
                        {this.props.searchFormContentTop}
                      </div>
                    }
                    contentBottom={
                      <div style={{ marginTop: "7px" }}>
                        {this.props.searchFormContentBottom}
                        {resetFilterView}
                      </div>
                    }
                    formOnSubmit={d => {
                      this.props.searchFormOnSubmit(d);
                      this.onSuccessOperation("search");
                      this.setState(prevState => {
                        return { hasFilter: true };
                      });
                    }}
                  ></SearchForm>
                </div>
              </div>
              {this.props.searchFormContentRight
                ? <div className="col-sm-3 no-padding">
                  {this.props.searchFormContentRight}
                </div>
                : null
              }
            </div>
          </div>

      } else {
        searchForm = (
          <h4>
            <a onClick={this.searchPopup}>
              <i className="fa fa-search left"></i>Filter Record
            </a>
            {showFilter ? " | " : null}
            {resetFilterView}
          </h4>
        );
      }
    }


    if (this.props.isSearchOnLeft) {
      return <div className="container-fluid">
        <div className="row">
          <div className="col-md-4">
            {this.props.dataTitle ? <h2>{lang(this.props.dataTitle)}</h2> : null}
            {this.props.contentBelowTitle}
            {addForm}
            {searchForm}
            {this.props.contentBelowFilter}
          </div>
          <div className="col-md-8">
            {datas}
          </div>
        </div>
      </div>
    }

    if (this.props.tableOnly) {
      return datas;
    }
    return (
      <div>
        {this.props.dataTitle ? <h2>{lang(this.props.dataTitle)}</h2> : null}
        {this.props.contentBelowTitle}
        {addForm}
        {searchForm}
        {this.props.contentBelowFilter}
        <div>{datas}</div>
      </div>
    );
  }
}

GeneralFormPage.propTypes = {
  itemClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  formClassName: PropTypes.string,
  getExtraEditData: PropTypes.func,
  searchFormContentRight: PropTypes.object,
  searchFormContentBottom: PropTypes.object,
  searchFormContentTop: PropTypes.object,
  searchFormNonPopup: PropTypes.bool,
  hasResetFilter: PropTypes.bool,
  isOnFocusCard: PropTypes.bool,
  contentBelowFilter: PropTypes.obj,
  contentBelowTitle: PropTypes.obj,
  entity: PropTypes.string.isRequired, // for table name
  entity_singular: PropTypes.string.isRequired, // for display
  searchFormItem: PropTypes.obj,
  searchFormOnSubmit: PropTypes.func,
  loadData: PropTypes.func.isRequired,
  addButtonText: PropTypes.string.isRequired,
  renderRow: PropTypes.func.isRequired,
  tableHeader: PropTypes.element,
  dataTitle: PropTypes.string.isRequired,
  getFormItem: PropTypes.func,
  getFormItemAsync: PropTypes.func,
  newFormDefault: PropTypes.array.isRequired,
  getEditFormDefault: PropTypes.func.isRequired,
  dataOffset: PropTypes.number,
  formWillSubmit: PropTypes.func,
  showAddForm: PropTypes.bool,
  btnColorClass: PropTypes.string,
  successAddHandler: PropTypes.func,
  discardDiff: PropTypes.array,
  forceDiff: PropTypes.array, // by default during edit, if there is no changes the param will not be sent to backend
  acceptEmpty: PropTypes.array, // for edit, accept empty value.. used in auditorium
  actionFirst: PropTypes.bool,
  customAction: PropTypes.any,
  noMutation: PropTypes.bool, // disable add, edit and delete
  canEdit: PropTypes.bool, // bypass noMutation
  canDelete: PropTypes.bool, // bypass noMutation
  canAdd: PropTypes.bool, // bypass noMutation
  formOnly: PropTypes.bool, // formOnly
  tableOnly: PropTypes.bool // formOnly
};

GeneralFormPage.defaultProps = {
  searchFormNonPopup: false,
  hasResetFilter: false,
  isOnFocusCard: false,
  contentBelowFilter: null,
  contentBelowTitle: null,
  searchFormItem: null,
  actionFirst: false,
  customAction: null,
  noMutation: false,
  canEdit: false,
  canDelete: false,
  canAdd: false,
  dataOffset: 10,
  showAddForm: false,
  btnColorClass: "primary",
  discardDiff: [],
  forceDiff: [],
  acceptEmpty: [],
  formOnly: false,
  tableHeader: null,
  tableOnly: false
};

/////////////////////////////////////////////

export const openEditPopup = function (
  id,
  entity,
  entity_singular,
  formItem,
  formDefault,
  willSubmit,
  onSuccess,
  closeOnSuccess = true
) {
  layoutActions.storeUpdateFocusCard(
    `${lang("Editing")} ${entity_singular} #${id}`,
    GeneralForm,
    {
      headerClassName: this.props.headerClassName,
      itemClassName: this.props.itemClassName,
      formClassName: this.props.formClassName,
      emptyMessage: this.props.emptyMessage,
      forceDiff: [],
      dicardDiff: [],
      entity: entity,
      entity_singular: entity_singular,
      formItem: formItem,
      formDefault: formDefault,
      onSuccessNew: (d, res) => {
        if (closeOnSuccess) {
          layoutActions.storeHideFocusCard();
        }
        onSuccess(d, res);
      },
      formWillSubmit: willSubmit,
      edit: formDefault
    }
  );
};

export const openDeletePopup = function (
  id,
  entity,
  onSuccess,
  closeOnSuccess = true
) {
  const onYes = () => {
    var del_query = `mutation{delete_${entity}(ID:${id})}`;
    layoutActions.storeUpdateProps({ loading: true });
    getAxiosGraphQLQuery(del_query).then(
      res => {
        if (closeOnSuccess) {
          layoutActions.storeHideFocusCard();
        }
        onSuccess(res);
      },
      err => {
        alert(err.response.data);
      }
    );
  };

  layoutActions.storeUpdateFocusCard(
    lang("Confirm Delete Item"),
    ConfirmPopup,
    { title: lang("Continue delete this item ?"), onYes: onYes },
    "small"
  );
};
