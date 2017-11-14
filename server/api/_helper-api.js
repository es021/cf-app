const axios = require('axios');
const {AppConfig} = require('../../config/app-config');
const qs = require('qs');

function getAxiosGraphQLQuery(queryString) {
    var requestUrl = AppConfig.Api + "/graphql?";

    var config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
            query: queryString,
            variables: null
        }
    };

    return axios.post(requestUrl, {}, config);
}

function getPHPApiAxios(script, params) {
    var requestUrl = AppConfig.PHPApi + `/cf-app/server/php-api/${script}.php`;
    return axios.post(requestUrl, qs.stringify(params));
}

module.exports = {getAxiosGraphQLQuery, getPHPApiAxios};