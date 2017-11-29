const DB = require('./DB.js');

const {User, UserMeta} = require('../../config/db-config.js');

class UserQuery {

    getUser(id, email, role, page, offset) {
        var id_condition = (typeof id !== "undefined") ? `u.ID = ${id}` : `1=1`;
        var email_condition = (typeof email !== "undefined") ? `u.user_email = '${email}'` : `1=1`;
        var role_condition = (typeof role !== "undefined") ? `(${this.selectMetaMain("u.ID", UserMeta.ROLE)}) LIKE '%${role}%' ` : `1=1`;

        var limit = DB.prepareLimit(page, offset);

        var sql = `SELECT u.* 
           ,${this.selectMeta("u.ID", UserMeta.FIRST_NAME)}
           ,${this.selectMeta("u.ID", UserMeta.LAST_NAME)}
           ,${this.selectMeta("u.ID", UserMeta.DESCRIPTION)}
           ,${this.selectMeta("u.ID", UserMeta.ROLE, "role")}
           ,${this.selectMeta("u.ID", UserMeta.IMG_URL, "img_url")}
           ,${this.selectMeta("u.ID", UserMeta.IMG_POS, "img_pos")}
           ,${this.selectMeta("u.ID", UserMeta.IMG_SIZE, "img_size")}
           ,${this.selectMeta("u.ID", UserMeta.FEEDBACK)}
           ,${this.selectMeta("u.ID", UserMeta.STATUS, "user_status")}
           ,${this.selectMeta("u.ID", UserMeta.UNIVERSITY)}
           ,${this.selectMeta("u.ID", UserMeta.PHONE_NUMBER)}
           ,${this.selectMeta("u.ID", UserMeta.GRAD_MONTH, "grad_month")}
           ,${this.selectMeta("u.ID", UserMeta.GRAD_YEAR, "grad_year")}
           ,${this.selectMeta("u.ID", UserMeta.SPONSOR)}
           ,${this.selectMeta("u.ID", UserMeta.ACTIVATION_KEY)}
           ,${this.selectMeta("u.ID", UserMeta.CGPA)}
           ,${this.selectMeta("u.ID", UserMeta.MAJOR)}
           ,${this.selectMeta("u.ID", UserMeta.MINOR)}
           ,${this.selectMeta("u.ID", UserMeta.COMPANY_ID, "company_id")}
           FROM wp_cf_users u WHERE 1=1 AND ${id_condition} AND ${email_condition} AND ${role_condition} ${limit}`;

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
        
        var userMetaVal = Object.keys(UserMeta).map(function (key) {
            return UserMeta[key];
        });
        
        for (var k in data) {

            if (userMetaVal.indexOf(k) > -1) {
                meta_key_in += `'${k}',`;
                meta_pair_case += ` WHEN '${k}' THEN '${data[k]}' `;
            }
        }

        var sql = `UPDATE wp_cf_usermeta
            SET meta_value = CASE meta_key 
            ${meta_pair_case} 
            END
          WHERE meta_key IN (${meta_key_in.slice(0, -1)}) and user_id = '${user_id}'`;

        return DB.con.query(sql);
    }

    editUser(arg) {
        var ID = arg.ID;

        //update User table
        var updateUser = {};
        console.log(User);

        var userVal = Object.keys(User).map(function (key) {
            return User[key];
        });


        for (var k in arg) {
            if (userVal.indexOf(k) > -1) {
                updateUser[k] = arg[k];
            }
        }

        //if there is nothing to update from user table,
        //update user meta
        if (Object.keys(updateUser).length < 2) { // include ID
            return this.updateUserMeta(ID, arg);
        } else {
            return DB.update(User.TABLE, updateUser).then((res) => {
                //update user meta
                this.updateUserMeta(ID, arg);
            });
        }
    }

    getUserHelper(type, params, discard = []) {

        const {CompanyExec} = require('./company-query.js');
        const {QueueExec} = require('./queue-query.js');

        var isSingle = (type === "single");
        var sql = "";
        if (isSingle) {
            sql = UserQuery.getUser(params.ID, params.user_email);
        } else {
            sql = UserQuery.getUser(undefined, undefined, params.role, params.page, params.offset);
        }

        var toRet = DB.con.query(sql).then(function (res) {
            for (var i in res) {
                if (discard.indexOf("users") <= -1) {
                    var user_id = res[i]["ID"];
                    res[i]["queues"] = QueueExec.queues({student_id: user_id}, ["users"]);
                }

                var company_id = res[i]["company_id"];
                res[i]["company"] = CompanyExec.company(company_id);
            }

            if (type === "single") {
                return res[0];
            } else {
                return res;
            }

        });

        return toRet;
    }

    user(params, discard) {
        return this.getUserHelper("single", params, discard);
    }

    users(params) {
        return this.getUserHelper(false, params);
    }
}
UserExec = new UserExec();

module.exports = {UserExec};