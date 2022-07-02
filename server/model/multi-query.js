const DB = require('./DB.js');

class MultiExec {
	query(param, extra) {
		let entity = (!param.entity) ? "1=1" : ` entity = '${param.entity}' `;
		let entity_id = (!param.entity_id) ? "1=1" : ` entity_id = ${param.entity_id} `;
		let val = (!param.val) ? "1=1" : ` val = '${param.val}' `;
		let key_input = (!param.table_name) ? "1=1" : ` key_input = '${param.table_name}' `;
		var limit = DB.prepareLimit(param.page, param.offset);

		// let sql = `
		// 	select * from multi_${table_name} where 1=1
		// 	and ${entity} and ${entity_id} and ${val}
		// 	${limit}
		// `;

		let selectField = extra.selectField ? extra.selectField.join(",") : "*";
		
		let sql = `
			select ${selectField} from multi_input where 1=1
			and ${entity} and ${entity_id} and ${val} and ${key_input}
			${limit}
		`;
		return sql;
	}
	isSingle(type) {
		return type == "single";
	}
	getHelper(type, param, field, extra = {}) {
		var sql = this.query(param, extra);

		//// console.log("[MultiExec]", sql);
		var toRet = DB.query(sql).then((res) => {

			// for (var i in res) {
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

MultiExec = new MultiExec();
module.exports = {
	MultiExec
};