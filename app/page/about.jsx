import React, { Component } from 'react';

export default class AboutPage extends React.Component {
    handleRedirect() {
        browserHistory.push('/');
    }
    render() {
        document.setTitle("About");

        return (
                <div>About Page SOME</div>
                );
    }
}


