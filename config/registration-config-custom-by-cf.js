
const OTHER_PLEASE_SPECIFY = 'Others (Please specify in field below)';

const OTHER_UNI_OVERSEA = 'Others (Overseas University)';
const OTHER_UNI_LOCAL = 'Others (Local University)';

const OTHER_CHINA = '其他 Others';
const CustomConfig = {
    // ##############################################################
    // GENERAL
    interested_job_location_my_sg: {
        label: "Interested Job Location",
        question: "Where would you like to work in Malaysia?",
        icon: "suitcase",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "interested_job_location_my_sg",
        type: "multi",
        input_type: "select",
        ref_table_name: "interested_job_location_my_sg",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OCPE21"],
        attr: `{val}`
    },
    current_position: {
        label: "Current Position",
        question: "Current Position",
        icon: "suitcase",
        type: "single",
        input_type: "text",
        is_required: true,
        onCf: ["OCPE21", "OEJF22"]
    },
    personal_email: {
        label: "Personal Email Address",
        question: "Personal Email Address",
        icon: "email",
        type: "single",
        input_type: "text",
        is_required: true,
        onCf: ["OEJF22"]
    },
    student_id: {
        label: "Student ID",
        question: "Student ID",
        icon: "slack",
        type: "single",
        input_type: "text",
        is_required: true,
        onCf: ["TARUCJUL21", "TARUCNOV21", "TAYLORS21", "TAYLORS22"]
    },
    student_matrix_id: {
        label: "Student ID / Matrix ID",
        question: "Student ID / Matrix ID",
        question_sublabel: "Kindly put N/A if without Student ID",
        icon: "slack",
        type: "single",
        input_type: "text",
        is_required: true,
        onCf: ["SUNWAYGETHIRED21"]
    },
    internship_date: {
        label: "Internship Date",
        question: "Internship Date",
        question_sublabel: "Leave blank if not applicable",
        icon: "calendar",
        type: "single",
        input_type: "date",
        is_required: false,
        onCf: ["TARUCJUL21", "TARUCNOV21"]
    },
    age: {
        label: "Age",
        question: "How old are you?",
        icon: "calendar",
        type: "single",
        input_type: "select",
        ref_table_name: "age",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OEJF21", "OEJF22"]
    },
    age_no: {
        label: "Age",
        question: "Age",
        icon: "calendar",
        type: "single",
        input_type: "number",
        is_required: true,
        onCf: ["WCC22"]
    },
    race: {
        label: "Race/Ethnicity",
        question: "Race/Ethnicity",
        icon: "slack",
        type: "single",
        input_type: "select",
        ref_table_name: "race",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OEJF21", "OEJF22", "UTMIV21", "OCPE21", "D2W2K22", "D2WOCT22", "VCFEE22"]
    },
    nationality: {
        label: "Nationality",
        question: "Nationality",
        icon: "slack",
        type: "single",
        input_type: "select",
        ref_table_name: "nationality",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["UTMIV21"]
    },
    job_category: {
        label: "Looking For Job",
        question: "What kind of job are you looking for?",
        icon: "suitcase",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "job_category",
        type: "multi",
        input_type: "select",
        ref_table_name: "job_category",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["USM21"],
        attr: `{val}`
    },
    full_name: {
        discard_filter: true,
        question: "Full Name (Per IC/Passport)",
        label: "Full Name (Per IC/Passport)",
        icon: "address-card",
        is_required: true,
        input_type: "text",
        type: "single",
        onCf: ["D2W21", "D2WRL21", "UTMIV21", "TCREP22", "MYHEARTCAFE2022", "D2W2K22", "D2WOCT22", "VCFEE22"]
    },
    ic_number: {
        discard_filter: true,
        question: "IC Number",
        label: "IC Number",
        icon: "slack",
        is_required: true,
        input_type: "text",
        type: "single",
        onCf: ["D2W2K22", "D2WOCT22", "VCFEE22"]
    },
    national_id_no: {
        discard_filter: true,
        question: "National Identification Number",
        label: "National Identification Number",
        icon: "slack",
        is_required: true,
        input_type: "number",
        type: "single",
        onCf: ["WCC22"]
    },
    resident_malaysia: {
        discard_popup_on: (d) => {
            return d['resident_malaysia'] == OTHER_PLEASE_SPECIFY;
        },
        label: "Place Of Residence",
        question: "Place Of Residence",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "state_other",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["SUNWAYGRD21", "SUNWAYGETHIRED21"]
    },
    resident_malaysia_other: {
        discard_filter: true,
        discard_popup_on: (d) => {
            return d['resident_malaysia'] != OTHER_PLEASE_SPECIFY;
        },
        label: "Place Of Residence",
        question: "Place Of Residence (Other)",
        icon: "map-marker",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["SUNWAYGRD21", "SUNWAYGETHIRED21"]
    },
    nationality_select: {
        discard_popup_on: (d) => {
            return d['nationality_select'] == OTHER_PLEASE_SPECIFY;
        },
        label: "Nationality",
        question: "Nationality",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "nationality",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["D2WOCT22", "VCFEE22"]
    },
    nationality_select_other: {
        discard_filter: true,
        discard_popup_on: (d) => {
            return d['nationality_select'] != OTHER_PLEASE_SPECIFY;
        },
        label: "Nationality",
        question: "Nationality (Other)",
        icon: "map-marker",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["D2WOCT22", "VCFEE22"]
    },
    where_in_malaysia_select: {
        label: "Place Of Residence",
        question: "Where are you from in Malaysia?",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "state",
        ref_order_by: "val asc",
        is_required: true,
        onCf: ["OEJF21", "OEJF22", "TARUCJUL21", "TARUCNOV21", "OCPE21"]
    },

    country_study_select: {
        label: "Country Of Study",
        question: "Where are you studying",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "country",
        ref_order_by: "val asc",
        is_required: true,
        onCf: ["TARUCJUL21", "TARUCNOV21"]
    },
    // ##############################################################
    // UTMIV21
    program_utmiv21: {
        label: "Academic Programme",
        question: "Academic Programme",
        icon: "graduation-cap",
        type: "single",
        input_type: "text",
        is_required: true,
        onCf: ["UTMIV21"]
    },
    level_of_study_utmiv21: {
        label: "Level Of Study",
        question: "Level Of Study",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "level_of_study_utmiv21",
        is_required: true,
        onCf: ["UTMIV21"]
    },
    faculty_utmiv21: {
        label: "Faculty",
        question: "Which faculty are you in?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "faculty_utmiv21",
        is_required: true,
        onCf: ["UTM21", "UTMIV21"]
    },
    // ##############################################################
    // UTM21
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
        question_sublabel: "You will still need to RSVP once you are registered",
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
    // ##############################################################
    // SUNWAY
    sunway_purpose: {
        label: "Looking For",
        question: "What are you looking for?",
        icon: "star",
        list_title: null,
        table_name: "sunway_purpose",
        discard_ref_from_default: true,
        type: "multi",
        input_type: "select",
        ref_table_name: "sunway_purpose",
        is_required: true,
        onCf: ["SUNWAYGRD21", "SUNWAYGETHIRED21"],
        attr: `{val}`
    },
    // ##############################################################
    // USM21
    id_usm: {
        discard_filter: true,
        is_required: true,
        question: "Matric Number",
        label: "Matric number",
        icon: "slack",
        input_type: "text",
        type: "single",
        onCf: ["USM21"]
    },
    usm_year_study: {
        label: "Year Of Study",
        question: "What is your year of study?",
        icon: "calendar",
        type: "single",
        input_type: "select",
        ref_table_name: "usm_year_study",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["USM21"]
    },
    usm_year: {
        label: "Graduation Year",
        question: "When is your graduation?",
        icon: "calendar",
        type: "single",
        input_type: "select",
        ref_table_name: "usm_year",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["USM21"]
    },
    usm_course: {
        label: "Course",
        question: "What is your course?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "usm_course",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["USM21"]
    },
    usm_purpose: {
        label: "Looking For",
        question: "What are you looking for?",
        icon: "star",
        list_title: null,
        table_name: "usm_purpose",
        discard_ref_from_default: true,
        type: "multi",
        input_type: "select",
        ref_table_name: "usm_purpose",
        is_required: true,
        onCf: ["USM21"],
        attr: `{val}`
    },
    usm_cgpa: {
        label: "CGPA",
        question: "What is your CGPA?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "usm_cgpa",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["USM21"]
    },
    usm_university: {
        label: "University",
        question: "Which university/college are you studying at?",
        icon: "university",
        type: "single",
        input_type: "select",
        ref_table_name: "usm_university",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["USM21"]
    },
    usm_faculty: {
        label: "Faculty",
        question: "Which faculty/school are you in?",
        icon: "university",
        type: "single",
        input_type: "select",
        ref_table_name: "usm_faculty",
        ref_order_by: "ID asc",
        onCf: ["USM21"]
    },

    // ##############################################################
    // D2W21

    d2w21_resident: {
        discard_popup_on: (d) => {
            return d['d2w21_resident'] == OTHER_PLEASE_SPECIFY;
        },
        label: "Place Of Residence",
        question: "Place Of Residence",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "state_other",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["D2W21", "D2WRL21"]
    },
    d2w21_resident_other: {
        discard_filter: true,
        discard_popup_on: (d) => {
            return d['d2w21_resident'] != OTHER_PLEASE_SPECIFY;
        },
        label: "Place Of Residence",
        question: "Place Of Residence (Other)",
        icon: "map-marker",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["D2W21", "D2WRL21"]
    },
    d2w21_qualification: {
        discard_popup_on: (d) => {
            return d['d2w21_qualification'] == OTHER_PLEASE_SPECIFY;
        },
        label: "Highest Level Of Certificate",
        question: "Highest Level Of Certificate",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "d2w21_qualification",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["D2W21", "D2WRL21"]
    },
    d2w21_qualification_other: {
        discard_filter: true,
        discard_popup_on: (d) => {
            return d['d2w21_qualification'] != OTHER_PLEASE_SPECIFY;
        },
        label: "Highest Level Of Certificate",
        question: "Highest Level Of Certificate (Others)",
        icon: "graduation-cap",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["D2W21", "D2WRL21"]
    },
    d2w21_interested_job_location: {
        label: "Interested Job Location",
        question: "Where would you like to work in Malaysia?",
        icon: "suitcase",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "d2w21_interested_job_location",
        type: "multi",
        input_type: "select",
        ref_table_name: "state",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["D2W21", "D2WRL21"],
        attr: `{val}`
    },
    d2w21_university: {
        discard_popup_on: (d) => {
            return d['d2w21_university'] == OTHER_PLEASE_SPECIFY;
        },
        label: "University / Institution",
        question: "University / Institution",
        icon: "university",
        type: "single",
        input_type: "select",
        ref_table_name: "d2w21_university",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["D2W21", "D2WRL21"]
    },
    d2w21_university_other: {
        discard_filter: true,
        discard_popup_on: (d) => {
            return d['d2w21_university'] != OTHER_PLEASE_SPECIFY;
        },
        label: "University / Institution",
        question: "University / Institution (Others)",
        icon: "university",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["D2W21", "D2WRL21"]
    },
    d2w21_year_study: {
        label: "Year Of Study",
        question: "Year Of Study",
        icon: "calendar",
        type: "single",
        input_type: "select",
        ref_table_name: "d2w21_year_study",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["D2W21", "D2WRL21"]
    },
    d2w21_field_study: {
        discard_popup_on: (d) => {
            return d['d2w21_field_study'] == OTHER_PLEASE_SPECIFY;
        },
        label: "Field of Study",
        question: "Field of Study",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "d2w21_field_study",
        is_required: true,
        onCf: ["D2W21", "D2WRL21"]
    },
    d2w21_field_study_other: {
        discard_filter: true,
        discard_popup_on: (d) => {
            return d['d2w21_field_study'] != OTHER_PLEASE_SPECIFY;
        },
        label: "Field of Study",
        question: "Field of Study (Others)",
        icon: "graduation-cap",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["D2W21", "D2WRL21"]
    },
    d2w21_webinar: {
        discard_filter: true,
        discard_popup: true,
        label: "Webinar",
        question: "Which webinar sessions are you interested in?",
        question_sublabel: "You will still need to RSVP once you are registered",
        icon: "microphone",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "d2w21_webinar",
        type: "multi",
        input_type: "select",
        ref_table_name: "d2w21_webinar",
        is_required: true,
        onCf: ["D2W21", "D2WRL21"],
        attr: `{val}`
    },
    d2w21_reference: {
        discard_filter: true,
        discard_popup: true,
        label: "Where did you hear about this event?",
        question: "Where did you hear about this event?",
        icon: "slack",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "d2w21_reference",
        type: "multi",
        input_type: "select",
        ref_table_name: "d2w21_reference",
        is_required: true,
        onCf: ["D2W21", "D2WRL21", "D2W2K22", "D2WOCT22", "VCFEE22"],
        attr: `{val}`
    },
    // ################################################################
    // sunwaygrad21
    sunwaygrad21_program: {
        label: "Programme",
        question: "What is your programme?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "sunwaygrad21_program",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["SUNWAYGRD21", "SUNWAYGETHIRED21"]
    },

    // ################################################################
    // oejf21
    oejf21_field_study: {
        label: "Field Of Study",
        question: "What is your field of study?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "oejf21_field_study",
        ref_order_by: "ID asc",
        is_required: false,
        onCf: ["OEJF21", "OEJF22"]
    },
    oejf21_where_work: {
        label: "Interested Job Location",
        question: "Where would you like to work in Malaysia?",
        icon: "map-marker",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "oejf21_where_work",
        type: "multi",
        input_type: "select",
        ref_table_name: "oejf21_where_work",
        ref_order_by: "val asc",
        is_required: true,
        onCf: ["OEJF21", "OEJF22"],
        attr: `{val}`
    },
    oejf21_where_work_oversea: {
        label: "Interested Job Location (Oversea)",
        question: "Where would you like to work in oversea?",
        icon: "map-marker",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "oejf21_where_work_oversea",
        type: "multi",
        input_type: "select",
        ref_table_name: "oejf21_where_work_oversea",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OEJF21", "OEJF22"],
        attr: `{val}`
    },
    oejf21_years_working: {
        label: "Number of Years Working",
        question: "Number of years working",
        icon: "suitcase",
        type: "single",
        input_type: "select",
        ref_table_name: "oejf21_years_working",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OEJF21", "OEJF22"]
    },
    oejf21_industry: {
        label: "Current Industry",
        question: "Current Industry",
        icon: "suitcase",
        type: "single",
        input_type: "select",
        ref_table_name: "oejf21_industry",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OEJF21", "OEJF22", "OCPE21"]
    },
    oejf21_reference: {
        discard_filter: true,
        discard_popup: true,
        label: "How did you know about us?",
        question: "How did you know about us?",
        icon: "slack",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "oejf21_reference",
        type: "multi",
        input_type: "select",
        ref_table_name: "oejf21_reference",
        ref_order_by: "val asc",
        is_required: true,
        onCf: ["OEJF21", "OEJF22"],
        attr: `{val}`
    },
    oejf21_qualification: {
        // discard_popup_on: (d) => {
        //     return d['oejf21_qualification'] == OTHER_PLEASE_SPECIFY;
        // },
        label: "Qualification",
        question: "What is your highest level of certificate?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "oejf21_qualification",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OEJF21", "OEJF22", "OCPE21"]
    },
    oejf21_qualification_other: {
        discard_filter: true,
        discard_popup_on: (d) => {
            return d['oejf21_qualification'] != OTHER_PLEASE_SPECIFY;
        },
        label: "Qualification",
        question: "What is your highest level of certificate? (Other)",
        icon: "graduation-cap",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["OEJF21", "OEJF22", "OCPE21"]
    },
    oejf21_interested_job: {
        discard_filter: true,
        discard_popup: true,
        label: "Interested Job Position",
        question: "What types of jobs are you interested in?",
        icon: "suitcase",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "oejf21_interested_job",
        type: "multi",
        input_type: "select",
        ref_table_name: "oejf21_interested_job",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OEJF21", "OEJF22"],
        attr: `{val}`
    },
    // ################################################################
    // tarucjul21
    tarucjul21_current_year: {
        label: "Current Year Of Study",
        question: "Current Year Of Study",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "tarucjul21_current_year",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TARUCJUL21", "TARUCNOV21"]
    },
    tarucjul21_current_semester: {
        label: "Current Semester Of Study",
        question: "Current Semester Of Study",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "tarucjul21_current_semester",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TARUCJUL21", "TARUCNOV21"]
    },

    tarucjul21_purpose: {
        label: "Looking For",
        question: "What are you looking for?",
        icon: "star",
        list_title: null,
        table_name: "tarucjul21_purpose",
        discard_ref_from_default: true,
        type: "multi",
        input_type: "select",
        ref_table_name: "tarucjul21_purpose",
        is_required: true,
        onCf: ["TARUCJUL21", "TARUCNOV21"],
        attr: `{val}`
    },
    tarucjul21_interested_intern_location: {
        label: "Preferred Internship Location",
        question: "Where is your preferred internship location?",
        icon: "suitcase",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "tarucjul21_interested_intern_location",
        type: "multi",
        input_type: "select",
        ref_table_name: "state",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TARUCJUL21", "TARUCNOV21"],
        attr: `{val}`
    },

    //        
    tarucjul21_programme: {
        label: "Programme Name",
        question: "What is your Programme name?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "tarucjul21_programme",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TARUCJUL21", "TARUCNOV21"]
    },
    tarucjul21_faculty: {
        label: "Faculty",
        question: "What faculty are you in?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "tarucjul21_faculty",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TARUCJUL21", "TARUCNOV21"]
    },
    tarucjul21_campus: {
        label: "Campus",
        question: "Which TAR UC campus are you from?",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "tarucjul21_campus",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TARUCJUL21", "TARUCNOV21"]
    },

    // ############################
    // SUNWAYGETHIRED21
    sunway_campus: {
        label: "Campus",
        question: "Which campus are you studying in?",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "sunway_campus",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["SUNWAYGETHIRED21"]
    },

    sunway_student_or_alumni: {
        label: "Current Student / Alumni ?",
        question: "Are you a current student or alumni?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "yes_no_other",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["SUNWAYGETHIRED21"]
    },

    intel_is_intel_employee: {
        label: "Is an active OR a former Intel employee?",
        question: "Are you currently an active OR a former Intel employee?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "yes_no",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["INTELDDSEPT21", "INTELMM22"]
    },

    intel_is_accept_offer: {
        label: "Has accepted any offer from Intel (past two months)?",
        question: "Did you accept any offer of employment from Intel prior to signing up for this career fair (within the past two months)?",
        icon: "slack",
        type: "single",
        input_type: "select",
        ref_table_name: "yes_no",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["INTELMM22"]
    },
    has_attended_before: {
        label: "Has attended previous Design & Development (D&D) Virtual Career Fairs?",
        question: "Have you attended any of our previous Design & Development (D&D) Virtual Career Fairs?",
        icon: "slack",
        type: "single",
        input_type: "select",
        ref_table_name: "yes_no",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["INTELDDSEPT21", "INTELMM22"]
    },
    intel_reference: {
        discard_filter: true,
        discard_popup: true,
        label: "Where do you hear about this event?",
        question: "Where do you hear about this event?",
        icon: "slack",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "intel_reference",
        type: "multi",
        input_type: "select",
        ref_table_name: "intel_reference",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["INTELDDSEPT21", "INTELMM22"],
        attr: `{val}`
    },
    // TAYLORS21
    taylors21_programme: {
        discard_popup_on: (d) => {
            return d['taylors21_programme'] == OTHER_PLEASE_SPECIFY;
        },
        label: "Programme",
        question: "What is your programme name?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "taylors21_programme",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TAYLORS21", "TAYLORS22"]
    },
    taylors21_programme_other: {
        discard_filter: true,
        discard_popup_on: (d) => {
            return d['taylors21_programme'] != OTHER_PLEASE_SPECIFY;
        },
        label: "Programme",
        question: "What is your programme name? (Other)",
        icon: "graduation-cap",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["TAYLORS21", "TAYLORS22"]
    },
    // ####################
    // WCC21
    age_group: {
        label: "Age Group",
        question: "Age Group",
        icon: "slack",
        type: "single",
        input_type: "select",
        ref_table_name: "age_group",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["WCC21", "WCC22", "OCPE21"]
    },
    wcc_iam: {
        discard_popup_on: (d) => {
            return d['wcc_iam'] == OTHER_PLEASE_SPECIFY;
        },
        label: "I am",
        question: "I am",
        icon: "slack",
        type: "single",
        input_type: "select",
        ref_table_name: "wcc_iam",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["WCC21", "WCC22"]
    },
    wcc_iam_other: {
        discard_filter: true,
        discard_popup_on: (d) => {
            return d['wcc_iam'] != OTHER_PLEASE_SPECIFY;
        },
        label: "I am",
        question: "If Others, please state below",
        icon: "slack",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["WCC21", "WCC22"]
    },
    wcc_work_experience: {
        label: "Year of Work Experience",
        question: "How many years of work experience do you have?",
        icon: "suitcase",
        type: "single",
        input_type: "select",
        ref_table_name: "wcc_work_experience",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["WCC21", "WCC22"]
    },
    wcc_location: {
        label: "Geographical Location",
        question: "Geographical Location",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "state",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["WCC21", "WCC22"]
    },
    wcc_graduate_year: {
        label: "Graduate Year",
        question: "In which year did you graduate?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "wcc_graduate_year",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["WCC21", "WCC22"]
    },
    wcc_field_study: {
        label: "Field Of Study",
        question: "What is your main field of study?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "wcc_field_study",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["WCC21", "WCC22"]
    },
    wcc_looking_for: {
        label: "Looking For",
        question: "What are you looking for?",
        icon: "star",
        type: "single",
        input_type: "select",
        ref_table_name: "wcc_looking_for",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["WCC21", "WCC22"]
    },
    wcc_job_level: {
        label: "Interested Job Level",
        question: "What level of jobs are you looking for?",
        icon: "suitcase",
        type: "single",
        input_type: "select",
        ref_table_name: "wcc_job_level",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["WCC21", "WCC22"]
    },
    jpastar_status: {
        label: "Current Status",
        question: "What is your current status?",
        icon: "slack",
        type: "single",
        input_type: "select",
        ref_table_name: "jpastar_status",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["JPASTAR21"]
    },
    jpastar_looking_for: {
        label: "Looking For",
        question: "What are you looking for?",
        icon: "slack",
        type: "single",
        input_type: "select",
        ref_table_name: "jpastar_looking_for",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["JPASTAR21"]
    },

    /// OCPE ####################
    ocpe_graduation: {
        label: "Graduation Year",
        question: "When is your graduation date?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "ocpe_graduation",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OCPE21"]
    },
    ocpe_work_availability: {
        label: "Work Availability",
        question: "When will you be available to work?",
        icon: "suitcase",
        type: "single",
        input_type: "select",
        ref_table_name: "ocpe_work_availability",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OCPE21"]
    },
    ocpe_work_experience: {
        label: "Year of Work Experience",
        question: "How many years of work experience do you have?",
        icon: "suitcase",
        type: "single",
        input_type: "select",
        ref_table_name: "ocpe_work_experience",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OCPE21"]
    },
    ocpe_reference: {
        discard_filter: true,
        discard_popup: true,
        label: "How did you know about us?",
        question: "How did you know about us?",
        icon: "slack",
        list_title: null,
        discard_ref_from_default: true,
        type: "single",
        input_type: "select",
        ref_table_name: "ocpe_reference",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OCPE21"],
        // attr: `{val}`
    },

    uorm_looking_for: {
        label: "Looking For",
        question: "What are you looking for?",
        icon: "slack",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "uorm_looking_for",
        type: "multi",
        input_type: "select",
        ref_table_name: "jpastar_looking_for",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["UORM22"],
        attr: `{val}`
    },

    reference_1: {
        label: "Reference 1",
        question: "Reference 1",
        icon: "address-card",
        type: "single",
        input_type: "textarea",
        is_required: true,
        onCf: ["UORM22"]
    },
    reference_2: {
        label: "Reference 2",
        question: "Reference 2",
        icon: "address-card",
        type: "single",
        input_type: "textarea",
        is_required: true,
        onCf: ["UORM22"]
    },

    intelmm22_work_experience_year: {
        label: "Year Of Work Experience In Related Field",
        question: "How many years of relevant working experiences in Manufacturing/Engineering/Information Technology (IT)/Finance/Facilities/Site Services field?",
        icon: "slack",
        type: "single",
        input_type: "select",
        ref_table_name: "work_experience_year",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["INTELMM22"]
    },
    intelmm22_current_position: {
        label: "Current Position Title",
        question: "What is your current position title? (if applicable)",
        icon: "suitcase",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["INTELMM22"]
    },
    intelmm22_current_organization: {
        label: "Current Organization",
        question: "What is your current organization? (if applicable) ",
        icon: "building",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["INTELMM22"]
    },

    // CSO ----------
    cso_full_name: {
        discard_filter: true,
        question: "英文姓名  Name as per NRIC",
        label: "英文姓名  Name as per NRIC",
        icon: "address-card",
        is_required: true,
        input_type: "text",
        type: "single",
        onCf: ["CSOVCF22"]
    },
    cso_gender: {
        label: "性别 Gender",
        question: "性别 Gender",
        icon: "transgender-alt",
        type: "single",
        input_type: "select",
        ref_table_name: "cso_gender",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["CSOVCF22"]
    },
    cso_wechat: {
        discard_filter: true,
        question: "微信号 Wechat ID",
        label: "微信号 Wechat ID",
        icon: "mobile",
        is_required: true,
        input_type: "text",
        type: "single",
        onCf: ["CSOVCF22"]
    },
    cso_ic: {
        discard_filter: true,
        question: "身份证号码 NRIC Number  （*仅用于证书制作 for certificate use）",
        label: "身份证号码 NRIC Number",
        icon: "slack",
        is_required: true,
        input_type: "text",
        type: "single",
        onCf: ["CSOVCF22"]
    },
    cso_province: {
        discard_popup_on: (d) => {
            return d['cso_province'] == OTHER_CHINA;
        },
        question: "省份 Province",
        label: "省份 Province",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "cso_province",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["CSOVCF22"]
    },
    cso_province_other: {
        discard_filter: true,
        discard_popup_on: (d) => {
            return d['cso_province'] != OTHER_CHINA;
        },
        label: "省份 Province",
        question: "省份 Province (Other)",
        icon: "map-marker",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["CSOVCF22"]
    },
    cso_university: {
        discard_filter: true,
        question: "大学名称 University Name",
        label: "大学名称 University Name",
        icon: "graduation-cap",
        input_placeholder: "北京大学 Peking University",
        is_required: true,
        input_type: "text",
        type: "single",
        onCf: ["CSOVCF22"]
    },
    cso_major_field_study: {
        discard_filter: true,
        question: "就读学院与专业 Major field of study",
        label: "就读学院与专业 Major field of study",
        input_placeholder: "经济学院-金融学 School of Economics - Finance)",
        icon: "graduation-cap",
        is_required: true,
        input_type: "text",
        type: "single",
        onCf: ["CSOVCF22"]
    },
    cso_field_study: {
        discard_popup_on: (d) => {
            return d['cso_field_study'] == OTHER_CHINA;
        },
        question: "就读学科方向 Field of study",
        label: "就读学科方向 Field of study",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "cso_field_study",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["CSOVCF22"]
    },
    cso_field_study_other: {
        discard_filter: true,
        discard_popup_on: (d) => {
            return d['cso_field_study'] != OTHER_CHINA;
        },
        label: "就读学科方向 Field of study",
        question: "就读学科方向 Field of study (Other)",
        icon: "graduation-cap",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["CSOVCF22"]
    },
    cso_grade: {
        discard_popup_on: (d) => {
            return d['cso_grade'] == OTHER_CHINA;
        },
        question: "年级 Grade",
        label: "年级 Grade",
        icon: "align-center",
        type: "single",
        input_type: "select",
        ref_table_name: "cso_grade",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["CSOVCF22"]
    },
    cso_grade_other: {
        discard_filter: true,
        discard_popup_on: (d) => {
            return d['cso_grade'] != OTHER_CHINA;
        },
        label: "年级 Grade",
        question: "年级 Grade (Other)",
        icon: "align-center",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["CSOVCF22"]
    },

    // 
    cso_year_grad: {
        discard_popup_on: (d) => {
            return d['cso_year_grad'] == OTHER_CHINA;
        },
        question: "预计毕业年份 Year of Graduation",
        label: "预计毕业年份 Year of Graduation",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "cso_year_grad",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["CSOVCF22"]
    },
    cso_year_grad_other: {
        discard_filter: true,
        discard_popup_on: (d) => {
            return d['cso_year_grad'] != OTHER_CHINA;
        },
        label: "预计毕业年份 Year of Graduation",
        question: "预计毕业年份 Year of Graduation (Other)",
        icon: "graduation-cap",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["CSOVCF22"]
    },

    // 有意参与的活动 Interested activity -- KIV
    // 有意参与的活动 Interested activity -- KIV
    // 有意参与的活动 Interested activity -- KIV
    //  -- KIV
    cso_activity: {
        label: "有意参与的活动 Interested activity",
        question: "有意参与的活动 Interested activity",
        icon: "list-alt",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "cso_activity",
        type: "multi",
        input_type: "select",
        ref_table_name: "cso_activity",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["CSOVCF22"],
        attr: `{val}`
    },
    //
    cso_field_to_work: {
        discard_popup_on: (d) => {
            return d['cso_field_to_work'] == OTHER_CHINA;
        },
        question: "您未来有意就业的领域是 The field you want to work in in the future",
        label: "您未来有意就业的领域是 The field you want to work in in the future",
        icon: "suitcase",
        type: "single",
        input_type: "select",
        ref_table_name: "cso_field_to_work",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["CSOVCF22"]
    },
    cso_field_to_work_other: {
        discard_filter: true,
        discard_popup_on: (d) => {
            return d['cso_field_to_work'] != OTHER_CHINA;
        },
        label: "您未来有意就业的领域是 The field you want to work in in the future",
        question: "您未来有意就业的领域是 The field you want to work in in the future (Other)",
        icon: "suitcase",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["CSOVCF22"]
    },

    cso_plan_after_grad: {
        label: "您希望毕业后的去向是 Where do you want to go after graduation",
        question: "您希望毕业后的去向是 Where do you want to go after graduation",
        icon: "paper-plane",
        type: "single",
        input_type: "select",
        ref_table_name: "cso_plan_after_grad",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["CSOVCF22"]
    },

    cso_employ_intention: {
        label: "未来的就业意向 Future employment intentions",
        question: "未来的就业意向 Future employment intentions",
        icon: "suitcase",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "cso_employ_intention",
        type: "multi",
        input_type: "select",
        ref_table_name: "cso_employ_intention",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["CSOVCF22"],
        attr: `{val}`
    },

    cso_salary: {
        label: "您预期的月薪是 Your expected monthly salary",
        question: "您预期的月薪是 Your expected monthly salary",
        icon: "money",
        type: "single",
        input_type: "select",
        ref_table_name: "cso_salary",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["CSOVCF22"]
    },

    cso_career_priority: {
        label: "在择业时，您最看重的是 When choosing a career, what do you value most",
        question: "在择业时，您最看重的是 When choosing a career, what do you value most",
        icon: "suitcase",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "cso_career_priority",
        type: "multi",
        input_type: "select",
        ref_table_name: "cso_career_priority",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["CSOVCF22"],
        attr: `{val}`
    },

    airbus_looking_for: {
        label: "Looking For",
        question: "What are you looking for?",
        icon: "slack",
        type: "single",
        input_type: "select",
        ref_table_name: "airbus_looking_for",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["AIRBUS22"]
    },
    airbus_willing_in_sepang: {
        label: "Willing To Work in Sepang, KLIA area ?",
        question: "Are you willing to work in Sepang, KLIA area?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "yes_no",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["AIRBUS22"]
    },
    airbus_core_competency: {
        label: "Core Competencies",
        question: "What are your core competencies?",
        icon: "star",
        type: "single",
        input_type: "text",
        is_required: true,
        onCf: ["AIRBUS22"]
    },
    airbus_salary: {
        label: "Expected/Current Salary",
        question: "What is your expected and current salary?",
        icon: "money",
        type: "single",
        input_type: "text",
        is_required: true,
        onCf: ["AIRBUS22"]
    },
    airbus_willing_on_shift: {
        label: "Willing To Work On Shifts?",
        question: "Are you able to work on shifts (weekends, night shifts, public holidays)?",
        icon: "clock-o",
        type: "single",
        input_type: "select",
        ref_table_name: "yes_no",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["AIRBUS22"]
    },
    airbus_experience: {
        label: "Working Experiences",
        question: "What working experiences do you have?",
        icon: "suitcase",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "airbus_experience",
        type: "multi",
        input_type: "select",
        ref_table_name: "airbus_experience",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["AIRBUS22"],
        attr: `{val}`
    },
    airbus_experience_other: {
        label: "Other Working Experiences",
        question: "Working Experiences (Other please specifiy here)",
        icon: "suitcase",
        type: "single",
        input_type: "textarea",
        is_required: false,
        onCf: ["AIRBUS22"]
    },




    // TCREP
    // TCREP
    gender_mf: {
        label: "Gender",
        question: "Gender",
        icon: "transgender-alt",
        type: "single",
        input_type: "select",
        ref_table_name: "gender_mf",
        ref_order_by: "ID asc",
        is_required: true,
        only_in_edit_mode: ["MARAVCF22"],
        onCf: ["TCREP22", "MYHEARTCAFE2022", "MARAVCF22", "D2W2K22", "D2WOCT22", "VCFEE22", "WCC22"]
    },
    nationality_country: {
        label: "Nationality",
        question: "Nationality",
        icon: "map-marker",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "nationality_country",
        ref_order_by: "ID asc",
        is_required: true,
        only_in_edit_mode: ["MARAVCF22"],
        onCf: ["TCREP22", "MARAVCF22",]
    },
    tcrep_ic: {
        discard_filter: true,
        question: "IC Number",
        question_sublabel: "Do not put dash (-)",
        label: "IC Number",
        icon: "slack",
        is_required: true,
        input_type: "number",
        type: "single",
        onCf: ["TCREP22", "MYHEARTCAFE2022"]
    },
    tcrep_country_residence: {
        question: "Country of Residence Abroad",
        label: "Country of Residence Abroad",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "nationality_country",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TCREP22", "MYHEARTCAFE2022"]
    },
    mara_country_study: {
        question: "Country of Study",
        label: "Country of Study",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "nationality_country",
        ref_order_by: "ID asc",
        is_required: true,
        only_in_edit_mode: ["MARAVCF22"],
        onCf: ["MARAVCF22"]
    },
    linkedin: {
        discard_filter: true,
        question: "LinkedIn Profile",
        question_sublabel: "https://www.linkedin.com/in/xxxxxxx",
        label: "LinkedIn Profile",
        icon: "slack",
        is_required: true,
        input_type: "text",
        type: "single",
        onCf: ["TCREP22", "MYHEARTCAFE2022"]
    },
    home_address: {
        discard_filter: true,
        question: "Home Address",
        label: "Home Address",
        icon: "map-marker",
        is_required: true,
        input_type: "textarea",
        type: "single",
        onCf: ["D2W2K22", "D2WOCT22", "VCFEE22"]
    },
    address: {
        discard_filter: true,
        question: "Current Address",
        label: "Current Address",
        icon: "map-marker",
        is_required: true,
        input_type: "textarea",
        type: "single",
        onCf: ["TCREP22"]
    },
    tcrep_employ_status: {
        question: "Current Employment Status",
        label: "Current Employment Status",
        icon: "info",
        type: "single",
        input_type: "select",
        ref_table_name: "tcrep_employ_status",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TCREP22", "MYHEARTCAFE2022"]
    },
    // tcrep_employ_role: {
    //     question: "Current Employment Role",
    //     label: "Current Employment Role",
    //     icon: "suitcase",
    //     type: "single",
    //     input_type: "select",
    //     ref_table_name: "tcrep_employ_role",
    //     ref_order_by: "ID asc",
    //     is_required: true,
    //     onCf: ["TCREP22", "MYHEARTCAFE2022"]
    // },
    tcrep_employ_role: {
        discard_popup_on: (d) => {
            return d['tcrep_employ_role'] == OTHER_PLEASE_SPECIFY;
        },
        question: "Current Employment Role",
        label: "Current Employment Role",
        icon: "suitcase",
        type: "single",
        input_type: "select",
        ref_table_name: "tcrep_employ_role",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TCREP22", "MYHEARTCAFE2022"]
    },
    tcrep_employ_role_other: {
        discard_filter: true,
        discard_popup_on: (d) => {
            return d['tcrep_employ_role'] != OTHER_PLEASE_SPECIFY;
        },
        question: "Current Employment Role (Other)",
        label: "Current Employment Role",
        icon: "suitcase",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["MYHEARTCAFE2022"]
    },
    current_company: {
        discard_filter: true,
        question: "Current Company Name",
        question_sublabel: "Please type NA if not available",
        label: "Current Company Name",
        icon: "building",
        is_required: true,
        input_type: "text",
        type: "single",
        onCf: ["TCREP22", "MYHEARTCAFE2022"]
    },
    myheart_university: {
        discard_filter: true,
        question: "University",
        label: "University",
        icon: "graduation-cap",
        is_required: true,
        input_type: "text",
        type: "single",
        only_in_edit_mode: ["MARAVCF22"],
        onCf: ["MYHEARTCAFE2022", "MARAVCF22"]
    },
    tcrep_employ_industry: {
        discard_popup_on: (d) => {
            return d['tcrep_employ_industry'] == OTHER_PLEASE_SPECIFY;
        },
        question: "Current Employment Industry",
        label: "Current Employment Industry",
        icon: "slack",
        type: "single",
        input_type: "select",
        ref_table_name: "tcrep_employ_industry",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TCREP22", "MYHEARTCAFE2022"]
    },
    tcrep_employ_industry_other: {
        discard_filter: true,
        discard_popup_on: (d) => {
            return d['tcrep_employ_industry'] != OTHER_PLEASE_SPECIFY;
        },
        question: "Current Employment Industry (Other)",
        label: "Current Employment Industry",
        icon: "slack",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["MYHEARTCAFE2022"]
    },
    tcrep_qualification: {
        discard_popup_on: (d) => {
            return d['tcrep_qualification'] == OTHER_PLEASE_SPECIFY;
        },
        label: "Highest Academic Qualification",
        question: "Highest Academic Qualification",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "tcrep_qualification",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TCREP22", "MYHEARTCAFE2022"]
    },
    tcrep_qualification_other: {
        discard_filter: true,
        discard_popup_on: (d) => {
            return d['tcrep_qualification'] != OTHER_PLEASE_SPECIFY;
        },
        label: "Highest Academic Qualification",
        question: "Highest Academic Qualification (Other)",
        icon: "graduation-cap",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["TCREP22", "MYHEARTCAFE2022"]
    },
    tcrep_field_study: {
        question: "Field of Study",
        label: "Field of Study",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "tcrep_field_study",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TCREP22", "MYHEARTCAFE2022"]
    },
    mara_field_study: {
        question: "Field of Study",
        label: "Field of Study",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "tcrep_field_study",
        ref_order_by: "ID asc",
        is_required: true,
        only_in_edit_mode: ["MARAVCF22"],
        onCf: ["MARAVCF22"]
    },
    tcrep_received_job_offer: {
        question: "Have you received an employment offer from a company based in Malaysia?",
        label: "Have you received an employment offer from a company based in Malaysia?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "yes_no",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TCREP22", "MYHEARTCAFE2022"]
    },
    tcrep_interested_opportunity_info: {
        discard_filter: true,
        question: "What kind of information would you be interested in knowing about employment opportunities?",
        question_sublabel: "Optional",
        label: "What kind of information would you be interested in knowing about employment opportunities?",
        icon: "info",
        is_required: false,
        input_type: "text",
        type: "single",
        onCf: ["TCREP22", "MYHEARTCAFE2022"]
    },
    tcrep_explore_diff: {
        question: "Would you be open to exploring employment opportunities in a different industry?",
        label: "Would you be open to exploring employment opportunities in a different industry?",
        icon: "suitcase",
        type: "single",
        input_type: "select",
        ref_table_name: "yes_no",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TCREP22", "MYHEARTCAFE2022"]
    },
    tcrep_preferred_job_location: {
        question: "Please state your preferred location for employment in Malaysia",
        label: "Please state your preferred location for employment in Malaysia",
        icon: "suitcase",
        type: "single",
        input_type: "select",
        ref_table_name: "tcrep_preferred_job_location",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TCREP22", "MYHEARTCAFE2022"]
    },
    tcrep_child_edu: {
        question: "Are you interested in knowing more about the education needs for your children",
        label: "Are you interested in knowing more about the education needs for your children",
        icon: "child",
        type: "single",
        input_type: "select",
        ref_table_name: "yes_no_na",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TCREP22"]
    },
    tcrep_child_current_edu: {
        question: "If yes, please state your children’s current level of education",
        question_sublabel: "If no or n/a, please select 'Not Applicable'",
        label: "If yes, please state your children’s current level of education",
        icon: "child",
        type: "single",
        input_type: "select",
        ref_table_name: "tcrep_child_current_edu",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["TCREP22"]
    },
    tcrep_question_for_company: {
        discard_filter: true,
        question: "Drop a question you would like to ask our participating companies?",
        label: "Drop a question you would like to ask our participating companies?",
        icon: "question-circle",
        is_required: true,
        input_type: "textarea",
        type: "single",
        onCf: ["TCREP22"]
    },

    d2w2_looking_for: {
        label: "Looking for",
        question: "Are you looking for a job or internship?",
        icon: "map-suitcase",
        type: "single",
        input_type: "select",
        ref_table_name: "d2w2_looking_for",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["D2WOCT22", "VCFEE22"]
    },
    d2w2_current_resident: {
        discard_popup_on: (d) => {
            return d['current_resident'] == OTHER_PLEASE_SPECIFY;
        },
        label: "Current Resident",
        question: "Current Resident",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "d2w2_state",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["D2W2K22", "D2WOCT22", "VCFEE22"]
    },
    d2w2_current_resident_other: {
        discard_popup_on: (d) => {
            return d['current_resident'] != OTHER_PLEASE_SPECIFY;
        },
        label: "Current Resident",
        question: "Current Resident (Other)",
        icon: "map-marker",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["D2W2K22", "D2WOCT22", "VCFEE22"]
    },

    d2w2_university: {
        discard_popup_on: (d) => {
            return [OTHER_UNI_OVERSEA, OTHER_UNI_LOCAL].indexOf(d['d2w2_university']) >= 0;
        },
        label: "University/Institution",
        question: "University/Institution",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "d2w2_university",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["D2W2K22", "D2WOCT22", "VCFEE22"]
    },
    d2w2_university_other: {
        discard_popup_on: (d) => {
            return [OTHER_UNI_OVERSEA, OTHER_UNI_LOCAL].indexOf(d['d2w2_university']) <= -1;
        },
        label: "University/Institution",
        question: "University/Institution (Other)",
        icon: "graduation-cap",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["D2W2K22", "D2WOCT22", "VCFEE22"]
    },
    d2w2_year_of_study: {
        label: "Year Of Study",
        question: "Year Of Study",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "d2w2_year_of_study",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["D2W2K22", "D2WOCT22", "VCFEE22"]
    },
    d2w2_level_of_study: {
        label: "Level Of Study",
        question: "Level Of Study",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "d2w2_level_of_study",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["D2W2K22", "D2WOCT22", "VCFEE22"]
    },
    d2w2_field_of_study: {
        label: "Field Of Study",
        question: "Field Of Study",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "d2w2_field_of_study",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["D2W2K22", "D2WOCT22", "VCFEE22"]
    },
    d2w2_intern_start_month:
    {
        label: "When Your Internship Started",
        question: "When Your Internship Started",
        icon: "calendar",
        type: "single",
        input_type: "select",
        ref_table_name: "month",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["D2W2K22", "D2WOCT22", "VCFEE22"]
    },
    d2w2_intern_start_year:
    {
        children_of: "d2w2_intern_start_month",
        icon: "calendar",
        type: "single",
        input_type: "select",
        ref_table_name: "year",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["D2W2K22", "D2WOCT22", "VCFEE22"]
    },
    d2w2_intern_duration:
    {
        label: "Duration for Your Internship",
        question: "Duration for Your Internship",
        icon: "calendar",
        type: "single",
        input_type: "select",
        ref_table_name: "d2w2_intern_duration",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["D2W2K22", "D2WOCT22", "VCFEE22"]
    },
    d2w2_reference: {
        label: "Interested Job Location",
        question: "Where would you like to work in Malaysia?",
        icon: "suitcase",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "interested_job_location_my_sg",
        type: "multi",
        input_type: "select",
        ref_table_name: "interested_job_location_my_sg",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OCPE21"],
        attr: `{val}`
    },

    oejf22_grad_month:
    {
        label: "Graduation Date",
        question: "When is your graduation date?",
        icon: "calendar",
        type: "single",
        input_type: "select",
        ref_table_name: "oejf22_grad_month",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OEJF22"]
    },
    oejf22_grad_year:
    {
        children_of: "oejf22_grad_month",
        icon: "calendar",
        type: "single",
        input_type: "select",
        ref_table_name: "oejf22_grad_year",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OEJF22"]
    },
    oejf22_work_availability_month:
    {
        label: "Graduation Date",
        question: "When will you be available to work?",
        icon: "suitcase",
        type: "single",
        input_type: "select",
        ref_table_name: "oejf22_grad_month",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OEJF22"]
    },
    oejf22_work_availability_year:
    {
        children_of: "oejf22_work_availability_month",
        icon: "suitcase",
        type: "single",
        input_type: "select",
        ref_table_name: "oejf22_work_availability_year",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OEJF22"]
    },


    wcc22_emp_status: {
        question: "Employment Status",
        label: "Employment Status",
        icon: "info",
        type: "single",
        input_type: "select",
        ref_table_name: "wcc_employ_status",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["WCC22"]
    },
    wcc22_location: {
        discard_popup_on: (d) => {
            return d['discard_popup_on'] == OTHER_PLEASE_SPECIFY;
        },
        label: "Geographical Location",
        question: "Geographical Location",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "d2w2_state",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["WCC22"]
    },
    wcc22_country: {
        discard_popup_on: (d) => {
            return d['wcc22_country'] != OTHER_PLEASE_SPECIFY;
        },
        label: "Country",
        question: "If you selected others, please select country",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "country",
        ref_order_by: "ID asc",
        is_required: false,
        onCf: ["WCC22"]
    },
    wcc22_qualification: {
        discard_popup_on: (d) => {
            return d['wcc22_qualification'] == OTHER_PLEASE_SPECIFY;
        },
        label: "Academic Qualification",
        question: "Academic Qualification",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "wcc22_qualification",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["WCC22"]
    },
    wcc22_qualification_other: {
        discard_popup_on: (d) => {
            return d['wcc22_qualification'] != OTHER_PLEASE_SPECIFY;
        },
        label: "Academic Qualification",
        question: "Academic Qualification (Other)",
        icon: "graduation-cap",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["WCC22"]
    },
    wcc22_field_study: {
        label: "Main Field of Study",
        question: "Main Field of Study",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "wcc22_field_study",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["WCC22"]
    },
    wcc22_work_experience: {
        label: "Total Work Experience",
        question: "Total Work Experience",
        icon: "suitcase",
        type: "single",
        input_type: "number",
        is_required: true,
        onCf: ["WCC22"]
    },
    wcc22_current_role: {
        label: "Current Employment Role",
        question: "Current Employment Role",
        icon: "suitcase",
        type: "single",
        input_type: "select",
        ref_table_name: "wcc22_current_role",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["WCC22"]
    },
    wcc22_current_industry: {
        label: "Current Employment Industry",
        question: "Current Employment Industry",
        icon: "suitcase",
        type: "single",
        input_type: "select",
        ref_table_name: "wcc22_current_industry",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["WCC22"]
    },
    wcc22_preferred_emp: {
        label: "Preferred Type of Employment",
        question: "Preferred Type of Employment",
        icon: "suitcase",
        type: "single",
        input_type: "select",
        ref_table_name: "wcc22_preferred_emp",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["WCC22"]
    },
    wcc22_job_level: {
        label: "Preferred Job Level",
        question: "Preferred Job Level",
        icon: "suitcase",
        type: "single",
        input_type: "select",
        ref_table_name: "wcc22_job_level",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["WCC22"]
    },
    msaj_prefecture: {
        label: "Which part of Japan are you residing?",
        question: "Which part of Japan are you residing?",
        icon: "map-markder",
        type: "single",
        input_type: "select",
        ref_table_name: "msaj_prefecture",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["MSAJ22"]
    },
    vcfee_first_job_improvement: {
        label: "Area(s) of Improvement You Need",
        question: "What are the area(s) of improvement do you think you need to land your first job? (Select top 5)",
        icon: "suitcase",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "vcfee_first_job_improvement",
        type: "multi",
        input_type: "select",
        ref_table_name: "vcfee_first_job_improvement",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["VCFEE22"],
        attr: `{val}`
    },
    vcfee_nationality: {
        label: "Nationality",
        question: "Nationality",
        icon: "map-marker",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "vcfee_nationality",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["VCFEE22"]
    },
    vcfee_preferred_job_hometown: {

        //     8. 
        // 1. Only one answer
        // 2. Drop-down menu
        // 3. Answer choice
        //     1. Hometown
        //     2. Outside Hometown
        label: "Preferred Job Location",
        question: "Do you prefer working in your hometown or outside of your hometown?",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "vcfee_preferred_job_hometown",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["VCFEE22"]
    },
    vcfee_preferred_job_location: {
        discard_popup_on: (d) => {
            return d['vcfee_preferred_job_location'] == OTHER_PLEASE_SPECIFY;
        },
        label: "Preferred Job State",
        question: "Which state company do you prefer to work with?",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "d2w2_state",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["VCFEE22"]
    },
    vcfee_preferred_job_location_other: {
        discard_popup_on: (d) => {
            return d['vcfee_preferred_job_location'] != OTHER_PLEASE_SPECIFY;
        },
        label: "Preferred Job State",
        question: "Which state company do you prefer to work with? (Other)",
        icon: "map-marker",
        type: "single",
        input_type: "text",
        is_required: false,
        onCf: ["VCFEE22"]
    },
    vcfee_job_scope: {
        label: "Do you prefer working based on the scope of your study or not?",
        question: "Do you prefer working based on the scope of your study or not?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "yes_no",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["VCFEE22"]
    },

    vcfee_employ_status: {
        question: "What is your employment status",
        label: "Employment Status",
        icon: "info",
        type: "single",
        input_type: "select",
        ref_table_name: "vcfee_employ_status",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["VCFEE22"]
    },

    mara_grad_year:
    {
        question: "Year of Graduation",
        label: "Year of Graduation",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "mara_grad_year",
        ref_order_by: "ID asc",
        is_required: true,
        only_in_edit_mode: ["MARAVCF22"],
        onCf: ["MARAVCF22"]
    },
    mara_year_study:
    {
        discard_popup_on: (d) => {
            return d['mara_year_study'] == OTHER_PLEASE_SPECIFY;
        },
        question: "Year of Study",
        label: "Year of Study",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "mara_year_study",
        ref_order_by: "ID asc",
        is_required: true,
        only_in_edit_mode: ["MARAVCF22"],
        onCf: ["MARAVCF22"]
    },
    mara_year_study_other: {
        discard_popup_on: (d) => {
            return d['mara_year_study'] != OTHER_PLEASE_SPECIFY;
        },
        question: "Year of Study (Other)",
        label: "Year of Study",
        icon: "graduation-cap",
        type: "single",
        input_type: "text",
        is_required: false,
        only_in_edit_mode: ["MARAVCF22"],
        onCf: ["MARAVCF22"]
    },
    mara_level_study:
    {
        discard_popup_on: (d) => {
            return d['mara_level_study'] == OTHER_PLEASE_SPECIFY;
        },
        question: "Level of Study",
        label: "Level of Study",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "mara_level_study",
        ref_order_by: "ID asc",
        is_required: true,
        only_in_edit_mode: ["MARAVCF22"],
        onCf: ["MARAVCF22"]
    },
    mara_level_study_other: {
        discard_popup_on: (d) => {
            return d['mara_level_study'] != OTHER_PLEASE_SPECIFY;
        },
        question: "Level of Study (Other)",
        label: "Level of Study",
        icon: "graduation-cap",
        type: "single",
        input_type: "text",
        is_required: false,
        only_in_edit_mode: ["MARAVCF22"],
        onCf: ["MARAVCF22"]
    },
}

