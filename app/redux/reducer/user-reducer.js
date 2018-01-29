import { getNewState } from './_helper';
import * as userAction from '../actions/user-actions';

const userReducerInitState = {
    online_users: {}
};

export default function userReducer(state = userReducerInitState, action) {
    switch (action.type) {
        case userAction.SET_ONLINE_USERS:
            {
                return getNewState(state, {
                    online_users: action.payload
                });
            }
    }

    return state;
};