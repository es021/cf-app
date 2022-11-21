import React, { PropTypes } from 'react';
import { getAllCfKey, getAuthUser, getCF, getDatapointConfig, isRoleAdmin, isRoleOrganizer, setLocalStorageCfDatapointConfig } from '../redux/actions/auth-actions.jsx';
import { graphql } from '../../helper/api-helper.js';
import { makeSnakeCase } from '../../helper/general-helper.js';
import { Loader } from '../component/loader.js';
import { IconsPdfUrl } from "../../config/app-config";
import UserFieldHelper from '../../helper/user-field-helper.js';
import * as layoutActions from "../redux/actions/layout-actions";

// const DatapointTypeRegister = {
//     Text: "text",
//     Textarea: "textarea",
//     Select: "select",
//     Number: "number",
//     Resume: "resume",
//     AcceptCheckbox: "accept_checkbox"
// }

export default class AdminDatapoint extends React.Component {
    constructor(props) {
        super(props);

        this.ConfigComponents = ["register", "profile", "popup", "card", "filter"]
        let config = getDatapointConfig()
        this.OriginalConfig = JSON.parse(JSON.stringify(config))
        for (let i in config) {
            for (let c of this.ConfigComponents) {
                // always has a popup obj
                if (config[i][c]) {
                    config[i]["has_" + c] = true;
                } else {
                    config[i]["has_" + c] = false;
                }
            }
        }
        this.state = {
            loading: true,
            cf: getCF(),
            config: config,
            dataset: []
        };
    }

    componentWillMount() {
        this.loadDatasets();
    }

    async loadDatasets() {
        let res = await graphql(`query{global_dataset(cf:"${this.state.cf}"){name source}}`);
        res = res.data.data.global_dataset
        this.setState({
            dataset: res.map(d => {
                return {
                    text: d.name, value: d.source
                }
            }),
            loading: false
        });
    }

