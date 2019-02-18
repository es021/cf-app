const {
    getAxiosGraphQLQuery
} = require('../../helper/api-helper');
const {
    Time
} = require('../../app/lib/time');
const axios = require('axios');

class XLSApi {
    constructor() {
        this.student_field = `ID
        first_name
        last_name
        user_email
        doc_links{label url}
        looking_for
        study_place
        university
        major 
        minor
        cgpa 
        phone_number
        graduation_month
        graduation_year
        available_month
        available_year`;

        this.DateTime = ["created_at", "updated_at", "started_at", "ended_at", "user_registered", "appointment_time"];
    }

    // filter in JSON object, return {filename, content}
    export (action, filter) {
        if (filter !== "null") {
            try {
                filter = JSON.parse(filter);
            } catch (err) {
                return new Promise(err);
            }
        } else {
            filter = {};
        }

        switch (action) {
            // xls/students/{"cf":"USA"}
            // filter == null, all cfs
            case 'students':
                return this.students(filter.cf, filter.new_only);
                break;
                // xls/prescreens/{"company_id":1}
                // filter == null, all cfs
            case 'prescreens':
                return this.prescreens(filter.company_id);
                break;
            case 'resume_drops':
                return this.resume_drops(filter.company_id);
                break;
            case 'sessions':
                return this.sessions(filter.company_id);
                break;
            case 'session_requests':
                return this.session_requests(filter.company_id);
                break;
            case 'student_listing':
                return this.student_listing(filter.company_id, filter.cf);
                break;
        }
    }


    session_requests(cid) {
        // 0. create filename
        var filename = `Session Requests - Company ${cid}`;

        // 1. create query
        var query = `query{
            session_requests(company_id:${cid}) {
              student{${this.student_field}}
              company{name}
              status
              created_at
            }
          }`;

        // 2. prepare props to generate table
        const headers = null;

        // 3. resctruct data to be in one level only
        const restructData = (data) => {
            var hasChildren = ["student", "company"];
            var newData = {};
            for (var key in data) {
                var d = data[key];
                if (hasChildren.indexOf(key) >= 0) {
                    for (var k in d) {
                        newData[`${key}_${k}`] = d[k];
                    }
                } else {
                    newData[key] = d;
                }
            }
            return newData;
        };

        // 3 . fetch and return
        return this.fetchAndReturn(query, "session_requests", filename, headers, null, restructData);
    }

    //EUR FIX
    student_listing(cid, cf) {
        // 0. create filename
        var filename = `Student Listing - Company ${cid}`;

        // 1. create query
        var query = `query{
            student_listing(company_id:${cid}, cf:"${cf}") {
              student{${this.student_field}}
              company{name}
              created_at
            }
          }`;

        // 2. prepare props to generate table
        const headers = null;

        // 3. resctruct data to be in one level only
        const restructData = (data) => {
            var hasChildren = ["student", "company"];
            var newData = {};
            for (var key in data) {
                var d = data[key];
                if (hasChildren.indexOf(key) >= 0) {
                    for (var k in d) {
                        newData[`${key}_${k}`] = d[k];
                    }
                } else {
                    newData[key] = d;
                }
            }
            newData = this.restructAppendDocLinks(newData, "student_doc_links");
            return newData;
        };

        // 3 . fetch and return
        return this.fetchAndReturn(query, "student_listing", filename, headers, null, restructData);
    }




    resume_drops(cid) {
        // 0. create filename
        var filename = `Resume Drops - Company ${cid}`;

        // 1. create query
        var query = `query{
            resume_drops(company_id:${cid}) {
              message
              student{${this.student_field}}
              company{name}
              created_at
              updated_at
            }
          }`;

        // 2. prepare props to generate table
        const headers = null;

        // 3. resctruct data to be in one level only
        const restructData = (data) => {
            var hasChildren = ["student", "company"];
            var newData = {};
            for (var key in data) {
                var d = data[key];
                if (hasChildren.indexOf(key) >= 0) {
                    for (var k in d) {
                        newData[`${key}_${k}`] = d[k];
                    }
                } else {
                    newData[key] = d;
                }
            }
            return newData;
        };

        // 3 . fetch and return
        return this.fetchAndReturn(query, "resume_drops", filename, headers, null, restructData);
    }


    prescreens(cid) {
        // 0. create filename
        var filename = `Prescreens Registration - Company ${cid}`;

        // 1. create query
        var query = `query{
            prescreens(company_id:${cid}, special_type:"Pre Screen") {
              student{${this.student_field}}
              created_at
              company{name}
              status
              special_type
              appointment_time
              updated_at
              updated_by
            }
          }`;

        // 2. prepare props to generate table
        const headers = null;

        // 3. resctruct data to be in one level only
        const restructData = (data) => {
            var hasChildren = ["student", "company"];
            var newData = {};
            for (var key in data) {
                var d = data[key];
                if (hasChildren.indexOf(key) >= 0) {
                    for (var k in d) {
                        newData[`${key}_${k}`] = d[k];
                    }
                } else {
                    newData[key] = d;
                }
            }
            return newData;
        };

        // 3 . fetch and return
        return this.fetchAndReturn(query, "prescreens", filename, headers, null, restructData);
    }


