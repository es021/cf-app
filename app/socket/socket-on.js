import io from 'socket.io-client';
import { Url, BOTH, S2C, C2S } from '../../config/socket-config';
import { getAuthUser, isAuthorized } from '../redux/actions/auth-actions';

console.socket = (m) => {
    console.log("[SOCKET]", m);
}

export const socket = io.connect(Url);
initSocket("page test");

export const socketOn = (event, handler) => {
    if (!socket) {
        return;
    }
    socket.on(event, (data) => {
        console.socket(`On ${event}`);
        console.socket(data);
        handler(data);
    });
};

export const socketEmit = (event, data) => {
    if (!socket) {
        return;
    }
    console.socket(`Emit ${event}`);
    console.socket(data);
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
            company_id: user.rec_company,
            page: page // TODO get page
        };
        socketEmit(C2S.JOIN, data);
    });
};