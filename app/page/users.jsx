import React, {PropTypes} from 'react';
import {NavLink} from 'react-router-dom';
import {ButtonLink} from '../component/buttons';
import * as layoutActions from '../redux/actions/layout-actions';
import UserPopup from './partial/popup/user-popup';

//importing for list
import List from '../component/list';
import {getAxiosGraphQLQuery} from '../../helper/api-helper';

const offset = 10;

const loadData = function (page, offset) {
    return getAxiosGraphQLQuery(`
    query{
        users(role:"student", page:${page}, offset:${offset}){
            ID
            user_email
            first_name
            last_name
        }
    }`);
};

const renderList = function (d, i) {
    var param = {id: d.ID};

    var label = <span>{d.first_name} {d.last_name}<br></br>
        <small>{d.user_email}</small></span>;
    return(<li key={i}>
    <ButtonLink 
        onClick={() => layoutActions.storeUpdateFocusCard(d.first_name + " " + d.last_name, UserPopup, param)} 
        label={label}></ButtonLink>
    </li>);
};


class UsersPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        document.setTitle("Users");

        var loadingList = <div>Custom Loading</div>;
        return(<div> USERS
            <List listClass="test" 
                  customLoading = {loadingList}
                  dataKey ="users"
                  loadData={loadData} 
                  offset={offset} 
                  renderList={renderList}></List>
        </div>);

    }
}

export default UsersPage;
