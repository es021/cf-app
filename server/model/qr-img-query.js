const DB = require("./DB.js");

// all-type
// mutation
// root
// QrImgExec replace with <>

class QrImgExec {

  query(param, queryType) {
    let ID = param.ID;

    let where = `AND i.ID = ?`
    let whereParam = [ID];
    let select = this.isCount(queryType) ? "COUNT(i.ID) as total" : "i.*";

    var sql = `
    SELECT ${select} 
    FROM qr_img i
    WHERE 1=1
    ${where}
    ORDER BY i.created_at DESC`;

    sql = DB.prepare(sql, whereParam);
    return sql;
  }
  resolveRow(r, field) {
    const { UserExec } = require("./user-query.js");
    const { CompanyExec } = require("./company-query.js");
    const { EventExec } = require("./event-query.js");
    if (typeof field["user"] !== "undefined") {
      var user_id = r["user_id"];
      console.log("user_id", user_id)
      r["user"] = UserExec.user({ ID: user_id }, field["user"]);
    }
    if (typeof field["company"] !== "undefined") {
      var company_id = r["company_id"];
      console.log("company_id", company_id)
      r["company"] = CompanyExec.company(company_id, field["company"]);
    }
    if (typeof field["event"] !== "undefined") {
      var event_id = r["event_id"];
      r["event"] = EventExec.events(event_id, field["event"], { single: true });
    }
    return r;
  }
  resSingle(res, field) {
    return this.resolveRow(res[0], field);
  }
  resCount(res) {
    return res[0]["total"];
  }
  resList(res, field) {
    for (var i in res) {
      res[i] = this.resolveRow(res[i], field)
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
    //// console.log("[QrImgExec]", sql);
    var toRet = DB.query(sql).then(res => {
      if (this.isSingle(type)) {
        return this.resSingle(res, field);
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

QrImgExec = new QrImgExec();
module.exports = {
  QrImgExec
};
