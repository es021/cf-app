const { getAxiosGraphQLQuery, postRequest } = require("../../helper/api-helper");
const { Time } = require("../../app/lib/time");
const { FilterNotObject } = require("../../config/xls-config")
const axios = require("axios");
const obj2arg = require("graphql-obj2arg");
const { isCustomUserInfoOff } = require("../../config/registration-config");
const { cfCustomFunnel } = require("../../config/cf-custom-config");
const { addVacancyInfoIfNeeded } = require("../../config/vacancy-config");
const { StatisticUrl } = require("../../config/app-config");
const { UserAPI } = require("./user-api");

class XLSApi {
  constructor() {
    this.globalHeaders = [];
    this.DateTime = [
      "created_at",
      "applied_at",
      "status_updated_at",
      "updated_at",
      "started_at",
      "ended_at",
      "user_registered",
      "appointment_time"
    ];
  }

  // filter in JSON object, return {filename, content}
  async export({ action, filter, cf, is_admin }) {
    this.globalHeaders = [];
    this.CF = cf;

    if (FilterNotObject.indexOf(action) <= -1) {
      if (filter !== "null") {
        try {
          filter = JSON.parse(filter);
        } catch (err) {
          return new Promise(err);
        }
      } else {
        filter = {};
      }
    }

    switch (action) {
      // xls/students/{"cf":"USA"}
      // filter == null, all cfs
      case "hybrid_check_in":
        return this.hybrid_check_in(filter.cf);
      case "hybrid_scanned_list":
        return this.hybrid_scanned_list(filter.cf, filter.type, filter.company_id);
      case "students":
        return this.students(filter.cf, filter.new_only);
      // xls/prescreens/{"company_id":1}
      // filter == null, all cfs
      case "prescreens":
        return this.prescreens(filter.company_id);
      case "resume_drops":
        return this.resume_drops(filter.company_id);
      case "sessions":
        return this.sessions(filter.company_id);
      case "session_requests":
        return this.session_requests(filter.company_id);
      // case "student_listing":
      //   return this.student_listing(filter);
      case "browse_student":
        return this.browse_student(filter, cf, is_admin);
      case "all_student":
        return this.all_student();
      case "list_job_applicants":
        return this.list_job_applicants(filter, cf, is_admin);
      case "job_posts_by_cf":
        return this.job_posts_by_cf(filter.cf);
      case "job_posts_application_by_cf_with_status":
        return this.job_posts_application_by_cf_with_status(filter.cf);
      case "job_posts_application_by_cf":
        return this.job_posts_application_by_cf(filter.cf);
      case "rec_analytic":
        return this.rec_analytic(filter);
      case "event_webinar_log":
        return this.event_webinar_log(filter);
    }
  }
  event_webinar_log(param) {
    var filename = `Event Activity - ${param.event_name}`;

    const extractData = res => {
      return res.data;
    }

    return this.fetchAndReturnPost({
      url: StatisticUrl + "/event-webinar-log",
      param: {
        event_id: param.event_id
      },
      extractData: extractData,
      filename: filename,
    });

  }
  rec_analytic(param) {
    var filename = ``;
    if (param.is_export_job_application) {
      filename = `Job Applications`;
    }
    if (param.is_export_interviews) {
      filename = `Interviews`;
    }
    if (param.is_export_profile_visit) {
      filename = `Profile Visits`;
    }

    const extractData = res => {
      return res.data;
    }

    return this.fetchAndReturnPost({
      url: StatisticUrl + "/company-statistic-count",
      param: param,
      extractData: extractData,
      filename: filename,
    });

  }

