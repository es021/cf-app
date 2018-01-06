import React, { PropTypes } from 'react';
import { ButtonLink } from '../component/buttons';
import * as layoutActions from '../redux/actions/layout-actions';
import UserPopup from './partial/popup/user-popup';

//importing for list
import List from '../component/list';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';

const offset = 10;


class CompaniesPage extends React.Component {
    constructor(props) {
        super(props);
    }

    loadData(page, offset) {
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


    renderList(d, i) {
        var param = { id: d.ID };

        var label = <span>{d.first_name} {d.last_name}<br></br>
            <small>{d.user_email}</small></span>;
        return (<li key={i}>
            <ButtonLink
                onClick={() => layoutActions.storeUpdateFocusCard(d.first_name + " " + d.last_name, UserPopup, param)}
                label={label}></ButtonLink>
        </li>);
    };

    getDataFromRes(res) {
        return res.data.data.users;
    }

    render() {
        document.setTitle("Users");

        var loadingList = <div>Custom Loading</div>;
        return (<div> <h3>Companies</h3>
            <List listClass="test"
                type="table"
                customLoading={loadingList}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
                offset={offset}
                renderList={this.renderList}></List>
        </div>);

    }
}

export default CompaniesPage;
