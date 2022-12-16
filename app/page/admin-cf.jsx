import React, { PropTypes } from 'react';
import { ButtonLink } from '../component/buttons.jsx';
import GeneralFormPage from '../component/general-form';
import * as layoutActions from '../redux/actions/layout-actions';
import UserPopup from './partial/popup/user-popup';

//importing for list
import List from '../component/list';
import { getAxiosGraphQLQuery, graphql, graphqlAttr, postRequest } from '../../helper/api-helper';
import { User, UserMeta, CFS, CFSMeta, CFSMetaDiscardLoad } from '../../config/db-config';
import { Time } from '../lib/time';
import { createUserTitle } from './users';
import { createCompanyTitle } from './admin-company';
import Form, { toggleSubmit } from '../component/form.js';
import { SiteUrl, AppPath } from '../../config/app-config.js';
import { NavLink } from 'react-router-dom';

export default class AdminCf extends React.Component {
    constructor(props) {
        super(props);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.state = {
            error: null,
            disableSubmit: false,
            success: null,
        };
        this.CfFormAttribute = this.getCfFormAttribute();
    }

    getAcceptEmpty() {
        let r = [];

        for (var attr of this.CfFormAttribute) {
            if (this.formType(attr) != "number") {
                r.push(attr);
            }
        }

        return r;
    }
    getCfFormAttribute() {
        let r = ["name"];
        // ...CFS,
        let obj = { ...CFSMeta }
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
        if (["start", "end"].indexOf(name) >= 0) {
            return "datetime-local"
        }
        return "text";
    }
    formSublabel(name) {
        // if (name == "start" || name == "end") {
        //     return <div>Please follow the following format :<br></br>
        //         <b>Jul 18 2019 10:00:00 GMT +0800 (+08)</b></div>;
        // }
        if (["image_header_icon_full"].indexOf(name) >= 0) {
            return <div>Requirements: <br></br>Height is between 50px - 60px. <br></br>Background is transparent. <br></br>Format is png.</div>;
        }

        if (["is_active", "is_load", "can_register", "can_login", "hall_cfg_onsite_call_use_group", "is_local"].indexOf(name) >= 0) {
            return <div>Accepted value : <b>1</b> or <b>0</b></div>;
        }

        if (["cf_order"].indexOf(name) >= 0) {
            return <div>Accepted value : <b>Numeric</b></div>;
        }

        if (name.indexOf("feature_") == 0) {
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
        if (["name", "datapoint_config"].indexOf(name) >= 0) {
            return true;
        }
        return false;
    }

    componentWillMount() {
        this.offset = 10;

        this.addFormItem = [
            {
                name: "cf",
                type: "text",
                placeholder: "TEST",
                required: true
            },
        ];

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
            let metas = {};
            for (let k in CFSMeta) {
                if (CFSMetaDiscardLoad.indexOf(CFSMeta[k]) <= -1) {
                    metas[k] = CFSMeta[k]
                }
            }
            return graphql(`query{cfs(${this.searchParams} is_load:1, page:${page}, offset:${offset}, order_by:"cf_order desc")
                { ${graphqlAttr(CFS, metas)} } }`);
        };



        this.tableHeader = <thead>
            <tr>
                <th>Info</th>
                <th>Details</th>
            </tr>
        </thead>;

        this.renderRow = (d, i) => {
            var row = [];
            let infoColumn = [];
            let detailColumn = [];
            for (var key in d) {
                if (key == "ID" || key == "name" || key == "cf_order") {
                    infoColumn.push(<div><b>{key}</b> : {d[key]}</div>);

                    if (key == "cf_order") {
                        let start = Time.timestampToDateTimeInput(d["start"]);
                        if (start) {
                            start = start.split("T")[0]
                        }
                        let end = Time.timestampToDateTimeInput(d["end"]);
                        if (start) {
                            end = end.split("T")[0]
                        }
                        infoColumn.push(<div><br></br><b>
                            <NavLink
                                to={`${AppPath}/cf-query/${d['name']}/${start}/${end}`}>
                                Open Career Fair Query
                            </NavLink></b>
                        </div>
                        );
                    }
                } else {
                    detailColumn.push(<div><b>{key}</b> : {d[key]}</div>)
                }
            }

            row.push(<td>{infoColumn}</td>);
            row.push(<td width="100px">{detailColumn}</td>);

            return row;
        }

        this.getDataFromRes = (res) => {
            return res.data.data.cfs;
        }

        this.acceptEmpty = this.getAcceptEmpty();

        // props for edit
        // create form add new default
        this.getFormItem = (edit) => {

            var ret = [{ header: "General Info" }];

            let addedHeader = {};
            for (var attr of this.CfFormAttribute) {
                let name = attr;

                if (name.indexOf("feature_") == 0 && !addedHeader["feature_"]) {
                    addedHeader["feature_"] = true;
                    ret.push({ header: "Feature ON or OFF" });
                }
                if (name.indexOf("text_") == 0 && !addedHeader["text_"]) {
                    addedHeader["text_"] = true;
                    ret.push({ header: "Text Custom Label" });
                }
                if (name.indexOf("color_") == 0 && !addedHeader["color_"]) {
                    addedHeader["color_"] = true;
                    ret.push({ header: "Color Theme Setting" });
                }
                if (name.indexOf("link_") == 0 && !addedHeader["link_"]) {
                    addedHeader["link_"] = true;
                    ret.push({ header: "Link URL Setting" });
                }
                if (name.indexOf("time_") == 0 && !addedHeader["time_"]) {
                    addedHeader["time_"] = true;
                    ret.push({ header: "Other Setting" });
                }

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
                let r = res.data.data.cf;
                r["start"] = Time.timestampToDateTimeInput(r["start"]);
                r["end"] = Time.timestampToDateTimeInput(r["end"]);
                return r;
            });
        }

