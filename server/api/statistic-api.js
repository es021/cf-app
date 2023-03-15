const DB = require("../model/DB.js");
const { UserQuery } = require("../model/user-query.js");
const { graphql } = require("../../helper/api-helper");
const { Time } = require("../../app/lib/time.js");

class StatisticAPI {
    Main(action, param) {

        switch (action) {
            case "vacancy-application":
                return this.vacancyApplication(param);
            case "daily-registration":
                return this.dailyRegistration(param);
            case "hourly-qr-check-in":
                return this.hourlyQrCheckIn(param);
            case "hourly-company-scanned":
                return this.hourlyCompanyScanned(param);
            case "company-statistic-count":
                return this.companyStatisticCount(param);
            case "event-webinar-log":
                return this.eventWebinarLog(param);

        }
    }
    // countForHybridEvent(param){
    //     let cf = param.cf;
    //     let company_id = param.company_id;


    //     // - Total number of check-in
    //     // - Total number of company profile QR scanned
    //     // - Total number of visitor QR scanned by exhibitors

    //     // - Total number of check-in
    //     // - Total number of this particular exhibitor profile QR scanned (unique by user)
    //     // - Total number of visitor QR scanned by this exhibitor


    // }
    eventWebinarLog(param) {
        let event_id = param.event_id;

        let q = `select 
        c.ID as company_id, 
        c.name as company_name, 
        e.ID as event_id, 
        e.title as event_name, 
        el.action, 
        el.user_id as participant_id, 
        (${UserQuery.selectSingleMain("u.ID", "first_name")}) as participant_first_name,
        (${UserQuery.selectSingleMain("u.ID", "last_name")}) as participant_last_name,
        u.user_email as participant_email, 
        (${UserQuery.selectSingleMain("u.ID", "tcrep_question_for_company")}) as participant_question_for_company,
        UNIX_TIMESTAMP(el.created_at) as created_at 
        from events e, event_logs el, companies c, wp_cf_users u 
        
        where 1=1 
        and e.ID = ?
        and u.ID = el.user_id 
        and e.ID = el.event_id 
        and c.ID = el.company_id 
        
        order by c.ID, e.ID, el.action
        `;

        q = DB.prepare(q, [event_id]);

        return DB.query(q).then(res => {
            return res;
        })
    }
    companyStatisticCount(param) {
        let cf = param.cf
        let cf_start = param.cf_start;
        let cf_end = param.cf_end;
        let company_id = param.company_id;

        let is_export_job_application = param.is_export_job_application;
        let is_export_interviews = param.is_export_interviews;
        let is_export_profile_visit = param.is_export_profile_visit;

        let is_graph_profile_visit = param.is_graph_profile_visit;

        let promises = [];

        // ######################################################
        // ######################################################
        // // 1. total interviews
        promises.push(
            graphql(`query{ prescreens_count(not_prescreen:1 ,cf: "${cf}", company_id:${company_id}) }`)
        );

        // return here if for export excel
        if (is_export_interviews) {
            return graphql(`query{ prescreens(not_prescreen:1 ,cf: "${cf}", company_id:${company_id}, order_by:"status asc"){
              ID 
              status 
              student{ID first_name last_name user_email} 
              recruiter{ID first_name last_name user_email}  
              appointment_time
            } }`).then(res => {
                let toRet = []
                for (let r of res.data.data.prescreens) {
                    let i = 0;
                    let statuses = [];
                    for (let s of r.status.split("_")) {
                        i++;
                        if (i == 1) {
                            continue;
                        }
                        statuses.push(s);
                    }
                    toRet.push({
                        interview_id: r.ID,
                        status: statuses.join(" "),
                        appointment_time: Time.getString(r.appointment_time),

                        student_id: r.student.ID,
                        student_name: `${r.student.first_name} ${r.student.last_name}`,
                        student_email: r.student.user_email,

                        recruiter_id: !r.recruiter ? '-' : r.recruiter.ID,
                        recruiter_name: !r.recruiter ? '-' : `${r.recruiter.first_name} ${r.recruiter.last_name}`,
                        recruiter_email: !r.recruiter ? '-' : r.recruiter.user_email,
                    })
                }

                return toRet
            });
        }

        // ######################################################
        // ######################################################
        // 2. total job applications
        let qJob = `
        SELECT 
        ${is_export_job_application
                ? `
                    i.user_id, u.user_email, v.ID as vacancy_id, v.title as vacancy_title, 
                    DATE_FORMAT(convert_tz(i.updated_at, '+00:00', '+08:00'), '%Y-%m-%d %H:%i:%s')  as applied_on
                `
                : `COUNT(i.ID) as ttl `
            }
        FROM interested i, vacancies v, wp_cf_users u
        WHERE 1=1 
            AND u.ID = i.user_id
            AND i.entity_id = v.ID 
            AND i.entity = "vacancies" 
            AND i.is_interested = 1
            AND v.company_id = ?
        ORDER BY i.updated_at desc
        `;

        qJob = DB.prepare(qJob, [company_id]);
        promises.push(DB.query(qJob));

        // return here if for export excel
        if (is_export_job_application) {
            return DB.query(qJob);
        }

        // ######################################################
        // ######################################################
        // 3. total profile visits
        // SELECT COUNT(DISTINCT user_id) as ttl
        let qVisitSelect = "";
        if (is_export_profile_visit) {
            qVisitSelect = `
                u.ID as user_id, u.user_email, 
                CONCAT(
                    (${UserQuery.selectSingleMain("u.ID", "first_name")}),
                    " ",
                    (${UserQuery.selectSingleMain("u.ID", "last_name")})
                ) as user_name,
                DATE_FORMAT(convert_tz(l.created_at, '+00:00', '+08:00'), '%Y-%m-%d')  as date_visit,  
                DATE_FORMAT(convert_tz(l.created_at, '+00:00', '+08:00'), '%H:%i:%s')  as time_visit
            `;
        }
        else if (is_graph_profile_visit) {
            qVisitSelect = `
                CONCAT( 
                    DATE_FORMAT(convert_tz(l.created_at, '+00:00', '+08:00'), '%Y-%m-%d-%H'), "::", 
                    DATE_FORMAT(convert_tz(l.created_at, '+00:00', '+08:00'), '%b %d - %l%p')
                ) AS dt,
                COUNT(l.id) as ttl
            `;
        } else {
            qVisitSelect = `COUNT(l.id) as ttl`;
        }

        let qVisits = `
                SELECT ${qVisitSelect}

                FROM logs l, wp_cf_users u, cf_map m
                where 1=1 
                
                and u.ID = l.user_id 
                and u.user_email not like 'test%' 
                
                and m.entity_id = u.ID
                and m.entity = "user" 
                
                and l.user_id = m.entity_id 
                and l.data IN ("/company/${company_id}", "/company/${company_id}/")
                and l.event = "open_page" 
                
                and m.cf = ? 
                and l.created_at >= FROM_UNIXTIME(?) 
                and l.created_at <= FROM_UNIXTIME(?) 

                ${is_graph_profile_visit ? "GROUP BY dt" : ""}

                ORDER BY ${is_graph_profile_visit ? "dt ASC" : "l.created_at DESC"}
            `;

        //and SUBSTRING(l.data, 10, 9) = ? 

        qVisits = DB.prepare(qVisits, [
            cf,
            cf_start,
            cf_end
        ]);

        console.log("qVisits", qVisits);

        if (is_graph_profile_visit) {
            return DB.query(qVisits).then(res => {
                for (let i in res) {
                    res[i]["dt"] = res[i]["dt"].split("::")[1];
                }
                return res;
            })
        }

        // return here if for export excel
        if (is_export_profile_visit) {
            return DB.query(qVisits);
        }

        promises.push(DB.query(qVisits));


        // ######################################################
        // ######################################################
        // MAIN PROCESS

        return Promise.all(promises).then(res => {
            let resIv = res[0].data.data
            let resJob = res[1]
            let resVisit = res[2]

            let toRet = {};
            if (resIv && resIv["prescreens_count"]) {
                toRet["countInterview"] = resIv["prescreens_count"]
            }
            if (resJob && resJob[0] && resJob[0]["ttl"]) {
                toRet["countJobApplication"] = resJob[0]["ttl"]
            }
            if (resVisit && resVisit[0] && resVisit[0]["ttl"]) {
                toRet["countVisitor"] = resVisit[0]["ttl"]
            }

            console.log(toRet);

            return toRet;
        });
    }

