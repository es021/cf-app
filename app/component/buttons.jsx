import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getXLSUrl } from '../redux/actions/other-actions';
import { NavLink } from "react-router-dom";

// require("../css/buttons.scss");

export class ButtonExport extends React.Component {

    componentWillMount() {
        //this.url =;
    }

    render() {
        var style = {
            marginBottom: "5px"
        }
        return (<a style={style} className="btn btn-sm btn-success" href={getXLSUrl(this.props.action, this.props.filter)}><i className="fa fa-file-excel-o left"></i>
            {this.props.text}
        </a>);
    }
}

ButtonExport.propsType = {
    action: PropTypes.string.isRequired,
    filter: PropTypes.any,
    text: PropTypes.string
};

ButtonExport.defaultProps = {
    text: "Export Data"
};


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




export class ButtonAction extends React.Component {

    handleOnClick(isSub) {
        if (isSub) {
            this.isSub = true;
            console.log("is sub");
            this.props.subButtonOnClick();
        } else if (!this.isSub) {
            console.log("is main");
            this.props.onClick();
        }

        if (!isSub) {
            this.isSub = false;
        }
    }
    render() {
        let body = [
            <i className={`fa fa-${this.props.iconSize} fa-${this.props.icon}`}></i>,
            <br></br>,
            <b>{this.props.mainText}</b>,
            <br></br>
        ]

        let sub = null;
        if (this.props.subText) {
            sub = <small>{this.props.subText}</small>
        }

        if (this.props.subButtonText) {
            sub = <small><div
                onClick={() => { this.handleOnClick(true) }}
                className="inner-link">
                {this.props.subButtonText}
            </div></small >;
        }

        body.push(sub);

        if (this.props.to) {
            return <NavLink style={this.props.style}
                className={`btn ${this.props.btnClass} btn-action`}
                to={this.props.to}>
                {body}
            </NavLink>
        } else if (this.props.onClick) {
            return <div style={this.props.style}
                className={`btn ${this.props.btnClass} btn-action`}
                onClick={() => { this.handleOnClick(false) }}>
                {body}
            </div>
        }



    }
}

ButtonAction.propsType = {
    style: PropTypes.any,
    to: PropTypes.any,
    onClick: PropTypes.any,

    btnClass: PropTypes.any,
    iconSize: PropTypes.any,
    icon: PropTypes.any,
    // main text
    mainText: PropTypes.any,

    // sub text
    subText: PropTypes.any,
    subButtonText: PropTypes.any,
    subButtonOnClick: PropTypes.any,

};