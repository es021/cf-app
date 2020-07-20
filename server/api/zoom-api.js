const {
    getAxios,
    postAxios,
    deleteAxios,
    graphql
} = require('../../helper/api-helper');
const obj2arg = require("graphql-obj2arg");

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
        //console.log("[error]", err);
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
    localCreate(postParam, meetingData) {
        /**
         *     $ins[self::COL_SESSION_ID] = $session_id;
        $ins[self::COL_GROUP_SESSION_ID] = $group_session_id;
        $ins[self::COL_HOST_ID] = $host_id;
        $ins[self::COL_ZOOM_HOST_ID] = $zoom_data->host_id;
        $ins[self::COL_ZOOM_MEETING_ID] = $zoom_data->id;
        $ins[self::COL_START_URL] = $zoom_data->start_url;
        $ins[self::COL_JOIN_URL] = $zoom_data->join_url;
         */
        var data = {
            pre_screen_id: postParam.pre_screen_id,
            group_session_id: postParam.group_session_id,
            host_id: postParam.host_id,
            zoom_host_id: meetingData.host_id,
            zoom_meeting_id: meetingData.id,
            start_url: meetingData.start_url,
            join_url: meetingData.join_url,
        };
        var q = `mutation{add_zoom_meeting(${obj2arg(data, {
            noOuterBraces: true
        })}) {ID}}`;
        return graphql(q)
    }
    localUpdateExpired(meetingLocalData) {
        var data = {
            ID : meetingLocalData.ID,
            is_expired : "1"
        };
        var q = `mutation{edit_zoom_meeting(${obj2arg(data, {
            noOuterBraces: true
        })}) {ID}}`;
        return graphql(q)
    }
    localGet(postParam) {
        var data = {
            join_url: postParam.join_url,
            pre_screen_id: postParam.pre_screen_id,
            group_session_id: postParam.group_session_id,
            zoom_host_id: postParam.zoom_host_id,
            zoom_meeting_id: postParam.zoom_meeting_id,
        };
        var q = `query{zoom_meeting(${obj2arg(data, {
            noOuterBraces: true
        })}) { ID is_expired zoom_meeting_id}}`;
        return graphql(q).then((res) => {
            return res.data.data.zoom_meeting;
        });
    }
    isExpired(param) {
        console.log("isExpired", param);

        // check local
        return this.localGet(param).then((meetingLocalData) => {
            // console.log("meetingLocalData", meetingLocalData)
            if (meetingLocalData.is_expired == "1") {
                return { is_expired: true }
            } else {
                let zoom_meeting_id = meetingLocalData.zoom_meeting_id;
                // kalau belum expired, check zoom
                return getAxios(`${Zoom.RootUrl}/meetings/${zoom_meeting_id}`, {}, this.getHeaders()).then((res) => {
                    let meetingData = res.data;
                    let meetingStatus = meetingData.status;
                    // console.log("meetingStatus", meetingStatus);
                    if (meetingStatus == "waiting" || meetingStatus == "started") {
                        return { is_expired: false, is_waiting: meetingStatus == "waiting" }
                    } else {
                        this.localUpdateExpired(meetingLocalData);
                        return { is_expired: true }
                    }
                }).catch((err) => {
                    this.localUpdateExpired(meetingLocalData);
                    return { is_expired: true }
                })

            }
        })

    }
    createMeeting(param) {
        //console.log("param", param);

        return this.custCreateUser().then((userData) => {
            let userId = userData.id;

            return postAxios(
                `${Zoom.RootUrl}/users/${userId}/meetings`,
                {
                    "topic": "Private Call",
                    "type": "1",
                    "settings": {
                        "host_video": true,
                        "participant_video": true,
                        "waiting_room" : false,
                        "meeting_authentication": false
                    }
                },
                this.getHeaders()
            ).then((res) => {
                let meetingData = res.data;
                // console.log("meetingData", meetingData);

                if(param.isSkipLocalCreate){
                    return meetingData;
                }

                return this.localCreate(param, meetingData).then((resLocalCreate) => {
                    // console.log("resLocalCreate",resLocalCreate)
                    return meetingData;
                })
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