    sessions(cid) {
        // 0. create filename
        var filename = `Past Sessions - Company ${cid}`;

        // 1. create query
        var query = `query{
            sessions(company_id:${cid}) {
              session_notes{note}
              session_ratings{category rating}
              student{${this.student_field}}
              company{name}
              created_at
              started_at
              ended_at
            }
          }`;

        // 2. prepare props to generate table
        const headers = null;

        // 3. resctruct data to be in one level only
        const restructData = (data) => {
            var hasChildren = ["student", "company"];
            var newData = {};
            for (var key in data) {
                var d = data[key];
                if (hasChildren.indexOf(key) >= 0) {
                    for (var k in d) {
                        newData[`${key}_${k}`] = d[k];
                    }
                } else {
                    newData[key] = d;
                }
            }
            return newData;
        };

        var rowHook = (k, data) => {

            if (k.indexOf("session_notes") >= 0) {
                var toRet = "";
                data.map((d, i) => {
                    if (i > 0) {
                        toRet += "<br>";
                    }
                    toRet += `${d.note}`;
                });
                return toRet;
            } else if (k.indexOf("session_ratings") >= 0) {
                var toRet = "";
                data.map((d, i) => {
                    if (i > 0) {
                        toRet += "<br>";
                    }
                    toRet += `${d.category} - ${d.rating}`;
                });
                return toRet;
            } else {
                return data;
            }
        }
        // 3 . fetch and return
        return this.fetchAndReturn(query, "sessions", filename, headers, rowHook, restructData);
    }



    students(cf, new_only) {
        // 0. create filename
        var filename = `Student Data ${cf}`;

        // 1. create query
        var cf_con = (typeof cf !== "undefined") ? `,cf:"${cf}"` : "";
        var nw_con = (typeof new_only !== "undefined") ? `,new_only:${new_only}` : "";
        var query = `query{ users(role:"student" ${cf_con} ${nw_con}) {
              ID
              user_email
              first_name
              last_name
              user_registered
              mas_state
              mas_postcode
              relocate
              study_place
              looking_for
              gender
              major
              minor
              university
              phone_number
              cgpa
              graduation_month
              graduation_year
              available_month
              available_year
              sponsor
              description
              user_status
              doc_links {label url} }}`;
        //  cgpa

        // 2. prepare props to generate table
        const headers = null;
        const rowHook = (key, d) => {
            return d;
        };

        const restructData = (data) => {
            return this.restructAppendDocLinks(data);
        };

        // 3 . fetch and return
        return this.fetchAndReturn(query, "users", filename, headers, null, restructData);
    }



    // ######################################################################
    // Helper functions ------------------------------------------------

    // append doc links into seperate row at the end of record
    restructAppendDocLinks(data, key) {
        key = typeof key === "undefined" ? "doc_links" : key;
        var newData = {};
        var doc_links = data[key];

        for (var k in data) {
            if (k !== key) {
                newData[k] = data[k];
            }
        }
        for (var i in doc_links) {
            var key = "attachment_" + (Number.parseInt(i) + 1);
            var doc = doc_links[i];
            newData[key] = `<a href="${doc.url}">${doc.label}</a><br>`;
        }
        return newData;
    }

    rowDocLinks(d) {
        var toRet = "";
        d.map((doc, i) => {
            toRet += `<a href="${doc.url}">${doc.label}</a><br>`;
        });
        d = toRet;
        return d;
    }

    fetchAndReturn(query, dataField, filename, headers = null, rowHook = null, restructData = null) {
        return getAxiosGraphQLQuery(query).then((res) => {
            var content = this.generateTable(filename, res.data.data[dataField], headers, rowHook, restructData);

            return {
                filename: filename,
                content: content
            };
        }, (err) => {
            return err;
        });
    }

    generateHeader(headers) {
        var r = `<th>#</th>`;
        for (var i in headers) {
            r += `<th>${headers[i]}</th>`;
        }
        return `<tr>${r}</tr>`;
    }

    defaultRowHook(k, d) {
        if (this.DateTime.indexOf(k) >= 0) {
            return Time.getString(d);
        }

        if (k.indexOf("doc_links") >= 0) {
            return this.rowDocLinks(d);
        }

        return d;
    }

    generateRow(rownum, data, rowHook) {
        var r = `<td>${Number.parseInt(rownum) + 1}</td>`;
        for (var i in data) {
            var d = data[i];
            if (rowHook != null) {
                d = rowHook(i, d);
            }

            d = this.defaultRowHook(i, d);
            if (d === null || typeof d === "undefined") {
                d = "-";
            }
            r += `<td>${d}</td>`;
        }
        return `<tr>${r}</tr>`;
    }

    // row hook to handle field of type list, such as doc_links
    generateTable(title, datas, headers = null, rowHook = null, restructData = null) {
        var fileTitle = `<tr>
            <h2>${title}</h2>
            ** Data as of ${Time.getString("now")} **<br>
            ** All timestamps are in timezone ${Time.getTimezone()} **
        </tr>`;

        var rows = "";
        for (var i in datas) {

            var d = null;
            if (restructData !== null) {
                d = restructData(datas[i]);
            } else {
                d = datas[i];
            }

            // create header from object keys
            if (headers == null) {
                headers = Object.keys(d);
            }

            rows += this.generateRow(i, d, rowHook);
        }

        return `<table>${fileTitle} ${this.generateHeader(headers)} ${rows}</table>`;
    }
}

XLSApi = new XLSApi();

module.exports = {
    XLSApi
};