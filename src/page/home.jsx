import React, { Component } from 'react';
import {ButtonLink} from '../component/buttons';

export default class HomePage extends React.Component {

    handleRedirect() {
        browserHistory.push('/');
    }

    render() {
        var line = <div>Line <br></br></div>;
        var lines = []
        for (var i = 0; i < 100; i++) {
            lines.push(line);
        }
        return (
                <div>
                    Home Page New
                </div>
                );
    }
}