  job_posts_by_cf(cf) {
    var filename = `Job Posts`;
    var query = `query{vacancies(cf:"${cf}", order_by:"company_id asc"){ 
      ID title company{name} location application_url type 
      ${addVacancyInfoIfNeeded(cf, "specialization")} updated_at 
    }}`;

    // 2. prepare props to generate table
    const headers = null;

    // 3. resctruct data to be in one level only
    const restructData = data => {
      var hasChildren = ["company"];

      var newData = {};
      for (var key in data) {
        var d = data[key];
        if (hasChildren.indexOf(key) >= 0) {
          if (!d) {
            d = { name: "-" }
          }
          for (var k in d) {
            newData[`${key}_${k}`] = d[k];
          }
        } else {
          newData[key] = d;
        }
      }
      // newData = this.restructAppendTypeForStudent(newData, "company_");
      return newData;
    };

    // console.log("query", query)
    // 4. fetch and return
    return this.fetchAndReturn(
      query,
      "vacancies", // data field
      filename,
      headers,
      null,
      restructData
      // renameTitle //renameTitle
    );
  }

  job_posts_application_by_cf_with_status(cf) {
    var filename = `Job Post Applicant Status`;
    const extractData = res => {
      return res.data;
    }
    return this.fetchAndReturnPost({
      url: StatisticUrl + "/vacancy-application",
      param: {
        cf: cf, is_with_status: true,
      },
      extractData: extractData,
      filename: filename,
    });
  }

  job_posts_application_by_cf(cf) {
    var filename = `Job Post Applications`;
    const extractData = res => {
      return res.data;
    }
    return this.fetchAndReturnPost({
      url: StatisticUrl + "/vacancy-application",
      param: { cf: cf },
      extractData: extractData,
      filename: filename,
    });
  }


  student_field(is_admin) {
    return `ID 
      ${is_admin == "1" ? "cf" : ""} 
      user_email 
      doc_links {label url}
      interested_vacancies_by_company {title}
    `;
    // let customKeys = cfCustomFunnel({ action: 'get_keys_for_export' });
    // let additionalCustomCf = "";
    // for (var k of customKeys) {
    //   additionalCustomCf += ` ${this.addIfValid(k, cfCustomFunnel({ action: 'get_attr_by_key', key: k }))} `;
    // }
    // 8. @custom_user_info_by_cf
    //   return `
    //     ID
    //     ${is_admin == "1" ? "cf" : ""}
    //     first_name
    //     last_name
    //     user_email
    //     cf_registered_at
    //     doc_links {label url}
    //     ${additionalCustomCf}
    //     ${this.addIfValid("birth_date")}
    //     ${this.addIfValid("kpt")}
    //     ${this.addIfValid("id_utm21")}
    //     ${this.addIfValid("id_utm")}
    //     ${this.addIfValid("id_unisza")}
    //     ${this.addIfValid("local_or_oversea_study")}
    //     ${this.addIfValid("country_study")}
    //     ${this.addIfValid("monash_student_id")}
    //     ${this.addIfValid("monash_school")}
    //     ${this.addIfValid("sunway_faculty")}
    //     ${this.addIfValid("sunway_program")}
    //     ${this.addIfValid("university")}
    //     ${this.addIfValid("field_study_main")}
    //     ${this.addIfValid("field_study_secondary")}
    //     ${this.addIfValid("qualification")}
    //     ${this.addIfValid("unisza_faculty")}
    //     ${this.addIfValid("unisza_course")}
    //     ${this.addIfValid("current_semester")}
    //     ${this.addIfValid("course_status")}
    //     ${this.addIfValid("employment_status")}
    //     ${this.addIfValid("graduation_month")}
    //     ${this.addIfValid("graduation_year")}
    //     ${this.addIfValid("working_availability_month")}
    //     ${this.addIfValid("working_availability_year")}
    //     ${this.addIfValid("local_or_oversea_location")}
    //     ${this.addIfValid("gender")}
    //     ${this.addIfValid("work_experience_year")}
    //     ${this.addIfValid("grade")}
    //     ${this.addIfValid("phone_number")}
    //     ${this.addIfValid("sponsor")}
    //     ${this.addIfValid("where_in_malaysia")}
    //     ${this.addIfValid("interested_vacancies_by_company", "{title}")}
    //     ${this.addIfValid("description")}
    //     ${this.addIfValid("user_registered")}
    //     ${this.addIfValid("video_resume", "{url}")}
    //     ${this.addIfValid("extracurricular", "{val}")}
    //     ${this.addIfValid("skill", "{val}")}
    //     ${this.addIfValid("field_study", "{val}")}
    //     ${this.addIfValid("looking_for_position", "{val}")}
    //     ${this.addIfValid("interested_role", "{val}")}
    //     ${this.addIfValid("interested_job_location", "{val}")}
    // `;
  }

