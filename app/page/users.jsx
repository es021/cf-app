import React, { PropTypes } from 'react';
import { ButtonLink } from '../component/buttons';
import * as layoutActions from '../redux/actions/layout-actions';
import UserPopup from './partial/popup/user-popup';

//importing for list
import List from '../component/list';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { Time } from '../lib/time';

class UsersPage extends React.Component {
    constructor(props) {
        super(props);
    }

    loadData(page, offset) {
        return getAxiosGraphQLQuery(`
        query{
            users(role:"student", page:${page}, offset:${offset}){
                ID
                cf
                user_email
                first_name
                last_name
                phone_number
                university
                major
                minor
                user_registered 
            }
        }`);
    };

    componentWillMount() {
        this.offset = 10;
        this.tableHeader = <thead>
            <tr>
                <th>ID</th>
                <th>CF</th>
                <th>Student</th>
                <th>Phone Number</th>
                <th>University</th>
                <th>Major & Minor</th>
                <th>Registered At</th>
            </tr>
        </thead>;
    }

    renderList(d, i) {
        var row = [];
        var dismiss = ["user_email", "last_name", "minor"];
        console.log(d);
        for (var key in d) {
            if (dismiss.indexOf(key) >= 0) {
                continue;
            }
            if (key == "first_name") {
                var label = <b>{d.first_name} {d.last_name}</b>;
                var title = <span>
                    <ButtonLink
                        onClick={() => layoutActions.storeUpdateFocusCard(d.first_name + " " + d.last_name, UserPopup, { id: d.ID })}
                        label={label}>
                    </ButtonLink><br></br>
                    <small>{d.user_email}</small>
                </span>;
                row.push(<td>{title}</td>);
            } else if (key == "major") {
                row.push(<td>{d.major}<br></br>{d.minor}</td>);
            } else if (key == "user_registered") {
                row.push(<td>{Time.getString(d.user_registered)}</td>);
            } else if (key == "cf" && d.cf.length > 1) {
                row.push(<td>{JSON.stringify(d.cf)}</td>);
            }
            else {
                row.push(<td>{d[key]}</td>);
            }
        }
        return <tr>{row}</tr>;
    }

    getDataFromRes(res) {
        return res.data.data.users;
    }

    render() {
        document.setTitle("Students");
        return (<div><h3>Students</h3>
            <List type="table"
                tableHeader={this.tableHeader}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
                offset={this.offset}
                renderList={this.renderList}></List>
        </div>);

    }
}

export default UsersPage;

