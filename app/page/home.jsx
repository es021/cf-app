import React, { Component } from 'react';
import {ButtonLink} from '../component/buttons';

export default class HomePage extends React.Component {

    handleRedirect() {
        browserHistory.push('/');
    }

    render() {

        return (
                <div>
                    Home Page New
                </div>
                );
    }
}


