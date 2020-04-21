
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
    created_at: __.String,
    updated_at: __.String,

    // meta
    title: __.String,
    welcome_text: __.String,
    title_landing: __.String,
    flag: __.String,
    banner: __.String,
    banner_pos: __.String,

    // schedule: __.String,
    // override_coming_soon: __.String,
    // page_banner: __.String,

    logo: __.String,
    logo_height_hall: __.String,
    logo_width_hall: __.String,
    logo_margin_hall: __.String,
    logo_height: __.String,
    logo_width: __.String,
    logo_position: __.String,
    logo_size: __.String,
    start: __.String,
    end: __.String,
    time_str: __.String,
    time_str_mas: __.String,
    test_start: __.String,
    test_end: __.String,
    mail_chimp_list: __.String,
    page_url: __.String,
    can_login: __.Int,
    can_register: __.Int,

    is_local: __.Int,
    hall_cfg_onsite_call_use_group: __.Int,
    external_home_url: __.String,

    organizations: __.String,
    custom_style: __.String,
    custom_feature: __.String,

    // Organizer: __.String,
    // Collaborator: __.String,
    // Powered: __.String,
    // University: __.String
}

module.exports = EXPORT