    _hourlyLabel(_date) {
        if (!_date) {
            return "";
        }
        let h = _date.getHours();
        let pm_am = "";
        if (h >= 12) {
            pm_am = "PM";
            if (h >= 13) {
                h -= 12;
            }
        } else {
            pm_am = "AM";
            if (h == 0) {
                h = 12;
            }
        }
        return `${_date.getDate()}/${_date.getMonth()}-${h}${pm_am}`
    }
    hourlyCompanyScanned(param) {
        let cf = param.cf;
        let company_id = param.company_id;

        let where = " AND i.cf = ? ";
        let whereParam = [cf];

        if (company_id) {
            where += " AND i.company_id = ? "
            whereParam.push(company_id)
        }

        let q = `SELECT 
        CONCAT(DATE_FORMAT(DATE_ADD(s.created_at, INTERVAL 8 HOUR), '%Y-%c-%d-%H')) AS dt,
        COUNT(*) as ttl
        FROM qr_scan s, qr_img i
        WHERE 1=1
        AND i.ID = s.qr_id
        AND i.type = 'company'
        ${where}
        GROUP BY dt
        ORDER BY dt asc`;

        q = DB.prepare(q, whereParam);
        return DB.query(q).then(res => {
            let toReturn = [];
            let map = {}

            for (let r of res) {
                map[r["dt"]] = r["ttl"]
            }

            if (res.length > 0) {
                let min = res[0]["dt"];
                let max = res[res.length - 1]["dt"];

                let current = min;
                let currentDate = this._getDateObj(current);
                let index = 0;

                while (current != max) {
                    try {
                        let date = this._getDateObj(current);
                        toReturn.push({
                            dt: this._hourlyLabel(date),
                            ttl: map[current] ? map[current] : 0
                        })

                        date.setHours(date.getHours() + 1);

                        currentDate = date;
                        current = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`

                        index++;
                        if (index > 100) {
                            break;
                        }
                    } catch (err) {

                    }
                }
                toReturn.push({
                    dt: this._hourlyLabel(currentDate),
                    ttl: map[current] ? map[current] : 0
                })
            }
            return toReturn;
        })

    }
    // text : %Y-%m-%d-%H
    // eg: 2021-01-03-15
    _getDateObj(text){
        let year = Number.parseInt(text.split("-")[0]);
        let month = Number.parseInt(text.split("-")[1]);
        let day = Number.parseInt(text.split("-")[2]);
        let hour = Number.parseInt(text.split("-")[3]);
        return new Date(year, month, day, hour)
    }
    hourlyQrCheckIn(param) {
        let cf = param.cf;
        // CONCAT(DATE_FORMAT(c.created_at, '%Y-%m-%d-%H'), "::", DATE_FORMAT(c.created_at, '%e/%d-%l%p')) AS dt,
        let q = `SELECT 
        CONCAT(DATE_FORMAT(DATE_ADD(c.created_at, INTERVAL 8 HOUR), '%Y-%c-%d-%H')) AS dt,
        COUNT(*) as ttl
        FROM qr_check_in c
        WHERE 1=1
        AND c.cf = ? 
        GROUP BY dt
        ORDER BY dt asc`;


        q = DB.prepare(q, [cf])
        return DB.query(q).then(res => {
            let toReturn = [];
            let map = {}

            for (let r of res) {
                map[r["dt"]] = r["ttl"]
            }

            if (res.length > 0) {


                let min = res[0]["dt"];
                let max = res[res.length - 1]["dt"];

                let current = min;
                let currentDate = this._getDateObj(current);
                let index = 0;

                while (current != max) {
                    let date = this._getDateObj(current);
                    toReturn.push({
                        dt: this._hourlyLabel(date),
                        ttl: map[current] ? map[current] : 0
                    })

                    date.setHours(date.getHours() + 1);

                    currentDate = date;
                    current = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`

                    index++;
                    if (index > 100) {
                        break;
                    }
                }
                toReturn.push({
                    dt: this._hourlyLabel(currentDate),
                    ttl: map[current] ? map[current] : 0
                })
            }
            return toReturn;
        })
    }
    dailyRegistration(param) {
        let cf = param.cf;

        let q = `SELECT 
        CONCAT(DATE_FORMAT(cm.created_at, '%Y-%m-%d'), "::", DATE_FORMAT(cm.created_at, '%b %d')) AS dt,
        COUNT(*) as ttl
        FROM cf_map cm
        WHERE 1=1
        AND cm.cf = ? 
        AND cm.entity = 'user'
        AND ${UserQuery.isRoleStudent("cm.entity_id")}
        GROUP BY dt
        ORDER BY dt asc`;

        q = DB.prepare(q, [cf])
        return DB.query(q).then(res => {
            for (let i in res) {
                res[i]["dt"] = res[i]["dt"].split("::")[1];
            }
            return res;
        })
    }
    vacancyApplication(param) {
        console.log("param", param)
        let is_count = param.is_count;
        let is_with_status = param.is_with_status;
        let cf = param.cf;

        let select = "";
        let order_by = ""
        let where = "";


        if (is_count) {
            select = `COUNT(*) as total`
        } else {
            select = `
            i.user_id, u.user_email, v.ID as vacancy_id, 
            v.title as vacancy_title, c.ID as company_id, c.name as company_name, 
            UNIX_TIMESTAMP(i.created_at) as applied_at 
            `;
            order_by = `ORDER BY i.user_id, c.ID, i.created_at`;
        }


        if (is_with_status) {
            where += ` AND i.application_status IS NOT NULL AND i.application_status != '' `
            select += ` , i.application_status , UNIX_TIMESTAMP(i.updated_at) as status_updated_at `
        }

        let q = `SELECT ${select}
        FROM vacancies v , companies c, interested i, wp_cf_users u 
        WHERE 1=1 and u.ID = i.user_id 
        and i.is_interested = 1 and v.ID = i.entity_id 
        and i.entity = "vacancies" 
        and i.user_id IN 
            ( select m.entity_id from cf_map m where m.entity = "user" 
            and m.entity_id = i.user_id and m.cf = ? ) 
        and v.company_id IN 
            ( select m.entity_id from cf_map m where m.entity = "company" 
            and m.entity_id = v.company_id and m.cf = ? ) 
        and v.company_id = c.ID 
        ${where}
        ${order_by}`;

        q = DB.prepare(q, [cf, cf])
        return DB.query(q).then(res => {
            console.log(res);
            if (is_count) {
                return res[0];
            }
            return res;
        })
    }
}

StatisticAPI = new StatisticAPI();
module.exports = { StatisticAPI };
