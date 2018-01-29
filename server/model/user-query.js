const DB = require('./DB.js');

const { User, UserMeta, UserEnum, QueueEnum, PrescreenEnum, SessionEnum } = require('../../config/db-config.js');
const { DocLinkExec } = require('./doclink-query.js');
const { SkillExec } = require('./skill-query.js');

class UserQuery {

    // meta_cons = {
    //  key: "value"
    //  } 
    getUser(field, params, meta_cons) {
        //console.log(params);
        // create basic conditions
        var id_condition = (typeof params.ID !== "undefined") ? `u.ID = ${params.ID}` : `1=1`;
        var email_condition = (typeof params.user_email !== "undefined") ? `u.user_email = '${params.user_email}'` : `1=1`;
        var role_condition = (typeof params.role !== "undefined") ? `(${this.selectMetaMain("u.ID", UserMeta.ROLE)}) LIKE '%${params.role}%' ` : `1=1`;
        var order_by = `order by u.${User.ID} desc`;

        // add meta condition
        var meta_condition = " 1=1 ";
        var i = 0;
        if (typeof meta_cons !== "undefined") {
            meta_condition = "";
            for (var key in meta_cons) {
                if (i > 0) {
                    meta_condition += " AND ";
                }
                meta_condition += `(${this.selectMetaMain("u.ID", key)}) = '${meta_cons[key]}' `;
                i++;
            }
        }

        // set limit 
        var limit = DB.prepareLimit(params.page, params.offset);

        // create meta selection
        var meta_sel = "";
        for (var k in UserMeta) {
            var meta_key = k.toLowerCase();
            if (typeof field[meta_key] !== "undefined") {
                meta_sel += `, ${this.selectMeta("u.ID", UserMeta[k], meta_key)}`;
            }
        }

        var sql = `SELECT u.* ${meta_sel}
           FROM wp_cf_users u WHERE 1=1 AND ${id_condition} AND ${meta_condition} AND ${email_condition} AND ${role_condition} ${order_by} ${limit} `;
        //console.log(sql);
        /*
         var sql = `SELECT u.* 
         ,${this.selectMeta("u.ID", UserMeta.FIRST_NAME)}
         ,${this.selectMeta("u.ID", UserMeta.LAST_NAME)}
         ,${this.selectMeta("u.ID", UserMeta.DESCRIPTION)}
         ,${this.selectMeta("u.ID", UserMeta.ROLE, "role")}
         ,${this.selectMeta("u.ID", UserMeta.IMG_URL, "img_url")}
         ,${this.selectMeta("u.ID", UserMeta.IMG_POS, "img_pos")}
         ,${this.selectMeta("u.ID", UserMeta.IMG_SIZE, "img_size")}
         ,${this.selectMeta("u.ID", UserMeta.FEEDBACK)}
         ,${this.selectMeta("u.ID", UserMeta.USER_STATUS, "user_status")}
         ,${this.selectMeta("u.ID", UserMeta.UNIVERSITY)}
         ,${this.selectMeta("u.ID", UserMeta.PHONE_NUMBER)}
         ,${this.selectMeta("u.ID", UserMeta.GRADUATION_MONTH)}
         ,${this.selectMeta("u.ID", UserMeta.GRADUATION_YEAR)}
         ,${this.selectMeta("u.ID", UserMeta.SPONSOR)}
         ,${this.selectMeta("u.ID", UserMeta.ACTIVATION_KEY)}
         ,${this.selectMeta("u.ID", UserMeta.CGPA)}
         ,${this.selectMeta("u.ID", UserMeta.MAJOR)}
         ,${this.selectMeta("u.ID", UserMeta.MINOR)}
         ,${this.selectMeta("u.ID", UserMeta.COMPANY_ID, "company_id")}
         FROM wp_cf_users u WHERE 1=1 AND ${id_condition} AND ${email_condition} AND ${role_condition} ${limit}`;
         */
        return sql;
    }

