const axios = require('axios');
const {AppConfig} = require('../config/app-config');
const qs = require('qs');
const graphQLUrl = AppConfig.Api + "/graphql?";

// add errMes in responseObj.response.data
const rejectPromiseError = function (responseObj, errMes) {
    if (errMes !== null) {
        if (typeof responseObj["response"] === "undefined") {
            responseObj["response"] = {};
        }
        responseObj.response["data"] = errMes;
        return Promise.reject(responseObj);
    }

    return false;
};

// Add a response interceptor
axios.interceptors.response.use(response => {
    //graphql can return error in response as well
    var retErr = null;
    if (response.config.url == graphQLUrl && response.data.errors) {
        //console.log("error from axios graphQLUrl");
        retErr = `[GraphQL Error] ${response.data.errors[0].message}`;
    }

    if (retErr !== null) {
        return rejectPromiseError(response, retErr);
    }

    return response;

}, error => {
    var retErr = null;
    try {
        // error in query -- getAxiosGraphQLQuery
        //console.log("error from axios try");
        if (error.response.config.url == graphQLUrl) {
            //error.response["data"] = `[GraphQL Error] ${error.response.data.errors[0].message}`;
            retErr = `[GraphQL Error] ${error.response.data.errors[0].message}`;
        }

    } catch (e) {
        // no connection -- getPHPApiAxios
        //console.log("error from axios catch");
        if (error.code === undefined) {
            retErr = error.message; //network error
        } else {
            // ECONNREFUSED
            retErr = `${error.code} ${error.address}:${error.port}`;
        }

        retErr = `[Server Error] ${retErr}`;
    }

    if (retErr !== null) {
        return rejectPromiseError(error, retErr);
    }

    //console.log("error from axios finish");
    return Promise.reject(error);
});


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

// only in ajax_external -- response is fixed here
function getWpAjaxAxios(action, data, successInterceptor = null) {
    var params = {};
    params["action"] = action;
    params["data"] = data;

    return axios.post(AppConfig.WPAjaxApi, qs.stringify(params)).then((res) => {
        if (res.data.err) {
            return res.data.err;
        } else {
            
            var retData = res.data.data;
            if (successInterceptor !== null) {
                successInterceptor(retData);
            }

            return retData;
        }
    }, (err) => {
        return err.response.data;
    });
}

//Export functions 
module.exports = {getAxiosGraphQLQuery, getPHPApiAxios, getWpAjaxAxios};