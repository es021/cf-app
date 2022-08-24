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


export default class AdminCfQuery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            current: null,
            tableData: null,
        };
    }

    componentWillMount() {
        this.cf = this.props.match.params.cf;
        this.start = this.props.match.params.start;
        this.end = this.props.match.params.end;

        this.loadQueryList();
    }

    loadQueryList() {
        layoutActions.loadingBlockLoader("Initializing...");
        postRequest(SiteUrl + "/cf-query/query-list",
            {}
        ).then(res => {
            layoutActions.storeHideBlockLoader();
            this.setState({ list: res.data });
        }).catch(err => {
            layoutActions.storeHideBlockLoader();
            alert(err.toString());
            // this.setState({ loading: false });
            // layoutActions.errorBlockLoader(err.response.data);
        })
    }

    selectQuery(q) {
        this.setState({
            current: q,
            tableData: null
        })
        layoutActions.loadingBlockLoader("Fetching data...");
        postRequest(SiteUrl + "/cf-query/fetch-data",
            { query: q, cf: this.cf, start: this.start, end: this.end }
        )
            .then(res => {
                layoutActions.storeHideBlockLoader();
                this.setState({
                    tableData: res.data
                })
            }).catch(err => {
                layoutActions.storeHideBlockLoader();
                alert(err.toString());
            })
    }


    // getAcceptEmpty() {
    //     let r = [];

    //     for (var attr of this.CfFormAttribute) {
    //         if (this.formType(attr) != "number") {
    //             r.push(attr);
    //         }
    //     }

    //     return r;
    // }
    // getCfFormAttribute() {
    //     let r = ["name"];
    //     // ...CFS,
    //     let obj = { ...CFSMeta }
    //     for (var k in obj) {
    //         if (["TABLE", "ID", "TIME", "CREATED_AT", "UPDATED_AT"].indexOf(k) >= 0) {
    //             continue;
    //         }
    //         r.push(obj[k]);
    //     }

    //     return r;
    // }

    // formType(name) {
    //     if (["can_login", "can_register", "is_local", "hall_cfg_onsite_call_use_group"].indexOf(name) >= 0) {
    //         return "number";
    //     }
    //     if (["organizations"].indexOf(name) >= 0) {
    //         return "textarea"
    //     }
    //     if (["start", "end"].indexOf(name) >= 0) {
    //         return "datetime-local"
    //     }
    //     return "text";
    // }
    // formSublabel(name) {
    //     // if (name == "start" || name == "end") {
    //     //     return <div>Please follow the following format :<br></br>
    //     //         <b>Jul 18 2019 10:00:00 GMT +0800 (+08)</b></div>;
    //     // }
    //     if (["image_header_icon_full"].indexOf(name) >= 0) {
    //         return <div>Requirements: <br></br>Height is between 50px - 60px. <br></br>Background is transparent. <br></br>Format is png.</div>;
    //     }

    //     if (["is_active", "is_load", "can_register", "can_login", "hall_cfg_onsite_call_use_group", "is_local"].indexOf(name) >= 0) {
    //         return <div>Accepted value : <b>1</b> or <b>0</b></div>;
    //     }

    //     if (["cf_order"].indexOf(name) >= 0) {
    //         return <div>Accepted value : <b>Numeric</b></div>;
    //     }

    //     if (name.indexOf("feature_") == 0) {
    //         return <div>Accepted value : <b>ON</b> or <b>OFF</b></div>;
    //     }

    //     /**
    //      * [{"label":"Host Universities","icon_size":"150","data":[{"name":"Universiti Teknologi MARA","logo":"UITM.jpg","shortname":"UITM"},{"name":"Universiti Tunku Abdul Rahman","shortname":"UTAR","logo":"UTAR.jpg"},{"name":"Universiti Teknologi Malaysia","shortname":"UTM","logo":"UTM.jpg"}]},{"label":"Championed By","icon_size":"200","data":[{"name":"Malaysia Digital Economy Corporation","logo":"MDEC.jpg","shortname":"MDEC"}]},{"label":"Strategic Partner","icon_size":"150","data":[{"name":"Seeds Job Fair","logo":"logo.png"}]}]
    //      */
    //     if (["organizations"].indexOf(name) >= 0) {
    //         return <div>Accepted value : <b>JSON Array</b><br></br>
    //             <span>{`[{"label":"Universities","icon_size":"150","data":[{"name":"Universiti Teknologi MARA","logo":"UITM.jpg","shortname":"UITM"}]}]`}</span>
    //         </div>;
    //     }
    //     return null;
    // }
    // formHidden(name) {
    //     if ([""].indexOf(name) >= 0) {
    //         return true;
    //     }
    //     return false;
    // }
    // formRequired(name) {
    //     if ([""].indexOf(name) >= 0) {
    //         return true;
    //     }
    //     return false;
    // }
    // formDisabled(name) {
    //     if (["name"].indexOf(name) >= 0) {
    //         return true;
    //     }
    //     return false;
    // }

    // componentWillMount() {

    //     this.cf = this.props.match.params.cf;

    //     this.offset = 10;

    //     this.addFormItem = [
    //         {
    //             name: "cf",
    //             type: "text",
    //             placeholder: "TEST",
    //             required: true
    //         },
    //     ];

    //     //##########################################
    //     //  search
    //     this.searchParams = "";
    //     this.search = {};
    //     this.searchFormItem = [{ header: "Enter Your Search Query" },
    //     {
    //         label: "Tag : ",
    //         name: "name",
    //         type: "text",
    //         placeholder: "SEEDS, IMPACT, CITRA"
    //     }];

    //     this.searchFormOnSubmit = (d) => {
    //         this.search = d;
    //         this.searchParams = "";
    //         if (d != null) {
    //             this.searchParams += (d.name) ? `name:"${d.name}",` : "";
    //         }
    //     };


    //     this.loadData = (page, offset) => {
    //         return graphql(`query{cfs(${this.searchParams} is_load:1, page:${page}, offset:${offset}, order_by:"cf_order desc")
    //             { ${graphqlAttr(CFS, CFSMeta)} } }`);
    //     };



    //     this.tableHeader = <thead>
    //         <tr>
    //             <th>Info</th>
    //             <th>Details</th>
    //         </tr>
    //     </thead>;

    //     this.renderRow = (d, i) => {
    //         var row = [];
    //         let infoColumn = [];
    //         let detailColumn = [];
    //         for (var key in d) {
    //             if (key == "ID" || key == "name" || key == "cf_order") {
    //                 infoColumn.push(<div><b>{key}</b> : {d[key]}</div>);

    //                 if (key == "cf_order") {
    //                     infoColumn.push(<div><br></br><b>
    //                         <NavLink
    //                             to={`${AppPath}/cf-query/${d['name']}`}>
    //                             Open Career Fair Query
    //                         </NavLink></b>
    //                     </div>
    //                     );
    //                 }
    //             } else {
    //                 detailColumn.push(<div><b>{key}</b> : {d[key]}</div>)
    //             }
    //         }

    //         row.push(<td>{infoColumn}</td>);
    //         row.push(<td width="100px">{detailColumn}</td>);

    //         return row;
    //     }

    //     this.getDataFromRes = (res) => {
    //         return res.data.data.cfs;
    //     }

    //     this.acceptEmpty = this.getAcceptEmpty();

    //     // props for edit
    //     // create form add new default
    //     this.getFormItem = (edit) => {

    //         var ret = [{ header: "Career Fair Form" }];

    //         for (var attr of this.CfFormAttribute) {
    //             let name = attr;

    //             ret.push({
    //                 label: name,
    //                 sublabel: this.formSublabel(name),
    //                 name: name,
    //                 type: this.formType(name),
    //                 required: this.formRequired(name),
    //                 hidden: this.formHidden(name),
    //                 disabled: this.formDisabled(name)
    //             })
    //         }

    //         return ret;
    //     }

    //     this.getExtraEditData = (d) => {
    //         let r = {};
    //         r["data-name"] = d.name;
    //         return r;
    //     }

    //     this.getEditFormDefault = (id, el) => {
    //         let name = el.dataset.name;
    //         const query = `query{cf(name:"${name}"){
    //             ${graphqlAttr(CFS, CFSMeta)}
    //         }}`;

    //         return getAxiosGraphQLQuery(query).then((res) => {
    //             let r = res.data.data.cf;
    //             r["start"] = Time.timestampToDateTimeInput(r["start"]);
    //             r["end"] = Time.timestampToDateTimeInput(r["end"]);
    //             return r;
    //         });
    //     }

    //     this.forceDiff = ["name"];
    // }

    // formEditWillSubmit(d, edit) {
    //     if (typeof d["start"] !== "undefined") {
    //         d["start"] = Time.dateTimeInputToTimestamp(d["start"]);
    //     }
    //     if (typeof d["end"] !== "undefined") {
    //         d["end"] = Time.dateTimeInputToTimestamp(d["end"]);
    //     }

    //     console.log("edit", edit);
    //     console.log("d", d);
    //     return d;
    // }

    // formOnSubmit(d) {
    //     toggleSubmit(this, { error: null });
    //     postRequest(SiteUrl + "/cf/create", { cf: d.cf }).then(res => {
    //         var mes = `Successfully created career fair ${d.cf}`;
    //         toggleSubmit(this, { error: null, success: mes });
    //     }).catch(err => {
    //         toggleSubmit(this, { error: JSON.stringify(err.response.data) });
    //     })
    // }


    renderQueryList() {
        let list = this.state.list.map((d) => {
            let isCurrent = d.key == this.state.current;
            return <btn
                style={{ fontWeight: isCurrent ? 'bold' : '', opacity: isCurrent ? '' : '0.8', }}
                className="btn btn-link"
                onClick={() => {
                    this.selectQuery(d.key);
                }}>
                {d.label}
            </btn>
        });
        return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            {list}
        </div>

    }


    renderTable() {
        if (!this.state.tableData) {
            return null;
        }
        if (this.state.tableData.length <= 0) {
            return <div style={{ paddingTop: '20px', fontSize: "25px", color: "red" }}>
                No data yet for this query
            </div>;
        }

        let first = this.state.tableData[0];
        let headers = <thead>
            <tr>
                {Object.keys(first).map(d => <th>{d}</th>)}
            </tr>
        </thead>;


        let rows = [];
        for (let data of this.state.tableData) {
            rows.push(<tr>
                {Object.keys(data).map(k => <td>{data[k]}</td>)}
            </tr>);
        }

        return <div className="table-responsive" style={{ paddingTop: '20px' }}>
            <table
                className={`table table-striped table-bordered table-hover table-condensed text-left`}
            >
                {headers}
                <tbody>{rows}</tbody>
            </table>
        </div>;
    }

    render() {
        document.setTitle("Career Fair");
        return (<div>
            <h3>Career Fair Query - {this.cf}</h3>
            {this.renderQueryList()}

            {this.renderTable()}

            {/* <GeneralFormPage
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
            ></GeneralFormPage> */}

        </div>);

    }
}

