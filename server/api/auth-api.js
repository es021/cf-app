const {getAxiosGraphQLQuery, getPHPApiAxios, getWpAjaxAxios} = require('../../helper/api-helper');
const {User} = require('../../config/db-config');

class AuthAPI {
    login(user_email, password) {
        var user_query = `query{
            user(user_email:"${user_email}"){
                ID, 
                user_email,
                user_pass,
                first_name,
                last_name
            }}`;

        return getAxiosGraphQLQuery(user_query).then((res) => {
            var user = res.data.data.user;
            if (user !== null) {
                //check password
                var pass_params = {action: "check_password", password: password, hashed: user.user_pass};
                return getPHPApiAxios("password_hash", pass_params).then((res) => {
                    //password match -- cannot use === operator
                    if (res.data == "1") {
                        delete(user["user_pass"]);
                        return user;
                    } else {
                        return `Wrong password`;
                    }
                }, (err) => {
                    //console.log("Error Auth Api getPHPApiAxios");
                    return err.response.data;
                });
            } else {
                return `User ${user_email} Does Not Exist`;
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
module.exports = {AuthAPI};
