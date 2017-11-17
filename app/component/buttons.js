import React, { Component } from 'react';

export class ButtonLink extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(<a onClick={this.props.onClick} className="btn_link">{this.props.label}</a>);
    }
}

export class ButtonIcon extends React.Component {
    render() {
        var fontSize = "";
        switch (this.props.size) {
            case 'lg':
                fontSize = "2em";
                break;
            case 'md':
                fontSize = "1em";
                break;
        }

        var style = {
            fontSize: fontSize
        };

        return(<a style={style} onClick={this.props.onClick} className="button-icon"><i className={`fa fa-${this.props.icon}`}></i></a>);
    }
}