const DB = require('./DB.js');
const {Queue, Company, CompanyEnum, QueueEnum, Prescreen, PrescreenEnum} = require('../../config/db-config');

class CompanyQuery {
    getById(id) {
        return `select * from ${Company.TABLE} where ${Company.ID} = ${id}`;
    }

    getAll(params) {
        var type_where = (typeof params.type === "undefined") ? "1=1" : `${Company.TYPE} LIKE '%${params.type}%'`;
        return `select * from ${Company.TABLE} where 1=1 and ${type_where}`;
    }
}
CompanyQuery = new CompanyQuery();


class CompanyExec {
    getCompanyHelper(type, params, field) {

        const {QueueExec} = require('./queue-query.js');
        const {PrescreenExec} = require('./prescreen-query.js');

        var isSingle = (type === "single");
        var sql = "";
        if (isSingle) {
            sql = CompanyQuery.getById(params.id);
        } else {
            sql = CompanyQuery.getAll(params);
        }

        console.log("getCompanyHelper", params);

        return DB.query(sql).then(function (res) {

            for (var i in res) {

                var company_id = res[i]["ID"];

                if (typeof field["active_queues"] !== "undefined") {
                    res[i]["active_queues"] = QueueExec.queues({
                        company_id: company_id
                        , status: QueueEnum.STATUS_QUEUING
                        , order_by: `${Queue.CREATED_AT} DESC`
                    }, field["active_queues"]);
                }

                if (typeof field["active_prescreens"] !== "undefined") {
                    res[i]["active_prescreens"] = PrescreenExec.prescreens({
                        company_id: company_id
                        , status: PrescreenEnum.STATUS_APPROVED
                        , order_by: `${Prescreen.CREATED_AT} DESC`
                    }, field["active_prescreens"]);
                }
            }

            if (type === "single") {
                return res[0];
            } else {
                return res;
            }
        });
    }

    company(id, field) {
        return this.getCompanyHelper("single", {id: id}, field);

    }

    companies(type, field) {
        return this.getCompanyHelper(false, {type: type}, field);
    }
}
CompanyExec = new CompanyExec();

module.exports = {Company, CompanyExec, CompanyQuery};
