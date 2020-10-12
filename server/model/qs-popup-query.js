const DB = require('./DB.js');
const {
    QsPopup,
    QsPopupAnswer
} = require('../../config/db-config');

class QsPopupQuery {
    getQsPopup(params, extra) {
        var ID = (typeof params.ID === "undefined") ? "1=1" :
            `main.ID = '${params.ID}' `;

        var for_student = (typeof params.for_student === "undefined") ? "1=1" :
            `main.for_student = '${params.for_student}' `;

        var for_rec = (typeof params.for_rec === "undefined") ? "1=1" :
            `main.for_rec = '${params.for_rec}' `;

        var is_disabled = (typeof params.is_disabled === "undefined") ? "1=1" :
            `main.is_disabled = '${params.is_disabled}' `;

        var type = (typeof params.type === "undefined") ? "1=1" :
            `main.type = '${params.type}' `;

        var order_by = (typeof params.order_by === "undefined") ?
            "ORDER BY main.is_disabled" :
            `ORDER BY ${params.order_by} `;

        // filter out question already answered by this users
        var user_filter = (typeof params.user_id === "undefined") ? "1=1" :
            `main.ID NOT IN (select oth.qs_popup_id from ${QsPopupAnswer.TABLE} oth where oth.user_id = ${params.user_id})`;

        var limit = DB.prepareLimit(params.page, params.offset);

        var sql = `from ${QsPopup.TABLE} main
            where ${ID} and ${for_student} and ${for_rec} 
            and ${type} and ${is_disabled} and ${user_filter}
            ${order_by}`;

        if (extra.count) {
            return `select count(*) as cnt ${sql}`;
        } else {
            var toRet = `select main.* ${sql} ${limit}`;
            // console.log(toRet);
            return toRet;
        }
    }

    getQsPopupAnswer(params, extra) {
        var ID = (typeof params.ID === "undefined") ? "1=1" :
            `main.ID = '${params.ID}' `;

        var qs_popup_id = (typeof params.qs_popup_id === "undefined") ? "1=1" :
            `main.qs_popup_id = '${params.qs_popup_id}' `;

        var order_by = (typeof params.order_by === "undefined") ?
            "ORDER BY main.created_at desc" :
            `ORDER BY ${params.order_by} `;
        var limit = DB.prepareLimit(params.page, params.offset);


        var join = ``;
        var user_role = "1=1";
        if (typeof params.user_role !== "undefined") {
            join = ` left outer join wp_cf_usermeta um on um.user_id = main.user_id 
                and um.meta_key = 'wp_cf_capabilities' `;
            user_role = `um.meta_value LIKE CONCAT('%', '${params.user_role}' ,'%') `;
        }


        var sql = `from ${QsPopupAnswer.TABLE} main ${join}
            where ${ID} and ${qs_popup_id} and ${user_role} 
            ${order_by}`;

        if (extra.count) {
            return `select count(*) as cnt ${sql}`;
        } else {
            var toRet = `select main.* ${sql} ${limit}`;
            // console.log(toRet);
            return toRet;
        }
    }

}
QsPopupQuery = new QsPopupQuery();

class QsPopupExec {

    getQsPopupAnswerHelper(type, params, field, extra = {}) {
        //var OBJ = this;

        var sql = QsPopupQuery.getQsPopupAnswer(params, extra);
        var toRet = DB.query(sql).then(function (res) {
            if (extra.count) {
                return res[0]["cnt"];
            }

            for (var i in res) {

            }

            if (type === "single") {
                let index = 0;
                return res[index];
            } else {
                return res;
            }
        });


        return toRet;
    }

    getQsPopupHelper(type, params, field, extra = {}) {
        //var OBJ = this;

        var sql = QsPopupQuery.getQsPopup(params, extra);
        var toRet = DB.query(sql).then(function (res) {
            if (extra.count) {
                return res[0]["cnt"];
            }

            for (var i in res) {

            }


            if (type === "single") {
                // take random if query by user id
                let index = 0;
                index = Math.floor(Math.random() * Math.floor(res.length));
                return res[index];
            } else {
                return res;
            }
        });


        return toRet;
    }

    qs_popup(params, field) {
        return this.getQsPopupHelper("single", params, field);
    }

    qs_popups(params, field, extra = {}) {
        return this.getQsPopupHelper(false, params, field, extra);
    }

    qs_popup_answers(params, field, extra = {}) {
        return this.getQsPopupAnswerHelper(false, params, field, extra);
    }

}

QsPopupExec = new QsPopupExec();

module.exports = {
    QsPopupExec
};