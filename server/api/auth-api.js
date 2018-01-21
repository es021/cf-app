const { getAxiosGraphQLQuery, getPHPApiAxios, getWpAjaxAxios } = require('../../helper/api-helper');
const { User, UserMeta, UserEnum } = require('../../config/db-config');
const { SiteUrl } = require('../../config/app-config');
const { AuthUserKey } = require('../../config/auth-config');
const obj2arg = require('graphql-obj2arg');

const AuthAPIErr = {
    WRONG_PASS: "WRONG_PASS",
    INVALID_EMAIL: "INVALID_EMAIL",
    NOT_ACTIVE: "NOT_ACTIVE",
    INVALID_ACTIVATION: "INVALID_ACTIVATION",
    INVALID_CF: "INVALID_CF"
};

class AuthAPI {

    isCFValid(user, cf) {
        var role = user.role;

        if (role == UserEnum.ROLE_STUDENT || role == UserEnum.ROLE_ORGANIZER) {
            return (user[User.CF].indexOf(cf) >= 0);
        } else if (role == UserEnum.ROLE_RECRUITER) {
            return (user.company.cf.indexOf(cf) >= 0);
        } else {
            return (role == UserEnum.ROLE_ADMIN || role == UserEnum.ROLE_EDITOR);
        }

    }

    login(user_email, password, cf) {
        var field = "";
        AuthUserKey.map((d, i) => {
            field += `${d},`;
        });
        field = field.slice(0, -1);
        //console.log(field);
        var user_query = `query{
            user(user_email:"${user_email}"){
                ${field} company {cf}
            }}`;


        return getAxiosGraphQLQuery(user_query).then((res) => {
            var user = res.data.data.user;
            if (user !== null) {
                //check if active
                if (user.user_status === UserEnum.STATUS_NOT_ACT) {
                    return AuthAPIErr.NOT_ACTIVE;
                }

                //check password
                var pass_params = { action: "check_password", password: password, hashed: user.user_pass };
                return getPHPApiAxios("password_hash", pass_params).then((res) => {
                    //password match -- cannot use === operator
                    //console.log(res);

                    // check if password corrent
                    if (res.data == "1") {
                        // check if valid cf
                        if (!this.isCFValid(user, cf)) {
                            return AuthAPIErr.INVALID_CF;
                        } else {
                            delete (user[User.PASSWORD]);
                            delete (user["company"]);
                            user[User.CF] = cf;
                            //get cf object here
                            //user["cf_object"] = {};
                            return user;
                        }
                    } else {
                        return AuthAPIErr.WRONG_PASS;
                    }


                }, (err) => {
                    console.log("Error Auth Api getPHPApiAxios");
                    return err.response.data;
                });
            } else {
                return AuthAPIErr.INVALID_EMAIL;
            }
        }, (err) => {
            console.log("Error Auth Api getAxiosGraphQLQuery", err.response.data);
            return err.response.data;
        });

    }

    createActivationLink(act_key, user_id) {
        return `${SiteUrl}/auth/activate-account/${act_key}/${user_id}`;
    }

    activateAccount(act_key, user_id) {
        var user_query = `query{
            user(ID:${user_id}){
                user_email
                activation_key
                user_status
            }}`;

        return getAxiosGraphQLQuery(user_query).then((res) => {
            var user = res.data.data.user;
            if (user === null) {
                return AuthAPIErr.INVALID_ACTIVATION;
            } else {

                if (user.user_status === UserEnum.STATUS_ACT) {
                    return `User ${user.user_email} already active.`;
                }
                if (act_key === user.activation_key) {
                    var update = {};
                    update[User.ID] = Number.parseInt(user_id);
                    update[UserMeta.USER_STATUS] = UserEnum.STATUS_ACT;

                    var edit_query = `mutation{
                        edit_user(${obj2arg(update, { noOuterBraces: true })}) {
                          ID
                          user_email
                          user_status
                        }
                      }`;

                    return getAxiosGraphQLQuery(edit_query).then((res) => {
                        var user = res.data.data.edit_user;
                        return { user_email: user.user_email };
                    });

                } else {
                    return AuthAPIErr.INVALID_ACTIVATION;
                }
            }
        });
    }

    //raw form from sign up page 
    register(user) {
        //separate userdata and usermeta

        //get cf
        var cf = (user[User.CF]);
        delete (user[User.CF]);

        var userdata = user;
        var usermeta = user;

        var data = {};
        data["userdata"] = userdata;
        data["usermeta"] = usermeta;

        const successInterceptor = (data) => {

            // update cf
            var cf_sql = `mutation{
                edit_user(ID:${data[User.ID]}, cf:"${cf}") {cf}}`;
            getAxiosGraphQLQuery(cf_sql);
            console.log(cf_sql);

            //send Email here
            var act_link = this.createActivationLink(data[UserMeta.ACTIVATION_KEY], data[User.ID]);

            var email_data = {
                to: user[User.EMAIL],
                params: {
                    first_name: user[UserMeta.FIRST_NAME],
                    last_name: user[UserMeta.LAST_NAME],
                    activation_link: act_link
                },
                type: "STUDENT_REGISTRATION"
            };

            console.log("send STUDENT_REGISTRATION email", email_data);

            getWpAjaxAxios("app_send_email", email_data);
        };

        return getWpAjaxAxios("app_register_user", data, successInterceptor);
    }
}

AuthAPI = new AuthAPI();
module.exports = { AuthAPI, AuthAPIErr };