  addIfValid(studentField, attrList = "") {
    let toRet = studentField + " " + attrList;
    if (!this.CF) {
      return toRet;
    } else {
      if (!isCustomUserInfoOff(this.CF, studentField)) {
        return toRet;
      }
    }
    return "";
  }


  list_job_applicants(filter, cf, is_admin) {
    let is_include_status = filter.is_include_status;
    var filename = `Participant Listing`;
    var query = `query{
        interested_list (
          entity:"${filter.entity}", 
          entity_id:${filter.entity_id},
          ${filter.user_cf ? `user_cf:"${filter.user_cf}",` : ""}
          is_interested : 1
          ) 
        {
          user{${this.student_field(is_admin)}}
          ${is_include_status ? 'application_status' : ''}
        }
      } `;

    const postQuery = async data => {
      return await this.postQueryForStudentField("user", cf, data);
    }

    // 2. prepare props to generate table
    const headers = null;

    // 3. resctruct data to be in one level only
    const restructData = data => {
      var hasChildren = ["user"];
      var newData = {};
      for (var key in data) {
        var d = data[key];
        if (hasChildren.indexOf(key) >= 0) {
          for (var k in d) {
            newData[`${key}_${k}`] = d[k];
          }
        } else {
          newData[key] = d;
        }
      }
      newData = this.restructAppendTypeForStudent(newData, "user_");
      return newData;
    };

    const renameTitle = (originalTitle, dataIndex0) => {
      let toRet = originalTitle;
      toRet = `List Applicants - ${filter.title}`;
      return toRet;
    };

    // 4. fetch and return
    return this.fetchAndReturn(
      query,
      "interested_list", // data field
      filename,
      headers,
      null,
      restructData,
      renameTitle, //renameTitle
      postQuery
    );
  }
  all_student() {
    return this.browse_student(`role:"Student"`, true);
  }
  removeCfName(k) {
    // console.log(k);
    k = k.replace("oejf21_", "");
    k = k.replace("oejf22_", "");
    k = k.replace("ocpe_", "");
    return k;
  }
  async postQueryForStudentField(key, cf, data) {
    let user_ids = data.map(d => {
      return d[key]["ID"];
    })

    let res = await UserAPI.Main("get-data-for-xls", {
      cf: cf,
      user_ids: user_ids
    })
    console.log("res", res)
    for (let i in data) {
      let d = data[i];
      let id = d[key]["ID"]
      data[i] = {
        ...d,
        ...res[id]
      }
    }
    return data;
  }
  // TODO
  browse_student(filterStr, cf, is_admin) {
    var filename = `Participant Listing`;
    var query = `query{
      browse_student (${filterStr}) 
      {
          student{${this.student_field(is_admin)}}
      }
    } `;

    const postQuery = async data => {
      return await this.postQueryForStudentField("student", cf, data);
    }

    // 2. prepare props to generate table
    const headers = null;

    // 3. resctruct data to be in one level only
    const restructData = data => {
      var hasChildren = ["student"];
      var newData = {};
      for (var key in data) {
        var d = data[key];
        if (hasChildren.indexOf(key) >= 0) {
          for (var k in d) {
            let v = d[k];
            k = this.removeCfName(k);
            newData[`${key}_${k}`] = v;
          }
        } else {
          key = this.removeCfName(key);
          newData[key] = d;
        }
      }

      // // console.log("newData", newData);
      newData = this.restructAppendTypeForStudent(newData, "student_");
      return newData;
    };


    // 4. fetch and return
    // TODO
    return this.fetchAndReturn(
      query,
      "browse_student",
      filename,
      headers,
      null,
      restructData,
      null, //renameTitle
      postQuery
    );
  }

