import {AppConfig} from '../../config';

export function getAxiosGraphQLQuery(axios, queryString) {
    var requestUrl = AppConfig.Api+ "/graphql?";

    //queryString = queryString.replace(/ /g,'');

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

