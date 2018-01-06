import axios from 'axios';
import { store } from '../store.js';
import { AppConfig } from '../../../config/app-config';
import { AuthUserKey } from '../../../config/auth-config';
import { UserEnum } from '../../../config/db-config';

export function isAuthorized() {
    return store.getState().auth.isAuthorized;
}

export function getAuthUser() {
    if (!isAuthorized()) {
        return {};
    }
    return store.getState().auth.user;
}

export function isRoleStudent() {
    return getAuthUser().role === UserEnum.ROLE_STUDENT;
}

export function isRoleRec() {
    return getAuthUser().role === UserEnum.ROLE_RECRUITER;
}

export function isRoleAdmin() {
    return getAuthUser().role === UserEnum.ROLE_ADMIN ||
        getAuthUser().role === UserEnum.ROLE_ORGANIZER;
}

export const UPDATE_USER = "UPDATE_USER";
export function updateAuthUser(user) {

    //filter out not auth related
    var auth = {};
    for (var k in user) {
        if (AuthUserKey.indexOf(k) >= 0) {
            auth[k] = user[k];
        }
    }

    store.dispatch({
        type: UPDATE_USER,
        payload: auth
    });
}


export const DO_LOGIN = "DO_LOGIN";
export function login(email, password) {
    return function (dispatch) {
        dispatch({
            type: DO_LOGIN,
            payload: axios.post(AppConfig.Api + "/auth/login", { email: email, password: password })
        });
    };
}

export const DO_LOGOUT = "DO_LOGOUT";
export function logout() {
    return function (dispatch) {
        dispatch({
            type: DO_LOGOUT
        });
    };
}


export function register(user) {
    return axios.post(AppConfig.Api + "/auth/register", { user: user });
}

export function activateAccount(key, user_id) {
    return axios.post(AppConfig.Api + "/auth/activate-account", { key: key, user_id: user_id });
}