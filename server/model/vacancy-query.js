const DB = require('./DB.js');
const {
	Vacancy
} = require('../../config/db-config');

class VacancyQuery {
	getVacancy(params, extra) {
		var cf_specific_where = (typeof params.cf === "undefined") ? "1=1" :
			`("${params.cf}" in (select m.cf FROM cf_map m where m.entity_id = v.ID and entity = "vacancy")
			OR
		(select m.cf FROM cf_map m where m.entity_id = v.ID and entity = "vacancy") is null )`;

		var cf_where = (typeof params.cf === "undefined") ? "1=1" :
			`company_id IN (select m.entity_id from cf_map m where m.entity = "company" and cf = "${params.cf}" ) `;

		var id_where = (typeof params.ID === "undefined") ? "1=1" : `ID = '${params.ID}' `;
		var location_where = (typeof params.location === "undefined") ? "1=1" : `location = '${params.location}' `;
		var title_where = (typeof params.title === "undefined") ? "1=1" : `title like '%${params.title}%' `;
		var type_where = (typeof params.type === "undefined") ? "1=1" : `type = '${params.type}' `;
		var com_where = (typeof params.company_id === "undefined") ? "1=1" : `company_id = '${params.company_id}' `;
		var applied_only = (params.show_applied_only === true)
			? `v.ID IN (select i.entity_id from interested i 
				where i.entity = "vacancies" and i.user_id = "${params.user_id}" AND i.is_interested = 1)`
			: `1=1`;

		var order_by = (typeof params.order_by === "undefined") ? "" : `ORDER BY ${params.order_by} `;

		var interested_user_id = "1=1";
		if (params.interested_user_id && params.company_id) {
			interested_user_id = ` v.ID IN (select i.entity_id from interested i 
					where i.entity = "vacancies" and i.user_id = "${params.interested_user_id}" ) `
		}

		var limit = DB.prepareLimit(params.page, params.offset);

		var sql = `from ${Vacancy.TABLE} v where 
			1=1 and
			${cf_specific_where} and
			${cf_where} and
			${id_where} and 
			${title_where} and 
			${type_where} and 
			${location_where} and
			${applied_only} and
			${interested_user_id} and
			${com_where} ${order_by}`;

		if (extra.distinct) {
			let companyText = params.text_company ? params.text_company : "Company";

			return `
			select distinct
				"${companyText}" as "_category", 
				"company_id" as "_key", 
				 company_id as "_val",
				(select c.name from companies c where c.ID = v.company_id) as "_label" 
				${sql}

			UNION ALL

			select distinct
				"Type" as "_category", 
				"type" as "_key", 
				type as "_val",
				type as "_label" 
				${sql} and type != ""

			UNION ALL

			select distinct
				"Location" as "_category", 	
				"location" as "_key", 
				location as "_val",
				location as "_label" 
				${sql} and location != ""

			ORDER BY _key, _label
			
			`
		}
		else if (extra.count) {
			return `select count(*) as cnt ${sql}`;
		} else {
			return `select * ${sql} ${limit}`;
		}
	}
}
VacancyQuery = new VacancyQuery();

class VacancyExec {
	getVacancyHelper(type, params, field, extra = {}) {

		const {
			CompanyExec
		} = require('./company-query.js');
		const {
			InterestedExec
		} = require('./interested-query.js');

		var sql = VacancyQuery.getVacancy(params, extra);
		console.log(sql)
		var toRet = DB.query(sql).then(function (res) {
			if (extra.count) {
				return res[0]["cnt"];
			}

			if (extra.distinct) {
				return res;
			}

			for (var i in res) {
				if (typeof field["company"] !== "undefined") {
					var company_id = res[i]["company_id"];
					res[i]["company"] = CompanyExec.company(company_id, field["company"]);
				}
				if (typeof field["interested"] !== "undefined") {
					res[i]["interested"] = InterestedExec.single({
						user_id: params.user_id,
						entity: "vacancies",
						entity_id: res[i].ID
					}, field["interested"]);
				}
			}

			if (type === "single") {
				return res[0];
			} else {
				return res;
			}
		});


		return toRet;
	}

	vacancy(params, field) {
		return this.getVacancyHelper("single", params, field);
	}

	vacancies(params, field, extra = {}) {
		return this.getVacancyHelper(false, params, field, extra);
	}
}

VacancyExec = new VacancyExec();

module.exports = {
	VacancyExec,
	VacancyQuery
};