    currentValue(index, key) {
        try {

            let config = JSON.parse(JSON.stringify(this.state.config));
            let cObj = config[index];
            for (let c of this.ConfigComponents) {
                if (!cObj[c]) {
                    cObj[c] = {}
                }
            }
            let v;
            if (key == "label") {
                v = cObj["register"]["label"];
                if (!v) v = cObj["popup"]["label"];
                if (!v) v = cObj["filter"]["title"];
            }
            if (key == "terms") {
                try {
                    v = cObj["register"]["data"][0]["label"];
                } catch (err) {
                    v = "";
                }
            }
            if (key == "terms_error") {
                v = cObj["register"]["required_error"];
            }
            if (key == "question") {
                v = cObj["profile"]["label"];
            }
            if (key == "question_hint") {
                v = cObj["profile"]["sublabel"];
            }
            if (key == "question_placeholder") {
                v = cObj["register"]["input_placeholder"];
                if (!v) v = cObj["profile"]["input_placeholder"];
            }
            if (key == "question_type") {
                v = cObj["register"]["input_type"];
                if (!v) v = cObj["profile"]["input_type"];
            }
            if (key == "question_dataset") {
                v = cObj["register"]["dataset_source"];
                if (!v) v = cObj["profile"]["dataset_source"];
                if (!v) v = cObj["filter"]["dataset_source"];
            }
            if (key == "question_dataset_order") {
                v = cObj["register"]["dataset_order_by"];
                if (!v) v = cObj["profile"]["dataset_order_by"];
            }
            if (key == "is_required") {
                v = cObj["register"]["required"];
                if (!v) v = cObj["profile"]["is_required"];
            }
            if (key == "is_resume_required") {
                v = cObj["register"]["is_resume_required"];
            }
            // if (key == "filter_type") {
            //     v = cObj["filter"]["type"];
            // }
            if (key == "icon") {
                v = cObj["popup"]["icon"];
            }
            if (!v) {
                return cObj[key];
            }
            return v;
        } catch (err) {
            return null;
        }
    }
    updateConfig(index, key, v) {
        this.setState(prevState => {
            let cObj = prevState.config[index];
            for (let c of this.ConfigComponents) {
                if (!cObj[c]) {
                    cObj[c] = {}
                }
            }

            if (key == "label") {
                cObj["register"]["label"] = v;
                cObj["popup"]["label"] = v;
                cObj["filter"]["title"] = v;
                cObj["filter"]["type"] = "checkbox";
                ///////////////////////////////////////
            } else if (key == "terms") {
                cObj["register"]["position"] = "bottom";
                cObj["register"]["is_accept_checkbox"] = true;
                cObj["register"]["input_type"] = "checkbox";
                cObj["register"]["data"] = [{
                    key: "accepted",
                    label: v
                }];
                ///////////////////////////////////////
            } else if (key == "terms_error") {
                cObj["register"]["required_error"] = v;
                ///////////////////////////////////////
            } else if (key == "question") {
                cObj["profile"]["label"] = v;
                ///////////////////////////////////////
            } else if (key == "question_hint") {
                cObj["profile"]["sublabel"] = v;
                ///////////////////////////////////////
            } else if (key == "question_placeholder") {
                cObj["register"]["input_placeholder"] = v;
                cObj["profile"]["input_placeholder"] = v;
                ///////////////////////////////////////
            } else if (key == "question_type") {
                cObj["register"]["input_type"] = v;
                cObj["profile"]["input_type"] = v;
                ///////////////////////////////////////
            } else if (key == "question_dataset") {
                cObj["register"]["dataset_source"] = v;
                cObj["profile"]["dataset_source"] = v;
                cObj["filter"]["dataset_source"] = v;
                ///////////////////////////////////////
            } else if (key == "question_dataset_order") {
                cObj["register"]["dataset_order_by"] = v;
                cObj["profile"]["dataset_order_by"] = v;
                ///////////////////////////////////////
            } else if (key == "is_required") {
                cObj["register"]["required"] = v;
                cObj["profile"]["is_required"] = v;
                ///////////////////////////////////////
            } else if (key == "is_resume_required") {
                cObj["register"]["position"] = "bottom";
                cObj["register"]["input_type"] = "custom";
                cObj["register"]["is_resume"] = true;
                cObj["register"]["is_resume_required"] = v;
                ///////////////////////////////////////
            }
            else if (key == "icon") {
                cObj["popup"]["icon"] = v;
                ///////////////////////////////////////
            } else {
                cObj[key] = v;
            }

            prevState.config[index] = cObj;
            return {
                config: prevState.config
            }
        })
    }
    isHas(index, key) {
        return this.state.config[index]["has_" + key];
    }
    isTypeSingle(index) {
        return this.state.config[index]["type"] == "single"
    }
    isTypeMulti(index) {
        return this.state.config[index]["type"] == "multi"
    }
    isTypeResume(index) {
        return this.state.config[index]["type"] == "resume"
    }
    isTypeAcceptCheckbox(index) {
        return this.state.config[index]["type"] == "accept_checkbox"
    }
    renderItem() {
        return this.state.config.map((d, index) => {

            let checkboxs = [];

            if (this.isTypeSingle(index) || this.isTypeResume(index) || this.isTypeAcceptCheckbox(index)) {
                checkboxs.push(
                    this.inputCheckbox({
                        label: "Registration Form",
                        key: "has_register",
                        index: index,
                    })
                );
            }

            if (this.isTypeSingle(index) || this.isTypeMulti(index) || this.isTypeResume(index)) {
                checkboxs.push(
                    this.inputCheckbox({
                        label: "Profile Setup",
                        key: "has_profile",
                        index: index,
                    }));
            }

            if (this.isTypeSingle(index) || this.isTypeMulti(index)) {
                checkboxs.push(
                    this.inputCheckbox({
                        label: "Participant Detail Popup",
                        key: "has_popup",
                        index: index,
                    }),
                    this.inputCheckbox({
                        label: "Participant Listing Filter (Only for question type 'Select')",
                        key: "has_filter",
                        index: index,
                    }),
                );
                // checkboxs.push(
                    // this.inputCheckbox({
                    //     label: "Participant Listing Card (Coming Soon)",
                    //     key: "has_card",
                    //     index: index,
                    // }),
                // )
            }

            let items = []
            if (this.isHas(index, "register") || this.isHas(index, "profile")) {

                if (this.isTypeAcceptCheckbox(index)) {
                    items.push(this.inputTextarea({
                        required: true,
                        label: "Write down the terms here (can be HTML format)",
                        key: "terms",
                        index: index,
                        rows: 5,
                    }))
                    items.push(this.inputTextarea({
                        required: true,
                        label: "Error to show if user did not check on the term",
                        key: "terms_error",
                        index: index,
                        rows: 2,
                    }))
                }

                if (this.isTypeResume(index)) {
                    items.push(this.inputSelect({
                        required: true,
                        label: "Is Resume Mandatory?",
                        key: "is_resume_required",
                        index: index,
                        dataset: [
                            { text: "", value: "" },
                            {
                                text: "Yes",
                                value: true,
                            },
                            {
                                text: "No",
                                value: false,
                            },
                        ]
                    }))
                }

                if (this.isTypeSingle(index) || this.isTypeMulti(index)) {
                    items.push(this.inputSelect({
                        required: true,
                        label: "Is Mandatory?",
                        key: "is_required",
                        index: index,
                        dataset: [
                            { text: "", value: "" },
                            {
                                text: "Yes",
                                value: true,
                            },
                            {
                                text: "No",
                                value: false,
                            },
                        ]
                    }))
                    items.push(this.inputText({
                        required: true,
                        label: "Question",
                        key: "question",
                        index: index,
                    }))
                    items.push(this.inputSelect({
                        required: true,
                        label: "Question Type",
                        key: "question_type",
                        index: index,
                        dataset: [
                            { text: "", value: "" },
                            {
                                text: "Text",
                                value: "text",
                            },
                            {
                                text: "Select",
                                value: "select",
                            },
                            {
                                text: "Textarea",
                                value: "textarea",
                            },
                            {
                                text: "Number",
                                value: "number",
                            },
                        ]
                    }))
                    items.push(this.inputText({
                        label: "Question Hint",
                        key: "question_hint",
                        index: index,
                    }))
                    items.push(this.inputText({
                        label: "Question Placeholder",
                        key: "question_placeholder",
                        index: index,
                    }))
                    if (this.currentValue(index, "question_type") == "select") {
                        items.push(this.inputSelect({
                            required: true,
                            label: "Dataset",
                            key: "question_dataset",
                            index: index,
                            dataset: [
                                { text: "", value: "" },
                                ...this.state.dataset
                            ]
                        }))
                        items.push(this.inputSelect({
                            required: true,
                            label: "Dataset Order By",
                            key: "question_dataset_order",
                            index: index,
                            dataset: [
                                { text: "", value: "" },
                                { text: "Value - Ascending", value: "val asc" },
                                { text: "Value - Descending", value: "val desc" },
                                { text: "Create Time - Ascending", value: "created_at asc" },
                                { text: "Create Time - Descending", value: "created_at desc" },
                            ]
                        }))
                    }
                    // if (this.isHas(index, "filter")) {
                    //     items.push(this.inputSelect({
                    //         label: "Filter Type",
                    //         key: "filter_type",
                    //         index: index,
                    //         dataset: [
                    //             { text: "", value: "" },
                    //             { text: "Checkbox", value: "checkbox" },
                    //         ]
                    //     }))
                    // }

                    if (this.isHas(index, "popup")) {
                        items.push(this.inputText({
                            required: true,
                            label: "Icon at Popup",
                            key: "icon",
                            icon: this.currentValue(index, "icon"),
                            index: index,
                            footer: <div className="text-right">
                                <a href={IconsPdfUrl} target="_blank">Copy and paste icon name from this list</a>
                            </div>,
                        }))
                    }
                }


            }

            return this.wrapWithCard(
                this.currentValue(index, "label"),
                <div className="row">
                    <div className="col-xs-6">
                        {/* LABEL & TYPE */}
                        {/* LABEL & TYPE */}
                        {this.inputText({
                            required: true,
                            label: "Label",
                            key: "label",
                            index: index,
                        })}
                        {this.inputSelect({
                            required: true,
                            label: "Type",
                            key: "type",
                            index: index,
                            onChange: (v) => {
                                // let current = this.currentValue(index, "type");
                                // let isReset = false;
                                // if (current == "single" || current == "multi") {
                                //     if (v != "single" && v != "multi") {
                                //         isReset = true;
                                //     }
                                // }
                                // else if (current == "resume" || current == "accept_checkbox") {
                                //     isReset = true;
                                // }
                                // if (isReset) {
                                //     this.setState((prevState) => {
                                //         let cObj = prevState.config[index];
                                //         for (let c of this.ConfigComponents) {
                                //             cObj[c] = {};
                                //         }
                                //         prevState.config[index] = cObj;
                                //         return { config: prevState.config }
                                //     })
                                // }
                                this.updateConfig(index, "type", v)
                            },
                            dataset: [
                                { text: "", value: "" },
                                {
                                    text: "Single Input",
                                    value: "single",
                                },
                                {
                                    text: "Multi Input",
                                    value: "multi",
                                },
                                {
                                    text: "Resume Upload",
                                    value: "resume",
                                },
                                {
                                    text: "Checkbox Term & Condition",
                                    value: "accept_checkbox",
                                },
                            ]
                        })}
                        {/* CHECKBOXS */}
                        {/* CHECKBOXS */}
                        <div style={{ padding: '0px 5px', paddingTop: '15px' }}>Select where you want this datapoint to appear *</div>
                        <div style={{ padding: '0px 10px' }}>
                            {checkboxs}
                        </div>
                    </div>
                    <div className="col-xs-6">
                        {items}
                    </div>
                    {this.debugItem(index, d)}
                </div>
            );
        });
    }

