
const User = {
    TABLE: "wp_cf_users",
    ID: "ID",
    EMAIL: "user_email",
    LOGIN: "user_login",
    PASSWORD: "user_pass",
    ACTIVATION_KEY: "user_activation_key",
    REGISTER_AT: "user_registered",
    CF: "cf"
};

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
    ROLE_ORGANIZER: "organizer",
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
    TYPE_LINK: "link"
};


const Prescreen = {
    TABLE: "pre_screens",
    STUDENT_ID: "student_id",
    CREATED_AT: "created_at",
    STATUS: "status"
};

const PrescreenEnum = {
    STATUS_PENDING: "Pending",
    STATUS_APPROVED: "Approved",
    STATUS_DONE: "Done"
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

const Company = {
    TABLE: "companies",
    ID: "ID",
    CF: "cf",
    NAME: "name",
    REC_PRIVACY: "rec_privacy",
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
    TYPE_SPECIAL: 0,
    TYPE_GOLD: 1,
    TYPE_SILVER: 2,
    TYPE_BRONZE: 3,
    TYPE_NORMAL: 4,
    REC_PRIVACY_PUBLIC: 0,
    REC_PRIVACY_PRIVATE: 1,
    getTypeStr: (type) => {
        switch (type) {
            case 0: return "Special";
            case 1: return "Gold Sponsor";
            case 2: return "Silver Sponsor";
            case 3: return "Bronze Sponsor";
            case 4: return "Normal";
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

// dont forget to update in data-config
const CareerFairEnum = {
    USA: "USA",
    JAPAN: "JAPAN",
    INDONESIA: "INDONESIA",
    GERMANY: "GERMANY",
    FRANCE: "FRANCE"
}

module.exports = {
    User, UserMeta, UserEnum
    , DocLink, DocLinkEnum
    , Session, SessionEnum
    , Vacancy, VacancyEnum
    , Prescreen, PrescreenEnum
    , Company, CompanyEnum
    , Queue, QueueEnum
    , Skill
    , ResumeDrop
    , CareerFairEnum
};