const {getAxiosGraphQLQuery, getPHPApiAxios, getWpAjaxAxios} = require('../../helper/api-helper');
const {Queue, Session, Prescreen} = require('../../config/db-config');
const {SiteUrl} = require('../../config/app-config');
const {AuthUserKey} = require('../../config/auth-config');
const obj2arg = require('graphql-obj2arg');

const ActivityAPIErr = {
    WRONG_PASS: "WRONG_PASS",
    INVALID_EMAIL: "INVALID_EMAIL",
    NOT_ACTIVE: "NOT_ACTIVE",
    INVALID_ACTIVATION: "INVALID_ACTIVATION"
};

class ActivityAPI {
    startQueue(student_id, company_id) {
        //check how many queue the student already has
        
        
    }
}

ActivityAPI = new ActivityAPI();
module.exports = {ActivityAPI, ActivityAPIErr};
