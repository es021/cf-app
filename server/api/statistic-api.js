const DB = require("../model/DB.js");

class StatisticAPI {
    Main(action, param) {
        switch (action) {
            case "vacancy-application":
                return this.vacancyApplication(param);
        }
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
