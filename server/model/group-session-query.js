const DB = require('./DB.js');
const {
    GroupSession,
    GroupSessionJoin
} = require('../../config/db-config');

class GroupSessionQuery {
    getGroupSession(params, extra) {
        var id_where = (typeof params.ID === "undefined") ? "1=1" :
            `main.ID = '${params.ID}' `;

        var com_where = (typeof params.company_id === "undefined") ? "1=1" :
            `main.company_id = '${params.company_id}' `;

        var discard_expired = (typeof params.discard_expired === "undefined") ? "1=1" :
            `main.is_expired = 0`;

        var discard_canceled = (typeof params.discard_canceled === "undefined") ? "1=1" :
            `main.is_canceled = 0`;

        // extra for user based
        var user_where = "1=1";
        var user_select = "";
        var from_extra = "";


        if (typeof params.user_id !== "undefined") {
            from_extra = `LEFT OUTER JOIN ${GroupSessionJoin.TABLE} oth 
                ON oth.group_session_id = main.ID 
                and oth.user_id = ${params.user_id}`;
            user_where = ` oth.user_id = ${params.user_id} and oth.is_canceled = 0 `;
            user_select = ` oth.ID as join_id, `;
        }

        var order_by = (typeof params.order_by === "undefined") ? "ORDER BY main.start_time desc" : `ORDER BY ${params.order_by} `;

        //var limit = DB.prepareLimit(params.page, params.offset);
        var limit = "";

        var sql = `from ${GroupSession.TABLE} main ${from_extra}
            where ${id_where} and ${com_where} and ${user_where} 
            and ${discard_expired} and ${discard_canceled} ${order_by}`;

        if (extra.count) {
            return `select count(*) as cnt ${sql}`;
        } else {
            var toRet = `select ${user_select} main.* ${sql} ${limit}`;
            console.log(toRet);
            return toRet;
        }
    }

    getGroupSessionJoin(params, extra) {
        var id_where = (typeof params.ID === "undefined") ? "1=1" : `ID = '${params.ID}' `;

        var user_id_where = (typeof params.user_id === "undefined") ?
            "1=1" : `user_id = '${params.user_id}' `;

        var group_session_id_where = (typeof params.group_session_id === "undefined") ?
            "1=1" : `group_session_id = '${params.group_session_id}' `;

        var is_canceled_where = (typeof params.is_canceled === "undefined") ?
            "1=1" : `is_canceled = '${params.is_canceled}' `;

        var order_by = (typeof params.order_by === "undefined") ? "" : `ORDER BY ${params.order_by} `;

        //var limit = DB.prepareLimit(params.page, params.offset);
        var limit = "";

        var sql = `from ${GroupSessionJoin.TABLE} 
            where ${id_where} and ${user_id_where} and ${is_canceled_where} and ${group_session_id_where} ${order_by}`;

        if (extra.count) {
            return `select count(*) as cnt ${sql}`;
        } else {
            return `select * ${sql} ${limit}`;
        }
    }
}
GroupSessionQuery = new GroupSessionQuery();

class GroupSessionExec {
    getGroupSessionJoinHelper(type, params, field, extra = {}) {

        const {
            UserExec
        } = require('./user-query.js');

        var OBJ = this;

        var sql = GroupSessionQuery.getGroupSessionJoin(params, extra);
        var toRet = DB.query(sql).then(function (res) {
            if (extra.count) {
                return res[0]["cnt"];
            }

            for (var i in res) {
                if (typeof field["user"] !== "undefined") {
                    var user_id = res[i]["user_id"];
                    res[i]["user"] = UserExec.user({
                        ID: user_id
                    }, field["user"]);
                }

                if (typeof field["group_session"] !== "undefined") {
                    var group_session_id = res[i]["group_session_id"];
                    res[i]["group_session"] = OBJ.group_session({
                        ID: group_session_id
                    }, field["group_session"]);
                }
            }

            if (type === "single") {
                return res[0];
            } else {
                return res;
            }
        });


        return toRet;
    }


    group_session_join(params, field) {
        return this.getGroupSessionJoinHelper("single", params, field);
    }

    group_session_joins(params, field, extra = {}) {
        return this.getGroupSessionJoinHelper(false, params, field, extra);
    }

    getGroupSessionHelper(type, params, field, extra = {}) {

        const {
            CompanyExec
        } = require('./company-query.js');

        var OBJ = this;

        var sql = GroupSessionQuery.getGroupSession(params, extra);
        var toRet = DB.query(sql).then(function (res) {
            if (extra.count) {
                return res[0]["cnt"];
            }

            for (var i in res) {
                if (typeof field["company"] !== "undefined") {
                    var company_id = res[i]["company_id"];
                    res[i]["company"] = CompanyExec.company(company_id, field["company"]);
                }
                if (typeof field["joiners"] !== "undefined") {
                    var group_session_id = res[i]["ID"];
                    res[i]["joiners"] = OBJ.group_session_joins({
                        group_session_id: group_session_id, is_canceled: 0
                    }, field["joiners"]);
                }
            }

            if (type === "single") {
                return res[0];
            } else {
                return res;
            }
        });


        return toRet;
    }

    group_session(params, field) {
        return this.getGroupSessionHelper("single", params, field);
    }

    group_sessions(params, field, extra = {}) {
        return this.getGroupSessionHelper(false, params, field, extra);
    }
}

GroupSessionExec = new GroupSessionExec();

module.exports = {
    GroupSessionExec,
    GroupSessionQuery
};