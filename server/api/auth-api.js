const {getAxiosGraphQLQuery, getPHPApiAxios, getWpAjaxAxios} = require('../../helper/api-helper');
const {User, UserEnum} = require('../../config/db-config');

const AuthAPIErr = {
    WRONG_PASS: "WRONG_PASS",
    INVALID_EMAIL: "INVALID_EMAIL",
    NOT_ACTIVE: "NOT_ACTIVE"
};

class AuthAPI {
    login(user_email, password) {
        var user_query = `query{
            user(user_email:"${user_email}"){
                ID, 
                user_email,
                user_pass,
                first_name,
                last_name,
                status
            }}`;

        return getAxiosGraphQLQuery(user_query).then((res) => {
            var user = res.data.data.user;
            if (user !== null) {
                //check if active
                if (user.status === UserEnum.STATUS_NOT_ACT) {
                    return AuthAPIErr.NOT_ACTIVE;
                }

                //check password
                var pass_params = {action: "check_password", password: password, hashed: user.user_pass};
                return getPHPApiAxios("password_hash", pass_params).then((res) => {
                    //password match -- cannot use === operator
                    if (res.data == "1") {
                        delete(user["user_pass"]);
                        return user;
                    } else {
                        return AuthAPIErr.WRONG_PASS;
                    }
                }, (err) => {
                    //console.log("Error Auth Api getPHPApiAxios");
                    return err.response.data;
                });
            } else {
                return AuthAPIErr.INVALID_EMAIL;
            }
        }, (err) => {
            //console.log("Error Auth Api getAxiosGraphQLQuery");
            return err.response.data;
        });

    }

    //raw form from sign up page 
    register(user) {
        //separate userdata and usermeta
        var userdata = user;
        var usermeta = user;

        //need to serialize array of multiple entry

        userdata[User.LOGIN] = userdata[User.EMAIL];

        var data = {};
        data["userdata"] = userdata;
        data["usermeta"] = usermeta;

        //send Email here
        const successInterceptor = function (data) {
            console.log("intercept", data);
        };

        return getWpAjaxAxios("app_register_user", data, successInterceptor);
    }
}

AuthAPI = new AuthAPI();
module.exports = {AuthAPI, AuthAPIErr};
