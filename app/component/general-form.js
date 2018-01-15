import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as layoutActions from '../redux/actions/layout-actions';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import obj2arg from 'graphql-obj2arg';
import Form, { toggleSubmit, checkDiff } from './form';
import List, { CustomList } from './list';
import ConfirmPopup from '../page/partial/popup/confirm-popup';

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
        this.Entity = this.props.entity.capitalize();

    }

    componentWillMount() {
        this.formDefault = this.props.formDefault;
        this.formItem = this.props.formItem;
    }

    formOnSubmit(d) {
        toggleSubmit(this, { error: null });

        // empty field become null
        for (var i in d) {
            if (d[i] == "") {
                d[i] = null;
            }
        }

        // for edit
        if (this.props.edit) {
            var update = checkDiff(this, this.props.edit, d, ["ID"]);

            if (update === false) {
                return;
            }
            update.ID = this.props.edit.ID;
            d = update;
        }


        // hook before submit to alter the data one last time
        if (this.props.formWillSubmit) {
            d = this.props.formWillSubmit(d, this.props.edit);
        }

        var query = `mutation{${(this.props.edit) ? "edit" : "add"}_${this.props.entity} 
            (${obj2arg(d, { noOuterBraces: true })}){ID}}`

        getAxiosGraphQLQuery(query).then((res) => {

            var mes = (this.props.edit) ? `Successfully Edit ${this.Entity}!` : `Successfully Added New ${this.Entity}!`;
            toggleSubmit(this, { error: null, success: mes });
            if (this.props.onSuccessNew) {
                this.props.onSuccessNew();
            }
        }, (err) => {
            toggleSubmit(this, { error: err.response.data });
        });

    }

    render() {
        var form = <Form className="form-row"
            items={this.formItem}
            onSubmit={this.formOnSubmit}
            submitText='Save'
            defaultValues={this.formDefault}
            disableSubmit={this.state.disableSubmit}
            error={this.state.error}
            errorPosition="top"
            emptyOnSuccess={true}
            success={this.state.success}></Form>;

        return (<div>{form}</div>);
    }
}

GeneralForm.propTypes = {
    entity: PropTypes.string.isRequired,
    formItem: PropTypes.array.isRequired,
    edit: PropTypes.obj, // edit object
    formDefault: PropTypes.object,
    onSuccessNew: PropTypes.func,
    formWillSubmit: PropTypes.func
};


export default class GeneralFormPage extends React.Component {
    constructor(props) {
        super(props);
        this.addPopup = this.addPopup.bind(this);
        this.onSuccessOperation = this.onSuccessOperation.bind(this);
        this.state = {
            error: null,
            disableSubmit: false,
            success: null,
            loading: true,
            key: 1,
            loadingDelete: false
        };
        this.Entity = this.props.entity.capitalize();
    }

    onSuccessOperation() {
        layoutActions.storeHideFocusCard();
        // this is how to update the child component use state keyy
        // damnnn
        this.setState((prevState) => {
            return { key: prevState.key + 1 };
        })
    }

    // create general form for add new record
    addPopup() {
        layoutActions.storeUpdateFocusCard(`Add ${this.Entity}`,
            GeneralForm,
            {
                entity: this.props.entity,
                formItem: this.props.getFormItem(false),
                formDefault: this.props.newFormDefault,
                onSuccessNew: this.onSuccessOperation,
                formWillSubmit: this.props.formWillSubmit
            }
        );
    }

    // create general form for edit record
    editPopup(e) {
        layoutActions.loadingBlockLoader("Fetching information..");
        const id = e.currentTarget.id;
        this.props.getEditFormDefault(id).then((res) => {
            console.log(res);
            layoutActions.storeHideBlockLoader();
            layoutActions.storeUpdateFocusCard(`Editing ${this.Entity} #${id}`,
                GeneralForm,
                {
                    entity: this.props.entity,
                    formItem: this.props.getFormItem(true),
                    formDefault: res,
                    onSuccessNew: this.onSuccessOperation,
                    formWillSubmit: this.props.formWillSubmit,
                    edit: res
                }
            );
        });
    }

    deletePopup(e) {
        var id = e.currentTarget.id;
        const onYes = () => {
            var del_query = `mutation{delete_${this.props.entity}(ID:${id})}`;
            layoutActions.storeUpdateProps({ loading: true });
            getAxiosGraphQLQuery(del_query).then((res) => {
                this.onSuccessOperation();
            }, (err) => {
                alert(err.response.data);
            });
        };

        layoutActions.storeUpdateFocusCard("Confirm Delete Item",
            ConfirmPopup,
            { title: `Continue delete this item ?`, onYes: onYes }, "small");
    }

    render() {
        var view = null;
        const renderList = (d, i) => {
            var row = this.props.renderRow(d);
            row.push(<td className="text-right">
                <a id={d.ID}
                    onClick={this.editPopup.bind(this)}>Edit</a>
                {" | "}
                <a id={d.ID}
                    onClick={this.deletePopup.bind(this)}>Delete</a>
            </td>);
            return <tr>{row}</tr>;
        };

        // wrap data with key to force it recreate new component when needed
        var datas = <div key={this.state.key}>
            <List type="table"
                tableHeader={this.props.tableHeader}
                getDataFromRes={this.props.getDataFromRes}
                loadData={this.props.loadData}
                offset={this.props.dataOffset}
                renderList={renderList}></List>
        </div>;



        return (<div>
            <h2>{this.props.dataTitle}</h2>
            <a className="btn btn-success btn-sm" onClick={this.addPopup}>Add New Vacancy</a>
            <br></br>
            <br></br>
            <div>{datas}</div>
        </div>);
    }
}

GeneralFormPage.propTypes = {
    entity: PropTypes.oneOf(["vacancy"]).isRequired,
    loadData: PropTypes.func.isRequired,
    renderRow: PropTypes.func.isRequired,
    tableHeader: PropTypes.element.isRequired,
    dataTitle: PropTypes.string.isRequired,
    getFormItem: PropTypes.func.isRequired,
    newFormDefault: PropTypes.array.isRequired,
    getEditFormDefault: PropTypes.func.isRequired,
    dataOffset: PropTypes.number,
    formWillSubmit: PropTypes.formWillSubmit
}

GeneralFormPage.defaultProps = {
    dataOffset: 10
}