const DB = require('./DB.js');
const {Queue} = require('./queue-query.js');
const {Prescreen} = require('./prescreen-query.js');

const Company = {
    TABLE: "companies",
    ID: "ID",
    TYPE: "TYPE",
    TYPE_GOLD: 1,
    TYPE_SILVER: 2,
    TYPE_BRONZE: 3,
    TYPE_NORMAL: 4
};

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
    getCompanyHelper(type, params) {

        const {QueueExec} = require('./queue-query.js');
        const {PrescreenExec} = require('./prescreen-query.js');

        var isSingle = (type === "single");
        var sql = "";
        if (isSingle) {
            sql = CompanyQuery.getById(params.id);
        } else {
            sql = CompanyQuery.getAll(params);
        }

        return DB.con.query(sql).then(function (res) {

            for (var i in res) {

                var company_id = res[i]["ID"];

                res[i]["active_queues"] = QueueExec.queues({
                    company_id: company_id
                    , status: Queue.STATUS_QUEUING
                    , order_by: `${Queue.CREATED_AT} DESC`
                }, ["company"]);

                res[i]["active_prescreens"] = PrescreenExec.prescreens({
                    company_id: company_id
                    , status: Prescreen.STATUS_APPROVED
                    , order_by: `${Prescreen.CREATED_AT} DESC`
                }, ["company"]);

            }

            if (type === "single") {
                return res[0];
            } else {
                return res;
            }
        });
    }

    company(id) {
        return this.getCompanyHelper("single", {id: id});

    }

    companies(type) {
        return this.getCompanyHelper(false, {type: type});
    }
}
CompanyExec = new CompanyExec();

module.exports = {Company, CompanyExec, CompanyQuery};
