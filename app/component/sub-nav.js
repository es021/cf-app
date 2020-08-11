import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
// require("../css/sub-nav.scss");
import { RootPath } from '../../config/app-config';
import {lang} from '../lib/lang';

export default class SubNav extends React.Component {
    constructor(props) {
        super(props);
        // console.log(props);
        // console.log();

        this.state = {
            current: this.props.defaultItem,
            key: 1
        };

    }

    getCurComponent() {
        var com = this.props.items[this.props.defaultItem].component;
        var props = this.props.items[this.props.defaultItem].props;
        return React.createElement(com, props);
    }

    getCurItem(){
        var item = this.props.items[this.props.defaultItem];
        return item;
    }

    changeItem(e) {
        var k = e.currentTarget.id;
        this.setState((prevState) => {
            return { current: k, key: prevState.key + 1 };
        });
    }

    getNavList() {
        var li = [];
        for (var k in this.props.items) {
            var active = (k === this.props.defaultItem) ? "active" : "";
            var item = this.props.items[k];
            
            if(item.routeOnly){
                continue;
            }

            if (item.onClick) {
                li.push(<a><li id={k} className={active}
                    onClick={item.onClick}>
                    <i className={`fa fa-${item.icon}`}></i>
                    {lang(item.label)}
                </li></a>);
            } else {
                li.push(<NavLink to={`${RootPath}/app/${this.props.route}/${k}`}>
                    <li id={k} className={active}
                        onClick={this.changeItem.bind(this)}>
                        <i className={`fa fa-${item.icon}`}></i>
                        {lang(item.label)}
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
            {this.getCurItem().routeOnly === true ? null : <div className={`${sn}header`}>{this.getNavList()}</div>}
            <div key={this.state.key} className={`${sn}body`}>
                {this.getCurComponent()}
            </div>
        </div>;
        return view;
    }
}

SubNav.propTypes = {
    items: PropTypes.object.isRequired,
    props: PropTypes.obj,
    route: PropTypes.string.isRequired,
    defaultItem: PropTypes.string
};


