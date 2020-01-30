import React from "react";
import axios from 'axios';
import {
    store
} from '../store.js';
import {
    AppConfig,
    TestUser,
    OverrideComingSoonUser
} from '../../../config/app-config';
import {
    AuthUserKey
} from '../../../config/auth-config';
import {
    User,
    UserEnum,
    // CFSMetaOrg
} from '../../../config/db-config';
import {
    Time
} from '../../lib/time';

// import {
//     CareerFair,
//     CareerFairOrg,
//     CF_DEFAULT
// } from '../../../config/cf-config';


// ############################################
// CF - START
//const CF_DEFAULT = "UK";
const CF_DEFAULT = "MDEC";

const LOCAL_STORAGE_CF = "cf-seeds-job-fair";
export function setLocalStorageCf(cfArr) {
    let cfObj = {};
    for (var i in cfArr) {
        let cf = cfArr[i];
        cfObj[cf.name] = cf;
    }

    let objStr = JSON.stringify(cfObj);
    localStorage.setItem(LOCAL_STORAGE_CF, objStr);
}


export function getLocalStorageCf() {
    let cf = localStorage.getItem(LOCAL_STORAGE_CF);
    let cfObj = {};
    try {
        cfObj = JSON.parse(cf);
    } catch (err) {
        cfObj = {};
    }
    if (cfObj == null) {
        //location.reload();
    }
    return cfObj;
}



export function getLocalStorageCfOrg() {
    let allCf = getLocalStorageCf();
    let toRet = {};

    for (var cfName in allCf) {
        let org = allCf[cfName]["organizations"];
        try {
            org = JSON.parse(org);
        } catch (err) {
            org = [];
        }

        if (!Array.isArray(org)) {
            org = [];
        }

        toRet[cfName] = org;
        // for (var i in CFSMetaOrg) {
        //     let attr = [CFSMetaOrg[i]]
        //     toRet[cfName][attr] = allCf[cfName][attr];
        //     if(toRet[cfName][attr] == null){
        //         toRet[cfName][attr] = [];
        //     }
        // }
    }
    return toRet;
}


export function getCfTitle(cf) {
    try {
        let allCf = getLocalStorageCf();
        let cfObj = allCf[cf];
        return cfObj.title;
    } catch (err) {
        return null;
    }
}

// export function getLocalStorageCfOrg() {
//     let allCf = getLocalStorageCf();
//     let toRet = {};

//     for (var cfName in allCf) {
//         toRet[cfName] = {};
//         for (var i in CFSMetaOrg) {
//             let attr = [CFSMetaOrg[i]]
//             toRet[cfName][attr] = allCf[cfName][attr];
//             if(toRet[cfName][attr] == null){
//                 toRet[cfName][attr] = [];
//             }
//         }
//     }
//     return toRet;
// }

// used in auth-reducer
export function getCFDefault() {
    return CF_DEFAULT;
}

// used in form.js to populate all cfs
export function getAllCF() {
    let CareerFair = getLocalStorageCf();
    return CareerFair;
}

// return organizers
export function getCFOrg() {
    let CareerFairOrg = getLocalStorageCfOrg();
    let toRet = CareerFairOrg[getCF()];
    return toRet;
}

// return object cf by key in auth
export function getCFObj() {
    let CareerFair = getLocalStorageCf();
    return CareerFair[getCF()];
}

// return key of cf
const ToReplaceCf = {
    "USA": "USA19"
}
export function getCF() {
    let cf = store.getState().auth.cf;
    if (typeof ToReplaceCf[cf] !== "undefined") {
        cf = ToReplaceCf[cf];
    }
    console.log("Current CF -> ", cf);
    return cf;
}

// CF - END
// ############################################


export function isComingSoon() {
    //return false;

    if (isOverrideComingSoonUser()) {
        return false;
    }


    var isComingSoon = true;
    var cfObj = getCFObj();

    let override_coming_soon = cfObj.override_coming_soon;
    console.log("override_coming_soon", override_coming_soon)

    if (override_coming_soon === "true") {
        return false;
    }


    var timenow = Time.getUnixTimestampNow();

    //check start time
    if (cfObj.start != null) {
        var timestart = Time.convertDBTimeToUnix(cfObj.start);
        if (timenow >= timestart) {
            isComingSoon = false;
        }
    }

    if (cfObj.test_start != null && cfObj.test_end != null) {
        var timetest_start = Time.convertDBTimeToUnix(cfObj.test_start);
        var timetest_end = Time.convertDBTimeToUnix(cfObj.test_end);

        if (timenow >= timetest_start && timenow <= timetest_end) {
            isComingSoon = false;
        }
    }

    console.log("isComingSoon", isComingSoon)

    return isComingSoon;
}

export function gotItButton() {
    return <button className="btn btn-sm btn-primary" onClick={
        () => { storeHideBlockLoader() }
    }>Got It</button>;
}

export function doAfterValidateComingSoon(actionHandler, subText = null) {
    if (isComingSoon()) {
        var cfObj = getCFObj();

        let mes = <div>
            <h4 className="text-primary"><b>Come Back Later</b></h4>
            This action only allowed after the event started on
            <br></br>
            <u>{Time.getString(cfObj.start)}</u>
            <br></br>
            {subText == null
                ? null
                : <span><br></br>{subText}<br></br></span>}
            <br></br>
            {gotItButton()}
        </div>;
        // customBlockLoader(mes, null, null, null, true)
        customViewBlockLoaderSmall("", mes, true)
    } else {
        actionHandler();
    }
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

export function isRoleVolunteer() {
    return getAuthUser().role === UserEnum.ROLE_VOLUNTEER;
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
    return getAuthUser().role === UserEnum.ROLE_EDITOR ||
        getAuthUser().role === UserEnum.ROLE_ADMIN ||
        getAuthUser().role === UserEnum.ROLE_SUPPORT;
}

export function isTestUser() {
    return TestUser.indexOf(getAuthUser().ID) >= 0;
}

export function isOverrideComingSoonUser() {
    return OverrideComingSoonUser.indexOf(getAuthUser().ID) >= 0;
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
            payload: axios.post(AppConfig.Api + "/auth/login", {
                email: email,
                password: password,
                cf: cf
            })
        });
    };
}

import {
    emitLogout
} from '../../socket/socket-client';
import {
    errorBlockLoader, customBlockLoader, storeHideBlockLoader, customViewBlockLoader, customViewBlockLoaderSmall
} from './layout-actions.js';
import layoutReducer from "../reducer/layout-reducer.js";

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
    return axios.post(AppConfig.Api + "/auth/register", {
        user: user
    });
}

export function activateAccount(key, user_id) {
    return axios.post(AppConfig.Api + "/auth/activate-account", {
        key: key,
        user_id: user_id
    });
}

export function passwordResetRequest(user_email) {
    return axios.post(AppConfig.Api + "/auth/password-reset-request", {
        user_email: user_email
    });
}

export function passwordResetToken(new_password, token, user_id) {
    return axios.post(AppConfig.Api + "/auth/password-reset-token", {
        new_password: new_password,
        token: token,
        user_id: user_id
    });
}

export function passwordResetOld(new_password, old_password, user_id) {
    return axios.post(AppConfig.Api + "/auth/password-reset-old", {
        new_password: new_password,
        old_password: old_password,
        user_id: user_id
    });
}