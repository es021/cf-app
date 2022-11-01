const { getTermsAndConditionUrl } = require("../config/app-config");

const UserConfigDefault = [
    // first name
    {
        id: "first_name",
        type: "single",
        register: {
            label: "First Name",
            sublabel: "",
            input_type: "text",
            input_placeholder: "John",
            required: true,
        },
        profile: {
            input_type: "text",
            input_placeholder: "John",
            label: "Name",
            is_required: true,
            // sublabel: "sublabel",
        },
        // popup: {
        //     label: "Test Parent",
        //     icon: "suitcase",
        // }
    },
    // last name
    {
        id: "last_name",
        type: "single",
        register: {
            label: "Last Name",
            sublabel: "",
            input_type: "text",
            input_placeholder: "Doe",
            required: true,
        },
        profile: {
            children_of: "first_name",
            input_type: "text",
            input_placeholder: "Doe",
            is_required: true,
        },
        // popup: {
        //     label: "Test Children",
        //     icon: "suitcase",
        // }
    },
    {
        id: "user_email",
        type: "single",
        register: {
            label: "Email",
            sublabel: "",
            input_type: "email",
            input_placeholder: "john.doe@email.com",
            required: true,
        },
    },
    {
        id: "user_pass",
        type: "single",
        register: {
            label: "Password",
            sublabel: "",
            input_type: "password",
            input_placeholder: "********",
            required: true,
        },
    },

    {
        id: "phone_number",
        type: "single",
        register: {
            label: "Phone Number",
            sublabel: "Please include Country Code",
            input_type: "phone_number",
            input_placeholder: "XXXXXXXXXX",
            required: true,
        },
        profile: {
            label: "Phone Number",
            input_type: "text",
            input_placeholder: "XXX-XXXXXXXX",
            is_required: true,
        },
        popup: {
            label: "Phone Number",
            icon: "phone",
        }
    },
    {
        id: "gender_mf",
        type: "single",
        register: {
            label: "Gender",
            input_type: "select",
            dataset_source: "gender_mf",
            data: [],
            required: true,
        }
    },
    {
        id: "resume",
        register: {
            position: "bottom",
            input_type: "custom",
            is_resume: true,
            is_resume_required: true,
        }
    },
    {
        id: "accept_policy",
        register: {
            position: "bottom",
            is_accept_checkbox: true,
            label: null,
            input_type: "checkbox",
            data: [{
                key: "accepted",
                label: `<small>I agree to <a href="${getTermsAndConditionUrl()}" target="_blank">terms and conditions</a></small>`
            }],
            required_error: "You must agree to terms and condition before continuing."
        }
    },
    {
        id: "accept_send_sms",
        register: {
            position: "bottom",
            is_accept_checkbox: true,
            label: null,
            input_type: "checkbox",
            data: [{
                key: "accepted",
                label: `<small>I agree to receive important notifications from this event</small>`
            }],
            required_error: "You must agree to receive important notifications from this event."
        }
    },
]

const UserConfigByCf = [
    // single text
    {
        id: "test",
        type: "single",
        register: {
            label: "Test For Register",
            sublabel: "",
            input_type: "text",
            input_placeholder: "John",
            required: true,
        },
        profile: {
            input_type: "text",
            input_placeholder: "placeholder",
            label: "Test",
            sublabel: "sublabel",
            is_required: true,
        },
        popup: {
            label: "Test Parent",
            icon: "suitcase",
        },
        card: {
            order: 1,
            bold: true,
            italic: false,
            color: "",
            only_when: "" // only show when value is this
        },
    },
    // single children of
    {
        id: "test_children",
        type: "single",
        profile: {
            children_of: "test",
            input_type: "text",
            input_placeholder: "placeholder test_children",
            is_required: true,
        },
        popup: {
            label: "Test Children",
            icon: "suitcase",
        },
        card: {
            order: 2,
            bold: false,
            italic: true,
            color: "grey",
            only_when: null //
        },
    },
    // single textarea
    {
        id: "test_textarea",
        type: "single",
        profile: {
            input_type: "textarea",
            label: "test_textarea",
            sublabel: "sublabel test_textarea",
            input_placeholder: "placeholder test_textarea",
            is_required: true,
        },
        popup: {
            label: "label test_textarea",
            icon: "suitcase",
        }
    },
    // single number
    {
        id: "test_number",
        type: "single",
        profile: {
            input_type: "number",
            label: "test_number",
            sublabel: "sublabel test_number",
            input_placeholder: "placeholder test_number",
            is_required: true,
        },
        popup: {
            label: "label test_number",
            icon: "suitcase",
        },
    },
    // single select
    {
        id: "test_single_select",
        type: "single",
        profile: {
            input_type: "select",
            label: "test_single_select",
            sublabel: "sublabel test_single_select",
            input_placeholder: "placeholder test_single_select",
            is_required: true,

            dataset_source: "test_source",
            dataset_order_by: "val ASC",
        },
        popup: {
            label: "label test_single_select",
            icon: "suitcase",
        },
        filter: {
            type: "checkbox",
            title: "Filter Title",
            dataset_source: "test_source",
        }
    },
    {
        id: "test_single_other",
        type: "single",
        profile: {
            input_type: "text",
            label: "test_single_other (other)",
            sublabel: "test_single_other (other)",
            // input_placeholder: "multi_test",
            is_required: false,

            // select dataset
            // dataset_source: "test_source",
            // dataset_order_by: "val asc",
            // dataset_show_suggestion: false,
            // dataset_suggestion_offset: 10,
        },
        popup: {
            label: "label test_single_other",
            icon: "suitcase",
        }
    },
    // multi select
    {
        id: "multi_test",
        type: "multi",
        profile: {
            input_type: "select",
            label: "multi_test label",
            sublabel: "multi_test sublabel",
            input_placeholder: "multi_test",
            is_required: true,

            // select dataset
            dataset_source: "test_source",
            dataset_order_by: "val asc",
            dataset_show_suggestion: false,
            dataset_suggestion_offset: 10,
        },
        popup: {
            label: "label multi_test",
            icon: "suitcase",
        }
    },

    // multi text
    {
        id: "multi_test_text",
        type: "multi",
        profile: {
            input_type: "text",
            label: "multi_test_text label",
            sublabel: "multi_test_text sublabel",
            input_placeholder: "multi_test_text",
            is_required: true,

            // suggestion dataset
            dataset_source: "test_source",
            dataset_order_by: "val asc",
        },
        popup: {
            label: "label multi_test_text",
            icon: "suitcase",
        }
    },
];


module.exports = {
    UserConfigDefault,
    UserConfigByCf
};


