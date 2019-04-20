const { getAxiosGraphQLQuery, getPHPApiAxios, getWpAjaxAxios } = require('../../helper/api-helper');
const { SiteUrl } = require('../../config/app-config');
const obj2arg = require('graphql-obj2arg');
const jwt = require('jsonwebtoken');
const axios = require('axios');

class ZoomAPI {
    constructor() {
        const API_KEY = "RwvgMcWpRjajqOI4QutldQ";
        const API_SECRET = "Ew6CpwhWCPrfNOe9UAl4Eyd2iMwVaVmL3EGs";
        const token = jwt.sign({ iss: API_KEY, exp: ((new Date()).getTime() + 5000) }, API_SECRET);

        this.API_CONFIG = {
            headers: { "Authorization": `Bearer ${token}` }
        }
        this.API_URL = "https://api.zoom.us/v2/";
        this.ADMIN_ID = "-D5eW-CMTJCocauHSguLjw";
    }

    get(action) {
        axios.get(this.API_URL + action, this.API_CONFIG).then((res) => {
            console.log(res);
        }, (err) => {
            console.log(err);
        })
    }

}

ZoomAPI = new ZoomAPI();

//ZoomAPI.get("users");

module.exports = { ZoomAPI };
