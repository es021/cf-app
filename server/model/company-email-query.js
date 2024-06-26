const DB = require("./DB.js");

class CompanyEmailExec {
  query(param, type) {
    let company_id = !param.company_id ? "1=1" : `company_id = '${param.company_id}'`;

    var limit = DB.prepareLimit(param.page, param.offset);

    let select = "*";
    if (this.isCount(type)) {
      select = DB.selectAllCount();
    }

    var sql = `select ${select} from company_emails
      where 1=1 
      and ${company_id} 
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
    var sql = this.query(param, type);
    console.log("sql", sql);
    var toRet = DB.query(sql).then(res => {
      console.log("res", res);
      if (this.isSingle(type)) {
        return res[0];
      } else if (this.isList(type)) {
        for (var i in res) {
        }
        return res;
      } else if (this.isCount(type)) {
        return res[0].total;
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

CompanyEmailExec = new CompanyEmailExec();
module.exports = {
  CompanyEmailExec
};
