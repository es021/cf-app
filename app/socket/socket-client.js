import io from 'socket.io-client';
import { Url, BOTH, S2C, C2S } from '../../config/socket-config';
import { RootPath } from '../../config/app-config';
import { getAuthUser, isAuthorized, isRoleRec } from '../redux/actions/auth-actions';
import { setOnlineUsers } from '../redux/actions/user-actions';
import { customBlockLoader, getCurrentPath } from '../redux/actions/layout-actions';

console.socket = (event, m) => {
    console.log(`SOCKET - [${event}]`, m);
}

// Establishing socket connection
var socket = null;


//#####################################################################################
// init functions

export const initSocket = (page) => {
    try {
        console.socket("TRY CONNECT", Url);
        socket = io.connect(Url);
    } catch (err) {
        socket = false;
        console.socket("ERROR CONNECT", err);
    }

    if (!isAuthorized()) {
        return false;
    }

    initOn();

};

function initOn() {
    // inital ons
    socketOn(BOTH.CONNECTION, () => {
        var user = getAuthUser();
        var data = {
            id: user.ID,
            role: user.role,
            company_id: user.rec_company
        };

        socketEmit(C2S.JOIN, data);
    });

    socketOn(S2C.ONLINE_USER, (data) => {
        setOnlineUsers(data);
    });

    socketOn(BOTH.CHAT_OPEN_CLOSE, (data) => {
        var isSessionPage = location.pathname.indexOf(`session/${data.session_id}`) >= 0;
        var actionText = null;
        var actionHandler = null;
        var href = null;
        var title = null;

        if (data.action == "open") {
            title = `${data.from_name} has joined the session`;

            if (isSessionPage) {
                actionText = "Got It!";
            } else {
                href = `${RootPath}/app/session/${data.session_id}`;
                actionText = "Go To Session";
            }
        }

        if (data.action == "close") {
            title = `${data.from_name} has ${(isRoleRec()) ? 'left' : 'ended'} the session`;

            if (isSessionPage) {
                href = `${RootPath}/app/career-fair`;
                actionText = (isRoleRec())
                    ? "Start Session With Other Student"
                    : "Start Queue With Other Company"

            } else {
                actionText = "Got It!";
            }
        }

        if (title != null) {
            customBlockLoader(title, actionText, actionHandler, href);
        }
    });


}

//#####################################################################################
// general helper

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

//#####################################################################################
// emit helper

export const emitQueueStatus = (company_id, student_id, action) => {
    socketEmit(BOTH.QUEUE_STATUS, {
        company_id: company_id,
        student_id: student_id,
        action: action
    });
}

export const emitChatOpenClose = (action, from_name, to_id, session_id) => {
    socketEmit(BOTH.CHAT_OPEN_CLOSE, {
        action: action,
        from_name: from_name,
        to_id: to_id,
        session_id: session_id
    });
}
