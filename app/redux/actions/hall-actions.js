import {getAxiosGraphQLQuery} from '../../../helper/api-helper';

export const TRAFFIC = "HALL_TRAFFIC";
export function loadTraffic() {
    return function (dispatch) {
        dispatch({
            type: TRAFFIC,
            payload: getAxiosGraphQLQuery(
                     `query{
                        companies {
                            ID
                            active_queues {
                                student_id
                                created_at
                            }
                            active_prescreens {
                                student_id
                                created_at
                                appointment_time
                            }
                        }
                }`)
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
                            name
                            tagline
                        }
                }`)
        });
    };
}

