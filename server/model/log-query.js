const DB = require('./DB.js');
const { Log, LogEnum } = require('../../config/db-config');
const { TestUser } = require('../../config/app-config');

class LogExec {
    getQuery(params) {
        var event_where = (typeof params.event === "undefined") ? "1=1"
            : `${Log.EVENT} like '%${params.event}%'`;

        var start_where = (typeof params.start === "undefined") ? "1=1"
            : `UNIX_TIMESTAMP(${Log.CREATED_AT}) >= '${params.start}'`;

        var end_where = (typeof params.end === "undefined") ? "1=1"
            : `UNIX_TIMESTAMP(${Log.CREATED_AT}) <= '${params.end}'`;

        var order_by = "ORDER BY " + ((typeof params.order_by === "undefined")
            ? `${Log.CREATED_AT} desc` : `${params.order_by}`);

        return `select * from ${Log.TABLE} where ${event_where} and ${start_where} and ${end_where}
            ${order_by}`;
    }

    logs(params, field, extra = {}) {
        var sql = this.getQuery(params);
        var toRet = DB.query(sql).then(function (res) {

            if (extra.single && res !== null) {
                return res[0];
            } else {
                return res;
            }

        });
        return toRet;
    }
}

LogExec = new LogExec();

module.exports = { LogExec };


