import axios from 'axios';
import { TestUser, AppConfig, SiteUrl } from '../../../config/app-config';
import { getAuthUser } from './auth-actions';


export function addLog(event, data = null, user_id = null) {
    if (user_id == null) {
        user_id = getAuthUser().ID;
    }

    if (TestUser.indexOf(user_id) >= 0) {
        //return;
    }

    return axios.post(AppConfig.Api + "/add-log",
        {
            event: event,
            data: data,
            user_id: user_id
        });
}

export function getXLSUrl(action, filter = null) {
    var user = getAuthUser();


    filter = (filter == null) ? "null" : JSON.stringify(filter);
    return SiteUrl + `/xls/${action}/${filter}/${user.user_pass}/${user.ID}`;
}