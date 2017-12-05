import {getAxiosGraphQLQuery} from '../../../helper/api-helper';

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
                            tagline
                            type
                            vacancies_count
                        }
                }`)
        });
    };
}

