
const {
    __
} = require("../../config/graphql-config");

// 2. @adding_cf_meta
var EXPORT = {};
EXPORT.Cfs = {
    ID: __.Int,
    name: __.String,
    country: __.String,
    time: __.String,
    is_active: __.String,
    is_load: __.String,
    cf_order: __.String,
    created_at: __.String,
    updated_at: __.String,

    total_student: __.Int,

    // meta
    title: __.String,
    welcome_text: __.String,
    title_landing: __.String,
    banner: __.String,
    banner_pos: __.String,

    // schedule: __.String,
    // override_coming_soon: __.String,
    // page_banner: __.String,

    start: __.String,
    end: __.String,
    time_str: __.String,
    time_str_mas: __.String,
    mail_chimp_list: __.String,
    page_url: __.String,
    can_login: __.Int,
    can_register: __.Int,
    is_local: __.Int,
    organizations: __.String,
    hall_cfg_onsite_call_use_group: __.Int,

    // custom on/off features
    feature_student_list_iv_only: __.String,
    feature_student_list_resume_drop_only: __.String,
    feature_event_and_welcome: __.String,
    feature_event: __.String,
    feature_event_student: __.String,
    feature_event_show_all_for_student: __.String,
    
    feature_recruiter_interested_student: __.String,
    feature_recruiter_login: __.String,
    feature_group_call: __.String,
    feature_recruiter_job_post: __.String,
    
    feature_show_hall_gallery_second: __.String,
    feature_popup_block_incomplete_profile: __.String,
    feature_student_login: __.String,
    feature_student_register: __.String,
    feature_student_company_booth: __.String,
    feature_student_job_post: __.String,
    feature_sponsor: __.String,
    feature_drop_resume: __.String,
    feature_chat: __.String,
    feature_feedback: __.String,
    feature_company_external_follow: __.String,
    feature_job_post_filter_location: __.String,
    feature_subscribe: __.String,
    
    limit_drop_resume: __.String,
    
    offset_load_company: __.String,
    offset_load_company_listing: __.String,

    // custom text

    text_my_interview: __.String,
    text_interview_rec: __.String,
    text_interviewer_rec: __.String,
    text_event_webinar: __.String,
    text_job_post_rec: __.String,
    text_job_post_card: __.String,
    text_job_post: __.String,
    text_schedule_call: __.String,
    text_header_title: __.String,
    text_header_desc: __.String,
    text_student_entity_single: __.String,
    text_student_entity_plural: __.String,
    text_registration_title: __.String,
    text_company_entity_single: __.String,
    text_company_entity_plural: __.String,
    text_company_profile_term: __.String,
    text_company_label_job_post: __.String,
    text_registration_disclaimer: __.String,
    text_salutation_recruiter: __.String,


    // custom image
    image_header_icon: __.String,
    image_header_icon_full: __.String,

    // custom link
    link_external_feedback_student: __.String,
    link_external_feedback_rec: __.String,
    link_external_home: __.String,
    link_external_follow: __.String,
    link_guide_student : __.String,
    link_guide_rec : __.String,
    // not really used
    // flag: __.String,
    // logo: __.String,
    // logo_height_hall: __.String,
    // logo_width_hall: __.String,
    // logo_margin_hall: __.String,
    // logo_height: __.String,
    // logo_width: __.String,
    // logo_position: __.String,
    // logo_size: __.String,
    // test_start: __.String,
    // test_end: __.String,
    // custom_style: __.String,
    // custom_feature: __.String,
    // external_home_url: __.String,
    // Organizer: __.String,
    // Collaborator: __.String,
    // Powered: __.String,
    // University: __.String
}

module.exports = EXPORT