const DB = require("./DB.js");
const { UserQuery } = require("./user-query");
const { CFQuery } = require("./cf-query");
const { CompanyEnum } = require("../../config/db-config");

class StudentListingQuery {
  getStudentListing(params, priv, isCount = false) {
    //################################################
    // START - adjust params according to companyPriv
    let cfAccessStudent = [params.cf];
    let useQueryForAllStudent = false;
    for (var i in priv) {
      if (priv[i].indexOf("ACCESS_ALL_STUDENT_") >= 0) {
        let cf = priv[i].replace("ACCESS_ALL_STUDENT_", "");
        cfAccessStudent.push(cf);
      }
    }

    if (CompanyEnum.hasPriv(priv, CompanyEnum.PRIV.ACCESS_ALL_STUDENT)) {
      useQueryForAllStudent = true;
    }
    if (cfAccessStudent.length > 0) {
      useQueryForAllStudent = true;
    }
    // END - adjust params according to companyPriv
    //################################################

    // **************************
    // filter record
    // 1. search first_name, last_name, email
    // @param search_student
    var join_search_student = UserQuery.getSearchNameOrEmail(
      "j.user_id",
      params.search_student,
      params.search_student
    );
    var resume_search_student = UserQuery.getSearchNameOrEmail(
      "r.student_id",
      params.search_student,
      params.search_student
    );

    // 2. search major
    // @param search_major
    // var join_search_major = UserQuery.getSearchMajor("j.user_id", params.search_major);
    // var resume_search_major = UserQuery.getSearchMajor("r.student_id", params.search_major);
    var join_search_field_study = UserQuery.getSearchMulti(
      "field_study",
      "j.user_id",
      params.search_field_study
    );
    var resume_search_field_study = UserQuery.getSearchMulti(
      "field_study",
      "r.student_id",
      params.search_field_study
    );

    // 3. search study place
    // @param search_study_place
    // var join_search_place = UserQuery.getSearchStudyPlace("j.user_id", params.search_study_place);
    // var resume_search_place = UserQuery.getSearchStudyPlace("r.student_id", params.search_study_place);
    var join_search_country_study = UserQuery.getSearchSingle(
      "country_study",
      "j.user_id",
      params.search_country_study
    );
    var resume_search_country_study = UserQuery.getSearchSingle(
      "country_study",
      "r.student_id",
      params.search_country_study
    );

    // 4. search work availability
    // @param search_work_av_start, search_work_av_end
    var join_search_work_av = UserQuery.getSearchWorkAvailability(
      "j.user_id",
      params.search_work_av_month,
      params.search_work_av_year
    );
    var resume_search_work_av = UserQuery.getSearchWorkAvailability(
      "r.student_id",
      params.search_work_av_month,
      params.search_work_av_year
    );

    // 5. search_looking_for
    // @param search_looking_for
    // var join_search_looking_for = UserQuery.getSearchLookingFor("j.user_id", params.search_looking_for);
    // var resume_search_looking_for = UserQuery.getSearchLookingFor("r.student_id", params.search_looking_for);
    var join_search_looking_for = UserQuery.getSearchMulti(
      "looking_for_position",
      "j.user_id",
      params.search_looking_for
    );
    var resume_search_looking_for = UserQuery.getSearchMulti(
      "looking_for_position",
      "r.student_id",
      params.search_looking_for
    );

    // 6. university
    var join_search_university = UserQuery.getSearchSingle(
      "university",
      "j.user_id",
      params.search_university
    );
    var resume_search_university = UserQuery.getSearchSingle(
      "university",
      "r.student_id",
      params.search_university
    );

    // 7. favourite_student
    var join_search_favourite_student = UserQuery.getSearchInterested(
      params.company_id,
      "student_listing",
      "j.user_id",
      params.search_favourite_student
    );
    var resume_search_favourite_student = UserQuery.getSearchInterested(
      params.company_id,
      "student_listing",
      "r.student_id",
      params.search_favourite_student
    );

    // 8. graduation year
    var join_graduation_year = UserQuery.getSearchSingle(
      "graduation_year",
      "j.user_id",
      params.search_graduation_year
    );
    var resume_graduation_year = UserQuery.getSearchSingle(
      "graduation_year",
      "r.student_id",
      params.search_graduation_year
    );

    // 9. grade category
    var join_grade_category = UserQuery.getSearchGradeCategory(
      'grade',
      "j.user_id",
      params.search_grade_category
    );
    var resume_grade_category = UserQuery.getSearchGradeCategory(
      'grade',
      "r.student_id",
      params.search_grade_category
    );


    var cf_where = "1=1";
    var join_cf = CFQuery.getCfInList("j.user_id", "user", cfAccessStudent);
    var resume_cf = CFQuery.getCfInList(
      "r.student_id",
      "user",
      cfAccessStudent
    );

    // prepare limit
    var limit =
      typeof params.page !== "undefined" && typeof params.offset !== "undefined"
        ? DB.prepareLimit(params.page, params.offset)
        : "";

    // prepare for count
    let sel_normal = "";
    let sel_allStudent = "";
    let order_normal = "";
    let order_allStudent = "";
    let group_allStudent = "";
    if (isCount) {
      limit = "";
      sel_normal = `COUNT(Y.*) as total`;
      order_normal = "";

      sel_allStudent = `COUNT (DISTINCT u.ID) as total`;
      order_allStudent = "";
      group_allStudent = "";
    } else {
      order_normal = `ORDER BY Y.created_at desc`;
      sel_normal = `Y.*`;

      group_allStudent = "GROUP BY u.ID";
      sel_allStudent = `DISTINCT u.ID as student_id, u.user_registered, (CASE WHEN count(dc.ID) >  0 THEN 1 ELSE 0 END) as has_dc`;
      order_allStudent = "ORDER BY has_dc desc, u.user_registered desc";
    }

    var sql = `
        SELECT ${sel_normal} FROM ( 
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
                AND ${join_search_field_study}
                AND ${join_search_country_study}
                AND ${join_search_work_av}
                AND ${join_search_looking_for}
                AND ${join_search_university}
                AND ${join_graduation_year}
                AND ${join_search_favourite_student}
                AND ${join_grade_category}
                AND ${join_cf}

                UNION
            
                SELECT 
                r.student_id as student_id,
                r.created_at as created_at
                from resume_drops r
                WHERE 1=1
                AND r.company_id = ${params.company_id}
                AND ${resume_search_student}
                AND ${resume_search_field_study}
                AND ${resume_search_country_study}
                AND ${resume_search_work_av}
                AND ${resume_search_looking_for}
                AND ${resume_search_university}
                AND ${resume_graduation_year}
                AND ${resume_search_favourite_student}
                AND ${resume_grade_category}
                AND ${resume_cf}

            ) X
            GROUP BY X.student_id
        ) Y,

        companies c 
        where c.ID  =  ${params.company_id}
        and ${cf_where}

        ${order_normal}
        ${limit} `;

    // ###################################################################
    // ALL STUDENT QUERY
    // untuk cater company : -1 (all student page)

    // INNER JOIN doc_link dl ON u.ID = dl.user_id AND dl.type = 'document'
    // AND (dl.label like '%Resume%' OR dl.label = 'CV' OR dl.label like '%Curriculum Vitae%')

    var sqlAll = `
        SELECT ${sel_allStudent}
        FROM wp_cf_users u left outer join doc_link dc ON u.ID = dc.user_id
        WHERE 1=1 
        AND ${join_search_student}
        AND ${join_search_field_study}
        AND ${join_search_country_study}
        AND ${join_search_work_av}
        AND ${join_search_looking_for}
        AND ${join_search_university}
        AND ${join_graduation_year}
        AND ${join_search_favourite_student}
        AND ${join_grade_category}
        AND ${join_cf}
        ${group_allStudent}
        ${order_allStudent}
        ${limit} `;

    sqlAll = sqlAll.replaceAll("j.user_id", "u.ID");

    return useQueryForAllStudent ? sqlAll : sql;
    // return params.company_id <= 0 ? sqlAll : sql;
  }
}

