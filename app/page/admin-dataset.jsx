import React, { PropTypes } from 'react';
import GeneralFormPage from '../component/general-form';
import * as layoutActions from '../redux/actions/layout-actions';
//importing for list
import { getAxiosGraphQLQuery, graphql, graphqlAttr, postRequest } from '../../helper/api-helper';
import Form, { toggleSubmit } from '../component/form.js';
import { getAuthUser, getCF, isRoleAdmin, isRoleOrganizer } from '../redux/actions/auth-actions.jsx';
import AdminDatasetItemList from './admin-dataset-item-list.jsx';
import { lang } from "../lib/lang";
import { topRightCloseButton } from './view-helper/view-helper';
import { SiteUrl } from '../../config/app-config.js';


export default class AdminDataset extends React.Component {
    constructor(props) {
        super(props);
        this.formOnSubmit = this.formOnSubmit.bind(this);

        this.state = {
            generalFormPageKey: 0,
            error: null,
            disableSubmit: false,
            success: null,
        };
    }
    componentWillMount() {
        this.getExtraEditData = (d) => {
            let r = {};
            r["data-name"] = d.name;
            r["data-cf"] = d.cf;
            r["data-source"] = d.source;
            return r;
        }
        this.offset = 10;
        this.addFormItem = [
            {
                name: "name",
                type: "text",
                placeholder: "Dataset name",
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
                name: "search",
                type: "text",
                placeholder: `Search by dataset name ${isRoleAdmin() ? 'or CF tag' : ''}`
            },
        ];

        this.searchFormOnSubmit = (d) => {
            this.search = d;
            this.searchParams = "";
            if (d != null) {
                this.searchParams += (d.search) ? `search:"${d.search}",` : "";
            }
        };


        this.loadData = (page, offset) => {
            return graphql(`
                query{
                global_dataset(${this.searchParams} page:${page}, offset:${offset} ${isRoleOrganizer() ? `, cf:"${getCF()}"` : ''})
                { ID cf name source } 
            }`);
        };

        this.tableHeader = <thead>
            <tr>
                <th>Dataset</th>
                {isRoleAdmin() ? <th>Career Fair</th> : null}
                <th className="text-right">Action</th>
            </tr>
        </thead>;

        this.renderRow = (d, i) => {
            let row = [];
            row.push(<td>
                <div>
                    <a className="text-link" onClick={() => {
                        layoutActions.storeUpdateFocusCard(
                            `Dataset Item - ${d["name"]}`,
                            AdminDatasetItemList,
                            {
                                id: d["ID"],
                                source: d["source"],
                                name: d["name"],
                            },
                            "body-no-margin",
                        );
                    }}>
                        {d.name}
                    </a>
                </div>
                <div className="text-muted"><small>#{d.source}</small></div>
            </td >);

            if (isRoleAdmin()) {
                row.push(<td style={{ width: '150px' }}>{d.cf}</td>);
            }
            return row;
        }

        this.getDataFromRes = (res) => {
            return res.data.data.global_dataset;
        }

        this.getFormItem = (edit) => {
            var ret = [{ header: "Dataset Info" }];
            ret.push({
                label: "Dataset Name",
                name: "name",
                type: "text",
                required: true,
            })
            return ret;
        }


        this.getEditFormDefault = (id, el) => {
            return getAxiosGraphQLQuery(`query{global_dataset(ID:${id}){ID name}}`).then((res) => {
                return res.data.data.global_dataset[0];
            });
        }

    }

    formEditWillSubmit(d, edit) {
        return d;
    }

    formOnSubmit(d) {
        toggleSubmit(this, { error: null });
        getAxiosGraphQLQuery(`
            mutation{
                add_global_dataset
                (cf:"${getCF()}", name:"${d["name"]}", created_by:${getAuthUser().ID})
                {ID}
            }
        `)
            .then((res) => {
                var mes = `Successfully added new dataset. Please refresh this page to see it`;
                toggleSubmit(this, { error: null, success: mes });
            }).catch(err => {
                toggleSubmit(this, { error: err.toString() });
            })
    }

    getCustomAction({ id, actionClass, extra }) {
        return <span><a
            className={actionClass} id={id} {...extra}
            onClick={(e) => {
                const id = e.currentTarget.id;
                let curElement = e.currentTarget;
                let originalData = curElement.dataset;
                // console.log("curElement.dataset", curElement.dataset)
                layoutActions.customPopup(
                    <div>
                        {topRightCloseButton(() => {
                            layoutActions.storeHideBlockLoader();
                        })}
                        <div className="text-left text-3xl pb-8">
                            {lang("Duplicating dataset")} <b>{originalData.name}</b>
                        </div>
                        <Form
                            className="form-row"
                            items={[
                                {
                                    label: "New Dataset Name",
                                    name: "name",
                                    type: "text",
                                    required: true,
                                }
                            ]}
                            headerClassName="text-right"
                            defaultValues={{ name: `${originalData.name} (Copy)` }}
                            onSubmit={(d) => {
                                console.log(d)
                                let name = d.name;
                                layoutActions.loadingBlockLoader();
                                postRequest(SiteUrl + "/dataset-datapoint/duplicate-dataset",
                                    {
                                        name: name,
                                        from_source: originalData.source,
                                        cf: getCF(),
                                        created_by : getAuthUser().ID
                                    }
                                ).then(res => {
                                    layoutActions.storeHideBlockLoader();
                                    layoutActions.customPopupSmall(<div>
                                        <h3 className="font-bold text-green-500">Success</h3>
                                        Dataset successfully duplicated.<br></br>
                                        Please refresh this page.
                                        <div className="pt-8">
                                            <button className="btn btn-primary" onClick={() => {
                                                layoutActions.closePopup();
                                                location.reload();
                                            }}>Refresh Page</button>
                                        </div>
                                    </div>)
                                    // this.setState((prev) => {
                                    //     return { generalFormPageKey: prev.generalFormPageKey + 1 }
                                    // })
                                }).catch(err => {
                                    layoutActions.storeHideBlockLoader();
                                    alert(err.toString());
                                })
                            }}
                            submitText="Duplicate"
                        ></Form>

                    </div>
                );
            }}>
            {lang("Duplicate")}
        </a>{" | "}</span>;
    }

    render() {
        document.setTitle("Datapoint & Dataset");
        return (<div>
            <div>
                <h4>Add New Dataset</h4>
                <Form className="form-row"
                    items={this.addFormItem}
                    onSubmit={this.formOnSubmit}
                    submitText="Add Dataset"
                    disableSubmit={this.state.disableSubmit}
                    error={this.state.error}
                    errorPosition="top"
                    emptyOnSuccess={true}
                    success={this.state.success}></Form>
            </div>
            <br></br>
            <h3>Dataset</h3>
            <GeneralFormPage
                key={this.state.generalFormPageKey}
                formWillSubmit={this.formEditWillSubmit}
                dataOffset={this.offset}
                noMutation={true}
                customAction={this.getCustomAction}
                canEdit={true}
                getExtraEditData={this.getExtraEditData}
                canDelete={true}
                getFormItem={this.getFormItem}
                getEditFormDefault={this.getEditFormDefault}
                entity_singular="Dataset"
                entity="global_dataset" // todo
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

