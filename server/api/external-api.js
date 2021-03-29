const DB = require('../model/DB.js');

class ExternalApi {
    constructor() {
    }
    checkIvByIc(param) {
        console.log("param", param);
        let sql = `select * from _mfls where ic = ?`
        sql = DB.prepare(sql, [param.ic]);
        return DB.query(sql).then(res => {
            return res;
        });
    }

}

ExternalApi = new ExternalApi();

module.exports = {
    ExternalApi
};