  session_requests(cid) {
    // 0. create filename
    var filename = `Session Requests - Company ${cid}`;

    // 1. create query
    var query = `query{
            session_requests(company_id:${cid}) {
              student{${this.student_field()}}
              company{name}
              status
              created_at
            }
          }`;

    const postQuery = async data => {
      return await this.postQueryForStudentField("student", cf, data);
    }

    // 2. prepare props to generate table
    const headers = null;

    // 3. resctruct data to be in one level only
    const restructData = data => {
      var hasChildren = ["student", "company"];
      var newData = {};
      for (var key in data) {
        var d = data[key];
        if (hasChildren.indexOf(key) >= 0) {
          for (var k in d) {
            newData[`${key}_${k}`] = d[k];
          }
        } else {
          newData[key] = d;
        }
      }
      return newData;
    };

    // 3 . fetch and return
    return this.fetchAndReturn(
      query,
      "session_requests",
      filename,
      headers,
      null,
      restructData,
      null,
      postQuery
    );
  }

  restructChangeHeaderForStudent(data, preKey = "") {
    let toRet = {};
    for (var k in data) {
      let newK = k;
      if (k == preKey + "interested_vacancies_by_company") {
        newK = "applied_job_post";
      } else {
        newK = newK.replace("student_", "");
        newK = newK.replace("user_", "");
      }
      toRet[newK] = data[k];
    }
    return toRet;
  }
  restructAppendTypeForStudent(newData, preKey = "") {
    // return newData;
    // TODO - for multi

    let multi_input = [
      "doc_links",
      "interested_vacancies_by_company",
    ];
    // if (!isCustomUserInfoOff(this.CF, "extracurricular")) multi_input.push("extracurricular");
    // if (!isCustomUserInfoOff(this.CF, "field_study")) multi_input.push("field_study");
    // if (!isCustomUserInfoOff(this.CF, "skill")) multi_input.push("skill");
    // if (!isCustomUserInfoOff(this.CF, "looking_for_position")) multi_input.push("looking_for_position");
    // if (!isCustomUserInfoOff(this.CF, "interested_role")) multi_input.push("interested_role");
    // if (!isCustomUserInfoOff(this.CF, "interested_job_location")) multi_input.push("interested_job_location");
    // for (let customMulti of cfCustomFunnel({ action: 'get_keys_multi' })) {
    //   if (!isCustomUserInfoOff(this.CF, customMulti)) {
    //     multi_input.push(this.removeCfName(customMulti));
    //   }
    // }
    for (var i in multi_input) {
      let key = multi_input[i];
      key = preKey + key;
      let multiArr = newData[key];
      let multiStr = "";

      let isDocLink = key.indexOf("doc_links") >= 0;
      if (Array.isArray(multiArr)) {
        multiArr.map((d, j) => {
          let toRet = "";
          if (j > 0 && !isDocLink) {
            toRet += " | ";
          }

          let v = d.val;
          if (key.indexOf("interested_vacancies_by_company") >= 0) {
            v = d.title;
          } else if (isDocLink) {
            v = `<a href="${d.url}">${d.label}</a><br>`;
          }

          multiStr += `${toRet}${v}`;
        });
        newData[key] = multiStr;
      } else {
        newData[key] = "-";
      }
    }
    newData = this.restructChangeHeaderForStudent(newData, preKey);
    return newData;
  }

  resume_drops(cid) {
    // 0. create filename
    var filename = `Resume Drops - Company ${cid}`;

    // 1. create query
    var query = `query{
            resume_drops(company_id:${cid}) {
              message
              student{${this.student_field()}}
              company{name}
              created_at
              updated_at
            }
          }`;

    const postQuery = async data => {
      return await this.postQueryForStudentField("student", cf, data);
    }


    // 2. prepare props to generate table
    const headers = null;

    // 3. resctruct data to be in one level only
    const restructData = data => {
      var hasChildren = ["student", "company"];
      var newData = {};
      for (var key in data) {
        var d = data[key];
        if (hasChildren.indexOf(key) >= 0) {
          for (var k in d) {
            newData[`${key}_${k}`] = d[k];
          }
        } else {
          newData[key] = d;
        }
      }
      return newData;
    };

    // 3 . fetch and return
    return this.fetchAndReturn(
      query,
      "resume_drops",
      filename,
      headers,
      null,
      restructData,
      null,
      postQuery
    );
  }

