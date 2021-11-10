const DB = require("../model/DB.js");
const { UserQuery } = require("../model/user-query.js");
const { graphql } = require("../../helper/api-helper");

class StatisticAPI {
    Main(action, param) {

        switch (action) {
            case "vacancy-application":
                return this.vacancyApplication(param);
            case "daily-registration":
                return this.dailyRegistration(param);
            case "company-statistic-count":
                return this.companyStatisticCount(param);
        }
    }
    companyStatisticCount(param) {
        let cf = param.cf
        let cf_start = param.cf_start;
        let cf_end = param.cf_end;
        let company_id = param.company_id;

        let promises = [];

        // // 1. total interviews
        promises.push(
            graphql(`query{ prescreens_count(not_prescreen:1 ,cf: "${cf}", company_id:${company_id}) }`)
        );

        // 2. total job applications
        let qJob = `
        SELECT COUNT(i.ID) as ttl 
        FROM interested i, vacancies v 
        WHERE 1=1 
            AND i.entity_id = v.ID 
            AND i.entity = "vacancies" 
            AND i.is_interested = 1
            AND v.company_id = ?
        `;

        qJob = DB.prepare(qJob, [company_id]);
        promises.push(DB.query(qJob));

        // 3. total profile visits
        let qVisits = `
                SELECT COUNT(DISTINCT user_id) as ttl
                FROM logs l, wp_cf_users u, cf_map m
                where 1=1 
                
                and u.ID = l.user_id 
                and u.user_email not like 'test%' 
                
                and m.entity_id = u.ID
                and m.entity = "user" 
                
                and l.user_id = m.entity_id 
                and l.data like "/company/%" 
                and l.event = "open_page" 
                
                and m.cf = ?
                and SUBSTRING(l.data, 10, 9) = ?  
                and l.created_at >= FROM_UNIXTIME(?) 
                and l.created_at <= FROM_UNIXTIME(?) 
            `;

        qVisits = DB.prepare(qVisits, [
            cf,
            company_id,
            cf_start,
            cf_end
        ]);

        console.log(qVisits);

        promises.push(DB.query(qVisits));


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
        let cf = param.cf;

        let select = "";
        let order_by = ""
        if (is_count) {
            select = `COUNT(*) as total`
        } else {
            select = `
            i.user_id, u.user_email, v.ID as vacancy_id, 
            v.title as vacancy_title, c.ID as company_id, c.name as company_name, 
            i.updated_at as applied_at 
            `;
            order_by = `ORDER BY i.user_id, c.ID, i.updated_at`;
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
        ${order_by}`;

        q = DB.prepare(q, [cf, cf])
        return DB.query(q).then(res => {
            if (is_count) {
                return res[0];
            }
            return res;
        })
    }
}

StatisticAPI = new StatisticAPI();
module.exports = { StatisticAPI };
