import React, { PropTypes } from 'react';
import { AdminUrl } from '../../config/app-config';
import { graphql, postRequest } from '../../helper/api-helper';
import { Time } from '../lib/time';
import { getAuthUser, getCF } from '../redux/actions/auth-actions';
import * as layoutAction from "../redux/actions/layout-actions";

class CreateBundle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            preview: "",
        }
    }

    onClickValidate() {

    }

    parseNum(r) {
        let toRet = "00";
        try {
            toRet = Number.parseInt(r);
            if (!isNaN(toRet)) {
                if (toRet < 10) {
                    toRet = "0" + toRet;
                }
            }
            return toRet;
        } catch (err) {

        }
        return r;
    }

    onChangeTextarea() {
        this.setState({ preview: "" });
    }

    onClickCreate(isPreview) {
        let v = this.text_create.value;
        let ref_name = this.ref_name.value;
        let arr = v.split("\n");
        let preview = "";

        let createData = [];
        let index = 0;
        for (var row of arr) {
            if (row) {
                let val = row.trim();
                if (isPreview) {
                    preview += `<tr>
                        <td>${val}</td>
                    </tr>`;
                } else {
                    createData.push({
                        val: val,
                    })
                }
                index++;
            }
        }

        if (isPreview) {
            let headerCol = this.props.header.reduce(
                (all, curr) => {
                    return all + "<th>" + curr + "</th>";
                }, "");

            preview = `
            <table class=" table table-striped table-bordered table-hover table-condensed text-left">
            <thead>
                ${headerCol}
            </thead>
            <tbody>${preview}</tbody>
            </table>
            `
            this.setState({ preview: preview });
        } else {
            // this.setState({ preview: "" });
            layoutAction.loadingBlockLoader();
            postRequest(AdminUrl + "/create-ref-table", {
                ref_name: ref_name,
                data: JSON.stringify(createData)
            }).then(res => {
                res = res.data;
                // directly edit the column
                layoutAction.storeHideBlockLoader();
                if (res.success) {
                    layoutAction.successBlockLoader(<div>
                        Ref table sucessfully created.
                  </div>)
                } else {
                    layoutAction.errorBlockLoader(<div>
                        {JSON.stringify(res)}
                    </div>)
                }
            })
        }
    }

    render() {
        let headerFormat = this.props.header.join("|");

        let v = <div style={{ padding: "10px" }}>
            <b>Table Ref Name:</b><br></br>
            <input
                type="text"
                style={{ width: "100%" }}
                ref={v => (this.ref_name = v)} rows="20"
            ></input>
            <br></br>
            <br></br>
            <b>Paste data here here:</b><br></br>
            {headerFormat}<br></br>
            <textarea
                onChange={() => { this.onChangeTextarea() }} style={{ width: "100%" }}
                ref={v => (this.text_create = v)} rows="20"
            ></textarea>
            <br></br><br></br>
            <button onClick={() => { this.onClickCreate(true) }} className="btn btn-md btn-round-5 btn-blue-light">Preview</button><br></br><br></br>
            <div dangerouslySetInnerHTML={{ __html: this.state.preview }}></div>
            <button disabled={!this.state.preview} onClick={() => { this.onClickCreate() }} className="btnv  btn-md btn-round-5 btn-green">
                Create Bundle
            </button>
            {/* {this.state.total ? <div><b>{this.state.finished} / {this.state.total}</b></div> : null} */}
        </div>
        return v;
    }
}
export default class AdminCreateRefTable extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (<div><h3>Create Ref Table</h3>
            <CreateBundle header={["Value"]}></CreateBundle>
        </div>);
    }
}

