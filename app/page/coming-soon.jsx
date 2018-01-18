import React, { Component } from 'react';
import SponsorList from './partial/static/sponsor-list';

export default class ComingSoonPage extends React.Component {

    render() {
        document.setTitle("Coming Soon");
        return (<div>
            <h3>Coming Soon</h3>
            <SponsorList type="coming-soon"></SponsorList>
        </div>
        );
    }
}


