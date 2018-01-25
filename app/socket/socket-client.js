import io from 'socket.io-client';
import { Url, BOTH, S2C, C2S } from '../../config/socket-config';
import { getAuthUser, isAuthorized } from '../redux/actions/auth-actions';

console.socket = (event, m) => {
    console.log(`[${event}]`, m);
}

export const socket = io.connect(Url);

export const socketOn = (event, handler) => {
    if (!socket) {
        return;
    }
    socket.on(event, (data) => {
        console.socket("ON EVENT", event);
        console.socket("ON DATA", data);
        handler(data);
    });
};

export const socketEmit = (event, data) => {
    if (!socket) {
        return;
    }
    console.socket("EMIT EVENT", event);
    console.socket("EMIT DATA", data);
    socket.emit(event, data);
};

export const initSocket = (page) => {
    if (!isAuthorized()) {
        return false;
    }

    socketOn(BOTH.CONNECTION, () => {
        var user = getAuthUser();
        var data = {
            id: user.ID,
            role: user.role,
            company_id: user.rec_company
        };
        
        socketEmit(C2S.JOIN, data);
    });
};
