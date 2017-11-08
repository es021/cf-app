import {getNewState} from './_helper';
import * as authActions from '../actions/auth-actions';

const authReducerInitState = {
    isAuthorized: false,
    fetching: false,
    username: null,
    error: null
};

const AUTH_LOCAL_STORAGE = "auth";

function setAuthLocalStorage(newItem) {
    var auth = JSON.parse(window.localStorage.getItem(AUTH_LOCAL_STORAGE));
    if (auth !== null) {
        for (var k in newItem) {
            auth[k] = newItem[k];
        }
    } else {
        auth = newItem;
    }
    window.localStorage.setItem(AUTH_LOCAL_STORAGE, JSON.stringify(auth));
}


var auth = window.localStorage.getItem(AUTH_LOCAL_STORAGE);
if (auth !== null) {
    auth = JSON.parse(auth);
} else {
    auth = authReducerInitState;
    setAuthLocalStorage(authReducerInitState);
}

export default function authReducer(state = auth, action) {
    switch (action.type) {
        case authActions.DO_LOGOUT:
        {
            window.localStorage.removeItem(AUTH_LOCAL_STORAGE);
            return getNewState(state, authReducerInitState);
        }
        case authActions.DO_LOGIN + '_PENDING':
        {
            var newState = {
                fetching: true
            };

            setAuthLocalStorage(newState);
            return getNewState(state, newState);
        }
        case authActions.DO_LOGIN + '_FULFILLED':
        {
            var newState = {
                fetching: false,
                isAuthorized: true
            };

            setAuthLocalStorage(newState);
            return getNewState(state, newState);
        }
        case authActions.DO_LOGIN + '_REJECTED':
        {
            var newState = {
                fetching: false,
                isAuthorized: false,
                error: action.payload.message
            };

            setAuthLocalStorage(newState);
            return getNewState(state, newState);
        }
    }

    return state;
};