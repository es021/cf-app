const DB = require('./DB.js');
const {
    HallLobby
} = require('../../config/db-config');

class HallLobbyExec {
    getQuery(params, extra) {
        var id_where = (typeof params.ID === "undefined") ? "1=1" : `${HallLobby.ID} = ${params.ID}`;
        var cf_where = (typeof params.cf === "undefined") ? "1=1" : `${HallLobby.CF} = '${params.cf}'`;
        var is_active_where = (typeof params.is_active === "undefined") ? "1=1" : `${HallLobby.IS_ACTIVE} = '${params.is_active}'`;

        var order_by = "";
        var limit = "";
        let select = "";
        if (extra.count) {
            select = "COUNT(*) as total";
            limit = "";
        } else {
            order_by = "ORDER BY " +
                ((typeof params.order_by === "undefined") ?
                    `${HallLobby.CF} asc, ${HallLobby.IS_ACTIVE} desc, ${HallLobby.ITEM_ORDER} asc` :
                    `${params.order_by}`);
            select = "*";
            limit = DB.prepareLimit(params.page, params.offset);
        }

        let sqlBody = ` from ${HallLobby.TABLE} 
            where ${id_where} 
            and ${is_active_where}
            and ${cf_where} `;

        return `select ${select} ${sqlBody} ${order_by} ${limit}`;
    }

    hall_lobbies(params, field, extra = {}) {
        var sql = this.getQuery(params, extra);
        //// console.log(sql)
        var toRet = DB.query(sql).then(function (res) {
            if (extra.count) {
                return res[0].total;
            }
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