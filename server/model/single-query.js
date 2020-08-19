const DB = require("./DB.js");
class SingleExec {
  query(param) {
    let key_input = !param.key_input
      ? "1=1"
      : ` key_input = '${param.key_input}' `;
    let entity = !param.entity ? "1=1" : ` entity = '${param.entity}' `;
    let entity_id = !param.entity_id
      ? "1=1"
      : ` entity_id = ${param.entity_id} `;

    let sql = `
			select * from single_input where 1=1
			and ${key_input} and ${entity} and ${entity_id}
		`;
    return sql;
  }
  // insert(param) {
  //   let sql = `INSERT INTO single_input (entity, entity_id, key_input, val) 
  //   VALUES("${param.entity}", ${param.entity_id}, "${param.key_input}", "${param.val}") 
  //   ON DUPLICATE KEY UPDATE val="${param.val}" `
  //   return DB.query(sql).then(function (res) {
  //     var insertId = res.insertId;
  //     return DB.getByID("single_input", insertId);
  //   });
  // }
  isSingle(type) {
    return type == "single";
  }
  getHelper(type, param, field, extra = {}) {
    var sql = this.query(param, extra);

    //console.log("[SingleExec]", sql);
    var toRet = DB.query(sql).then(res => {
      for (var i in res) {
      }
      if (this.isSingle(type)) {
        if (param.valOnly === true) {
          try {
            return res[0].val;
          } catch (err) {
            return null;
          }
        }
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
  // list(param, field, extra = {}) {
  // 	return this.getHelper("list", param, field, extra);
  // }
}

SingleExec = new SingleExec();
module.exports = {
  SingleExec
};