        this.forceDiff = ["name"];
    }

    formEditWillSubmit(d, edit) {
        if (typeof d["start"] !== "undefined") {
            d["start"] = Time.dateTimeInputToTimestamp(d["start"]);
        }
        if (typeof d["end"] !== "undefined") {
            d["end"] = Time.dateTimeInputToTimestamp(d["end"]);
        }

        console.log("edit", edit);
        console.log("d", d);
        return d;
    }

    formOnSubmit(d) {
        toggleSubmit(this, { error: null });
        postRequest(SiteUrl + "/cf/create", { cf: d.cf }).then(res => {
            var mes = `Successfully created career fair ${d.cf}`;
            toggleSubmit(this, { error: null, success: mes });
        }).catch(err => {
            toggleSubmit(this, { error: JSON.stringify(err.response.data) });
        })
    }

    render() {
        document.setTitle("Career Fair");
        return (<div>
            <div>
                <h4>Add New Career Fair</h4>
                <Form className="form-row"
                    items={this.addFormItem}
                    onSubmit={this.formOnSubmit}
                    submitText="Add Career Fair"
                    disableSubmit={this.state.disableSubmit}
                    error={this.state.error}
                    errorPosition="top"
                    emptyOnSuccess={true}
                    success={this.state.success}></Form>
            </div>
            <h3>Career Fair</h3>
            <GeneralFormPage
                headerClassName="col-sm-12"
                itemClassName="col-sm-6"
                formClassName="form-admin-cf"
                acceptEmpty={this.acceptEmpty}
                forceDiff={this.forceDiff}
                formWillSubmit={this.formEditWillSubmit}
                getExtraEditData={this.getExtraEditData}
                dataTitle={this.dataTitle}
                noMutation={true}
                canEdit={true}
                dataOffset={20}
                getFormItem={this.getFormItem}
                getEditFormDefault={this.getEditFormDefault}
                entity_singular="Career Fair"
                entity="cf" // todo
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

