const DB = require('./DB.js');
const {
    SupportSession
} = require('../../config/db-config');
const {
    TestUser,
    SupportUserID
} = require('../../config/app-config');

const {
    START_TOTAL_UNREAD_TIME
} = require("./message-query");

class SupportSessionExec {
    getQueryByUserAndSupportId(user_id, support_id) {
        return `select ss.ID from ${SupportSession.TABLE} ss where ss.user_id = ${user_id} and ss.support_id = ${support_id}`;
    }

    getQueryByUserId(user_id) {
        return `select ss.ID from ${SupportSession.TABLE} ss where ss.user_id = ${user_id}`;
    }

    getQuery(params) {
        var support_id_where = (typeof params.support_id === "undefined") ? "1=1" :
            `ss.${SupportSession.SUPPORT_ID} = ${params.support_id}`;

        var user_id_where = (typeof params.user_id === "undefined") ? "1=1" :
            `ss.${SupportSession.USER_ID} = ${params.user_id}`;

        var order_by = "ORDER BY mc.updated_at desc, ss.created_at desc";
        var select = "";
        // last_message_time
        select += ", mc.updated_at as last_message_time";
        // last_message
        select += ", m.message as last_message";


        return `select ss.* ${select},
            
            (select count(*) from messages mx 
                where mx.id_message_number like CONCAT(mc.id,':%') 
                AND mx.from_user_id != ${params.support_id ? params.support_id : params.user_id}
                AND mx.has_read = 0
                AND mx.created_at > '${START_TOTAL_UNREAD_TIME}') as total_unread
            from ${SupportSession.TABLE} ss 
                LEFT OUTER JOIN message_count mc on mc.id = ss.message_count_id
                LEFT OUTER JOIN messages m on m.id_message_number = CONCAT(mc.id,':',mc.count)
            where ${support_id_where} AND ${user_id_where} ${order_by}`;
    }

    support_sessions(params, field, extra = {}) {
        const {
            UserExec
        } = require('./user-query.js');
        const {
            CompanyExec
        } = require('./company-query.js');
        var sql = this.getQuery(params);
        //// console.log(sql);
        var toRet = DB.query(sql).then(function (res) {
            for (var i in res) {
                var user_id = res[i]["user_id"];
                var support_id = res[i]["support_id"];
                if (typeof field["user"] !== "undefined") {
                    res[i]["user"] = UserExec.user({
                        ID: user_id
                    }, field["user"]);
                }

                if (typeof field["company"] !== "undefined") {
                    res[i]["company"] = CompanyExec.company(support_id, field["company"]);
                }

                if (typeof field["support"] !== "undefined" && support_id == SupportUserID) {
                    res[i]["support"] = UserExec.user({
                        ID: SupportUserID
                    }, field["support"]);
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

module.exports = {
    SupportSessionExec
};