import {getNewState} from './_helper';
import * as authActions from '../actions/auth-actions';

const authReducerInitState = {
    user: null,
    isAuthorized: false,
    fetching: false,
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

function fixLocalStorageAuth(auth) {
    if (typeof auth["user"] === "undefined" || typeof auth["isAuthorized"] === "undefined") {
        return authReducerInitState;
    }

    // clear all possible error
    auth["error"] = null;
    auth["fetching"] = false;

    return auth;
}

var auth = window.localStorage.getItem(AUTH_LOCAL_STORAGE);
if (auth !== null) {
    auth = JSON.parse(auth);
    auth = fixLocalStorageAuth(auth);
} else {
    auth = authReducerInitState;
    setAuthLocalStorage(authReducerInitState);
}

export default function authReducer(state = auth, action) {
    switch (action.type) {
        case authActions.UPDATE_USER:
        {

            var newUser = getNewState(state.user, action.payload);

            var newState = {
                user: newUser
            };

            setAuthLocalStorage(newState);
            return getNewState(state, newState);
        }
        case authActions.DO_LOGOUT:
        {
            window.localStorage.removeItem(AUTH_LOCAL_STORAGE);
            return getNewState(state, authReducerInitState);
        }
        case authActions.DO_LOGIN + '_PENDING':
        {
            var newState = {
                fetching: true,
                error: null
            };

            setAuthLocalStorage(newState);
            return getNewState(state, newState);
        }
        case authActions.DO_LOGIN + '_FULFILLED':
        {
            var newState = {
                fetching: false,
                isAuthorized: true,
                user: action.payload.data,
                error: null
            };

            setAuthLocalStorage(newState);
            return getNewState(state, newState);
        }
        case authActions.DO_LOGIN + '_REJECTED':
        {
            var err = action.payload.response.data;

            var newState = {
                fetching: false,
                isAuthorized: false,
                error: err
            };

            setAuthLocalStorage(newState);
            return getNewState(state, newState);
        }
    }

    return state;
};