const DB = require("./DB.js");

class GroupCallExec {
  query(param, type) {
    let company_id = !param.company_id ? "1=1" : `gc.company_id = '${param.company_id}'`;
    let cf = !param.cf ? "1=1" : `gc.cf = '${param.cf}'`;
    let id = !param.ID ? "1=1" : `gc.ID = '${param.ID}'`;
    let is_canceled = typeof param.is_canceled === 'undefined'
      ? "1=1" : `gc.is_canceled = '${param.is_canceled}'`;

    let company_name = "1=1";
    if (param.company_name) {
      company_name = ` gc.company_id = (SELECT c.ID FROM companies c 
        WHERE c.ID = gc.company_id AND c.name LIKE '%${param.company_name}%' LIMIT 0,1) `
    }

  

    let user_id = "1=1";
    if (param.user_id) {
      user_id = `
      ${param.user_id} = (
        SELECT gcu.user_id FROM group_call_user gcu 
        WHERE gcu.group_call_id = gc.ID
        AND gcu.user_id = ${param.user_id}
        LIMIT 0,1
      )
      `
    }

    var limit = DB.prepareLimit(param.page, param.offset);

    let order_by = "";
    if (param.order_by) {
      order_by = `ORDER BY ${param.order_by}`
    } else {
      order_by = `ORDER BY gc.appointment_time ASC`
    }

    let select = `
      gc.*,
      (SELECT COUNT(gcu.ID) FROM group_call_user gcu 
        WHERE gcu.group_call_id = gc.ID) as user_count
    `;

    if (this.isCount(type)) {
      select = DB.selectAllCount();
    }

    var sql = `select ${select} from group_call gc
      where 1=1 
      and ${id} 
      and ${company_name} 
      and ${company_id} 
      and ${cf} 
      and ${user_id}
      and ${is_canceled}
      ${order_by}
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
    const { GroupCallUserExec } = require('./group-call-user-query.js');
    const { CompanyExec } = require('./company-query.js');

    var sql = this.query(param, type);
    console.log("sql", sql);
    var toRet = DB.query(sql).then(res => {
      console.log("res", res);
      if (this.isCount(type)) {
        return res[0].total;
      }

      for (var i in res) {
        if (typeof field["company"] !== "undefined") {
          var company_id = res[i]["company_id"];
          res[i]["company"] = CompanyExec.company(company_id, field["company"]);
        }

        if (typeof field["users"] !== "undefined") {
          var ID = res[i]["ID"];
          res[i]["users"] = GroupCallUserExec.list({
            group_call_id: ID,
          },
            field["users"]
          );
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

GroupCallExec = new GroupCallExec();
module.exports = {
  GroupCallExec
};
