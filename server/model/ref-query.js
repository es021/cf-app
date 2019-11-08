const DB = require("./DB.js");

class RefExec {
  query(param) {
    param = DB.sanitize(param);

    let table_name = param.table_name;
    let val = !param.val ? "1=1" : ` val like '%${param.val}%' `;
    let category = !param.category ? "1=1" : ` category = '${param.category}' `;

    // create filter
    let filter = "1=1";
    if (param.filter_column && param.filter_val) {
      filter = ` ${param.filter_column} = '${param.filter_val}' `;
      if (param.filter_find_id === true) {
        let filterTable = null;
        if (param.filter_column == "country_id") {
          filterTable = "country";
        }
        if (filterTable != null) {
          filter = ` ${param.filter_column} = (select x.ID from ref_${filterTable} x where x.val = '${param.filter_val}' ) `;
        } else {
          filter = "1=1";
        }
      }
    }



    let order_by = !param.order_by ? "" : `ORDER BY ${param.order_by}`;


    // search_by_ref : __.String,
    // search_by_val : __.String,
    let suggestion = "1=1";

    if (param.search_by_ref) {
      if (
        !param.search_by_val ||
        param.search_by_val == "null" ||
        param.search_by_val == "undefined"
      ) {
        suggestion = "1=0";
      } else {
        let search_by_val = "'1'";
        try {
          search_by_val = "";
          let list = param.search_by_val.split("::");
          for (var i in list) {
            if (i > 0) {
              search_by_val += ", ";
            }
            search_by_val += ` '${list[i]}' `;
          }
        } catch (err) {
          search_by_val = `'${param.search_by_val}'`;
        }

        suggestion = `category IN 
            (
              select rms.input_category from refmap_suggestion rms 
              where rms.input_ref = '${param.table_name}'
              and rms.search_by_ref = '${param.search_by_ref}'
              and rms.search_by_category IN 
              (select ch.category from ref_${param.search_by_ref} ch 
                where ch.val IN (${search_by_val}) )
            )`;
      }
    }

    var limit = DB.prepareLimit(param.page, param.offset);

    let sql = `
			select *, "${table_name}" as table_name from ref_${table_name} where 1=1
			and ${val} and ${category} and ${suggestion} and ${filter}
			${order_by}
			${limit}
		`;
    return sql;
  }
  isSingle(type) {
    return type == "single";
  }
  getHelper(type, param, field, extra = {}) {
    var { MultiExec } = require("./multi-query.js");
    var sql = this.query(param, extra);
    // console.log("[RefExec]", sql);
    var toRet = DB.query(sql).then(res => {
      for (var i in res) {
        let val = res[i]["val"];
        if (typeof field["multi"] !== "undefined") {
          let p = {
            table_name: param.multi_table_name,
            entity: param.entity,
            entity_id: param.entity_id,
            val: val
          };
          res[i]["multi"] = MultiExec.single(p, field["multi"]);
        }
      }
      if (this.isSingle(type)) {
        return res[0];
      } else {
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
}

RefExec = new RefExec();
module.exports = {
  RefExec
};