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
import { Ads } from '../../config/ads-config';
require("../css/ads.scss");

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
        this.ads = this.getAds();
    }

    getEventPage() {
        if (this.CFObj.page_banner !== null && this.CFObj.page_url !== null) {
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
        } else {
            return null;
        }
    }


    getAds() {
        var v = [];

        /*
            background: linear-gradient( rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.4) ), url('https://seedsjobfair.com/career-fair/image/decoration/talent_corp.jpg');
                background-position-x: 0%, 0%;
                background-position-y: 0%, 0%;
                background-size: auto auto, auto auto;
            background-size: cover;
            background-position: center center;
        */

        for (var id in Ads) {
            var ads = Ads[id];
            var style = {
                background: `linear-gradient(rgba(0, 0, 0, 0.80),rgba(0, 0, 0, 0.45)), url('${ads.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center center"
            };

            v.push(<div className="right-bar-item">
                <div className="body">
                    <a id={id} onClick={(ev) => {
                        var adsId = ev.currentTarget.id;
                        addLog(LogEnum.EVENT_CLICK_ADS, adsId)
                    }}
                        target="blank"
                        href={ads.url}>
                        <div style={style} className="ads img img-responsive">
                            <div className="ads-text">
                                {ads.label}
                                <br></br>
                                <small>{ads.sublabel}</small>
                            </div>
                        </div>
                        <a className="btn btn-block btn-blue">
                            {ads.action}
                        </a>
                    </a>
                </div>
            </div>);
        }

        return v;
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
            {this.ads}
            {this.event_page}
        </right_bar>);
    }
}