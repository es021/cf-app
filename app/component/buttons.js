import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getXLSUrl } from '../redux/actions/other-actions';

require("../css/buttons.scss");

export class ButtonExport extends React.Component {

    componentWillMount() {
        this.url = getXLSUrl(this.props.action, this.props.filter);
    }

    render() {
        return (<a className="btn btn-sm btn-success" href={`${this.url}`}><i className="fa fa-file-excel-o left"></i>Export Data</a>);
    }
}

ButtonExport.propsType = {
    action: PropTypes.string.isRequired,
    filter: PropTypes.any
}

export class ButtonLink extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.href) {
            return (<a target={`${this.props.target}`} href={`${this.props.href}`} className="btn_link">{this.props.label}</a>);
        } else {
            return (<a onClick={this.props.onClick} className="btn_link">{this.props.label}</a>);
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
        var style = (this.props.style) ? this.props.style : {};
        style["fontSize"] = fontSize;

        var theme = (this.props.theme) ? this.props.theme : "";
        var icon = <i className={`fa fa-${this.props.icon}`}></i>;
        if (this.props.href) {
            return (<a style={style}
                target={`${this.props.target}`} href={`${this.props.href}`}
                className={`button-icon ${theme}`}>{icon}</a>);
        } else {
            return (<a style={style}
                onClick={this.props.onClick}
                className={`button-icon ${theme}`}>{icon}</a>);
        }
    }
}

ButtonIcon.propsType = {
    onClick: PropTypes.func.isRequired,
    size: PropTypes.oneOf(["lg", "md", PropTypes.string]).isRequired,
    icon: PropTypes.string.isRequired,
    theme: PropTypes.oneOf(["dark"]),
    style: PropTypes.object
};