const DB = require("./DB.js");

// all-type
// mutation
// root

class __Exec {
  // TODO
  query(param, type) {
    let tableName = "";
    let user_id = !param.user_id ? "1=1" : `user_id = '${param.user_id}'`;
    let entity = !param.entity ? "1=1" : `entity = '${param.entity}'`;
    let entity_id = !param.entity_id ? "1=1" : `entity_id = ${param.entity_id}`;

    var limit = DB.prepareLimit(param.page, param.offset);
    let select = "*";
    if (this.isCount(type)) {
      select = DB.selectAllCount();
    }
    var sql = `select ${select} from ${tableName}
    where 1=1 and ${user_id} and ${entity} and ${entity_id} 
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
    const { UserExec } = require("./user-query.js");
    for (var i in res) {
      if (typeof field["user"] !== "undefined") {
        var user_id = res[i]["user_id"];
        res[i]["user"] = UserExec.user({ ID: user_id }, field["user"]);
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
    //// console.log("[__Exec]", sql);
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

__Exec = new __Exec();
module.exports = {
  __Exec
};
