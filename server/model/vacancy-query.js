const DB = require('./DB.js');
const {
	Vacancy
} = require('../../config/db-config');

class VacancyQuery {
	getVacancy(params, extra) {
		var id_where = (typeof params.ID === "undefined") ? "1=1" : `ID = '${params.ID}' `;
		var title_where = (typeof params.title === "undefined") ? "1=1" : `title like '%${params.title}%' `;
		var type_where = (typeof params.type === "undefined") ? "1=1" : `type = '${params.type}' `;
		var com_where = (typeof params.company_id === "undefined") ? "1=1" : `company_id = '${params.company_id}' `;
		var order_by = (typeof params.order_by === "undefined") ? "" : `ORDER BY ${params.order_by} `;

		var limit = DB.prepareLimit(params.page, params.offset);

		var sql = `from ${Vacancy.TABLE} where ${id_where} and ${title_where} and ${type_where} and ${com_where} ${order_by}`;
		if (extra.count) {
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
		var toRet = DB.query(sql).then(function(res) {
			if (extra.count) {
				return res[0]["cnt"];
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