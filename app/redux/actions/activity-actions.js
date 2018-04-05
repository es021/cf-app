import axios from 'axios';
import { store } from '../store.js';
import { AppConfig } from '../../../config/app-config';
import { getAxiosGraphQLQuery } from '../../../helper/api-helper';
import { getAuthUser } from './auth-actions';

const { Queue, QueueEnum, Session, Prescreen, SessionRequestEnum } = require('../../../config/db-config');
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

    var query = `mutation {add_queue(${obj2arg(params, { noOuterBraces: true })}) {ID queue_num} }`;
    return getAxiosGraphQLQuery(query).then((res) => {
        return res.data.data.add_queue;
    }, (err) => {
        return err.response.data;
    });
}

//** Session Request ***************************************************/
export function pendingSessionRequestCount(company_id) {
    var srs = store.getState().hall.activity.session_requests;
    var total_pending = 0;
    for (var i in srs) {
        if (srs[i].status === SessionRequestEnum.STATUS_PENDING) {
            total_pending++;
        }
    }

    return total_pending;
}

export const SR_LIMIT = 10;
export function invalidSessionRequest(company_id) {
    var session_requests = store.getState().hall.activity.session_requests;

    var total_pending = 0;
    for (var i in session_requests) {
        var sr = session_requests[i];
        if (sr.company.ID === company_id && sr.status === SessionRequestEnum.STATUS_PENDING) {
            return `You already have a pending interview request for this company. Check your requests list under Interview Request section.`;
        }

        if (sr.status === SessionRequestEnum.STATUS_PENDING) {
            total_pending++;
        }
    }

    if (total_pending >= SR_LIMIT) {
        return `You already have reached ${SR_LIMIT} pending interview request limit. Please cancel current request and try again.`;
    }

    return false;
}

export function addSessionRequest(student_id, company_id) {
    var params = {
        student_id: student_id,
        company_id: company_id,
        status: SessionRequestEnum.STATUS_PENDING
    };

    var query = `mutation {add_session_request(${obj2arg(params, { noOuterBraces: true })}) {ID} }`;
    return getAxiosGraphQLQuery(query).then((res) => {
        res = res.data.data.add_session_request;
        return res;
    }, (err) => {
        return err.response.data;
    });
}

export function updateSessionRequest(id, status) {
    var updated_by = getAuthUser().ID;

    var query = `mutation{edit_session_request(ID:${id}, status:"${status}", updated_by:${updated_by}) {ID, student_id, company_id}}`;
    return getAxiosGraphQLQuery(query).then((res) => {
        return res.data.data.edit_session_request;
    }, (err) => {
        return err.response.data;
    });
}

//** Session ***************************************************/
export function invalidSession() {
    var sessions = store.getState().hall.activity.sessions;

    if (sessions.length >= 1) {
        return `You currently have an active session now. Please end the session before creating a new one`;
    }

    return false;
}

export function createSession(host_id, participant_id, entity, entity_id) {
    return axios.post(AppConfig.Api + "/activity/create-session", {
        host_id: host_id, participant_id: participant_id,
        entity: entity, entity_id: entity_id
    });
}
