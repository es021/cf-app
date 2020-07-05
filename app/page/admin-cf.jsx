import React, { PropTypes } from 'react';
import { ButtonLink } from '../component/buttons.jsx';
import GeneralFormPage from '../component/general-form';
import * as layoutActions from '../redux/actions/layout-actions';
import UserPopup from './partial/popup/user-popup';

//importing for list
import List from '../component/list';
import { getAxiosGraphQLQuery, graphql, graphqlAttr } from '../../helper/api-helper';
import { User, UserMeta, CFS, CFSMeta } from '../../config/db-config';
import { Time } from '../lib/time';
import { createUserTitle } from './users';
import { createCompanyTitle } from './admin-company';


export default class AdminCf extends React.Component {
    constructor(props) {
        super(props);

        this.CfFormAttribute = this.getCfFormAttribute();

    }

    getCfFormAttribute() {
        let r = [];
        let obj = { ...CFS, ...CFSMeta }
        for (var k in obj) {

            if (["TABLE", "ID", "TIME", "CREATED_AT", "UPDATED_AT"].indexOf(k) >= 0) {
                continue;
            }


            r.push(obj[k]);
        }

        return r;
    }

    formType(name) {
        if (["can_login", "can_register", "is_local", "hall_cfg_onsite_call_use_group"].indexOf(name) >= 0) {
            return "number";
        }
        if (["organizations"].indexOf(name) >= 0) {
            return "textarea"
        }
        return "text";
    }
    formSublabel(name) {
        if (name == "start" || name == "end") {
            return <div>Please follow the following format :<br></br>
                <b>Jul 18 2019 10:00:00 GMT +0800 (+08)</b></div>;
        }

        if (["is_active", "is_load", "can_register", "can_login", "hall_cfg_onsite_call_use_group", "is_local"].indexOf(name) >= 0) {
            return <div>Accepted value : <b>1</b> or <b>0</b></div>;
        }

        if (["cf_order"].indexOf(name) >= 0) {
            return <div>Accepted value : <b>Numeric</b></div>;
        }

        if (["feature_company_booth", "feature_sponsor", "feature_drop_resume"].indexOf(name) >= 0) {
            return <div>Accepted value : <b>ON</b> or <b>OFF</b></div>;
        }

        /**
         * [{"label":"Host Universities","icon_size":"150","data":[{"name":"Universiti Teknologi MARA","logo":"UITM.jpg","shortname":"UITM"},{"name":"Universiti Tunku Abdul Rahman","shortname":"UTAR","logo":"UTAR.jpg"},{"name":"Universiti Teknologi Malaysia","shortname":"UTM","logo":"UTM.jpg"}]},{"label":"Championed By","icon_size":"200","data":[{"name":"Malaysia Digital Economy Corporation","logo":"MDEC.jpg","shortname":"MDEC"}]},{"label":"Strategic Partner","icon_size":"150","data":[{"name":"Seeds Job Fair","logo":"logo.png"}]}]
         */
        if (["organizations"].indexOf(name) >= 0) {
            return <div>Accepted value : <b>JSON Array</b><br></br>
            <span>{`[{"label":"Universities","icon_size":"150","data":[{"name":"Universiti Teknologi MARA","logo":"UITM.jpg","shortname":"UITM"}]}]`}</span>
            </div>;
        }
        return null;
    }
    formHidden(name) {
        if ([""].indexOf(name) >= 0) {
            return true;
        }
        return false;
    }
    formRequired(name) {
        if ([""].indexOf(name) >= 0) {
            return true;
        }
        return false;
    }
    formDisabled(name) {
        if (["name"].indexOf(name) >= 0) {
            return true;
        }
        return false;
    }

    componentWillMount() {
        this.offset = 10;

        //##########################################
        //  search
        this.searchParams = "";
        this.search = {};
        this.searchFormItem = [{ header: "Enter Your Search Query" },
        {
            label: "Tag : ",
            name: "name",
            type: "text",
            placeholder: "SEEDS, IMPACT, CITRA"
        }];

        this.searchFormOnSubmit = (d) => {
            this.search = d;
            this.searchParams = "";
            if (d != null) {
                this.searchParams += (d.name) ? `name:"${d.name}",` : "";
            }
        };


        this.loadData = (page, offset) => {
            return graphql(`query{cfs(${this.searchParams} is_load:1, page:${page}, offset:${offset}, order_by:"cf_order desc")
                { ${graphqlAttr(CFS, CFSMeta)} } }`);
        };



        this.tableHeader = <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Order</th>
                <th>Details</th>
            </tr>
        </thead>;

        this.renderRow = (d, i) => {
            var row = [];
            let detailColumn = [];

            for (var key in d) {
                if (key == "ID" || key == "name" || key == "cf_order") {
                    row.push(<td>{d[key]}</td>);
                } else {
                    detailColumn.push(<div><b>{key}</b> : {d[key]}</div>)
                }
            }

            row.push(<td>{detailColumn}</td>);

            return row;
        }

        this.getDataFromRes = (res) => {
            return res.data.data.cfs;
        }

        this.acceptEmpty = this.CfFormAttribute;

        // props for edit
        // create form add new default
        this.getFormItem = (edit) => {

            var ret = [{ header: "Career Fair Form" }];

            for (var attr of this.CfFormAttribute) {
                let name = attr;

                ret.push({
                    label: name,
                    sublabel: this.formSublabel(name),
                    name: name,
                    type: this.formType(name),
                    required: this.formRequired(name),
                    hidden: this.formHidden(name),
                    disabled: this.formDisabled(name)
                })
            }

            return ret;
        }

        this.getExtraEditData = (d) => {
            let r = {};
            r["data-name"] = d.name;
            return r;
        }

        this.getEditFormDefault = (id, el) => {
            let name = el.dataset.name;
            const query = `query{cf(name:"${name}"){
                ${graphqlAttr(CFS, CFSMeta)}
            }}`;

            return getAxiosGraphQLQuery(query).then((res) => {
                return res.data.data.cf;
            });
        }
    }

    render() {
        document.setTitle("Career Fair");
        return (<div><h3>Career Fair</h3>

            <GeneralFormPage
                getExtraEditData={this.getExtraEditData}
                searchFormNonPopup={true}
                dataTitle={this.dataTitle}
                noMutation={true}
                canEdit={true}
                dataOffset={20}
                getFormItem={this.getFormItem}
                getEditFormDefault={this.getEditFormDefault}
                entity_singular="Career Fair"
                entity="user" // todo
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

