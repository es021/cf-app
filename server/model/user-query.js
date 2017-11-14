const DB = require('./DB.js');

const User = {
    // all roles
    FIRST_NAME: "first_name",
    LAST_NAME: "last_name",
    DESCRIPTION: "description",
    ROLE: "wp_cf_capabilities",
    IMG_URL: "reg_profile_image_url",
    IMG_POS: "profile_image_position",
    IMG_SIZE: "profile_image_size",
    FEEDBACK: "feedback",
    IS_ACTIVATED: "is_activated",

    // student only
    UNIVERSITY: "university",
    PHONE_NUMBER: "phone_number",
    GRAD_MONTH: "graduation_month",
    GRAD_YEAR: "graduation_year",
    SPONSOR: "sponsor",
    CGPA: "cgpa",
    MAJOR: "major",
    MINOR: "minor",

    // rec only
    COMPANY_ID: "rec_company",

    // Enum
    ROLE_STUDENT: "student",
    ROLE_RECRUITER: "recruiter",
    ROLE_ADMIN: "administrator"
};

class UserQuery {

    getUser(id, role, page, offset) {
        var id_condition = (typeof id !== "undefined") ? `u.ID = ${id}` : `1=1`;
        var role_condition = (typeof role !== "undefined") ? `(${this.selectMetaMain("u.ID", User.ROLE)}) LIKE '%${role}%' ` : `1=1`;

        var limit = DB.prepareLimit(page, offset);

        var sql = `SELECT u.* 
           ,${this.selectMeta("u.ID", User.FIRST_NAME)}
           ,${this.selectMeta("u.ID", User.LAST_NAME)}
           ,${this.selectMeta("u.ID", User.DESCRIPTION)}
           ,${this.selectMeta("u.ID", User.ROLE, "role")}
           ,${this.selectMeta("u.ID", User.IMG_URL, "img_url")}
           ,${this.selectMeta("u.ID", User.IMG_POS, "img_pos")}
           ,${this.selectMeta("u.ID", User.IMG_SIZE, "img_size")}
           ,${this.selectMeta("u.ID", User.FEEDBACK)}
           ,${this.selectMeta("u.ID", User.IS_ACTIVATED)}
           ,${this.selectMeta("u.ID", User.UNIVERSITY)}
           ,${this.selectMeta("u.ID", User.PHONE_NUMBER)}
           ,${this.selectMeta("u.ID", User.GRAD_MONTH, "grad_month")}
           ,${this.selectMeta("u.ID", User.GRAD_YEAR, "grad_year")}
           ,${this.selectMeta("u.ID", User.SPONSOR)}
           ,${this.selectMeta("u.ID", User.CGPA)}
           ,${this.selectMeta("u.ID", User.MAJOR)}
           ,${this.selectMeta("u.ID", User.MINOR)}
           ,${this.selectMeta("u.ID", User.COMPANY_ID, "company_id")}
           FROM wp_cf_users u WHERE 1=1 AND ${id_condition} AND ${role_condition} ${limit}`;

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

        if (meta_key === User.ROLE) {
            return this.selectRole(user_id, meta_key, as);
        }

        return `(${this.selectMetaMain(user_id, meta_key)}) as ${as}`;
    }

}
UserQuery = new UserQuery();


class UserExec {

    getUserHelper(type, params, discard = []) {

        const {CompanyExec} = require('./company-query.js');
        const {QueueExec} = require('./queue-query.js');

        var isSingle = (type === "single");
        var sql = "";
        if (isSingle) {
            sql = UserQuery.getUser(params.ID);
        } else {
            sql = UserQuery.getUser(undefined, params.role, params.page, params.offset);
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

module.exports = {User, UserExec};