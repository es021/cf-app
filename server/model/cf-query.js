const DB = require("./DB.js");
const {
	CFS,
	CFSMeta,
	User
} = require("../../config/db-config");
const {
	UserQuery
} = require("./user-query.js");
class CFQuery {
	// getCfDiscardCountryInList(field, entity, cf, delim) {
	// 	const templateHandler = (_field, _entity, _cf) => {
	// 		return `"1" = (SELECT * from cfs_meta m where m.cf_name = "${_cf}" and m.meta_key = "is_local")`;
	// 	}
	// 	return this.getCfInList(field, entity, cf, delim, templateHandler);
	// }
	// getCfArr(cf, delim = ", ") {
	// 	let cfArr = null;
	// 	//let cfArr = cf;

	// 	if (!Array.isArray(cf)) {
	// 		if (cf.indexOf(delim) >= 0) {
	// 			let splited = cf.split(delim);
	// 			cfArr = [];
	// 			for (var i in splited) {
	// 				if (splited[i] != "") {
	// 					cfArr.push(splited[i]);
	// 				}
	// 			}
	// 		}
	// 	} else {
	// 		cfArr = cf;
	// 	}

	// 	return cfArr
	// }
	getCfInList(field, entity, cf, delim = ",") {
		if (typeof cf === "undefined") {
			return "1=1";
		}

		// user or company
		if (typeof entity === "undefined") {
			return "1=1";
		}

		let cfArr = null;
		//let cfArr = cf;

		if (!Array.isArray(cf)) {
			if (cf.indexOf(delim) >= 0) {
				let splited = cf.split(delim);
				cfArr = [];
				for (var i in splited) {
					if (splited[i] != "") {
						cfArr.push(splited[i]);
					}
				}
			}
		} else {
			cfArr = cf;
		}
		//let cfArr = this.getCfArr(cf, delim);

		const template = (_field, _entity, _cf) => {
			return `'${_cf}' IN (select ms.cf from cf_map ms 
                where ms.entity = '${_entity}'
                and ms.entity_id = ${_field})`;
		};

		if (cfArr != null && Array.isArray(cfArr)) {
			let toRet = "";
			for (var i in cfArr) {


				if (i > 0) {
					toRet += " OR ";
				}
				toRet += template(field, entity, cfArr[i]);
			}
			return `( ${toRet} )`;
		} else {
			return template(field, entity, cf);
		}
	}
	getCF(params, field) {
		var order_by = `ORDER BY ${typeof params.order_by === "undefined" ? "cf_order desc" : params.order_by}`;

		var is_active =
			typeof params.is_active === "undefined" ?
				"1=1" :
				`is_active = '${params.is_active}'`;

		var is_load =
			typeof params.is_load === "undefined" ?
				"1=1" :
				`is_load = '${params.is_load}'`;

		var name =
			typeof params.name === "undefined" ?
				"1=1" :
				`name = '${params.name}'`;

		var limit = DB.prepareLimit(params.page, params.offset);


		let selMeta = "";
		for (var i in CFSMeta) {
			let col = CFSMeta[i];

			if (typeof field[col] !== "undefined") {
				selMeta += ` , (SELECT m.meta_value FROM ${CFSMeta.TABLE} m WHERE m.cf_name = c.name AND m.meta_key = '${col}') as ${col} `;
			}
		}

		let selTotalStudent = "";
		if (typeof field["total_student"] !== "undefined") {
			selTotalStudent = ` , (SELECT COUNT(cm.entity_id) 
			FROM cf_map cm 
			WHERE 1=1
			AND cm.entity = "user" 
			AND cm.cf = "${params.name}"
			AND (${UserQuery.selectUserField("cm.entity_id", User.EMAIL)}) NOT LIKE 'test.%') as total_student `;
		}

		return `select c.* ${selMeta} ${selTotalStudent} from ${CFS.TABLE} c
            where 1=1 AND ${is_active} AND ${is_load} AND ${name}
            ${order_by} ${limit}`;

		// var id_where = (typeof params.ID === "undefined") ? "1=1" : `ID = "${params.ID}"`;
		// var can_login_where = (typeof params.can_login === "undefined") ? "1=1" : `can_login = '${params.can_login}'`;
		// var can_register_where = (typeof params.can_register === "undefined") ? "1=1" : `can_register = '${params.can_register}'`;

		// return `select * from ${CFS.TABLE} where ${id_where} and ${can_login_where} and ${can_register_where} ${order_by}`;
	}
}

