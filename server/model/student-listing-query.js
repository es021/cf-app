const DB = require('./DB.js');
const {
    UserQuery
} = require('./user-query');
const {
    CFQuery
} = require('./cf-query');

class StudentListingQuery {
    getStudentListing(params, field, extra) {
        var limit = (typeof params.page !== "undefined" &&
            typeof params.offset !== "undefined") ? DB.prepareLimit(params.page, params.offset) : "";

        // **************************
        // filter record
        // 1. search first_name, last_name, email
        // @param search_student
        var join_search_student = UserQuery.getSearchNameOrEmail("j.user_id", params.search_student, params.search_student);
        var resume_search_student = UserQuery.getSearchNameOrEmail("r.student_id", params.search_student, params.search_student);

        // 2. search major
        // @param search_major
        var join_search_major = UserQuery.getSearchMajor("j.user_id", params.search_major);
        var resume_search_major = UserQuery.getSearchMajor("r.student_id", params.search_major);

        // 3. search study place
        // @param search_study_place
        var join_search_place = UserQuery.getSearchStudyPlace("j.user_id", params.search_study_place);
        var resume_search_place = UserQuery.getSearchStudyPlace("r.student_id", params.search_study_place);

        // 4. search work availability 
        // @param search_work_av_start, search_work_av_end
        var join_search_work_av = UserQuery.getSearchWorkAvailability("j.user_id", params.search_work_av_month, params.search_work_av_year);
        var resume_search_work_av = UserQuery.getSearchWorkAvailability("r.student_id", params.search_work_av_month, params.search_work_av_year);

        // 5. search_looking_for
        // @param search_looking_for
        var join_search_looking_for = UserQuery.getSearchLookingFor("j.user_id", params.search_looking_for);
        var resume_search_looking_for = UserQuery.getSearchLookingFor("r.student_id", params.search_looking_for);


        // var cf_where = `(select ms.cf from cf_map ms where ms.entity = 'user' and ms.entity_id = Y.student_id limit 0, 1)
        //         in (select ms.cf from cf_map ms where ms.entity = 'company' and ms.entity_id = c.ID)`;

        var cf_where = "1=1";

        var join_cf = CFQuery.getCfInList("j.user_id", "user", params.cf);
        var resume_cf = CFQuery.getCfInList("r.student_id", "user", params.cf);

        var sql = `
        SELECT Y.* FROM ( 
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
                AND ${join_search_student}
                AND ${join_search_major}
                AND ${join_search_place}
                AND ${join_search_work_av}
                AND ${join_search_looking_for}
                AND ${join_cf}

                UNION
            
                SELECT 
                r.student_id as student_id,
                r.created_at as created_at
                from resume_drops r
                WHERE 1=1
                AND r.company_id = ${params.company_id}
                AND ${resume_search_student}
                AND ${resume_search_major}
                AND ${resume_search_place}
                AND ${resume_search_work_av}
                AND ${resume_search_looking_for}
                AND ${resume_cf}

            ) X
            GROUP BY X.student_id
        ) Y,

        companies c 
        where c.ID  =  ${params.company_id}
        and ${cf_where}

        ORDER BY Y.created_at desc
        ${limit} `;

        // ###################################################################
        // ALL STUDENT QUERY
        // untuk cater company : -1 (all student page)
        
        // INNER JOIN doc_link dl ON u.ID = dl.user_id AND dl.type = 'document' 
        // AND (dl.label like '%Resume%' OR dl.label = 'CV' OR dl.label like '%Curriculum Vitae%')
        
        var sqlAll = `
        SELECT DISTINCT u.ID as student_id, u.user_registered
        FROM wp_cf_users u 
        WHERE 1=1 
        AND ${join_search_student}
        AND ${join_search_major}
        AND ${join_search_place}
        AND ${join_search_work_av}
        AND ${join_search_looking_for}
        AND ${join_cf}
        ORDER BY u.user_registered asc
        ${limit} `;
        sqlAll = sqlAll.replaceAll("j.user_id", "u.ID")

        // console.log(sql);
        // console.log(sqlAll);

        return params.company_id <= 0 ? sqlAll : sql;
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
        // var {
        //     DocLinkExec
        // } = require('./doclink-query.js');

        var sql = StudentListingQuery.getStudentListing(params, field, extra);

        var toRet = DB.query(sql).then(function (res) {
            for (var i in res) {
                var student_id = res[i]["student_id"];
                if (typeof field["student"] !== "undefined") {
                    res[i]["student"] = UserExec.user({
                        ID: student_id,
                        company_id: params.company_id,
                    }, field["student"]);
                }

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
StudentListingExec = new StudentListingExec();

module.exports = {
    StudentListingExec
};