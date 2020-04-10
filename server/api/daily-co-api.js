const {
    postAxios,
    deleteAxios
} = require('../../helper/api-helper');

const {
    Secret
} = require('../secret/secret');

const DailyCo = {
    RootUrl: "https://api.daily.co/v1",
    ApiKey: Secret.DAILY_CO_KEY
}


class DailyCoApi {
    constructor() {}

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DailyCo.ApiKey}`
        };
    }
    returnError(error) {
        let err = "Server Error";
        console.log("[createNewRoom error]", error.response.data.error);
        try {
            err = error.response.data.error;
        } catch (err) {}
        return err;
    }

    deleteRoom(name) {
        let url = `${DailyCo.RootUrl}/rooms/${name}`;
        let headers = this.getHeaders();

        return deleteAxios(url, headers).then((res) => {
            return res.data;
        }).catch((error) => {
            return this.returnError(error);
        });
    }
    createNewRoom() {
        //console.log("createNewRoom")
        /**
             curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $YOUR_API_KEY" \
            -XPOST -d '{"generate_name": true}' \
            https://api.daily.co/v1/rooms
        */

        let url = `${DailyCo.RootUrl}/rooms`;
        let params = {
            generate_name: true,
        };
        let headers = this.getHeaders();

        return postAxios(url, params, headers).then((res) => {
            return res.data;
        }).catch((error) => {
            return this.returnError(error);
        });
    }
}

DailyCoApi = new DailyCoApi();

module.exports = {
    DailyCoApi
};