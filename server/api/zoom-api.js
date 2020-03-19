const {
    getAxios,
    postAxios,
    deleteAxios
} = require('../../helper/api-helper');

const jwt = require('jsonwebtoken');
const {
    Secret
} = require('../secret/secret');

const Zoom = {
    RootUrl: "https://api.zoom.us/v2",
}


class ZoomApi {
    constructor() {
    }
    getToken() {
        const payload = {
            iss: Secret.ZOOM_API_KEY,
            exp: ((new Date()).getTime() + 5000)
        };

        //Automatically creates header, and returns JWT
        let token = jwt.sign(payload, Secret.ZOOM_API_SECRET);
        //console.log("token", token);
        //token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6IlJ3dmdNY1dwUmphanFPSTRRdXRsZFEiLCJleHAiOjE1ODQ2MzQ3NjIsImlhdCI6MTU4NDU0ODM2M30.chCkQhW3vo4dDvsBnkNJKrPkJszN6VJlPm_fBHqSx9c`
        return token;

    }
    getHeaders() {
        return {
            'User-Agent': 'Zoom-api-Jwt-Request',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
        };
    }
    returnError(error) {
        /**
             * { code: 300,
                message: 'Validation Failed.',
                errors: [ { field: 'user_info.email', message: 'Invalid field.' } ] }
             */
        let err = "";
        try {
            err = error.response.data;
        } catch (err) { }

        if (!err) {
            err = "Server Error";
        }
        console.log("[error]", err);
        return err;
    }

    // deleteRoom(name) {
    //     let url = `${Zoom.RootUrl}/rooms/${name}`;
    //     let headers = this.getHeaders();

    //     return deleteAxios(url, headers).then((res) => {
    //         return res.data;
    //     }).catch((error) => {
    //         return this.returnError(error);
    //     });
    // }
    custCreateUser() {
        let url = `${Zoom.RootUrl}/users`;
        let uid = "seeds" + (new Date()).getTime() + "@seeds.com";
        let params = {
            "action": "custCreate",
            "user_info": {
                email: uid,
                type: 1,
                first_name: uid,
                last_name: ""
            }
        }
        return postAxios(url, params, this.getHeaders()).then((res) => {
            return res.data;
        });
    }
    createMeeting() {
        return this.custCreateUser().then((userData) => {
            let userId = userData.id;

            return postAxios(
                `${Zoom.RootUrl}/users/${userId}/meetings`,
                {
                    "topic": "Private Call",
                    "type": "1",
                },
                this.getHeaders()
            ).then((res)=>{
                let meetingData = res.data;
                console.log("meetingData", meetingData);
                return meetingData;
            })

        }).catch((error) => {
            console.log(error);
            return this.returnError(error);
        });

    }
}

ZoomApi = new ZoomApi();

module.exports = {
    ZoomApi
};