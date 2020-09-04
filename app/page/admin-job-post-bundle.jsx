import React, { PropTypes } from 'react';
import * as layoutActions from '../redux/actions/layout-actions';
import obj2arg from "graphql-obj2arg";

//importing for list
import { graphql } from '../../helper/api-helper';
import { Vacancy } from '../../config/db-config';


class CreateBundle extends React.Component {
    constructor(props) {
        super(props);
        this.BULLET = "***BULLET***";
        this.ROW_SEPARATOR = `___ROW_SEPARATOR___`;
        this.COLUMN_SEPARATOR = `___COLUMN_SEPARATOR___`;
        this.TEST_COMPANY_ID = 44;
        this.CREATED_BY_ID = 21;
        
        this.Index = {
            COMPANY_ID: 0,
            TITLE: 1,
            TYPE: 2,
            LOCATION: 3,
            URL: 4,
            DESC: 5,
            REQ: 6,
        }
        this.state = {
            preview: "",
            finished: 0,
            total: 0,
        }
    }

    fixType(type) {
        const ALTERNATE = {
            TYPE_FULL_TIME: ["Full Time Position", "Full time position", "Full time", "Full-Time", "Permanent"],
            TYPE_FULL_TIME_AND_INTERN: ["INTERNSHIP AND FULL TIME", "Both"],
            TYPE_INTERN: ["Internship"],
            TYPE_PART_TIME: [""],
            TYPE_GRADUATE_INTERN: [""],
        }
        const VALID = {
            TYPE_FULL_TIME: "Full Time",
            TYPE_FULL_TIME_AND_INTERN: "Full Time & Intern",
            TYPE_INTERN: "Intern",
            TYPE_PART_TIME: "Part Time",
            TYPE_GRADUATE_INTERN: "Graduate Trainee / Internships",
        };

        if (type && typeof type === "string") {
            type = type.trim();
            if (ALTERNATE.TYPE_FULL_TIME.indexOf(type) >= 0) {
                return VALID.TYPE_FULL_TIME;
            }
            if (ALTERNATE.TYPE_FULL_TIME_AND_INTERN.indexOf(type) >= 0) {
                return VALID.TYPE_FULL_TIME_AND_INTERN;
            }
            if (ALTERNATE.TYPE_INTERN.indexOf(type) >= 0) {
                return VALID.TYPE_INTERN;
            }
            if (ALTERNATE.TYPE_PART_TIME.indexOf(type) >= 0) {
                return VALID.TYPE_PART_TIME;
            }
            if (ALTERNATE.TYPE_GRADUATE_INTERN.indexOf(type) >= 0) {
                return VALID.TYPE_GRADUATE_INTERN;
            }
        }

        return type;
    }


    reformatTitleAndLocation(str) {
        if (!str) {
            return str;
        }
        try {
            str = str.replaceAll(`\n`, " ");
            str = str.replaceAll(`"`, "");
            return str;
        } catch (err) {

        }
        return str;
    }

    reformatTypeDescRec(str) {
        if (!str) {
            return str
        }
        const DUH = "xcvbnmDUHDUHDUHDUHDzxcvbnm";

        str = str.replaceAll(`"`, "");
        str = str.replaceAll(`'`, "\\'");

        // if (str.indexOf("1.") >= 0 || str.indexOf(this.BULLET) >= 0) {
        //     console.log(str);
        //     for (var i = 1; i <= 50; i++) {
        //         str = str.replace(`0${i}. `, DUH);
        //         str = str.replace(`${i}. `, DUH);
        //     }

        //     str = str.replaceAll(this.BULLET, DUH);

        //     let arr = str.split(DUH);
        //     str = "";
        //     for (var a of arr) {
        //         a = a.replaceAll("\n", " ");
        //         if (a == "") {
        //             continue;
        //         }
        //         str += `<li>${a}</li>`;
        //     }
        //     let toRet = `<ul style="list-style:circle; padding-left: 25px;">${str}</ul>`;

        //     toRet = toRet.replace("Responsibilities and Tasks:", "</li><li><h4>Responsibilities and Tasks:</h4>")
        //     toRet = toRet.replace("JOB RESPONSIBILITIES", "</li><li><h4>JOB RESPONSIBILITIES:</h4>")

        //     return toRet;
        // }

        return str;
    }


