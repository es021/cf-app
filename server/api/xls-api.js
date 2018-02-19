const { getAxiosGraphQLQuery } = require('../../helper/api-helper');
const axios = require('axios');

class XLSApi {
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
        }
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
            if (key == "doc_links") {
                var toRet = "";
                d.map((doc, i) => {
                    toRet += `<a href="${doc.url}">${doc.label}</a>\n`;
                });
                d = toRet;
            }
            return d;
        };

        // 3 . fetch and return
        return this.fetchAndReturn(query, "users", filename, headers, rowHook);
    }

    // ######################################################################
    // Helper functions ------------------------------------------------

    fetchAndReturn(query, dataField, filename, headers = null, rowHook = null) {
        return getAxiosGraphQLQuery(query).then((res) => {
            var content = this.generateTable(res.data.data[dataField]
                , headers, rowHook);
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

    generateRow(data, rowHook) {
        var r = "";
        for (var i in data) {
            var d = data[i];
            if (rowHook != null) {
                d = rowHook(i, d);
            }
            r += `<td>${d}</td>`;
        }
        return `<tr>${r}</tr>`;
    }

    // row hook to handle field of type list, such as doc_links
    generateTable(datas, headers = null, rowHook = null) {
        var rows = "";
        for (var i in datas) {
            var d = datas[i];

            // create header from object keys
            if (headers == null) {
                headers = Object.keys(d);
            }

            rows += this.generateRow(d, rowHook);
        }

        return `<table>${this.generateHeader(headers)} ${rows}</table>`;
    }
}

XLSApi = new XLSApi();

module.exports = { XLSApi };
