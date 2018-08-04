const DB = require('./DB.js');
const {
    UserQuery
} = require('./user-query');

class StudentListingQuery {
    getStudentListing(params, field, extra) {
        var limit = (typeof params.page !== "undefined" &&
            typeof params.offset !== "undefined") ? DB.prepareLimit(params.page, params.offset) : "";

        // search param
        var search_j = UserQuery.getSearchNameOrEmail("j.user_id", params.search_student, params.search_student);

        var search_r = UserQuery.getSearchNameOrEmail("r.student_id", params.search_student, params.search_student);

        var sql = `
        SELECT * FROM ( 
            SELECT 
            X.student_id,
            MAX(X.created_at) as created_at
            FROM(
                SELECT 
                j.user_id as student_id,
                j.created_at as created_at
                FROM group_session_join j left outer join group_session g  ON j.group_session_id = g.ID
                WHERE 1=1
                AND g.company_id = ${params.company_id}
                AND ${search_j}

                UNION
            
                SELECT 
                r.student_id as student_id,
                r.created_at as created_at
                from resume_drops r
                WHERE 1=1
                AND r.company_id = ${params.company_id}
                AND ${search_r}
            ) X
            GROUP BY X.student_id
        ) Y
        ORDER BY Y.created_at desc
        ${limit} `;

        console.log(sql);
        return sql;
    }


}

StudentListingQuery = new StudentListingQuery();
class StudentListingExec {

    student_listing(params, field, extra = {}) {
        var {
            CompanyExec
        } = require('./company-query.js');
        var {
            UserExec
        } = require('./user-query.js');
        var {
            DocLinkExec
        } = require('./doclink-query.js');

        var sql = StudentListingQuery.getStudentListing(params, field, extra);

        var toRet = DB.query(sql).then(function (res) {
            for (var i in res) {
                var student_id = res[i]["student_id"];
                if (typeof field["student"] !== "undefined") {
                    res[i]["student"] = UserExec.user({
                        ID: student_id
                    }, field["student"]);
                }
            }

            return res;
        });

        return toRet;
    }
}
StudentListingExec = new StudentListingExec();

module.exports = {
    StudentListingExec
};