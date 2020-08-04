const {
    User,
    UserMeta
} = require('./db-config.js');


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

    // 1a. @custom_user_info_by_cf - single
    unemployment_period: "unemployment_period",
    monash_student_id: "monash_student_id",
    monash_school: "monash_school",
    sunway_faculty: "sunway_faculty"
}

const Multi = {
    field_study: "field_study",
    looking_for_position: "looking_for_position",
    interested_role: "interested_role",
    interested_job_location: "interested_job_location",
    skill: "skill",
    extracurricular: "extracurricular",

    // 1b. @custom_user_info_by_cf - multi
}

// 1c. @custom_user_info_by_cf - on or off by cf
const isCustomUserInfoOff = (cf, key) => {

    let offCf = null;
    let onCf = null;

    switch (key) {
        // ###############
        // by default is OFF
        case Single.unemployment_period:
            onCf = ["NAME_CF_HERE"];
            break;
        case Single.monash_school:
            onCf = ["MONASH"];
            break;
        case Single.sunway_faculty:
            onCf = ["SUNWAY"];
            break;
        case Single.monash_student_id:
            onCf = ["MONASH"];
            break;

        // ###############
        // by default is ON
        case Single.country_study:
            offCf = ["MONASH", "SUNWAY"];
            break;
        case Multi.field_study:
            offCf = ["MONASH", "SUNWAY"];
            break;
        case Single.where_in_malaysia:
            offCf = ["MONASH", "SUNWAY"];
            break;
        case Multi.extracurricular:
            offCf = ["MONASH", "SUNWAY"];
            break;
    }

    if (offCf) {
        return offCf.indexOf(cf) >= 0;
    }
    if (onCf) {
        return onCf.indexOf(cf) <= -1;
    }

    return false;
}

// @kpt_validation - SET_CF_HERE
const isDoJpaKptValidation = (cf) => {
    // let valid = ["JPN", "TEST"];
    let valid = ["JPN"];
    return valid.indexOf(cf) >= 0;
}


const RequiredFieldStudent = [
    UserMeta.FIRST_NAME,
    UserMeta.LAST_NAME,
    User.EMAIL,
    User.PASSWORD,

    // @kpt_validation
    UserMeta.KPT,


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
    isDoJpaKptValidation,
    Single, Multi,
    RequiredFieldStudent,
    RequiredFieldRecruiter,
    isCustomUserInfoOff
};