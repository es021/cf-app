import React, { Component } from 'react';
import FocusCard from '../component/focus-card';

export default class RightBarLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
    
        return(<right_bar>
            <FocusCard></FocusCard>
        </right_bar>);
    }
}