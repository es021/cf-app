import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FacebookProvider, { Page, ShareButton } from 'react-facebook';
import { AppConfig } from '../../config/app-config';
import SponsorList from '../page/partial/static/sponsor-list';

export default class RightBarLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<right_bar>
            <FacebookProvider appId={AppConfig.FbAppId}>
                <Page href="https://www.facebook.com/innovaseedssolutions" tabs="timeline" />
            </FacebookProvider>
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