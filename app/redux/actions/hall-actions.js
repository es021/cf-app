import {
    getAxiosGraphQLQuery
} from '../../../helper/api-helper';
import {
    Session,
    Queue,
    SessionRequest,
    Prescreen,
    UserEnum,
    ZoomInvite,
    GroupSessionJoin
} from '../../../config/db-config';
import {
    getAuthUser,
    getCF,
    isRoleRec,
    isRoleStudent
} from './auth-actions';
import {
    store
} from '../store.js';

/***** ACTIVITY ***************************/
export const ActivityType = {
    SESSION: Session.TABLE,
    QUEUE: Queue.TABLE,
    SESSION_REQUEST: SessionRequest.TABLE,
    PRESCREEN: Prescreen.TABLE,
    ZOOM_INVITE: ZoomInvite.TABLE,
    GROUP_SESSION_JOIN: GroupSessionJoin.TABLE
};

var AllActivityType = [];
for (var k in ActivityType) {
    AllActivityType.push(ActivityType[k]);
}

function getEntitySelect(role, type) {

    var extra = "";
    if (role === UserEnum.ROLE_RECRUITER && (type == ActivityType.SESSION_REQUEST || type == ActivityType.PRESCREEN)) {
        extra = "doc_links {ID url label}";
    }

    return (role === UserEnum.ROLE_STUDENT) ?
        ` company{ID name img_url img_position img_size ${extra} } ` :
        ` student{ID first_name last_name img_url img_pos img_size ${extra} } `;
}

export const ACTIVITY = "ACTIVITY";
export function loadActivity(types = AllActivityType) {

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
                select += ` sessions { ID created_at ${getEntitySelect(role, d)}} `;
                break;
            case ActivityType.QUEUE:
                select += ` queues { ID queue_num created_at ${getEntitySelect(role, d)}} `;
                break;
            case ActivityType.SESSION_REQUEST:
                select += ` session_requests { ID status created_at ${getEntitySelect(role, d)}} `;
                break;
            case ActivityType.PRESCREEN:
                select += ` prescreens { ID appointment_time special_type status ${getEntitySelect(role, d)}} `;
                break;
            case ActivityType.ZOOM_INVITE:
                select += (isRoleRec()) ? ` zoom_invites { ID join_url session_id created_at recruiter { first_name last_name user_email } ${getEntitySelect(role, d)}} ` : "";
                break;
            case ActivityType.GROUP_SESSION_JOIN:
                select += (isRoleStudent()) ? ` group_sessions { ID join_id updated_at start_time is_expired is_canceled join_url ${getEntitySelect(role, d)} }` : "";
                break;
        }

    });

    if (select != "") {
        var query = `query{user(ID:${user_id}){${select}}}`;

        return function (dispatch) {
            dispatch({
                type: ACTIVITY + type,
                payload: getAxiosGraphQLQuery(query)
            });
        };
    }

}

export function storeLoadActivity(types = AllActivityType) {
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
                        companies(cf:"${getCF()}") {
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
                        companies(cf:"${getCF()}") {
                            ID
                            img_url
                            img_size
                            img_position
                            name
                            type
                            status
                            group_url
                            vacancies_count
                        }
                }`)
        });
    };
}

export const SET_NON_AXIOS = "SET_NON_AXIOS";
export function setNonAxios(key, data) {
    return function (dispatch) {
        dispatch({
            type: SET_NON_AXIOS,
            payload: {
                key: key,
                data: data
            }
        });
    };
}