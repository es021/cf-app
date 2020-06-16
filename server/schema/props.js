
const {
    __
} = require("../../config/graphql-config");

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
    feature_company_booth: __.String,
    feature_sponsor: __.String,
    
    // custom text
    text_header_title: __.String,
    text_header_desc: __.String,
    text_student_single: __.String,
    text_student_plural: __.String,

    // custom image
    image_header_icon: __.String,
    
    // custom link
    link_external_home: __.String,

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