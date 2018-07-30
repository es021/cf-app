const DB = require('./DB.js');
const {
    Availability
} = require('../../config/db-config');

class AvailabilityQuery {
    get(params, extra) {
        var user_id_where = (typeof params.user_id === "undefined") ? "1=1" : `user_id = ${params.user_id} `;
        var timestamp_where = (typeof params.timestamp === "undefined") ? "1=1" : `timestamp >= ${params.timestamp} `;
        var order_by = (typeof params.order_by === "undefined") ? "ORDER BY timestamp asc" : `ORDER BY ${params.order_by} `;
        var sql = `select * from ${Availability.TABLE} where ${user_id_where} and ${timestamp_where} ${order_by}`;
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