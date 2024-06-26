const { isCustomUserInfoOff, Single } = require("../../config/registration-config");
const { overrideLanguageTable } = require("./ref-query.js");
const UserFieldHelper = require("../../helper/user-field-helper.js");
const { cfCustomFunnel } = require("../../config/cf-custom-config.js");
const DB = require("./DB.js");
const isProd = process.env.NODE_ENV === "production";

const EMPTY_FILTER = `select 
'' as _key 
, '' as _val
, '' as _val_label
, '' as _total 
from dual`;

function isDiscardFilter(param, filter) {
	let toRet = false;
	try {
		if (param.discard_filter.indexOf(`::${filter}::`) >= 0) {
			toRet = true;
		}
	} catch (err) { }

	// // // console.log("isDiscardFilter", filter, toRet);
	return toRet;
}
const cfFilter = (currentCf, where) => {
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

const multiFilter = (param, key, where) => {
	if (isDiscardFilter(param, key)) {
		return EMPTY_FILTER;
	}

	let additional_where = "1=1";
	if (key == "looking_for_position") {
		// additional_where = " s.val not like '%part%' ";
		// additional_where = " s.val IN (select vv.val FROM ref_looking_for_position vv) ";
		additional_where = " (s.val = 'Full-Time' OR s.val = 'Internship') ";
	}

	return `select 
		${getOrder("empty")}
		'${key}' as _key, 
		s.val as _val, 
		"" as _val_label, 
		COUNT(s.ID) as _total 
		
		from multi_${key} s
		WHERE s.entity = 'user'
		AND ${where}
		AND ${additional_where}
		GROUP BY s.val`
}

const singleFilterWhereInMalaysia = (currentCf, param, where) => {
	if (isDiscardFilter(param, "where_in_malaysia")) {
		return EMPTY_FILTER;
	}

	// (CASE WHEN r.city IS NOT NULL THEN concat(r.state, " - ", r.city)

	return `SELECT 
	
		${getOrder("empty")}
		s.key_input as _key, 
		r.val as _val, 
		r.state as _val_label, 
		COUNT(*) as _total 
		
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

const getOrder = (type) => {
	if (type == "single") {
		return `
			(SELECT LPAD(rr1.ID, 3, 0) FROM ref_oejf21_years_working rr1 WHERE rr1.val = s.val) as _order_1,
			(SELECT LPAD(rr2.ID, 3, 0) FROM ref_work_experience_year rr2 WHERE rr2.val = s.val) as _order_2,
		`;
	}
	if (type == "empty") {
		return `
			'' as _order_1,
			'' as _order_2,
		`;
	}
	if (type == "group_by") {
		return `_order_1, _order_2,`;
	}
	if (type == "final_order") {
		return `X._order_1 asc, X._order_2 asc,`;
	}


}


const singleFilter = (currentCf, param, where) => {
	let university = isCustomUserInfoOff(currentCf, Single.university) ||
		isDiscardFilter(param, "university")
		? "1=0"
		: `( 
			s.key_input = "university"
				AND
			s.val IN (select r.val from ref_university r)
		) `

	let country_study = isCustomUserInfoOff(currentCf, Single.country_study)
		|| isDiscardFilter(param, "country_study")
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
		let ref = cfCustomFunnel({ key: k, action: "get_ref_table_name_by_key" })
		if (!isCustomUserInfoOff(currentCf, k)) {
			custom_single_filter += `( 
				s.key_input = "${k}"
				${ref ? `AND s.val IN (select r.val from ref_${ref} r)` : ''}	
			) OR `
		}
	}

	// (CASE WHEN s.key_input = 'field_study_secondary' THEN 'field_study_main' ELSE s.key_input END) as _key
	let toRet = `SELECT 
	${getOrder('single')}
	s.key_input as _key,
	s.val as _val,
	"" as _val_label,
	COUNT(*) as _total 

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
	AND s.val != ""
	AND s.val != "-- Please Select --"
	AND s.entity = 'user'
	AND ${where}
	group by ${getOrder("group_by")} _key, _val
	`;

	//group by s.key_input, s.val`;

	return toRet;
}


async function filterCustom(currentCf, type, param, where) {
	let filter = await UserFieldHelper.getFilterItems(currentCf, DB, type);
	console.log("filterCustom", type, filter)
	let whereArray = [];
	for (let f of filter) {
		whereArray.push(`
			( 
				s.key_input = "${f.id}"
				AND
				s.val IN (select r.val from global_dataset_item r WHERE r.source = '${f.dataset_source}')
			)
		`);
	}

	let q = `
		SELECT 
		${getOrder('single')}
		s.key_input as _key,
		s.val as _val,
		"" as _val_label,
		COUNT(*) as _total 

		FROM ${type}_input s
		where 
		${whereArray.length > 0
			? `(${whereArray.join(" OR ")})`
			: '1=0'
		}
		AND s.val != ""
		AND s.val != "-- Please Select --"
		AND s.entity = 'user'
		AND ${where}
		group by ${getOrder("group_by")} _key, _val
	`

	console.log(q);
	return q;
}

async function generateQuery(param, where) {
	const currentCf = param.current_cf;


	// ${singleFilterWhereInMalaysia(currentCf, param, where)}
	// 	UNION ALL

	let customSingle = await filterCustom(currentCf, "single", param, where)
	let customMulti = await filterCustom(currentCf, "multi", param, where)

	let q = `SELECT * FROM (
		${customSingle ? ` ${customSingle} UNION ALL ` : ''}
		${customMulti ? ` ${customMulti} UNION ALL ` : ''}
		${singleFilter(currentCf, param, where)}
		UNION ALL
		${multiFilter(param, "skill", where)}
		UNION ALL
		${multiFilter(param, "looking_for_position", where)}
	) 
	X ORDER BY X._key, ${getOrder('final_order')} X._val_label asc, X._val asc, X._total desc`;

	// UNION ALL
	// ${multiFilter("field_study", where) /** @limit_field_of_study_2_before_deploy - comment */}


	q = overrideLanguageTable(q, param);
	q = q.replaceAll("AND 1=1\n", "");
	q = q.replaceAll("AND 1=1", "");

	return q;
}

async function fetchNewFilterAndUpdatePivot(newParam, where) {
	let newParamStr = JSON.stringify(newParam);
	let sql = await generateQuery(newParam, where);
	// console.log("--------------")
	// console.log("--------------")
	// console.log("--------------")
	// console.log(sql)
	// console.log("--------------")
	// console.log("--------------")
	// console.log("--------------")

	return DB.query(sql).then(res => {
		// console.log("--------------")
		// console.log("--------------")
		// console.log("--------------")
		// console.log(res)
		// console.log("--------------")
		// console.log("--------------")
		// console.log("--------------")
		// insert to pivot table
		let newResultStr = JSON.stringify(res);
		let buff = new Buffer(newResultStr);
		newResultStr = buff.toString('base64');
		// newResultStr = newResultStr.length + "";

		let sqlInsert = `INSERT INTO pivot_student_filter (param, result) VALUES (?,?) ON DUPLICATE KEY UPDATE result = ?`
		sqlInsert = DB.prepare(sqlInsert, [newParamStr, newResultStr, newResultStr]);
		DB.query(sqlInsert)

		return res;
	});
}

function getNewParam(param) {
	// let newParam = {
	// 	current_cf: param.current_cf,
	// 	discard_filter: param.discard_filter,
	// }

	let newParam = JSON.parse(JSON.stringify(param));
	delete newParam["override_pivot"]
	return newParam;
}

function fetchFilter(where, param) {
	let newParam = getNewParam(param);
	if (param.override_pivot || !isProd) {
		// console.log("override pivot")
		return fetchNewFilterAndUpdatePivot(newParam, where)
	}
	let newParamStr = JSON.stringify(newParam);
	let sqlPivot = `SELECT result FROM pivot_student_filter WHERE param = ?`;
	sqlPivot = DB.prepare(sqlPivot, [newParamStr]);
	// check in pivot table
	return DB.query(sqlPivot).then(resPivot => {
		try {
			let str = resPivot[0].result;
			let buff = new Buffer(str, 'base64');
			str = buff.toString('ascii');
			let toRet = JSON.parse(str);
			return toRet;
		}
		// if not found fetch from main table
		catch (err) {
			return fetchNewFilterAndUpdatePivot(newParam, where)
		}
	})
}

module.exports = {
	fetchFilter
};