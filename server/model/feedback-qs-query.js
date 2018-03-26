const DB = require('./DB.js');
const { FeedbackQs } = require('../../config/db-config');

class FeedbackQsExec {
    getQuery(params) {
        var user_role = (typeof params.user_role === "undefined") ? "1=1"
            : `fs.user_role = '${params.user_role}' `;

        var is_disabled = (typeof params.is_disabled === "undefined") ? "1=1"
            : `fs.is_disabled = ${params.is_disabled} `;

        var order_by = "ORDER BY fs.updated_at desc";

        return `select fs.* from ${FeedbackQs.TABLE} fs
                  where ${user_role} and ${is_disabled} ${order_by}`;
    }

    feedback_qs(params, field, extra = {}) {
        var sql = this.getQuery(params);
        var toRet = DB.query(sql).then(function (res) {
            //for (var i in res) {}
            // only if there is custom field
            if (extra.single) {
                return res[0];
            }
            return res;
        });

        return toRet;
    }
}

FeedbackQsExec = new FeedbackQsExec();

module.exports = { FeedbackQsExec };


