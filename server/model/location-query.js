const DB = require('./DB.js');

class LocationExec {
	querySingle(param) {

        let city = (!param.ref_city) ? "" : param.ref_city;
        let state = (!param.ref_state) ? "" : param.ref_state;
        let country = (!param.ref_country) ? "" : param.ref_country;

        var sql = `select 
        "${city}" as ref_city,
        "${state}" as ref_state,
        "${country}" as ref_country,
        (select x.label from ref_city x where x.code = '${city}') as city, 
        (select x.label from ref_state x where x.code = '${state}') as state, 
        (select x.label from ref_country x where x.code = '${country}') as country
        from dual`;
		return sql;
	}
	queryList(param) {
		var limit = DB.prepareLimit(param.page, param.offset);
	}
	isSingle(type) {
		return type == "single";
	}
	getHelper(type, param, field, extra = {}) {
		var sql = this.isSingle(type) ? this.querySingle(param, extra) : this.queryList(param, extra);
		console.log("[LocationExec]", sql);
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

LocationExec = new LocationExec();
module.exports = {
	LocationExec
};