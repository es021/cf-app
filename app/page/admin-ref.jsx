import React, { PropTypes } from 'react';
import * as layoutActions from '../redux/actions/layout-actions';

//importing for list
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
                let val = row.trim();
                if (isPreview) {
                    preview += `<tr>
                        <td>${val}</td>
                    </tr>`;
                } else {
                    total++;

                    let q = `mutation { 
                        add_ref_general (table:"ref_${this.props.reference}", val:"${val}") 
                        { ID val } 
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
export default class AdminRef extends React.Component {
    constructor(props) {
        super(props);
    }
    getButtonOpenCreateBundle(title, reference, props) {
        return <button className="btn btn-success btn-bold btn-round-5"
            onClick={() => {
                layoutActions.storeUpdateFocusCard(title, CreateBundle, { reference: reference, header: props });
            }}>
            {title}
        </button>;
    }
    render() {
        return (<div><h3>Create Dataset Bundle</h3>
            <br></br>
            {this.getButtonOpenCreateBundle("JPA IC Number", "kpt_jpa", ["IC Number"])}
            <br></br><br></br>
            {this.getButtonOpenCreateBundle("UTM UTM Acid ID", "id_utm", ["UTM Acid ID"])}
        </div>);
    }
}

