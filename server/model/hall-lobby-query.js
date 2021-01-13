const DB = require('./DB.js');
const {
    HallLobby
} = require('../../config/db-config');

class HallLobbyExec {
    getQuery(params) {
        var id_where = (typeof params.ID === "undefined") ? "1=1" : `${HallLobby.ID} = ${params.ID}`;
        var cf_where = (typeof params.cf === "undefined") ? "1=1" : `${HallLobby.CF} = '${params.cf}'`;
        var is_active_where = (typeof params.is_active === "undefined") ? "1=1" : `${HallLobby.IS_ACTIVE} = '${params.is_active}'`;
        var order_by = "ORDER BY " + ((typeof params.order_by === "undefined") ? `${HallLobby.ITEM_ORDER} asc` : `${params.order_by}`);
        var limit = DB.prepareLimit(params.page, params.offset);

        let sqlBody = ` from ${HallLobby.TABLE} 
            where ${id_where} 
            and ${is_active_where}
            and ${cf_where} `;

        return `select * ${sqlBody} ${order_by} ${limit}`;
    }

    hall_lobbies(params, field, extra = {}) {
        var sql = this.getQuery(params);
        //// console.log(sql)
        var toRet = DB.query(sql).then(function (res) {

            // for (var i in res) {
            // if (typeof field["img_obj"] !== "undefined") {
            // }
            // }

            if (extra.single) {
                return res[0];
            }

            return res;

        });
        return toRet;
    }
}

HallLobbyExec = new HallLobbyExec();

module.exports = {
    HallLobbyExec
};