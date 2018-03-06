const DB = require('./DB.js');
const { Auditorium, AuditoriumEnum } = require('../../config/db-config');
const { getUnixTimestampNow } = require('../../helper/general-helper');

class AuditoriumExec {
    constructor() {
        this.OFFSET_END_TIME = 30 * 60; //  30 minute offset
    }

    getQuery(params, extra) {
        var end_time_where = (params.now_only) ?
            `${Auditorium.END_TIME} >= ${getUnixTimestampNow() + this.OFFSET_END_TIME}`
            : "1=1";

        var cf_where = (typeof params.cf !== "undefined") ? `${Auditorium.CF} = '${params.cf}'` : "1=1";
        var id_where = (typeof params.ID !== "undefined") ? `${Auditorium.ID} = '${params.ID}'` : "1=1";

        var order_by = `order by `
            + ((typeof params.order_by !== "undefined") ? `${params.order_by}` : `${Auditorium.UPDATED_AT} desc`);

        var limit = DB.prepareLimit(params.page, params.offset);
        var sql = `select * from ${Auditorium.TABLE} where ${id_where} and ${end_time_where} and ${cf_where} ${order_by} ${limit}`;
        return sql;
    }

    auditoriums(params, field, extra = {}) {
        const { CompanyExec } = require('./company-query.js');

        var sql = this.getQuery(params, extra);
        var toRet = DB.query(sql).then(function (res) {
            for (var i in res) {
                if (typeof field["company"] !== "undefined") {
                    var company_id = res[i]["company_id"];
                    res[i]["company"] = CompanyExec.company(company_id, field["company"]);
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

AuditoriumExec = new AuditoriumExec();
module.exports = { AuditoriumExec };
