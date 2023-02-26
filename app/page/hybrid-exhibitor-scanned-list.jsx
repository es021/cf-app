import React from "react";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import {
    getCF,
    isRoleRec,
    isRoleOrganizer,
    getCompanyId,
} from "../redux/actions/auth-actions";
import { RootPath, AppPath, UploadUrl } from "../../config/app-config";
import { Time } from "../lib/time";
import GeneralFormPage from "../component/general-form";
import { lang } from "../lib/lang";
import { ButtonExport } from "../component/buttons";
import { createUserTitle } from "./users";
import { _student_single } from "../redux/actions/text-action";
import { createCompanyTitle } from "./admin-company";
import HybridStatisticExhibitorScanned from "./partial/hybrid/hybrid-statistic-exhibitor-scanned";

export default class HybridExhibitorScannedList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
        //##########################################
        // List data properties
        this.renderRow = d => {
            // @custom_vacancy_info
            const isScannedByStudent = d.logged_in_user ? d.logged_in_user.role == "student" : false;
            return [
                <td className="text-center">
                    <a className="clickable" href={UploadUrl + "/" + d.qr.url} target="_blank">
                        <img src={UploadUrl + "/" + d.qr.url} height="45px" className="rounded-3xl" />
                    </a>
                </td>,
                <td>{createCompanyTitle(d.qr.company)}</td>,
                // <td>{JSON.stringify(d)}</td>,
                <td>{Time.getString(d.created_at)}</td>,
                <td>{d.logged_in_user
                    ? <div>
                        <div>
                            {
                                isScannedByStudent
                                    ? createUserTitle(d.logged_in_user)
                                    : `${d.logged_in_user.first_name} ${d.logged_in_user.last_name}`
                            }
                        </div>
                        <div className="text-muted">
                            <small>
                                {isScannedByStudent ? _student_single() : d.logged_in_user.role.capitalize()}
                            </small>
                        </div>
                    </div>
                    : '-'}</td>,
            ];
        };

        this.tableHeader = <thead>
            <tr>
                <th>{lang("QR")}</th>
                <th>{lang("QR Profile")}</th>
                <th>{lang("Scanned At")}</th>
                <th>{lang("Scanned By")}</th>
            </tr>
        </thead>;

        this.loadData = (page, offset) => {
            // @custom_vacancy_info
            var query = `query{
                qr_scans(
                    cf:"${getCF()}"
                    type:"company" 
                    ${isRoleRec() ? `company_id:${getCompanyId()}` : ``}
                    page:${page} 
                    offset:${offset}
                )
                { 
                    ID qr_id
                    qr{ url user{ ID first_name last_name user_email } company{ ID name } }
                    logged_in_user{ ID first_name last_name role }
                    created_at,
                }
            }`;
            return getAxiosGraphQLQuery(query);
        };
        this.getDataFromRes = res => {
            return res.data.data.qr_scans;
        };
    }
    getCountAndExport() {
        return <div className="container-fluid" style={{ margin: '32px 0px' }}>
            <HybridStatisticExhibitorScanned footer={<ButtonExport
                btnClass="link st-footer-link font-bold"
                action="hybrid_scanned_list"
                text={`Download Data`}
                filter={{
                    cf: getCF(),
                    type: "exhibitor",
                    company_id: isRoleRec() ? getCompanyId() : null
                }}></ButtonExport>} />
        </div>;
    }


    render() {
        return <div>
            <h2 className="text-left font-bold">{isRoleRec() ? `Your Profile QR Scanned` : `Exhibitor's QR Scanned`}</h2>
            <GeneralFormPage
                isSearchOnLeft={true}
                contentBelowTitle={this.getCountAndExport()}
                noMutation={true}
                dataTitle={<div className="pt-3"></div>}
                dataOffset={30}
                tableHeader={this.tableHeader}
                renderRow={this.renderRow}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
                forceDiff={this.forceDiff}
                acceptEmpty={this.acceptEmpty}
                formWillSubmit={this.formWillSubmit}
            ></GeneralFormPage>
        </div>;
    }
}