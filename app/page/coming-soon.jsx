import React, { Component } from 'react';
import SponsorList from './partial/static/sponsor-list';
import { getCFObj } from '../redux/actions/auth-actions';
import { Time } from '../lib/time';

export default class ComingSoonPage extends React.Component {
    constructor(props) {
        super(props);
        this.CF = getCFObj();
    }

    componentWillMount() {
        this.timeStr = Time.getPeriodString(this.CF.start, this.CF.end);
    }

    render() {
        document.setTitle("Coming Soon");
        return (<div>
            <h1>
                <small>Coming Soon</small>
                <br></br>
                {this.CF.title}
                <br></br>
                <small>{this.timeStr}</small>
            </h1>

            // TODO add timer
            // TODO add register prescreen

            <SponsorList type="coming-soon"></SponsorList>
        </div>
        );
    }
}


