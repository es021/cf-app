import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NavLink} from 'react-router-dom';
require("../css/sub-nav.scss");
import {RootPath} from '../../config/app-config';

export default class SubNav extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        console.log( );

        this.state = {
            current: this.props.defaultItem
        };

    }

    getCurComponent() {
        var com = this.props.items[this.props.defaultItem].component;
        return  React.createElement(com);
    }

    changeItem(e) {
        var k = e.currentTarget.id;
        this.setState(() => {
            return{current: k};
        });
    }

    getNavList() {
        var li = [];
        for (var k in this.props.items) {
            var active = (k === this.props.defaultItem) ? "active" : "";
            var item = this.props.items[k];
            if (item.onClick) {
                li.push(<a><li id={k} className={active}
                       onClick={item.onClick}>
                        <i className={`fa fa-${item.icon}`}></i>
                        {item.label}
                    </li></a>);
            } else {
                li.push(<NavLink  to={`${RootPath}/app/edit-profile/${k}`}>
                <li id={k} className={active}
                    onClick={this.changeItem.bind(this)}>
                    <i className={`fa fa-${item.icon}`}></i>
                    {item.label}
                </li>
            </NavLink>);
            }
        }

        return <ul>{li}</ul>
    }

    render() {
        console.log("render");
        const sn = "sn-";
        var view = <div className="sub-nav">
            <div className={`${sn}header`}>
                {this.getNavList()}
            </div>
            <div className={`${sn}body`}>
                {this.getCurComponent()}
            </div>
        </div>;
        return view;
    }
}

SubNav.propTypes = {
    items: PropTypes.object.isRequired,
    defaultItem: PropTypes.string
};
