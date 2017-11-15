import {getAxiosGraphQLQuery} from '../../../helper/api-helper';

export const FETCH_USER = "FETCH_USER";

export function loadUser(page) {
    var offset = 10;
    console.log("load page ",page);
    return function (dispatch) {
        dispatch({
            type: FETCH_USER,
            payload: getAxiosGraphQLQuery(
                     `query{
                            users(role:"student", page:${page}, offset:${offset}){
                                ID
                                first_name
                                last_name
                            }
                        }`)
        });
    };
}
