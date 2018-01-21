import io from 'socket.io-client';
import { Url, Event } from '../../config/socket-config';
import { getAuthUser, isAuthorized } from '../redux/actions/auth-actions';

console.socket = (m) => {
    console.log("[SOCKET]", m);
}

export const InitSocketOn = () => {
    if (!isAuthorized()) {
        return false;
    }

    var socket = io.connect(Url);
    socket.on(Event.CONNECTION, () => {
        var user = getAuthUser();
        var data = {
            id: user.ID,
            role: user.role,
            company_id: user.rec_company
        };
        socket.emit(Event.ON_JOIN, data);
    });

    socket.on(Event.NOTIFICATION, (data) => {
        console.socket("notification");
        console.socket(data);
        //notificationCenter.showNotification(page_name, data.event, data.data);
    });
}
