const DB = require('./DB.js');
const { PasswordReset } = require('../../config/db-config');

class PasswordResetExec {
    getQuery(params) {
        var user_id_where = (typeof params.user_id === "undefined") ? "1=1" : `${PasswordReset.USER_ID} = ${params.user_id}`;
        var token_where = (typeof params.token === "undefined") ? "1=1" : `${PasswordReset.TOKEN} = "${params.token}"`;
        return `select * from ${PasswordReset.TABLE} where ${user_id_where} and ${token_where}`;
    }

    password_reset(params, field, extra = {}) {
        var sql = this.getQuery(params);
        // console.log(sql);
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

PasswordResetExec = new PasswordResetExec();

module.exports = { PasswordResetExec };


