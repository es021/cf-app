const GroupSession = {
    TABLE: "group_session",
    ID: "ID",
    TITLE: "title",
    COMPANY_ID: "company_id",
    START_TIME: "start_time",
    JOIN_URL: "join_url",
    START_URL: "start_url",
    LIMIT_JOIN: "limit_join",
    IS_EXPIRED: "is_expired",
    IS_CANCELED: "is_canceled",
    CREATED_AT: "created_at",
    CREATED_BY: "created_by",
    UPDATED_AT: "updated_at",
    UPDATED_BY: "updated_by"
};

const GroupSessionJoin = {
    TABLE: "group_session_join",
    ID: "ID",
    GROUP_SESSION_ID: "group_session_id",
    USER_ID: "user_id",
    CREATED_AT: "created_at",
};

const User = {
    TABLE: "wp_cf_users",
    ID: "ID",
    EMAIL: "user_email",
    LOGIN: "user_login",
    PASSWORD: "user_pass",
    ACTIVATION_KEY: "user_activation_key",
    REGISTER_AT: "user_registered",
    TRIGGER_UPDATE: "trigger_update",
    CF: "cf"
};

const Availability = {
    TABLE: "availability",
    ID: "ID",
    USER_ID: "user_id",
    TIMESTAMP: "timestamp",
    COMPANY_ID: "company_id",
    PRESCREEN_ID: "prescreen_id",
    IS_BOOKED: "is_booked"
};

const Meta = {
    TABLE: "_meta",
    ID: "ID",
    KEY: "meta_key",
    VALUE: "meta_value",
    SOURCE: "source",
    CREATED_AT: "created_at"
};

const Auditorium = {
    TABLE: "auditorium",
    ID: "ID",
    CF: "cf",
    COMPANY_ID: "company_id",
    TITLE: "title",
    LINK: "link",
    RECORDED_LINK: "recorded_link",
    TYPE: "type",
    START_TIME: "start_time",
    END_TIME: "end_time",
    MODERATOR: "moderator",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    UPDATED_AT: "updated_at"
};

const AuditoriumEnum = {
    TYPE_WEBINAR: "webinar"
};

const Message = {
    FROM_ID: "from_user_id",
    MESSAGE: "message",
    CREATED_AT: "created_at"
}

const UserMeta = {
    TABLE: "wp_cf_usermeta",
    // all roles usermeta
    FIRST_NAME: "first_name",
    LAST_NAME: "last_name",
    DESCRIPTION: "description",
    ROLE: "wp_cf_capabilities",
    IMG_URL: "reg_profile_image_url",
    IMG_POS: "profile_image_position",
    IMG_SIZE: "profile_image_size",
    FEEDBACK: "feedback",
    USER_STATUS: "user_status",
    IS_ACTIVATED: "is_activated",
    ACTIVATION_KEY: "activation_key",

    // student only
    UNIVERSITY: "university",
    PHONE_NUMBER: "phone_number",
    GRADUATION_MONTH: "graduation_month",
    GRADUATION_YEAR: "graduation_year",
    AVAILABLE_MONTH: "available_month",
    AVAILABLE_YEAR: "available_year",
    SPONSOR: "sponsor",
    CGPA: "cgpa",
    MAJOR: "major",
    MINOR: "minor",
    GENDER: "gender",


    MAS_POSTCODE: "mas_postcode",
    MAS_STATE: "mas_state",
    RELOCATE: "relocate",
    STUDY_PLACE: "study_place",

    LOOKING_FOR: "looking_for",

    // rec only
    REC_COMPANY: "rec_company",
    REC_POSITION: "rec_position"
};

const UserEnum = {
    GENDER_MALE: "Male",
    GENDER_FEMALE: "Female",
    LOOK_FOR_FULL_TIME: "Full-Time",
    LOOK_FOR_INTERN: "Internship",
    ROLE_STUDENT: "student",
    ROLE_RECRUITER: "recruiter",
    ROLE_ADMIN: "administrator",
    ROLE_EDITOR: "editor",
    ROLE_ORGANIZER: "organizer",
    ROLE_SUPPORT: "support",
    STATUS_ACT: "Active",
    STATUS_NOT_ACT: "Not Activated"
};