    debugItem(index, d) {
        return <div className="col-xs-12">
            <hr></hr>
            <div>
                <div><b>ID</b></div>
                <div>{d["id"]}</div>
            </div>
            <div>
                <div><b>Type</b></div>
                <div>{d["type"]}</div>
            </div>
            {this.ConfigComponents.map(c => {
                return <div>
                    <div><b>{c}</b></div>
                    <div>{JSON.stringify(d[c])}</div>
                </div>
            })}

        </div>
    }

    wrapWithCard(title, body) {
        return <div style={{
            padding: '20px 0px',
        }}>
            <div style={{
                padding: '10px 10px',
                background: "white",
            }}>
                {!title ? null :
                    <div className="row">
                        <div className="col-xs-12">
                            <div style={{ fontWeight: 'bold', fontSize: '20px', paddingBottom: '7px' }}>
                                {title}
                            </div>
                        </div>
                    </div>
                }
                {body}
            </div>
        </div>;
    }
    inputCheckbox({
        label, index, key, onChange, defaultChecked
    }) {
        let refKey = `ref_checkbox_${index}_${key}`;

        return <span className="checkbox">
            <label className="checkbox-inline">
                <input
                    type="checkbox"
                    onChange={() => {
                        let v = this[refKey].checked;
                        if (onChange) {
                            onChange(v);
                        } else {
                            this.updateConfig(index, key, v)
                            this.updateConfig(index, "label", this.currentValue(index, "label"));
                            this.updateConfig(index, "question_dataset", this.currentValue(index, "question_dataset"));
                        }
                    }}
                    ref={r => {
                        this[refKey] = r;
                    }}
                    defaultChecked={defaultChecked ? defaultChecked : this.currentValue(index, key)}
                />
                {label}
            </label>
        </span>
    }

