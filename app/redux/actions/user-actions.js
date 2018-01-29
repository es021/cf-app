import { socketOn } from "../../socket/socket-client";
import { S2C } from "../../../config/socket-config";
import { store } from '../store.js';

export const SET_ONLINE_USERS = "SET_ONLINE_USERS";

export function setOnlineUsers(data) {
    store.dispatch({
        type: SET_ONLINE_USERS,
        payload: data
    });
};



