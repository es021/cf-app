const DB = require('./DB.js');
const { Event, EventEnum } = require('../../config/db-config');
const { getUnixTimestampNow } = require('../../helper/general-helper');

class EventExec {
    constructor() {
       // this.OFFSET_END_TIME = 240 * 60; //  30 minute offset
    }

    getQuery(params, extra) {
        // var end_time = (params.now_only) ?
        //     `start_time >= ${getUnixTimestampNow() - this.OFFSET_END_TIME}`
        //     : "1=1";

        var id = (typeof params.ID !== "undefined") ? `ID = '${params.ID}'` : "1=1";
        var company_id = (typeof params.company_id !== "undefined") ? `company_id = '${params.company_id}'` : "1=1";

        var order_by = `order by `
            + ((typeof params.order_by !== "undefined") ? `${params.order_by}` : `start_time desc`);

        var limit = "";
        let select = "";
        if (extra.count) {
            select = "COUNT(*) as total";
            limit = "";
        }else{
            select = "*";
            limit = DB.prepareLimit(params.page, params.offset);
        }

        var sql = `select ${select} from ${Event.TABLE}
            where ${id} and ${company_id} 
            ${order_by} ${limit}`;
        console.log(sql);
        return sql;
    }

    events(params, field, extra = {}) {
        const { CompanyExec } = require('./company-query.js');
        const { InterestedExec } = require('./interested-query.js');

        var sql = this.getQuery(params, extra);
        var toRet = DB.query(sql).then(function (res) {
            if (extra.count) {
                return res[0].total;
            }

            for (var i in res) {
                if (typeof field["company"] !== "undefined") {
                    var company_id = res[i]["company_id"];
                    res[i]["company"] = CompanyExec.company(company_id, field["company"]);
                }

                if (typeof field["interested"] !== "undefined") {
					res[i]["interested"] = InterestedExec.single({
						user_id: params.user_id,
						entity: "event",
						entity_id: res[i].ID
					}, field["interested"]);
				}
            }

            if (extra.single) {
                return res[0];
            }
            //console.log(res);
            return res;
        });

        return toRet;
    }
}

EventExec = new EventExec();
module.exports = { EventExec };
