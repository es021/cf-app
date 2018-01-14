import {getAxiosGraphQLQuery} from '../../../helper/api-helper';
import {UserEnum} from '../../../config/db-config';

export const FETCH_USER = "FETCH_USER";
// not used
export function loadUsers(page) {
    var offset = 50;
    console.log("load page ", page);
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

export function loadUser(id, role) {
    var query = null;
    console.log(role);
    if (role === UserEnum.ROLE_STUDENT) {
        query = `query {
              user(ID:${id}) {
                ID
                user_email
                user_pass
                first_name
                last_name
                description
                role
                img_url
                img_pos
                img_size
                feedback
                user_status
                university
                phone_number
                graduation_month
                graduation_year
                sponsor
                cgpa
                major
                minor
              }}`;
    }

    if (role === UserEnum.ROLE_RECRUITER) {
        query = `query {
              user(ID:${id}) {
                ID
                user_email
                user_pass
                first_name
                last_name
                description
                role
                img_url
                img_pos
                img_size
                feedback
                rec_position
                rec_company
              }}`;
    }

    return getAxiosGraphQLQuery(query);
}