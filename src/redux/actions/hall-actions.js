import axios from 'axios';
import {getAxiosGraphQLQuery} from './_helper-actions';

export const TRAFFIC = "HALL_TRAFFIC";
export function loadTraffic() {
    return function (dispatch) {
        dispatch({
            type: TRAFFIC,
            payload: getAxiosGraphQLQuery(axios
                    , `query{
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
            payload: getAxiosGraphQLQuery(axios
                    , `query{
                        companies {
                            ID
                            name
                            tagline
                        }
                }`)
        });
    };
}

