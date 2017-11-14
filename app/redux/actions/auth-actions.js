import axios from 'axios';
import {store} from '../store.js';
import {AppConfig} from '../../../config/app-config';

export function isAuthorized() {
    return store.getState().auth.isAuthorized;
}

export const DO_LOGIN = "DO_LOGIN";
export function login(username, password) {
    return function (dispatch) {
        dispatch({
            type: DO_LOGIN,
            payload: axios.post(AppConfig.Api + "/login", {username: username, password: password})
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
