import React, { PropTypes } from 'react';
import { graphql } from '../../helper/api-helper';

class CreateBundle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            preview: "",
            finished: 0,
            total: 0,
        }
    }

    onClickCreate(isPreview) {
        let v = this.text_create.value;
        let arr = v.split("\n");
        let preview = "";

        let total = 0;
        for (var row of arr) {
            if (row) {

                let rowArr = row.split("\t");
                let ID = rowArr[0].trim();
                let priority = rowArr[1].trim();

                if (isPreview) {
                    preview += `<tr>
                        <td>${ID}</td>
                        <td>${priority}</td>
                    </tr>`;
                } else {
                    total++;

                    let q = `mutation { 
                        edit_company (ID:${ID}, priority:${priority}) 
                        { ID priority } 
                    } `

                    graphql(q).then((res) => {
                        console.log("success", res.data.data)
                        this.setState((prevState) => {
                            return {
                                finished: prevState.finished + 1
                            }
                        })
                    }).catch((err) => {
                        console.log("error", err)
                    })
                }
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
            </thead >
            <tbody>${preview}</tbody>
            </table >
            `
            this.setState({ preview: preview });
        } else {
            this.setState({ preview: "", total: total, finished: 0 });
        }
    }

    render() {
        let headerFormat = this.props.header.reduce(
            (all, curr) => {
                return all + curr + " | ";
            }, "");

        let v = <div style={{ padding: "10px" }}>
            <b>Paste table here:</b><br></br>
            {headerFormat}<br></br>
            <textarea style={{ width: "100%" }} ref={v => (this.text_create = v)} rows="20"></textarea><br></br><br></br>
            <button onClick={() => { this.onClickCreate(true) }} className="btn btn-md btn-round-5 btn-blue-light">Preview</button><br></br><br></br>
            <div dangerouslySetInnerHTML={{ __html: this.state.preview }}></div>
            <button disabled={!this.state.preview} onClick={() => { this.onClickCreate() }} className="btn btn-md btn-round-5 btn-green">
                Create Bundle
            </button>
            {this.state.total ? <div><b>{this.state.finished} / {this.state.total}</b></div> : null}
        </div>
        return v;
    }
}
export default class AdminCompanyPriority extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var title = "Edit Company Priority"
        return (<div><h3>{title} Bundle</h3>
            <CreateBundle header={["Company ID", "Priority"]}></CreateBundle>
        </div>);
    }
}

