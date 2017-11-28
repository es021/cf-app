import axios from 'axios';
import {store} from '../store.js';
import {AppConfig} from '../../../config/app-config';

export function isAuthorized() {
    return store.getState().auth.isAuthorized;
}

export function getAuthUser() {
    return store.getState().auth.user;
}

export const DO_LOGIN = "DO_LOGIN";
export function login(email, password) {
    return function (dispatch) {
        dispatch({
            type: DO_LOGIN,
            payload: axios.post(AppConfig.Api + "/auth/login", {email: email, password: password})
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
    return axios.post(AppConfig.Api + "/auth/register", {user: user});
}

export function activateAccount(key, user_id) {
    return axios.post(AppConfig.Api + "/auth/activate-account", {key: key, user_id: user_id});
}