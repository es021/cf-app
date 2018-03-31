
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

    // rec only
    REC_COMPANY: "rec_company",
    REC_POSITION: "rec_position"
};

const UserEnum = {
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
    ST_PRE_SCREEN: "Pre Screen" // from prescreen
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
    IMG_POSITION: "img_position",
    TYPE: "type",
    ACCEPT_PRESCREEN: "accept_prescreen"
};

const CompanyEnum = {
    STS_OPEN: "Open",
    STS_CLOSED: "Closed",
    STS_PS: "Prescreen Only",

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

module.exports = {
    User, UserMeta, UserEnum
    , FeedbackQs
    , ForumComment, ForumReply
    , DocLink, DocLinkEnum
    , Session, SessionEnum
    , Vacancy, VacancyEnum
    , Prescreen, PrescreenEnum
    , Company, CompanyEnum
    , Queue, QueueEnum
    , SessionRequest, SessionRequestEnum
    , Dashboard, DashboardEnum
    , Skill, Message
    , SessionNotes
    , SessionRating, SessionRatingEnum
    , ResumeDrop
    , SupportSession
    , PasswordReset
    , Meta, Log, LogEnum
    , Auditorium, AuditoriumEnum
    , ZoomInvite
};