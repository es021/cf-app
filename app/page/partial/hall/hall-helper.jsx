

import React from 'react';
import * as hallAction from '../../redux/actions/hall-actions';
import { addLogCreateCall, createGruveoLink } from '../partial/session/chat.jsx';
import * as layoutActions from '../../redux/actions/layout-actions';
import { Time } from '../../lib/time';
import { getAxiosGraphQLQuery, getWpAjaxAxios } from '../../../helper/api-helper';
import obj2arg from 'graphql-obj2arg';
import { GroupSession } from '../../../config/db-config';
import { emitHallActivity } from '../../socket/socket-client';
import { IsGruveoEnable } from '../../../config/app-config';


export function startVideoCall(e, { user_id, successHandler }) {
    var id = e.currentTarget.dataset.id;
    id = Number.parseInt(id);

    var start_time = e.currentTarget.dataset.start_time;
    start_time = Number.parseInt(start_time);

    var joiners = e.currentTarget.dataset.joiners;
    joiners = JSON.parse(joiners);

    const recDoStart = (join_url, start_url) => {
        var updateData = {};
        updateData[GroupSession.ID] = id;
        updateData[GroupSession.JOIN_URL] = join_url;
        updateData[GroupSession.START_URL] = start_url;
        updateData[GroupSession.UPDATED_BY] = user_id;

        // update group session with join_url data
        var query = `mutation { edit_group_session 
            (${obj2arg(updateData, { noOuterBraces: true })})
            {ID}
        }`;

        getAxiosGraphQLQuery(query).then((res) => {
            // emit to joiners to reload group session dorang
            for (var i in joiners) {
                emitHallActivity(hallAction.ActivityType.GROUP_SESSION_JOIN, joiners[i], null);
            }

            layoutActions.storeHideBlockLoader();

            successHandler();
        })
    }

    const confirmCreateWithGruveo = () => {
        let url = createGruveoLink(id, true);
        addLogCreateCall({ isGruveo: true, group_session_id: id, url: url });
        recDoStart(url, url);
        window.open(url);
    }

    const confirmCreateWithZoom = () => {
        addLogCreateCall({ isZoom: true, group_session_id: id });

        layoutActions.loadingBlockLoader("Creating Video Call Session. Please Do Not Close Window.");
        const successInterceptor = (data) => {
            /*
            {"uuid":"bou80/LrR6a0cmDKC4V5aA=="
            ,"id":646923659,"host_id":"-9e--206RFiZFE0hSh-RPQ"
            ,"topic":"Let's start a video call."
            ,"password":"","h323_password":""
            ,"status":0,"option_jbh":false
            ,"option_start_type":"video"
            ,"option_host_video":true,"option_participants_video":true
            ,"option_cn_meeting":false,"option_enforce_login":false
            ,"option_enforce_login_domains":"","option_in_meeting":false
            ,"option_audio":"both","option_alternative_hosts":""
            ,"option_use_pmi":false,"type":1,"start_time":""
            ,"duration":0,"timezone":"America/Los_Angeles"
            ,"start_url":"https://zoom.us/s/646923659?zpk=NcbawuQ7mSE9jfEBdcGMfwxumZzC21eWgm2v6bQ9S6k.AwckNGQwMWY3NWQtNDZhMC00MzU2LTg0M2MtNGVlNWI1MmUzOWY5Fi05ZS0tMjA2UkZpWkZFMGhTaC1SUFEWLTllLS0yMDZSRmlaRkUwaFNoLVJQURJ0ZXN0LnJlY0BnbWFpbC5jb21jAHBTRm01T3I3ZVprU0RGczJCeVRFTlZ5N1k0cE1Zcm5scFF5R3pQZ2RLQjY4LkJnUWdVMDVMU1U1cGNFVmpWeTlESzB0NVVGRm5SbWx3YnpNNFRFNVdWSGxZWjJrQUFBd3pRMEpCZFc5cFdWTXpjejBBAAAWcDF2Skd0YUJRV3k0WC15NzVGRmVtQQIBAQA"
            ,"join_url":"https://zoom.us/j/646923659","created_at":"2018-01-31T02:08:02Z"}
            */

            if (data == null || data == "" || typeof data != "object") {
                layoutActions.errorBlockLoader("Failed to create video call session. Please check your internet connection");
                return;
            }

            console.log("success createVideoCall", data);
            var body = <div>
                <h4 className="text-primary">Successfully Created Video Call Session</h4>
                <br></br>
                <a
                    href={data.start_url} target="_blank"
                    className="btn btn-success btn-lg" onClick={() => { recDoStart(data.join_url, data.start_url) }}>
                    Start Video Call
            </a>
            </div>;
            layoutActions.customBlockLoader(body, null, null, null);
        };

        var data = {
            query: "create_meeting",
            host_id: user_id,
            group_session_id: id,
        };

        getWpAjaxAxios("wzs21_zoom_ajax", data, successInterceptor, true);
    }

    // New Gruveo
    // choose between zoom or chrome
    const recConfirmCreate = () => {
        if (IsGruveoEnable) {
            let width = "100px";
            let v = <div>
                <br></br>
                <div onClick={() => { confirmCreateWithGruveo() }}
                    style={{ width: width }} className="btn btn-blue">Chrome</div>

                <div onClick={() => { confirmCreateWithZoom() }}
                    style={{ width: width }} className="btn btn-blue">Zoom</div>
            </div>
            layoutActions.customViewBlockLoader("Create Video Call With", v);
        } else {
            confirmCreateWithZoom();
        }
    }


    // open confirmation if time now is less than start time
    if (Time.getUnixTimestampNow() < start_time) {
        var title = <div>It is not the time yet<br></br>
            <small>This session was scheduled on<br></br><u>{Time.getString(start_time)}</u>
                <br></br>Continue to start video call now?</small>
        </div>;
        layoutActions.confirmBlockLoader(title, () => {
            recConfirmCreate();
        });
    } else {
        recConfirmCreate();
    }
}