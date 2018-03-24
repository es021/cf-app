const { getAxiosGraphQLQuery } = require('../../helper/api-helper');
const { Time } = require('../../app/lib/time');
const axios = require('axios');

class XLSApi {
    constructor() {
        this.DateTime = ["created_at", "updated_at", "user_registered", "appointment_time"];
    }

    // filter in JSON object, return {filename, content}
    export(action, filter) {
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
                return this.students(filter.cf);
                break;
            // xls/prescreens/{"company_id":1}
            // filter == null, all cfs
            case 'prescreens':
                return this.prescreens(filter.company_id);
                break;
        }
    }

    prescreens(cid) {
        // 0. create filename
        var filename = `Prescreens Registration - Company ${cid}`;

        // 1. create query
        var query = `query{
            prescreens(company_id:${cid}, special_type:"Pre Screen") {
              student{
                ID
                first_name
                last_name
                user_email
                doc_links{label url}
              }
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


    students(cf) {
        // 0. create filename
        var filename = `Student Data ${cf}`;

        // 1. create query
        var cf_condition = (typeof cf !== "undefined") ? `,cf:"${cf}"` : "";
        var query = `query{ users(role:"student" ${cf_condition}) {
              ID
              user_email
              first_name
              last_name
              user_registered
              doc_links {label url}
              major
              minor
              university
              phone_number
              description
              graduation_month
              graduation_year
              available_month
              available_year
              sponsor
              user_status }}`;
        //  cgpa

        // 2. prepare props to generate table
        const headers = null;
        const rowHook = (key, d) => {
            return d;
        };

        // 3 . fetch and return
        return this.fetchAndReturn(query, "users", filename, headers);
    }

    // ######################################################################
    // Helper functions ------------------------------------------------

    rowDocLinks(d) {
        var toRet = "";
        d.map((doc, i) => {
            toRet += `<a href="${doc.url}">${doc.label}</a>\n`;
        });
        d = toRet;
        return d;
    }

    fetchAndReturn(query, dataField, filename, headers = null, rowHook = null, restructData = null) {
        return getAxiosGraphQLQuery(query).then((res) => {
            var content = this.generateTable(filename, res.data.data[dataField]
                , headers, rowHook, restructData);

            return { filename: filename, content: content };
        }, (err) => {
            return err;
        });
    }

    generateHeader(headers) {
        var r = "";
        for (var i in headers) {
            r += `<th>${headers[i]}</th>`;
        }
        return `<tr>${r}</tr>`;
    }

    defaultRowHook(k, d) {
        if (this.DateTime.indexOf(k) >= 0) {
            return Time.getString(d);
        }

        if(k.indexOf("doc_links") >= 0){
            return this.rowDocLinks(d);
        }

        return d;
    }

    generateRow(data, rowHook) {
        var r = "";
        for (var i in data) {
            var d = data[i];
            if (rowHook != null) {
                d = rowHook(i, d);
            }

            d = this.defaultRowHook(i, d);

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

            rows += this.generateRow(d, rowHook);
        }

        return `<table>${fileTitle} ${this.generateHeader(headers)} ${rows}</table>`;
    }
}

XLSApi = new XLSApi();

module.exports = { XLSApi };
