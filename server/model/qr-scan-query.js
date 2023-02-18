const DB = require("./DB.js");

// all-type
// mutation
// root
// QrScanExec replace with <>

class QrScanExec {

  query(param, queryType) {
    let cf = param.cf;
    let type = param.type;
    let company_id = param.company_id;
    let scanned_by_company_id = param.scanned_by_company_id;

    let where = `
      AND s.qr_id = i.ID 
      AND i.cf = ?
      AND i.type = ?
    `
    let whereParam = [cf, type];

    if (company_id) {
      where += ` AND i.company_id = ?  `
      whereParam.push(company_id);
    }
    if (scanned_by_company_id) {
      where += ` AND u.rec_company_id = ? `
      whereParam.push(scanned_by_company_id);
    }

    var limit = DB.prepareLimit(param.page, param.offset);

    let select = this.isCount(queryType) ? "COUNT(s.ID) as total" : "s.*";

    var sql = `SELECT ${select} FROM qr_img i, qr_scan s LEFT OUTER JOIN wp_cf_users u ON logged_in_user_id = u.ID 
    WHERE 1=1
    ${where}
    
    ORDER BY s.created_at DESC
    ${limit}`;

    sql = DB.prepare(sql, whereParam);
    console.log("sql",sql)
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
    const { QrImgExec } = require("./qr-img-query.js");
    for (var i in res) {
      // TODO
      if (typeof field["logged_in_user"] !== "undefined") {
        var logged_in_user_id = res[i]["logged_in_user_id"];
        res[i]["logged_in_user"] = UserExec.user({ ID: logged_in_user_id }, field["logged_in_user"]);
      }
      if (typeof field["user"] !== "undefined") {
        var user_id = res[i]["user_id"];
        res[i]["user"] = UserExec.user({ ID: user_id }, field["user"]);
      }
      if (typeof field["qr"] !== "undefined") {
        var qr_id = res[i]["qr_id"];
        res[i]["qr"] = QrImgExec.single({ ID: qr_id }, field["qr"]);
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
    //// console.log("[QrScanExec]", sql);
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

QrScanExec = new QrScanExec();
module.exports = {
  QrScanExec
};
