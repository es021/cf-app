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

const {
    UserQuery
} = require("./user-query");

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


        var bigger_than_key = (!params.bigger_than_key) ? "1=1" :
            `CONCAT(mc.updated_at, "::", ss.ID) > "${params.bigger_than_key}" `;

        var smaller_than_key = (!params.smaller_than_key) ? "1=1" :
            `CONCAT(mc.updated_at, "::", ss.ID) < "${params.smaller_than_key}" `;

        var limit = DB.prepareLimit(1, params.offset);

        var order_by = "ORDER BY mc.updated_at desc, ss.created_at desc";
        var select = "";
        // last_message_time
        select += ", mc.updated_at as last_message_time";
        // last_message
        select += ", m.message as last_message";
        // last_send_by
        select += `
            , CONCAT(
                (${UserQuery.selectSingleMain("m.recruiter_id", "first_name")}),
                " ",
                (${UserQuery.selectSingleMain("m.recruiter_id", "last_name")})
            ) as last_rec_name
        `;


        // where mx.id_message_number like CONCAT(mc.id,':%') 
        let toRet = `select 
            ss.ID, 
            ss.user_id, 
            ss.support_id, 
            ss.message_count_id, 
            ss.created_at,

            CONCAT(mc.updated_at, "::", ss.ID) as order_key

            ${select}

            , COUNT(mx.id_message_number) as total_unread

            FROM ${SupportSession.TABLE} ss 
                INNER JOIN message_count mc on mc.id = ss.message_count_id
                INNER JOIN messages m on m.id_message_number = CONCAT(mc.id,':',mc.count)
                LEFT OUTER JOIN messages mx on  
                    mx.id_message_number like CONCAT(mc.id,':%')
                    AND mx.from_user_id != ${params.support_id ? params.support_id : params.user_id}
                    AND mx.has_read = 0
                    AND mx.created_at > '${START_TOTAL_UNREAD_TIME}'

            WHERE 
            ${support_id_where} AND ${user_id_where} AND ${bigger_than_key} AND ${smaller_than_key}
            
            GROUP BY ss.ID, ss.user_id, ss.support_id, ss.message_count_id, ss.created_at, last_message_time, last_message, last_rec_name

            ${order_by}

            ${limit}
        `;
        return toRet;

        // return `select ss.* ${select},

        //     (select count(*) from messages mx 
        //         where mx.id_message_number = mc.id
        //         AND mx.from_user_id != ${params.support_id ? params.support_id : params.user_id}
        //         AND mx.has_read = 0
        //         AND mx.created_at > '${START_TOTAL_UNREAD_TIME}') as total_unread
        //     from ${SupportSession.TABLE} ss 
        //         LEFT OUTER JOIN message_count mc on mc.id = ss.message_count_id
        //         LEFT OUTER JOIN messages m on m.id_message_number = CONCAT(mc.id,':',mc.count)
        //     where ${support_id_where} AND ${user_id_where} ${order_by}`;
    }

    support_sessions(params, field, extra = {}) {
        const {
            UserExec
        } = require('./user-query.js');
        const {
            CompanyExec
        } = require('./company-query.js');
        var sql = this.getQuery(params);
        console.log(sql);
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