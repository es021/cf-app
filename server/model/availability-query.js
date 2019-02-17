const DB = require('./DB.js');
const {
    Availability,
    Prescreen,
    PrescreenEnum
} = require('../../config/db-config');

class AvailabilityQuery {
    get(params, extra) {
        var user_id_where = (typeof params.user_id === "undefined") ? "1=1" : `av.user_id = ${params.user_id} `;
        var timestamp_where = (typeof params.timestamp === "undefined") ? "1=1" : `av.timestamp >= ${params.timestamp} `;
        var order_by = (typeof params.order_by === "undefined") ? "ORDER BY av.timestamp asc" : `ORDER BY ${params.order_by} `;

        // special param from user-query (is_for_booked_at)
        var company_id_where = (typeof params.company_id === "undefined") ? "1=1" : `av.company_id = ${params.company_id} `;
        var extra_from = "";
        var extra_where = "1=1";

        if (params.is_for_booked_at === true) {
            extra_from = `, ${Prescreen.TABLE} ps`;
            extra_where = ` av.prescreen_id = ps.ID 
                AND ps.status IN 
                ('${PrescreenEnum.STATUS_WAIT_CONFIRM}','${PrescreenEnum.STATUS_APPROVED}','${PrescreenEnum.STATUS_DONE}') `;
        }

        var sql = `select av.* from ${Availability.TABLE} av ${extra_from}
            where ${user_id_where} and ${timestamp_where} and ${company_id_where} and ${extra_where}
            ${order_by}`;

        // console.log("----------------------------------------")
        // console.log(sql);
        // console.log("----------------------------------------")
        return sql;
    }
}
AvailabilityQuery = new AvailabilityQuery();

class AvailabilityExec {
    getHelper(type, params, field, extra = {}) {
        const {
            CompanyExec
        } = require('./company-query.js');
        const {
            PrescreenExec
        } = require('./prescreen-query.js');

        var sql = AvailabilityQuery.get(params, extra);
        var toRet = DB.query(sql).then(function (res) {
            for (var i in res) {
                // company ****************************************************
                if (typeof field["company"] !== "undefined") {
                    var company_id = res[i]["company_id"];
                    if (company_id !== null) {
                        res[i]["company"] = CompanyExec.company(company_id, field["company"]);
                    }
                }

                // prescreen ****************************************************
                //console.log("lalallala",field,res[i]["prescreen_id"]);
                if (typeof field["prescreen"] !== "undefined") {
                    var prescreen_id = res[i]["prescreen_id"];
                    if (company_id !== null) {
                        res[i]["prescreen"] = PrescreenExec.prescreens({
                            ID: prescreen_id
                        }, field["prescreen"], {
                            single: true
                        });
                    }
                }
            }
            return res;
        });

        return toRet;
    }

    availabilities(params, field, extra = {}) {
        return this.getHelper(false, params, field, extra);
    }
}

AvailabilityExec = new AvailabilityExec();

module.exports = {
    AvailabilityExec
};