const DefaultCustomOrder = [
    "first_name",
    "graduation_month",
    "graduation_year",
    "looking_for_position",
    "country_study",
    "university",
    "student_id",
    "qualification",
    "field_study_main",
    "field_study_secondary",
    "grade",
    "phone_number",
    "working_availability_month",
    "working_availability_year",
    "interested_role",
    "where_in_malaysia",
    "interested_job_location",
    "skill",
    "extracurricular",
];

const CustomOrder = {
    MARAVCF22: [
        "first_name",
        "gender_mf",
        "nationality_country",
        "mara_grad_year",
        "mara_country_study",
        "myheart_university",
        "mara_year_study",
        "mara_year_study_other",
        "mara_level_study",
        "mara_level_study_other",
        "mara_field_study",
    ],
    MYHEARTCAFE2022: [
        "full_name",
        "current_company",
        "tcrep_received_job_offer",
        "tcrep_interested_opportunity_info",
        "tcrep_explore_diff",
        "tcrep_preferred_job_location",
        "linkedin",

        "gender_mf",
        "nationality_country",
        "tcrep_ic",
        "tcrep_country_residence",
        "tcrep_qualification",
        "tcrep_qualification_other",
        "tcrep_field_study",
        "myheart_university",
        "tcrep_employ_status",
        "tcrep_employ_role",
        "tcrep_employ_role_other",
        "tcrep_employ_industry",
        "tcrep_employ_industry_other",
    ],
    VCFEE22: [
        "full_name",
        "ic_number",
        "gender_mf",
        "race",
        "vcfee_nationality",
        "phone_number",
        "home_address",
        "d2w2_current_resident",
        "d2w2_current_resident_other",
        "d2w2_looking_for",
        "d2w2_university",
        "d2w2_year_of_study",
        "d2w2_level_of_study",
        "d2w2_field_of_study",
        "graduation_month",
        "graduation_year",
        "vcfee_employ_status",
        "d2w21_reference",
        "vcfee_preferred_job_hometown",
        "vcfee_preferred_job_location",
        "vcfee_preferred_job_location_other",
        "vcfee_job_scope",
        "vcfee_first_job_improvement",
    ],
    MSAJ22: [
        "first_name",
        "graduation_month",
        "graduation_year",
        "looking_for_position",
        // "country_study",
        "phone_number",
        "msaj_prefecture",
        "university",
        "student_id",
        "qualification",
        "field_study_main",
        "field_study_secondary",
        "grade",
        "working_availability_month",
        "working_availability_year",
        "interested_role",
        "where_in_malaysia",
        "interested_job_location",
        "skill",
        "extracurricular",
    ],
    WCC22: [
        "first_name",
        "gender_mf",
        "national_id_no",
        "age_no",
        "wcc22_emp_status",
        "wcc22_location",
        "wcc22_country",
        "wcc22_qualification",
        "wcc22_qualification_other",
        "wcc22_field_study", // need import data
        "wcc_graduate_year",
        "wcc22_work_experience",
        "wcc22_current_role", // need import data
        "wcc22_current_industry",

        "wcc22_preferred_emp",
        "wcc22_job_level",
        "working_availability_month",
        "working_availability_year",
        // "wcc_iam",
        // "wcc_iam_other",
        // "wcc_location",
        // "qualification",
        // "wcc_field_study",
        // "wcc_work_experience",
    ],
    TARUCAUG22: [
        "first_name",
        "graduation_month",
        "graduation_year",
        "looking_for_position",
        "country_study",
        "university",
        "qualification",
        "field_study_main",
        "grade",
        "phone_number",
        "working_availability_month",
        "working_availability_year",
        "interested_role",
        "where_in_malaysia",
        "interested_job_location",
        "skill",
        "extracurricular",
    ],
    OEJF22: [
        "first_name",
        "personal_email",
        "current_position",
        "oejf22_grad_month",
        "oejf22_grad_year",
        "looking_for_position",
        "country_study",
        "university",
        "oejf21_qualification",
        "oejf21_field_study",
        "phone_number",
        "age",
        "gender",
        "race",
        "oejf22_work_availability_month",
        "oejf22_work_availability_year",
        "oejf21_interested_job",
        "where_in_malaysia_select",
        "oejf21_where_work",
        "oejf21_where_work_oversea",
        "oejf21_years_working",
        "oejf21_industry",
        "oejf21_reference"
    ],
    D2WOCT22: [
        "full_name",
        "ic_number",
        "gender_mf",
        "race",
        "nationality_select",
        "nationality_select_other",
        "home_address",
        "d2w2_looking_for",
        "d2w2_current_resident",
        "d2w2_current_resident_other",
        "d2w2_university",
        "d2w2_university_other",
        "d2w2_year_of_study",
        "d2w2_level_of_study",
        "d2w2_field_of_study",
        "d2w2_intern_start_month",
        "d2w2_intern_start_year",
        "d2w2_intern_duration",
        "graduation_month",
        "d2w21_reference",
    ],
    D2W2K22: [
        "full_name",
        "ic_number",
        "gender_mf",
        "race",
        "home_address",
        "d2w2_current_resident",
        "d2w2_current_resident_other",
        "d2w2_university",
        "d2w2_university_other",
        "d2w2_year_of_study",
        "d2w2_level_of_study",
        "d2w2_field_of_study",
        "d2w2_intern_start_month",
        "d2w2_intern_start_year",
        "d2w2_intern_duration",
        "graduation_month",
        "d2w21_reference",
    ],
    TCREP22: [
        "full_name",
        "gender_mf",
        "nationality_country",
        "tcrep_ic",
        // email
        // contact no
        "tcrep_country_residence",
        // resume
        "linkedin",
        "address",
        "tcrep_employ_status",
        "tcrep_employ_role",
        "current_company",
        "tcrep_employ_industry",
        "tcrep_qualification",
        "tcrep_qualification_other",
        "tcrep_field_study",
        "tcrep_received_job_offer",
        "tcrep_interested_opportunity_info",
        "tcrep_explore_diff",
        "tcrep_preferred_job_location",
        "tcrep_child_edu",
        "tcrep_child_current_edu",
        "tcrep_question_for_company",
    ],
    TAYLORS22: [
        "student_id",
        "first_name",
        "graduation_month",
        "looking_for_position",
        "country_study",
        "qualification",
        "taylors21_programme",
        "taylors21_programme_other",
        "field_study_main",
        "field_study_secondary",
        "grade",
        "phone_number",
        "working_availability_month",
        "interested_role",
        "where_in_malaysia",
        "interested_job_location",
        "skill",
        "extracurricular",
    ],
    AIRBUS22: [
        "first_name",
        "graduation_month",
        "airbus_looking_for",
        "qualification",
        "field_study_main",
        "working_availability_month",
        "airbus_willing_in_sepang",
        "airbus_core_competency",
        "airbus_salary",
        "airbus_willing_on_shift",
        "airbus_experience",
        "airbus_experience_other",
    ],
    CSOVCF22: [
        "first_name",
        "cso_full_name",
        "cso_wechat",
        "cso_gender",
        "cso_ic",
        "cso_province",
        "cso_province_other",
        "cso_university",
        "cso_major_field_study",
        "cso_field_study",
        "cso_field_study_other",
        "cso_grade",
        "cso_grade_other",
        "cso_year_grad",
        "cso_year_grad_other",
        "cso_activity",
        "cso_field_to_work",
        "cso_field_to_work_other",
        "cso_plan_after_grad",
        "cso_employ_intention",
        "cso_salary",
        "cso_career_priority",

    ],
    INTELMM22: [
        "first_name",
        "looking_for_position",
        "qualification",
        "local_or_oversea_location",
        "university",
        "local_or_oversea_study",
        "graduation_month",
        "field_study_main",
        "field_study_secondary",
        "grade",
        "working_availability_month",
        "intelmm22_work_experience_year",
        "intelmm22_current_position",
        "intelmm22_current_organization",
        "gender",
        "intel_is_intel_employee",
        "intel_is_accept_offer",
        "intel_reference",
    ],
    UORM22: [
        "first_name",
        "graduation_month",
        "uorm_looking_for",
        "country_study",
        "university",
        "student_id",
        "qualification",
        "field_study_main",
        "field_study_secondary",
        "grade",
        "phone_number",
        "working_availability_month",
        "interested_role",
        "where_in_malaysia",
        "interested_job_location",
        "skill",
        "extracurricular",
        "reference_1",
        "reference_2"
    ],
    OCPE21: [
        "first_name",
        "ocpe_graduation",
        "looking_for_position",
        "country_study",
        "university",
        "oejf21_qualification",
        "oejf21_qualification_other",
        "age_group",
        "gender",
        "race",
        "ocpe_work_availability",
        "where_in_malaysia_select",
        "interested_job_location_my_sg",
        "ocpe_work_experience",
        "oejf21_industry",
        "current_position",
        "ocpe_reference",
    ],
    JPASTAR21: [
        "first_name",
        "graduation_month",
        "jpastar_status",
        "jpastar_looking_for",
        "country_study",
        "university",
        "qualification",
        "field_study_main",
        "field_study_secondary",
        "grade",
        "phone_number",
        "working_availability_month",
        "interested_role",
        "where_in_malaysia",
        "interested_job_location",
        "skill",
        "extracurricular",
    ],
    WCC21: [
        "first_name",
        "age_group",
        "wcc_iam",
        "wcc_iam_other",
        "wcc_location",
        "wcc_graduate_year",
        "qualification",
        "wcc_field_study",
        "wcc_work_experience",
        "wcc_looking_for",
        "wcc_job_level",
        "working_availability_month",
    ],
    TAYLORS21: [
        "student_id",
        "first_name",
        "graduation_month",
        "looking_for_position",
        "country_study",
        "qualification",
        "taylors21_programme",
        "taylors21_programme_other",
        "field_study_main",
        "field_study_secondary",
        "grade",
        "phone_number",
        "working_availability_month",
        "interested_role",
        "where_in_malaysia",
        "interested_job_location",
        "skill",
        "extracurricular",
    ],
    UTMIV21: [
        "first_name",
        "id_utm",
        "full_name",
        "race",
        "nationality",
        "level_of_study_utmiv21",
        "program_utmiv21",
        "faculty_utmiv21",
    ],
    INTELDDSEPT21: [
        "first_name",
        "looking_for_position",
        "qualification",
        "local_or_oversea_study",
        "university",
        "local_or_oversea_location",
        "graduation_month",
        "field_study_main",
        "field_study_secondary",
        "grade",
        "working_availability_month",
        "work_experience_year",
        "gender",
        "intel_is_intel_employee",
        "has_attended_before",
        "intel_reference",
    ],
    TARUCNOV21: [
        "first_name",
        "student_id",
        "graduation_month",
        "tarucjul21_purpose",
        "internship_date",
        "country_study_select",
        "university",
        "tarucjul21_current_year",
        "tarucjul21_current_semester",
        "tarucjul21_programme",
        "tarucjul21_faculty",
        "tarucjul21_campus",
        "qualification",
        "field_study_main",
        "grade",
        // "phone_number",
        "interested_role",
        "where_in_malaysia_select",
        "tarucjul21_interested_intern_location",
        "skill",
        "extracurricular"
    ],
    TARUCJUL21: [
        "first_name",
        "student_id",
        "graduation_month",
        "tarucjul21_purpose",
        "internship_date",
        "country_study_select",
        "university",
        "tarucjul21_current_year",
        "tarucjul21_current_semester",
        "tarucjul21_programme",
        "tarucjul21_faculty",
        "tarucjul21_campus",
        "qualification",
        "field_study_main",
        "grade",
        // "phone_number",
        "interested_role",
        "where_in_malaysia_select",
        "tarucjul21_interested_intern_location",
        "skill",
        "extracurricular"
    ],
    OEJF21: [
        "first_name",
        "graduation_month",
        "looking_for_position",
        "country_study",
        "university",
        // "qualification",
        "oejf21_qualification",
        "oejf21_qualification_other",
        "oejf21_field_study",
        "grade",
        "phone_number",
        "age",
        "gender",
        "race",
        "working_availability_month",
        "oejf21_interested_job",
        "where_in_malaysia_select",
        "oejf21_where_work",
        "oejf21_years_working",
        "oejf21_industry",
        "skill",
        "oejf21_reference"
    ],
    SUNWAYGRD21: [
        "first_name",
        "graduation_month",
        "sunway_purpose",
        "sunway_faculty",
        "sunwaygrad21_program",
        "qualification",
        "resident_malaysia",
        "resident_malaysia_other",
        "grade",
        "phone_number",
        "working_availability_month",
        "interested_role",
        "interested_job_location",
        "skill",
    ],
    SUNWAYGETHIRED21: [
        "first_name",
        "sunway_student_or_alumni",
        "student_matrix_id",
        "sunway_campus",
        "graduation_month",
        "sunway_purpose",
        "sunway_faculty",
        "sunwaygrad21_program",
        "qualification",
        "resident_malaysia",
        "resident_malaysia_other",
        "grade",
        "phone_number",
        "working_availability_month",
        "interested_role",
        "interested_job_location",
        "skill",
    ],
    D2WRL21: [
        "first_name",
        "full_name",
        "phone_number",
        "working_availability_month",
        "d2w21_resident",
        "d2w21_resident_other",
        "graduation_month",
        "looking_for_position",
        "d2w21_university",
        "d2w21_university_other",
        "d2w21_year_study",
        "d2w21_field_study",
        "d2w21_field_study_other",
        "d2w21_qualification",
        "d2w21_qualification_other",
        // "d2w21_webinar",
        "interested_role",
        "d2w21_interested_job_location",
        "skill",
        "extracurricular",
        "d2w21_reference",
    ],
    D2W21: [
        "first_name",
        "full_name",
        "phone_number",
        "working_availability_month",
        "d2w21_resident",
        "d2w21_resident_other",
        "graduation_month",
        "looking_for_position",
        "d2w21_university",
        "d2w21_university_other",
        "d2w21_year_study",
        "d2w21_field_study",
        "d2w21_field_study_other",
        "d2w21_qualification",
        "d2w21_qualification_other",
        "d2w21_webinar",
        "interested_role",
        "d2w21_interested_job_location",
        "skill",
        "extracurricular",
        "d2w21_reference",
    ],
};