  prescreens(cid) {
    // 0. create filename
    var filename = `Prescreens Registration - Company ${cid}`;

    // 1. create query
    var query = `query{
            prescreens(company_id:${cid}, special_type:"Pre Screen") {
              student{${this.student_field()}}
              created_at
              company{name}
              status
              special_type
              appointment_time
              updated_at
              updated_by
            }
          }`;

    const postQuery = async data => {
      return await this.postQueryForStudentField("student", cf, data);
    }

    // 2. prepare props to generate table
    const headers = null;

    // 3. resctruct data to be in one level only
    const restructData = data => {
      var hasChildren = ["student", "company"];
      var newData = {};
      for (var key in data) {
        var d = data[key];
        if (hasChildren.indexOf(key) >= 0) {
          for (var k in d) {
            newData[`${key}_${k}`] = d[k];
          }
        } else {
          newData[key] = d;
        }
      }
      return newData;
    };

    // 3 . fetch and return
    return this.fetchAndReturn(
      query,
      "prescreens",
      filename,
      headers,
      null,
      restructData,
      null,
      postQuery
    );
  }

  sessions(cid) {
    // 0. create filename
    var filename = `Past Sessions - Company ${cid}`;

    // 1. create query
    var query = `query{
            sessions(company_id:${cid}) {
              session_notes{note}
              session_ratings{category rating}
              student{${this.student_field()}}
              company{name}
              created_at
              started_at
              ended_at
            }
          }`;

    const postQuery = async data => {
      return await this.postQueryForStudentField("student", cf, data);
    }

    // 2. prepare props to generate table
    const headers = null;

    // 3. resctruct data to be in one level only
    const restructData = data => {
      var hasChildren = ["student", "company"];
      var newData = {};
      for (var key in data) {
        var d = data[key];
        if (hasChildren.indexOf(key) >= 0) {
          for (var k in d) {
            newData[`${key}_${k}`] = d[k];
          }
        } else {
          newData[key] = d;
        }
      }
      return newData;
    };

    var rowHook = (k, data) => {
      if (k.indexOf("session_notes") >= 0) {
        var toRet = "";
        data.map((d, i) => {
          if (i > 0) {
            toRet += "<br>";
          }
          toRet += `${d.note}`;
        });
        return toRet;
      } else if (k.indexOf("session_ratings") >= 0) {
        var toRet = "";
        data.map((d, i) => {
          if (i > 0) {
            toRet += "<br>";
          }
          toRet += `${d.category} - ${d.rating}`;
        });
        return toRet;
      } else {
        return data;
      }
    };
    // 3 . fetch and return
    return this.fetchAndReturn(
      query,
      "sessions",
      filename,
      headers,
      rowHook,
      restructData,
      null,
      postQuery
    );
  }

