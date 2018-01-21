const DB = require('./DB.js');
const { Dashboard } = require('../../config/db-config');

class DashboardExec {
    getQuery(params) {
        var id_where = (typeof params.ID === "undefined") ? "1=1" : `${Dashboard.ID} = ${params.ID}`;
        var type_where = (typeof params.type === "undefined") ? "1=1" : `${Dashboard.TYPE} = '${params.type}'`;
        var cf_where = (typeof params.cf === "undefined") ? "1=1" : `${Dashboard.CF} = '${params.cf}'`;
        var order_by = "ORDER BY " + ((typeof params.order_by === "undefined") ? `${Dashboard.CREATED_AT} desc` : `${params.order_by}`);
        var limit = DB.prepareLimit(params.page, params.offset);
        return `select * from ${Dashboard.TABLE} where ${id_where} and ${type_where} and ${cf_where} 
        ${order_by} ${limit}`;
    }

    dashboards(params, field, extra = {}) {
        var sql = this.getQuery(params);
        console.log(sql);
        var toRet = DB.query(sql).then(function (res) {

            if (extra.single && res !== null) {
                return res[0];
            } else {
                return res;
            }

        });
        return toRet;
    }
}

DashboardExec = new DashboardExec();

module.exports = { DashboardExec };


