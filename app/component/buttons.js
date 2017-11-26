import React, { Component } from 'react';

export class ButtonLink extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.href) {
            return(<a target={`${this.props.target}`} href={`${this.props.href}`} className="btn_link">{this.props.label}</a>);
        } else {
            return(<a onClick={this.props.onClick} className="btn_link">{this.props.label}</a>);
        }
    }
}

/*
 * onClick
 * icon
 * size : lg | md | [any string]
 * theme : dark | empty
 */
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
            default:
                fontSize = this.props.size;
                break;
        }

        var style = {
            fontSize: fontSize
        };

        var theme = (this.props.theme) ? this.props.theme : "";
        var icon = <i className={`fa fa-${this.props.icon}`}></i>;
        if (this.props.href) {
            return(<a style={style} 
               target={`${this.props.target}`} href={`${this.props.href}`} 
               className={`button-icon ${theme}`}>{icon}</a>);
        } else {
            return(<a style={style} 
           onClick={this.props.onClick} 
           className={`button-icon ${theme}`}>{icon}</a>);
        }
    }
}