const DB = require('./DB.js');
const {DocLink} = require('../../config/db-config');

class DocLinkQuery {
    getDocLink(params) {
        var user_where = (typeof params.user_id === "undefined") ? "1=1" : `${DocLink.USER_ID} = ${params.user_id}`;
        var com_where = (typeof params.company_id === "undefined") ? "1=1" : `${DocLink.COMPANY_ID} = '${params.company_id}'`;
        var type_where = (typeof params.type === "undefined") ? "1=1" : `${DocLink.TYPE} = '${params.type}'`;
        var order_by = (typeof params.order_by === "undefined") ? "" : `ORDER BY ${params.order_by}`;

        return `select * from ${DocLink.TABLE} where ${user_where} and ${com_where} and ${type_where} ${order_by}`;
    }
}

DocLinkQuery = new DocLinkQuery();

class DocLinkExec {
    doc_links(params, field) {
        var sql = DocLinkQuery.getDocLink(params);
        var toRet = DB.query(sql).then(function (res) {
            return res;
        });
        return toRet;
    }
}

DocLinkExec = new DocLinkExec();

module.exports = {DocLinkQuery, DocLinkExec};