const CustomRegistrationConfig = [
    // TCREP22
    // TCREP22
    {
        label: "Gender",
        name: "gender_mf",
        type: "select",
        loadRef: "gender_mf",
        data: [],
        isOnlyInCf: (cf) => {
            return ["TCREP22", "MYHEARTCAFE2022", "MARAVCF22"].indexOf(cf) >= 0
        },
        required: true,
        register: 1, editStudent: 0, editRec: 0
    },

    {
        label: "Year of Graduation",
        name: "mara_grad_year",
        type: "select",
        loadRef: "mara_grad_year",
        data: [],
        isOnlyInCf: (cf) => {
            return ["MARAVCF22"].indexOf(cf) >= 0
        },
        required: true,
        register: 1, editStudent: 0, editRec: 0
    },

    {
        label: "Nationality",
        name: "nationality_country",
        type: "select",
        loadRef: "nationality_country",
        data: [],
        isOnlyInCf: (cf) => {
            return ["MYHEARTCAFE2022", "MARAVCF22"].indexOf(cf) >= 0
        },
        required: true,
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: "IC Number",
        name: "tcrep_ic",
        type: "number",
        isOnlyInCf: (cf) => {
            return cf == "MYHEARTCAFE2022"
        },
        required: true,
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: "Country of Residence Abroad",
        name: "tcrep_country_residence",
        type: "select",
        loadRef: "nationality_country",
        data: [],
        isOnlyInCf: (cf) => {
            return ["TCREP22", "MYHEARTCAFE2022"].indexOf(cf) >= 0
        },
        required: true,
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: "Academic Qualification",
        name: "tcrep_qualification",
        type: "select",
        loadRef: "tcrep_qualification",
        data: [],
        isOnlyInCf: (cf) => {
            return ["TCREP22", "MYHEARTCAFE2022"].indexOf(cf) >= 0
        },
        required: true,
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: "Country of Study",
        name: "mara_country_study",
        type: "select",
        loadRef: "nationality_country",
        data: [],
        isOnlyInCf: (cf) => {
            return ["MARAVCF22"].indexOf(cf) >= 0
        },
        required: true,
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: "Latest Field of Study",
        name: "tcrep_field_study",
        type: "select",
        loadRef: "tcrep_field_study",
        data: [],
        isOnlyInCf: (cf) => {
            return ["MYHEARTCAFE2022"].indexOf(cf) >= 0
        },
        required: true,
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: "University",
        name: "myheart_university",
        type: "text",
        isOnlyInCf: (cf) => {
            return ["MYHEARTCAFE2022", "MARAVCF22"].indexOf(cf) >= 0
        },
        required: true,
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: "Year of Study",
        name: "mara_year_study",
        type: "select",
        loadRef: "mara_year_study",
        data: [],
        isOnlyInCf: (cf) => {
            return ["MARAVCF22"].indexOf(cf) >= 0
        },
        required: true,
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: "Year of Study (Other)",
        name: "mara_year_study_other",
        type: "text",
        data: [],
        isOnlyInCf: (cf) => {
            return ["MARAVCF22"].indexOf(cf) >= 0
        },
        required: false,
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: "Level of Study",
        name: "mara_level_study",
        type: "select",
        loadRef: "mara_level_study",
        data: [],
        isOnlyInCf: (cf) => {
            return ["MARAVCF22"].indexOf(cf) >= 0
        },
        required: true,
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: "Level of Study (Other)",
        name: "mara_level_study_other",
        type: "text",
        data: [],
        isOnlyInCf: (cf) => {
            return ["MARAVCF22"].indexOf(cf) >= 0
        },
        required: false,
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: "Field of Study",
        name: "mara_field_study",
        type: "select",
        loadRef: "tcrep_field_study",
        data: [],
        isOnlyInCf: (cf) => {
            return ["MARAVCF22"].indexOf(cf) >= 0
        },
        required: true,
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: "Current Employment Status",
        name: "tcrep_employ_status",
        type: "select",
        loadRef: "tcrep_employ_status",
        data: [],
        isOnlyInCf: (cf) => {
            return cf == "MYHEARTCAFE2022"
        },
        required: true,
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: "Current Employment Role",
        name: "tcrep_employ_role",
        type: "select",
        loadRef: "tcrep_employ_role",
        data: [],
        isOnlyInCf: (cf) => {
            return ["TCREP22", "MYHEARTCAFE2022"].indexOf(cf) >= 0
        },
        required: true,
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: "Current Employment Industry",
        name: "tcrep_employ_industry",
        type: "select",
        loadRef: "tcrep_employ_industry",
        data: [],
        isOnlyInCf: (cf) => {
            return ["TCREP22", "MYHEARTCAFE2022"].indexOf(cf) >= 0
        },
        required: true,
        register: 1, editStudent: 0, editRec: 0
    },
]

