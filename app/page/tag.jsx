import React, { PropTypes } from 'react';
import GeneralFormPage from '../component/general-form';
//importing for list
import List from '../component/list';
import { getAxiosGraphQLQuery, graphql } from '../../helper/api-helper';
import { Tag } from '../../config/db-config';

export default class ManageTag extends React.Component {
    constructor(props) {
        super(props);
        this.formAttribute = this.getFormAttribute();
        this.graphqlAttrribute = "ID entity entity_id label"
    }

    getFormAttribute() {
        let r = [];
        let obj = Tag
        for (var k in obj) {
            if (["TABLE", "CREATED_AT", "UPDATED_AT"].indexOf(k) >= 0) {
                continue;
            }
            r.push(obj[k]);
        }
        return r;
    }

    formType(name, edit) {
        // if (["can_login", "can_register", "is_local", "hall_cfg_onsite_call_use_group"].indexOf(name) >= 0) {
        //     return "number";
        // }
        // if (["organizations"].indexOf(name) >= 0) {
        //     return "textarea"
        // }
        return "text";
    }
    formSublabel(name, edit) {
        // if (["is_active", "is_load", "can_register", "can_login", "hall_cfg_onsite_call_use_group", "is_local"].indexOf(name) >= 0) {
        //     return <div>Accepted value : <b>1</b> or <b>0</b></div>;
        // }
        return null;
    }
    formHidden(name, edit) {
        if (["ID", "entity", "entity_id"].indexOf(name) >= 0) {
            return true;
        }
        return false;
    }
    formRequired(name, edit) {
        if (["label"].indexOf(name) >= 0) {
            return true;
        }
        return false;
    }
    formDisabled(name, edit) {
        // if (edit && ["ID", "entity", "entity_id"].indexOf(name) >= 0) {
        //     return true;
        // }
        return false;
    }

    componentWillMount() {
        this.offset = 10;

        //##########################################
        //  search
        // this.searchParams = "";
        // this.search = {};
        // this.searchFormItem = [{ header: "Enter Your Search Query" },
        // {
        //     label: "Tag : ",
        //     name: "name",
        //     type: "text",
        //     placeholder: "SEEDS, IMPACT, CITRA"
        // }];

        // this.searchFormOnSubmit = (d) => {
        //     this.search = d;
        //     this.searchParams = "";
        //     if (d != null) {
        //         this.searchParams += (d.name) ? `name:"${d.name}",` : "";
        //     }
        // };
        // ${this.searchParams} 


        this.loadData = (page, offset) => {
            return graphql(`query{
                tags(entity:"${this.props.entity}", entity_id:${this.props.entity_id})
                    { ${this.graphqlAttrribute} 
                } 
            }`);
        };

        this.getDataFromRes = (res) => {
            return res.data.data.tags;
        }

        // this.tableHeader = <thead>
        //     <tr>
        //         <th>ID</th>
        //         <th>Entity</th>
        //         <th>En</th>
        //         <th>Details</th>
        //     </tr>
        // </thead>;

        this.customRenderRow = (d, editAction, deleteAction) => {
            return <li className="label label-custom">
                <span>
                    <span style={{ marginRight: "3px" }}>{d.label}</span>
                    {editAction}
                    {deleteAction}
                </span>
            </li>;

        }

        // props for edit
        // create form add new default
        this.getFormItem = (edit) => {
            var ret = [{ header: "Add/Edit Tag" }];
            for (var attr of this.formAttribute) {
                let name = attr;
                ret.push({
                    label: name,
                    sublabel: this.formSublabel(name, edit),
                    name: name,
                    type: this.formType(name, edit),
                    required: this.formRequired(name, edit),
                    hidden: this.formHidden(name, edit),
                    disabled: this.formDisabled(name, edit)
                })
            }

            return ret;
        }

        this.getEditFormDefault = (id, el) => {
            // let name = el.dataset.name;
            const query = `query{tag(ID:${id}){
                ${this.graphqlAttrribute}
            }}`;
            return getAxiosGraphQLQuery(query).then((res) => {
                return res.data.data.tag;
            });
        }

        this.formWillSubmit = (d, edit) => {
            if (!edit) {
                d[Tag.ENTITY_ID] = this.props.entity_id;
                d[Tag.ENTITY] = this.props.entity
                delete d[Tag.ID]
            }

            // convert to number
            if (typeof d[Tag.ID] !== "undefined") {
                d[Tag.ID] = Number.parseInt(d[Tag.ID]);
            }
            if (typeof d[Tag.ENTITY_ID] !== "undefined") {
                d[Tag.ENTITY_ID] = Number.parseInt(d[Tag.ENTITY_ID]);
            }

            return d;
        };
    }

    render() {
        // document.setTitle("");
        return (<div><h3>Manage Tag</h3>

            <GeneralFormPage
                // getExtraEditData={this.getExtraEditData}
                // searchFormNonPopup={true}
                // dataTitle={this.dataTitle}
                // noMutation={true}
                contentBelowFilter={<div style={{ height: "15px" }}></div>}
                listClass="custom-list-label flex-center"
                isMutationUseIcon={true}
                entity="tag"
                entity_singular="Tag"
                addButtonText="Add New Tag"
                canEdit={true}
                dataOffset={20}
                isHidePagingBottom={true}
                isHidePagingTop={true}
                getFormItem={this.getFormItem}
                getEditFormDefault={this.getEditFormDefault}
                // searchFormItem={this.searchFormItem}
                // searchFormOnSubmit={this.searchFormOnSubmit}
                // tableHeader={this.tableHeader}
                customRenderRow={this.customRenderRow}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
                formWillSubmit={this.formWillSubmit}
            ></GeneralFormPage>

        </div>);

    }
}

