import {getAxiosGraphQLQuery} from '../../../helper/api-helper';

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
                is_activated
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