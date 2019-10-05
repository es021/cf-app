const DB = require('./DB.js');

class MultiRefExec {
	query(param) {
		let table_name = param.table_name;
		let val = (!param.val) ? "1=1" : ` val like '%${param.val}%' `;
		let category = (!param.category) ? "1=1" : ` category = '${param.category}' `;

		var limit = DB.prepareLimit(param.page, param.offset);

		let sql = `
			select * from multi_ref_${table_name} where 1=1
			and ${val} and ${category}
			${limit}
		`;
		return sql;
	}
	isSingle(type) {
		return type == "single";
	}
	getHelper(type, param, field, extra = {}) {
		var {
			MultiExec
		} = require('./multi-query.js');
		var sql = this.query(param, extra);
		console.log("[MultiRefExec]", sql);
		var toRet = DB.query(sql).then((res) => {
			for (var i in res) {
				let val = res[i]["val"];
				if (typeof field["multi"] !== "undefined") {
					let p = {
						table_name: param.table_name,
						entity: param.entity,
						entity_id: param.entity_id,
						val: val,
					}
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

MultiRefExec = new MultiRefExec();
module.exports = {
	MultiRefExec
};