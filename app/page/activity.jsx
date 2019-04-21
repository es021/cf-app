import React, { Component } from 'react';
import { getAuthUser, isRoleRec, isRoleStudent } from '../redux/actions/auth-actions';
import SubNav from '../component/sub-nav';
import { SessionsList } from './partial/activity/session';
import { ResumeDrop } from './partial/activity/resume-drop';
import { StudentListing } from './partial/activity/student-listing.jsx';
import PropTypes from 'prop-types';
import { ScheduledInterview } from './partial/activity/scheduled-interview';


export default class ActivityPage extends React.Component {
    componentWillMount() {

        if (isRoleRec()) {
            this.company_id = getAuthUser().rec_company;
        }

        if (isRoleStudent()) {
            this.student_id = getAuthUser().ID;
        }

        this.key = 1;
    }

    getSubNavItem() {
        this.sub_page = (this.props.match.params.current) ? this.props.match.params.current : "session";

        var item = {};

        if (isRoleRec()) {
            item["student-listing"] = {
                label: "Interested Candidates",
                component: StudentListing,
                props: { company_id: this.company_id },
                icon: "users"
            }
            item["all-student"] = {
                label: "All Student",
                component: StudentListing,
                props: { company_id: this.company_id, isAllStudent: true },
                icon: "address-book-o",
            }
        }



        item["session"] = {
            label: "Past Sessions",
            component: SessionsList,
            props: { company_id: this.company_id, student_id: this.student_id, isRec: isRoleRec() },
            icon: "comments"
        };

        if (isRoleStudent()) {
            item["resume-drop"] = {
                label: "Resume Drop",
                component: ResumeDrop,
                props: { company_id: this.company_id, student_id: this.student_id, isRec: isRoleRec() },
                icon: "download"
            }
        }

        if (isRoleRec()) {
            /*
            item["pre-screen"] = {
                label: "Pre-Screen",
                component: ScheduledInterview,
                props: { company_id: this.company_id, prescreen_only: true },
                icon: "filter"
            };

            item["scheduled-session"] = {
                label: "Scheduled Session",
                component: ScheduledInterview,
                props: { company_id: this.company_id },
                icon: "clock-o"
            };
            */

        }

        var title = item[this.sub_page].label;
        document.setTitle(title);

        return item;
    }

    render() {
        if (this.company_id !== this.props.match.params.id) {
            this.key++;
        }

        // updated prop in here
        var item = this.getSubNavItem();

        return <div key={this.key}>
            <SubNav route={`my-activity`} items={item} defaultItem={this.sub_page}></SubNav>
        </div>;
    }
}


