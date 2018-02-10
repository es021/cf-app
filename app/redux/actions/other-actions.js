import axios from 'axios';
import { AppConfig } from '../../../config/app-config';

export function addLog(event, data = null, user_id = null) {
    return axios.post(AppConfig.Api + "/add-log",
        {
            event: event,
            data: data,
            user_id: user_id
        });
}