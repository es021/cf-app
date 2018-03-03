const DB = require('./DB.js');

class ZoomQuery {
    getZoomInvites(params, extra) {
        // basic condition
        var user_where = (typeof params.user_id === "undefined") ? "1=1"
            : `z.user_id = ${params.user_id}`;

        var is_expired = `select zm.is_expired from zoom_meetings zm where zm.zoom_meeting_id = z.zoom_meeting_id`;

        var expired_where = "1=1";
        if (typeof params.is_expired !== "undefined") {
            expired_where = `(${is_expired}) `;

            // not expired
            if (!params.is_expired) {
                expired_where += " is null  ";
            }
            // is expired
            else {
                expired_where += " = 1 ";
            }
        }

        // limit and order by
        var order_by = (typeof params.order_by === "undefined") ? "" : `ORDER BY created_at`;


        var sql = `select z.*, (${is_expired}) 
            from zoom_invites z 
            where ${user_where} and ${expired_where}
            ${order_by}`;

        return sql;
    }
}


ZoomQuery = new ZoomQuery();

class ZoomExec {

    zoom_invites(params, field, extra = {}) {
        const { UserExec } = require('./user-query.js');

        var sql = ZoomQuery.getZoomInvites(params, extra);
        var toRet = DB.query(sql).then(function (res) {

            for (var i in res) {
                var student_id = res[i]["participant_id"];
                var recruiter_id = res[i]["host_id"];

                res[i]["is_expired"] = (res[i]["is_expired"] === 1);

                if (typeof field["student"] !== "undefined") {
                    res[i]["student"] = UserExec.user({ ID: student_id }, field["student"]);
                }

                if (typeof field["recruiter"] !== "undefined") {
                    res[i]["recruiter"] = UserExec.user({ ID: recruiter_id }, field["recruiter"]);
                }
            }

            if (extra.single) {
                return res[0];
            }

            return res;
        });

        return toRet;
    }
}
ZoomExec = new ZoomExec();

module.exports = { ZoomExec, ZoomQuery };


