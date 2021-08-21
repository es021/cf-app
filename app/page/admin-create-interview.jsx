import React, { PropTypes } from 'react';
import { AdminUrl } from '../../config/app-config';
import { graphql, postRequest } from '../../helper/api-helper';
import { Time } from '../lib/time';
import { getAuthUser, getCF } from '../redux/actions/auth-actions';

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
        let arr = v.split("\n");
        let preview = "";

        let createData = [];
        let index = 0;
        for (var row of arr) {
            if (row) {

                let uniqueId = `row_iv_${index}`
                let rowArr = row.split("\t");
                let company_id = rowArr[0].trim();
                let student_email = rowArr[1].trim();

                let y = this.parseNum(rowArr[2].trim());
                let m = this.parseNum(rowArr[3].trim());
                let d = this.parseNum(rowArr[4].trim());
                let h = this.parseNum(rowArr[5].trim());
                let min = this.parseNum(rowArr[6].trim());

                let apt_time = Time.getUnixFromDateTimeInput(`${y}-${m}-${d}`, `${h}:${min}`);

                if (isPreview) {
                    preview += `<tr>
                        <td>${company_id}</td>
                        <td>${student_email}</td>
                        <td>${y}</td>
                        <td>${m}</td>
                        <td>${d}</td>
                        <td>${h}</td>
                        <td>${min}</td>
                        <td>${Time.getString(apt_time)}</td>
                        <td id="${uniqueId}">...</td>
                    </tr>`;
                } else {
                    createData.push({
                        id: uniqueId,
                        cf: getCF(),
                        company_id: company_id,
                        student_email: student_email,
                        appointment_time: apt_time,
                        updated_by: getAuthUser().ID
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

            postRequest(AdminUrl + "/create-iv-bundle", {
                data: JSON.stringify(createData)
            }).then(res => {
                // directly edit the column

                res = res.data;
                for (let k in res) {
                    let r = res[k];
                    let el = document.getElementById(k)
                    if (r.success) {
                        el.innerHTML = `<div style="color:green; font-weight:bold;">OK</div>`;
                    } else {
                        let txt = ``;
                        for (let err of r.error) {
                            txt += `<li style="color:red;">${err}</li>`;
                        }
                        el.innerHTML = `<ul class="normal">${txt}</ul>`;
                    }
                }
            })
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
            <br></br>
            <b>
                <a href="http://seedsjobfairapp.com/career-fair/wp-content/uploads/2021/08/Interview-Cf-Example.xlsx" target="_blank">
                    See Excel Example</a>
            </b>
            <br></br>
            <br></br>
            <textarea onChange={() => { this.onChangeTextarea() }} style={{ width: "100%" }} ref={v => (this.text_create = v)} rows="20"></textarea><br></br><br></br>
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
export default class AdminCreateInterview extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var title = "Create Interview"
        return (<div><h3>{title} Bundle</h3>
            <CreateBundle header={["Company ID", "Student Email", "Year", "Month", "Day", "Hour", "Minute"]}></CreateBundle>
        </div>);
    }
}

