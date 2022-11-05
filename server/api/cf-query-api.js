const DB = require("../model/DB.js");
const { getAxiosGraphQLQuery, } = require('../../helper/api-helper');

const CfQueryType = {
    qr_check_in: {
        key: "qr_check_in",
        label: "QR Check In",
        sql: (cf, start, end) => {
            let sql = `
                select 
                u.ID as user_id, u.user_email, 
                (${DB.selectUserName("u.ID")}) as user_name,
                (${DB.selectDateTime("qc.created_at")}) as scan_time,
                (${DB.selectUserName("qc.logged_in_user_id")}) as scanned_by
                FROM  wp_cf_users u, qr_check_in qc, qr_img qi
                WHERE 1=1 
                AND qi.cf = ?
                AND qi.user_id = u.ID
                AND qc.qr_id = qi.ID
                ORDER BY qc.created_at DESC
            `;
            return DB.prepare(sql, [cf]);
        }
    },
    shortlisted: {
        key: "shortlisted",
        label: "Shortlisted",
        sql: (cf, start, end) => {
            let sql = `
                select c.ID as company_id, c.name as company, u.ID as user_id, u.user_email, i.updated_at as created_at 
                FROM companies c, interested i, wp_cf_users u 
                WHERE 1=1 and c.ID = i.user_id and i.is_interested = 1 
                and u.ID = i.entity_id and i.entity = "student_listing" 
                and u.ID IN (select m.entity_id from cf_map m where m.entity = "user" 
                    and m.entity_id = u.ID and m.cf = ? ) 
                and c.ID IN (select m.entity_id from cf_map m where m.entity = "company" 
                    and m.entity_id = c.ID and m.cf = ? ) 
                order by c.ID, i.updated_at
            `;
            return DB.prepare(sql, [cf, cf]);
        }
    },
    company_total_click: {
        key: "company_total_click",
        label: "Company Total Click",
        sql: (cf, start, end) => {
            // let start = "2022-08-01 00:00:00";
            // let end = "2022-08-19 23:00:00"
            let sql = `SELECT c.name, u.user_email, COUNT(l.ID) as total_click, 
                MIN(convert_tz(l.created_at, '+00:00', '+08:00')) as first_click 
                FROM logs l, cf_map m, wp_cf_users u, companies c 
                where 1=1 
                and SUBSTRING(REPLACE(l.data, "/" ,""), 8) = c.ID 
                and u.ID = l.user_id 
                and l.event = "open_page" 
                and (l.data like "company%" OR l.data like "/company%")
                and u.user_email not like "test%" 
                and l.user_id = m.entity_id and m.entity = "user" and m.cf = ?
                and c.ID in (select entity_id from cf_map where entity = "company" and cf = ?) 
                and l.created_at >= ?
                and l.created_at <= ?
                group by u.user_email, c.name order by c.name, total_click desc`
            return DB.prepare(sql, [cf, cf, start, end]);
        }
    },
    chat: {
        key: "chat",
        label: "Chat",
        sql: (cf, start, end) => {
            let sql = `
                select XC.name as company, 
                XU.user_email as student_email, 
                convert_tz(m.created_at, '+00:00', '+08:00') as chat_created 
                
                from message_count m, 
                (select c.ID, c.name from companies c where c.ID IN 
                (select m.entity_id from cf_map m where m.entity = "company" 
                and m.entity_id = c.ID and m.cf = ? )) XC, 
                (select u.ID, u.user_email from wp_cf_users u where u.ID IN 
                    (select m.entity_id from cf_map m where m.entity = "user" 
                    and m.entity_id = u.ID and m.cf = ?)) XU 
                
                where 1=1 
                AND m.id = CONCAT("company", XC.ID, ":", "user", XU.ID) 
                order by XC.ID
            `
            return DB.prepare(sql, [cf, cf]);
        }
    },
    job_post_aplicants: {
        key: "job_post_aplicants",
        label: "Job Post - Applicants List",
        sql: (cf, start, end) => {
            let sql = `
                select i.user_id, u.user_email, 
                v.ID as vacancy_id, v.title as vacancy_title, 
                c.ID as company_id, c.name as company_name,
                i.application_status, 
                i.created_at as applied_at 
                
                from vacancies v , 
                companies c, interested i, 
                wp_cf_users u 
                
                where 1=1 
                and u.ID = i.user_id 
                and i.is_interested = 1 
                and v.ID = i.entity_id 
                and i.entity = "vacancies" 
                and v.company_id = c.ID 
                and i.user_id IN (select m.entity_id from cf_map m 
                    where m.entity = "user" and m.entity_id = i.user_id 
                    and m.cf = ? ) 
                    
                and v.company_id IN (select m.entity_id from cf_map m 
                    where m.entity = "company" and m.entity_id = v.company_id 
                    and m.cf = ? ) 
                order by i.user_id, c.ID, i.updated_at
            `
            return DB.prepare(sql, [cf, cf]);
        }
    },
    job_post_all: {
        key: "job_post_all",
        label: "Job Post - All",
        sql: (cf, start, end) => {
            let sql = `
            select c.name as company_name, 
            (
                select COUNT(i.ID) from interested i 
                where 1=1 and i.is_interested = 1 
                and v.ID = i.entity_id and i.entity = "vacancies" 
                and i.user_id IN 
                (select m.entity_id from cf_map m 
                    where m.entity = "user" and m.entity_id = i.user_id 
                    and m.cf = ?) 
            ) as total_applicants, 
            v.* 
                
            from vacancies v , companies c 
            
            where 1=1 
            and v.company_id IN (select m.entity_id from cf_map m 
                where m.entity = "company" 
                and m.entity_id = v.company_id 
                and m.cf = ? ) 
            and v.company_id = c.ID
            `
            return DB.prepare(sql, [cf, cf]);
        }
    },
    interview: {
        key: "interview",
        label: "Interviews",
        sql: (cf, start, end) => {
            let sql = `
            select c.name as company, 
            (${DB.selectUserName("u.ID")}) as student_name,
            u.user_email as student_email, 
            convert_tz(from_unixtime(p.appointment_time), '+00:00', '+08:00') as interview_time, 
            p.status as interview_status 
            
            from pre_screens p, companies c, wp_cf_users u 
            
            where p.company_id = c.ID and p.student_id = u.ID 
            and u.ID IN (select m.entity_id from cf_map m where m.entity = "user" 
            and m.entity_id = u.ID and m.cf = ? ) and 
            c.ID IN (select m.entity_id from cf_map m where m.entity = "company" 
            and m.entity_id = c.ID and m.cf = ? ) 
            order by c.ID, p.appointment_time
            `
            return DB.prepare(sql, [cf, cf]);
        }
    },
    company_login: {
        key: "company_login",
        label: "Company Login",
        sql: (cf, start, end) => {
            let sql = `
                SELECT c.name as company_name, u.user_email as recruiter_email, 
                l.created_at as login_datetime 
                
                FROM logs l, cf_map m, wp_cf_users u, 
                companies c , wp_cf_usermeta meta 
                
                where 1=1 and event = 'login' 
                and u.ID = l.user_id and meta.user_id = u.ID 
                and meta.meta_key = "rec_company" and meta.meta_value = c.ID 
                and m.entity_id = c.ID and m.entity = "company" and m.cf = ? 
                and l.created_at >= ? and l.created_at <= ?
                order by c.name, l.created_at asc
            `
            return DB.prepare(sql, [cf, start, end]);
        }
    },
    event_webinar_log: {
        key: "event_webinar_log",
        label: "Event & Webinar Logs",
        sql: (cf, start, end) => {
            let sql = `
                select  c.ID as company_id,  
                c.name as company_name, e.ID as event_id,  
                e.title as event_name, 
                el.action, el.user_id as student_id,  
                u.user_email as student_email,  
                el.created_at as created_at 

                from  events e,  event_logs el,  companies c, wp_cf_users u   
                
                where 1=1  
                and u.ID = el.user_id  and e.ID = el.event_id and c.ID = el.company_id  and el.user_id IN  
                (select m.entity_id from cf_map m   
                    where m.entity = "user" and m.entity_id = el.user_id and m.cf = ? )   
                    and el.company_id IN (select m.entity_id from cf_map m 
                    where m.entity = "company" and m.entity_id = el.company_id 
                and m.cf = ? )
                order by c.ID, e.ID, el.action
            `
            return DB.prepare(sql, [cf, cf]);
        }
    },
    // feedback: {
    //     key: "feedback",
    //     label: "Feedbacks",
    //     sql: (cf, start, end) => {
    //         let sql = ``
    //         return DB.prepare(sql, [cf, cf, start, end]);
    //     }
    // },
    // ind_group_call: {
    //     key: "ind_group_call",
    //     label: "Individual & Group Call",
    //     sql: (cf, start, end) => {
    //         let sql = ``
    //         return DB.prepare(sql, [cf, cf, start, end]);
    //     }
    // },
    // resume_drop: {
    //     key: "resume_drop",
    //     label: "Resume Drops",
    //     sql: (cf, start, end) => {
    //         let sql = ``
    //         return DB.prepare(sql, [cf, cf, start, end]);
    //     }
    // },

}

class CfQueryAPI {
    Main(action, param) {
        switch (action) {
            case "query-list":
                return this.queryList(param);
            case "fetch-data":
                return this.fetchData(param);
        }
    }
    fetchData(param) {
        let query = param.query;
        let cf = param.cf;
        let start = param.start ? param.start + " 00:00:00" : null;
        let end = param.end ? param.end + " 23:59:59" : null;
        let sql = CfQueryType[query]["sql"](cf, start, end)
        console.log("sql", sql);
        return DB.query(sql)
    }
    queryList(param) {
        let toRet = [];
        for (let k in CfQueryType) {
            toRet.push({
                key: k,
                label: CfQueryType[k]["label"]
            })
        }
        return Promise.resolve(toRet)
    }
}

CfQueryAPI = new CfQueryAPI();
module.exports = { CfQueryAPI };
