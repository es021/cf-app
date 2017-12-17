const DB = require('./DB.js');


class PrescreenQuery {
    getPrescreen(params, extra) {
        var student_where = (typeof params.student_id === "undefined") ? "1=1" : `student_id = ${params.student_id}`;
        var status_where = (typeof params.status === "undefined") ? "1=1" : `status like '%${params.status}%'`;
        var com_where = (typeof params.company_id === "undefined") ? "1=1" : `company_id = '${params.company_id}'`;

        var order_by = (typeof params.order_by === "undefined") ? "" : `ORDER BY ${params.order_by}`;

        var sql = `from pre_screens where ${student_where} and ${status_where} and ${com_where} ${order_by}`;
        if (extra.count) {
            return `select count(*) as cnt ${sql}`;
        } else {
            return `select * ${sql}`;
        }
    }
}
PrescreenQuery = new PrescreenQuery();

class PrescreenExec {

    prescreens(params, field, extra = {}) {
        const {CompanyExec} = require('./company-query.js');
        const {UserExec} = require('./user-query.js');

        var sql = PrescreenQuery.getPrescreen(params, extra);
        var toRet = DB.query(sql).then(function (res) {

            if (extra.count) {
                return res[0]["cnt"];
            }

            for (var i in res) {
                var student_id = res[i]["student_id"];
                var company_id = res[i]["company_id"];

                if (typeof field["student"] !== "undefined") {
                    res[i]["student"] = UserExec.user({ID: student_id}, field["student"]);
                }
                
                if (typeof field["company"] !== "undefined") {
                    res[i]["company"] = CompanyExec.company(company_id, field["company"]);
                }
            }

            return res;
        });

        return toRet;
    }
}
PrescreenExec = new PrescreenExec();

module.exports = {PrescreenExec, PrescreenQuery};


