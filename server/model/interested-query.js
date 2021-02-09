const DB = require("./DB.js");
const { IsSeenEnum } = require("../../config/db-config.js");

class InterestedExec {
  query(param, type) {
    let user_id = !param.user_id ? "1=1" : `user_id = '${param.user_id}'`;
    var user_cf = (!param.user_cf) ? "1=1" :
      `user_id IN (select m.entity_id from cf_map m where m.entity = "user" and cf = "${param.user_cf}" ) `;

    let entity = !param.entity ? "1=1" : `entity = '${param.entity}'`;
    let entity_id = !param.entity_id ? "1=1" : `entity_id = ${param.entity_id}`;
    let is_interested = !param.is_interested ? "1=1" : `is_interested = ${param.is_interested}`;

    var limit = DB.prepareLimit(param.page, param.offset);

    let select = "*";
    if (this.isCount(type)) {
      select = DB.selectAllCount();
    }

    var sql = `select ${select} from interested
      where 1=1 and ${user_cf} and ${user_id} and ${entity} and ${entity_id} and ${is_interested} 
      ${limit}`;
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
    const { IsSeenExec } = require("./is-seen-query.js");

    //var sql = this.isSingle(type) ? this.querySingle(param, extra) : this.queryList(param, extra);
    var sql = this.query(param, type);
    // // console.log("[InterestedExec]", sql);
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
          var user_id = res[i]["user_id"];
          if (typeof field["user"] !== "undefined") {
            res[i]["user"] = UserExec.user({ ID: user_id }, field["user"]);
          }
          if (typeof field["is_seen"] !== "undefined" && param.current_user_id) {
            res[i]["is_seen"] = IsSeenExec.single({
              user_id: param.current_user_id,
              type: IsSeenEnum.TYPE_JOB_APPLICANT,
              entity_id: user_id
            },
              field["is_seen"]
            );
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