const DocLink = {
    TABLE: "doc_link",
    ID: "ID",
    USER_ID: "user_id",
    COMPANY_ID: "company_id",
    TYPE: "type",
    LABEL: "label",
    URL: "url",
    DESCRIPTION: "description",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
};

const DocLinkEnum = {
    TYPE_DOC: "document",
    TYPE_LINK: "link",
    LABEL_RESUME: "Resume",
    USER_LABELS: ["Resume", "Linked In", "Portfolio", "Git Hub", "Cover Letter", "Recommendation Letter"],
    COMPANY_LABELS: ["Brochure", "Website"],
    LABEL_STYLE: {
        "Resume": {
            color: "#c62323",
            icon: "file-text"
        },
        "Linked In": {
            color: "#007BB4",
            icon: "linkedin"
        },
        "Git Hub": {
            color: "black",
            icon: "github"
        },
        "Portfolio": {
            color: "#efa30b",
            icon: "folder-open"
        }
    }
};

const PasswordReset = {
    TABLE: "password_reset",
    ID: "ID",
    USER_ID: "user_id",
    TOKEN: "token",
    IS_EXPIRED: "is_expired"
};

const Prescreen = {
    TABLE: "pre_screens",
    STUDENT_ID: "student_id",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    APPNMENT_TIME: "appointment_time",
    SPECIAL_TYPE: "special_type",
    STATUS: "status",
    UPDATED_BY: "updated_by"
};

// Scheduled Interview
const PrescreenEnum = {
    STATUS_PENDING: "Pending",
    STATUS_APPROVED: "Approved",
    STATUS_DONE: "Done",
    ST_NEXT_ROUND: "Next Round", // from session
    ST_INTV_REQUEST: "Session Request",
    ST_PROFILE: "Student Profile",
    ST_RESUME_DROP: "Resume Drop",
    ST_FORUM: "Forum",
    ST_PRE_SCREEN: "Pre Screen", // from prescreen
    ST_NEW: "New" // from prescreen
};


const Queue = {
    TABLE: "in_queues",
    STUDENT_ID: "student_id",
    CREATED_AT: "created_at",
    STATUS: "status"
};

const QueueEnum = {
    STATUS_QUEUING: "Queuing",
    STATUS_CANCELED: "Canceled",
    STATUS_DONE: "Done"
};

const SessionRequest = {
    TABLE: "session_requests",
    STUDENT_ID: "student_id",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    STATUS: "status"
};

const SessionRequestEnum = {
    STATUS_PENDING: "Pending", // Initial
    STATUS_CANCELED: "Canceled", // Canceled by Student
    STATUS_APPROVED: "Approved", // created scheduled interview
    STATUS_REJECTED: "Rejected" // Rejected by Recruiter
};

const Dashboard = {
    TABLE: "dashboard",
    ID: "id",
    CF: "cf",
    TITLE: "title",
    CONTENT: "content",
    TYPE: "type",
    UPDATED_AT: "updated_at",
    CREATED_AT: "created_at",
    CREATED_BY: "created_by"
};

const DashboardEnum = {
    TYPE_STUDENT: "student",
    TYPE_RECRUITER: "recruiter"
};


const Session = {
    TABLE: "sessions",
    ID: "id",
    H_ID: "host_id",
    P_ID: "participant_id",
    CREATED_AT: "created_at",
    STATUS: "status"
};

const SessionEnum = {
    STATUS_EXPIRED: "Expired",
    STATUS_LEFT: "Left",
    STATUS_ACTIVE: "Active"
};

const SessionNotes = {
    TABLE: "session_notes",
    ID: "ID",
    SESSION_ID: "session_id",
    REC_ID: "rec_id",
    STUDENT_ID: "student_id",
    NOTE: "note",
    UPDATED_AT: "updated_at"
};