    parseJobPostExcel(row) {
        let companyId,
            title,
            type,
            location,
            url, desc,
            req;

        let r = row.split(this.COLUMN_SEPARATOR);

        title = r[this.Index.TITLE];
        location = typeof this.Index.LOCATION !== "number" ? this.Index.LOCATION : r[this.Index.LOCATION];
        desc = typeof this.Index.DESC !== "number" ? this.Index.DESC : r[this.Index.DESC];
        req = typeof this.Index.REQ !== "number" ? this.Index.REQ : r[this.Index.REQ];
        type = typeof this.Index.TYPE !== "number" ? this.Index.TYPE : r[this.Index.TYPE];
        type = this.fixType(type);
        url = typeof this.Index.URL !== "number" ? this.Index.URL : r[this.Index.URL];
        companyId = typeof this.Index.COMPANY_ID !== "number" ? this.Index.COMPANY_ID : r[this.Index.COMPANY_ID];

        url = url ? url : "";
        companyId = companyId ? companyId.trim() : companyId;
        if (!companyId) {
            return false;
        }

        title = this.reformatTitleAndLocation(title);
        location = this.reformatTitleAndLocation(location);
        type = this.reformatTypeDescRec(type);
        desc = this.reformatTypeDescRec(desc);
        req = this.reformatTypeDescRec(req);

        // console.log(title)
        // console.log(location)
        // console.log(desc)
        // console.log(req)
        // console.log(type)
        // console.log(url)
        // console.log(company_id)
        // console.log("_______________________________________________________")

        if (!companyId || !title) {
            return false
        }

        return {
            companyId: companyId,
            title, title,
            type: type,
            location: location,
            url: url,
            desc: desc,
            req: req
        };
    }

    onClickCreate({ isPreview, isTestCompany }) {
        let v = this.text_create.value;
        let arr = v.split(this.ROW_SEPARATOR);
        let preview = "";

        let total = 0;
        for (var row of arr) {
            if (row) {
                let obj = this.parseJobPostExcel(row);
                if (!obj) {
                    continue;
                }
                let d = {}
                d[Vacancy.COMPANY_ID] = isTestCompany ? this.TEST_COMPANY_ID : obj.companyId;
                d[Vacancy.TITLE] = obj.title;
                d[Vacancy.TYPE] = obj.type;
                d[Vacancy.LOCATION] = obj.location;
                d[Vacancy.APPLICATION_URL] = obj.url;
                d[Vacancy.DESCRIPTION] = obj.desc;
                d[Vacancy.REQUIREMENT] = obj.req;
                d[Vacancy.CREATED_BY] = this.CREATED_BY_ID;

                if (isPreview) {
                    preview += `<tr>
                        <td>${obj.companyId}</td>
                        <td>${obj.title}</td>
                        <td>${obj.type}</td>
                        <td>${obj.location}</td>
                        <td>${obj.url}</td>
                        <td>${obj.desc}</td>
                        <td>${obj.req}</td>
                    </tr>`;
                } else {
                    total++;
                    let q = `mutation { 
                        add_vacancy( ${obj2arg(d, { noOuterBraces: true })} ) { ID } 
                    } `;

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
            preview = `
            <table class=" table table-striped table-bordered table-hover table-condensed text-left">
            <thead>
                <th>Company ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Location</th>
                <th>Application Url</th>
                <th>Description</th>
                <th>Requirement</th>
            </thead>
            <tbody>${preview}</tbody>
            </table>
            `
            this.setState({ preview: preview });
        } else {
            this.setState({ preview: "", total: total, finished: 0 });
        }
    }

    render() {
        let v = <div style={{ padding: "10px" }}>
            <b>Set the column order as follows:</b><br></br>
            Company ID<br></br>{this.COLUMN_SEPARATOR}<br></br>Title<br></br>{this.COLUMN_SEPARATOR}<br></br>Type<br></br>{this.COLUMN_SEPARATOR}<br></br>Location<br></br>{this.COLUMN_SEPARATOR}<br></br>Application Url<br></br>{this.COLUMN_SEPARATOR}<br></br>Description<br></br>{this.COLUMN_SEPARATOR}<br></br>Requirement<br></br>{this.ROW_SEPARATOR}
            <br></br>
            <br></br>
            <b>Paste table here:</b>
            <textarea style={{ width: "100%" }} ref={v => (this.text_create = v)} rows="20"></textarea><br></br><br></br>
            <button onClick={() => { this.onClickCreate({ isPreview: true }) }} className="btn btn-md btn-round-5 btn-blue-light">Preview</button><br></br><br></br>
            <div dangerouslySetInnerHTML={{ __html: this.state.preview }}></div>
            <button disabled={!this.state.preview} onClick={() => { this.onClickCreate({ isTestCompany: true }) }} className="btn btn-md btn-round-5 btn-green">
                Create Bundle For Test Company
            </button>
            <br></br><br></br>
            <button disabled={!this.state.preview} onClick={() => { this.onClickCreate({}) }} className="btn btn-md btn-round-5 btn-green">
                Create Bundle For Real
            </button>
            {this.state.total ? <div><b>{this.state.finished} / {this.state.total}</b></div> : null}
        </div>
        return v;
    }
}

export default class AdminJobPostBundle extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (<div><h3>Create Job Post Bundle</h3>
            <CreateBundle></CreateBundle>
        </div>);

    }
}

