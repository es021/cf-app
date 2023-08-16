import React, { PropTypes } from 'react';
import { getAllCfKey, getAuthUser, getCF, getDatapointConfig, isRoleAdmin, isRoleOrganizer, setLocalStorageCfDatapointConfig } from '../redux/actions/auth-actions.jsx';
import { graphql, postRequest } from '../../helper/api-helper.js';
import { makeSnakeCase } from '../../helper/general-helper.js';
import { Loader } from '../component/loader.js';
import { IconsPdfUrl, SiteUrl } from "../../config/app-config";
import UserFieldHelper from '../../helper/user-field-helper.js';
import * as layoutActions from "../redux/actions/layout-actions";

export default class AdminDatapoint extends React.Component {
    constructor(props) {
        super(props);
        this.IS_DEBUG = false;

        this.ConfigComponents = ["register", "profile", "popup", "card", "filter"]
        let config = getDatapointConfig()
        this.OriginalConfig = JSON.parse(JSON.stringify(config))
        this.YES_NO_DATASET = [
            { text: "", value: "" },
            {
                text: "Yes",
                value: true,
            },
            {
                text: "No",
                value: false,
            },
        ];
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
            viewKey: 0,
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

            console.log("config",config)
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
                if (!v) v = cObj["profile"]["title"];
            }/////////////////////////////////
            else if (key == "terms") {
                try {
                    v = cObj["register"]["data"][0]["label"];
                } catch (err) {
                    v = "";
                }
            }/////////////////////////////////
            else if (key == "terms_error") {
                v = cObj["register"]["required_error"];
            }/////////////////////////////////
            else if (key == "question") {
                v = cObj["profile"]["label"];
            } /////////////////////////////////
            else if (key == "question_hint") {
                v = cObj["profile"]["sublabel"];
            }/////////////////////////////////
            else if (key == "parent_input") {
                v = cObj["profile"]["children_of"];
            }/////////////////////////////////
            else if (key == "question_placeholder") {
                v = cObj["register"]["input_placeholder"];
                if (!v) v = cObj["profile"]["input_placeholder"];
            }/////////////////////////////////
            else if (key == "question_type") {
                v = cObj["register"]["input_type"];
                if (!v) v = cObj["profile"]["input_type"];
            }/////////////////////////////////
            else if (key == "question_dataset") {
                v = cObj["register"]["dataset_source"];
                if (!v) v = cObj["profile"]["dataset_source"];
                if (!v) v = cObj["filter"]["dataset_source"];
            }/////////////////////////////////
            else if (key == "question_dataset_order") {
                v = cObj["register"]["dataset_order_by"];
                if (!v) v = cObj["profile"]["dataset_order_by"];
            }/////////////////////////////////
            else if (key == "icon") {
                v = cObj["popup"]["icon"];
            }/////////////////////////////////
            else if (key == "is_required") {
                v = cObj["register"]["required"];
                if (v == null || typeof v === "undefined") v = cObj["profile"]["is_required"];
                return v;
            }/////////////////////////////////
            else if (key == "is_resume_required") {
                v = cObj["register"]["is_resume_required"];
                return v;
            }/////////////////////////////////
            else if (["bold", "italic"].indexOf(key) >= 0) {
                v = cObj["card"][key];
                return v;
            }/////////////////////////////////
            else if (key == "order") {
                v = cObj["card"]["order"];
                return v;
            }/////////////////////////////////
            else if (key == "color") {
                v = cObj["card"]["color"];
                return v;
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
                cObj["profile"]["title"] = v;
                cObj["filter"]["title"] = v;
                cObj["filter"]["type"] = "checkbox";
                ///////////////////////////////////////
            } else if (key == "order") {
                cObj["card"]["order"] = v;
                ///////////////////////////////////////
            } else if (key == "bold") {
                cObj["card"]["bold"] = v;
                ///////////////////////////////////////
            } else if (key == "italic") {
                cObj["card"]["italic"] = v;
                ///////////////////////////////////////
            } else if (key == "color") {
                cObj["card"]["color"] = v;
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
                cObj["register"]["position"] = "top";
                cObj["register"]["input_type"] = "custom";
                cObj["register"]["is_resume"] = true;
                cObj["register"]["is_resume_required"] = v;
                ///////////////////////////////////////
            }
            else if (key == "icon") {
                cObj["popup"]["icon"] = v;
                ///////////////////////////////////////
            } else if (key == "parent_input") {
                cObj["profile"]["children_of"] = v;
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
    getSingleInputDataset(currentIndex) {
        let r = [];
        for (let index in this.state.config) {
            if (index == currentIndex) continue;
            if (this.isTypeSingle(index)) {
                let c = this.state.config[index];
                r.push({
                    text: this.currentValue(index, "label"),
                    value: c.id
                });
            }
        }
        return r;
    }
    renderItem() {
        return this.state.config.map((d, index) => {

            let checkboxs = [];
            // const IS_HAS_PARENT_INPUT = this.currentValue(index, "parent_input");
            const IS_HAS_PARENT_INPUT = false;

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
                        label: "Participant's Detail Popup",
                        key: "has_popup",
                        index: index,
                    }),
                );

            }
            if (this.isTypeSingle(index)) {
                checkboxs.push(
                    this.inputCheckbox({
                        label: "Participant Listing's Card",
                        key: "has_card",
                        index: index,
                    }),
                )
            }
            if (this.isTypeSingle(index) || this.isTypeMulti(index)) {
                checkboxs.push(
                    this.inputCheckbox({
                        label: "Participant Listing's Filter",
                        sublabel: "(Only for question type 'Select')",
                        key: "has_filter",
                        index: index,
                    }));
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

                // if (this.isTypeSingle(index)) {
                //     items.push(this.inputSelect({
                //         required: false,
                //         label: "Parent Input",
                //         key: "parent_input",
                //         index: index,
                //         dataset: [
                //             { text: "", value: "" },
                //             ...this.getSingleInputDataset(index),
                //         ]
                //     }))
                // }

                if (this.isTypeResume(index)) {
                    items.push(this.inputSelect({
                        required: true,
                        label: "Is Resume Mandatory?",
                        key: "is_resume_required",
                        is_bool: true,
                        index: index,
                        dataset: this.YES_NO_DATASET
                    }))
                }
                if (this.isTypeSingle(index) || this.isTypeMulti(index) || IS_HAS_PARENT_INPUT) {
                    items.push(this.subheader("Question Setting"));
                    items.push(this.inputSelect({
                        required: true,
                        label: "Is Mandatory?",
                        key: "is_required",
                        is_bool: true,
                        index: index,
                        dataset: this.YES_NO_DATASET
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
                        if (this.isTypeSingle(index)) {
                            items.push(this.inputSelect({
                                required: true,
                                label: "Has Other Field?",
                                key: "is_has_other",
                                index: index,
                                is_bool: true,
                                dataset: this.YES_NO_DATASET,
                                onChange: (v) => {
                                    this.updateConfig(index, "is_has_other", v);
                                    if (v) {
                                        this.setState((prevState) => {
                                            let otherLabel = this.currentValue(index, "label") + " (Other)"
                                            let otherQuestion = this.currentValue(index, "question") + " (Other)"
                                            prevState.config.splice(index + 1, 0, {
                                                type: "single",
                                                has_register: this.currentValue(index, "has_register"),
                                                has_profile: this.currentValue(index, "has_profile"),
                                                has_popup: this.currentValue(index, "has_popup"),
                                                popup: {
                                                    label: otherLabel,
                                                    icon: this.currentValue(index, "icon"),
                                                },
                                                register: {
                                                    required: false,
                                                    label: otherLabel,
                                                    input_type: "text",
                                                },
                                                profile: {
                                                    is_required: false,
                                                    label: otherQuestion,
                                                    input_type: "text",
                                                }
                                            });
                                            return {
                                                config: [...prevState.config], viewKey: prevState.viewKey + 1
                                            }
                                        })
                                    }
                                },
                            }))
                        }
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

                    if (this.isHas(index, "card")) {
                        items.push(this.subheader("Card Setting"));
                        items.push(this.inputText({
                            required: true,
                            label: "Order Number",
                            placeholder: "1, 2, 3",
                            key: "order",
                            index: index,
                        }))
                        items.push(this.inputText({
                            required: true,
                            label: "(Styling) Color",
                            placeholder: "green, #000000",
                            color: this.currentValue(index, "color"),
                            key: "color",
                            index: index,
                        }))
                        items.push(this.inputSelect({
                            required: true,
                            is_bool: true,
                            label: "(Styling) Is Bold?",
                            key: "bold",
                            index: index,
                            dataset: this.YES_NO_DATASET
                        }))
                        items.push(this.inputSelect({
                            required: true,
                            is_bool: true,
                            label: "(Styling) Is Italic?",
                            key: "italic",
                            index: index,
                            dataset: this.YES_NO_DATASET
                        }))
                    }

                    if (this.isHas(index, "popup")) {
                        items.push(this.subheader("Popup Setting"));
                        items.push(this.inputText({
                            required: true,
                            label: "Icon In Popup",
                            key: "icon",
                            icon: this.currentValue(index, "icon"),
                            index: index,
                            footer: <div className="text-right">
                                Copy and paste icon name from{" "}<a href={IconsPdfUrl} target="_blank"><u>this list</u></a>
                            </div>,
                        }))
                    }

                }


            }


            let body = <div className="row">
                <div className="col-xs-12 col-md-6">
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
                            this.resetCheckbox(index);
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
                    {this.currentValue(index, "type")
                        ? <div>
                            <div style={{ padding: '0px 5px', paddingTop: '25px' }}>
                                <b>
                                    <u>Select where you want this datapoint to appear *</u>
                                </b>
                            </div>
                            <div style={{ padding: '0px 10px' }}>
                                {checkboxs}
                            </div>
                        </div>
                        : null
                    }
                </div>
                <div className="col-xs-12 col-md-6">
                    {items}
                </div>
                <div className="col-xs-12">
                    <br></br>
                    {this.renderAddNewDatapoint({ isInner: true, index: index })}
                </div>
                {this.IS_DEBUG ? this.debugItem(index, d) : null}
            </div>;

            return this.wrapWithCard(
                this.currentValue(index, "label"),
                body,
                {
                    id: "config_item_" + index,
                    onClickSort: (direction) => {
                        let newIndex = direction == "top" ? index - 1 : index + 1;
                        this.setState((prevState) => {
                            if (newIndex < 0) {
                                return;
                            }
                            if (newIndex >= prevState.config.length) {
                                return;
                            }
                            let c = { ...prevState.config[index] };
                            // swap
                            prevState.config[index] = { ...prevState.config[newIndex] };
                            prevState.config[newIndex] = c;
                            return { config: [...prevState.config], viewKey: prevState.viewKey + 1 };
                        })

                        setTimeout(() => {
                            var scrollDiv = document.getElementById("config_item_" + newIndex).offsetTop;
                            scrollDiv -= 116;
                            window.scrollTo({ top: scrollDiv, behavior: 'smooth' });
                        }, 100)
                    },
                    onClickRemove: () => {
                        layoutActions.confirmBlockLoader("Are you sure you want to remove this item?", () => {
                            this.setState((prevState) => {
                                prevState.config.splice(index, 1);
                                return { config: [...prevState.config], viewKey: prevState.viewKey + 1 };
                            })
                            layoutActions.storeHideBlockLoader();
                        });

                    }
                }
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

    wrapWithCard(title, body, options = {}) {
        const { onClickRemove, onClickSort, id } = options;
        return <div
            id={id}
            style={{
                padding: '10px 0px',
            }}>
            <div style={{
                padding: '15px 15px',
                background: "white",
                position: "relative",
                border: "1px solid #d5d5d5",
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
                {onClickRemove
                    ? <i
                        className="fa fa-close clickable"
                        onClick={() => { onClickRemove() }}
                        style={{
                            fontSize: "23px",
                            color: "red",
                            position: "absolute",
                            top: "5px",
                            right: "7px",
                        }}></i>
                    : null
                }
                {onClickSort
                    ? <i
                        className="fa fa-angle-double-up clickable btn-link-bright"
                        onClick={() => { onClickSort('top') }}
                        style={{
                            fontSize: "28px",
                            position: "absolute",
                            top: "32px",
                            right: "7px",
                        }}></i>
                    : null}
                {onClickSort
                    ? <i
                        className="fa fa-angle-double-down clickable btn-link-bright"
                        onClick={() => { onClickSort('bottom') }}
                        style={{
                            fontSize: "28px",
                            position: "absolute",
                            top: "59px",
                            right: "7px",
                        }}></i>
                    : null}
            </div>
        </div>;
    }
    resetCheckbox(index) {
        this.updateConfig(index, "has_register", false)
        this.updateConfig(index, "has_profile", false)
        this.updateConfig(index, "has_popup", false)
        this.updateConfig(index, "has_card", false)
        this.updateConfig(index, "has_filter", false)
        this.setState((prevState) => {
            return { viewKey: prevState.viewKey + 1 }
        })
    }
    inputCheckbox({
        label, sublabel, index, key, onChange, defaultChecked
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
                            this.setState((prevState) => {
                                return { viewKey: prevState.viewKey + 1 }
                            })
                        }
                    }}
                    ref={r => {
                        this[refKey] = r;
                    }}
                    defaultChecked={defaultChecked ? defaultChecked : this.currentValue(index, key)}
                />
                {label}{" "}
                <small className="text-muted">{sublabel}</small>
            </label>
        </span>
    }
    subheader(text) {
        return <tr>
            <div style={{ paddingTop: '5px', paddingBottom: '', textDecoration: "underline" }}>
                <b>{text}</b>
            </div>
        </tr>
    }
    inputText({ label, required, index, icon, color, key, footer, placeholder }) {
        let refKey = `ref_text_${index}_${key}`;
        return <tr>
            <td style={{ padding: '5px 10px' }}>
                {label}{required ? ' *' : ''}
                {color
                    ? <span style={{
                        paddingLeft: '16px',
                        background: color,
                        marginLeft: '10px',
                        borderRadius: '5px',
                    }}>
                    </span>
                    : null
                }
                {icon
                    ? <span style={{ paddingLeft: '10px' }}>
                        <i className={"fa fa-" + icon}></i>
                    </span>
                    : null
                }
            </td>
            <td style={{ minWidth: '300px' }}>
                <input
                    placeholder={placeholder}
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
    inputSelect({ required, is_bool, label, index, key, dataset = [], defaultValue = null, onChange, footer }) {
        let refKey = `ref_select_${index}_${key}`;
        return <tr>
            <td style={{ padding: '5px 10px' }}>{label}{required ? ' *' : ''}</td>
            <td style={{ minWidth: '300px' }}>
                <select style={{ height: '26px', width: '100%' }}
                    onChange={() => {
                        let v = this[refKey].value
                        if (is_bool) {
                            v = v == "true" ? true : false;
                        }
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

    // getChangeCfTagSelect() {
    //     return this.inputSelect({
    //         label: "Select Event Tag",
    //         key: "select_event_tag",
    //         defaultValue: getCF(),
    //         onChange: (v) => {
    //             this.setState({
    //                 cf: v
    //             })
    //         },
    //         dataset: getAllCfKey().map(d => {
    //             return { text: d, value: d }
    //         }),
    //     })
    // }
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


                let r = JSON.stringify(toSave);
                layoutActions.loadingBlockLoader();
                postRequest(SiteUrl + "/dataset-datapoint/update-datapoint-config", {
                    cf: this.state.cf,
                    datapoint_config: r
                }).then(res => {
                    setLocalStorageCfDatapointConfig(toSave);
                }).catch(err => {

                }).finally(() => {
                    layoutActions.storeHideBlockLoader();
                })

                // let r = JSON.stringify(JSON.stringify(toSave));
                // graphql(`mutation{
                //     edit_cf(name:"${this.state.cf}", datapoint_config:${r}){name}
                // }`).then(res => {
                //     setLocalStorageCfDatapointConfig(toSave);
                // }).catch(err => {

                // }).finally(() => {
                //     layoutActions.storeHideBlockLoader();
                // })
            }}
            className="btn btn-lg btn-success">
            Save Changes
        </div>
    }
    renderAddNewDatapoint(options = {}) {
        const { isInner, index } = options;
        let body =
            <div

                style={{
                    color: "green",
                    paddingTop: isInner ? '' : '5px',
                    fontWeight: "bold",
                    fontSize: isInner ? '' : '20px'
                }}>
                <span className="clickable" onClick={() => {
                    this.setState((prevState) => {
                        if (isInner) {
                            prevState.config.splice(index + 1, 0, {});
                        } else {
                            prevState.config.push({});
                        }
                        return {
                            config: [...prevState.config], viewKey: prevState.viewKey + 1
                        }
                    })
                }}>
                    <i className="fa fa-plus"></i>
                    {" "}
                    {isInner ? 'Add Item Below' : 'Add Item'}
                </span>
            </div>;
        if (isInner) {
            return body;
        }
        return this.wrapWithCard(
            null,
            body
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
                    {/* <div>{this.getChangeCfTagSelect()}</div> */}
                    <br></br>
                    {this.state.config.length > 3 ? this.renderSaveBtn() : null}
                    <div key={this.state.viewKey}>
                        {this.renderItem()}
                    </div>
                    {this.renderAddNewDatapoint()}
                    {this.renderSaveBtn()}

                    {/* <hr></hr> */}
                    {/* {this.IS_DEBUG ?
                        <pre>
                            {JSON.stringify(this.state.config).replaceAll(",", ",\n").replaceAll(":{", ":\n{")}
                        </pre> : null
                    } */}
                </div>
            }
        </div>);

    }
}

