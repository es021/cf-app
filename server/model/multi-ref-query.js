const DB = require('./DB.js');

class MultiRefExec {
	querySingle(param) {
		return "";
	}
	queryList(param) {

		let table_name = param.table_name;
		let val = (!param.val) ? "1=1" : ` val like '%${param.val}%' `;
		var limit = DB.prepareLimit(param.page, param.offset);

		let sql = `
			select * from multi_ref_${table_name} where 1=1
			and ${val}
			${limit}
		`;
		return sql;
	}
	isSingle(type) {
		return type == "single";
	}
	getHelper(type, param, field, extra = {}) {
		var sql = this.isSingle(type) ? this.querySingle(param, extra) : this.queryList(param, extra);
		console.log("[MultiRefExec]", sql);
		var toRet = DB.query(sql).then((res) => {
			for (var i in res) {}
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