import {getNewState} from './_helper';
import * as hallAction from '../actions/hall-actions';

const hallReducerInitState = {
    traffic: {
        data: [],
        fetching: true,
        error: null
    },
    companies: {
        data: [],
        fetching: true,
        error: null
    }
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

    // pending, set fetching to true
    if (action.type.indexOf('_PENDING') > -1) {
        var newState = getNewState(state[key], {
            fetching: true
        });

        newObj[key] = newState;
        return getNewState(state, newObj);

    }
    // fulfilled, set fetching to false and set data
    else if (action.type.indexOf('_FULFILLED') > -1) {
        var newState = getNewState(state[key], {
            fetching: false,
            data: action.payload.data.data
        });

        newObj[key] = newState;
        return getNewState(state, newObj);

    }
    // rejected, set fetching to false and set error
    else if (action.type.indexOf('_REJECTED') > -1) {
        var newState = getNewState(state[key], {
            fetching: false,
            error: action.payload.message
        });

        newObj[key] = newState;
        return getNewState(state, newObj);

    } else {
        return state;
    }

    return state;
};