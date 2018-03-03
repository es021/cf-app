
const { getAxiosGraphQLQuery, getPHPApiAxios, getWpAjaxAxios } = require('./helper/api-helper');
const obj2arg = require('graphql-obj2arg');
const axios = require('axios');
const { Time } = require('./app/lib/time');

class CronAPI {

    start() {
        var date = new Date();
        this.log("-------------------");
        this.log("START CRON JOB");
        this.log("-------------------");
        this.updateZoomMeetingStatus();
    }

    log(m) {
        var time = Time.getString(Time.getUnixTimestampNow());

        console.log(`[${time}]`, m);
    }

    finishJob(func, param, res) {
        this.log(`Finished run ${func} with param ${JSON.stringify(param)}`);
        this.log(res);
    }

    updateZoomMeetingStatus() {
        this.log("updateZoomMeetingStatus");

        // get all null is_expired zoom meetings
        var q = `query{zoom_invites(is_expired:false) {
              join_url
              session_id}}`;

        getAxiosGraphQLQuery(q).then((res) => {
            res.data.data.zoom_invites.map((d, i) => {
                var data = {
                    query: "is_meeting_expired",
                    join_url: d.join_url,
                    session_id: d.session_id
                };

                getWpAjaxAxios("wzs21_zoom_ajax", data
                    , (res) => { this.finishJob("updateZoomMeetingStatus", data, res) }
                    , true);
            });

        });
    }
}

CronAPI = new CronAPI();

CronAPI.start();