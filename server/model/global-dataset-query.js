const DB = require("./DB.js");
const { generateId, makeSnakeCase } = require("../../helper/general-helper");
class GlobalDatasetExec {
	generateSourceFromName(name, cf) {
		let s = `${makeSnakeCase(name)}_${cf}_${generateId(6)}`;
		s = s.toLowerCase();
		return s
	}
	query(param) {
		param = DB.sanitize(param);

		let ID = !param.ID ? "1=1" : ` ID = '${param.ID}' `;
		let cf = !param.cf ? "1=1" : ` cf = '${param.cf}' `;
		let search = !param.search ? "1=1" : ` (name like '%${param.search}%' or cf like '%${param.search}%') `;
		var limit = DB.prepareLimit(param.page, param.offset);

		let sql = `
			select * from global_dataset where 1=1
			and ${ID} and ${cf} and ${search}
			ORDER BY created_at DESC
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