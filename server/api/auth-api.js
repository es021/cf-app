const axios = require('axios');
const {getAxiosGraphQLQuery, getPHPApiAxios} = require('./_helper-api');

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
                    if(res.data == "1"){
                        delete(user["user_pass"]);
                        return user;
                    } else{
                        return `Wrong password`;
                    }
                });
            } else {
                return `User ${user_email} Does Not Exist`;
            }
        });

    }

    register(user) {

    }
}

AuthAPI = new AuthAPI();
module.exports = {AuthAPI};
