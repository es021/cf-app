import React, { Component } from 'react';
import ToogleTimezone from '../component/toggle-timezone';

export default class TestLayout extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        document.setTitle("Test");
        return (<div style={{padding: "10px"}}>
           <h3>Test</h3>
           <ToogleTimezone></ToogleTimezone>
        </div>);
    }
}