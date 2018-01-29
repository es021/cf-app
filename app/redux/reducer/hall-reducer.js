import { getNewState } from './_helper';
import * as hallAction from '../actions/hall-actions';

const hallReducerInitState = {
    activity: {
        sessions: [],
        queues: [],
        prescreens: [],
        fetching: {
            sessions: true,
            queues: true,
            prescreens: true
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
    onlineCompanies: [],
    queueCompanies: []
};

export default function hallReducer(state = hallReducerInitState, action) {
    var key = "";
    var newObj = {};

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
            if (action.type.indexOf(hallAction.ActivityType.SESSION) > -1) {
                newState.fetching["sessions"] = true;
            }

            if (action.type.indexOf(hallAction.ActivityType.QUEUE) > -1) {
                newState.fetching["queues"] = true;
            }

            if (action.type.indexOf(hallAction.ActivityType.PRESCREEN) > -1) {
                newState.fetching["prescreens"] = true;
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
            if (data.user.sessions) {
                newState["sessions"] = data.user.sessions;
                newState.fetching["sessions"] = false;
            }
            if (data.user.queues) {
                newState["queues"] = data.user.queues;
                newState.fetching["queues"] = false;

            }
            if (data.user.prescreens) {
                newState["prescreens"] = data.user.prescreens;
                newState.fetching["prescreens"] = false;

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