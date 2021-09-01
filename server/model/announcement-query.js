const DB = require('./DB.js');

class AnnouncementExec {
    getQuery(params) {
        var id_where = (typeof params.ID === "undefined") ? "1=1" : `ID = ${params.ID}`;
        var cf_where = (typeof params.cf === "undefined") ? "1=1" : `cf = '${params.cf}'`;
        var order_by = "ORDER BY " + ((typeof params.order_by === "undefined") ? `created_at desc` : `${params.order_by}`);
        var limit = DB.prepareLimit(params.page, params.offset);

        let sqlBody = ` from announcements n
            where ${id_where} 
            and ${cf_where} 
        `;

        let q = "";

        if (params.ttl == "1") {
            q = `select count(*) as ttl ${sqlBody}`;
        } else {
            q = `select * ${sqlBody} ${order_by} ${limit}`;
        }

        console.log("q", q);
        return q;
    }

    announcements(params, field, extra = {}) {
        const { UserExec } = require('./user-query.js');

        var sql = this.getQuery(params);
        //// console.log(sql)
        var toRet = DB.query(sql).then(function (res) {

            for (var i in res) {
                if (typeof field["creator"] !== "undefined") {
                    var user_id = res[i]["created_by"];
                    res[i]["creator"] = UserExec.user({ ID: user_id }, field["creator"]);
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

AnnouncementExec = new AnnouncementExec();

module.exports = {
    AnnouncementExec
};