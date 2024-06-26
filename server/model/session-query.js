const DB = require('./DB.js');
const { Session } = require('../../config/db-config');
const { UserQuery } = require('./user-query');
const { CompanyQuery } = require('./company-query');

class SessionRatingExec {
    getQuery(params, extra) {
        var id_where = (typeof params.ID === "undefined") ? "1=1" : `ID = ${params.ID}`;
        var session_where = (typeof params.session_id === "undefined") ? "1=1" : `session_id = ${params.session_id}`;
        return `select * from session_ratings where 1=1 and ${id_where} and ${session_where}`;
    }

    session_ratings(params, field, extra = {}) {
        var sql = this.getQuery(params, extra);

        var toRet = DB.query(sql).then(function (res) {
            if (extra.single) {
                return res[0];
            }
            return res;
        });

        return toRet;
    }
}
SessionRatingExec = new SessionRatingExec();

//###########################################################################################################################

class SessionNoteExec {

    getQuery(params, extra) {
        var id_where = (typeof params.ID === "undefined") ? "1=1" : `ID = ${params.ID}`;
        var session_where = (typeof params.session_id === "undefined") ? "1=1" : `session_id = ${params.session_id}`;
        var order_by = "ORDER BY updated_at desc";
        var limit = DB.prepareLimit(params.page, params.offset);

        return `select * from session_notes where 1=1 and ${id_where} and ${session_where} ${order_by} ${limit}`;
    }

    session_notes(params, field, extra = {}) {
        var sql = this.getQuery(params, extra);

        var toRet = DB.query(sql).then(function (res) {
            if (extra.single) {
                return res[0];
            }
            return res;
        });

        return toRet;
    }
}
SessionNoteExec = new SessionNoteExec();

//###########################################################################################################################

class SessionQuery {
    getSession(params, extra) {
        // for single
        var id_where = (typeof params.ID === "undefined") ? "1=1" : `q.ID = ${params.ID}`;
        var participant_where = (typeof params.participant_id === "undefined") ? "1=1" : `q.participant_id = ${params.participant_id}`;
        var com_where = (typeof params.company_id === "undefined") ? "1=1"
            : `(${UserQuery.selectMetaMain("q.host_id", "rec_company")}) = ${params.company_id}`;

        var status_where = "1=1";
        if (typeof params.status !== "undefined") {
            if (typeof params.status === "string") {
                params.status = [params.status];
            }

            status_where = "q.status in ( ";
            params.status.map((d, i) => {
                status_where += `'${d}',`;
            });
            status_where = status_where.slice(0, -1) + ")";
        }

        var host_where = (typeof params.host_id === "undefined") ? "1=1" : `q.host_id = '${params.host_id}'`;

        // search param
        var search_student = UserQuery.getSearchNameOrEmail("q.participant_id", params.search_student, params.search_student);
        var search_university = UserQuery.getSearchUniversity("q.participant_id", params.search_university);

        var limit = (typeof params.page !== "undefined" &&
            typeof params.offset !== "undefined") ? DB.prepareLimit(params.page, params.offset) : "";

        var order_by = (typeof params.order_by === "undefined") ? "" : `ORDER BY ${params.order_by}`;

        var sql = `from ${Session.TABLE} q 
            where ${id_where} and ${participant_where} and ${status_where} and ${host_where} and ${com_where}
            and ${search_student} and ${search_university}
            ${order_by}`;

        if (extra.count) {
            return `select count(*) as cnt ${sql}`;
        } else {
            return `select q.*, 
            ${UserQuery.selectMeta("q.host_id", "rec_company", "company_id")}
            ${sql} ${limit}`;
        }
    }
}
SessionQuery = new SessionQuery();

class SessionExec {

    sessions(params, field, extra = {}) {

        var { CompanyExec } = require('./company-query.js');
        var { UserExec } = require('./user-query.js');

        var sql = SessionQuery.getSession(params, extra);
        //// console.log(sql);
        var toRet = DB.query(sql).then(function (res) {
            if (extra.count) {
                return res[0]["cnt"];
            }


            for (var i in res) {
                var session_id = res[i]["ID"];
                var student_id = res[i]["participant_id"];
                var recruiter_id = res[i]["host_id"];
                var company_id = res[i]["company_id"];

                if (typeof field["session_notes"] !== "undefined") {
                    res[i]["session_notes"] = SessionNoteExec.session_notes({ session_id: session_id }, field["session_notes"]);
                }

                if (typeof field["session_ratings"] !== "undefined") {
                    res[i]["session_ratings"] = SessionRatingExec.session_ratings({ session_id: session_id }, field["session_ratings"]);
                }

                if (typeof field["student"] !== "undefined") {
                    res[i]["student"] = UserExec.user({ ID: student_id }, field["student"]);
                }

                if (typeof field["recruiter"] !== "undefined") {
                    res[i]["recruiter"] = UserExec.user({ ID: recruiter_id }, field["recruiter"]);
                }

                if (typeof field["company"] !== "undefined") {
                    res[i]["company"] = CompanyExec.company(company_id, field["company"]);
                }
            }

            // filter distinct value
            if (typeof params.distinct !== "undefined") {
                var existed = [];
                var distinct = res.filter((value, index, self) => {
                    var r = value[params.distinct];
                    if (existed.indexOf(r) >= 0) {
                        return false;
                    }
                    existed.push(r);
                    return true;
                });
                res = distinct;
            }

            if (extra.single) {
                return res[0];
            }

            return res;
        });

        return toRet;
    }
}
SessionExec = new SessionExec();

module.exports = { SessionExec, SessionQuery, SessionNoteExec, SessionRatingExec };