    selectRole(user_id, meta_key, as) {
        return `(select SUBSTRING_INDEX(SUBSTRING_INDEX((${this.selectMetaMain(user_id, meta_key)}),'\"',2),'\"',-1)) as ${as}`;
    }

    selectMetaMain(user_id, meta_key) {
        return `select m.meta_value from wp_cf_usermeta m where m.user_id = ${user_id} and m.meta_key = '${meta_key}'`;
    }

    selectMeta(user_id, meta_key, as) {
        as = (typeof as === "undefined") ? meta_key : as;

        if (meta_key === UserMeta.ROLE) {
            return this.selectRole(user_id, meta_key, as);
        }

        return `(${this.selectMetaMain(user_id, meta_key)}) as ${as}`;
    }

}
UserQuery = new UserQuery();

class UserExec {
    updateUserMeta(user_id, data) {
        var meta_key_in = "";
        var meta_pair_case = "";

        //to check not exist user meta
        var meta_key = [];

        for (var k in data) {
            meta_key.push(k);
            meta_key_in += `'${k}',`;
            meta_pair_case += ` WHEN '${k}' THEN '${DB.escStr(data[k])}' `;
        }

        var where = `WHERE meta_key IN (${meta_key_in.slice(0, -1)}) and user_id = '${user_id}'`;

        var check_sql = `SELECT * FROM wp_cf_usermeta ${where}`;

        var update_sql = `UPDATE wp_cf_usermeta
            SET meta_value = CASE meta_key 
            ${meta_pair_case} 
            END ${where}`;

        //check what does not exist
        return DB.query(check_sql).then((res) => {

            var key_check = res.map((d, i) => d["meta_key"]);

            //insert what does not exist
            var insert_val = "";
            meta_key.map((d, i) => {
                if (key_check.indexOf(d) <= -1) {
                    insert_val += `('${user_id}','${d}','${DB.escStr(data[d])}'),`;
                }
            });

            if (insert_val !== "") {
                var insert_sql = `INSERT INTO wp_cf_usermeta (user_id,meta_key,meta_value) VALUES ${insert_val.slice(0, -1)}`;

                return DB.query(insert_sql).then((res) => {
                    //only then update what's left
                    return DB.query(update_sql);
                });
            }
            // if not need to insert just update
            else {
                return DB.query(update_sql);
            }
        });
    }

    editUser(arg) {
        var ID = arg.ID;

        //update User table
        var updateUser = {};
        var updateUserMeta = {};
        //console.log(arg);

        var userVal = Object.keys(User).map(function (key) {
            return User[key];
        });

        var userMetaVal = Object.keys(UserMeta).map(function (key) {
            return UserMeta[key];
        });

        for (var k in arg) {
            var v = arg[k];

            //change key here
            //handle for image props
            if (k === "img_url") {
                k = UserMeta.IMG_URL;
            }
            if (k === "img_size") {
                k = UserMeta.IMG_SIZE;
            }
            if (k === "img_pos") {
                k = UserMeta.IMG_POS;
            }

            if (userVal.indexOf(k) > -1) {
                updateUser[k] = v;
            }

            if (userMetaVal.indexOf(k) > -1) {
                updateUserMeta[k] = v;
            }
        }

        //if there is nothing to update from user table,
        //update user meta only
        if (Object.keys(updateUser).length < 2) { // include ID
            //console.log("update user meta only");
            return this.updateUserMeta(ID, updateUserMeta);
        }

        //update user only
        if (Object.keys(updateUserMeta).length < 2) {
            //console.log("update user only");
            return DB.update(User.TABLE, updateUser).then((res) => {
                return res;
            });
        }

        //update both
        //console.log("update both");
        return DB.update(User.TABLE, updateUser).then((res) => {
            return this.updateUserMeta(ID, updateUserMeta);
        });

    }

