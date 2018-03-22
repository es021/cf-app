import axios from 'axios';
import { store } from '../store.js';
import { AppConfig, TestUser } from '../../../config/app-config';
import { AuthUserKey } from '../../../config/auth-config';
import { User, UserEnum } from '../../../config/db-config';
import { CareerFair, CareerFairOrg } from '../../../config/cf-config';
import { Time } from '../../lib/time';

//const TEST_USER_ID = [136, 137];
export function isComingSoon() {
    if (isTestUser()) {
        return false;
    }

    var start = getCFObj.start;

    if (start == null) {
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
        return false;
    } else {
        return true;
    }
}

// ############################################
// CF
export function getCFOrg() {
    return CareerFairOrg[getCF()];
}

export function getCFObj() {
    return CareerFair[getCF()];
}

export function getCF() {
    return store.getState().auth.cf;
}

export function isAuthorized() {
    return store.getState().auth.isAuthorized;
}

export function getOtherRecs() {
    if (isRoleRec()) {
        return store.getState().auth.user.company.recruiters;
    }
    return [];
}


// ############################################
// Auth
export function getCompany() {
    if (!isRoleRec()) {
        return null;
    } else {
        return getAuthUser().company;
    }
}

export function getAuthUser() {
    if (!isAuthorized()) {
        return {};
    }
    return store.getState().auth.user;
}

export function isCookieEnabled() {
    return store.getState().auth.cookie;
}

export function isRoleStudent() {
    return getAuthUser().role === UserEnum.ROLE_STUDENT;
}

export function isRoleRec() {
    return getAuthUser().role === UserEnum.ROLE_RECRUITER;
}

export function isRoleOrganizer() {
    return getAuthUser().role === UserEnum.ROLE_ORGANIZER;
}

export function isRoleSupport() {
    return getAuthUser().role === UserEnum.ROLE_SUPPORT;
}

export function isRoleAdmin() {
    return getAuthUser().role === UserEnum.ROLE_EDITOR
        || getAuthUser().role === UserEnum.ROLE_ADMIN
        || getAuthUser().role === UserEnum.ROLE_SUPPORT;
}

export function isTestUser() {
    return TestUser.indexOf(getAuthUser().ID) >= 0;
}

// ############################################
// REDUX ACTIONS

export const UPDATE_USER = "UPDATE_USER";
export function updateAuthUser(user, force = false) {

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

import { emitLogout } from '../../socket/socket-client';

export const DO_LOGOUT = "DO_LOGOUT";
export function logout() {
    emitLogout();
    return function (dispatch) {
        dispatch({
            type: DO_LOGOUT
        });
    };
}

//#############################################
// SERVER API

export function register(user) {
    return axios.post(AppConfig.Api + "/auth/register", { user: user });
}

export function activateAccount(key, user_id) {
    return axios.post(AppConfig.Api + "/auth/activate-account", { key: key, user_id: user_id });
}

export function passwordResetRequest(user_email) {
    return axios.post(AppConfig.Api + "/auth/password-reset-request",
        {
            user_email: user_email
        });
}

export function passwordResetToken(new_password, token, user_id) {
    return axios.post(AppConfig.Api + "/auth/password-reset-token",
        {
            new_password: new_password,
            token: token,
            user_id: user_id
        });
}

export function passwordResetOld(new_password, old_password, user_id) {
    return axios.post(AppConfig.Api + "/auth/password-reset-old",
        {
            new_password: new_password,
            old_password: old_password,
            user_id: user_id
        });
}