const SessionRating = {
    TABLE: "session_ratings",
    ID: "ID",
    SESSION_ID: "session_id",
    REC_ID: "rec_id",
    STUDENT_ID: "student_id",
    CATEGORY: "category",
    RATING: "rating"
};

const SessionRatingEnum = {
    categories: ["Thinking & Problem Solving", "Communication Skill", "Leadership Qualities"]
};


const Company = {
    TABLE: "companies",
    ID: "ID",
    CF: "cf",
    NAME: "name",
    REC_PRIVACY: "rec_privacy",
    SPONSOR_ONLY: "sponsor_only",
    STATUS: "status",
    TAGLINE: "tagline",
    DESCRIPTION: "description",
    MORE_INFO: "more_info",
    IMG_URL: "img_url",
    IMG_SIZE: "img_size",
    PRIVILEDGE: "priviledge",
    GROUP_URL: "group_url",
    IMG_POSITION: "img_position",
    TYPE: "type",
    ACCEPT_PRESCREEN: "accept_prescreen"
};

const CompanyEnum = {
    STS_OPEN: "Open",
    STS_CLOSED: "Closed",
    STS_PS: "Prescreen Only",
    STS_RD: "Resume Drop Only",
    STS_GS: "Group Session",

    PRIV: {
        ACCESS_RS_PRE_EVENT: "ACCESS_RS_PRE_EVENT",
        ACCESS_RS_DURING_EVENT: "ACCESS_RS_DURING_EVENT",
        SCHEDULE_PRIVATE_SESSION: "SCHEDULE_PRIVATE_SESSION",
    },
    parsePrivs: (arr) => {
        if (arr == null || typeof arr === "undefined") {
            return [];
        }

        if (!Array.isArray(arr)) {
            try {
                arr = JSON.parse(arr);
                return arr;
            } catch (err) {
                console.error("Error in parsing JSON in CompanyEnum.parseArr()");
                return [];
            }
        }

        return arr;
    },
    hasPriv: (privArrs, priv) => {
        if (!Array.isArray(privArrs)) {
            try {
                privArrs = JSON.parse(privArrs);
            } catch (err) {
                console.error("Error in parsing JSON in CompanyEnum.hasPriv()");
                return false;
            }
        }

        if (privArrs.indexOf(priv) >= 0) {
            return true;
        } else {
            return false;
        }
    },

    TYPE_PLATINUM: -1,
    TYPE_SPECIAL: 0,
    TYPE_GOLD: 1,
    TYPE_SILVER: 2,
    TYPE_BRONZE: 3,
    TYPE_NORMAL: 4,
    REC_PRIVACY_PUBLIC: 0,
    REC_PRIVACY_PRIVATE: 1,
    getTypeStr: (type) => {
        switch (type) {
            case -1:
                return "Platinum Sponsor";
            case 0:
                return "Special";
            case 1:
                return "Gold Sponsor";
            case 2:
                return "Silver Sponsor";
            case 3:
                return "Bronze Sponsor";
            case 4:
                return "Normal";
        }
    }
};


const Vacancy = {
    TABLE: "vacancies",
    ID: "ID",
    COMPANY_ID: "company_id",
    TITLE: "title",
    DESCRIPTION: "description",
    REQUIREMENT: "requirement",
    TYPE: "type",
    APPLICATION_URL: "application_url",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by"
};

const VacancyEnum = {
    TYPE_FULL_TIME: "Full Time",
    TYPE_INTERN: "Intern",
    TYPE_PART_TIME: "Part Time"
};

const Skill = {
    TABLE: "skills",
    ID: "ID",
    USER_ID: "user_id",
    LABEL: "label"
};

const ResumeDrop = {
    TABLE: "resume_drops",
    ID: "ID",
    DOC_LINKS: "doc_links",
    STUDENT_ID: "student_id",
    COMPANY_ID: "company_id",
    MESSAGE: "message"
};

const Log = {
    TABLE: "logs",
    ID: "ID",
    EVENT: "event",
    DATA: "data",
    USER_ID: "user_id",
    CREATED_AT: "created_at"
};