    getUserHelper(type, params, field, metaCons) {
        const { CompanyExec } = require('./company-query.js');
        const { QueueExec } = require('./queue-query.js');
        const { PrescreenExec } = require('./prescreen-query.js');
        const { SessionExec } = require('./session-query.js');

        // extra field that need role value to find
        if (field["sessions"] !== "undefined"
            || field["queues"] !== "undefined"
            || field["prescreens"] !== "undefined"
            || field["registered_prescreens"] !== "undefined") {
            field["role"] = 1;
            field["rec_company"] = 1;
        }

        var isSingle = (type === "single");
        var sql = "";
        if (isSingle) {
            sql = UserQuery.getUser(field, params, metaCons);
        } else {
            sql = UserQuery.getUser(field, params, metaCons);
        }

        var toRet = DB.query(sql).then(function (res) {
            for (var i in res) {

                var user_id = res[i]["ID"];
                var company_id = res[i]["rec_company"];
                var role = res[i]["role"];

                // Cf ****************************************************
                if (typeof field["cf"] !== "undefined") {
                    res[i]["cf"] = DB.getCF("user", user_id);
                }

                // sessions ****************************************************
                if (typeof field["sessions"] !== "undefined") {
                    var par = { status: [SessionEnum.STATUS_ACTIVE, SessionEnum.STATUS_NEW] };
                    if (role === UserEnum.ROLE_STUDENT) {
                        par["participant_id"] = user_id;
                    }
                    if (role === UserEnum.ROLE_RECRUITER) {
                        par["host_id"] = user_id;
                    }

                    res[i]["sessions"] = SessionExec.sessions(par, field["sessions"]);
                }

                // queues ****************************************************
                if (typeof field["queues"] !== "undefined") {
                    var par = { status: QueueEnum.STATUS_QUEUING };
                    if (role === UserEnum.ROLE_STUDENT) {
                        par["student_id"] = user_id;
                    }
                    if (role === UserEnum.ROLE_RECRUITER) {
                        par["company_id"] = company_id;
                    }

                    res[i]["queues"] = QueueExec.queues(par, field["queues"]);
                }

                // prescreens ****************************************************
                if (typeof field["prescreens"] !== "undefined") {
                    var par = { status: PrescreenEnum.STATUS_APPROVED };
                    if (role === UserEnum.ROLE_STUDENT) {
                        par["student_id"] = user_id;
                    }
                    if (role === UserEnum.ROLE_RECRUITER) {
                        par["company_id"] = company_id;
                    }

                    res[i]["prescreens"] = PrescreenExec.prescreens(par, field["prescreens"]);
                }

                // registered_prescreens ****************************************************
                if (typeof field["registered_prescreens"] !== "undefined") {
                    var par = {};
                    if (role === UserEnum.ROLE_STUDENT) {
                        par["student_id"] = user_id;
                    }
                    if (role === UserEnum.ROLE_RECRUITER) {
                        par["company_id"] = company_id;
                    }
                    res[i]["registered_prescreens"] = PrescreenExec.prescreens(par, field["registered_prescreens"]);
                }

                // company ****************************************************
                if (typeof field["company"] !== "undefined") {
                    res[i]["company"] = CompanyExec.company(company_id, field["company"]);
                }

                // doc_links ****************************************************
                if (typeof field["doc_links"] !== "undefined") {
                    res[i]["doc_links"] = DocLinkExec.doc_links({ user_id: user_id }, field["doc_links"]);
                }

                // skills ****************************************************
                if (typeof field["skills"] !== "undefined") {
                    res[i]["skills"] = SkillExec.skills({ user_id: user_id }, field["skills"]);
                }
            }

            if (type === "single") {
                return res[0];
            } else {
                return res;
            }

        });

        return toRet;
    }

    recruiters(company_id, field) {
        var metaCons = {};
        metaCons[UserMeta.REC_COMPANY] = company_id;
        return this.getUserHelper(false, {}, field, metaCons);
    }

    user(params, field) {
        return this.getUserHelper("single", params, field);
    }

    users(params, field) {
        return this.getUserHelper(false, params, field);
    }
}
UserExec = new UserExec();

module.exports = { UserExec, UserQuery };