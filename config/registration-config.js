const {
    User,
    UserMeta
} = require('./db-config.js');

function getIdLabelByCf(cf) {
    if (["UTM20"].indexOf(cf) >= 0) {
        return "Matrix No / UTM Acid ID";
    }
    if (["UTM21"].indexOf(cf) >= 0) {
        return "Matrix No / UTM Acid ID (For Unemployed Graduands Only)";
    }
    if (cf == "UMT") {
        return "Matrix No";
    }
}
const OTHER_PLEASE_SPECIFY = 'Others (Please specify in field below)';
const CustomConfig = {
    id_utm21: {
        discard_form: true,
        discard_filter: true,
        label: getIdLabelByCf("UTM21"),
        icon: "slack",
        type: "single",
        onCf: ["UTM21"]
    },
    level_study_utm21: {
        label: "Level Of Study",
        question: "What is your level of study?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "level_study_utm21",
        is_required: true,
        onCf: ["UTM21"]
    },
    faculty_utm21: {
        label: "Faculty",
        question: "Which faculty are you in?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "faculty_utm21",
        is_required: true,
        onCf: ["UTM21"]
    },
    graduation_utm21: {
        label: "Graduation",
        question: "When is your graduation?",
        icon: "calendar",
        type: "single",
        input_type: "select",
        ref_table_name: "graduation_utm21",
        is_required: true,
        onCf: ["UTM21"]
    },
    field_study_utm21: {
        discard_popup_on: (d) => {
            return d['field_study_utm21'] == OTHER_PLEASE_SPECIFY;
        },
        label: "Field of Study",
        question: "What is your field of study",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "field_study_utm21",
        is_required: true,
        onCf: ["UTM21"]
    },
    field_study_other_utm21: {
        discard_popup_on: (d) => {
            return d['field_study_utm21'] != OTHER_PLEASE_SPECIFY;
        },
        label: "Field of Study",
        question: "Other field of study",
        icon: "graduation-cap",
        type: "single",
        input_type: "text",
        // ref_table_name: "field_study_utm21",
        is_required: false,
        onCf: ["UTM21"]
    },
    webinar_utm21: {
        discard_filter: true,
        discard_popup: true,
        label: "Webinar",
        question: "Which webinar sessions are you interested in?",
        question_sublabel: "You can choose more than one webinar session",
        icon: "microphone",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "webinar_utm21",
        type: "multi",
        input_type: "select",
        ref_table_name: "webinar_utm21",
        is_required: true,
        onCf: ["UTM21"],
        attr: `{val}`
    },
}
const CustomStudentCardInfo = {
    UTM21: {
        line2: (d) => "faculty_utm21",
        line3: (d) => {
            if (d['field_study_utm21'] == OTHER_PLEASE_SPECIFY) {
                return "field_study_other_utm21"
            } else {
                return "field_study_utm21"
            }
        }
    }
}

var Single = {
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

    field_study_main: "field_study_main",
    field_study_secondary: "field_study_secondary",

    kpt: "kpt", // @kpt_validation - add kt Single
    id_utm: "id_utm", // @id_utm_validation - add kt Single

    // UNISZA ------------------------------
    id_unisza: "id_unisza",
    unisza_faculty: "unisza_faculty", // ref table 
    unisza_course: "unisza_course",// ref table
    current_semester: "current_semester", // ref table
    course_status: "course_status",// ref table
    employment_status: "employment_status",// ref table
    // UNISZA ------------------------------

    birth_date: "birth_date",
    monash_student_id: "monash_student_id",
    monash_school: "monash_school",
    sunway_faculty: "sunway_faculty",
    sunway_program: "sunway_program",
    local_or_oversea_study: "local_or_oversea_study",
    local_or_oversea_location: "local_or_oversea_location",
    gender: "gender",
    work_experience_year: "work_experience_year",
}

var Multi = {
    field_study: "field_study",
    looking_for_position: "looking_for_position",
    interested_role: "interested_role",
    interested_job_location: "interested_job_location",
    skill: "skill",
    extracurricular: "extracurricular",
    // 1b. @custom_user_info_by_cf - multi
}

// add extra from custom
for (let k in CustomConfig) {
    if (CustomConfig[k].type == "single") {
        Single[k] = k;
    }
    if (CustomConfig[k].type == "multi") {
        Multi[k] = k;
    }
}

const CustomOrder = {
    MDCW: [
        Single.first_name,
        Single.kpt,
        // Single.birth_date,
        Single.phone_number,
        Single.where_in_malaysia,
        Multi.looking_for_position,
        Single.qualification,
        Multi.field_study,
        Single.working_availability_month,
        Multi.interested_role,
        Multi.interested_job_location,
        Multi.skill,
    ],
    UTM21: [
        "id_utm21",
        Single.first_name,
        Single.kpt,
        Single.phone_number,
        "level_study_utm21",
        "faculty_utm21",
        "graduation_utm21",
        "field_study_utm21",
        "field_study_other_utm21",
        "webinar_utm21",
    ]
}

