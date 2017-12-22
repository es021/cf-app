const DB = require('./DB.js');
const {Queue} = require('../../config/db-config');

class QueueQuery {
    getQueue(params, field, extra) {
        var id_where = (typeof params.ID === "undefined") ? "1=1" : `q.ID = ${params.ID}`;
        var student_where = (typeof params.student_id === "undefined") ? "1=1" : `q.student_id = ${params.student_id}`;
        var status_where = (typeof params.status === "undefined") ? "1=1" : `q.status like '%${params.status}%'`;
        var com_where = (typeof params.company_id === "undefined") ? "1=1" : `q.company_id = '${params.company_id}'`;

        var order_by = (typeof params.order_by === "undefined") ? "" : `ORDER BY ${params.order_by}`;

        var sql = `from in_queues q where ${id_where} and ${student_where} and ${status_where} and ${com_where} ${order_by}`;
        if (extra.count) {
            return `select count(*) as cnt ${sql}`;
        } else {
            //extra select;
            var sel = "";
            if (typeof field["queue_num"] !== "undefined") {
                sel += `, (select COUNT(*) from in_queues x 
                        where x.company_id = q.company_id 
                        and x.status = q.status 
                        and x.created_at <= q.created_at) as queue_num`;
            }
            
            return `select q.* ${sel} ${sql}`;
        }
    }

}
QueueQuery = new QueueQuery();

class QueueExec {

    queues(params, field, extra = {}) {

        var {CompanyExec} = require('./company-query.js');
        var {UserExec} = require('./user-query.js');

        var sql = QueueQuery.getQueue(params, field, extra);

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

            if (extra.single) {
                return res[0];
            }

            return res;
        });

        return toRet;
    }
}
QueueExec = new QueueExec();

module.exports = {QueueExec, QueueQuery};


