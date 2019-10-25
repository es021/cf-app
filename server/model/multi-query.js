const DB = require('./DB.js');

class MultiExec {
	query(param) {

		let table_name = param.table_name;
		let entity = (!param.entity) ? "1=1" : ` entity = '${param.entity}' `;
		let entity_id = (!param.entity_id) ? "1=1" : ` entity_id = ${param.entity_id} `;
		let val = (!param.val) ? "1=1" : ` val = '${param.val}' `;
		var limit = DB.prepareLimit(param.page, param.offset);

		let sql = `
			select * from multi_${table_name} where 1=1
			and ${entity} and ${entity_id} and ${val}
			${limit}
		`;
		return sql;
	}
	isSingle(type) {
		return type == "single";
	}
	getHelper(type, param, field, extra = {}) {
		var sql = this.query(param, extra);
		
		//console.log("[MultiExec]", sql);
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