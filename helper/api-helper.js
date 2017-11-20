const axios = require('axios');
const {AppConfig} = require('../config/app-config');
const qs = require('qs');
const graphQLUrl = AppConfig.Api + "/graphql?";

// Add a response interceptor
axios.interceptors.response.use(response =>
        {
            return response;
        }, error =>
        {
            //console.log("error from axios");
            //console.log(error);
            try {
                // error in query -- getAxiosGraphQLQuery
                if (error.response.config.url == graphQLUrl) {
                    error.response["data"] = `[GraphQL Error] ${error.response.data.errors[0].message}`;
                    return Promise.reject(error);
                }
            } catch (e) {
                // no connection -- getPHPApiAxios
                var retErr = "";
                if (error.code === undefined) {
                    retErr = error.message; //network error
                } else {
                    retErr = error.code;
                }

                error["response"] = {};
                error.response["data"] = `[Server Error] ${retErr}`;
                return Promise.reject(error);
            }

            return Promise.reject(error);
        }
);

function getAxiosGraphQLQuery(queryString) {
    var config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
            query: queryString,
            variables: null
        }
    };

    return axios.post(graphQLUrl, {}, config);
}

function getPHPApiAxios(script, params) {
    var requestUrl = AppConfig.PHPApi + `/cf-app/server/php-api/${script}.php`;
    console.log(requestUrl);
    return axios.post(requestUrl, qs.stringify(params));
}

module.exports = {getAxiosGraphQLQuery, getPHPApiAxios};