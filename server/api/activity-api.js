const {getAxiosGraphQLQuery, getPHPApiAxios, getWpAjaxAxios} = require('../../helper/api-helper');
const {Queue, QueueEnum, Session, SessionEnum, Prescreen} = require('../../config/db-config');
const {SiteUrl} = require('../../config/app-config');
const {AuthUserKey} = require('../../config/auth-config');
const obj2arg = require('graphql-obj2arg');

const ActivityAPIErr = {
    HAS_SESSION: "HAS_SESSION"
};

class ActivityAPI {
    createSession(host_id, participant_id, entity, entity_id) {

        // 1. check if student has active session ------- start
        var query = `query {user(ID:${participant_id}) {sessions{ID} } }`;
        return getAxiosGraphQLQuery(query).then((res) => {
            var s = res.data.data.user.sessions;

            if (s.length > 0) {
                return ActivityAPIErr.HAS_SESSION;
            }

            // 2. create session ---------start
            var params = {
                host_id: Number.parseInt(host_id),
                participant_id: Number.parseInt(participant_id),
                status: SessionEnum.STATUS_ACTIVE,
                entity: entity,
                entity_id: Number.parseInt(entity_id)
            };

            var query = `mutation {add_session (${obj2arg(params, {noOuterBraces: true})}) {ID} }`;
            return getAxiosGraphQLQuery(query).then((res) => {
                var session = res.data.data.add_session;

                // 3. update entity status to Done --start
                var params = {
                    ID: Number.parseInt(entity_id),
                    status: "Done"
                };

                var mutation = (entity === Queue.TABLE) ? "edit_queue" : "edit_prescreen";
                var query = `mutation {${mutation} (${obj2arg(params, {noOuterBraces: true})}) {ID} }`;

                return getAxiosGraphQLQuery(query).then((res) => {
                    console.log("success");
                    console.log(mutation);

                    return session;

                }, (err) => {
                    return err.response.data;
                });
                // 3. -end

            }, (err) => {
                return err.response.data;
            });
            // 2. -end

        }, (err) => {
            return err.response.data;
        });
        // 1. -end

    }

    startQueue(student_id, company_id) {
        var params = {
            student_id: student_id,
            company_id: company_id,
            status: QueueEnum.STATUS_QUEUING
        };

        var query = `mutation {add_queue(${obj2arg(params, {noOuterBraces: true})}) {ID queue_num} }`;
        return getAxiosGraphQLQuery(query).then((res) => {
            return res.data.data.add_queue;
        }, (err) => {
            return err.response.data;
        });
    }

    cancelQueue(id) {
        var query = `mutation{edit_queue(ID:${id}, status:"${QueueEnum.STATUS_CANCELED}"){ID}}`;
        return getAxiosGraphQLQuery(query).then((res) => {
            return res.data.data.edit_queue;
        }, (err) => {
            return err.response.data;
        });
    }
}

ActivityAPI = new ActivityAPI();
module.exports = {ActivityAPI, ActivityAPIErr};
