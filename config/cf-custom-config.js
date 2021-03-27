const { CustomConfig, isCustomUserInfoOff, CustomStudentCardInfo } = require('./registration-config');

const getByKey = (key, meta) => {
    let r;
    try {
        r = CustomConfig[key][meta];
    } catch (err) {
    }

    if (!r) {
        r = "";
    }
    return r;
}

const cfCustomFunnel = ({ action, cf, key, isRoleRec, data }) => {
    if (action == "is_single") {
        return CustomConfig[key].type === "single"
    }

    if (action == "is_multi") {
        return CustomConfig[key].type === "multi"
    }

    if (action == "get_key_student_line2") {
        if (CustomStudentCardInfo[cf]) {
            return CustomStudentCardInfo[cf].line2;
        }
        return "";
    }
    if (action == "get_key_student_line3") {
        if (CustomStudentCardInfo[cf]) {
            return CustomStudentCardInfo[cf].line3;
        }
        return "";
    }
    if (action == "get_keys_for_filter") {
        let r = [];
        for (var k in CustomConfig) {
            if (CustomConfig[k].discard_filter === true) {
                continue;
            }
            r.push(k);
        }
        return r;
    }
    if (action == "get_keys_for_popup") {
        let r = [];
        for (var k in CustomConfig) {
            if (CustomConfig[k].discard_popup === true) {
                continue;
            }
            r.push(k);
        }
        return r;
    }
    if (action == "get_keys_for_export") {
        let r = [];
        for (var k in CustomConfig) {
            if (CustomConfig[k].discard_export === true) {
                continue;
            }
            r.push(k);
        }
        return r;
    }
    if (action == "get_keys") {
        let r = [];
        for (var k in CustomConfig) {
            r.push(k);
        }
        return r;
    }
    if (action == "get_attr_by_cf") {
        let r = [];
        for (var k in CustomConfig) {
            if (Array.isArray(CustomConfig[k].onCf) && CustomConfig[k].onCf.indexOf(cf) >= 0) {
                if (CustomConfig[k].type == "multi" && CustomConfig[k].attr) {
                    k += " " + CustomConfig[k].attr;
                }
                r.push(k);
            }
        }
        return r;
    }
    if (action == "get_keys_single") {
        let r = [];
        for (var k in CustomConfig) {
            if (CustomConfig[k].type === "single") {
                r.push(k);
            }
        }
        return r;
    }
    if (action == "get_keys_multi") {
        let r = [];
        for (var k in CustomConfig) {
            if (CustomConfig[k].type === "multi") {
                r.push(k);
            }
        }
        return r;
    }

    if (action == "get_label_for_filter") {
        let r = {};
        for (var k in CustomConfig) {
            if (CustomConfig[k].discard_filter === true) {
                continue;
            }
            r[k] = CustomConfig[k].label;
        }
        return r;
    }
    if (action == "get_discard_popup_on_by_key") {
        return getByKey(key, "discard_popup_on");
    }
    if (action == "get_attr_by_key") {
        return getByKey(key, "attr");
    }
    if (action == "get_label_by_key") {
        return getByKey(key, "label");
    }
    if (action == "get_icon_by_key") {
        return getByKey(key, "icon");
    }
    if (action == "get_question_by_key") {
        return getByKey(key, "question");
    }
    if (action == "get_type_by_key") {
        return getByKey(key, "type");
    }
    if (action == "get_input_type_by_key") {
        return getByKey(key, "input_type");
    }
    if (action == "get_ref_table_name_by_key") {
        return getByKey(key, "ref_table_name");
    }
    if (action == "get_is_required_by_key") {
        return getByKey(key, "is_required");
    }

    if (action == "get_form_item") {
        let keys = Object.keys(CustomConfig);
        let r = [];
        for (let k of keys) {
            if (getByKey(k, "discard_form") === true) {
                continue;
            }
            let onCf = getByKey(k, "onCf")
            if (Array.isArray(onCf) && onCf.indexOf(cf) >= 0) {
                r.push({
                    label: getByKey(k, "question"),
                    type: getByKey(k, "type"),
                    sublabel: getByKey(k, "question_sublabel"),
                    input_type: getByKey(k, "input_type"),
                    table_name: getByKey(k, "table_name"),
                    list_title: getByKey(k, "list_title"),
                    discard_ref_from_default: getByKey(k, "discard_ref_from_default"),
                    id: k,
                    key_input: k,
                    ref_table_name: getByKey(k, "ref_table_name"),
                    ref_order_by: getByKey(k, "ref_order_by"),
                    is_required: getByKey(k, "is_required"),
                    hidden: isRoleRec ? isRoleRec() : false || isCustomUserInfoOff(cf, k)
                });
            }
        }
        return r;
    }

}

module.exports = {
    cfCustomFunnel
}