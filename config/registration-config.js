const {
    User,
    UserMeta
} = require('./db-config.js');

const RegConfigCustomByCf = require("./registration-config-custom-by-cf");

const IsUploadResumeRequired = ["INTELDD21", "INTELDDSEPT21", "TARUCJUL21", "TARUCNOV21", "UTMIV21"]
const IsHasUploadResume = ["OCPE21", "INTELDD21", "INTELDDSEPT21", "OEJF21", "TARUCJUL21", "TARUCNOV21", "UTMIV21", "TCREP22"]

const IsUploadResumeRequired_FirstSignupPage = ["INTELMM22"]
const IsHasUploadResume_FirstSignupPage = ["INTELMM22"]


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


function getIdLabelByCf(cf) {
    if (["UTM20"].indexOf(cf) >= 0) {
        return "Matrix No / UTM Acid ID";
    }
    if (["UTM21"].indexOf(cf) >= 0) {
        return "Matrix No / UTM Acid ID (For Unemployed Graduands Only)";
    }
    if (["UTMIV21"].indexOf(cf) >= 0) {
        return "Matrix No / UTM Acid ID";
    }
    if (cf == "UMT" || cf == "UMT21") {
        return "Matrix No";
    }
}

const OTHER_PLEASE_SPECIFY = RegConfigCustomByCf.OTHER_PLEASE_SPECIFY;
const CustomConfig = {
    ...RegConfigCustomByCf.CustomConfig,
    id_utm21: {
        discard_form: true,
        discard_filter: true,
        label: getIdLabelByCf("UTM21"),
        icon: "slack",
        type: "single",
        onCf: ["UTM21"]
    },
    id_umt: {
        discard_form: true,
        discard_filter: true,
        label: getIdLabelByCf("UMT21"),
        icon: "slack",
        type: "single",
        onCf: ["UMT21"]
    },
};

const CustomDiscardEditProfile = {
    UTMIV21: ["id_utm"],
    UMT21: ["id_utm"],
}

const CustomOrder = {
    ...RegConfigCustomByCf.CustomOrder,
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
    ],
    USM21: [
        Single.first_name,
        Single.gender,
        "id_usm",
        Single.kpt,
        "usm_year_study",
        "usm_university",
        "usm_faculty",
        "usm_course",
        "usm_year",
        Single.phone_number,
        "usm_purpose",
        "usm_cgpa",
        "job_category"
    ]
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
        },
    },
    INTELMM22: {
        // line4: (d) => "has_attended_before",
        // line4Render: (v) => {
        //     if (v == "Yes") {
        //         return `<div style="margin: 5px 0px; color:#b600ff; font-size: 13px;">
        //                 <b><i>Participated in Previous Event</i></b>
        //         </div>`
        //     } return "";
        // },
        line4: (d) => "intel_is_intel_employee",
        line4Render: (v) => {
            if (v == "Yes") {
                return `<div style="margin: 5px 0px; color:#FF0000; font-size: 13px;">
                        <b><i>An Active/former Intel Employee</i></b>
                </div>`
            } return "";
        }
    },
    INTELDDSEPT21: {
        line4: (d) => "has_attended_before",
        line4Render: (v) => {
            if (v == "Yes") {
                return `<div style="margin: 5px 0px; color:#b600ff; font-size: 13px;">
                        <b><i>Participated in Previous Event</i></b>
                </div>`
            } return "";
        },
        line5: (d) => "intel_is_intel_employee",
        line5Render: (v) => {
            if (v == "Yes") {
                return `<div style="margin: 5px 0px; color:#FF0000; font-size: 13px;">
                        <b><i>An Active/former Intel Employee</i></b>
                </div>`
            } return "";
        }
    }
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

const isInCustomOrder = (cf, key) => {
    if (!CustomOrder[cf]) {
        return true;
    }

    return CustomOrder[cf].indexOf(key) >= 0;
}

