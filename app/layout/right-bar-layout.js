/*
import FacebookProvider, { Page, ShareButton } from 'react-facebook';
<FacebookProvider appId={AppConfig.FbAppId}>
                <Page href="https://www.facebook.com/innovaseedssolutions" tabs="timeline" />
</FacebookProvider>
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AppConfig } from '../../config/app-config';
import SponsorList from '../page/partial/static/sponsor-list';
import { DashboardWall } from '../page/partial/admin/dashboard';
import { getCF, getAuthUser, isRoleAdmin } from '../redux/actions/auth-actions';

export default class RightBarLayout extends React.Component {
    constructor(props) {
        super(props);
        this.CF = getCF();
        this.getDashboard = this.getDashboard.bind(this);
    }

    componentWillMount() {
        this.dashboard = this.getDashboard();
    }

    getDashboard() {
        var role = getAuthUser().role;
        var cf = getCF();
        if (!isRoleAdmin()) {
            return <div className="right-bar-item">
                <h4>Live Feed</h4>
                <div className="body">
                    <DashboardWall type="right-bar"
                        cf={cf}
                        type={role}>
                    </DashboardWall>
                </div>
            </div>
        }

        return null;
    }

    render() {
        return (<right_bar>
            {this.dashboard}
            <div className="right-bar-item">
                <h4>Sponsors</h4>
                <div className="body">
                    <SponsorList type="right-bar"
                        title={false}
                        part_com={false}
                        sponsor_size="sm"></SponsorList>
                </div>
            </div>
        </right_bar>);
    }
}