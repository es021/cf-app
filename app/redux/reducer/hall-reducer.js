import {
    getNewState
} from './_helper';
import * as hallAction from '../actions/hall-actions';

const hallReducerInitState = {
    activity: {
        group_session_joins: [],
        sessions: [],
        queues: [],
        session_requests: [],
        prescreens: [],
        zoom_invites: [],
        fetching: {
            group_session_joins: true,
            sessions: true,
            queues: true,
            session_requests: true,
            prescreens: true,
            zoom_invites: true
        },
        error: null
    },
    traffic: {
        data: [],
        fetching: true,
        error: null
    },
    companies: {
        data: [],
        fetching: true,
        error: null
    },
    // from socket

    // dah tak pakai dah, kita pakai kat store.user.online_companies
    onlineCompanies: [],
    queueCompanies: []
};

export default function hallReducer(state = hallReducerInitState, action) {
    var key = "";
    var newObj = {};
  console.log("Action")
    //set key here
    if (action.type.indexOf(hallAction.TRAFFIC) > -1) {
        key = "traffic";
    }

    if (action.type.indexOf(hallAction.FETCH_COMPANIES) > -1) {
        key = "companies";
    }

    if (action.type.indexOf(hallAction.ACTIVITY) > -1) {
        key = "activity";
    }

    // pending, set fetching to true
    if (action.type.indexOf('_PENDING') > -1) {

        var newState = {};

        if (key !== "activity") {
            newState["fetching"] = true;
        } else {
            newState["fetching"] = state[key]["fetching"];

            if (action.type.indexOf(hallAction.ActivityType.SESSION_REQUEST) > -1) {
                newState.fetching["session_requests"] = true;
            } else if (action.type.indexOf(hallAction.ActivityType.SESSION) > -1) {
                newState.fetching["sessions"] = true;
            } else if (action.type.indexOf(hallAction.ActivityType.QUEUE) > -1) {
                newState.fetching["queues"] = true;
            } else if (action.type.indexOf(hallAction.ActivityType.PRESCREEN) > -1) {
                newState.fetching["prescreens"] = true;
            } else if (action.type.indexOf(hallAction.ActivityType.ZOOM_INVITE) > -1) {
                newState.fetching["zoom_invites"] = true;
            } else if (action.type.indexOf(hallAction.ActivityType.GROUP_SESSION_JOIN) > -1) {
                newState.fetching["group_session_joins"] = true;
            } else if (action.type.indexOf(hallAction.ActivityType.NOTIFICATION_COUNT) > -1) {
                newState.fetching["notification_count"] = true;
            } else if (action.type.indexOf(hallAction.ActivityType.INBOX_COUNT) > -1) {
                newState.fetching["inbox_count"] = true;
            }
        }


        newState = getNewState(state[key], newState);
        newObj[key] = newState;
        return getNewState(state, newObj);

    }
    // fulfilled, set fetching to false and set data
    else if (action.type.indexOf('_FULFILLED') > -1) {
        var data = action.payload.data.data;
        var newState = {};

        if (key !== "activity") {
            newState["data"] = data;
            newState["fetching"] = false;
        } else {
            newState["fetching"] = state[key]["fetching"];
            if (data.user && data.user.sessions) {
                newState["sessions"] = data.user.sessions;
                newState.fetching["sessions"] = false;
            }
            if (data.user && data.user.queues) {
                newState["queues"] = data.user.queues;
                newState.fetching["queues"] = false;
            }
            if (data.user && data.user.session_requests) {
                newState["session_requests"] = data.user.session_requests;
                newState.fetching["session_requests"] = false;
            }
            if (data.user && data.user.prescreens) {
                newState["prescreens"] = data.user.prescreens;
                newState.fetching["prescreens"] = false;
            }
            if (data.user && data.user.zoom_invites) {
                newState["zoom_invites"] = data.user.zoom_invites;
                newState.fetching["zoom_invites"] = false;
            }
            if (data.user && data.user.group_sessions) {
                newState["group_session_joins"] = data.user.group_sessions;
                newState.fetching["group_session_joins"] = false;
            }
            if (data.notifications && data.notifications[0]) {
                newState["notification_count"] = data.notifications[0].ttl;
                newState.fetching["notification_count"] = false;
            }
            if (data.messages_count) {
                newState["inbox_count"] = data.messages_count.total_unread;
                newState.fetching["inbox_count"] = false;
            }
        }

        newState = getNewState(state[key], newState);
        newObj[key] = newState;
        return getNewState(state, newObj);

    }
    // rejected, set fetching to false and set error
    else if (action.type.indexOf('_REJECTED') > -1) {
        var newState = getNewState(state[key], {
            fetching: false,
            error: action.payload
        });

        newObj[key] = newState;
        return getNewState(state, newObj);

    } else {

        // non axios action
        if (action.type == hallAction.SET_NON_AXIOS) {
            var newState = {};
            newState[action.payload.key] = action.payload.data;
            return getNewState(state, newState);
        }

        return state;
    }

    return state;
};