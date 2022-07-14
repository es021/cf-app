const DB = require('./DB.js');
const {DocLink} = require('../../config/db-config');

class DocLinkQuery {
    getDocLink(params) {
        var id_where = (typeof params.ID === "undefined") ? "1=1" : `${DocLink.ID} = ${params.ID}`;
        var label_where = (typeof params.label === "undefined") ? "1=1" : `${DocLink.LABEL} = '${params.label}'`;
        var user_where = (typeof params.user_id === "undefined") ? "1=1" : `${DocLink.USER_ID} = ${params.user_id}`;
        var com_where = (typeof params.company_id === "undefined") ? "1=1" : `${DocLink.COMPANY_ID} = '${params.company_id}'`;
        var type_where = (typeof params.type === "undefined") ? "1=1" : `${DocLink.TYPE} = '${params.type}'`;
        var order_by = "ORDER BY " + ((typeof params.order_by === "undefined") ? `${DocLink.UPDATED_AT} desc` : `${params.order_by}`);

        return `select * from ${DocLink.TABLE} where ${label_where} and ${id_where} and ${user_where} and ${com_where} and ${type_where} ${order_by}`;
    }
}

DocLinkQuery = new DocLinkQuery();

class DocLinkExec {
    doc_links(params, field, extra={}) {
        var sql = DocLinkQuery.getDocLink(params);
        //// console.log(sql);
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

DocLinkExec = new DocLinkExec();

module.exports = {DocLinkQuery, DocLinkExec};


