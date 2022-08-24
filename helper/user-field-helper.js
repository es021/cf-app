class UserFieldHelper {
    constructor() {
        this.FieldType = {
            TEXT: "TEXT",
            SELECT: "SELECT",
            NUMBER: "NUMBER",
            TEXTAREA: "TEXTAREA"
        }
    }
    getFieldSingle(cf) {
        let fields = this.getUserConfig(cf)
        let r = [];
        for (let f of fields) {
            if (f.type == "single") {
                r.push(f.id)
            }
        }
        return r;
    }
    getFieldMulti(cf) {
        let fields = this.getUserConfig(cf)
        let r = [];
        for (let f of fields) {
            if (f.type == "multi") {
                r.push(f.id)
            }
        }
        return r;
    }
    getDefaultUserConfig(cf) {
        return [
            // first name
            {
                id: "first_name",
                type: "single",
                question: {
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
                question: {
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
            // phone
            {
                id: "phone_number",
                type: "single",
                question: {
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
        ]
    }
    async getUserConfigFromDb(cf, DB) {
        // let res = await DB.query();
        // TODO

        return Promise.resolve(this.getUserConfig(cf));
    }
    getUserConfig(cf) {
        let r = [
            // single text
            {
                id: "test",
                type: "single",
                question: {
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
                question: {
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
                question: {
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
                question: {
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
                question: {
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
                question: {
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
                question: {
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
                question: {
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

        return [...this.getDefaultUserConfig(), ...r];
    }
    getFilterItemTitleObject(cf) {
        let toRet = {};
        let config = this.getUserConfig(cf);
        for (let configObj of config) {
            if (configObj.filter) {
                toRet[configObj.id] = configObj.filter["title"]
            }
        }
        return toRet;
    }
    async getFilterItems(cf, DB) {
        let toRet = [];
        let config = await this.getUserConfigFromDb(cf, DB);
        for (let configObj of config) {
            if (configObj.filter) {
                let toPush = {
                    id: configObj.id,
                    ...configObj.filter,
                };
                toRet.push(toPush)
            }
        }
        return toRet;
    }
    getCardItems(cf) {
        let toRet = [];
        let config = this.getUserConfig(cf);

        for (let configObj of config) {
            if (configObj.card) {
                let toPush = {
                    id: configObj.id,
                    ...configObj.card,
                };
                toRet.push(toPush)
            }
        }
        toRet.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0))

        return toRet;
    }
    getPopupItems(cf, type) {
        let toRet = [];
        let config = this.getUserConfig(cf);

        for (let configObj of config) {
            if (type == configObj.type && configObj.popup) {
                let toPush = {
                    id: configObj.id,
                    ...configObj.popup,
                };
                toRet.push(toPush)
            }
        }

        return toRet;
    }
    getUserRegistrationConfig(cf) {
        const DefaultRegistrationConfig = [
            { header: "Basic Information" },
            {
                id: "first_name",
                label: "First Name",
                sublabel: "",
                input_type: "text",
                input_placeholder: "John",
                required: true,
            },
            {
                id: "last_name",
                label: "Last Name",
                sublabel: "",
                input_type: "text",
                input_placeholder: "Doe",
                required: true,
            },
            {
                id: "user_email",
                label: "Email",
                sublabel: "",
                input_type: "email",
                input_placeholder: "john.doe@email.com",
                required: true,
            },
            {
                id: "user_pass",
                label: "Password",
                sublabel: "",
                input_type: "password",
                input_placeholder: "********",
                required: true,
            },
            {
                id: "phone_number",
                label: "Phone Number",
                sublabel: "Please include Country Code",
                input_type: "phone_number",
                input_placeholder: "XXXXXXXXXX",
                required: true,
            },
        ]

        let r = [
            ...DefaultRegistrationConfig,
            {
                label: "Gender",
                id: "gender_mf",
                input_type: "select",
                dataset_source: "gender_mf",
                data: [],
                required: true,
            }
        ]

        return r;
    }
    getRegistrationItems(cf, refData = {}) {
        let toRet = [];

        for (var item of this.getUserRegistrationConfig(cf)) {
            let toPush = {};
            if (item.header) {
                toPush = item;
            } else {
                toPush = {
                    name: item.id,
                    label: item.label,
                    sublabel: item.sublabel,
                    type: item.input_type,
                    placeholder: item.input_placeholder,
                    loadRef: item.dataset_source
                };
                if (item.input_type == "select" && refData[item.id]) {
                    toPush["data"] = refData[item.id];
                }
            }
            toRet.push(toPush);
        }

        return toRet;
    }
    getQuestionItems(cf) {
        let toRet = [];
        let config = this.getUserConfig(cf);

        for (let configObj of config) {
            let toPush = {
                type: configObj.type,
                id: configObj.id,
                ...configObj.question,
            };
            if (configObj.type == "single") {
                toPush["key_input"] = configObj.id;
            }
            if (configObj.type == "multi") {
                toPush["table_name"] = configObj.id;
            }
            toRet.push(toPush)
        }

        return toRet;
    }
}

UserFieldHelper = new UserFieldHelper();
module.exports = UserFieldHelper;
