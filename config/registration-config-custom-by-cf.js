
const OTHER_PLEASE_SPECIFY = 'Others (Please specify in field below)';
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
        onCf: ["OCPE21"]
    },
    student_id: {
        label: "Student ID",
        question: "Student ID",
        icon: "slack",
        type: "single",
        input_type: "text",
        is_required: true,
        onCf: ["TARUCJUL21", "TARUCNOV21", "TAYLORS21"]
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
        onCf: ["OEJF21", "UTMIV21", "OCPE21"]
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
        onCf: ["D2W21", "D2WRL21", "UTMIV21"]
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
        onCf: ["OEJF21", "TARUCJUL21", "TARUCNOV21", "OCPE21"]
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
        onCf: ["D2W21", "D2WRL21"],
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
        onCf: ["OEJF21", "OCPE21"]
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
        onCf: ["OEJF21", "OCPE21"]
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
        onCf: ["OEJF21", "OCPE21"]
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
        onCf: ["TAYLORS21"]
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
        onCf: ["TAYLORS21"]
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
        onCf: ["WCC21", "OCPE21"]
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
        onCf: ["WCC21"]
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
        onCf: ["WCC21"]
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
        onCf: ["WCC21"]
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
        onCf: ["WCC21"]
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
        onCf: ["WCC21"]
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
        onCf: ["WCC21"]
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
        onCf: ["WCC21"]
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
        onCf: ["WCC21"]
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
}

const Default = [
    "first_name",
    "graduation_month",
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
    "interested_role",
    "where_in_malaysia",
    "interested_job_location",
    "skill",
    "extracurricular",
];

const CustomOrder = {
    INTELMM22: [
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
        // 1. 2016-2021
        // 2. 2010-2015
        // 3. 2009-2014
        // 4. 2003-2008
        // 5. 1997-2002
        // 6. 1991-1996
        // 7. 1985-1990
        // 8. 1979-1984
        // 9. Other

        "looking_for_position",
        "country_study",
        "university",
        "oejf21_qualification",
        "oejf21_qualification_other",
        "age_group",
        "gender",
        "race",
        "ocpe_work_availability",
        // Dec/21
        // Jan/22
        // Feb/22
        // Mar/22
        // Apr/22
        // May/22
        // Jun/22
        // Jul/22
        // Aug/22
        // Sep/22
        // Oct/22
        // Nov/22
        // Dec/22

        "where_in_malaysia_select",
        "interested_job_location_my_sg",
        "ocpe_work_experience",
        // 1. 0-2 years
        // 2. 3-5 years
        // 3. 6-10 years
        // 4. 11-15 years
        // 5. More than 16 years

        "oejf21_industry",
        "current_position",
        "ocpe_reference",
        // Event
        // e-Poster
        // Email
        // Facebook
        // Friend
        // Instagram
        // LinkedIn
        // Radio
        // WhatsApp
        // Phone Call
        // Others

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

module.exports = {
    CustomConfig,
    CustomOrder
};