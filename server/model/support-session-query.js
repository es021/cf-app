const DB = require('./DB.js');
const { SupportSession } = require('../../config/db-config');
const { TestUser } = require('../../config/app-config');

class SupportSessionExec {
    getQuery(params) {
        var support_id_where = (typeof params.support_id === "undefined") ? "1=1"
            : `ss.${SupportSession.SUPPORT_ID} = ${params.support_id}`;
        var order_by = "ORDER BY mc.updated_at desc, ss.created_at desc";
        var select = "";
        // last_message_time
        select += ", mc.updated_at as last_message_time";
        // last_message
        select += ", m.message as last_message";

        return `select ss.* ${select} 
            from ${SupportSession.TABLE} ss 
                LEFT OUTER JOIN message_count mc on mc.id = ss.message_count_id
                LEFT OUTER JOIN messages m on m.id_message_number = CONCAT(mc.id,':',mc.count)
            where ${support_id_where} ${order_by}`;
    }

    support_sessions(params, field, extra = {}) {
        const { UserExec } = require('./user-query.js');
        var sql = this.getQuery(params);

        var toRet = DB.query(sql).then(function (res) {
            for (var i in res) {
                var user_id = res[i]["user_id"];
                if (typeof field["user"] !== "undefined") {
                    res[i]["user"] = UserExec.user({ ID: user_id }, field["user"]);
                }
            }
            // only if there is custom field
            if (extra.single) {
                return res[0];
            }
            return res;
        });

        return toRet;
    }
}

SupportSessionExec = new SupportSessionExec();

module.exports = { SupportSessionExec };