    inputText({ label, required, index, icon, key, footer }) {
        let refKey = `ref_text_${index}_${key}`;
        return <tr>
            <td style={{ padding: '5px 10px' }}>
                {label}{required ? ' *' : ''}
                {icon
                    ? <span style={{ paddingLeft: '10px' }}>
                        <i className={"fa fa-" + icon}></i>
                    </span>
                    : null
                }
            </td>
            <td style={{ minWidth: '300px' }}>
                <input
                    style={{ width: '100%' }}
                    onChange={() => {
                        this.updateConfig(index, key, this[refKey].value)
                    }}
                    defaultValue={this.currentValue(index, key)}
                    ref={r => {
                        this[refKey] = r;
                    }}
                />
                {footer}
            </td>

        </tr >
    }
    inputTextarea({ label, required, index, icon, key, footer, rows }) {
        let refKey = `ref_text_${index}_${key}`;
        return <div style={{ padding: '5px 10px' }}>
            <div>
                {label}{required ? ' *' : ''}
                {icon
                    ? <span style={{ paddingLeft: '10px' }}>
                        <i className={"fa fa-" + icon}></i>
                    </span>
                    : null
                }
            </div>
            <div style={{ minWidth: '300px' }}>
                <textarea rows={rows} style={{ width: '100%' }}
                    onChange={() => {
                        this.updateConfig(index, key, this[refKey].value)
                    }}
                    defaultValue={this.currentValue(index, key)}
                    ref={r => {
                        this[refKey] = r;
                    }} />
                {footer}
            </div>
        </div >
    }
    inputSelect({ required, label, index, key, dataset = [], defaultValue = null, onChange, footer }) {
        let refKey = `ref_select_${index}_${key}`;
        return <tr>
            <td style={{ padding: '5px 10px' }}>{label}{required ? ' *' : ''}</td>
            <td style={{ minWidth: '300px' }}>
                <select style={{ height: '26px', width: '100%' }}
                    onChange={() => {
                        let v = this[refKey].value
                        if (onChange) {
                            onChange(v);
                        } else {
                            this.updateConfig(index, key, v)
                        }
                    }}
                    defaultValue={defaultValue != null ? defaultValue : this.currentValue(index, key)}
                    ref={r => {
                        this[refKey] = r;
                    }}
                >
                    {dataset.map(d => {
                        return <option key={key + '_' + d.text} value={d.value}>
                            {d.text}
                        </option>
                    })}
                </select>
                {footer}
            </td>
        </tr>
    }

