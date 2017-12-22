import axios from 'axios';
import {store} from '../store.js';
import {AppConfig} from '../../../config/app-config';
import {getAxiosGraphQLQuery} from '../../../helper/api-helper';
const {Queue, QueueEnum, Session, Prescreen} = require('../../../config/db-config');
const obj2arg = require('graphql-obj2arg');

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

export function cancelQueue(id) {
    var query = `mutation{edit_queue(ID:${id}, status:"${QueueEnum.STATUS_CANCELED}"){ID}}`;
    return getAxiosGraphQLQuery(query).then((res) => {
        return res.data.data.edit_queue;
    }, (err) => {
        return err.response.data;
    });
}


export function startQueue(student_id, company_id) {
    var params = {
        student_id: student_id,
        company_id: company_id,
        status: QueueEnum.STATUS_QUEUING
    };

    var query = `mutation {add_queue(${obj2arg(params, {noOuterBraces: true})}) {ID queue_num} }`;
    return getAxiosGraphQLQuery(query).then((res) => {
        return res.data.data.add_queue;
    }, (err) => {
        return err.response.data;
    });
}

//** QUEUE ***************************************************/
export function invalidSession() {
    var sessions = store.getState().hall.activity.sessions;

    if (sessions.length >= 1) {
        return `You currently have an active session now. Please end the session before creating a new one`;
    }

    return false;
}

export function createSession(host_id, participant_id, entity, entity_id) {
    return axios.post(AppConfig.Api + "/activity/create-session", {host_id: host_id, participant_id: participant_id,
        entity: entity, entity_id: entity_id});
}
