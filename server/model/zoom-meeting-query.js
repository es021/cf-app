const DB = require("./DB.js");

// all-type
// mutation
// root

class ZoomMeetingExec {
  // TODO
  query(param, type) {
    let tableName = "zoom_meetings";
    let join_url = !param.join_url ? "1=1" : `join_url = '${param.join_url}'`;
    let pre_screen_id = !param.pre_screen_id ? "1=1" : `pre_screen_id = '${param.pre_screen_id}'`;
    let group_session_id = !param.group_session_id ? "1=1" : `group_session_id = ${param.group_session_id}`;
    let zoom_meeting_id = !param.zoom_meeting_id ? "1=1" : `zoom_meeting_id = ${param.zoom_meeting_id}`;
    let zoom_host_id = !param.zoom_host_id ? "1=1" : `zoom_host_id = ${param.zoom_host_id}`;

    var limit = DB.prepareLimit(param.page, param.offset);
    let select = "*";
    if (this.isCount(type)) {
      select = DB.selectAllCount();
    }
    var sql = `select ${select} from ${tableName}
    where 1=1 and ${join_url} and ${pre_screen_id} and ${group_session_id}  and ${zoom_meeting_id}  and ${zoom_host_id}
    ${limit}`;
    return sql;
  }
  // TODO
  resSingle(res) {
    return res[0];
  }
  // TODO
  resCount(res) {
    return res[0];
  }
  // TODO
  resList(res, field) {
    // for (var i in res) {
    //   if (typeof field["user"] !== "undefined") {
    //     var user_id = res[i]["user_id"];
    //     res[i]["user"] = UserExec.user({ ID: user_id }, field["user"]);
    //   }
    // }
    return res;
  }
  isSingle(type) {
    return type == "single";
  }
  isList(type) {
    return type == "list";
  }
  isCount(type) {
    return type == "count";
  }
  getHelper(type, param, field, extra = {}) {
    var sql = this.query(param, type);
    //// console.log("[ZoomMeetingExec]", sql);
    var toRet = DB.query(sql).then(res => {
      if (this.isSingle(type)) {
        return this.resSingle(res);
      } else if (this.isList(type)) {
        return this.resList(res, field);
      } else if (this.isCount(type)) {
        return this.resCount(res);
      }
    });
    return toRet;
  }
  single(param, field) {
    return this.getHelper("single", param, field);
  }
  list(param, field, extra = {}) {
    return this.getHelper("list", param, field, extra);
  }
  count(param, field, extra = {}) {
    return this.getHelper("count", param, field, extra);
  }
}

ZoomMeetingExec = new ZoomMeetingExec();
module.exports = {
  ZoomMeetingExec
};
