import React, { PropTypes } from 'react';
import { ButtonLink, ButtonExport } from '../component/buttons.jsx';
import Form, { toggleSubmit } from '../component/form';
import * as layoutActions from '../redux/actions/layout-actions';
import { getCF, isRoleOrganizer } from '../redux/actions/auth-actions';
import CompanyPopup from './partial/popup/company-popup';
import obj2arg from 'graphql-obj2arg';
import { IsNewHall } from '../../config/app-config'

//importing for list
import List from '../component/list';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { Redirect, NavLink } from 'react-router-dom';
import { RootPath } from '../../config/app-config';
import { CompanyEnum, Company } from '../../config/db-config';
import { AppPath } from '../../config/app-config';
import GeneralFormPage from '../component/general-form.js';

function createCompanyTitleLink(d, search = "") {
    if (d == null) {
        return null;
    }
    var name = d.name;
    var focusedName = name.focusSubstring(search);
    focusedName = <NavLink target="_blank" to={AppPath + `/company/${d.ID}`} dangerouslySetInnerHTML={{ __html: focusedName }} ></NavLink>;
    return <span>{focusedName}</span>;


}

export function createCompanyTitle(d, search = "") {
    if (IsNewHall) {
        return createCompanyTitleLink(d, search);
    }

    if (d == null) {
        return null;
    }

    var name = d.name;
    var focusedName = name.focusSubstring(search);
    focusedName = <a onClick={() => {
        layoutActions.storeUpdateFocusCard(name, CompanyPopup, { id: d.ID, displayOnly: true })
    }} dangerouslySetInnerHTML={{ __html: focusedName }} ></a>;

    return <span>{focusedName}</span>;
}



class CompaniesPage extends React.Component {
    constructor(props) {
        super(props);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.searchFormOnSubmit = this.searchFormOnSubmit.bind(this);
        this.getMainQueryParam = this.getMainQueryParam.bind(this);
        this.loadData = this.loadData.bind(this);
        this.state = {
            error: null,
            disableSubmit: false,
            success: null,
            key: 1
        };
    }

    searchFormOnSubmit(d) {
        this.search = d;
        this.searchParams = "";

        this.searchParamGet = (key, val) => {
            return val != "" && typeof val !== "undefined" && val != null
                ? `${key}:"${val}",`
                : "";
        };

        for (var i in d) {
            if (Array.isArray(d[i])) {
                try {
                    d[i] = d[i][0];
                } catch (err) {
                    d[i] = "";
                }
            }
        }

        if (d != null) {
            this.searchParams += this.searchParamGet("search_name", d.search_name);
        }
        this.setState(prevState => {
            return { search: d };
        });
    }

    componentWillMount() {
        this.offset = 5;
        this.tableHeader = <thead>
            <tr>
                <th>#</th>
                <th>ID</th>
                <th>Company</th>
                <th>Details</th>
                <th>Student Listing <br></br><small>(Export excel here)</small></th>
                <th>Recruiters</th>
            </tr>
        </thead>;

        this.searchFormItem = [{
            label: "Company Name",
            name: "search_name",
            type: "text",
            placeholder: "Shell"
        }];

        this.addFormItem = [
            {
                name: Company.NAME,
                type: "text",
                placeholder: "Company Name",
                required: true
            }];
    }

    formOnSubmit(d) {
        //getAxiosGraphQLQuery
        toggleSubmit(this, { error: null });
        getAxiosGraphQLQuery(`mutation{add_company(name:"${d.name}"){ID name}}`).then((res) => {
            var mes = `Successfully Added New Company!`;
            toggleSubmit(this, { error: null, success: mes, key: this.state.key + 1 });
        });
    }

    loadData(page, offset) {
        var params = {
            include_sponsor: 1,
            order_by: "updated_at desc",
            page: page,
            offset: offset
        };

        if (isRoleOrganizer()) {
            params["cf"] = getCF();
        }

        // status
        // accept_prescreen


        return getAxiosGraphQLQuery(`
        query{
            companies(${this.getMainQueryParam(page, offset)}){
                ID
                name
                cf
                type
                sponsor_only
                recruiters{
                    ID user_email
                }
                priviledge
            }
        }`);
    };

    getMainQueryParam(page, offset) {
        var params = {
            include_sponsor: 1,
            order_by: "updated_at desc",
            page: page,
            offset: offset
        };
        if (isRoleOrganizer()) {
            params["cf"] = getCF();
        }

        let r = (this.searchParams ? this.searchParams : "")
            + " " + obj2arg(params, { noOuterBraces: true });
        return r;
    }

