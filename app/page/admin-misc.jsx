import React, { PropTypes } from 'react';
import SubNav from '../component/sub-nav';
import AdminZoom from './admin-zoom';
import { AuditoriumManagement } from './auditorium';
import AdminStudentPage from './admin-student';
import AdminCompanyPriority from './admin-company-priority';
import AdminRef from './admin-ref';
import AdminJobPostBundle from './admin-job-post-bundle';

// create sub page here
export default class AdminMisc extends React.Component {
    componentWillMount() {
        this.item = {
            "job-post-bundle": {
                label: "Create Job Post",
                component: AdminJobPostBundle,
                icon: "suitcase"
            },
            // "kpt-jpa": {
            //     label: "JPA's IC Dataset",
            //     component: AdminKptJpa,
            //     icon: "list"
            // },
            "ref": {
                label: "Create Dataset",
                component: AdminRef,
                icon: "list"
            },
            "company": {
                label: "Manage Company Priority",
                component: AdminCompanyPriority,
                icon: "suitcase"
            },
            "download-student-data": {
                label: "Download Student Data",
                component: AdminStudentPage,
                icon: "user"
            },
            "zoom-api": {
                label: "Zoom API",
                component: AdminZoom,
                icon: "video-camera"
            },
            "manage-webinar": {
                label: "Manage Webinar",
                component: AuditoriumManagement,
                icon: "microphone"
            },

            // , "organization-enquiries": {
            //     label: "Organization Enquiries",
            //     component: MetaSubPage,
            //     props: { type: "org_en", title: "Organization Enquiries" },
            //     icon: "users"
            // }
            // , "company-enquiries": {
            //     label: "Company Enquiries",
            //     component: MetaSubPage,
            //     props: { type: "com_en", title: "Company Enquiries" },
            //     icon: "building"
            // }
            // , "qs-popup": {
            //     label: "User Answers",
            //     component: QsPopupList,
            //     icon: "file-text-o"
            // }
            // , "manage-qs-popup": {
            //     label: "Manage Question Popup",
            //     component: ManageQsPopup,
            //     icon: "edit"
            // }
            // , "feedback": {
            //     label: "Feedback",
            //     component: FeedbackList,
            //     icon: "file-text-o"
            // }
            // , "manage-feedback": {
            //     label: "Manage Feedback",
            //     component: ManageFeedback,
            //     icon: "edit"
            // }
        };
    }

    render() {
        var title = this.item[this.props.match.params.current].label;
        document.setTitle(title);
        return <SubNav route="misc" items={this.item} defaultItem={this.props.match.params.current}></SubNav>;
    }
}


