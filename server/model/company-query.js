
const DB = require('./DB.js');
const { Queue, Company, CompanyEnum, QueueEnum
    , Session, SessionEnum
    , Prescreen, SessionRequest, SessionRequestEnum
    , PrescreenEnum, Vacancy } = require('../../config/db-config');

class CompanyQuery {

    getSearchName(field, search_params) {
        return `(select com.name from ${Company.TABLE} com where com.ID = field) like '%${search_params}%'`;
    }

    getCompany(params, field) {
        var type_where = (typeof params.type === "undefined") ? "1=1"
            : `c.${Company.TYPE} LIKE '%${params.type}%'`;

        var id_where = (typeof params.ID === "undefined") ? "1=1"
            : `c.${Company.ID} = '${params.ID}'`;

        var cf_where = (typeof params.cf === "undefined") ? "1=1"
            : `(${DB.cfMapSelect("company", "c.ID", params.cf)}) = '${params.cf}'`;

        var ps_where = (typeof params.accept_prescreen === "undefined") ? "1=1"
            : `c.${Company.ACCEPT_PRESCREEN} = '${params.accept_prescreen}'`;

        var include_sponsor = "c.sponsor_only = 0";
        if ((typeof params.ID === "undefined")) {
            if (typeof params.include_sponsor !== "undefined") {
                include_sponsor = "1=1";
            }
        } else {
            include_sponsor = "1=1";
        }

        var ignore_type = (typeof params.ignore_type === "undefined") ? "1=1" : `c.type NOT IN ${params.ignore_type}`;

        var order_by = (typeof params.order_by === "undefined")
            ? `order by c.${Company.SPONSOR_ONLY} desc, c.${Company.TYPE} asc`
            : `order by ${params.order_by}`;

        var sql = `select c.*, c.img_position as img_pos from ${Company.TABLE} c where 1=1 
            and ${ignore_type} and ${id_where} 
            and ${include_sponsor} and ${type_where} 
            and ${cf_where} and ${ps_where}
            ${order_by}`;

        console.log(sql);
        return sql;
    }
}
CompanyQuery = new CompanyQuery();


const { VacancyExec } = require('./vacancy-query.js');
const { PrescreenExec } = require('./prescreen-query.js');
const { UserExec } = require('./user-query.js');
const { DocLinkExec } = require('./doclink-query.js');
const { SessionExec } = require('./session-query.js');
const { SessionRequestExec } = require('./session-request-query.js');

class CompanyExec {
    getCompanyHelper(type, params, field) {

        // for cross dependecy need to init here
        const { QueueExec } = require('./queue-query.js');

        var isSingle = (type === "single");
        var sql = CompanyQuery.getCompany(params, field);


        return DB.query(sql).then(function (res) {

            for (var i in res) {

                var company_id = res[i]["ID"];

                //Add recruiters ***********************************
                if (typeof field["recruiters"] !== "undefined") {
                    res[i]["recruiters"] = UserExec.recruiters(company_id, field["recruiters"]);
                }

                //Add queue ***********************************
                var act_q = {
                    company_id: company_id
                    , status: QueueEnum.STATUS_QUEUING
                    , order_by: `${Queue.CREATED_AT} DESC`
                };

                if (typeof field["active_queues"] !== "undefined") {
                    res[i]["active_queues"] = QueueExec.queues(act_q, field["active_queues"]);
                }

                if (typeof field["active_queues_count"] !== "undefined") {
                    delete (act_q["order_by"]);
                    res[i]["active_queues_count"] = QueueExec.queues(act_q, {}, { count: true });
                }

                // Cf ****************************************************
                if (typeof field["cf"] !== "undefined") {
                    res[i]["cf"] = DB.getCF("company", company_id);
                }

                //Add active_sessions ***********************************
                var act_s = {
                    company_id: company_id
                    , status: SessionEnum.STATUS_ACTIVE
                    , order_by: `${Session.CREATED_AT}`
                };

                if (typeof field["active_sessions"] !== "undefined") {
                    res[i]["active_sessions"] = SessionExec.sessions(act_s, field["active_sessions"]);
                }

                //Add pending_requests ***********************************
                var pending_pr = {
                    company_id: company_id
                    , status: SessionRequestEnum.STATUS_PENDING
                    , order_by: `${SessionRequest.CREATED_AT}`
                };

                if (typeof field["pending_requests"] !== "undefined") {
                    res[i]["pending_requests"] = SessionRequestExec.session_requests(pending_pr, field["pending_requests"]);
                }

                //Add prescreens ***********************************
                // New SI Flow - maybe? not updated apa2 lagi stakat ni
                var act_ps = {
                    company_id: company_id
                    , status: PrescreenEnum.STATUS_APPROVED
                    , order_by: `${Prescreen.APPNMENT_TIME}`
                };

                if (typeof field["active_prescreens"] !== "undefined") {
                    res[i]["active_prescreens"] = PrescreenExec.prescreens(act_ps, field["active_prescreens"]);
                }

                if (typeof field["active_prescreens_count"] !== "undefined") {
                    delete (act_ps["order_by"]);
                    res[i]["active_prescreens_count"] = PrescreenExec.prescreens(act_ps, {}, { count: true });
                }

                //Add vacancies ***********************************
                var vc = {
                    company_id: company_id
                    , order_by: `${Vacancy.UPDATED_AT} DESC`
                };

                if (typeof field["vacancies"] !== "undefined") {
                    res[i]["vacancies"] = VacancyExec.vacancies(vc, field["vacancies"]);
                }

                if (typeof field["vacancies_count"] !== "undefined") {
                    delete (act_ps["order_by"]);
                    res[i]["vacancies_count"] = VacancyExec.vacancies(vc, {}, { count: true });
                }

                //Add doc_links ****************************************
                if (typeof field["doc_links"] !== "undefined") {
                    res[i]["doc_links"] = DocLinkExec.doc_links({ company_id: company_id }, field["doc_links"]);
                }
            }

            if (isSingle) {
                return res[0];
            } else {
                return res;
            }
        });
    }

    company(id, field) {
        let param = {};
        if(typeof id === "object"){
            param = id;
        } else{
            param = {ID: id }
        }

        return this.getCompanyHelper("single", param, field);
    }

    companies(arg, field) {
        return this.getCompanyHelper(false, arg, field);
    }
}
CompanyExec = new CompanyExec();

module.exports = { Company, CompanyExec, CompanyQuery };
