const DB = require("./DB.js");

// all-type
// mutation
// root

class QrCheckInExec {
  query(param, type) {
    let tableName = "qr_check_in";
    let cf = !param.cf ? "1=1" : `cf = '${param.cf}'`;
    // let entity = !param.entity ? "1=1" : `entity = '${param.entity}'`;
    // let entity_id = !param.entity_id ? "1=1" : `entity_id = ${param.entity_id}`;

    var order_by = "ORDER BY created_at DESC";
    var limit = DB.prepareLimit(param.page, param.offset);
    let select = this.isCount(type) ? "COUNT(*) as total" : "*";
    var sql = `select ${select} from ${tableName}
    where 1=1 and ${cf}
    ${order_by}
    ${limit}`;
    return sql;
  }
  resSingle(res) {
    return res[0];
  }
  resCount(res) {
    return res[0]["total"];
  }
  resList(res, field) {
    const { UserExec } = require("./user-query.js");
    for (var i in res) {
      if (typeof field["user"] !== "undefined") {
        var user_id = res[i]["user_id"];
        res[i]["user"] = UserExec.user({ ID: user_id }, field["user"]);
      }
      if (typeof field["checked_in_by_user"] !== "undefined") {
        var checked_in_by = res[i]["checked_in_by"];
        res[i]["checked_in_by_user"] = UserExec.user({ ID: checked_in_by }, field["checked_in_by_user"]);
      }
    }
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
    //// console.log("[QrCheckInExec]", sql);
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

QrCheckInExec = new QrCheckInExec();
module.exports = {
  QrCheckInExec
};
