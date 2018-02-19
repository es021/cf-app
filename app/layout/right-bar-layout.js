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
import { DashboardFeed } from '../page/dashboard';
import { getCF, getCFObj, getAuthUser, isRoleAdmin, isRoleOrganizer } from '../redux/actions/auth-actions';
import { addLog } from '../redux/actions/other-actions';
import { LogEnum } from '../../config/db-config';

export default class RightBarLayout extends React.Component {
    constructor(props) {
        super(props);
        this.CF = getCF();
        this.CFObj = getCFObj();
    }

    componentWillMount() {
        this.dashboard = this.getDashboard();
        this.sponsor = this.getSponsor();
        this.event_page = this.getEventPage();
    }

    getEventPage() {
        return <div className="right-bar-item">
            <div className="body">
                <a onClick={() => { addLog(LogEnum.EVENT_CLICK_EVENT_PAGE, "") }} target="blank" href={this.CFObj.page_url}>
                    <img className="img img-responsive" src={this.CFObj.page_banner}></img>
                    <a className="btn btn-block btn-blue">
                        <i className="fa fa-facebook left"></i>
                        Visit Event Page
                    </a>
                </a>
            </div>
        </div>;
    }

    getSponsor() {
        return <div className="right-bar-item">
            <h4>Sponsors</h4>
            <div className="body">
                <SponsorList type="right-bar"
                    title={false}
                    part_com={false}
                    sponsor_size="sm"></SponsorList>
            </div>
        </div>;
    }

    getDashboard() {
        var role = getAuthUser().role;
        var cf = getCF();
        if (!isRoleAdmin() && !isRoleOrganizer()) {
            return <div className="right-bar-item">
                <h4>Live Feed</h4>
                <div className="body">
                    <DashboardFeed type="right-bar"
                        cf={cf}
                        type={role}>
                    </DashboardFeed>
                </div>
            </div>
        }

        return null;
    }

    render() {
        return (<right_bar id="right_bar">
            {this.dashboard}
            {this.sponsor}
            {this.event_page}
        </right_bar>);
    }
}