const LogEnum = {
    EVENT_LOGIN: "login", // data-> browser type
    EVENT_OPEN_PAGE: "open_page", // data -> path
    EVENT_CLICK_EVENT_PAGE: "click_event_page", // data null
    EVENT_CLICK_ADS: "click_ads", // data -> ads id from app-config
    EVENT_CLICK_USER_DOC: "click_user_doc", // data -> user_id
    EVENT_VISIT_COMPANY: "visit_company", // data -> company_id
    EVENT_VISIT_VACANCY: "visit_vacancy" // data -> vacancy_id
};

const ZoomInvite = {
    TABLE: "zoom_invites"
};

const ForumComment = {
    TABLE: "forum_comments"
};

const ForumReply = {
    TABLE: "forum_replies"
};

const SupportSession = {
    TABLE: "support_sessions",
    USER_ID: "user_id",
    SUPPORT_ID: "support_id"
};

const FeedbackQs = {
    TABLE: "feedback_qs",
    USER_ROLE: "user_role",
    QUESTION: "question",
    IS_DISABLED: "is_disabled"
};


const QsPopup = {
    TABLE: "qs_popup",
    TYPE: "type",
    FOR_REC: "for_rec",
    FOR_STUDENT: "for_student",
    IS_DISABLED: "is_disabled",
    LABEL: "label",
    ANSWERS: "answers",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
};

const QsPopupEnum = {
    TYPE_SUBJECTIVE: "SUBJECTIVE",
    TYPE_MCQ: "MCQ",
}


const QsPopupAnswer = {
    TABLE: "qs_popup_answer",
    USER_ID: "user_id",
    QS_POPUP_ID: "qs_popup_id",
    ANSWER: "answer"
};

const CFS = {
    TABLE: "cfs",
}

const CFSMeta = {
    TABLE: "cfs_meta",
    TITLE: "title",
    FLAG: "flag",
    BANNER: "banner",
    BANNER_POS: "banner_pos",
    SCHEDULE: "schedule",
    OVERRIDE_COMING_SOON: "override_coming_soon",
    LOGO: "logo",
    LOGO_HEIGHT: "logo_height",
    LOGO_WIDTH: "logo_width",
    LOGO_POSITION: "logo_position",
    LOGO_SIZE: "logo_size",
    START: "start",
    END: "end",
    TIME_STR: "time_str",
    TIME_STR_MAS: "time_str_mas",
    TEST_START: "test_start",
    TEST_END: "test_end",
    PAGE_URL: "page_url",
    PAGE_BANNER: "page_banner",
    CAN_REGISTER: "can_register",
    CAN_LOGIN: "can_login",

    // for CareerFairOrg
    ORGANIZER: "Organizer",
    COLLABORATOR: "Collaborator",
    POWERED: "Powered"
}

const CFSMetaObject = [
    CFSMeta.SCHEDULE, CFSMeta.ORGANIZER, CFSMeta.COLLABORATOR, CFSMeta.POWERED
];

const CFSMetaOrg = [CFSMeta.ORGANIZER, CFSMeta.COLLABORATOR, CFSMeta.POWERED];

module.exports = {
    QsPopup,
    QsPopupEnum,
    QsPopupAnswer,
    User,
    UserMeta,
    UserEnum,
    FeedbackQs,
    ForumComment,
    ForumReply,
    DocLink,
    DocLinkEnum,
    Session,
    SessionEnum,
    Vacancy,
    VacancyEnum,
    Prescreen,
    PrescreenEnum,
    Company,
    CompanyEnum,
    Queue,
    QueueEnum,
    SessionRequest,
    SessionRequestEnum,
    Dashboard,
    DashboardEnum,
    Skill,
    Message,
    SessionNotes,
    SessionRating,
    SessionRatingEnum,
    ResumeDrop,
    SupportSession,
    PasswordReset,
    Meta,
    Log,
    LogEnum,
    Auditorium,
    AuditoriumEnum,
    ZoomInvite,
    Availability,
    GroupSession,
    GroupSessionJoin,
    CFS,
    CFSMeta,
    CFSMetaObject,
    CFSMetaOrg
};