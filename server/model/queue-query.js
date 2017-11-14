const DB = require('./DB.js');

const Queue = {
    TABLE: "in_queues",
    STUDENT_ID: "student_id",
    CREATED_AT: "created_at",
    STATUS_QUEUING: "Queuing",
    STATUS_CANCELED: "Canceled",
    STATUS_DONE: "Done"
};

class QueueQuery {
    getQueue(params) {
        var student_where = (typeof params.student_id === "undefined") ? "1=1" : `q.student_id = ${params.student_id}`;
        var status_where = (typeof params.status === "undefined") ? "1=1" : `q.status like '%${params.status}%'`;
        var com_where = (typeof params.company_id === "undefined") ? "1=1" : `q.company_id = '${params.company_id}'`;

        var order_by = (typeof params.order_by === "undefined") ? "" : `ORDER BY ${params.order_by}`;

        return `select * from in_queues q where ${student_where} and ${status_where} and ${com_where} ${order_by}`;
    }
}
QueueQuery = new QueueQuery();

class QueueExec {

    queues(params, discard = []) {
        var {UserExec} = require('./user-query.js');

        var sql = QueueQuery.getQueue(params);
        //console.log(sql);
        var toRet = DB.con.query(sql).then(function (res) {
            for (var i in res) {

                if (discard.indexOf("users") <= -1) {
                    var student_id = res[i]["student_id"];
                    res[i]["student"] = UserExec.user({ID: student_id}, ["queues"]);
                }
            }

            return res;
        });

        return toRet;
    }
}
QueueExec = new QueueExec();

module.exports = {Queue, QueueExec, QueueQuery};


