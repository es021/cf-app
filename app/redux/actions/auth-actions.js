import axios from 'axios';
import { store } from '../store.js';
import { AppConfig } from '../../../config/app-config';
import { AuthUserKey } from '../../../config/auth-config';
import { User, UserEnum } from '../../../config/db-config';
import { Time } from '../../lib/time';

const TEST_USER_ID = [136, 137];

export function isComingSoon() {

    if (TEST_USER_ID.indexOf(getAuthUser().ID) >= 0) {
        return false;
    }

    var start = "";
    switch (getCF()) {
        case "USA":
            start = "Apr 09 2018 08:00:00 GMT -0500 (-05)"; // EST -05
            break;
        default:
            return true;
    }

    var timestart = Time.convertDBTimeToUnix(start);
    var timenow = Time.getUnixTimestampNow();

    // console.log("start time");
    // console.log(timestart);
    // console.log(Time.getString(timestart));
    // console.log("time now")
    // console.log(timenow);
    // console.log(Time.getString(timenow));

    if (timenow >= timestart) {
        //console.log("started");
        return false;
    } else {
        //console.log("coming soon");
        return true;
    }
}

export function getCF() {
    return store.getState().auth.cf;
}

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
export function login(email, password, cf) {
    return function (dispatch) {
        dispatch({
            type: DO_LOGIN,
            payload: axios.post(AppConfig.Api + "/auth/login", { email: email, password: password, cf: cf })
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