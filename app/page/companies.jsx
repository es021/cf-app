import React, { PropTypes } from 'react';
import { ButtonLink } from '../component/buttons';
import Form, { toggleSubmit } from '../component/form';
import * as layoutActions from '../redux/actions/layout-actions';
import { getCF, isRoleOrganizer } from '../redux/actions/auth-actions';
import CompanyPopup from './partial/popup/company-popup';
import obj2arg from 'graphql-obj2arg';

//importing for list
import List from '../component/list';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { Redirect, NavLink } from 'react-router-dom';
import { RootPath } from '../../config/app-config';
import { CompanyEnum, Company } from '../../config/db-config';

export function createCompanyTitle(d, search = "") {
    if(d == null){
        return null;
    }
    var name = d.name;
    var focusedName = name.focusSubstring(search);
    focusedName = <a onClick={() => {
        layoutActions.storeUpdateFocusCard(name, CompanyPopup, { id: d.ID })
    }} dangerouslySetInnerHTML={{ __html: focusedName }} ></a>;

    return <span>{focusedName}</span>;
}


class CompaniesPage extends React.Component {
    constructor(props) {
        super(props);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.state = {
            error: null,
            disableSubmit: false,
            success: null,
            key: 1
        };
    }

    componentWillMount() {
        this.offset = 50;
        this.tableHeader = <thead>
            <tr>
                <th>ID</th>
                <th>CF</th>
                <th>Company</th>
                <th>Recruiters</th>
            </tr>
        </thead>;

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
            order_by: "updated_at desc"
        };

        if (isRoleOrganizer()) {
            params["cf"] = getCF();
        }

        return getAxiosGraphQLQuery(`
        query{
            companies(${obj2arg(params, { noOuterBraces: true })}){
                ID
                cf
                name
                type
                sponsor_only
                recruiters{
                    ID user_email
                }
            }
        }`);
    };

    renderList(d, i) {
        var row = [];
        var dismiss = ["type", "sponsor_only"];
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
                    {(d.sponsor_only) ? <i><br></br>Sponsor Only</i> : null}
                </td>);
            } else if (key == "recruiters") {
                var recs = d[key].map((rec, i) => {
                    return <li>{`${rec.user_email} (${rec.ID})`}</li>;
                });

                row.push(<td>
                    <ul>{recs}</ul>
                </td>);

            } else if (key == "cf" && d.cf.length > 1) {
                row.push(<td>{JSON.stringify(d.cf)}</td>);
            }
            else {
                row.push(<td>{d[key]}</td>);
            }
        }

        row.push(<td className="text-center">
            <NavLink to={`${RootPath}/app/manage-company/${d.ID}/about`}>Edit</NavLink>
        </td>);
        return <tr>{row}</tr>;
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
            <List type="table"
                tableHeader={this.tableHeader}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
                offset={this.offset}
                key={this.state.key}
                renderList={this.renderList}></List>
        </div>);
    }
}

export default CompaniesPage;
