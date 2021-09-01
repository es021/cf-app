const DB = require('./DB.js');
const {
    UserQuery
} = require('./user-query.js');
const {
    EntityRemovedQuery
} = require('./entity-removed-query.js');
const {
    UserMeta,
    User,
    PrescreenEnum,
    Prescreen
} = require('../../config/db-config');

const {
    CFExec
} = require('./cf-query.js');

class PrescreenQuery {
    getPrescreen(params, extra) {
        // basic condition
        var id_where = (typeof params.ID === "undefined") ? "1=1" :
            `ID = ${params.ID}`;

        var student_where = (typeof params.student_id === "undefined") ? "1=1" :
            `student_id = ${params.student_id}`;

        var recruiter_where = (typeof params.recruiter_id === "undefined") ? "1=1" :
            `recruiter_id = ${params.recruiter_id}`;

        var appointment_time_where = (typeof params.appointment_time === "undefined") ? "1=1" :
            `appointment_time = ${params.appointment_time}`;

        var is_onsite_call_where = (typeof params.is_onsite_call === "undefined") ? "1=1" :
            `is_onsite_call = ${params.is_onsite_call}`;

        var cf_where = "1=1";
        if (params.cf) {
            cf_where = ` 
                "${params.cf}" IN (SELECT m.cf FROM cf_map m WHERE m.entity_id = ps.student_id and m.entity = "user") 
                AND
                "${params.cf}" IN (SELECT m.cf FROM cf_map m WHERE m.entity_id = ps.company_id and m.entity = "company")
            `;
        }


        // var status_where = (typeof params.status === "undefined") ? "1=1" :
        //     `status like '%${params.status}%'`;

        // New SI Flow  - to handle more than one status
        // status, status_1, status_2, status_3, status_4, status_5, status_6
        let statusArr = `'ANYTHING'`;
        let noStatus = true;
        for (var i = 0; i <= 7; i++) {
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

        var removed_where = EntityRemovedQuery.getNotIn(
            params.discard_removed,
            Prescreen.TABLE,
            'ps.ID',
            params.discard_removed_user_id);
        // external search query ------------------------------------------

        var search_user = UserQuery.getSearchNameOrEmail("student_id", params.student_name, params.student_email);
        var search_uni = UserQuery.getSearchUniversity("student_id", params.student_university);

        // limit and order by)
        var limit = (typeof params.page !== "undefined" &&
            typeof params.offset !== "undefined") ? DB.prepareLimit(params.page, params.offset) : "";
        var order_by = (typeof params.order_by === "undefined") ? "" : `ORDER BY ${params.order_by}`;

        var sql = `from pre_screens ps where ${id_where} 
            and ${student_where} 
            and ${recruiter_where} 
            and ${appointment_time_where} 
            and ${status_where} 
            and ${com_where} 
            and ${search_user} 
            and ${search_uni} 
            and ${st_where}
            and ${not_ps_where} 
            AND ${removed_where}
            AND ${cf_where}
            and ${is_onsite_call_where}
            ${order_by}`;

        if (extra.count) {
            return `select count(*) as cnt ${sql}`;
        } else {
            return `select ps.* ${sql} ${limit}`;
        }
    }
}
PrescreenQuery = new PrescreenQuery();

class PrescreenExec {

    prescreens(params, field, extra = {}) {
        const {
            CFExec
        } = require('./cf-query.js');
        const {
            CompanyExec
        } = require('./company-query.js');
        const {
            UserExec
        } = require('./user-query.js');

        var sql = PrescreenQuery.getPrescreen(params, extra);
        // console.log(sql);
        // console.log(sql);
        // console.log(sql);
        var toRet = DB.query(sql).then(function (res) {

            if (extra.count) {
                return res[0]["cnt"];
            }

            for (var i in res) {
                var student_id = res[i]["student_id"];
                var company_id = res[i]["company_id"];
                var recruiter_id = res[i]["recruiter_id"];

                if (typeof field["recruiter"] !== "undefined") {
                    res[i]["recruiter"] = UserExec.user({
                        ID: recruiter_id
                    }, field["recruiter"]);
                }

                if (typeof field["student"] !== "undefined") {
                    res[i]["student"] = UserExec.user({
                        ID: student_id
                    }, field["student"]);
                }

                if (typeof field["company"] !== "undefined") {
                    res[i]["company"] = CompanyExec.company(company_id, field["company"]);
                }

                if (typeof field["cf"] !== "undefined") {
                    res[i]["cf"] = CFExec.commonCf({ entity1: "user", id1: student_id, entity2: "company", id2: company_id });
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