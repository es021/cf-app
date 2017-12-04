const DB = require('./DB.js');
const {Queue} = require('../../config/db-config');

class QueueQuery {
    getQueue(params, extra) {
        var student_where = (typeof params.student_id === "undefined") ? "1=1" : `q.student_id = ${params.student_id}`;
        var status_where = (typeof params.status === "undefined") ? "1=1" : `q.status like '%${params.status}%'`;
        var com_where = (typeof params.company_id === "undefined") ? "1=1" : `q.company_id = '${params.company_id}'`;

        var order_by = (typeof params.order_by === "undefined") ? "" : `ORDER BY ${params.order_by}`;

        var sql = `from in_queues q where ${student_where} and ${status_where} and ${com_where} ${order_by}`;
        if (extra.count) {
            return `select count(*) as cnt ${sql}`;
        } else {
            return `select * ${sql}`;
        }
    }
}
QueueQuery = new QueueQuery();

class QueueExec {

    queues(params, field, extra = {}) {
        var {UserExec} = require('./user-query.js');
        var sql = QueueQuery.getQueue(params, extra);

        var toRet = DB.query(sql).then(function (res) {
            if (extra.count) {
                return res[0]["cnt"];
            }

            for (var i in res) {

                if (typeof field["student"] !== "undefined") {
                    var student_id = res[i]["student_id"];
                    res[i]["student"] = UserExec.user({ID: student_id}, field["student"]);
                }
            }

            return res;
        });

        return toRet;
    }
}
QueueExec = new QueueExec();

module.exports = {QueueExec, QueueQuery};


