const DB = require('./DB.js');
const {
    UserQuery
} = require('./user-query.js');
const {
    UserMeta,
    User,
    PrescreenEnum
} = require('../../config/db-config');


class PrescreenQuery {
    getPrescreen(params, extra) {
        // basic condition
        var id_where = (typeof params.ID === "undefined") ? "1=1" :
            `ID = ${params.ID}`;

        var student_where = (typeof params.student_id === "undefined") ? "1=1" :
            `student_id = ${params.student_id}`;

        // var status_where = (typeof params.status === "undefined") ? "1=1" :
        //     `status like '%${params.status}%'`;

        // New SI Flow  - to handle more than one status
        // status, status_1, status_2, status_3, status_4, status_5,
        let statusArr = `'ANYTHING'`;
        let noStatus = true;
        for (var i = 0; i <= 5; i++) {
            let statusKey = "status";
            statusKey += i == 0 ? "" : "_" + i;
            let statusItem = params[statusKey];
            if (typeof statusItem !== "undefined") {
                noStatus = false;
                statusArr += `, '${statusItem}' `;
            }
        }
        var status_where = noStatus ? "1=1" : `status IN (${statusArr})`;

        var not_ps_where = (typeof params.not_prescreen === "undefined") ? "1=1" :
            `special_type  != '${PrescreenEnum.ST_PRE_SCREEN}'`;

        var st_where = (typeof params.special_type === "undefined") ? "1=1" :
            `special_type = '${params.special_type}'`;

        var com_where = (typeof params.company_id === "undefined") ? "1=1" :
            `company_id = '${params.company_id}'`;

        // external search query ------------------------------------------

        var search_user = UserQuery.getSearchNameOrEmail("student_id", params.student_name, params.student_email);
        var search_uni = UserQuery.getSearchUniversity("student_id", params.student_university);

        // limit and order by
        var limit = (typeof params.page !== "undefined" &&
            typeof params.offset !== "undefined") ? DB.prepareLimit(params.page, params.offset) : "";
        var order_by = (typeof params.order_by === "undefined") ? "" : `ORDER BY ${params.order_by}`;

        var sql = `from pre_screens where ${id_where} and ${student_where} 
            and ${status_where} and ${com_where} 
            and ${search_user} and ${search_uni} and ${st_where}
            and ${not_ps_where}
            ${order_by}`;

        if (extra.count) {
            return `select count(*) as cnt ${sql}`;
        } else {
            return `select * ${sql} ${limit}`;
        }
    }
}
PrescreenQuery = new PrescreenQuery();

class PrescreenExec {

    prescreens(params, field, extra = {}) {
        const {
            CompanyExec
        } = require('./company-query.js');
        const {
            UserExec
        } = require('./user-query.js');

        var sql = PrescreenQuery.getPrescreen(params, extra);
        console.log(sql);
        var toRet = DB.query(sql).then(function (res) {

            if (extra.count) {
                return res[0]["cnt"];
            }

            for (var i in res) {
                var student_id = res[i]["student_id"];
                var company_id = res[i]["company_id"];

                if (typeof field["student"] !== "undefined") {
                    res[i]["student"] = UserExec.user({
                        ID: student_id
                    }, field["student"]);
                }

                if (typeof field["company"] !== "undefined") {
                    res[i]["company"] = CompanyExec.company(company_id, field["company"]);
                }
            }

            if (extra.single) {
                return res[0];
            }

            return res;
        });

        return toRet;
    }
}
PrescreenExec = new PrescreenExec();

module.exports = {
    PrescreenExec,
    PrescreenQuery
};