const DB = require("../model/DB.js");
const { UserQuery } = require("../model/user-query.js");
const {
    UserMeta,
} = require("../../config/db-config.js");

class UserAPI {
    Main(action, param) {

        switch (action) {
            case "get-detail":
                return this.getDetail(param);
        }
    }
    getRealField(k) {
        if (k === "img_url") {
            return UserMeta.IMG_URL;
        }
        if (k === "img_size") {
            return UserMeta.IMG_SIZE;
        }
        if (k === "img_pos") {
            return UserMeta.IMG_POS;
        }
        return k;
    }

    getDetail(param) {
        let user_id = param.user_id;

        let fieldMeta = ["img_url", "img_pos", "img_size"];
        let fieldSingle = ["first_name", "last_name", "phone_number"];

        let isIncludeDocLink = param.isIncludeDocLink;


        if (param.fieldSingle && Array.isArray(param.fieldSingle)) {
            for (let f of param.fieldSingle) {
                if (fieldSingle.indexOf(f) <= -1) {
                    fieldSingle.push(f);
                }
            }
        }

        let fieldMulti = [];
        if (param.fieldMulti && Array.isArray(param.fieldMulti)) {
            fieldMulti = param.fieldMulti;
        }


        let q = `select 
            "student" as role,
            u.user_email,
            ${fieldMeta.map(d => `(${UserQuery.selectMetaMain("u.ID", this.getRealField(d))}) as ${d}`).join(",")},
            ${fieldSingle.map(d => `(${UserQuery.selectSingleMain("u.ID", this.getRealField(d))}) as ${d}`).join(",")}
            from  wp_cf_users u 
            where 1=1 
            and u.ID = ?
        `;

        q = DB.prepare(q, [user_id]);

        const {
            MultiExec
        } = require("../model/multi-query.js");

        const {
            DocLinkExec
        } = require("../model/doclink-query.js");

        return DB.query(q).then(res => {
            res = res[0];

            let promises = [];
            let promisesMulti = [];
            for (let multi of fieldMulti) {
                promisesMulti.push(multi);
                promises.push(
                    MultiExec.list(
                        {
                            table_name: multi,
                            entity: "user",
                            entity_id: user_id
                        },
                        null,
                        { selectField: ["val"] }
                    )
                );
            }

            if (isIncludeDocLink) {
                promisesMulti.push("doc_links");
                promises.push(
                    DocLinkExec.doc_links(
                        {
                            user_id: user_id,
                            order_by: "label"
                        },
                        null,
                        { selectField: ["label", "url", "type"] }
                    )
                );
            }

            return Promise.all(promises).then(resMulti => {
                for (let index in promisesMulti) {
                    res[promisesMulti[index]] = resMulti[index];
                }
                return res;
            })
        })
    }

}

UserAPI = new UserAPI();
module.exports = { UserAPI };
