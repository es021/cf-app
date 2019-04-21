import React from 'react';
import PropTypes from 'prop-types';
import PageSection from '../component/page-section';
import { CustomList, createIconLink } from '../component/list';
import { NavLink } from 'react-router-dom';
import ActivitySection from './partial/hall/activity';
import { GroupSessionView } from './partial/hall/group-session';
import CompaniesSection from './partial/hall/companies';
import ForumPage from './forum';

import { UserEnum } from '../../config/db-config';
import { RootPath } from '../../config/app-config';
import { isRoleRec, isRoleStudent, getCFObj, getAuthUser } from '../redux/actions/auth-actions';

export function getStudentListingBtn() {
    var text = <h3 style={{
        marginTop: "11px",
        marginLeft: "10px"
    }} className="text-left">
        Student Listing &<br></br>Resume Drop
    </h3>;

    var actData = [
        {
            label: "Schedule 1-1 Interview Here"
            , url: `${RootPath}/app/my-activity/student-listing`
            , icon: "users"
            , color: "#007BB4"
            , isNavLink: true
            , text: text
        }
    ];
    return createIconLink("lg", actData, true);
}

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
                    label: "Student Listing & Resume Drop"
                    , url: `${RootPath}/app/my-activity/student-listing`
                    , icon: "users"
                },
                /*
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


        var gSesion = null;
        if (isRoleRec()) {
            gSesion = <GroupSessionView forRec={true} company_id={this.authUser.rec_company}></GroupSessionView>;
            gSesion = <PageSection showOverflow={true} title="" body={gSesion}></PageSection>;
        }

        var companyBooth = null;
        if (isRoleStudent()) {
            companyBooth = <PageSection showOverflow={true} title={null} body={CompaniesSection}></PageSection>;
        }

        var midView = null;
        if (isRoleRec()) {

            var forum = <ForumPage isHomePage={true} forum_id={`company_${getAuthUser().company_id}`}></ForumPage>;
            midView = <div className="container-fluid" >
                <div className="row" >
                    <div className="col-md-6" style={{ marginTop: "20px" }}>
                        {getStudentListingBtn()}
                        <PageSection showOverflow={true} title={null} body={ActivitySection}></PageSection>
                    </div>
                    <div className="col-md-6">
                        <PageSection showOverflow={true} title="" body={forum}></PageSection>
                    </div>
                </div>
            </div>
        } else {
            midView = <PageSection showOverflow={true} title={null} body={ActivitySection}></PageSection>;
        }

        let titlePage = isRoleRec() ?
            <h2>Welcome To {this.title}</h2>:
            <h4>Welcome To {this.title}</h4>;
        return (<div>
            {this.props.isPreEvent ? <div className="line"></div>
                : titlePage}
            {gSesion}
            {companyBooth}
            {midView}
        </div>);
    }
}

HallPage.propTypes = {
    isPreEvent: PropTypes.bool
}

HallPage.defaultProps = {
    isPreEvent: false
}