const isInCustomOrder = (cf, key) => {
    if (!CustomOrder[cf]) {
        return true;
    }

    return CustomOrder[cf].indexOf(key) >= 0;
}

const pickAndReorderByCf = (cf, r) => {
    let order = null;
    if (CustomOrder[cf]) {
        order = CustomOrder[cf];
    }

    if (order) {
        let newR = [];
        let map = {}
        for (var i in r) {
            map[r[i].id] = i;
        }

        for (var id of order) {
            newR.push(r[map[id]]);
        }
        return newR;

    } else {
        return r;
    }
}

// 1c. @custom_user_info_by_cf - on or off by cf
// by default return false
const isCustomUserInfoOff = (cf, key) => {

    // override all,
    // kalau ad custom order, mmg ikut sebijik
    if (CustomOrder[cf]) {
        let existInCustomOrder = CustomOrder[cf].indexOf(key) >= 0
        return !existInCustomOrder;
    }

    let offCf = null;
    let onCf = null;

    switch (key) {
        // ###############
        // by default is OFF
        case Single.unemployment_period:
            onCf = [""];  // not opened for any cf yet
            break;
        case Single.birth_date:
            onCf = [""]; // not opened for any cf yet
            break;
        case Single.monash_school:
            onCf = ["MONASH"];
            break;
        case Single.sunway_faculty:
            onCf = ["SUNWAY"];
            break;
        case Single.sunway_program:
            onCf = ["SUNWAY"];
            break;
        case Single.monash_student_id:
            onCf = ["MONASH"];
            break;
        case Single.local_or_oversea_study:
            onCf = ["INTEL"];
            break;
        case Single.local_or_oversea_location:
            onCf = ["INTEL"];
            break;
        case Single.work_experience_year:
            onCf = ["INTEL"];
            break;
        case Single.gender:
            onCf = ["INTEL"];
            break;
        case Single.kpt:
            onCf = ["MDCW"];
            break;
        case Single.id_utm:
            // @login_by_student_id
            onCf = ["UTM20", "UTM21", "UMT"];
            break;
        case Single.id_unisza:
            onCf = ["UNISZA"];
            break;
        case Single.unisza_faculty:
            onCf = ["UNISZA"];
            break;
        case Single.unisza_course:
            onCf = ["UNISZA"];
            break;
        case Single.current_semester:
            onCf = ["UNISZA"];
            break;
        case Single.course_status:
            onCf = ["UNISZA"];
            break;
        case Single.employment_status:
            onCf = ["UNISZA"];
            break;

        // ###############
        // by default is ON
        case Single.country_study:
            offCf = ["MONASH", "SUNWAY", "INTEL", "MDCW", "UNISZA"];
            break;
        case Single.university:
            offCf = ["UNISZA"];
            break;
        case Single.field_study_main:
            offCf = ["UNISZA"];
            break;
        case Single.field_study_secondary:
            offCf = ["UNISZA"];
            break;
        case Single.where_in_malaysia:
            offCf = ["MONASH", "SUNWAY", "INTEL"];
            break;
        case Multi.field_study:
            offCf = ["MONASH", "SUNWAY"];
            break;
        case Multi.extracurricular:
            offCf = ["MONASH", "SUNWAY", "INTEL", "MDCW"];
            break;
        case Multi.interested_role:
            offCf = ["INTEL"];
            break;
        case Multi.interested_job_location:
            offCf = ["INTEL"];
            break;
        case Multi.skill:
            offCf = ["INTEL"];
            break;
        default:
            try {
                onCf = CustomConfig[key].onCf
            } catch (err) { }
            if (!onCf) {
                onCf = null;
            }
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
    let valid = ["JPATC"];
    return valid.indexOf(cf) >= 0;
}

// @id_utm_validation - SET_CF_HERE
// @login_by_student_id
const isDoIdUtmValidation = (cf) => {
    let valid = ["UTM20", "UTM21", "UMT"];
    return valid.indexOf(cf) >= 0;
}

const RequiredFieldStudent = [
    UserMeta.FIRST_NAME,
    UserMeta.LAST_NAME,
    User.EMAIL,
    User.PASSWORD,

    // @kpt_validation
    UserMeta.KPT,

    // @id_utm_validation
    UserMeta.ID_UTM,


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

const customLabel = (cf, key, defaultLabel) => {
    if (key == Single.qualification && cf == "UTM21") {
        return "Level of Study"
    }
    return defaultLabel;
}

const customRef = (cf, key, defaultRef) => {
    if (key == Single.qualification && cf == "UTM21") {
        return "qualification_utm21"
    }
    return defaultRef;
}


module.exports = {
    getIdLabelByCf,
    CustomConfig,
    CustomStudentCardInfo,
    customLabel,
    customRef,
    isDoJpaKptValidation, // @kpt_validation
    isDoIdUtmValidation, // @id_utm_validation
    Single, Multi,
    RequiredFieldStudent,
    RequiredFieldRecruiter,
    isCustomUserInfoOff,
    pickAndReorderByCf,
    isInCustomOrder
};