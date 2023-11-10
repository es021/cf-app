const DB = require("../model/DB.js");
const { UserQuery } = require("../model/user-query.js");
const {
    UserMeta,
} = require("../../config/db-config.js");
const { graphql } = require("../../helper/api-helper.js");
const UserFieldHelper = require("../../helper/user-field-helper");
const { Domain } = require("../../config/app-config.js");
const { Secret } = require("../secret/secret.js");
const fs = require("fs");
const path = require("path");
const { generateRandomString } = require("../../helper/general-helper.js");
const { exec } = require("child_process");
class UserAPI {
    Main(action, param) {

        switch (action) {
            case "get-detail":
                return this.getDetail(param);
            case "get-data-for-listing":
                return this.getDataForListing(param);
            case "download-resume":
                return this.dowloadResume(param);
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

        if (user_ids.length <= 0) {
            return Promise.resolve({})
        }

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
    async gatherAndZipResume(list) {
        return new Promise(function (resolve, reject) {
            try {
                let pwd = process.env.PWD ? process.env.PWD : process.env.INIT_CWD;

                const gatherDirName = `seedsjobfair_resume_${generateRandomString(10).toLowerCase()}`;
                let downloadResumeRoot = path.join(pwd, `public/upload/download_resume`);

                // create type dir
                if (!fs.existsSync(downloadResumeRoot)) {
                    fs.mkdirSync(downloadResumeRoot);
                }

                // create year dir
                let d = new Date();
                let y = d.getYear() + 1900;
                downloadResumeRoot += `/${y}`;
                if (!fs.existsSync(downloadResumeRoot)) {
                    fs.mkdirSync(downloadResumeRoot);
                }

                // create month dir
                let m = d.getMonth() + 1;
                downloadResumeRoot += `/${m}`;
                if (!fs.existsSync(downloadResumeRoot)) {
                    fs.mkdirSync(downloadResumeRoot);
                }

                const gatherDirPath = `${downloadResumeRoot}/${gatherDirName}`;
                if (!fs.existsSync(gatherDirPath)) {
                    fs.mkdirSync(gatherDirPath);
                }

                let resumeCount = list.length;
                for (let r of list) {
                    fs.copyFile(r.path, `${gatherDirPath}/${r.filename}`, (err) => {
                        if (err) {
                            resumeCount--;
                            console.log("error for", r.url);
                        }
                    });
                }

                const cmdZip = `cd ${downloadResumeRoot} && zip -r ${gatherDirName}.zip ${gatherDirName}`

                let zipUrl = `${downloadResumeRoot}/${gatherDirName}.zip`
                zipUrl = zipUrl.split("/public/")
                zipUrl = `${Domain}/public/${zipUrl[1]}`

                exec(cmdZip, (error, stdout, stderr) => {
                    if (gatherDirPath && gatherDirPath.indexOf(gatherDirName) >= 0) {
                        console.log("DELETING FOLDER", gatherDirPath)
                        exec(`rm -r ${gatherDirPath}`)
                    }
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ zipUrl, zipPath: `${gatherDirPath}.zip`, resumeCount });
                    }
                });

            } catch (err) {
                reject(err);
            }
        });
    }
    async dowloadResume(param) {
        let { query_graphql, user_id, cf } = param;


        query_graphql = query_graphql.replaceAll("\n", " ");
        let res = await graphql(query_graphql)
        res = res.data.data.browse_student;

        let toDownload = [];
        for (let r of res) {
            const student = r["student"]
            for (let i in student["doc_links_resume"]) {
                try {
                    i = Number.parseInt(i)
                    let url = student["doc_links_resume"][i].url
                    let path = url.replace(Domain, Secret.SERVER_ROOT_DIR)

                    let filename = `${student.first_name} ${student.last_name} ${student.ID} ${i + 1}.pdf`

                    var nameWithoutExt = filename;
                    let fileExt = null;
                    if (filename.indexOf(".") >= 1) {
                        fileExt = filename.split(".").pop();
                        if (fileExt) {
                            fileExt = "." + fileExt;
                        } else {
                            fileExt = "";
                        }
                        if (nameWithoutExt) {
                            nameWithoutExt = nameWithoutExt.replace(fileExt, "");
                        }
                    }
                    let cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, "_");
                    cleanName = cleanName.replace(/^_+|_+(?=_|$)/g, "");
                    filename = `${cleanName.toUpperCase()}${fileExt}`;

                    toDownload.push({
                        filename, path, url,
                    });
                } catch (err) { }
            }
        }

        let toRet = {}
        if (toDownload.length <= 0) {
            toRet = {
                is_no_resume: true,
            };
        } else {
            try {
                const { zipUrl, zipPath, resumeCount } = await this.gatherAndZipResume(toDownload)
                DB.insert("download_resume", {
                    user_id,
                    cf,
                    resume_count: resumeCount,
                    url: zipUrl,
                    path: zipPath
                })
                toRet = {
                    url: zipUrl
                };
            } catch (err) {
                toRet = {
                    error: err.toString()
                };
            }
        }

        return Promise.resolve(toRet);
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
            if (user_ids.length > 0) {
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
