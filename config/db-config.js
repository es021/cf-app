
const User = {
    EMAIL: "user_email",
    LOGIN: "user_login",
    PASSWORD: "user_pass",
    ACTIVATION_KEY: "user_activation_key",
    REGISTER_AT: "user_registered"
};

const UserMeta = {
    // all roles usermeta
    FIRST_NAME: "first_name",
    LAST_NAME: "last_name",
    DESCRIPTION: "description",
    ROLE: "wp_cf_capabilities",
    IMG_URL: "reg_profile_image_url",
    IMG_POS: "profile_image_position",
    IMG_SIZE: "profile_image_size",
    FEEDBACK: "feedback",
    IS_ACTIVATED: "is_activated",

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
    ROLE_ADMIN: "administrator"
};

module.exports = {User, UserMeta, UserEnum};