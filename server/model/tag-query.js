const DB = require("./DB.js");

// all-type
// mutation
// root

class TagExec {
  // TODO
  query(param, type) {
    let tableName = "tag";
    let ID = !param.ID ? "1=1" : `ID = '${param.ID}'`;
    let entity = !param.entity ? "1=1" : `entity = '${param.entity}'`;
    let entity_id = !param.entity_id ? "1=1" : `entity_id = ${param.entity_id}`;
    let order_by = "ORDER BY created_at DESC";

    var limit = DB.prepareLimit(param.page, param.offset);
    let select = "*";
    if (this.isCount(type)) {
      select = DB.selectAllCount();
    }
    var sql = `select ${select} from ${tableName}
    where 1=1 and ${ID} and ${entity} and ${entity_id}
    ${order_by} ${limit}`;
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
    // // console.log("[TagExec]", sql);
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

TagExec = new TagExec();
module.exports = {
  TagExec
};
