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
	select(table_type, key, val) {
		if (typeof val === "undefined" || val == "" || val == null) {
			return "1=1";
		} else {

			switch (table_type) {
				case this.TABLE_SINGLE:


				case this.TABLE_MULTI:
					return `(${UserQuery.selectMultiMain(key, "u.ID", {
            inWhere: this.getSqlIn(val),
            isCountVal : true
          })}) > 0`;
			}
		}
	}
	selectDateRange({
		month_key,
		year_key,
		from,
		to
	}) {
		let dateFormat = "%d%M%Y";
		let month = `${UserQuery.selectSingleMain("u.ID", month_key)}`;
		let year = `${UserQuery.selectSingleMain("u.ID", year_key)}`;

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
	// TODO
	query(param, type) {
		let select = "";
		let order = "";
		let group = "";
		if (this.isCount(type)) {
			select = `COUNT (DISTINCT u.ID) as total`;
		} else if (this.isFilter(type)) {
			/**
       * 
    
       /// single
      
     SELECT s.key_input, s.val, COUNT(*) as total 
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
      group by s.key_input, s.val
      order by s.key_input, total desc

      */
			// select = `COUNT (DISTINCT u.ID) as total`;
		} else {
			group = "GROUP BY u.ID";
			select = `DISTINCT u.ID as student_id`;
			order = "ORDER BY u.user_registered desc";
		}
		var limit = DB.prepareLimit(param.page, param.offset);


		// select item
		let cf = CFQuery.getCfInList("u.ID", "user", param.cf, this.DELIMITER);
		let country_study = this.select(this.TABLE_SINGLE, "country_study", param.country_study);
		let university = this.select(this.TABLE_SINGLE, "university", param.university);
		let field_study = this.select(this.TABLE_MULTI, "field_study", param.field_study);
		let looking_for_position = this.select(this.TABLE_MULTI, "looking_for_position", param.looking_for_position);
		let interested_job_location = this.select(this.TABLE_MULTI, "interested_job_location", param.interested_job_location);
		let skill = this.select(this.TABLE_MULTI, "skill", param.skill);

		var favourited = UserQuery.getSearchInterested(
			param.company_id,
			"student_listing",
			"u.ID",
			param.favourited_only
		);

		let work_availability = this.selectDateRange({
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

		var sql = `
      SELECT ${select}
      FROM wp_cf_users u
      WHERE 1=1 
      AND ${favourited}
      AND ${cf}
      AND ${country_study}
      AND ${university}
      AND ${field_study}
      AND ${looking_for_position}
      AND ${interested_job_location}
      AND ${skill}
      AND ${work_availability}
      AND ${graduation}
      ${group}
      ${order}
      ${limit} `;

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