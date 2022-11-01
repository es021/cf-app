import React, { PropTypes } from 'react';
import * as layoutActions from '../redux/actions/layout-actions';
import obj2arg from "graphql-obj2arg";

//importing for list
import { graphql } from '../../helper/api-helper';
import { Vacancy } from '../../config/db-config';


class CreateBundle extends React.Component {
    constructor(props) {
        super(props);
        this.BULLET = "__WZS21_BULLET__";
        this.ROW_SEPARATOR = `___ROW_SEPARATOR___`;
        this.COLUMN_SEPARATOR = `___COLUMN_SEPARATOR___`;
        this.TEST_COMPANY_ID = 44;
        this.CREATED_BY_ID = 21;

        this.Index = {
            COMPANY_ID: 0,
            TITLE: 1,
            TYPE: 2,
            LOCATION: 3,
            SPECIALIZATION: 4,
            URL: 5,
            DESC: 6,
            REQ: 7,
            OPEN_POSITION: 8,
        }
        this.state = {
            isTestCompany: false,
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

    reformatGeneral(str) {
        if (!str) {
            return str;
        }
        try {
            str = str.replaceAll(`’`, "'");
            return str;
        } catch (err) {
        }
        return str;
    }
    reformatTitleLocationUrl(str) {
        if (!str) {
            return str;
        }
        try {
            str = str.replaceAll(`\n`, " ");
            str = str.replaceAll(`\t`, " ");
            str = str.replaceAll(`"`, "");
            str = str.trim();
            return str;
        } catch (err) {

        }
        return str;
    }
    reformatToInteger(str) {
        str = str.trim();
        let r = Number.parseInt(str);
        if(isNaN(r)){
            return null;
        }

        return r;
    }
    reformatTypeDescRec(str) {
        if (!str) {
            return str
        }
        const DUH = "xcvbnmDUHDUHDUHDUHDzxcvbnm";

        str = str.replaceAll(`"`, "");
        str = str.replaceAll(`'`, "\\'");

        try {
            str = str.replaceAll(`•`, this.BULLET);
            if (str.indexOf("1.") >= 0 || str.indexOf(this.BULLET) >= 0) {
                console.log(str);
                for (var i = 1; i <= 50; i++) {
                    str = str.replace(`0${i}. `, DUH);
                    str = str.replace(`${i}. `, DUH);
                }

                str = str.replaceAll(this.BULLET, DUH);

                let arr = str.split(DUH);
                str = "";
                for (var a of arr) {
                    a = a.replaceAll("\n", " ");
                    // console.log("a", a.length, a.trim().length, a);
                    if (a.trim() == "") {
                        continue;
                    }
                    str += `<li>${a}</li>`;
                }
                let toRet = `<ul style="list-style:circle; padding-left: 25px;">${str}</ul>`;

                toRet = toRet.replace("Responsibilities and Tasks:", "</li><li><h4>Responsibilities and Tasks:</h4>")
                toRet = toRet.replace("JOB RESPONSIBILITIES", "</li><li><h4>JOB RESPONSIBILITIES:</h4>")
                return toRet;
            }
        } catch (err) {

        }

        return str;
    }


    parseJobPostExcel(row) {
        let companyId,
            title,
            type,
            location,
            specialization,
            url, desc, openPosition,
            req;

        let r = row.split(this.COLUMN_SEPARATOR);

        title = r[this.Index.TITLE];
        location = typeof this.Index.LOCATION !== "number" ? this.Index.LOCATION : r[this.Index.LOCATION];
        specialization = typeof this.Index.SPECIALIZATION !== "number" ? this.Index.SPECIALIZATION : r[this.Index.SPECIALIZATION];
        desc = typeof this.Index.DESC !== "number" ? this.Index.DESC : r[this.Index.DESC];
        req = typeof this.Index.REQ !== "number" ? this.Index.REQ : r[this.Index.REQ];
        type = typeof this.Index.TYPE !== "number" ? this.Index.TYPE : r[this.Index.TYPE];
        type = this.fixType(type);
        url = typeof this.Index.URL !== "number" ? this.Index.URL : r[this.Index.URL];
        companyId = typeof this.Index.COMPANY_ID !== "number" ? this.Index.COMPANY_ID : r[this.Index.COMPANY_ID];
        openPosition = typeof this.Index.OPEN_POSITION !== "number" ? this.Index.OPEN_POSITION : r[this.Index.OPEN_POSITION];

        url = url ? url : "";
        companyId = companyId ? companyId.trim() : companyId;
        if (!companyId) {
            return false;
        }

        // general
        title = this.reformatGeneral(title);
        type = this.reformatGeneral(type);
        location = this.reformatGeneral(location);
        specialization = this.reformatGeneral(specialization);
        desc = this.reformatGeneral(desc);
        req = this.reformatGeneral(req);
        openPosition = this.reformatGeneral(openPosition);


        // specific
        title = this.reformatTitleLocationUrl(title);
        location = this.reformatTitleLocationUrl(location);
        url = this.reformatTitleLocationUrl(url);
        type = this.reformatTypeDescRec(type);
        desc = this.reformatTypeDescRec(desc);
        req = this.reformatTypeDescRec(req);
        openPosition = this.reformatToInteger(openPosition);

        console.log("openPosition",openPosition)

        // console.log(title)
        // console.log(location)
        // console.log(desc)
        // console.log(req)
        // console.log(type)
        // console.log(url)
        // console.log(companyId)
        // console.log("_______________________________________________________")

        if (!companyId || !title) {
            return false
        }

        return {
            companyId: companyId,
            title: title,
            type: type,
            location: location,
            specialization: specialization,
            url: url,
            desc: desc,
            openPosition: openPosition,
            req: req
        };
    }

    onClickCreate({ isTestCompany }) {
        let v = this.text_create.value;
        let arr = v.split(this.ROW_SEPARATOR);
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
                d[Vacancy.OPEN_POSITION] = obj.openPosition;
                d[Vacancy.LOCATION] = obj.location;
                d[Vacancy.SPECIALIZATION] = obj.specialization;
                d[Vacancy.APPLICATION_URL] = obj.url;
                d[Vacancy.DESCRIPTION] = obj.desc;
                d[Vacancy.REQUIREMENT] = obj.req;
                d[Vacancy.CREATED_BY] = this.CREATED_BY_ID;

                if (typeof d[Vacancy.COMPANY_ID] === "string") {
                    d[Vacancy.COMPANY_ID] = Number.parseInt(d[Vacancy.COMPANY_ID]);
                }

                total++;
                console.log("total", total);
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

        if (isTestCompany) {
            this.setState({ isTestCompany: true, total: total, finished: 0 });
        } else {
            this.setState({ isTestCompany: false, total: total, finished: 0 });
        }
    }

    render() {
        let v = <div style={{ padding: "10px" }}>
            <b>Set the column order as follows:</b><br></br><br></br>
            <b>Company ID</b><br></br>{this.COLUMN_SEPARATOR}
            <br></br><b>Title</b><br></br>{this.COLUMN_SEPARATOR}
            <br></br><b>Type</b><br></br>{this.COLUMN_SEPARATOR}
            <br></br><b>Location</b><br></br>{this.COLUMN_SEPARATOR}
            <br></br><b>Specialization</b><br></br>{this.COLUMN_SEPARATOR}
            <br></br><b>Application Url</b><br></br>{this.COLUMN_SEPARATOR}
            <br></br><b>Description</b><br></br>{this.COLUMN_SEPARATOR}
            <br></br><b>Requirement</b><br></br>{this.ROW_SEPARATOR}
            <br></br><b>Open Position</b><br></br>{this.ROW_SEPARATOR}
            <br></br>
            <br></br>
            <b> <a href="http://seedsjobfairapp.com/career-fair/wp-content/uploads/2021/01/Example-Job-Post-Bundle-Upload.xlsx" target="_blank">
                See Excel Example</a>
            </b>
            <br></br>
            <br></br>
            <b>Paste table here:</b>
            <textarea style={{ width: "100%" }} ref={v => (this.text_create = v)} rows="20"></textarea><br></br><br></br>
            {/* <button onClick={() => { this.onClickCreate({ isPreview: true }) }} className="btn btn-md btn-round-5 btn-blue-light">Preview</button><br></br><br></br> */}
            {/* <div dangerouslySetInnerHTML={{ __html: this.state.preview }}></div> */}
            <button onClick={() => { this.onClickCreate({ isTestCompany: true }) }} className="btn btn-md btn-round-5 btn-green">
                Create - Test Company For Preview
            </button>
            <br></br>
            <b>
                <a href="https://seedsjobfairapp.com/php-api/admin/export_sql.php" target="_blank">
                    Preview - [_General_] Test Company Job Post (VIEW)</a>
                <br></br>
                <a href="https://seedsjobfairapp.com/php-api/admin/export_sql.php" target="_blank">
                    Delete - [_General_] Test Company Job Post (DELETE)</a>
            </b>
            <br></br>
            <br></br>
            <button disabled={!this.state.isTestCompany} onClick={() => { this.onClickCreate({}) }} className="btn btn-md btn-round-5 btn-red">
                Create - Real Company
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

