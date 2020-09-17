import React from "react";
import axios from 'axios';
import { graphql } from "../../../helper/api-helper"
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
    CFSMeta
    // CFSMetaOrg
} from '../../../config/db-config';
import {
    Time
} from '../../lib/time';
import {
    emitLogout
} from '../../socket/socket-client';
import {
    errorBlockLoader, customBlockLoader, storeHideBlockLoader, customViewBlockLoader, customViewBlockLoaderSmall
} from './layout-actions.js';
import layoutReducer from "../reducer/layout-reducer.js";
import { getCurrentCfLocalStorage } from "../reducer/auth-reducer";

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

export function getLocalStorageCfJsonObject(key, defaultReturn) {
    let allCf = getLocalStorageCf();
    let toRet = {};

    for (var cfName in allCf) {
        let obj = allCf[cfName][key];
        try {
            obj = JSON.parse(obj);
        } catch (err) {
            obj = defaultReturn;
        }

        if (obj == null || typeof obj === "undefined") {
            obj = defaultReturn;
        }

        toRet[cfName] = obj;
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

// used in auth-reducer
export function getCFDefault() {
    return CF_DEFAULT;
}

// used in form.js to populate all cfs
export function getAllCF() {
    let CareerFair = getLocalStorageCf();
    return CareerFair;
}

export function isCfLocal() {
    let cfObj = getCFObj();
    return cfObj.is_local === 1
}

// return organizers
export function getCFOrg() {
    let allCfObj = getLocalStorageCfJsonObject("organizations", []);
    let toRet = allCfObj[getCF()];
    return toRet;
}

export function getCFCustom(cf) {
    let allCfObj = getLocalStorageCfJsonObject("custom_style", {});
    cf = (typeof cf === "undefined") ? getCF() : cf;
    let toRet = allCfObj[cf];
    return toRet;
}

export function isCfFeatureOff(key) {
    try {
        let cfObj = getCFObj();
        return cfObj[key] == "OFF" || cfObj[key] == "0";
    } catch (err) {

    }
    return false;
}

export function isCfFeatureOn(key) {
    try {
        let cfObj = getCFObj();
        return cfObj[key] == "ON" || cfObj[key] == "1";
    } catch (err) {

    }
    return false;
}


export function loadCompanyPriv(cid, success) {
    var q = `query {company(ID:${cid}) { priviledge } }`;
    graphql(q).then(res => {
        var companyCF = res.data.data.company.cf;
        console.log("companyCF", companyCF)
        console.log("companyCF", companyCF)
        console.log("companyCF", companyCF)
        var privs = res.data.data.company.priviledge;
        if (!privs) {
            privs = "";
        }
        success(privs);
    });
}
// return object cf by key in auth
export function getCFObj() {
    let CareerFair = getLocalStorageCf();
    return CareerFair[getCF()];
}

export function getCfCustomMeta(key, defaultVal) {
    let toRet = "";
    try {
        toRet = getCFObj()[key]
    } catch (err) { }

    if (!toRet) {
        toRet = defaultVal;
    }
    return toRet;
}

export function isRedirectExternalHomeUrl(props) {
    // return false;

    if (!isAuthorized()) {
        console.log("props.location.pathname", props.location.pathname);
        console.log("props.location.pathname", props.location.pathname);
        let path = props.location.pathname
        if (["/auth/", "/auth", "/cf/auth/", "/cf/auth"].indexOf(path) >= 0) {
            let externalHomeUrl = getCF_externalHomeUrl();
            if (externalHomeUrl) {
                return true;
            }
        }
    }
    return false;
}

export function getCF_externalHomeUrl() {
    if (!isAuthorized()) {
        let obj = getCFObj();
        if (obj[CFSMeta.LINK_EXTERNAL_HOME]) {
            return obj[CFSMeta.LINK_EXTERNAL_HOME];
        }
    }

    return null;
}

export function getCF_guideUrl() {
    if (isAuthorized()) {
        let obj = getCFObj();
        if (isRoleRec() && obj[CFSMeta.LINK_GUIDE_REC]) {
            return obj[CFSMeta.LINK_GUIDE_REC];
        }
        if (isRoleStudent() && obj[CFSMeta.LINK_GUIDE_STUDENT]) {
            return obj[CFSMeta.LINK_GUIDE_STUDENT];
        }
    }
    return null;
}

export function getCF_hasGuideUrl() {
    return getCF_guideUrl() ? true : false;
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

    if (cf == null) {
        cf = getCurrentCfLocalStorage();
    }
    return cf;
}

// CF - END
// ############################################


export function isComingSoon() {
    //return false;

    // if (isOverrideComingSoonUser()) {
    //     return false;
    // }


    var isComingSoon = true;
    var cfObj = getCFObj();

    // let override_coming_soon = cfObj.override_coming_soon;
    // console.log("override_coming_soon", override_coming_soon)

    // if (override_coming_soon === "true") {
    //     return false;
    // }


    var timenow = Time.getUnixTimestampNow();

    //check start time
    if (cfObj.start != null) {
        var timestart = Time.convertDBTimeToUnix(cfObj.start);
        if (timenow >= timestart) {
            isComingSoon = false;
        }
    }

    // if (cfObj.test_start != null && cfObj.test_end != null) {
    //     var timetest_start = Time.convertDBTimeToUnix(cfObj.test_start);
    //     var timetest_end = Time.convertDBTimeToUnix(cfObj.test_end);

    //     if (timenow >= timetest_start && timenow <= timetest_end) {
    //         isComingSoon = false;
    //     }
    // }

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

export function getCompanyCf(skipArr = []) {
    let r = [];
    if (isRoleRec()) {
        r = getCompany().cf;
        if (!Array.isArray(r)) {
            r = [];
        }

        for (var i in skipArr) {
            let testIndex = r.indexOf(skipArr[i])
            if (testIndex >= 0) {
                r.splice(testIndex, 1);
            }
        }
    }
    return r;
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

export function isRecruiterCompany(cid) {
    return (
        (isRoleRec() && getAuthUser().rec_company == cid) ||
        isRoleAdmin()
    );
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

// used in login.jsx (this.props.login)
export function login(userDataForLogin) {
    return function (dispatch) {
        dispatch({
            type: DO_LOGIN,
            payload: axios.post(AppConfig.Api + "/auth/login", userDataForLogin)
        });
    };
}

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

export function createRecruiter(rec) {
    return axios.post(AppConfig.Api + "/auth/create-recruiter", {
        rec: rec
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