  hybrid_scanned_list(cf, type, company_id) {
    const isTypeExhibitor = type == "exhibitor"
    const isTypeVisitor = type == "visitor"

    var filename = "";
    let param = `cf:"${cf}"`

    if (isTypeExhibitor) {
      filename = company_id ? `Your Profile QR Scanned - ${cf}` : `Exhibitor's QR Scanned - ${cf}`;
      param += `
        type:"company" 
        ${company_id ? `company_id:${company_id}` : ``}
      `
    } else if (isTypeVisitor) {
      filename = company_id ? `Visitor's QR Scanned By You - ${cf}` : `Visitor's QR Scanned - ${cf}`;
      param += `
        type:"user" 
        ${company_id ? `scanned_by_company_id:${company_id}` : ``}
      `
    }

    var query = `query{
        qr_scans(${param})
        { 
            ID qr_id
            qr{ url user{ ID first_name last_name user_email } company{ ID name } }
            logged_in_user{ ID first_name last_name role }
            created_at,
        }
    }`;
    const headers = null;
    const restructData = data => {
      console.log("data", data)
      let r = {
        qr_profile_id: data.qr.user && data.qr.user.ID
          ? `${data.qr.user.ID}`
          : `${data.qr.company.ID}`,
        qr_profile: data.qr.user && data.qr.user.ID
          ? `${data.qr.user.first_name} ${data.qr.user.last_name}`
          : `${data.qr.company.name}`,
      }
      if (isTypeVisitor) {
        r["qr_profile_email"] = data.qr.user && data.qr.user.ID
          ? `${data.qr.user.user_email}`
          : ``;
      }

      r = {
        ...r,
        scanned_by: data.logged_in_user ? `${data.logged_in_user.first_name} ${data.logged_in_user.last_name}` : `-`,
        scanned_by_role: data.logged_in_user ? `${data.logged_in_user.role}` : `-`,
        scanned_at: data.created_at
      }
      return r;
    };
    return this.fetchAndReturn(
      query,
      "qr_scans",
      filename,
      headers,
      null,
      restructData
    );
  }
  hybrid_check_in(cf) {
    var filename = `Visitor Check In Record - ${cf}`;
    var query = `query{
      qr_check_ins(cf:"${cf}")
      { 
          user {ID first_name last_name user_email},
          checked_in_by_user {first_name last_name},
          created_at
      }
    }`;
    const headers = null;
    const restructData = data => {
      console.log("data", data)
      let r = {
        user_id: data.user.ID,
        user_email: data.user.user_email,
        user_name: `${data.user.first_name} ${data.user.last_name}`,
        checked_in_by: data.checked_in_by_user ? `${data.checked_in_by_user.first_name} ${data.checked_in_by_user.last_name}` : `-`,
        checked_in_at: data.created_at
      }
      return r;
    };
    return this.fetchAndReturn(
      query,
      "qr_check_ins",
      filename,
      headers,
      null,
      restructData
    );
  }
  students(cf, new_only) {
    // 0. create filename
    var filename = `Student Data ${cf}`;

    // 1. create query
    var cf_con = typeof cf !== "undefined" ? `,cf:"${cf}"` : "";
    var nw_con = typeof new_only !== "undefined" ? `,new_only:${new_only}` : "";
    var query = `query{ users(role:"student" ${cf_con} ${nw_con}) {
              ID
              user_email
              first_name
              last_name
              user_registered
              mas_state
              mas_postcode
              relocate
              study_place
              looking_for
              gender
              major
              minor
              university
              phone_number
              cgpa
              graduation_month
              graduation_year
              available_month
              available_year
              description
              user_status
              doc_links {label url} }}`;
    //  cgpa

    // 2. prepare props to generate table
    const headers = null;
    const rowHook = (key, d) => {
      return d;
    };

    const restructData = data => {
      return this.restructAppendTypeForStudent(data);
    };

    // 3 . fetch and return
    return this.fetchAndReturn(
      query,
      "users",
      filename,
      headers,
      null,
      restructData
    );
  }

  // ######################################################################
  // Helper functions ------------------------------------------------

  // append doc links into seperate row at the end of record
  restructAppendType({ data, key, label, renderCol }) {
    var newData = {};

    var datasAttr = data[key];

    for (var k in data) {
      if (k !== key) {
        newData[k] = data[k];
      }
    }

    if (!datasAttr) {
      newData[key] = "-";
    } else {
      if (!Array.isArray(datasAttr)) {
        datasAttr = [datasAttr];
      }
      for (var i in datasAttr) {
        var key = label + "_" + (Number.parseInt(i) + 1);
        var d = datasAttr[i];

        if (key.indexOf("attachment") >= 0 && this.globalHeaders.indexOf(key) <= -1) {
          this.globalHeaders.push(key);
        }

        newData[key] = renderCol(d);
      }
    }

    return newData;
  }

