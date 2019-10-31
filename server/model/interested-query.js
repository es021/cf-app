const DB = require("./DB.js");

class InterestedExec {
  query(param, type) {
    let user_id = !param.user_id ? "1=1" : `user_id = '${param.user_id}'`;
    let entity = !param.entity ? "1=1" : `entity = '${param.entity}'`;
    let entity_id = !param.entity_id ? "1=1" : `entity_id = ${param.entity_id}`;

    var limit = DB.prepareLimit(param.page, param.offset);

    let select = "*";
    if (this.isCount(type)) {
      select = DB.selectAllCount();
    }

    var sql = `select ${select} from interested
		where 1=1 and ${user_id} and ${entity} and ${entity_id} ${limit}`;
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
	const { UserExec } = require('./user-query.js');
    //var sql = this.isSingle(type) ? this.querySingle(param, extra) : this.queryList(param, extra);
    var sql = this.query(param, type);
    console.log("[InterestedExec]", sql);
    var toRet = DB.query(sql).then(res => {
      if (this.isSingle(type)) {
        if (res.length <= 0) {
          return {
            is_interested: 0
          };
        } else {
          return res[0];
        }
      } else if (this.isList(type)) {
        for (var i in res) {
          if (typeof field["user"] !== "undefined") {
            var user_id = res[i]["user_id"];
            res[i]["user"] = UserExec.user({ ID: user_id }, field["user"]);
          }
        }
        return res;
      } else if (this.isCount(type)) {
        return res[0];
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

InterestedExec = new InterestedExec();
module.exports = {
  InterestedExec
};
