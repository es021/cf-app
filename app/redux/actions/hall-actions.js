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
    GroupSessionJoin,
    Notifications,
    Message
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
    GROUP_SESSION_JOIN: GroupSessionJoin.TABLE,
    NOTIFICATION_COUNT: Notifications.TABLE,
    INBOX_COUNT: Message.TABLE
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

function getIndependentQuery(oriQuery, types) {
    var user_id = getAuthUser().ID;
    var query = oriQuery;
    // untuk yang independent query
    if (types.length == 1 && types[0] == ActivityType.NOTIFICATION_COUNT) {
        if (typeof user_id !== "undefined") {
            query = `query{
              notifications(user_id : ${user_id}, is_read:0, ttl:true){
               ttl
              }
            }`;


            console.log("query",query);
            console.log("query",query);
            console.log("query",query);
            console.log("query",query);
            console.log("query",query);
            console.log("query",query);
        }
    }

    // untuk yang independent query
    if (types.length == 1 && types[0] == ActivityType.INBOX_COUNT) {
        if (typeof user_id !== "undefined") {
            if (isRoleStudent()) {
                query = `query{
                    messages_count(user_id : ${user_id}){
                    total_unread
                  }
                }`;
            } else if (isRoleRec()) {
                var c_id = getAuthUser().rec_company;
                query = `query{
                    messages_count(company_id : ${c_id}){
                    total_unread
                  }
                }`;
            }

        }
    }

    return query;
}

export function getActivityQueryAttr(type) {
    let select = "";
    var role = getAuthUser().role;
    switch (type) {
        case ActivityType.SESSION:
            select = ` ID created_at ${getEntitySelect(role, type)} `;
            break;
        case ActivityType.QUEUE:
            select = ` ID queue_num created_at ${getEntitySelect(role, type)} `;
            break;
        case ActivityType.SESSION_REQUEST:
            select = ` ID status created_at ${getEntitySelect(role, type)} `;
            break;
        case ActivityType.PRESCREEN:
            select = ` ${isRoleRec() ? "pic note recruiter{first_name last_name user_email}" : ""} ID company_id is_expired is_onsite_call join_url start_url appointment_time reschedule_time updated_at special_type status ${getEntitySelect(role, type)} `;
            break;
        case ActivityType.ZOOM_INVITE:
            select = ` ID join_url session_id created_at recruiter { first_name last_name user_email } ${getEntitySelect(role, type)} `;
            break;
        case ActivityType.GROUP_SESSION_JOIN:
            select = ` ID title join_id updated_at start_time is_expired is_canceled join_url ${getEntitySelect(role, type)} `;
            break;
    }
    return select;
}

export function getActivityQuery(types) {
    var user_id = getAuthUser().ID;
    var select = "";
    if (typeof types === "string") {
        types = [types];
    }
    types.map((d, i) => {
        switch (d) {
            case ActivityType.SESSION:
                select += ` sessions { ${getActivityQueryAttr(d)}} `;
                break;
            case ActivityType.QUEUE:
                select += ` queues { ${getActivityQueryAttr(d)}} `;
                break;
            case ActivityType.SESSION_REQUEST:
                select += ` session_requests { ${getActivityQueryAttr(d)}} `;
                break;
            case ActivityType.PRESCREEN:
                select += ` prescreens { ${getActivityQueryAttr(d)}} `;
                break;
            case ActivityType.ZOOM_INVITE:
                select += (isRoleRec()) ? ` zoom_invites { ${getActivityQueryAttr(d)}} ` : "";
                break;
            case ActivityType.GROUP_SESSION_JOIN:
                select += (isRoleStudent()) ? ` group_sessions { ${getActivityQueryAttr(d)} }` : "";
                break;
        }
    });
    var query = null;
    if (select != "") {
        query = `query{user(ID:${user_id}){${select}}}`;
    }
    return query;
}

export const ACTIVITY = "ACTIVITY";
export function loadActivity(types = AllActivityType) {
    var type = "";
    if (typeof types === "string") {
        types = [types];
    }
    types.map((d) => {
        type += ":" + d;
    });

    var query = getActivityQuery(types);
    query = getIndependentQuery(query, types);

    if (query != null) {
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
export function loadCompanies(limitLoad) {
    // vacancies_count
    // status
    // group_url
    let limitArgs = "";
    if(limitLoad){
        limitArgs = `,page:1, offset: ${limitLoad}`;
    }
    return function (dispatch) {
        dispatch({
            type: FETCH_COMPANIES,
            payload: getAxiosGraphQLQuery(
                `query{
                        companies(cf:"${getCF()}" ${limitArgs}) {
                            ID
                            img_url
                            img_size
                            img_position
                            banner_url
                            banner_size
                            banner_position
                            name
                            tagline
                            type  
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