const pickAndReorderByCf = (cf, r) => {
    let order = null;
    let discardEditProfile = [];

    if (CustomOrder[cf]) {
        order = CustomOrder[cf];
    }

    if (CustomDiscardEditProfile[cf]) {
        discardEditProfile = CustomDiscardEditProfile[cf];
    }

    if (order) {
        let newR = [];
        let map = {}
        for (var i in r) {
            let k = r[i].id;
            if (!map[k]) {
                map[k] = [];
            }
            map[k].push(i);
        }

        for (var id of order) {
            let indexes = map[id];

            if (Array.isArray(indexes)) {
                for (let i of indexes) {
                    let item = r[i];
                    console.log("item", item);
                    let id = item["id"];
                    if (discardEditProfile.indexOf(id) >= 0) {
                        continue;
                    }
                    newR.push(item);
                }
            }
        }
        console.log("newR", newR);
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
            onCf = ["INTEL", "INTELDD21", "INTELDDSEPT21", "INTELMM22"];
            break;
        case Single.local_or_oversea_location:
            onCf = ["INTEL", "INTELDD21", "INTELDDSEPT21", "INTELMM22"];
            break;
        case Single.work_experience_year:
            onCf = ["INTEL", "INTELDD21", "INTELDDSEPT21", "INTELMM22"];
            break;
        case Single.gender:
            onCf = ["USM21", "INTEL", "INTELDD21", "INTELDDSEPT21", "INTELMM22"];
            break;
        case Single.kpt:
            onCf = ["MDCW", "USM21"];
            break;
        case Single.id_utm:
            // @login_by_student_id
            onCf = ["UTM20", "UTM21", "UMT", "UTMIV21", "UMT21"]; //  "UMT21",
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
            offCf = ["MONASH", "SUNWAY", "INTEL", "INTELDD21", "INTELDDSEPT21", "INTELMM22", "MDCW", "UNISZA"];
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
    let valid = ["UTM20", "UTM21", "UMT", "UTMIV21"]; // "UMT21"
    return valid.indexOf(cf) >= 0;
}

const idUtmInvalid_customEmail = (cf) => {
    // switch (cf) {
    //     case "UTMIV21": return "norazwa@utm.my";
    // }
    return "graduates@seedsjobfair.com";
}

const idUtmInvalid_customHtml = (id, id_label, cf) => {

    switch (cf) {
        case "UTMIV21":
            let url = "https://forms.gle/KKjyMR6vUiuBYf4j9";
            return `<div>
                Sorry, we couldn't find your ${id_label} (<b>${id}</b>)! Open 
                <a href="${url}" target="_blank">${url}</a> to submit your ${id_label}
                <br></br>
            </div>`
    }

    return null;
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

    "level_study_utm21",
    "faculty_utm21"
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

function isRequired(cf, key, defaultValue) {
    if (key == "grade") {
        if (["OEJF21"].indexOf(cf) >= 0) {
            return false;
        }
    }

    return defaultValue
}

function getCustomLabel(key, cf) {
    if (key == Single.qualification) {
        if (cf == "SUNWAYGETHIRED21") {
            return "What is your highest level of certificate once you graduate?";
        }

        return "What is your highest level of certificate?";
    }

    return "";
}

module.exports = {
    getCustomLabel,
    isRequired,
    getIdLabelByCf,
    CustomConfig,
    CustomStudentCardInfo,
    customLabel,
    customRef,
    isDoJpaKptValidation, // @kpt_validation
    isDoIdUtmValidation, // @id_utm_validation
    idUtmInvalid_customHtml,
    idUtmInvalid_customEmail,
    Single, Multi,
    RequiredFieldStudent,
    RequiredFieldRecruiter,
    isCustomUserInfoOff,
    pickAndReorderByCf,
    isInCustomOrder,
    IsUploadResumeRequired,
    IsHasUploadResume,
    IsUploadResumeRequired_FirstSignupPage,
    IsHasUploadResume_FirstSignupPage
};