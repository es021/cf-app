const DB = require('./DB.js');
const {Queue, Company, CompanyEnum, QueueEnum, Prescreen, PrescreenEnum, Vacancy} = require('../../config/db-config');

class CompanyQuery {
    getById(id) {
        return `select * from ${Company.TABLE} where ${Company.ID} = ${id}`;
    }

    getAll(params) {
        var type_where = (typeof params.type === "undefined") ? "1=1" : `${Company.TYPE} LIKE '%${params.type}%'`;
        var order_by = `order by ${Company.TYPE} asc`;
        return `select * from ${Company.TABLE} where 1=1 and ${type_where} ${order_by}`;
    }
}
CompanyQuery = new CompanyQuery();


const {VacancyExec} = require('./vacancy-query.js');
const {PrescreenExec} = require('./prescreen-query.js');

class CompanyExec {
    getCompanyHelper(type, params, field) {

        // for cross dependecy need to init here
        const {QueueExec} = require('./queue-query.js');

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

                //Add queue ***********************************
                var act_q = {
                    company_id: company_id
                    , status: QueueEnum.STATUS_QUEUING
                    , order_by: `${Queue.CREATED_AT} DESC`
                };

                if (typeof field["active_queues"] !== "undefined") {
                    res[i]["active_queues"] = QueueExec.queues(act_q, field["active_queues"]);
                }

                if (typeof field["active_queues_count"] !== "undefined") {
                    delete(act_q["order_by"]);
                    res[i]["active_queues_count"] = QueueExec.queues(act_q, {}, {count: true});
                }

                //Add prescreens ***********************************
                var act_ps = {
                    company_id: company_id
                    , status: PrescreenEnum.STATUS_APPROVED
                    , order_by: `${Prescreen.CREATED_AT} DESC`
                };

                if (typeof field["active_prescreens"] !== "undefined") {
                    res[i]["active_prescreens"] = PrescreenExec.prescreens(act_ps, field["active_prescreens"]);
                }

                if (typeof field["active_prescreens_count"] !== "undefined") {
                    delete(act_ps["order_by"]);
                    res[i]["active_prescreens_count"] = PrescreenExec.prescreens(act_ps, {}, {count: true});
                }

                //Add vacancies ***********************************
                var vc = {
                    company_id: company_id
                    , order_by: `${Vacancy.UPDATED_AT} DESC`
                };

                if (typeof field["vacancies"] !== "undefined") {
                    res[i]["vacancies"] = VacancyExec.vacancies(vc, field["vacancies"]);
                }

                if (typeof field["vacancies_count"] !== "undefined") {
                    delete(act_ps["order_by"]);
                    res[i]["vacancies_count"] = VacancyExec.vacancies(vc, {}, {count: true});
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
