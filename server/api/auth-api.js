const axios = require('axios');
const {getAxiosGraphQLQuery, getPHPApiAxios} = require('./_helper-api');

/*
 * { errors:
 [ { message: 'connect ECONNREFUSED 127.0.0.1:3306',
 locations: [Object],
 path: [Object] } ],
 data: { user: null } }
 */
class AuthAPI {
    login(user_email, password) {
        user_email = "zulsarhan.shaari@gmail.com";
        password = "Gundamseed@21";
        return getAxiosGraphQLQuery(`
        query{
            user(user_email:"${user_email}"){
                ID,
                user_email,
                user_pass,
                first_name,
                last_name
            }
        }`).then((res) => {
            var user = res.data.data.user;

            if (user !== null) {
                //check password

                getPHPApiAxios("password_hash", {action: "check_password", password: password, hashed: user.user_pass})
                        .then((res) => {
                            console.log(res.data);
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
