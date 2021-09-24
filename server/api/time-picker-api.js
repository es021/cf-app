const DB = require("../model/DB.js");
const { getAxiosGraphQLQuery, } = require('../../helper/api-helper');

class TimePickerAPI {
    Main(action, param) {
        switch (action) {
            case "get-available-time":
                return this.getAvailableTime(param);
            case "set-available-time":
                return this.setAvailableTime(param);
        }
    }
    setAvailableTime(param) {
        let sql = `
            INSERT INTO cf_company_time_pick 
            (cf, company_id, available_time)
            VALUES (?,?,?)
            ON DUPLICATE KEY UPDATE available_time = ?
        `
        sql = DB.prepare(sql, [param.cf, param.company_id, param.available_time, param.available_time]);
        return DB.query(sql).then(res => {
            return res;
        });
    }
    getAvailableTime(param) {
        let sql = `
            SELECT ID, available_time 
            FROM cf_company_time_pick 
            WHERE 
            cf = ?
            AND company_id = ?
        `

        sql = DB.prepare(sql, [param.cf, param.company_id]);

        return DB.query(sql).then(res => {

            if (res.length <= 0) {
                return {
                    ID: null,
                    available_time: [],
                }
            } else {
                let r = res[0];
                try {
                    r["available_time"] = JSON.parse(r["available_time"]);
                } catch (err) {
                    r["available_time"] = [];
                }

                return r;
            }
        });
    }

}

TimePickerAPI = new TimePickerAPI();
module.exports = { TimePickerAPI };
