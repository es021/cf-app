const DB = require("./DB.js");

class GlobalDatasetItemExec {
	query(param) {
		param = DB.sanitize(param);

		let ID = !param.ID ? "1=1" : ` ID = ${param.ID}`;
		let source = !param.source ? "1=1" : ` source = '${param.source}' `;
		let val = !param.val ? "1=1" : ` val like '%${param.val}%' `;
		let order_by = !param.order_by ? "" : `ORDER BY ${param.order_by}`;
		var limit = DB.prepareLimit(param.page, param.offset);

		console.log("source", source)
		console.log("order_by", order_by)
		let sql = `
			select * from global_dataset_item where 1=1
			and ${ID} and ${val} and ${source}
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

GlobalDatasetItemExec = new GlobalDatasetItemExec();
module.exports = {
	GlobalDatasetItemExec,
};