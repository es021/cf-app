import {getAxiosGraphQLQuery} from '../../../helper/api-helper';

export const FETCH_USER = "FETCH_USER";
// not used
export function loadUsers(page) {
    var offset = 50;
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

export function loadUser(id){
    return getAxiosGraphQLQuery(`
            query {
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
                status
                university
                phone_number
                grad_month
                grad_year
                sponsor
                cgpa
                major
                minor
                company_id
              }}`);
}