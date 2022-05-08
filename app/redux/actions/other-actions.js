import axios from 'axios';
import {
    TestUser,
    AppConfig,
    SiteUrl
} from '../../../config/app-config';
import {
    FilterNotObject
} from '../../../config/xls-config';
import {
    getAuthUser
} from './auth-actions';
// import {Time} from "../../lib/time";


export function addEventLog(data) {
    let user_id = getAuthUser().ID;
    return axios.post(AppConfig.Api + "/add-event-log", {
        ...data,
        user_id: user_id
    });
}

export function addLog(event, data = null, user_id = null) {
    if (user_id == null) {
        user_id = getAuthUser().ID;
    }

    if (TestUser.indexOf(user_id) >= 0) {
        //return;
    }

    if (data !== null && typeof data === "object") {
        data = JSON.stringify(data);
    }

    return axios.post(AppConfig.Api + "/add-log", {
        event: event,
        data: data,
        user_id: user_id
    });
}

export function getXLSUrl(action, filter = null) {
    var user = getAuthUser();
    if (FilterNotObject.indexOf(action) <= -1) {
        filter = (filter == null) ? "null" : JSON.stringify(filter);
    }
    filter = encodeURIComponent(filter);

    let version = "encoded-20200519";
    let toRet = SiteUrl + `/xls/${action}/${filter}/${user.user_pass}/${user.ID}?v=${version}`;
    return toRet;
}