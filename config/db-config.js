
const User = {
    TABLE: "wp_cf_users",
    ID: "ID",
    EMAIL: "user_email",
    LOGIN: "user_login",
    PASSWORD: "user_pass",
    ACTIVATION_KEY: "user_activation_key",
    REGISTER_AT: "user_registered"
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
    STATUS: "user_status",
    IS_ACTIVATED: "is_activated",
    ACTIVATION_KEY: "activation_key",

    // student only
    UNIVERSITY: "university",
    PHONE_NUMBER: "phone_number",
    GRAD_MONTH: "graduation_month",
    GRAD_YEAR: "graduation_year",
    SPONSOR: "sponsor",
    CGPA: "cgpa",
    MAJOR: "major",
    MINOR: "minor",

    // rec only
    COMPANY_ID: "rec_company"
};

const UserEnum = {
    ROLE_STUDENT: "student",
    ROLE_RECRUITER: "recruiter",
    ROLE_ADMIN: "administrator",
    STATUS_ACT: "Active",
    STATUS_NOT_ACT: "Not Activated"
};

module.exports = {User, UserMeta, UserEnum};