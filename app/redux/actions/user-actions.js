import {
    socketOn
} from "../../socket/socket-client";
import {
    S2C
} from "../../../config/socket-config";
import {
    store
} from '../store.js';
import {
    isRoleRec,
    getAuthUser
} from "./auth-actions";

export const SET_ONLINE_USERS = "SET_ONLINE_USERS";
export const SET_ONLINE_COMPANIES = "SET_ONLINE_COMPANIES";


export function setOnlineUsers(data) {
    store.dispatch({
        type: SET_ONLINE_USERS,
        payload: data
    });
};

export function setOnlineCompanies(data) {
    store.dispatch({
        type: SET_ONLINE_COMPANIES,
        payload: data
    });
};

export function isUserOnline(store_online_users, userId) {
    return store_online_users[userId] == 1
}

export function isCompanyOnline(store_online_companies, companyId) {
    // check if you are rec of the company
    try {
        if (isRoleRec() && getAuthUser().rec_company == companyId) {
            return true;
        }
    } catch (err) {}

    try {
        let online_companies = store_online_companies;
        let cObj = online_companies[companyId];
        for (var i in cObj) {
            if (cObj[i] == "Online") {
                return true;
            }
        }
        return false;
    } catch (err) {
        return false;
    }
}