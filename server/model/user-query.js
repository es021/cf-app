const DB = require('./DB.js');

const {User, UserMeta} = require('../../config/db-config.js');
const {DocLinkExec} = require('./doclink-query.js');

class UserQuery {

    getUser(field, id, email, role, page, offset) {
        var id_condition = (typeof id !== "undefined") ? `u.ID = ${id}` : `1=1`;
        var email_condition = (typeof email !== "undefined") ? `u.user_email = '${email}'` : `1=1`;
        var role_condition = (typeof role !== "undefined") ? `(${this.selectMetaMain("u.ID", UserMeta.ROLE)}) LIKE '%${role}%' ` : `1=1`;

        var limit = DB.prepareLimit(page, offset);

        var meta_sel = "";
        for (var k in UserMeta) {
            var meta_key = k.toLowerCase();
            if (typeof field[meta_key] !== "undefined") {
                meta_sel += `, ${this.selectMeta("u.ID", UserMeta[k], meta_key)}`;
            }
        }
       var sql = `SELECT u.* ${meta_sel}
           FROM wp_cf_users u WHERE 1=1 AND ${id_condition} AND ${email_condition} AND ${role_condition} ${limit}`;
        
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
           ,${this.selectMeta("u.ID", UserMeta.GRAD_MONTH)}
           ,${this.selectMeta("u.ID", UserMeta.GRAD_YEAR)}
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

        console.log(update_sql);

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
            return this.update(User.TABLE, updateUser);
        }

        //update both
        //console.log("update both");
        return DB.update(User.TABLE, updateUser).then((res) => {
            return this.updateUserMeta(ID, updateUserMeta);
        });

    }

    getUserHelper(type, params, field) {
        const {CompanyExec} = require('./company-query.js');
        const {QueueExec} = require('./queue-query.js');

        var isSingle = (type === "single");
        var sql = "";
        if (isSingle) {
            sql = UserQuery.getUser(field, params.ID, params.user_email);
        } else {
            sql = UserQuery.getUser(field, undefined, undefined, params.role, params.page, params.offset);
        }
        console.log("getUserHelper", params);
        console.log(sql);
        
        var toRet = DB.query(sql).then(function (res) {
            for (var i in res) {

                if (typeof field["queues"] !== "undefined") {
                    var user_id = res[i]["ID"];
                    res[i]["queues"] = QueueExec.queues({student_id: user_id}, field["queues"]);
                }

                if (typeof field["company"] !== "undefined") {
                    var company_id = res[i]["company_id"];
                    res[i]["company"] = CompanyExec.company(company_id, field["company"]);
                }

                if (typeof field["doc_links"] !== "undefined") {
                    var user_id = res[i]["ID"];
                    res[i]["doc_links"] = DocLinkExec.doc_links({user_id: user_id});
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

    user(params, field) {
        return this.getUserHelper("single", params, field);
    }

    users(params,field) {
        return this.getUserHelper(false, params,field);
    }
}
UserExec = new UserExec();

module.exports = {UserExec};