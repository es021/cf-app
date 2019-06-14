const {
    postAxios
} = require('../../helper/api-helper');

const {
    Secret
} = require('../secret/secret');

const DailyCo = {
    ApiKey: Secret.DAILY_CO_KEY
}

class DailyCoApi {
    constructor() {

    }

    createNewRoom() {
        //console.log("createNewRoom")
        /**
             curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $YOUR_API_KEY" \
            -XPOST -d '{"generate_name": true}' \
            https://api.daily.co/v1/rooms
        */

        let url = `https://api.daily.co/v1/rooms`;
        let params = {
            generate_name: true,
        };
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DailyCo.ApiKey}`
        }

        return postAxios(url, params, headers).then((res) => {
            //console.log("[createNewRoom success]", res.data);
            return res.data;
        }).catch((error) => {
            let err = "Server Error";
            try {
                err = error.response.data.error;
            } catch (err) {}
            return err;
        });
    }
}

DailyCoApi = new DailyCoApi();

module.exports = {
    DailyCoApi
};