const DB = require('./DB.js');
const { ForumComment, ForumReply } = require('../../config/db-config');

class ForumExec {

    constructor() {
        this.LIMIT_INITIAL_REPLY = 2;
    }

    // ##############################################
    // Replies  --------------------------------------

    getQueryReplies(params, extra) {
        var comment_id_where = (typeof params.comment_id === "undefined") ? "1=1" : `comment_id = ${params.comment_id}`;
        var order_by = "ORDER BY " + ((typeof params.order_by === "undefined") ? `created_at asc` : `${params.order_by}`);
        var limit = DB.prepareLimit(params.page, params.offset);
        var sql = `from ${ForumReply.TABLE} where ${comment_id_where}`;

        if (extra.count) {
            return `select count(*) as cnt ${sql}`;
        } else {
            return `select * ${sql} ${order_by} ${limit}`;
        }
    }

    forum_replies(params, field, extra = {}) {
        const { UserExec } = require('./user-query.js');
        var sql = this.getQueryReplies(params, extra);
        console.log(sql);
        var toRet = DB.query(sql).then(function (res) {

            for (var i in res) {
                if (typeof field["user"] !== "undefined") {
                    var user_id = res[i]["user_id"];
                    res[i]["user"] = UserExec.user({ ID: user_id }, field["user"]);
                }
            }

            if (extra.single) {
                return res[0];
            }

            return res;

        });
        return toRet;
    }

    // ##############################################
    // Comments --------------------------------------
    getQueryComments(params, field, extra) {
        var forum_id_where = (typeof params.forum_id === "undefined") ? "1=1" : `forum_id = '${params.forum_id}' `;
        var order_by = "ORDER BY " + ((typeof params.order_by === "undefined") ? `created_at desc` : `${params.order_by}`);
        var limit = DB.prepareLimit(params.page, params.offset);

        var sql = `from ${ForumComment.TABLE} c where ${forum_id_where}`;
        var extraSel = "";
        if (typeof field["replies_count"] !== "undefined") {
            extraSel += `, (select count(*) from ${ForumReply.TABLE} cr where c.ID = cr.comment_id) as replies_count `;
        }

        if (extra.count) {
            return `select count(*) as cnt ${sql}`;
        } else {
            return `select c.* ${extraSel} ${sql} ${order_by} ${limit}`;
        }
    }

    forum_comments(params, field, extra = {}) {
        const { UserExec } = require('./user-query.js');
        var sql = this.getQueryComments(params, field, extra);

        var toRet = DB.query(sql).then((res) => {

            for (var i in res) {
                if (typeof field["replies"] !== "undefined") {
                    var param = {
                        comment_id: res[i]["ID"],
                        page: 1,
                        offset: this.LIMIT_INITIAL_REPLY
                    }
                    res[i]["replies"] = this.forum_replies(param
                        , field["replies"]);
                }

                if (typeof field["user"] !== "undefined") {
                    var user_id = res[i]["user_id"];
                    res[i]["user"] = UserExec.user({ ID: user_id }, field["user"]);
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

ForumExec = new ForumExec();

module.exports = { ForumExec };


