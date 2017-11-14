const DB = require('./DB.js');

const Prescreen = {
    STUDENT_ID: "student_id",
    CREATED_AT: "created_at",
    STATUS_PENDING: "Pending",
    STATUS_APPROVED: "Approved",
    STATUS_DONE: "Done"
};

class PrescreenQuery {
    getPrescreen(params) {
        var student_where = (typeof params.student_id === "undefined") ? "1=1" : `student_id = ${params.student_id}`;
        var status_where = (typeof params.status === "undefined") ? "1=1" : `status like '%${params.status}%'`;
        var com_where = (typeof params.company_id === "undefined") ? "1=1" : `company_id = '${params.company_id}'`;

        var order_by = (typeof params.order_by === "undefined") ? "" : `ORDER BY ${params.order_by}`;

        return `select * from pre_screens where ${student_where} and ${status_where} and ${com_where} ${order_by}`;

    }
}
PrescreenQuery = new PrescreenQuery();

class PrescreenExec {

    prescreens(params, discard = []) {
        var sql = PrescreenQuery.getPrescreen(params);
        var toRet = DB.con.query(sql).then(function (res) {
            //for (var i in res) {}
            return res;
        });

        return toRet;
    }
}
PrescreenExec = new PrescreenExec();

module.exports = {Prescreen, PrescreenExec, PrescreenQuery};


