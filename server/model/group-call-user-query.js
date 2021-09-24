const DB = require("./DB.js");

class GroupCallUserExec {
  query(param, type) {
    let group_call_id = !param.group_call_id ? "1=1" : `group_call_id = '${param.group_call_id}'`;
    var limit = DB.prepareLimit(param.page, param.offset);

    let select = "*";
    if (this.isCount(type)) {
      select = DB.selectAllCount();
    }

    var sql = `select ${select} from group_call_user
      where 1=1 
      and ${group_call_id}
      ${limit}`;

    console.log(sql);
    return sql;
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
    const { UserExec } = require("./user-query.js");

    var sql = this.query(param, type);
    console.log("sql", sql);
    var toRet = DB.query(sql).then(res => {
      console.log("res", res);
      if (this.isCount(type)) {
        return res[0].total;
      }

      for (var i in res) {
        if (typeof field["user"] !== "undefined") {
          var user_id = res[i]["user_id"];
          res[i]["user"] = UserExec.user({ ID: user_id }, field["user"]);
        }
      }

      if (this.isSingle(type)) {
        return res[0];
      } else if (this.isList(type)) {
        return res;
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

GroupCallUserExec = new GroupCallUserExec();
module.exports = {
  GroupCallUserExec
};