function getCompanyPriv(company_id) {
  return DB.query(
    `select priviledge from companies where ID =${company_id}`
  ).then(function(res) {
    if (res[0] && res[0]["priviledge"]) {
      let priv = res[0]["priviledge"];
      try {
        priv = JSON.parse(priv);
        return priv;
      } catch (err) {
        return [];
      }
    } else {
      return [];
    }
  });
}
StudentListingQuery = new StudentListingQuery();
class StudentListingExec {
  student_listing(params, field, isCount = false) {
    var { CompanyExec } = require("./company-query.js");
    var { UserExec } = require("./user-query.js");
    var toRet = getCompanyPriv(params.company_id).then(function(priv) {
      var sql = StudentListingQuery.getStudentListing(params, priv, isCount);
      // console.log("[StudentListingExec]", sql);
      return DB.query(sql).then(function(res) {
        if(isCount){
          return res[0]["total"];
        }
        for (var i in res) {
          var student_id = res[i]["student_id"];
          if (typeof field["student"] !== "undefined") {
            res[i]["student"] = UserExec.user(
              {
                ID: student_id,
                company_id: params.company_id
              },
              field["student"]
            );
          }

          if (typeof field["company"] !== "undefined") {
            let company_id = params.company_id;
            res[i]["company"] = CompanyExec.company(
              company_id,
              field["company"]
            );
          }
        }
        return res;
      });
    });

    return toRet;
  }
}
StudentListingExec = new StudentListingExec();

module.exports = {
  StudentListingExec
};
