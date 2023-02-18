import React, { Component } from "react";
import { Redirect, NavLink } from "react-router-dom";
import Form, {
    toggleSubmit,
    checkDiff,
    getDataCareerFair
} from "../component/form";
import {
    Vacancy,
    VacancyEnum,
    CFSMeta,
} from "../../config/db-config";
import { getAxiosGraphQLQuery, postRequest } from "../../helper/api-helper";
import obj2arg from "graphql-obj2arg";
import {
    getCF,
    getAuthUser,
    isRoleRec,
    isRoleOrganizer,
    getCfCustomMeta,
    isCfFeatureOn,
} from "../redux/actions/auth-actions";
import * as layoutActions from "../redux/actions/layout-actions";
import VacancyPopup from "./partial/popup/vacancy-popup";
import PropTypes from "prop-types";
import { RootPath, AppPath, StatisticUrl } from "../../config/app-config";
import { Time } from "../lib/time";
import GeneralFormPage from "../component/general-form";
import { lang } from "../lib/lang";
import { addVacancyInfoIfNeeded, getVacancyType, isVacancyInfoNeeded } from "../../config/vacancy-config";
import { InterestedButton } from "../component/interested";
import { Loader } from "../component/loader";
import { StatisticFigure } from "../component/statistic";
import { ButtonExport } from "../component/buttons";
import HybridStatisticCheckIn from "./partial/hybrid/hybrid-statistic-check-in";
import { createUserTitle } from "./users";

export default class HybridCheckInList extends React.Component {
    constructor(props) {
        super(props);
        const authUser = getAuthUser();
        this.company_id = this.props.company_id;
        this.user_id = authUser.ID;
        this.state = {}
    }

    componentWillMount() {
        //##########################################
        // List data properties
        this.renderRow = d => {
            // @custom_vacancy_info

            return [
                <td>{createUserTitle(d.user)}</td>,
                <td>{Time.getString(d.created_at)}</td>,
                <td>{d.checked_in_by_user["first_name"]}</td>,
            ];
        };

        this.tableHeader = <thead>
            <tr>
                <th>{lang("Visitor")}</th>
                <th>{lang("Checked In At")}</th>
                <th>{lang("Checked In By")}</th>
            </tr>
        </thead>;

        this.loadData = (page, offset) => {
            // @custom_vacancy_info
            var query = `query{
                qr_check_ins(cf:"${getCF()}", page : ${page}, offset : ${offset})
                { 
                    created_at,
                    user {ID first_name last_name user_email},
                    checked_in_by_user {first_name last_name},
                }
            }`;
            return getAxiosGraphQLQuery(query);
        };
        this.getDataFromRes = res => {
            return res.data.data.qr_check_ins;
        };
    }

    getQueryParam({ page, offset, isCount }) {
        var param = isCount ? {} : {
            page: page,
            offset: offset,
        };
        if (isRoleOrganizer()) {
            param["cf"] = getCF();
            param["order_by"] = "company_id asc"
        } else {
            param["company_id"] = this.company_id;
            param["order_by"] = Vacancy.UPDATED_AT + " desc"
        }
        return obj2arg(param, { noOuterBraces: true });
    }




    getCountAndExport() {
        return <div className="container-fluid" style={{ margin: '32px 0px' }}>
            <HybridStatisticCheckIn footer={<ButtonExport
                btnClass="link st-footer-link font-bold"
                action="job_posts_by_cf"
                text={`Download Data`}
                filter={{
                    cf: getCF(),
                }}></ButtonExport>} />
        </div>;
    }


    render() {
        return <div>
            <h2 className="text-left font-bold">Visitor Check In Record</h2>
            <GeneralFormPage
                isSearchOnLeft={true}
                contentBelowTitle={this.getCountAndExport()}
                noMutation={true}
                dataTitle={<div className="pt-3"></div>}
                entity="vacancy"
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
HybridCheckInList.PropTypes = {
    company_id: PropTypes.number.isRequired
};
