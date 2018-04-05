import React from 'react';
import PropTypes from 'prop-types';
import PageSection from '../component/page-section';
import { CustomList } from '../component/list';
import { NavLink } from 'react-router-dom';
import ActivitySection from './partial/hall/activity';
import CompaniesSection from './partial/hall/companies';

import { UserEnum } from '../../config/db-config';
import { RootPath } from '../../config/app-config';
import { isRoleRec, getCFObj, getAuthUser } from '../redux/actions/auth-actions';

export default class HallPage extends React.Component {
    constructor(props) {
        super(props);
        this.getHighlight = this.getHighlight.bind(this);
        this.title = getCFObj().title;
        this.authUser = getAuthUser();
    }
    getHighlight() {
        var v = null;

        if (isRoleRec()) {
            var vData = [
                {
                    label: "Go To Forum"
                    , url: `${RootPath}/app/forum/company_${this.authUser.rec_company}`
                    , icon: "comments"
                }, {
                    label: "Pre-Screen"
                    , url: `${RootPath}/app/my-activity/pre-screen`
                    , icon: "filter"
                }, {
                    label: "Resume Drop"
                    , url: `${RootPath}/app/my-activity/resume-drop`
                    , icon: "download"
                }, {
                    label: "Manage Company"
                    , url: `${RootPath}/app/manage-company/${this.authUser.rec_company}/about`
                    , icon: "building"
                }
                /*
                 {
                    label: "Pre-Screen"
                    , url: `${RootPath}/app/my-activity/pre-screen`
                    , icon: "sign-in"
                }, 
                */
            ];

            var views = vData.map((d, i) => {
                return <span><i className={`fa left fa-${d.icon}`}></i>
                    <NavLink to={`${d.url}`}>{`${d.label}`}</NavLink>
                </span>;
            });

            v = <CustomList className="label"
                alignCenter={true} items={views}>
            </CustomList>;
        }
        return v;
    }
    render() {
        document.setTitle("Career Fair");
        return (<div>
            <h2>Welcome To {this.title}</h2>
            {this.getHighlight()}
            <PageSection title={null} body={ActivitySection}></PageSection>
            {(isRoleRec()) ? null : <PageSection title="Company Booth" body={CompaniesSection}></PageSection>}
        </div>);
    }
}



