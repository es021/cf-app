import axios from 'axios';
import {AppConfig} from '../../../config/app-config';

export function getAxiosGraphQLQuery(queryString) {
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

