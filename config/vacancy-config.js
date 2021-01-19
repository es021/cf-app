const {
    User,
    UserMeta,
    VacancyEnum
} = require('./db-config.js');


// @custom_vacancy_info
function isVacancyInfoNeeded(cf, key) {
    if (key == "specialization") {
        return ["UTM21"].indexOf(cf) >= 0
    }

    return false;
}

function addVacancyInfoIfNeeded(cf, key) {
    if (isVacancyInfoNeeded(cf, key)) {
        return key;
    }
    return "";
}

function getVacancyType(cf) {
    if (cf == "UTM21") {
        return [
            VacancyEnum.TYPE_PERMANENT,
            VacancyEnum.TYPE_CONTRACT,
        ]
    } else {
        return [
            VacancyEnum.TYPE_FULL_TIME,
            VacancyEnum.TYPE_PART_TIME,
            VacancyEnum.TYPE_INTERN,
            VacancyEnum.TYPE_PROJECT_BASED,
        ]
    }
}

module.exports = {
    getVacancyType,
    isVacancyInfoNeeded,
    addVacancyInfoIfNeeded
};