const { UserConfigByCf, UserConfigDefault } = require("./user-field-helper-mock-data");

class UserFieldHelper {
    constructor() {
        this.FieldType = {
            TEXT: "TEXT",
            SELECT: "SELECT",
            NUMBER: "NUMBER",
            TEXTAREA: "TEXTAREA"
        }
    }
    getUserConfig(cf) {
        return [...UserConfigDefault, ...UserConfigByCf];
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

    async getUserConfigFromDb(cf, DB) {
        // let res = await DB.query();
        // TODO

        return Promise.resolve(this.getUserConfig(cf));
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
        let r = []
        let userConfigs = this.getUserConfig(cf)

        let iterationPosition = ["", "bottom"];
        for (var curPosIteration of iterationPosition) {
            for (let item of userConfigs) {
                if (item.register) {
                    let itemPos = item.register.position;
                    if (curPosIteration == "bottom") {
                        if (itemPos != "bottom") continue;
                    } else {
                        if (itemPos == "bottom") continue;
                    }
                    r.push({
                        id: item.id,
                        ...item.register
                    })
                }
            }
        }
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
                    data: item.data,
                    placeholder: item.input_placeholder,
                    loadRef: item.dataset_source,
                    required: item.required,
                    is_accept_checkbox: item.is_accept_checkbox,
                    required_error: item.required_error,
                };
                if (item.input_type == "select" && refData[item.id]) {
                    toPush["data"] = refData[item.id];
                }
            }
            toRet.push(toPush);
        }

        return toRet;
    }
    getProfileItems(cf) {
        let toRet = [];
        let config = this.getUserConfig(cf);

        for (let configObj of config) {
            if (configObj.profile) {
                let toPush = {
                    type: configObj.type,
                    id: configObj.id,
                    ...configObj.profile,
                };
                if (configObj.type == "single") {
                    toPush["key_input"] = configObj.id;
                }
                if (configObj.type == "multi") {
                    toPush["table_name"] = configObj.id;
                }
                toRet.push(toPush)
            }
        }

        return toRet;
    }
}

UserFieldHelper = new UserFieldHelper();
module.exports = UserFieldHelper;
