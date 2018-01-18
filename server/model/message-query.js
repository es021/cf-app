const DB = require('./DB.js');
const { Message } = require('../../config/db-config');

class MessageExec {

    getPreId(user_1, user_2) {
        var lower = 0;
        var higher = 0;
        if (user_1 < user_2) {
            lower = user_1;
            higher = user_2;
        } else {
            lower = user_2;
            higher = user_1;
        }

        return `user${lower}:user${higher}`;
    }
    //params
    // user_1, user_2, page, offset
    getQuery(params, extra) {

        var pre_id = this.getPreId(params.user_1, params.user_2);
        var id_where = `id_message_number like '${pre_id}%' `;
        var order_by = `order by created_at desc`;

        var limit = DB.prepareLimit(params.page, params.offset);
        var sql = `select * from messages where ${id_where} ${order_by} ${limit}`;
        return sql;

    }

    getMessageHelper(params, field, extra = {}) {
        var sql = this.getQuery(params, extra);
        var toRet = DB.query(sql).then(function (res) {
            /*
            for (var i in res) {
                // if (typeof field["company"] !== "undefined") {
                //     var company_id = res[i]["company_id"];
                //     res[i]["company"] = CompanyExec.company(company_id, field["company"]);
                // }
            }
            */
            //console.log(res);
            return res;
        });


        return toRet;
    }

    insert(sender_id, receiver_id, message) {
        var pre_id = this.getPreId(sender_id, receiver_id);

        // message count
        var ins_count = {
            id: pre_id,
            count: 1
        };

        // on duplicate count = count + 1
        return DB.insert("message_count", ins_count, "id", "count = count + 1").then((res) => {
            // insert message
            var id_message_number = `${pre_id}:${res.count}`;
            var ins_mes = {
                id_message_number: id_message_number,
                message: message,
                from_user_id: sender_id
            };

            return DB.insert("messages", ins_mes, "id_message_number").then((res) => {
                // emit socket kat sini terus
                // TODO Socket
                return res;
            });

        });
    }

    messages(params, field, extra = {}) {
        return this.getMessageHelper(params, field, extra);
    }
}

MessageExec = new MessageExec();
module.exports = { MessageExec };


function getSessionThatHasMessage() {
    sql = `select distinct s.ID , s.participant_id, s.host_id, m.* 
    from sessions s
    , message_count m
    where
    m.id like (CASE WHEN s.host_id > s.participant_id THEN CONCAT('user',s.participant_id,':user',s.host_id)
    ELSE
    CONCAT('user',s.host_id,':user',s.participant_id)
    END)`;
}