import React, { PropTypes } from 'react';
import { ButtonLink } from '../component/buttons.jsx';
import GeneralFormPage from '../component/general-form';
import * as layoutActions from '../redux/actions/layout-actions';
import UserPopup from './partial/popup/user-popup';

//importing for list
import List from '../component/list';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { User, UserMeta } from '../../config/db-config';
import { Time } from '../lib/time';
import { createUserTitle } from './users';
import { createCompanyTitle } from './admin-company';


export default class AdminCf extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.offset = 10;
        this.tableHeader = <thead>
            <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Company</th>
                <th>Position</th>
                <th>Registered At</th>
            </tr>
        </thead>;

        //##########################################
        //  search
        this.searchParams = "";
        this.search = {};
        this.searchFormItem = [{ header: "Enter Your Search Query" },
        {
            label: "Find Recruiter",
            name: "search_user",
            type: "text",
            placeholder: "Type student name or email"
        }];

        this.searchFormOnSubmit = (d) => {
            this.search = d;
            this.searchParams = "";
            if (d != null) {
                this.searchParams += (d.search_user) ? `search_user:"${d.search_user}",` : "";
            }
        };


        this.loadData = (page, offset) => {
            return getAxiosGraphQLQuery(`
            query{
            users(${this.searchParams} role:"recruiter", page:${page}, offset:${offset}, order_by:"updated_at desc"){
                ID
                user_email
                first_name
                rec_company
                last_name
                company{ID name}
                rec_position 
                user_registered
            }
        }`);
        };


        this.renderRow = (d, i) => {
            var row = [];
            var dismiss = ["user_email", "last_name","rec_company"];

            for (var key in d) {
                if (dismiss.indexOf(key) >= 0) {
                    continue;
                }
                if (key == "first_name") {
                    row.push(<td>{createUserTitle(d, this.search.search_user)}</td>);
                } else if (key == "user_registered") {
                    row.push(<td>{Time.getString(d.user_registered)}</td>);
                } else if (key == "company") {
                    if (d.rec_company == -1) {
                        row.push(<td><span className="text-muted">Not Specified</span></td>);
                    } else {
                        row.push(<td>{createCompanyTitle(d.company)}</td>);
                    }
                } else {
                    row.push(<td>{d[key]}</td>);
                }
            }
            return row;
        }

        this.getDataFromRes = (res) => {
            return res.data.data.users;
        }


        // props for edit
        // create form add new default
        this.getFormItemAsync = (edit) => {
            var query = `query{
                companies{
                  ID name
                }
              }`

            return getAxiosGraphQLQuery(query)
                .then((res) => {
                    var companies = res.data.data.companies.map((d, i) => {
                        return { key: d.ID, label: d.name };
                    });


                    var ret = [{ header: "Recruiter Form" }];
                    //for create only
                    ret.push(...[{
                        name: User.ID,
                        type: "number",
                        required: true,
                        hidden: true,
                        disabled: true
                    },
                    {
                        label: "Select Company For This Recruiter",
                        name: UserMeta.REC_COMPANY,
                        type: "select",
                        required: true,
                        data: Array({ key: -1, label: "No Company" }, ...companies)
                    }]);

                    return ret;
                });
        }


        this.getEditFormDefault = (ID) => {
            const query = `query{user(ID:${ID}){
                ID rec_company
            }}`;

            return getAxiosGraphQLQuery(query).then((res) => {
                var user = res.data.data.user;
                return user;
            });
        }
    }

    render() {
        document.setTitle("Recruiters");
        return (<div><h3>Recruiterss</h3>

            <GeneralFormPage
                dataTitle={this.dataTitle}
                noMutation={true}
                canEdit={true}
                dataOffset={20}
                getFormItemAsync={this.getFormItemAsync}
                getEditFormDefault={this.getEditFormDefault}
                entity_singular="Recruiter"
                entity="user"
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

