import { getNewState } from './_helper';
import { CareerFairEnum } from '../../../config/db-config';
import * as authActions from '../actions/auth-actions';
import { _GET } from '../../lib/util';

var getCF = _GET("cf");

const authReducerInitState = {
    cf: null,
    user: null,
    isAuthorized: false,
    fetching: false,
    error: null
};

var auth = null;
var hasLocalStorageSupport;

try {
    window.localStorage.setItem("testKey", 'foo');
    window.localStorage.removeItem("testKey");
    hasLocalStorageSupport = true;
} catch (e) {
    console.log(e);
    hasLocalStorageSupport = false;
}

const AUTH_LOCAL_STORAGE = "auth";

function setAuthLocalStorage(newItem) {
    if (!hasLocalStorageSupport) {
        return;
    }
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
    if (!hasLocalStorageSupport) {
        return;
    }
    
    if (typeof auth["user"] === "undefined" || typeof auth["isAuthorized"] === "undefined") {
        return fixCFAuth(authReducerInitState);
    }

    auth = fixCFAuth(auth);

    // clear all possible error
    auth["error"] = null;
    auth["fetching"] = false;

    return auth;
}

// the cf param will force to the cf
// use in logout
function fixCFAuth(auth, cf = null) {
    if (cf !== null) {
        auth["cf"] = cf;
        return auth;
    }

    // if get is changing and is not authorized
    if ((!auth.isAuthorized || typeof auth["isAuthorized"] === "undefined")) {
        if (getCF !== null) {
            auth["cf"] = getCF;
        }
    }

    if (auth["cf"] == null) {
        auth["cf"] = CareerFairEnum.USA;
    }

    return auth;
}

if (hasLocalStorageSupport) {
    auth = window.localStorage.getItem(AUTH_LOCAL_STORAGE);
    if (auth !== null) {
        auth = JSON.parse(auth);
        auth = fixLocalStorageAuth(auth);
    } else {
        auth = authReducerInitState;
        setAuthLocalStorage(authReducerInitState);
    }
    auth = fixCFAuth(auth);
    setAuthLocalStorage(auth);
}
// need to find a fallback for safari
else {
    //    auth = {
    //
    //        user: {
    //            ID: 136,
    //            user_status: "Active",
    //            first_name: "Student",
    //            last_name: "For Test",
    //            img_url: "http://seedsjobfair.com/wp-content/uploads/2017/07/user_136_profile_image.jpeg",
    //            img_pos: "18% 29%",
    //            img_size: "195% auto"
    //        },
    //
    //        isAuthorized: true,
    //        fetching: false,
    //        error: null
    //    };

    auth = authReducerInitState;
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
                if (hasLocalStorageSupport) {
                    window.localStorage.removeItem(AUTH_LOCAL_STORAGE);
                }
                return getNewState(state, fixCFAuth(authReducerInitState, state.cf));
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

                var user = action.payload.data;
                var newState = {
                    cf: user.cf,
                    fetching: false,
                    isAuthorized: true,
                    user: user,
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