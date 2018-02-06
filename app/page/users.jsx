import React, { PropTypes } from 'react';
import { ButtonLink } from '../component/buttons';
import GeneralFormPage from '../component/general-form';
import * as layoutActions from '../redux/actions/layout-actions';
import UserPopup from './partial/popup/user-popup';

//importing for list
import List from '../component/list';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { Time } from '../lib/time';

export function createUserTitle(d, search = "") {
    var name = `${d.first_name} ${d.last_name}`;
    var focusedName = name.focusSubstring(search);

    focusedName = <a onClick={() => {
        layoutActions.storeUpdateFocusCard(name, UserPopup, { id: d.ID })
    }} dangerouslySetInnerHTML={{ __html: focusedName }} ></a>;

    var focusedEmail = d.user_email.focusSubstring(search);
    focusedEmail = <span dangerouslySetInnerHTML={{ __html: focusedEmail }} ></span>;

    return <span>{focusedName}<br></br>{focusedEmail}</span>;
}

class UsersPage extends React.Component {
    constructor(props) {
        super(props);
    }

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

        //##########################################
        //  search
        this.searchParams = "";
        this.search = {};
        this.searchFormItem = [{ header: "Enter Your Search Query" },
        {
            label: "Find Student",
            name: "search_user",
            type: "text",
            placeholder: "Type student name or email"
        }, {
            label: "Find University",
            name: "search_university",
            type: "text",
            placeholder: "Iowa State University"
        }, {
            label: "Find Major / Minor",
            name: "search_degree",
            type: "text",
            placeholder: "Engineering"
        }
        ];

        this.searchFormOnSubmit = (d) => {
            this.search = d;
            this.searchParams = "";
            if (d != null) {
                this.searchParams += (d.search_user) ? `search_user:"${d.search_user}",` : "";
                this.searchParams += (d.search_university) ? `search_university:"${d.search_university}",` : "";
                this.searchParams += (d.search_degree) ? `search_degree:"${d.search_degree}",` : "";
            }
        };


        this.loadData = (page, offset) => {
            return getAxiosGraphQLQuery(`
            query{
            users(${this.searchParams} role:"student", page:${page}, offset:${offset}){
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


        this.renderRow = (d, i) => {
            var row = [];
            var dismiss = ["user_email", "last_name", "minor"];

            for (var key in d) {
                if (dismiss.indexOf(key) >= 0) {
                    continue;
                }
                if (key == "first_name") {
                    row.push(<td>{createUserTitle(d, this.search.search_user)}</td>);
                } else if (key == "major") {
                    var degree = `${d.major} ${d.minor}`;
                    degree = degree.focusSubstring(this.search.search_degree);
                    degree = <span dangerouslySetInnerHTML={{ __html: degree }} ></span>;
                    row.push(<td>{degree}</td>);

                } else if (key == "university") {
                    var university = d.university.focusSubstring(this.search.search_university);
                    university = <span dangerouslySetInnerHTML={{ __html: university }} ></span>;
                    row.push(<td>{university}</td>);

                } else if (key == "user_registered") {
                    row.push(<td>{Time.getString(d.user_registered)}</td>);

                } else if (key == "cf" && d.cf.length > 1) {
                    row.push(<td>{JSON.stringify(d.cf)}</td>);

                }
                else {
                    row.push(<td>{d[key]}</td>);
                }
            }
            return row;
        }

        this.getDataFromRes = (res) => {
            return res.data.data.users;
        }
    }


    // <List type="table"
    // tableHeader={this.tableHeader}
    // getDataFromRes={this.getDataFromRes}
    // loadData={this.loadData}
    // offset={1}
    // renderList={this.renderList}></List>

    render() {
        document.setTitle("Students");
        return (<div><h3>Students</h3>

            <GeneralFormPage
                dataTitle={this.dataTitle}
                noMutation={true}
                dataOffset={20}
                searchFormItem={this.searchFormItem}
                searchFormOnSubmit={this.searchFormOnSubmit}
                tableHeader={this.tableHeader}
                renderRow={this.renderRow}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
            ></GeneralFormPage>

        </div>);

    }
}

export default UsersPage;

