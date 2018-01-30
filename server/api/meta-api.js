const { getAxiosGraphQLQuery } = require('../../helper/api-helper');
const axios = require('axios');

class MetaAPI {
    add(key, value, source) {
        var query = `mutation{add_meta(meta_key:"${key}",meta_value:"${value}",source:"${source}"){ ID }}`;
        return getAxiosGraphQLQuery(query).then((res) => {
            return res.data.data.add_meta;
        }, (err) => {
            return err;
        });
    }

}

MetaAPI = new MetaAPI();

module.exports = { MetaAPI };
