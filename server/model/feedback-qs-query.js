const DB = require('./DB.js');
const { FeedbackQs } = require('../../config/db-config');

class FeedbackQsExec {
    getQuery(params) {
        var ID = (typeof params.ID === "undefined") ? "1=1"
            : `fs.ID = '${params.ID}' `;

        var user_role = (typeof params.user_role === "undefined") ? "1=1"
            : `fs.user_role = '${params.user_role}' `;

        var is_disabled = (typeof params.is_disabled === "undefined") ? "1=1"
            : `fs.is_disabled = ${params.is_disabled} `;

        var limit = DB.prepareLimit(params.page, params.offset);

        var order_by = (typeof params.order_by === "undefined")
            ? "ORDER BY fs.updated_at desc"
            : `ORDER BY ${params.order_by}`

        return `select fs.* from ${FeedbackQs.TABLE} fs
                  where ${ID} and ${user_role} and ${is_disabled} ${order_by} ${limit}`;
    }

    feedback_qs(params, field, extra = {}) {
        var sql = this.getQuery(params);
        //// console.log(sql);
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


