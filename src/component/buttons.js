import React, { Component } from 'react';

export class ButtonLink extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(<a onClick={this.props.onClick} className="btn_link">{this.props.label}</a>);
    }
}