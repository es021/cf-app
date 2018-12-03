const DB = require('./DB.js');
const { CFS } = require('../../config/db-config');

class CFQuery {
    getCF(params) {
        var order_by = "ORDER BY created_at asc";
        var is_active = (typeof params.is_active === "undefined") ? "1=1" : `is_active = '${params.is_active}'`;

        return `select * from ${CFS.TABLE} 
            where ${is_active} ${order_by}`;

        // var id_where = (typeof params.ID === "undefined") ? "1=1" : `ID = "${params.ID}"`;
        // var can_login_where = (typeof params.can_login === "undefined") ? "1=1" : `can_login = '${params.can_login}'`;
        // var can_register_where = (typeof params.can_register === "undefined") ? "1=1" : `can_register = '${params.can_register}'`;
        
        // return `select * from ${CFS.TABLE} where ${id_where} and ${can_login_where} and ${can_register_where} ${order_by}`;
    }
}

CFQuery = new CFQuery();

class CFExec {
    cfs(params, field, extra = {}) {
        var sql = CFQuery.getCF(params);
        //console.log(sql);
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

CFExec = new CFExec();

module.exports = { CFQuery, CFExec };


