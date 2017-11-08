export function getAxiosGraphQLQuery(axios, queryString) {
    var requestUrl = "http://localhost:4000/graphql?";

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

