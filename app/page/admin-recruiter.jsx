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
import { createRecruiter } from '../redux/actions/auth-actions.jsx';

class CreateRecruiter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            preview: ""
        }
    }

    onClickCreateRecruiter(isPreview) {
        let v = this.text_create_recruiter.value;
        let arr = v.split("\n");
        let preview = "";

        for (var row of arr) {
            if (row) {

                let rowArr = row.split("\t");
                let companyId = rowArr[0];
                let userName = rowArr[1]
                let email = rowArr[2];
                let firstName = rowArr[3];
                let password = rowArr[4];
                let rec = {}

                rec[User.LOGIN] = userName;
                rec[UserMeta.REC_COMPANY] = companyId;
                rec[User.EMAIL] = email;
                rec[UserMeta.FIRST_NAME] = firstName;
                rec[User.PASSWORD] = password;

                if (isPreview) {
                    preview += `<tr>
                        <td>${companyId}</td>
                        <td>${userName}</td>
                        <td>${email}</td>
                        <td>${firstName}</td>
                        <td>${password}</td>
                    </tr>`;
                } else {
                    createRecruiter(rec).then((res) => {
                        console.log("success", res)
                    }).catch((err) => {
                        console.log("error", err)
                    })
                }
            }
        }

        if (isPreview) {
            preview = `
            <table class=" table table-striped table-bordered table-hover table-condensed text-left">
            <thead>
                <th>Company Id</th>
                <th>User Name</th>
                <th>Email</th>
                <th>First Name</th>
                <th>Password</th>
            </thead>
            <tbody>${preview}</tbody>
            </table>
            `
            this.setState({ preview: preview });
        } else {
            this.setState({ preview: "" });
        }
    }

    render() {
        let v = <div style={{ padding: "10px" }}>
            <b>Paste table here:</b><br></br>
            companyId   |   userName   |   email   |   firstName   |   password<br></br>
            <textarea style={{ width: "100%" }} ref={v => (this.text_create_recruiter = v)} rows="20"></textarea><br></br><br></br>
            <button onClick={() => { this.onClickCreateRecruiter(true) }} className="btn btn-md btn-round-5 btn-blue-light">Preview</button><br></br><br></br>
            <div dangerouslySetInnerHTML={{ __html: this.state.preview }}></div>
            <button disabled={!this.state.preview} onClick={() => { this.onClickCreateRecruiter() }} className="btn btn-md btn-round-5 btn-green">Create Bundle</button>
        </div>
        return v;
    }
}
export default class RecruitersPage extends React.Component {
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
            var dismiss = ["user_email", "last_name", "rec_company"];

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
                companies(order_by:"c.name asc"){
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

    openCreateRecPopup() {
        layoutActions.storeUpdateFocusCard("Create New Recruiter", CreateRecruiter, {});
    }

    render() {
        document.setTitle("Recruiters");
        return (<div><h3>Recruiters</h3>
            <button className="btn btn-sm btn-round-5 btn-green" onClick={() => { this.openCreateRecPopup() }}>Create New Recruiter</button>
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