CFQuery = new CFQuery();

class CFExec {
	cfs(params, field, extra = {}) {
		var sql = CFQuery.getCF(params, field);
		// console.log("CFExec", sql);
		var toRet = DB.query(sql).then(function (res) {
			if (extra.single && res !== null) {
				return res[0];
			} else {
				return res;
			}
		});
		return toRet;
	}
	updateCfMeta(name, data) {
		var meta_key_in = "";
		var meta_pair_case = "";

		//to check not exist user meta
		var meta_key = [];

		for (var k in data) {
			meta_key.push(k);
			meta_key_in += `'${k}',`;
			meta_pair_case += ` WHEN '${k}' THEN '${DB.escStr(data[k])}' `;
		}

		var where = `WHERE meta_key IN (${meta_key_in.slice(
			0,
			-1
		)}) and cf_name = '${name}'`;

		var check_sql = `SELECT * FROM cfs_meta ${where}`;

		var update_sql = `UPDATE cfs_meta
            SET meta_value = CASE meta_key 
            ${meta_pair_case} 
            END ${where}`;

		//check what does not exist
		return DB.query(check_sql).then(res => {
			var key_check = res.map((d, i) => d["meta_key"]);

			//insert what does not exist
			var insert_val = "";
			meta_key.map((d, i) => {
				if (key_check.indexOf(d) <= -1) {
					insert_val += `('${name}','${d}','${DB.escStr(data[d])}'),`;
				}
			});

			if (insert_val !== "") {
				var insert_sql = ` INSERT INTO cfs_meta (cf_name, meta_key, meta_value) VALUES ${insert_val.slice(0, -1)} `;
				return DB.query(insert_sql).then(res => {
					//only then update what's left
					return DB.query(update_sql);
				});
			}
			// if not need to insert just update
			else {
				return DB.query(update_sql);
			}
		});
	}
	commonCf({ entity1, id1, entity2, id2, queryOnly }) {
		let q = `select X.cf FROM
			(SELECT cf FROM cf_map WHERE entity_id = ${id1} and entity = "${entity1}") X,
			(SELECT cf FROM cf_map WHERE entity_id = ${id2} and entity = "${entity2}") Y
			WHERE X.cf = Y.cf`;

		if (queryOnly) {
			return q;
		}
		return DB.query(q).then(function (res) {
			let toRet = [];
			for (var r of res) {
				toRet.push(r.cf);
			}

			return toRet;
		});
	}
	editCf(arg) {
		// console.log("arg", arg);
		var name = arg.name;

		//update User table
		var updateCf = {};
		var updateCfMeta = {};
		//// console.log(arg);

		var userVal = Object.keys(CFS).map(function (key) {
			return CFS[key];
		});

		var userMetaVal = Object.keys(CFSMeta).map(function (key) {
			return CFSMeta[key];
		});
		let hasUpdateMain = false;
		let hasUpdateMeta = false;
		for (var k in arg) {
			var v = arg[k];
			if (userVal.indexOf(k) >= 0 && k != "name") {
				hasUpdateMain = true;
				updateCf[k] = v;
			}
			if (userMetaVal.indexOf(k) >= 0) {
				hasUpdateMeta = true;
				updateCfMeta[k] = v;
			}
		}

		console.log("updateCf", updateCf)
		console.log("updateCfMeta", updateCfMeta)
		let idKey = "name";
		if (!hasUpdateMain && hasUpdateMeta) {
			return this.updateCfMeta(name, updateCfMeta);
		}

		return DB.update(CFS.TABLE, { name: name, ...updateCf }, idKey).then(res => {
			if (hasUpdateMeta) {
				return this.updateCfMeta(name, updateCfMeta);
			} else {
				return res;
			}
		});
	}
}

CFExec = new CFExec();

module.exports = {
	CFQuery,
	CFExec
};