const DB = require('./DB.js');
const { ForumComment, ForumReply } = require('../../config/db-config');

class ForumExec {

    constructor(){
        this.LIMIT_INITIAL_REPLY = 3;
    }

    // ##############################################
    // Replies  --------------------------------------

    getQueryReplies(params) {
        var comment_id_where = (typeof params.comment_id === "undefined") ? "1=1" : `comment_id = ${params.comment_id}`;
        var order_by = "ORDER BY " + ((typeof params.order_by === "undefined") ? `created_at asc` : `${params.order_by}`);
        var limit = DB.prepareLimit(params.page, params.offset);

        return `select * from ${ForumReply.TABLE} where ${comment_id_where} 
            ${order_by} ${limit}`;
    }


    forum_replies(params, field, extra = {}) {
        const { UserExec } = require('./user-query.js');

        var sql = this.getQueryReplies(params);
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
    getQueryComments(params) {
        var forum_id_where = (typeof params.forum_id === "undefined") ? "1=1" : `forum_id = '${params.forum_id}' `;
        var order_by = "ORDER BY " + ((typeof params.order_by === "undefined") ? `created_at desc` : `${params.order_by}`);
        var limit = DB.prepareLimit(params.page, params.offset);

        return `select * from ${ForumComment.TABLE} where ${forum_id_where} 
            ${order_by} ${limit}`;
    }

    forum_comments(params, field, extra = {}) {
        const { UserExec } = require('./user-query.js');

        var sql = this.getQueryComments(params);

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


