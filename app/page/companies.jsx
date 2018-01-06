import React, { PropTypes } from 'react';
import { ButtonLink } from '../component/buttons';
import * as layoutActions from '../redux/actions/layout-actions';
import CompanyPopup from './partial/popup/company-popup';

//importing for list
import List from '../component/list';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { Redirect, NavLink } from 'react-router-dom';
import { RootPath } from '../../config/app-config';
import { CompanyEnum } from '../../config/db-config';

class CompaniesPage extends React.Component {
    constructor(props) {
        super(props);
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
    }

    loadData(page, offset) {
        return getAxiosGraphQLQuery(`
        query{
            companies{
                ID
                cf
                name
                type
                recruiters{
                    ID user_email
                }
            }
        }`);
    };

    renderList(d, i) {
        var row = [];
        var dismiss = ["type"];
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

        return (<div><h3>Companies</h3>
            <List type="table"
                tableHeader={this.tableHeader}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
                offset={this.offset}
                renderList={this.renderList}></List>
        </div>);
    }
}

export default CompaniesPage;
