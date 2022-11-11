import React, { PropTypes } from 'react';
import { ButtonLink } from '../component/buttons.jsx';
import GeneralFormPage from '../component/general-form';
import * as layoutActions from '../redux/actions/layout-actions';
import UserPopup from './partial/popup/user-popup';

//importing for list
import List from '../component/list';
import { getAxiosGraphQLQuery, graphql, graphqlAttr, postRequest } from '../../helper/api-helper';
import { User, UserMeta, CFS, CFSMeta } from '../../config/db-config';
import { Time } from '../lib/time';
import { createUserTitle } from './users';
import { createCompanyTitle } from './admin-company';
import Form, { toggleSubmit } from '../component/form.js';
import { SiteUrl, AppPath } from '../../config/app-config.js';
import { NavLink } from 'react-router-dom';
import { getAuthUser, getCF, isRoleAdmin, isRoleOrganizer } from '../redux/actions/auth-actions.jsx';


export default class AdminDatasetItemList extends React.Component {
    constructor(props) {
        super(props);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.state = {
            listKey: 0,
            error: null,
            disableSubmit: false,
            success: null,
        };
    }
    componentWillMount() {
        this.offset = 30;
        this.addFormItem = [
            {
                name: "val",
                type: "textarea",
                placeholder: "Each line will become an item.",
                required: true
            },
        ];
        //##########################################
        //  search
        this.searchParams = "";
        this.search = {};
        this.searchFormItem = [
            {
                flex: "xs6",
                name: "val",
                type: "text",
                placeholder: `Search by value`
            },
        ];

        this.searchFormOnSubmit = (d) => {
            this.search = d;
            this.searchParams = "";
            if (d != null) {
                this.searchParams += (d.val) ? `val:"${d.val}",` : "";
            }
        };


        this.loadData = (page, offset) => {
            return graphql(`
                query{
                    global_dataset_item(${this.searchParams}, source:"${this.props.source}" page:${page}, offset:${offset}, order_by : "created_at DESC")
                { ID val } 
            }`);
        };

        this.tableHeader = <thead>
            <tr>
                <th>Value</th>
                <th className="text-right">Action</th>
            </tr>
        </thead>;

        this.renderRow = (d, i) => {
            let row = [];
            row.push(<td>
                {d.val}
            </td>);
            return row;
        }

        this.getDataFromRes = (res) => {
            return res.data.data.global_dataset_item;
        }

        this.getFormItem = (edit) => {
            var ret = [{ header: "Dataset Item" }];
            ret.push({
                label: "Value",
                name: "val",
                type: "text",
                required: true,
            })
            return ret;
        }


        this.getEditFormDefault = (id, el) => {
            return getAxiosGraphQLQuery(`query{global_dataset_item(ID:${id}){ID val}}`).then((res) => {
                return res.data.data.global_dataset_item[0];
            });
        }

    }

    formEditWillSubmit(d, edit) {
        return d;
    }

    formOnSubmit(d) {
        toggleSubmit(this, { error: null });
        postRequest(SiteUrl + "/dataset-datapoint/add-dataset-item-bundle",
            { source: this.props.source, val: d.val }
        )
            .then(res => {
                var mes = `Successfully added new item.`;
                toggleSubmit(this, { error: null, success: mes });
                this.setState((prevState) => {
                    return { listKey: prevState.listKey + 1 }
                })
            }).catch(err => {
                toggleSubmit(this, { error: err.toString() });
            })
    }

    render() {
        return (<div style={{ padding: '10px 20px' }}>
            <div>
                <h4>Add New Item(s)</h4>
                <Form className="form-row"
                    items={this.addFormItem}
                    onSubmit={this.formOnSubmit}
                    submitText="Add Item"
                    disableSubmit={this.state.disableSubmit}
                    error={this.state.error}
                    errorPosition="top"
                    emptyOnSuccess={true}
                    success={this.state.success}></Form>
            </div>
            <br></br>
            <h3>Dataset Items</h3>
            <GeneralFormPage
                key={this.state.listKey}
                formWillSubmit={this.formEditWillSubmit}
                dataOffset={this.offset}
                isOnFocusCard={true}
                noMutation={true}
                canEdit={true}
                canDelete={true}
                getFormItem={this.getFormItem}
                getEditFormDefault={this.getEditFormDefault}
                entity_singular="Dataset Item"
                entity="global_dataset_item" // todo
                searchFormNonPopup={true}
                searchFormItem={this.searchFormItem}
                searchFormOnSubmit={this.searchFormOnSubmit}
                tableHeader={this.tableHeader}
                renderRow={this.renderRow}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
            ></GeneralFormPage>
        </div>);
    }
}


AdminDatasetItemList.propTypes = {
    id: PropTypes.number.isRequired,
    source: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};
