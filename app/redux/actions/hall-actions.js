import {getAxiosGraphQLQuery} from '../../../helper/api-helper';
import {Session, Queue, Prescreen, UserEnum} from '../../../config/db-config';
import {getAuthUser} from './auth-actions';
import {store} from '../store.js';

/***** ACTIVITY ***************************/
export const ActivityType = {
    SESSION: Session.TABLE,
    QUEUE: Queue.TABLE,
    PRESCREEN: Prescreen.TABLE
};

function getEntitySelect(role) {
    return (role === UserEnum.ROLE_STUDENT)
            ? " company{ID name img_url img_position img_size} "
            : " student{ID first_name last_name img_url img_pos img_size} ";

}
export const ACTIVITY = "ACTIVITY";
export function loadActivity(types = [ActivityType.SESSION, ActivityType.QUEUE, ActivityType.PRESCREEN]) {

    var role = getAuthUser().role;
    var user_id = getAuthUser().ID;
    var select = "";
    var type = "";

    if (typeof types === "string") {
        types = [types];
    }

    types.map((d, i) => {
        type += ":" + d;
        switch (d) {
            case ActivityType.SESSION:
                select += ` sessions { ID created_at ${getEntitySelect(role)}} `;
                break;
            case ActivityType.QUEUE:
                select += ` queues { ID queue_num created_at ${getEntitySelect(role)}} `;
                break;
            case ActivityType.PRESCREEN:
                select += ` prescreens { ID appointment_time ${getEntitySelect(role)}} `;
                break;
        }
    });

    var query = `query{user(ID:${user_id}){${select}}}`;
    return function (dispatch) {
        dispatch({
            type: ACTIVITY + type,
            payload: getAxiosGraphQLQuery(query)
        });
    };
}

export function storeLoadActivity(types = [ActivityType.SESSION, ActivityType.QUEUE, ActivityType.PRESCREEN]) {
    store.dispatch(loadActivity(types));
}

/***** COMPANY and TRAFFIC ***************************/
// this is real time
export const TRAFFIC = "HALL_TRAFFIC";
export function loadTraffic() {
    return function (dispatch) {
        dispatch({
            type: TRAFFIC,
            payload: getAxiosGraphQLQuery(
                    `query{
                        companies {
                            ID
                            active_queues_count
                            active_prescreens_count
                        }}`)
        });
    };
}

export const FETCH_COMPANIES = "FETCH_COMPANIES";
export function loadCompanies() {
    return function (dispatch) {
        dispatch({
            type: FETCH_COMPANIES,
            payload: getAxiosGraphQLQuery(
                    `query{
                        companies {
                            ID
                            img_url
                            img_size
                            img_position
                            name
                            type
                            vacancies_count
                        }
                }`)
        });
    };
}

