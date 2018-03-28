const DB = require('./DB.js');
const { ResumeDrop } = require('../../config/db-config');
const { UserQuery } = require('./user-query');



class ResumeDropQuery {
    getResumeDrop(params, field, extra) {
        var id_where = (typeof params.ID === "undefined") ? "1=1" : `x.${ResumeDrop.ID} = ${params.ID}`;
        var student_where = (typeof params.student_id === "undefined") ? "1=1" : `x.${ResumeDrop.STUDENT_ID} = ${params.student_id}`;
        var com_where = (typeof params.company_id === "undefined") ? "1=1" : `x.${ResumeDrop.COMPANY_ID} = ${params.company_id}`;

        var order_by = (typeof params.order_by === "undefined") ? `ORDER BY updated_at` : `ORDER BY ${params.order_by}`;

        var limit = (typeof params.page !== "undefined" &&
            typeof params.offset !== "undefined") ? DB.prepareLimit(params.page, params.offset) : "";

        // search param
        var search_student = UserQuery.getSearchNameOrEmail("x.student_id"
            , params.search_student, params.search_student);

        var sql = `from ${ResumeDrop.TABLE} x where ${id_where} and ${student_where} and ${com_where} and ${search_student} ${order_by}`;
        if (extra.count) {
            return `select count(*) as cnt ${sql}`;
        } else {
            return `select * ${sql} ${limit}`;
        }
    }

    getResumeDropError(user_id) {
        var { UserQuery } = require('./user-query.js');
        var sql = `select 
            (select count(*) from resume_drops r where r.student_id = ${user_id}) as ttl_resume
            , (${UserQuery.selectMetaMain(user_id, "feedback")}) as feedback`;

        return sql;
    }
}

ResumeDropQuery = new ResumeDropQuery();
const RD_LIMIT = 3;
class ResumeDropExec {

    resume_drops_limit(params, field, extra = {}) {
        var sql = ResumeDropQuery.getResumeDropError(params.user_id);
        var toRet = DB.query(sql).then(function (res) {
            var ttl_resume = res[0].ttl_resume;
            var feedback = res[0].feedback;
            var err = null;
            if(ttl_resume >= RD_LIMIT && (feedback == null || feedback == "")){
                err = RD_LIMIT;
            }
            return err;
        });

        return toRet;
    }

    resume_drops(params, field, extra = {}) {
        var { CompanyExec } = require('./company-query.js');
        var { UserExec } = require('./user-query.js');
        var { DocLinkExec } = require('./doclink-query.js');

        var sql = ResumeDropQuery.getResumeDrop(params, field, extra);
        console.log(sql);
        var toRet = DB.query(sql).then(function (res) {
            if (extra.count) {
                return res[0]["cnt"];
            }

            for (var i in res) {
                var student_id = res[i]["student_id"];
                var company_id = res[i]["company_id"];

                if (typeof field["doc_links"] !== "undefined") {
                    if (res[i]["doc_links"] !== "" && res[i]["doc_links"] !== null) {
                        var doc_links = JSON.parse(res[i]["doc_links"]);

                        res[i]["doc_links"] = doc_links.map((d, i) =>
                            DocLinkExec.doc_links({ ID: d }, field["doc_links"], { single: true })
                        );
                    } else {
                        res[i]["doc_links"] = [];
                    }
                }

                if (typeof field["student"] !== "undefined") {
                    res[i]["student"] = UserExec.user({ ID: student_id }, field["student"]);
                }

                if (typeof field["company"] !== "undefined") {
                    res[i]["company"] = CompanyExec.company(company_id, field["company"]);
                }
            }

            if (extra.single) {
                return res[0];
            }
            return res;
        });

        return toRet;
    }
}
ResumeDropExec = new ResumeDropExec();

module.exports = { ResumeDropExec, ResumeDropQuery };


