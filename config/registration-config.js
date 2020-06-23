const {
    User,
    UserMeta
} = require('./db-config.js');

// 1. @custom_user_info_by_cf
const isCustomUserInfoOn = (cf, key) => {
    let valid = [];
    // if (cf == "MDEC") {
    //     valid = ["unemployment_period"]
    // }

    return valid.indexOf(key) >= 0;
}


const Single = {
    first_name: "first_name",
    last_name: "last_name",
    country_study: "country_study",
    university: "university",
    qualification: "qualification",
    graduation_month: "graduation_month",
    graduation_year: "graduation_year",
    working_availability_month: "working_availability_month",
    working_availability_year: "working_availability_year",
    where_in_malaysia: "where_in_malaysia",
    grade: "grade",
    phone_number: "phone_number",
    //sponsor : "sponsor",
    //description : "description",

    // 2a. @custom_user_info_by_cf
    unemployment_period : "unemployment_period"

}

const Multi = {
    field_study: "field_study",
    looking_for_position: "looking_for_position",
    interested_role: "interested_role",
    interested_job_location: "interested_job_location",
    skill: "skill",
    extracurricular: "extracurricular",

    // 2b. @custom_user_info_by_cf
}

const RequiredFieldStudent = [
    UserMeta.FIRST_NAME,
    UserMeta.LAST_NAME,
    User.EMAIL,
    User.PASSWORD,
    //`${User.PASSWORD}-confirm`,
    UserMeta.PHONE_NUMBER,
    UserMeta.MAS_STATE,
    UserMeta.DEGREE_LEVEL,
    UserMeta.STUDY_FIELD,
    UserMeta.MAJOR,
    //UserMeta.MINOR,
    UserMeta.UNIVERSITY,
    UserMeta.STUDY_PLACE,
    //UserMeta.CGPA,
    UserMeta.GRADUATION_MONTH,
    UserMeta.GRADUATION_YEAR,
    UserMeta.LOOKING_FOR,
    UserMeta.AVAILABLE_MONTH,
    UserMeta.AVAILABLE_YEAR,
    //UserMeta.RELOCATE,
    UserMeta.SPONSOR,
    //UserMeta.DESCRIPTION,
];

const RequiredFieldRecruiter = [
    UserMeta.FIRST_NAME,
    UserMeta.LAST_NAME,
    User.EMAIL,
    User.PASSWORD,
    //`${User.PASSWORD}-confirm`,
    //UserMeta.REC_POSITION,
]


module.exports = {
    Single, Multi,
    RequiredFieldStudent,
    RequiredFieldRecruiter,
    isCustomUserInfoOn
};