    renderList(d, i) {
        var row = [];

        //action
        row.push(<td className="text-center">
            <NavLink to={`${RootPath}/app/manage-company/${d.ID}/about`}>Edit</NavLink>
        </td>);


        // data from query
        var dismiss = ["type", "sponsor_only", "accept_prescreen", "priviledge"];
        var recs = null;
        for (var key in d) {
            if (dismiss.indexOf(key) >= 0) {
                continue;
            }
            if (key == "name") {
                var name = <b>
                    <ButtonLink
                        onClick={() => layoutActions.storeUpdateFocusCard(d.name, CompanyPopup, { id: d.ID })}
                        label={d.name}>
                    </ButtonLink>
                </b>;
                row.push(<td>
                    {name}
                    <br></br>
                    {CompanyEnum.getTypeStr(d.type)}
                </td>);
            }
            // else if (key == "status") {
            //     row.push(<td>
            //         <small>
            //             <ul className="normal">
            //                 <li>{(d.status)}</li>
            //                 {(d.sponsor_only) ? <li>Sponsor Only</li> : null}
            //                 {(d.accept_prescreen) ? <li>Accept Prescreen</li> : null}
            //             </ul>
            //         </small>
            //     </td>);
            // } 
            else if (key == "recruiters") {
                recs = d[key].map((rec, i) => {
                    return <li>{`${rec.user_email} (${rec.ID})`}</li>;
                });
            } else if (key == "cf") {
                var privs = d["priviledge"];
                privs = CompanyEnum.parsePrivs(privs);
                privs = privs.map((_d, i) => {
                    return <span>{_d}, </span>;
                });


                var cf = d.cf.map((_d, i) => {
                    return <span>{_d}, </span>;
                });

                let detail = <div>
                    <b><u>Career Fair</u></b><br></br>
                    {cf}
                    <br></br><br></br>
                    <b><u>Privilege</u></b><br></br>
                    {privs}
                </div>
                row.push(<td>{detail}</td>);

            }
            else {
                row.push(<td>{d[key]}</td>);
            }
        }

        // {d.accept_prescreen ? <ButtonExport action="prescreens" text="Prescreens"
        //         filter={{ company_id: d.ID }}></ButtonExport> : null}
        //export data
        // row.push(<td className="text-center">
        //     <ButtonExport action="student_listing" text="Student Listing"
        //         filter={{ company_id: d.ID, cf: getCF() }}></ButtonExport>
        //     {/* <ButtonExport action="prescreens" text="Prescreens"
        //         filter={{ company_id: d.ID }}></ButtonExport> */}
        //     {/* <ButtonExport action="resume_drops" text="Resume Drops"
        //         filter={{ company_id: d.ID }}></ButtonExport> */}
        //     {/* <ButtonExport action="sessions" text="Past Sessions"
        //         filter={{ company_id: d.ID }}></ButtonExport> */}
        //     {/* <ButtonExport action="session_requests" text="Session Request"
        //         filter={{ company_id: d.ID }}></ButtonExport> */}
        // </td>);

        // student listing
        row.push(<td><NavLink className="btn btn-gray btn-round-5" to={`${AppPath}/browse-student-company/${d.ID}`}>View Student Listing</NavLink></td>)

        //recruiter
        row.push(<td>
            <ul>{recs}</ul>
        </td>);

        return row;
    };

    getDataFromRes(res) {
        return res.data.data.companies;
    }

    render() {
        document.setTitle("Companies");
        var view = null;

        return (<div>
            {isRoleOrganizer() ? null :
                <div>
                    <h3>Add New Company</h3>
                    <Form className="form-row"
                        items={this.addFormItem}
                        onSubmit={this.formOnSubmit}
                        submitText="Add Company"
                        disableSubmit={this.state.disableSubmit}
                        error={this.state.error}
                        errorPosition="top"
                        emptyOnSuccess={true}
                        success={this.state.success}></Form>
                </div>
            }
            <h3>Companies</h3>
            {/* <List type="table"
                tableHeader={this.tableHeader}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
                offset={this.offset}
                key={this.state.key}
                renderList={this.renderList}></List> */}

            <GeneralFormPage
                tableHeader={this.tableHeader}
                hasResetFilter={false}
                searchFormNonPopup={true}
                searchFormItem={this.searchFormItem}
                searchFormOnSubmit={this.searchFormOnSubmit}
                entity_singular={"Company"}
                noMutation={true}
                dataOffset={this.offset}
                renderRow={this.renderList}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
            />
        </div>);
    }
}

export default CompaniesPage;
