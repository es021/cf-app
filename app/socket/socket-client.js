import io from 'socket.io-client';
import { Url, BOTH, S2C, C2S } from '../../config/socket-config';
import { RootPath } from '../../config/app-config';
import { getAuthUser, getCF, isAuthorized, isRoleRec } from '../redux/actions/auth-actions';
import { setOnlineUsers } from '../redux/actions/user-actions';
import { customBlockLoader, getCurrentPath } from '../redux/actions/layout-actions';
import { storeLoadActivity } from '../redux/actions/hall-actions';

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
        console.socket("SUCCESS",socket);
    } catch (err) {
        socket = false;
        console.socket("ERROR CONNECT", err);
    }

    if (!isAuthorized()) {
        return false;
    }

    initOn();

};

export function isSocketOkay() {
    if (socket === false) {
        return false;
    } else {
        return socket.connected;
    }
}

function initOn() {
    var user = getAuthUser();
    socketOn("okay", () => {
        console.log("okay connected///");
        var joinData = {
            id: user.ID,
            role: user.role,
            company_id: user.rec_company,
            cf: getCF(),
        };

        socketEmit(C2S.JOIN, joinData);
    });
    // inital ons
    socketOn(BOTH.CONNECTION, () => {
        console.log("connected///");
        var joinData = {
            id: user.ID,
            role: user.role,
            company_id: user.rec_company,
            cf: getCF(),
        };

        socketEmit(C2S.JOIN, joinData);
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

                // if career fair page, need to reload all activity
                var isCFPage = location.pathname.indexOf(`career-fair`) >= 0;
                if (isCFPage) {
                    storeLoadActivity();
                }
            }
        }

        if (title != null) {
            customBlockLoader(title, actionText, actionHandler, href);
        }
    });

    socketOn(BOTH.HALL_ACTIVITY, (data) => {
        storeLoadActivity(data.entity);
    });

}

//#####################################################################################
// general helper

export const socketOn = (event, handler) => {
    if (!socket) {
        console.log("failed socket");
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

export const emitState = (params = null) => {
    socketEmit(BOTH.STATE, {
        params: params
    });
}

export const emitQueueStatus = (company_id, student_id, action) => {
    socketEmit(BOTH.QUEUE_STATUS, {
        company_id: company_id,
        student_id: student_id,
        action: action
    });
}

export const emitChatOpenClose = (action, from_name, to_id, session_id) => {

    if (action == "close") {
        var href = `${RootPath}/app/career-fair`;
        var actionText = (isRoleRec())
            ? "Start Session With Other Student"
            : "Start Queue With Other Company"
        customBlockLoader("Session has ended", actionText, null, href);
    }

    socketEmit(BOTH.CHAT_OPEN_CLOSE, {
        action: action,
        from_name: from_name,
        to_id: to_id,
        session_id: session_id
    });
}

export const emitHallActivity = (entity, to_id, to_company) => {
    socketEmit(BOTH.HALL_ACTIVITY, {
        entity: entity,
        to_id: to_id,
        to_company: to_company
    });
};

export const emitChatMessage = (from_id, to_id, message, created_at) => {
    socketEmit(BOTH.CHAT_MESSAGE, {
        from_id: from_id,
        to_id: to_id,
        message: message,
        created_at: created_at
    });
};

export const emitLiveFeed = (title, content, type, cf, created_at) => {
    socketEmit(BOTH.LIVE_FEED, {
        title: title,
        content: content,
        type: type,
        cf: cf,
        created_at: created_at
    });
};

export const emitLogout = () => {
    socketEmit(C2S.LOGOUT, { id: getAuthUser().ID });
};