const DB = require("./DB.js");
const { Message, SupportSession } = require("../../config/db-config");
const { SupportUserID } = require("../../config/app-config");

const START_TOTAL_UNREAD_TIME = "2021-09-01 00:00:00";

class MessageExec {
  getPreId(user_1, user_2, which_company) {
    let isUser1Company =
      which_company == "user_1" || which_company == "sender_id";
    let isUser2Company =
      which_company == "user_2" || which_company == "receiver_id";

    var lower = 0;
    var higher = 0;
    let lowerEntity = "user";
    let higherEntity = "user";

    if (user_1 < user_2) {
      lower = user_1;
      higher = user_2;

      if (isUser1Company) {
        lowerEntity = "company";
      }
      if (isUser2Company) {
        higherEntity = "company";
      }
    } else {
      lower = user_2;
      higher = user_1;

      if (isUser1Company) {
        higherEntity = "company";
      }
      if (isUser2Company) {
        lowerEntity = "company";
      }
    }

    return `${lowerEntity}${lower}:${higherEntity}${higher}`;
  }

  //params
  // user_1, user_2, page, offset
  getQuery(params, extra) {
    var pre_id = this.getPreId(
      params.user_1,
      params.user_2,
      params.which_company
    );
    var id_where = `id_message_number like '${pre_id}%' `;
    var order_by = `order by created_at desc`;

    var limit = DB.prepareLimit(params.page, params.offset);
    var sql = `select * from messages where ${id_where} ${order_by} ${limit}`;
    return sql;
  }

  getMessageHelper(params, field, extra = {}) {
    const {
      UserExec
    } = require('./user-query.js');

    if (
      typeof field["recruiter"] !== "undefined"
    ) {
      field["recruiter_id"] = 1;
    }

    var sql = this.getQuery(params, extra);
    var toRet = DB.query(sql).then(function (res) {

      for (var i in res) {
        if (typeof field["recruiter"] !== "undefined") {
          var recruiter_id = res[i]["recruiter_id"];
          res[i]["recruiter"] = UserExec.user({
            ID: recruiter_id
          }, field["recruiter"]);
        }
      }

      //// console.log(res);
      return res;
    });

    return toRet;
  }

  insert(sender_id, receiver_id, message, which_company, recruiter_id) {
    var pre_id = this.getPreId(sender_id, receiver_id, which_company);

    // check if receiver_id is in support user id
    //if () {
    const { SupportSessionExec } = require("./support-session-query.js");

    let supportUserId = null;
    let supportSupportId = null;

    if (SupportUserID == receiver_id || which_company == "receiver_id") {
      // kalau start support or student yang start dgn company
      supportUserId = sender_id;
      supportSupportId = receiver_id;
    } else if (which_company == "sender_id") {
      // kalau company yang start dengan student
      supportUserId = receiver_id;
      supportSupportId = sender_id;
    }

    if (supportUserId != null && supportSupportId != null) {
      // check if session with this user id already exist
      //DB.query(SupportSessionExec.getQueryByUserId(sender_id)).then((res) => {
      DB.query(
        SupportSessionExec.getQueryByUserAndSupportId(sender_id, receiver_id)
      ).then(res => {
        if (res.length <= 0) {
          //create support sessions
          var ss = {
            user_id: supportUserId,
            support_id: supportSupportId,
            message_count_id: pre_id
          };
          DB.insert(SupportSession.TABLE, ss).then(res => { }, err => { });
        }
      });
    }

    // message count
    var ins_count = {
      id: pre_id,
      count: 1
    };

    // on duplicate count = count + 1
    return DB.insert(
      "message_count",
      ins_count,
      "id",
      "count = count + 1"
    ).then(res => {
      // insert message
      var id_message_number = `${pre_id}:${res.count}`;
      var ins_mes = {
        id_message_number: id_message_number,
        id_message : pre_id,
        message: message,
        from_user_id: sender_id,

      };
      if (recruiter_id) {
        ins_mes["recruiter_id"] = recruiter_id;
      }

      return DB.insert("messages", ins_mes, "id_message_number").then(res => {
        // emit socket kat sini terus
        // TODO Socket
        return res;
      });
    });
  }

  messages(params, field, extra = {}) {
    return this.getMessageHelper(params, field, extra);
  }
  messages_count(params, field, extra = {}) {
    let user_id = params.user_id
      ? `id_message_number like '%user${params.user_id}:%' `
      : "1=1";
    let company_id = params.company_id
      ? `id_message_number like '%company${params.company_id}:%' `
      : "1=1";
    let discard_self = `from_user_id != ${params.user_id ? params.user_id : params.company_id
      }`;

    var sql = `SELECT count(*) AS total_unread FROM messages where 1=1 
            AND ${user_id} AND ${company_id} AND ${discard_self}
            AND has_read = 0 AND created_at > '${START_TOTAL_UNREAD_TIME}'`;
    var toRet = DB.query(sql).then(function (res) {
      return res[0];
    });
    return toRet;
  }
}

MessageExec = new MessageExec();
module.exports = {
  START_TOTAL_UNREAD_TIME,
  MessageExec
};

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
