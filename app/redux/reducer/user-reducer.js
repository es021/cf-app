import {
    getNewState
} from './_helper';
import * as userAction from '../actions/user-actions';

const userReducerInitState = {
    online_users: {},
    online_companies: {},
};

export default function userReducer(state = userReducerInitState, action) {
    switch (action.type) {
        case userAction.SET_ONLINE_USERS: {
            return getNewState(state, {
                online_users: action.payload
            });
        }
        case userAction.SET_ONLINE_COMPANIES: {
            return getNewState(state, {
                online_companies: action.payload
            });
        }
    }

    return state;
};