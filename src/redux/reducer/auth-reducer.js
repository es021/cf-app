import {getNewState} from './_helper';
import * as authActions from '../actions/auth-actions';

const authReducerInitState = {
    isAuthorized: false,
    fetching: false,
    username: null,
    error: null
};

export default function authReducer(state = authReducerInitState, action) {
    switch (action.type) {
        case authActions.DO_LOGOUT:
        {
            return getNewState(state, authReducerInitState);
        }
        case authActions.DO_LOGIN + '_PENDING':
        {
            return getNewState(state, {
                fetching: true
            });
        }
        case authActions.DO_LOGIN + '_FULFILLED':
        {
            return getNewState(state, {
                fetching: false,
                isAuthorized: true
            });
        }
        case authActions.DO_LOGIN + '_REJECTED':
        {
            return getNewState(state, {
                fetching: false,
                isAuthorized: false,
                error: action.payload.message
            });
        }
    }

    return state;
};