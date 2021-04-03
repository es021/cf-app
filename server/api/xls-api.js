const { getAxiosGraphQLQuery, postRequest } = require("../../helper/api-helper");
const { Time } = require("../../app/lib/time");
const { FilterNotObject } = require("../../config/xls-config")
const axios = require("axios");
const obj2arg = require("graphql-obj2arg");
const { isCustomUserInfoOff } = require("../../config/registration-config");
const { cfCustomFunnel } = require("../../config/cf-custom-config");
const { addVacancyInfoIfNeeded } = require("../../config/vacancy-config");
const { StatisticUrl } = require("../../config/app-config");

class XLSApi {
  constructor() {

    this.DateTime = [
      "created_at",
      "updated_at",
      "started_at",
      "ended_at",
      "user_registered",
      "appointment_time"
    ];
  }

  // filter in JSON object, return {filename, content}
  export({ action, filter, cf, is_admin }) {
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
      case "job_posts_application_by_cf":
        return this.job_posts_application_by_cf(filter.cf);
    }
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

    console.log("query", query)
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
    let customKeys = cfCustomFunnel({ action: 'get_keys_for_export' });
    let additionalCustomCf = "";
    for (var k of customKeys) {
      additionalCustomCf += ` ${this.addIfValid(k, cfCustomFunnel({ action: 'get_attr_by_key', key: k }))} `;
    }
    // 8. @custom_user_info_by_cf
    return `
      ID
      ${is_admin == "1" ? "cf" : ""}
      first_name
      last_name
      user_email
      doc_links {label url}
      ${additionalCustomCf}
      ${this.addIfValid("birth_date")}
      ${this.addIfValid("kpt")}
      ${this.addIfValid("id_utm21")}
      ${this.addIfValid("id_utm")}
      ${this.addIfValid("id_unisza")}
      ${this.addIfValid("local_or_oversea_study")}
      ${this.addIfValid("country_study")}
      ${this.addIfValid("monash_student_id")}
      ${this.addIfValid("monash_school")}
      ${this.addIfValid("sunway_faculty")}
      ${this.addIfValid("sunway_program")}
      ${this.addIfValid("university")}
      ${this.addIfValid("field_study_main")}
      ${this.addIfValid("field_study_secondary")}
      ${this.addIfValid("qualification")}
      ${this.addIfValid("unisza_faculty")}
      ${this.addIfValid("unisza_course")}
      ${this.addIfValid("current_semester")}
      ${this.addIfValid("course_status")}
      ${this.addIfValid("employment_status")}
      graduation_month 
      graduation_year
      working_availability_month 
      working_availability_year
      ${this.addIfValid("local_or_oversea_location")}
      ${this.addIfValid("gender")}
      ${this.addIfValid("work_experience_year")}
      grade 
      phone_number 
      sponsor
      ${this.addIfValid("where_in_malaysia")}
      interested_vacancies_by_company{ title }
      ${this.addIfValid("description")}
      ${this.addIfValid("user_registered")}
      ${this.addIfValid("video_resume", "{url}")}
      ${this.addIfValid("extracurricular", "{val}")}
      ${this.addIfValid("skill", "{val}")}
      ${this.addIfValid("field_study", "{val}")}
      ${this.addIfValid("looking_for_position", "{val}")}
      ${this.addIfValid("interested_role", "{val}")}
      ${this.addIfValid("interested_job_location", "{val}")}
  `;
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
    console.log("filter", filter)
    var filename = `Participant Listing`;
    var query = `query{
        interested_list (
          entity:"${filter.entity}", 
          entity_id:${filter.entity_id},
          ${filter.user_cf ? `user_cf:"${filter.user_cf}",` : ""}
          is_interested : 1) 
        {
          user{${this.student_field(is_admin)}}
        }
      } `;

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
      renameTitle //renameTitle
    );
  }
  all_student() {
    return this.browse_student(`role:"Student"`, true);
  }
  browse_student(filterStr, cf, is_admin) {
    var filename = `Participant Listing`;
    var query = `query{
      browse_student (${filterStr}) 
      {
          student{${this.student_field(is_admin)}}
      }
    } `;

    // first_name last_name user_email phone_number
    // grade university country_study where_in_malaysia
    // graduation_month graduation_year  
    // working_availability_month working_availability_year
    // qualification
    // description 
    // interested_vacancies_by_company{ title }
    // doc_links {type label url} 
    // field_study{val} 
    // looking_for_position{val}

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
            newData[`${key}_${k}`] = d[k];
          }
        } else {
          newData[key] = d;
        }
      }
      newData = this.restructAppendTypeForStudent(newData, "student_");
      return newData;
    };

    // 3. rename title use company name
    // const renameTitle = (originalTitle, dataIndex0) => {
    //   let toRet = originalTitle;
    //   if (typeof dataIndex0["company_name"] !== "undefined") {
    //     toRet = `Participant Listing - ${dataIndex0["company_name"]}`;
    //   }
    //   return toRet;
    // };

    // 4. fetch and return
    return this.fetchAndReturn(
      query,
      "browse_student",
      filename,
      headers,
      null,
      restructData,
      null//renameTitle
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
      restructData
    );
  }

  //EUR FIX
  // student_listing(filter) {
  //   let cid = filter.company_id;
  //   let cf = filter.cf;
  //   let for_rec = filter.for_rec;

  //   // debug
  //   for_rec = typeof for_rec === "undefined" ? false : for_rec;

  //   // 0. create filename
  //   var filename = `Participant Listing - Company ${cid}`;

  //   let queryParam = JSON.parse(JSON.stringify(filter));
  //   delete queryParam["for_rec"];

  //   // console.log("queryParam",queryParam)
  //   // console.log("queryParam",queryParam)
  //   // console.log("queryParam",queryParam)
  //   // console.log("queryParam",queryParam)
  //   // console.log("queryParam",queryParam)
  //   // 1. create query
  //   var query = `query{
  //           student_listing(${obj2arg(queryParam, {
  //     noOuterBraces: true
  //   })}) {
  //             student{${this.student_field()}}
  //             company{name}
  //           }
  //         }`;

  //   // 2. prepare props to generate table
  //   const headers = null;

  //   // 3. resctruct data to be in one level only
  //   const restructData = data => {
  //     var hasChildren = ["student", "company"];
  //     var newData = {};
  //     for (var key in data) {
  //       var d = data[key];
  //       if (hasChildren.indexOf(key) >= 0) {
  //         for (var k in d) {
  //           newData[`${key}_${k}`] = d[k];
  //         }
  //       } else {
  //         newData[key] = d;
  //       }
  //     }

  //     newData = this.restructAppendTypeForStudent(newData, "student_");

  //     // removed some data for recruiter
  //     if (for_rec) {
  //       var toRemoved = ["student_ID", "created_at"];
  //       for (var i in toRemoved) {
  //         delete newData[toRemoved[i]];
  //       }
  //     }

  //     return newData;
  //   };

  //   // 3. rename title use company name
  //   const renameTitle = (originalTitle, dataIndex0) => {
  //     let toRet = originalTitle;
  //     if (typeof dataIndex0["company_name"] !== "undefined") {
  //       toRet = `Participant Listing - ${dataIndex0["company_name"]}`;
  //     }
  //     return toRet;
  //   };

  //   // 4. fetch and return
  //   return this.fetchAndReturn(
  //     query,
  //     "student_listing",
  //     filename,
  //     headers,
  //     null,
  //     restructData,
  //     renameTitle
  //   );
  // }
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
    newData = this.restructAppendType({
      data: newData,
      key: preKey + "video_resume",
      label: "video resume",
      renderCol: d => {
        return `<a href="${d.url}">${d.url}</a><br>`;
      }
    });
    newData = this.restructAppendType({
      data: newData,
      key: preKey + "doc_links",
      label: "attachment",
      renderCol: d => {
        return `<a href="${d.url}">${d.label}</a><br>`;
      }
    });

    let multi_input = [
      "interested_vacancies_by_company",
      "extracurricular",
      "field_study",
      "skill",
      "looking_for_position",
      "interested_role",
      "interested_job_location",
    ];

    for (let customMulti of cfCustomFunnel({ action: 'get_keys_multi' })) {
      if (!isCustomUserInfoOff(this.CF, customMulti)) {
        multi_input.push(customMulti);
      }
    }

    for (var i in multi_input) {
      let key = multi_input[i];
      key = preKey + key;
      let multiArr = newData[key];
      let multiStr = "";

      if (Array.isArray(multiArr)) {
        multiArr.map((d, j) => {
          let toRet = "";
          if (j > 0) {
            toRet += " | ";
          }

          let v = d.val;
          if (key.indexOf("interested_vacancies_by_company") >= 0) {
            v = d.title;
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
      restructData
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
      restructData
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
              sponsor
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
    renameTitle = null
  ) {
    return getAxiosGraphQLQuery(query).then(
      res => {
        let data = res.data.data[dataField];
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

    return `<table>${fileTitle} ${this.generateHeader(
      headers
    )} ${rows}</table>`;
  }
}

XLSApi = new XLSApi();

module.exports = {
  XLSApi
};
