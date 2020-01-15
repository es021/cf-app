const DB = require("./DB.js");
const {
	UserQuery
} = require("./user-query");
const {
	CFQuery
} = require("./cf-query");

// all-type
// mutation
// root

/**

query{
  browse_student(
    working_availability_year_to:"2034",
    company_id : 12,
    favourited_only :"1",
    page :1,
    offset :10,
      interested_job_location : "Cyberjaya, Selangor::Drawing",
    skill : "Coding::Drawing",
    cf:"NZL::UK"
  ) {
    student_id
    student {
    interested_job_location {val}
      skill {
        val
      }
      working_availability_year
      working_availability_month
      user_email
			first_name 
      last_name
      cf
    }
  } 
}

 */

class BrowseStudentExec {
	constructor() {
		this.TABLE_SINGLE = "TABLE_SINGLE";
		this.TABLE_MULTI = "TABLE_MULTI";
		this.DELIMITER = "::";
	}

	/**
	 * 
	 * in   =    aaa:bbb:ccc
	 * out  =   ('aaa','bbb','ccc')
	 */
	getSqlIn(val) {
		let arr = val.split(this.DELIMITER);

		let r = "";
		for (var i in arr) {
			if (arr[i] != "") {
				r += `'${arr[i]}'`;
				r += ",";
			}
		}

		// remove the last comma
		r = r.substr(0, r.length - 1);


		return `(${r})`;
	}
	select(user_id, table_type, key, val) {
		if (typeof val === "undefined" || val == "" || val == null) {
			return "1=1";
		} else {

			switch (table_type) {
				case this.TABLE_SINGLE:
					// TODO_kena_amik_selectMultiMain_masuk_kat_sini
					break;
				case this.TABLE_MULTI:
					return `(${UserQuery.selectMultiMain(key, user_id, {
						inWhere: this.getSqlIn(val),
						isCountVal : true
					})}) > 0`;
			}
		}
	}
	selectDateRange({
		user_id,
		month_key,
		year_key,
		from,
		to
	}) {
		let dateFormat = "%d%M%Y";
		let month = `${UserQuery.selectSingleMain(user_id, month_key)}`;
		let year = `${UserQuery.selectSingleMain(user_id, year_key)}`;

		let from_sql = "1=1";
		if (from.year) {
			from.month = from.month ? from.month : "January";
			from_sql = `STR_TO_DATE('1${from.month}${from.year}', '${dateFormat}')`;
			from_sql = `STR_TO_DATE(CONCAT('1',(${month}),(${year})),'${dateFormat}') >= ${from_sql}`
		}

		let to_sql = "1=1";
		if (to.year) {
			to.month = to.month ? to.month : "December";
			to_sql = `STR_TO_DATE('1${to.month}${to.year}', '${dateFormat}')`;
			to_sql = `STR_TO_DATE(CONCAT('1',(${month}),(${year})),'${dateFormat}') <= ${to_sql}`
		}

		return `(${from_sql} AND ${to_sql})`;
	}
	queryFilter(param) {
		const multiFilter = (key, where) => {
			return `select '${key}' as _key, s.val as _val, COUNT(s.ID) as _total 
				from multi_${key} s
				WHERE s.entity = 'user'
				AND ${where}
				GROUP BY s.val`
		}

		const singleFilter = (where) => {
			return `SELECT s.key_input as _key
			, s.val as _val
			, COUNT(*) as _total 
			FROM single_input s
			where 
			( 
				s.key_input = "university"
					AND
				s.val IN (select r.val from ref_university r)
			) 
			OR 
			( 
				s.key_input = "country_study"
					AND
				s.val IN (select r.val from ref_country r)
			) 
			AND s.entity = 'user'
			AND ${where}
			group by s.key_input, s.val`;

		}

		let where = this.getWhere("s.entity_id", param);

		let q = `SELECT * FROM (
			${singleFilter(where)}
			UNION ALL
			${multiFilter("skill", where)}
			UNION ALL
			${multiFilter("field_study", where)}
			UNION ALL
			${multiFilter("looking_for_position", where)}
			UNION ALL
			${multiFilter("interested_job_location", where)}
		) 
		X ORDER BY X._key, X._total`;

		return q;

	}
	getWhere(user_id, param) {
		// select item
		let cf = CFQuery.getCfInList(user_id, "user", param.cf, this.DELIMITER);
		let country_study = this.select(user_id, this.TABLE_SINGLE, "country_study", param.country_study);
		let university = this.select(user_id, this.TABLE_SINGLE, "university", param.university);
		let field_study = this.select(user_id, this.TABLE_MULTI, "field_study", param.field_study);
		let looking_for_position = this.select(user_id, this.TABLE_MULTI, "looking_for_position", param.looking_for_position);
		let interested_job_location = this.select(user_id, this.TABLE_MULTI, "interested_job_location", param.interested_job_location);
		let skill = this.select(user_id, this.TABLE_MULTI, "skill", param.skill);

		var favourited = UserQuery.getSearchInterested(
			param.company_id,
			"student_listing",
			user_id,
			param.favourited_only
		);

		let work_availability = this.selectDateRange({
			user_id: user_id,
			month_key: "working_availability_month",
			year_key: "working_availability_year",
			from: {
				month: null,
				year: null
			},
			to: {
				month: param.working_availability_month_to,
				year: param.working_availability_year_to
			}
		});

		let graduation = this.selectDateRange({
			user_id: user_id,
			month_key: "graduation_month",
			year_key: "graduation_year",
			from: {
				month: param.graduation_month_from,
				year: param.graduation_year_from
			},
			to: {
				month: param.graduation_month_to,
				year: param.graduation_year_to
			}
		});

		return `1=1 
			AND ${favourited}
			AND ${cf}
			AND ${country_study}
			AND ${university}
			AND ${field_study}
			AND ${looking_for_position}
			AND ${interested_job_location}
			AND ${skill}
			AND ${work_availability}
			AND ${graduation}`;
	}
	// TODO
	query(param, type) {
		let select = "";
		let order = "";
		let group = "";
		if (this.isFilter(type)) {
			return this.queryFilter(param);

		} else if (this.isCount(type)) {
			select = `COUNT (DISTINCT u.ID) as total`;

		} else {
			group = "GROUP BY u.ID";
			select = `DISTINCT u.ID as student_id`;
			order = "ORDER BY u.user_registered desc";
		}
		var limit = DB.prepareLimit(param.page, param.offset);

		let where = this.getWhere("u.ID", param);

		var sql = `SELECT ${select} FROM wp_cf_users u
			WHERE ${where}
			${group}
			${order}
			${limit}`;

		console.log(sql);
		return sql;
	}
	// TODO
	resCount(res) {
		return res[0]["total"];
	}
	resFilter(res) {
		return res;
	}
	// TODO
	resList(res, field, param) {
		const {
			UserExec
		} = require("./user-query.js");

		for (var i in res) {
			var student_id = res[i]["student_id"];
			if (typeof field["student"] !== "undefined") {
				res[i]["student"] = UserExec.user({
						ID: student_id,
						company_id: param.company_id
					},
					field["student"]
				);
			}
		}
		return res;
	}
	isFilter(type) {
		return type == "filter";
	}
	isList(type) {
		return type == "list";
	}
	isCount(type) {
		return type == "count";
	}
	getHelper(type, param, field, extra = {}) {
		var sql = this.query(param, type);
		console.log("[BrowseStudentExec]", sql)
		var toRet = DB.query(sql).then(res => {
			if (this.isList(type)) {
				return this.resList(res, field, param);
			} else if (this.isCount(type)) {
				return this.resCount(res);
			} else if (this.isFilter(type)) {
				return this.resFilter(res);
			}
		});
		return toRet;
	}
	filter(param, field, extra = {}) {
		return this.getHelper("filter", param, field, extra);
	}
	list(param, field, extra = {}) {
		return this.getHelper("list", param, field, extra);
	}
	count(param, field, extra = {}) {
		return this.getHelper("count", param, field, extra);
	}
}

BrowseStudentExec = new BrowseStudentExec();
module.exports = {
	BrowseStudentExec
};