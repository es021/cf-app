const {
    User,
    UserMeta
} = require('./db-config.js');

const RequiredFieldStudent = [
    UserMeta.FIRST_NAME,
    UserMeta.LAST_NAME,
    User.EMAIL,
    User.PASSWORD,
    //`${User.PASSWORD}-confirm`,
    UserMeta.PHONE_NUMBER,
    UserMeta.MAS_STATE,
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
    RequiredFieldStudent,
    RequiredFieldRecruiter
};