import { getNewState } from "./_helper";
import * as authActions from "../actions/auth-actions";
import { _GET } from "../../lib/util";

// const CF_DEFAULT = authActions.getCFDefault();
// const IS_HAS_PARAM_CF = location.href.indexOf("?cf=") >= 0;

const AUTH_LOCAL_STORAGE = "auth";
const CURRENT_CF_LOCAL_STORAGE = "current-cf";
var getCF = _GET("cf");

const authReducerInitState = {
  cf: null,
  user: null,
  isAuthorized: false,
  fetching: false,
  error: null,
  cookie: true
};

var auth = null;
var hasLocalStorageSupport;

try {
  window.localStorage.setItem("testKey", "foo");
  window.localStorage.removeItem("testKey");
  hasLocalStorageSupport = true;
} catch (e) {
  console.log(e);
  hasLocalStorageSupport = false;
}

export function setCurrentCfLocalStorage(cf) {
  if (cf == "" || cf == null || typeof cf === "undefined") {
    return;
  }
  if (!hasLocalStorageSupport) {
    return;
  }
  window.localStorage.setItem(CURRENT_CF_LOCAL_STORAGE, cf);
}

export function getCurrentCfLocalStorage() {
  if (!hasLocalStorageSupport) {
    return null;
  }
  let cf = window.localStorage.getItem(CURRENT_CF_LOCAL_STORAGE);
  if (cf == "" || cf == null || typeof cf === "undefined") {
    return null;
  }

  return cf;
}

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

function clearAuthLocalStorage() {
  if (hasLocalStorageSupport) {
    window.localStorage.removeItem(AUTH_LOCAL_STORAGE);
  }
}

function fixLocalStorageAuth(auth) {
  if (!hasLocalStorageSupport) {
    return;
  }

  if (
    typeof auth["user"] === "undefined" ||
    typeof auth["isAuthorized"] === "undefined"
  ) {
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
  if (!auth.isAuthorized || typeof auth["isAuthorized"] === "undefined") {
    if (getCF !== null) {
      auth["cf"] = getCF;
    }
  }


  if (location.href.indexOf("qr-check-in") >= 0) {
    if (auth["cf"] == null) {
      auth["cf"] = "TEST";
    }
  }


  // if still null get default
  // if (auth["cf"] == null) {
  //   auth["cf"] = CF_DEFAULT;
  // }

  // fix untuk amik yang default kalau takde param cf kat url
  // if (!IS_HAS_PARAM_CF) {
  //   auth["cf"] = CF_DEFAULT;
  // }
  return auth;
}

function autoLogoutIfCFChange(curAuth) {
  if (getCF !== null && getCF != curAuth.cf) {
    curAuth.isAuthorized = false;
    curAuth.cf = getCF;
  }
  return curAuth;
}

if (hasLocalStorageSupport) {
  auth = window.localStorage.getItem(AUTH_LOCAL_STORAGE);

  if (auth !== null) {
    auth = JSON.parse(auth);
    auth = getNewState(auth, {
      cookie: true
    });
    auth = fixLocalStorageAuth(auth);
  } else {
    auth = authReducerInitState;
    setAuthLocalStorage(authReducerInitState);
  }

  auth = fixCFAuth(auth);
  auth = autoLogoutIfCFChange(auth);
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
  //            img_url: "http://seedsjobfairapp.com/wp-content/uploads/2017/07/user_136_profile_image.jpeg",
  //            img_pos: "18% 29%",
  //            img_size: "195% auto"
  //        },
  //
  //        isAuthorized: true,
  //        fetching: false,
  //        error: null
  //    };

  auth = getNewState(authReducerInitState, {
    cookie: false
  });
  auth = fixCFAuth(auth);
}

export default function authReducer(state = auth, action) {
  switch (action.type) {
    case authActions.UPDATE_USER: {
      var newUser = getNewState(state.user, action.payload);
      var newState = {
        user: newUser
      };

      setAuthLocalStorage(newState);
      return getNewState(state, newState);
    }
    case authActions.DO_LOGOUT: {
      clearAuthLocalStorage();
      // setAuthLocalStorage({cf : state.cf, user: {}, isAuthorized : false});
      let toRet = getNewState(state, fixCFAuth(authReducerInitState, state.cf));
      return toRet;
    }
    case authActions.DO_LOGIN + "_PENDING": {
      var newState = {
        fetching: true,
        error: null
      };

      setAuthLocalStorage(newState);
      return getNewState(state, newState);
    }
    case authActions.DO_LOGIN + "_FULFILLED": {
      var user = action.payload.data;
      var newState = {
        cf: user.cf,
        fetching: false,
        isAuthorized: state.cookie ? true : false,
        user: user,
        error: null
      };

      setAuthLocalStorage(newState);
      return getNewState(state, newState);
    }
    case authActions.DO_LOGIN + "_REJECTED": {
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
}
