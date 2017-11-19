import React, {PropTypes} from 'react';
import {NavLink} from 'react-router-dom';
import {ButtonLink} from '../component/buttons';
import * as layoutActions from '../redux/actions/layout-actions';
import UserPage from './user';

//importing for list
import List from '../component/list';
import {getAxiosGraphQLQuery} from '../../helper/api-helper';

const offset = 10;

const loadData = function (page, offset) {
    return getAxiosGraphQLQuery(`
    query{
        users(role:"recruiter", page:${page}, offset:${offset}){
            ID
            first_name
            last_name
        }
    }`);
};

const renderList = function (d, i) {
    var param = {id: d.ID};
    return(<li key={i}>
    <ButtonLink 
        onClick={() => layoutActions.storeUpdateFocusCard("Student Profile", UserPage, param)} 
        label={`${d.first_name} ${d.last_name}`}></ButtonLink>
    </li>);
};


class UsersPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        var loadingList = <div>Custom Loading</div>;
        return(<div> USERS
            <List className="test" 
                  loading = {loadingList}
                  dataKey ="users"
                  loadData={loadData} 
                  offset={offset} 
                  renderList={renderList} 
                  ></List>
        </div>);

    }
}

export default UsersPage;
