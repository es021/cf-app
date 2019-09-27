const DB = require('./DB.js');

class InterestedExec {
	querySingle(param) {
		let user_id = `user_id = '${param.user_id}'`;
		let entity = `entity = '${param.entity}'`;
		let entity_id = `entity_id = ${param.entity_id}`;

		var sql = `select * from interested
		where 1=1 and ${user_id} and ${entity} and ${entity_id}`;
		return sql;
	}
	// queryList(param) {
	// 	var limit = DB.prepareLimit(param.page, param.offset);
	// }
	isSingle(type) {
		return type == "single";
	}
	getHelper(type, param, field, extra = {}) {
		// var sql = this.isSingle(type) ? this.querySingle(param, extra) : this.queryList(param, extra);
		var sql = this.querySingle(param, extra);
		console.log("[InterestedExec]", sql);
		var toRet = DB.query(sql).then((res) => {

			console.log("res", res);
			if (res.length <= 0) {
				return {
					is_interested: 0
				}
			} else {
				return res[0];
			}
			// for (var i in res) {}
			// if (this.isSingle(type)) {

			// 	return res[0];
			// } else {
			// 	return res;
			// }
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

InterestedExec = new InterestedExec();
module.exports = {
	InterestedExec
};