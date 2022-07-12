const DB = require("./DB.js");
const {
	UserQuery
} = require("./user-query");
const {
	CFQuery
} = require("./cf-query");
const { isCustomUserInfoOff, Single } = require("../../config/registration-config");
const { UserMeta, IsSeenEnum } = require("../../config/db-config.js");
const { overrideLanguageTable } = require("./ref-query.js");
const { cfCustomFunnel } = require("../../config/cf-custom-config.js");
const { fetchFilter } = require("./browse-student-query-helper");
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

		let params = [];

		let r = "";
		for (var i in arr) {
			if (arr[i] != "") {
				params.push(arr[i]);
				r += `?`;
				r += ",";
			}
		}
		
		// remove the last comma
		r = r.substr(0, r.length - 1);
		
		r = `(${r})`;

		r = DB.prepare(r, params);
		
		return r;
	}
	where(user_id, table_type, key, val) {
		// todo
		if (typeof val === "undefined" || val == "" || val == null) {
			return "1=1";
		} else {
			let inWhere = this.getSqlIn(val);
			let subQ = "";
			switch (table_type) {
				case this.TABLE_SINGLE:
					if (key == "name") {
						
						subQ = `select COUNT(s.ID) 
						FROM single_input s, wp_cf_users uu
						where 1=1
						AND s.entity_id = uu.ID
						AND 
						(
							(s.key_input = "first_name" AND s.val LIKE "%${val}%")
							OR
							(s.key_input = "last_name" AND s.val LIKE "%${val}%")
							OR
							(uu.user_email LIKE "%${val}%")
						)
						AND s.entity_id = ${user_id} 
						AND s.entity = 'user'`;

					} else {
						subQ = `select COUNT(s.ID) 
						FROM single_input s
						where 1=1
						AND s.key_input = "${key}"
						AND s.val IN ${inWhere}
						AND s.entity_id = ${user_id} 
						AND s.entity = 'user'`;
					}

					break;
				case this.TABLE_MULTI:
					subQ = `select COUNT(m.val) from multi_${key} m 
						where 1=1
						and m.val IN ${inWhere}
						and m.entity_id = ${user_id} 
						and m.entity = 'user'`;
					break;
			}
			return `(${subQ}) > 0`;
		}
	}
	whereDateRange({
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
	// isDiscardFilter(param, filter) {
	// 	let toRet = false;
	// 	try {
	// 		if (param.discard_filter.indexOf(`::${filter}::`) >= 0) {
	// 			toRet = true;
	// 		}
	// 	} catch (err) { }

	// 	// // console.log("isDiscardFilter", filter, toRet);
	// 	return toRet;
	// }
	/** 
	queryFilter(param) {
		const currentCf = param.current_cf;

		const EMPTY_FILTER = `select 
		'' as _key 
		, '' as _val
		, '' as _val_label
		, '' as _total 
		from dual`;

		const cfFilter = (where) => {
			return `
				select
				"cf" as _key,
				c.name as _val,
				(select m.meta_value from cfs_meta m where m.cf_name = c.name and m.meta_key = "title") as _val_label,
				COUNT(s.entity) as _total
				from cf_map s, cfs c
				where  1=1
				and s.cf = c.name and s.entity = 'user'
				and c.is_load = 1
				and c.name != "TEST"
				and ${where}
				GROUP BY s.cf
			`
		}

		const multiFilter = (key, where) => {
			if (this.isDiscardFilter(param, key)) {
				return EMPTY_FILTER;
			}

			let additional_where = "1=1";
			if (key == "looking_for_position") {
				// additional_where = " s.val not like '%part%' ";
				// additional_where = " s.val IN (select vv.val FROM ref_looking_for_position vv) ";
				additional_where = " (s.val = 'Full-Time' OR s.val = 'Internship') ";
			}

			return `select 
				'${key}' as _key 
				, s.val as _val
				, "" as _val_label
				, COUNT(s.ID) as _total 
				from multi_${key} s
				WHERE s.entity = 'user'
				AND ${where}
				AND ${additional_where}
				GROUP BY s.val`
		}

		const singleFilterWhereInMalaysia = (where) => {
			if (this.isDiscardFilter(param, "where_in_malaysia")) {
				return EMPTY_FILTER;
			}

			// (CASE WHEN r.city IS NOT NULL THEN concat(r.state, " - ", r.city)

			return `SELECT 
				s.key_input as _key
				, r.val as _val
				, r.state as _val_label
				, COUNT(*) as _total 
				FROM single_input s, ref_city_state_country r
				where 
				1=1
				AND s.key_input = "where_in_malaysia"
				AND s.val = r.val
				AND s.entity = 'user'
				AND r.city IS NULL
				AND r.state IS NOT NULL
				AND ${where}
				group by s.key_input, s.val`;
		}

		const singleFilter = (where) => {
			let university = isCustomUserInfoOff(currentCf, Single.university) ||
				this.isDiscardFilter(param, "university")
				? "1=0"
				: `( 
					s.key_input = "university"
						AND
					s.val IN (select r.val from ref_university r)
				) `

			let country_study = isCustomUserInfoOff(currentCf, Single.country_study)
				|| this.isDiscardFilter(param, "country_study")
				? "1=0"
				: `( 
					s.key_input = "country_study"
						AND
					s.val IN (select r.val from ref_country r)
				)  `

			// 4b. @custom_user_info_by_cf -- filter single
			let unisza_faculty = isCustomUserInfoOff(currentCf, Single.unisza_faculty)
				? "1=0"
				: `( 
					s.key_input = "unisza_faculty"
						AND
					s.val IN (select r.val from ref_unisza_faculty r)
				)`
			let unisza_course = isCustomUserInfoOff(currentCf, Single.unisza_course)
				? "1=0"
				: `( 
						s.key_input = "unisza_course"
							AND
						s.val IN (select r.val from ref_unisza_course r)
					)`
			let current_semester = isCustomUserInfoOff(currentCf, Single.current_semester)
				? "1=0"
				: `( 
						s.key_input = "current_semester"
					)`
			let course_status = isCustomUserInfoOff(currentCf, Single.course_status)
				? "1=0"
				: `( 
						s.key_input = "course_status"
					)`
			let employment_status = isCustomUserInfoOff(currentCf, Single.employment_status)
				? "1=0"
				: `( 
						s.key_input = "employment_status"
					)`

			let field_study_main = isCustomUserInfoOff(currentCf, Single.field_study_main)
				? "1=0"
				: `( 
						s.key_input = "field_study_main"
							AND
						s.val IN (select r.val from ref_field_study r)
					)`

			let field_study_secondary = isCustomUserInfoOff(currentCf, Single.field_study_secondary)
				? "1=0"
				: `( 
					s.key_input = "field_study_secondary"
						AND
					s.val IN (select r.val from ref_field_study r)
				)`

			let work_experience_year = isCustomUserInfoOff(currentCf, Single.work_experience_year)
				? "1=0"
				: `( 
						s.key_input = "work_experience_year"
							AND
						s.val IN (select r.val from ref_work_experience_year r)
					)`

			let gender = isCustomUserInfoOff(currentCf, Single.gender)
				? "1=0"
				: `( 
						s.key_input = "gender"
							AND
						s.val IN (select r.val from ref_gender r)
					)`

			let unemployment_period = isCustomUserInfoOff(currentCf, Single.unemployment_period)
				? "1=0"
				: `( 
						s.key_input = "unemployment_period"
							AND
						s.val IN (select r.val from ref_unemployment_period r)
					)`

			let local_or_oversea_study = isCustomUserInfoOff(currentCf, Single.local_or_oversea_study)
				? "1=0"
				: `( 
					s.key_input = "local_or_oversea_study"
					AND
					s.val IN (select r.val from ref_local_or_oversea r)
				)`

			let local_or_oversea_location = isCustomUserInfoOff(currentCf, Single.local_or_oversea_location)
				? "1=0"
				: `( 
					s.key_input = "local_or_oversea_location"
					AND
					s.val IN (select r.val from ref_local_or_oversea r)
				)`

			let monash_school = isCustomUserInfoOff(currentCf, Single.monash_school)
				? "1=0"
				: `( 
					s.key_input = "monash_school"
						AND
					s.val IN (select r.val from ref_monash_school r)
				)`

			let sunway_faculty = isCustomUserInfoOff(currentCf, Single.sunway_faculty)
				? "1=0"
				: `( 
					s.key_input = "sunway_faculty"
						AND
					s.val IN (select r.val from ref_sunway_faculty r)
				)`

			let sunway_program = isCustomUserInfoOff(currentCf, Single.sunway_program)
				? "1=0"
				: `( 
					s.key_input = "sunway_program"
						AND
					s.val IN (select r.val from ref_sunway_program r)
				)`

			let customKey = cfCustomFunnel({ action: "get_keys_single" })
			let custom_single_filter = "";
			for (let k of customKey) {
				let ref = cfCustomFunnel({ key: k, action: "get_ref_table_by_key" })
				if (!isCustomUserInfoOff(currentCf, k)) {
					custom_single_filter += `( 
						s.key_input = "${k}"
						${ref ? `AND s.val IN (select r.val from ref_${ref} r)` : ''}	
					) OR `
				}
			}

			// (CASE WHEN s.key_input = 'field_study_secondary' THEN 'field_study_main' ELSE s.key_input END) as _key
			let toRet = `SELECT 
			s.key_input as _key
			, s.val as _val
			, "" as _val_label
			, COUNT(*) as _total 
			FROM single_input s
			where 
			(
				${custom_single_filter}
				${unisza_faculty}
				OR
				${unisza_course}
				OR
				${current_semester}
				OR
				${course_status}
				OR
				${employment_status}
				OR
				${field_study_secondary}
				OR
				${field_study_main}
				OR
				${gender} 
				OR 
				${work_experience_year} 
				OR 
				${university} 
				OR 
				${country_study}
				OR 
				${unemployment_period}
				OR
				${local_or_oversea_study}
				OR
				${local_or_oversea_location}
				OR
				${monash_school}
				OR
				${sunway_faculty}
				OR
				${sunway_program}
			)
			AND s.entity = 'user'
			AND ${where}
			group by _key, _val`;

			//group by s.key_input, s.val`;

			console.log("++++++++++++++++++++++++++++++++++++++++++++++");
			console.log(toRet)
			console.log("++++++++++++++++++++++++++++++++++++++++++++++");
			return toRet;


		}

		let where = this.getWhere("s.entity_id", param);

		// UNION ALL
		// 	${multiFilter("interested_job_location", where)}
		// 4a. @custom_user_info_by_cf -- filter multi
		let q = `SELECT * FROM (
			${cfFilter(where)}
			UNION ALL
			${singleFilter(where)}
			UNION ALL
			${singleFilterWhereInMalaysia(where)}
			UNION ALL
			${multiFilter("skill", where)}
			UNION ALL
			${multiFilter("looking_for_position", where)}
		) 
		X ORDER BY X._key, X._val_label asc, X._val asc, X._total desc`;

		// UNION ALL
		// ${multiFilter("field_study", where)
		// @limit_field_of_study_2_before_deploy - comment }
		q = overrideLanguageTable(q, param);
		return q;
	}
	*/
	whereDropResume(company_id, user_id, param) {
		if (param === "1") {
			let q = ` (select COUNT(rd.ID) FROM resume_drops rd 
			where rd.company_id = ${company_id} AND rd.student_id = ${user_id} ) > 0 `;
			return q;
		}

		return "1=1";
	}
	whereHasDropResumeWithCompany(cf, user_id, company_id) {
		if (cf && user_id && company_id) {
			let q = ` CASE WHEN 
			(
				SELECT cmm.meta_value 
				FROM cfs_meta cmm 
				WHERE cmm.cf_name = "${cf}" 
					AND cmm.meta_key = "feature_student_list_resume_drop_only"
			) = "ON"
			THEN 
				( 
					select COUNT(rd.ID) FROM resume_drops rd 
					where rd.company_id = ${company_id} 
						AND rd.student_id = ${user_id} 
						AND rd.cf="${cf}"
				) > 0
			ELSE 1=1 END
			`;

			return q;
		}

		return "1=1";
	}
	whereHasIvWithCompany(cf, user_id, company_id) {
		if (cf && user_id && company_id) {
			let q = ` CASE WHEN 
			(
				SELECT cmm.meta_value 
				FROM cfs_meta cmm 
				WHERE cmm.cf_name = "${cf}" 
					AND cmm.meta_key = "feature_student_list_iv_only"
			) = "ON"
			THEN 
				( select COUNT(ps.ID) FROM pre_screens ps 
					where ps.student_id = ${user_id}  AND ps.company_id = ${company_id} 
				) > 0
			ELSE 1=1 END
			`;
			console.log("q", q);
			console.log("q", q);
			console.log("q", q);
			console.log("q", q);
			return q;
		}

		return "1=1";
	}
	whereHasNote(company_id, user_id, param) {
		if (param === "1") {
			let q = `${user_id} = 
				( select un.user_id FROM user_note un 
					WHERE un.company_id = ${company_id} 
					and un.user_id = ${user_id} AND un.note != '' 
					limit 0,1
				)`;
			return q;
		}

		return "1=1";
	}
	whereHasAttachment(user_id, param) {
		if (param === "1") {
			let q = `${user_id} = ( select dl.user_id FROM doc_link dl 
			where dl.user_id = ${user_id}  AND dl.type = 'document' limit 0,1 )`;
			return q;
		}

		return "1=1";
	}
	whereLikeJobPost(company_id, user_id, param) {
		let type = "job_post";
		return this.whereShowInterest(company_id, user_id, param, type);
	}
	whereShowInterest(company_id, user_id, param, type) {
		const interest = (entity, entity_id_where) => {
			let qIn = ` select i.is_interested from interested i 
			where i.entity = '${entity}' and i.entity_id IN (${entity_id_where}) and i.user_id = ${user_id}`;
			return ` 1 IN (${qIn}) `;
		}
		if (param === "1") {
			let r = "";
			if (type == "job_post") {
				// job post only
				r = interest("vacancies", `select v.ID from vacancies v where v.company_id = '${company_id}'`)
			} else {
				// ALL
				// job post, company and event
				r = interest("vacancies", `select v.ID from vacancies v where v.company_id = '${company_id}'`)
					+ " OR " + interest("companies", `'${company_id}'`)
					+ " OR " + interest("event", `select e.ID from events e where e.company_id = '${company_id}'`)
			}

			return `( ${r} )`;

		} else {
			return "1=1";
		}
	}
	getWhere(user_id, param) {
		// select item

		// @browse_student_only_showing_one_cf
		// let current_cf = "1=1";
		let current_cf = !param.current_cf ? "1=1" : CFQuery.getCfInList(user_id, "user", [param.current_cf]);
		let name = !param.name ? "1=1" : this.where(user_id, this.TABLE_SINGLE, "name", param.name);

		var role =
			!param.role ? `1=1` :
				`(${UserQuery.selectMetaMain("u.ID", UserMeta.ROLE)}) LIKE '%${param.role}%' `;

		// let cf_by_country_discard = CFQuery.getCfDiscardCountryInList(user_id, "user", param.cf, this.DELIMITER);

		let cf = CFQuery.getCfInList(user_id, "user", param.cf, this.DELIMITER);

		// 4c. @custom_user_info_by_cf - where single
		let country_study = this.where(user_id, this.TABLE_SINGLE, "country_study", param.country_study);
		let university = this.where(user_id, this.TABLE_SINGLE, "university", param.university);
		let where_in_malaysia = this.where(user_id, this.TABLE_SINGLE, "where_in_malaysia", param.where_in_malaysia);
		let work_experience_year = this.where(user_id, this.TABLE_SINGLE, "work_experience_year", param.work_experience_year);
		let gender = this.where(user_id, this.TABLE_SINGLE, "gender", param.gender);
		let unemployment_period = this.where(user_id, this.TABLE_SINGLE, "unemployment_period", param.unemployment_period);
		let local_or_oversea_study = this.where(user_id, this.TABLE_SINGLE, "local_or_oversea_study", param.local_or_oversea_study);
		let local_or_oversea_location = this.where(user_id, this.TABLE_SINGLE, "local_or_oversea_location", param.local_or_oversea_location);
		let monash_school = this.where(user_id, this.TABLE_SINGLE, "monash_school", param.monash_school);
		let sunway_faculty = this.where(user_id, this.TABLE_SINGLE, "sunway_faculty", param.sunway_faculty);
		let sunway_program = this.where(user_id, this.TABLE_SINGLE, "sunway_program", param.sunway_program);
		let field_study_main = this.where(user_id, this.TABLE_SINGLE, "field_study_main", param.field_study_main);
		let field_study_secondary = this.where(user_id, this.TABLE_SINGLE, "field_study_secondary", param.field_study_secondary);
		// let field_study_secondary = this.where(user_id, this.TABLE_SINGLE, "field_study_secondary", param.field_study_main);
		let id_unisza = this.where(user_id, this.TABLE_SINGLE, "id_unisza", param.id_unisza);
		let unisza_faculty = this.where(user_id, this.TABLE_SINGLE, "unisza_faculty", param.unisza_faculty);
		let unisza_course = this.where(user_id, this.TABLE_SINGLE, "unisza_course", param.unisza_course);
		let current_semester = this.where(user_id, this.TABLE_SINGLE, "current_semester", param.current_semester);
		let course_status = this.where(user_id, this.TABLE_SINGLE, "course_status", param.course_status);
		let employment_status = this.where(user_id, this.TABLE_SINGLE, "employment_status", param.employment_status);


		console.log("field_study_main", field_study_main);
		console.log("field_study_secondary", field_study_secondary);

		// 4d. @custom_user_info_by_cf - where multi
		// @limit_field_of_study_2_before_deploy - comment
		// let field_study = this.where(user_id, this.TABLE_MULTI, "field_study", param.field_study);

		let looking_for_position = this.where(user_id, this.TABLE_MULTI, "looking_for_position", param.looking_for_position);
		let interested_job_location = this.where(user_id, this.TABLE_MULTI, "interested_job_location", param.interested_job_location);
		let skill = this.where(user_id, this.TABLE_MULTI, "skill", param.skill);

		var favourited = UserQuery.getSearchInterested(
			param.company_id,
			"student_listing",
			user_id,
			param.favourited_only
		);

		console.log("param", param);

		// var favourited_recruiter_id = UserQuery.getSearchInterested(
		// 	param.company_id,
		// 	"student_listing",
		// 	user_id,
		// 	param.favourited_only_recruiter_id ? "1" : "0",
		// 	param.favourited_only_recruiter_id
		// );


		var show_interest = this.whereShowInterest(param.company_id, user_id, param.interested_only);
		var like_job_post = this.whereLikeJobPost(param.company_id, user_id, param.like_job_post_only);
		var drop_resume = this.whereDropResume(param.company_id, user_id, param.drop_resume_only);
		var has_attachment = this.whereHasAttachment(user_id, param.with_attachment_only);
		var with_note_only = this.whereHasNote(param.company_id, user_id, param.with_note_only);

		let valueCF = param.cf;
		if (!valueCF) {
			valueCF = param.current_cf
		}
		var has_iv_with_company = this.whereHasIvWithCompany(valueCF, user_id, param.company_id);
		var has_resume_drop_with_company = this.whereHasDropResumeWithCompany(valueCF, user_id, param.company_id);

		let work_availability = this.whereDateRange({
			user_id: user_id,
			month_key: "working_availability_month",
			year_key: "working_availability_year",
			from: {
				month: param.working_availability_month_from,
				year: param.working_availability_year_from
			},
			to: {
				month: param.working_availability_month_to,
				year: param.working_availability_year_to
			}
		});

		let graduation = this.whereDateRange({
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

		// AND ${field_study /** @limit_field_of_study_2_before_deploy - comment */}
		// 4e. @custom_user_info_by_cf -- where set
		let single_keys = cfCustomFunnel({ action: "get_keys_single" });
		let custom_single_where = "";
		for (let k of single_keys) {
			custom_single_where += " AND " + this.where(user_id, this.TABLE_SINGLE, k, param[k])
		}
		let multi_keys = cfCustomFunnel({ action: "get_keys_multi" });
		let custom_multi_where = "";
		for (let k of multi_keys) {
			custom_multi_where += " AND " + this.where(user_id, this.TABLE_MULTI, k, param[k])
		}


		// AND (${field_study_main} OR ${field_study_secondary})
		// AND ${favourited_recruiter_id}

		return `1=1
			${custom_single_where}
			${custom_multi_where}
			AND ${field_study_main}
			AND ${field_study_secondary}
			AND ${id_unisza}
			AND ${unisza_faculty}
			AND ${unisza_course}
			AND ${current_semester}
			AND ${course_status}
			AND ${employment_status}
			AND ${work_experience_year}
			AND ${gender}
			AND ${unemployment_period}
			AND ${local_or_oversea_study}
			AND ${local_or_oversea_location}
			AND ${monash_school}
			AND ${sunway_faculty}
			AND ${sunway_program}
			AND ${role}
			AND ${name}
			AND ${current_cf}
			AND ${like_job_post}
			AND ${drop_resume}
			AND ${has_attachment}
			AND ${with_note_only}
			AND ${has_iv_with_company}
			AND ${has_resume_drop_with_company}
			AND ${show_interest}
			AND ${favourited}
			AND ${cf}
			AND ${country_study}
			AND ${university}
			AND ${where_in_malaysia}
			AND ${looking_for_position}
			AND ${interested_job_location}
			AND ${skill}
			AND ${work_availability}
			AND ${graduation}
			AND ${UserQuery.isRoleStudent(user_id)}
			`;
	}
	// TODO
	query(param, type) {
		let select = "";
		let order = "";
		let group = "";

		// if (this.isFilter(type)) {
		// 	let where = this.getWhere("s.entity_id", param);
		// 	return queryFilter(param, where);

		// } else 

		if (this.isCount(type)) {
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

		// console.log("++++++++++++++++++++++++++++++++++++++++++++++");
		// console.log(sql)
		// console.log("++++++++++++++++++++++++++++++++++++++++++++++");
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
		const { UserExec } = require('./user-query.js');
		const { IsSeenExec } = require("./is-seen-query.js");

		for (var i in res) {
			var student_id = res[i]["student_id"];
			if (typeof field["student"] !== "undefined") {
				res[i]["student"] = UserExec.user({
					ID: student_id,
					company_id: param.company_id,
					cf_to_check_registration: param.cf,
				},
					field["student"]
				);
			}
			if (typeof field["is_seen"] !== "undefined" && param.current_user_id) {
				res[i]["is_seen"] = IsSeenExec.single({
					user_id: param.current_user_id,
					type: IsSeenEnum.TYPE_BROWSE_STUDENT,
					entity_id: student_id
				},
					field["is_seen"]
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
		// console.log("[BrowseStudentExec]", sql)


		if (this.isFilter(type)) {
			let where = this.getWhere("s.entity_id", param);
			return fetchFilter(where, param);
		}

		var sql = this.query(param, type);
		var toRet = DB.query(sql).then(res => {
			if (this.isList(type)) {
				return this.resList(res, field, param);
			} else if (this.isCount(type)) {
				return this.resCount(res);
			}
			// else if (this.isFilter(type)) {
			// 	return this.resFilter(res);
			// }
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