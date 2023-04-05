const DB = require("../model/DB.js");
const { UserQuery } = require("../model/user-query.js");
const {
    UserMeta,
} = require("../../config/db-config.js");
const { graphql } = require("../../helper/api-helper.js");
const UserFieldHelper = require("../../helper/user-field-helper");

class UserAPI {
    Main(action, param) {

        switch (action) {
            case "get-detail":
                return this.getDetail(param);
            case "get-data-for-listing":
                return this.getDataForListing(param);
            case "get-data-for-xls":
                return this.getDataForXls(param);
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
    async getDataForXls(param) {
        let cf = param.cf;
        let user_ids = param.user_ids;

        let fields = await UserFieldHelper.getStudentFieldForXls(cf);
        let singleFields = fields.single;
        let multiFields = fields.multi;

        let querySingle = `select 
            u.ID,
            ${singleFields.map(d => `(${UserQuery.selectSingleMain("u.ID", this.getRealField(d.id))}) as "${d.label}"`).join(",")}
            from  wp_cf_users u 
            where 1=1 and u.ID IN (${user_ids.join(",")})
        `;
        let singleData = await DB.query(querySingle);


        let multiData = [];
        if (multiFields.length > 0) {
            let queryMulti = `
			select 
            GROUP_CONCAT(val SEPARATOR ' | ') as val,
            key_input,
            entity_id as user_id 
            from multi_input 
            where 1=1
			and entity = "user" 
            and entity_id IN (${user_ids.join(",")}) 
            and key_input IN (${multiFields.map(d => `"${d.id}"`).join(",")})
            GROUP BY user_id, key_input
		`;
            console.log("sql", queryMulti)
            multiData = await DB.query(queryMulti);
        }

        let toRet = {};
        for (let d of singleData) {
            let id = d["ID"]
            delete d["ID"];
            toRet[id] = d
        }


        let multiFieldMap = {};
        for (let m of multiFields) {
            multiFieldMap[m.id] = m.label;
        }

        for (let d of multiData) {
            let user_id = d["user_id"]
            let key = multiFieldMap[d["key_input"]];
            if (!toRet[user_id]) {
                toRet[user_id] = {};
            }
            toRet[user_id][key] = d["val"];
        }

        return Promise.resolve(toRet)

    }
    async getDataForListing(param) {
        let query_graphql = param.query_graphql
        let customField = param.customField

        query_graphql = query_graphql.replaceAll("\n", " ");

        let res = await graphql(query_graphql)
        res = res.data.data.browse_student;

        if (customField && Array.isArray(customField) && customField.length > 0) {
            let mapUidIndex = {}
            let user_ids = res.map((d, index) => {
                mapUidIndex[d.student_id] = index;
                return d.student_id;
            });
            let q = `select 
                u.ID,
                ${customField.map(d => `(${UserQuery.selectSingleMain("u.ID", this.getRealField(d))}) as ${d}`).join(",")}
                from  wp_cf_users u 
                where 1=1 and u.ID IN (${user_ids.join(",")})
            `;
            let customData = await DB.query(q)
            for (let cf of customData) {
                let index = mapUidIndex[cf.ID];
                let toAppend = { ...cf }
                delete toAppend["ID"];

                res[index]["student"] = {
                    ...res[index]["student"],
                    ...toAppend
                }
            }
        }

        return Promise.resolve({
            data: {
                browse_student: res
            }
        });
        // var query = `query{
        //     browse_student ${query_param}
        //     {
        //         is_seen { ID is_seen }
        //         student_id
        //         student{
        //             ${this.props.isPageStudentListJobPost ? " interested_vacancies_by_company {ID title} " : ""}
        //             student_note{ID note}
        //             student_listing_interested{ID is_interested}
        //             field_study_main field_study_secondary
        //             prescreens_for_student_listing{status appointment_time}
        //             university country_study
        //             ID first_name last_name user_email 
        //             doc_links {type label url} field_study{val} looking_for_position{val}
        //   }}} `;

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


        let select = "";
        if (fieldMeta.length > 0) {
            select += ` ${fieldMeta.map(d => `(${UserQuery.selectMetaMain("u.ID", this.getRealField(d))}) as ${d}`).join(",")}, `
        }
        if (fieldSingle.length > 0) {
            select += ` ${fieldSingle.map(d => `(${UserQuery.selectSingleMain("u.ID", this.getRealField(d))}) as ${d}`).join(",")}, `
        }
        let q = `select 
            ${select}
            "student" as role,
            u.ID,
            u.user_email
            
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
            console.log("res", res);
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
