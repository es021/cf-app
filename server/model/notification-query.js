const DB = require('./DB.js');
const {
    Notifications,
    NotificationsEnum
} = require('../../config/db-config');

class NotificationExec {
    getQuery(params) {
        var id_where = (typeof params.ID === "undefined") ? "1=1" : `${Notifications.ID} = ${params.ID}`;
        var user_id_where = (typeof params.user_id === "undefined") ? "1=1" : `${Notifications.USER_ID} = ${params.user_id}`;
        var user_role_where = (typeof params.user_role === "undefined") ? "1=1" : `${Notifications.USER_ROLE} = '${params.user_role}'`;
        var cf_where = (typeof params.cf === "undefined") ? "1=1" : `${Notifications.CF} = '${params.cf}'`;
        var order_by = "ORDER BY " + ((typeof params.order_by === "undefined") ? `${Notifications.CREATED_AT} desc` : `${params.order_by}`);
        var limit = DB.prepareLimit(params.page, params.offset);

        var is_read_where = "1=1"
        if (typeof params.user_role !== "undefined" && typeof params.is_read !== "undefined") {
            is_read_where = `n.ID 
                ${params.is_read == 1 ? 'IN' : 'NOT IN'}
                (
                    SELECT nrr.notification_id 
                    FROM notifications_read_receipt nrr 
                    WHERE nrr.notification_id = n.ID 
                    AND nrr.user_id = ${params.user_id}
                )`
        }


        let sqlBody = ` from ${Notifications.TABLE} n
            where ${id_where} 
            and (
                ${user_id_where}
                OR
                ${user_role_where}
            ) 
            and ${cf_where} 
            and ${is_read_where} `;

        let q = "";

        if (params.ttl == "1") {
            q = `select count(*) as ttl ${sqlBody}`;
        } else {
            q = `select n.*
            ${params.user_id ? `
            , (
                SELECT COUNT(nrr.ID) 
                FROM notifications_read_receipt nrr 
                WHERE nrr.notification_id = n.ID 
                AND nrr.user_id = ${params.user_id}
                ) as is_read` : ``
                } 
            ${sqlBody} ${order_by} ${limit}`;

        }

        console.log("q", q);
        return q;
    }

    notifications(params, field, extra = {}) {
        const {
            UserExec
        } = require('./user-query.js');
        const {
            CompanyExec
        } = require('./company-query.js');

        var sql = this.getQuery(params);
        //// console.log(sql)
        var toRet = DB.query(sql).then(function (res) {

            for (var i in res) {

                if (typeof field["img_obj"] !== "undefined") {
                    let img_entity = res[i]["img_entity"];
                    let img_id = res[i]["img_id"]

                    let param = {
                        ID: img_id
                    }
                    let imgObj = {};
                    if (img_entity == NotificationsEnum.IMG_ENTITY_USER) {
                        imgObj = UserExec.user(param, field["img_obj"]);

                    } else if (img_entity == NotificationsEnum.IMG_ENTITY_COMPANY) {
                        imgObj = CompanyExec.company(param, field["img_obj"]);
                    }
                    res[i]["img_obj"] = imgObj;
                }

            }

            if (extra.single) {
                return res[0];
            }

            return res;

        });
        return toRet;
    }
}

NotificationExec = new NotificationExec();

module.exports = {
    NotificationExec
};