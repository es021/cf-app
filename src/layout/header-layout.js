import React, { Component } from 'react';
import {AppConfig} from '../config';

export default class HeaderLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(<header>
            {AppConfig.Name} {AppConfig.Desc}
        </header>);
    }
}