  //   rowDocLinks(d) {
  //     var toRet = "";
  //     d.map((doc, i) => {
  //       toRet += `<a href="${doc.url}">${doc.label}</a><br>`;
  //     });
  //     d = toRet;
  //     return d;
  //   }

  fetchSuccessHandler({
    filename,
    data,
    headers = null,
    rowHook = null,
    restructData = null,
    renameTitle = null,
  }) {
    if (renameTitle != null) {
      // let datas = res.data.data[dataField];
      if (data.length > 0) {
        let dataIndex0 = data[0];
        if (restructData !== null) {
          dataIndex0 = restructData(dataIndex0);
        }
        filename = renameTitle(filename, dataIndex0);
      }
    }

    var content = this.generateTable(
      filename,
      data,
      headers,
      rowHook,
      restructData
    );
    return {
      filename: filename,
      content: content
    };
  }

  fetchAndReturn(
    query,
    dataField,
    filename,
    headers = null,
    rowHook = null,
    restructData = null,
    renameTitle = null,
    postQuery = null,
  ) {
    return getAxiosGraphQLQuery(query).then(
      async (res) => {
        let data = res.data.data[dataField];
        if (postQuery) {
          data = await postQuery(data);
        }
        return this.fetchSuccessHandler({
          data,
          filename,
          headers,
          rowHook,
          restructData,
          renameTitle
        });
      },
      err => {
        return err;
      }
    );
  }

  fetchAndReturnPost({
    url,
    param,
    filename,
    headers = null,
    rowHook = null,
    extractData = (res) => { res.data },
    restructData = null,
    renameTitle = null
  }) {
    return postRequest(url, param).then(
      res => {
        let data = extractData(res);
        return this.fetchSuccessHandler({
          data,
          filename,
          headers,
          rowHook,
          restructData,
          renameTitle
        });
      },
      err => {
        return err;
      }
    );
  }

  generateHeader(headers) {
    var r = `<th>#</th>`;
    for (var i in headers) {
      r += `<th>${headers[i]}</th>`;
    }
    return `<tr>${r}</tr>`;
  }

  defaultRowHook(k, d) {
    let isDateTime = false;
    for (var i in this.DateTime) {
      if (k.indexOf(this.DateTime[i]) >= 0) {
        isDateTime = true;
        break;
      }
    }
    if (isDateTime) {
      let t = Time.getString(d);
      return t;
    }

    // if (k.indexOf("doc_links") >= 0) {
    //   return this.rowDocLinks(d);
    // }

    return d;
  }

  generateRow(rownum, data, rowHook) {
    var r = `<td>${Number.parseInt(rownum) + 1}</td>`;
    for (var i in data) {
      var d = data[i];
      if (rowHook != null) {
        d = rowHook(i, d);
      }

      d = this.defaultRowHook(i, d);
      if (d === null || typeof d === "undefined") {
        d = "-";
      }
      r += `<td>${d}</td>`;
    }
    return `<tr>${r}</tr>`;
  }

  // row hook to handle field of type list, such as doc_links
  generateTable(
    title,
    datas,
    headers = null,
    rowHook = null,
    restructData = null
  ) {
    var fileTitle = `<tr>
            <h2>${title}</h2>
            ** Data as of ${Time.getString("now")} **<br>
            ** All timestamps are in timezone ${Time.getTimezone()} **
        </tr>`;

    var rows = "";
    for (var i in datas) {
      var d = null;
      if (restructData !== null) {
        d = restructData(datas[i]);
      } else {
        d = datas[i];
      }

      // create header from object keys
      if (headers == null) {
        headers = Object.keys(d);
      }

      rows += this.generateRow(i, d, rowHook);
    }

    // add global headers
    for (let h of this.globalHeaders) {
      if (headers.indexOf(h) <= -1) {
        headers.push(h);
      }
    }

    return `<table>${fileTitle} ${this.generateHeader(
      headers
    )} ${rows}</table>`;
  }
}

XLSApi = new XLSApi();

module.exports = {
  XLSApi
};