    getChangeCfTagSelect() {
        return this.inputSelect({
            label: "Select Event Tag",
            key: "select_event_tag",
            defaultValue: getCF(),
            onChange: (v) => {
                this.setState({
                    cf: v
                })
            },
            dataset: getAllCfKey().map(d => {
                return { text: d, value: d }
            }),
        })
    }
    generateId(label, type) {
        label = makeSnakeCase(label);
        return `${label}_${type}_${Date.now()}`;
    }
    renderSaveBtn() {
        return <div
            style={{
                margin: '20px 0px',
            }}
            onClick={() => {
                let toSave = JSON.parse(JSON.stringify(this.state.config));
                for (let index in toSave) {
                    let label = this.currentValue(index, "label");
                    let type = this.currentValue(index, "type");

                    if (!label || !type) {
                        layoutActions.errorBlockLoader("Please make sure 'Label' and 'Type' field is filled for all datapoint.");
                        return;
                    }

                    let id = toSave[index]["id"];
                    if (!id) {
                        id = this.generateId(label, type);
                        toSave[index]["id"] = id
                    }

                    for (let k of this.ConfigComponents) {
                        if (!this.isHas(index, k)) {
                            delete toSave[index][k];
                        }
                    }

                    for (let k in toSave[index]) {
                        if (k.indexOf("has_") == 0) {
                            delete toSave[index][k];
                        }
                    }
                }

                console.log("toSave", toSave);
                console.log("toSave", toSave);
                console.log("toSave", toSave);

                let r = JSON.stringify(JSON.stringify(toSave));
                layoutActions.loadingBlockLoader();
                graphql(`mutation{
                    edit_cf(name:"${this.state.cf}", datapoint_config:${r}){name}
                }`).then(res => {
                    setLocalStorageCfDatapointConfig(toSave);
                }).catch(err => {

                }).finally(() => {
                    layoutActions.storeHideBlockLoader();
                })
            }}
            className="btn btn-lg btn-success">
            Save
        </div>
    }
    renderAddNewDatapoint() {
        return this.wrapWithCard(
            null,
            <div className="clickable"
                onClick={() => {
                    this.setState((prevState) => {
                        return {
                            config: [...prevState.config, {}]
                        }
                    })
                }}
                style={{ color: "green", fontWeight: "bold" }}>
                <i className="fa fa-plus"></i>{" "}Add New Datapoint
            </div>
        );
    }

    render() {

        document.setTitle("Participant Datapoint");
        return (<div className="text-left" style={{ paddingTop: "10px" }}>
            {this.state.loading
                ? <Loader />
                : <div>
                    <h2 className="text-left" style={{ fontWeight: "bold" }}>
                        Participant Datapoint for {this.state.cf}
                    </h2>
                    <div>{this.getChangeCfTagSelect()}</div>
                    <br></br>
                    {this.state.config.length > 3 ? this.renderSaveBtn() : null}
                    {this.renderItem()}
                    {this.renderAddNewDatapoint()}
                    {this.renderSaveBtn()}

                    <hr></hr>
                    <div>
                        {JSON.stringify(this.OriginalConfig)}
                    </div>
                </div>
            }
        </div>);

    }
}

