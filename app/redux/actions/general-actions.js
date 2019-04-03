// import { socketOn } from "../../socket/socket-client";
// import { S2C } from "../../../config/socket-config";
import {
    store
} from '../store.js';

export const SET_GENERAL_ATTR = "SET_GENERAL_ATTR";

//export const ATTR_LAST_UPDATE_NOTIFICATION = "ATTR_LAST_UPDATE_NOTIFICATION";

export function setGeneralAttr(attr, data) {
    store.dispatch({
        type: SET_GENERAL_ATTR,
        payload: {
            attr: attr,
            data: data
        }
    });
};
