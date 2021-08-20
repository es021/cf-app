
const OTHER_PLEASE_SPECIFY = 'Others (Please specify in field below)';
const CustomConfig = {
    // ##############################################################
    // GENERAL
    student_id: {
        label: "Student ID",
        question: "Student ID",
        icon: "slack",
        type: "single",
        input_type: "text",
        is_required: true,
        onCf: ["TARUCJUL21"]
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
        onCf: ["TARUCJUL21"]
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
        onCf: ["OEJF21"]
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
        onCf: ["OEJF21"]
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
        input_type: "text",
        type: "single",
        onCf: ["D2W21"]
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
    where_in_malaysia_select: {
        label: "Place Of Residence",
        question: "Where are you from in Malaysia?",
        icon: "map-marker",
        type: "single",
        input_type: "select",
        ref_table_name: "state",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OEJF21", "TARUCJUL21"]
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
        onCf: ["TARUCJUL21"]
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
        onCf: ["D2W21"]
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
        onCf: ["D2W21"]
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
        onCf: ["D2W21"]
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
        onCf: ["D2W21"]
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
        onCf: ["D2W21"],
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
        onCf: ["D2W21"]
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
        onCf: ["D2W21"]
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
        onCf: ["D2W21"]
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
        onCf: ["D2W21"]
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
        onCf: ["D2W21"]
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
        onCf: ["D2W21"],
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
        onCf: ["D2W21"],
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
        onCf: ["OEJF21"]
    },

    oejf21_where_work: {
        label: "Interested Job Location",
        question: "Where would you like to work?",
        icon: "map-marker",
        list_title: null,
        discard_ref_from_default: true,
        table_name: "oejf21_where_work",
        type: "multi",
        input_type: "select",
        ref_table_name: "oejf21_where_work",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OEJF21"],
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
        onCf: ["OEJF21"]
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
        onCf: ["OEJF21"]
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
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OEJF21"],
        attr: `{val}`
    },
    oejf21_qualification: {
        discard_popup_on: (d) => {
            return d['oejf21_qualification'] == OTHER_PLEASE_SPECIFY;
        },
        label: "Qualification",
        question: "What is your highest level of certificate?",
        icon: "graduation-cap",
        type: "single",
        input_type: "select",
        ref_table_name: "oejf21_qualification",
        ref_order_by: "ID asc",
        is_required: true,
        onCf: ["OEJF21"]
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
        onCf: ["OEJF21"]
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
        onCf: ["OEJF21"],
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
        onCf: ["TARUCJUL21"]
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
        onCf: ["TARUCJUL21"]
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
        onCf: ["TARUCJUL21"],
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
        onCf: ["TARUCJUL21"],
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
        onCf: ["TARUCJUL21"]
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
        onCf: ["TARUCJUL21"]
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
        onCf: ["TARUCJUL21"]
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
        onCf: ["INTELDDSEPT21"]
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
        onCf: ["INTELDDSEPT21"]
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
        onCf: ["INTELDDSEPT21"],
        attr: `{val}`
    },
}

const CustomOrder = {
    INTELDDSEPT21: [
        "first_name",
        "graduation_month",
        "looking_for_position",
        "local_or_oversea_study",
        "university",
        "qualification",
        "field_study_main",
        "field_study_secondary",
        "grade",
        // "phone_number",
        "working_availability_month",
        "local_or_oversea_location",
        "work_experience_year",
        "gender",
        "intel_is_intel_employee",
        "has_attended_before",
        "intel_reference",
        // "interested_role",
        // "where_in_malaysia",
        // "interested_job_location",
        // "skill",
        // "extracurricular",
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

module.exports = {
    CustomConfig,
    CustomOrder
};