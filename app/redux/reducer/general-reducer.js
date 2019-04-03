import {
    getNewState
} from './_helper';
import * as generalAction from '../actions/general-actions';

const generalReducerInitState = {};

export default function userReducer(state = generalReducerInitState, action) {
    switch (action.type) {
        case generalAction.SET_GENERAL_ATTR:
            {
                let newState = {};
                newState[action.payload.attr] = action.payload.data;
                return getNewState(state, newState);
            }
    }
    return state;
};