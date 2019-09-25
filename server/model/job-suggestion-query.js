const DB = require('./DB.js');
const {
	UserQuery
} = require('./user-query');
const {
	CFQuery
} = require('./cf-query');

class JobSuggestionQuery {
	getJobSuggestion(params, field, extra) {
		var limit = (typeof params.page !== "undefined" &&
			typeof params.offset !== "undefined") ? DB.prepareLimit(params.page, params.offset) : "";

		var join_cf = CFQuery.getCfInList("c.ID", "company", params.cf);

		var sql = `SELECT v.* FROM vacancies v, companies c 
        WHERE 1=1 AND v.company_id = c.ID 
        and ${join_cf}
        ${limit} `;

		console.log(sql);
		return sql
	}


}

JobSuggestionQuery = new JobSuggestionQuery();
class JobSuggestionExec {
	job_suggestions(params, field, extra = {}) {
		var {
			CompanyExec
		} = require('./company-query.js');

		var sql = JobSuggestionQuery.getJobSuggestion(params, field, extra);
		var toRet = DB.query(sql).then(function(res) {
			for (var i in res) {
				var student_id = res[i]["student_id"];

				if (typeof field["company"] !== "undefined") {
					let company_id = params.company_id;
					res[i]["company"] = CompanyExec.company(company_id, field["company"]);
				}
			}
			return res;
		});
		return toRet;
	}
}
JobSuggestionExec = new JobSuggestionExec();

module.exports = {
	JobSuggestionExec
};