const CustomRegistrationTermsAndConditionConfig = [
    {
        label: null,
        name: "accept-pdpa",
        type: "checkbox",
        data: [{
            key: "accepted",
            label: `<small>I hereby certify that the information contained herein is true and accurate to the best of my knowledge. I hereby consent for Talent Corporation Malaysia Berhad (TalentCorp) to collect, store, process and use my personal data contained herein in accordance with the <b>Personal Data Protection Act 2010</b> for the purpose it was collected, which includes but is not limited for administrative purposes in connection with MyHeart-REP CaFe 2022</small>`
        }],
        isOnlyInCf: (cf) => {
            return ["TCREP22"].indexOf(cf) >= 0;
        },
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: null,
        name: "accept-tcrep",
        type: "checkbox",
        data: [{
            key: "accepted",
            label: `<small>I also consent for <b>Talent Corporation Malaysia Berhad (TalentCorp)</b> to share my details to companies participating in MyHeart-REP CaFe 2022</small>`
        }],
        isOnlyInCf: (cf) => {
            return ["TCREP22"].indexOf(cf) >= 0;
        },
        register: 1, editStudent: 0, editRec: 0
    },
    /////////////////////////////
    {
        label: null,
        name: "accept-myheart",
        type: "checkbox",
        data: [{
            key: "accepted",
            label: `<small>I hereby certify that the information contained herein is true and accurate to the best of my knowledge. I hereby consent for <b>Talent Corporation Malaysia Berhad (TalentCorp)</b> to collect, store, process and use my personal data contained herein in accordance with the <b>Personal Data Protection Act 2010</b> for the purpose it was collected, which includes but is not limited for administrative purposes in connection with <b>MyHeart CaFe</b>.</small>`
        }],
        isOnlyInCf: (cf) => {
            return ["MYHEARTCAFE2022"].indexOf(cf) >= 0;
        },
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: null,
        name: "accept-myheart-pdpa",
        type: "checkbox",
        data: [{
            key: "accepted",
            label: `<small>I also consent for <b>Talent Corporation Malaysia Berhad (TalentCorp)</b> to share my details to companies participating in <b>MyHeart CaFe</b>.</small>`
        }],
        isOnlyInCf: (cf) => {
            return ["MYHEARTCAFE2022"].indexOf(cf) >= 0;
        },
        register: 1, editStudent: 0, editRec: 0
    },
    /////////////////////////////
    {
        label: null,
        name: "accept-mara",
        type: "checkbox",
        data: [{
            key: "accepted",
            label: `<small>I hereby certify that the information contained herein is true and accurate to the best of my knowledge. I hereby consent for <b>Talent Corporation Malaysia Berhad (TalentCorp)</b> to collect, store, process and use my personal data contained herein in accordance with the <b>Personal Data Protection Act 2010</b> for the purpose it was collected, which includes but is not limited to administrative purposes in connection with <b>TalentCorp-NAMSA Virtual Career Fair 2022</b>.</small>`
        }],
        isOnlyInCf: (cf) => {
            return ["MARAVCF22"].indexOf(cf) >= 0;
        },
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: null,
        name: "accept-mara-share",
        type: "checkbox",
        data: [{
            key: "accepted",
            label: `<small>I also consent for <b>Talent Corporation Malaysia Berhad (TalentCorp)</b> to share my details to companies participating in <b>TalentCorp-NAMSA Virtual Career Fair 2022</b>.</small>`
        }],
        isOnlyInCf: (cf) => {
            return ["MARAVCF22"].indexOf(cf) >= 0;
        },
        register: 1, editStudent: 0, editRec: 0
    },
]

const CustomRegistrationTermsAndConditionError = {
    "accept-pdpa": "You must agree to Personal Data Protection Act before continuing.",
    "accept-tcrep": "You must agree to TalentCorp terms and condition before continuing.",
    "accept-myheart": "You must agree to TalentCorp terms and condition before continuing.",
    "accept-myheart-pdpa": "You must agree to Personal Data Protection Act before continuing.",
    "accept-mara": "You must agree to all TalentCorp terms and condition before continuing.",
    "accept-mara-share": "You must agree to all TalentCorp terms and condition before continuing.",
};
function isNoProfileSetupPostSignUp(cf) {
    return ["MARAVCF22"].indexOf(cf) >= 0;
}

module.exports = {
    CustomConfig,
    isNoProfileSetupPostSignUp,
    DefaultCustomOrder,
    CustomOrder,
    CustomRegistrationConfig,
    CustomRegistrationTermsAndConditionError,
    CustomRegistrationTermsAndConditionConfig,
};