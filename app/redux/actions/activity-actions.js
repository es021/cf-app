import axios from 'axios';
import {store} from '../store.js';
import {AppConfig} from '../../../config/app-config';

//** QUEUE ***************************************************/
export const QUEUE_LIMIT = 3;
export function invalidQueue(company_id) {
    var queues = store.getState().hall.activity.queues;

    for (var i in queues) {
        if (queues[i].company.ID === company_id) {
            return `You are already queuing for this company.`;
        }
    }


    if (queues.length >= QUEUE_LIMIT) {
        return `You have already reached ${QUEUE_LIMIT} queue limit. Please cancel current queue and try again.`;
    }

    return false;
}

export function startQueue(student_id, company_id) {
    return axios.post(AppConfig.Api + "/activity/start-queue", {student_id: student_id, company_id: company_id});
}
