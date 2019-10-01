const DB = require('./DB.js');

class MultiExec {
	querySingle(param) {
		return "";
	}
	queryList(param) {

		let table_name = param.table_name;
		let entity = (!param.entity) ? "1=1" : ` entity = '${param.entity}' `;
		let entity_id = (!param.entity_id) ? "1=1" : ` entity_id = ${param.entity_id} `;
		var limit = DB.prepareLimit(param.page, param.offset);

		let sql = `
			select * from multi_${table_name} where 1=1
			and ${entity} and ${entity_id} 
			${limit}
		`;
		return sql;
	}
	isSingle(type) {
		return type == "single";
	}
	getHelper(type, param, field, extra = {}) {
		var sql = this.isSingle(type) ? this.querySingle(param, extra) : this.queryList(param, extra);
		console.log("[MultiExec]", sql);
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

MultiExec = new MultiExec();
module.exports = {
	MultiExec
};