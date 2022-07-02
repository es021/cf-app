const DB = require("./DB.js");

class GlobalDatasetExec {
	query(param) {
		param = DB.sanitize(param);

		let source = !param.source ? "1=1" : ` source = '${param.source}' `;
		let val = !param.val ? "1=1" : ` val like '%${param.val}%' `;
		let order_by = !param.order_by ? "" : `ORDER BY ${param.order_by}`;
		var limit = DB.prepareLimit(param.page, param.offset);

		let sql = `
			select * from global_dataset where 1=1
			and ${val} and ${source}
			${order_by}
			${limit}
		`;

		return sql;
	}
	isSingle(type) {
		return type == "single";
	}
	getHelper(type, param, field, extra = {}) {
		var sql = this.query(param, extra);
		var toRet = DB.query(sql).then(res => {
			// for (var i in res) {
			// 	let val = res[i]["val"];
			// }
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

GlobalDatasetExec = new GlobalDatasetExec();
module.exports = {
	GlobalDatasetExec,
};