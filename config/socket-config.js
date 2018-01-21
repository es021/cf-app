const isProd = (process.env.NODE_ENV === "production");
const Port = 5000;
const Url = (isProd) ? `https://seedsjobfair.com/socket` : `http://localhost:${Port}`;

const Event = {
    CONNECTION: "connection",
    ON_SEND_MESSAGE: "send_message",
    ON_JOIN: "join",
    ON_DISCONNECT: "disconnect",
    ON_OPEN_CHAT: "open_chat",
    SESSION_END: "session_end",

    DASHBOARD_NEWSFEED: "dashboard_newsfeed",

    NOTIFICATION: "notification",

    //trigger by start Queue and cancel Queue
    ON_IN_QUEUE: "in_queue_trigger",
    EMIT_IN_QUEUE: "in_queue_emit",

    // on-> expected data {other_id, entity},
    // emit-> to other id {entity},
    // the trigger to client when to query.
    CF_TRIGGER: "cf_trigger",

    EMIT_RECEIVED_MESSAGE: "receive_message",
    EMIT_OTHER_OFFLINE: "other_offline",
    EMIT_OTHER_ONLINE: "other_online",

    EMIT_ALL_ONLINE_USER: "all_online_user",
    EMIT_ALL_ONLINE_COMPANY: "all_online_company",

    //for rec view (home)
    // on-> expected data {student_id:status,....}
    // emit-> diff in same format.. if nothing changed, return empty object {}
    CF_STUDENT_STATUS: "cf_student_status",
    STATUS_ONLINE: 1,
    STATUS_OFFLINE: 0,

    //for admin
    LIVE_MONITOR: "live_monitor",
    HARD_RESET: "hard_reset",

    // data
    PAGE_SESSION: "session",
    PAGE_HOME: "home",

    ROLE_STUDENT: "student",
    ROLE_REC: "recruiter",

    TB_IN_QUEUE: "in_queues",
    TB_PRE_SCREEN: "pre_screens",
    TB_SESSION: "sesssions",
}

module.exports = { Event, Port, Url };