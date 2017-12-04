import React, {Component} from 'react';
import PropTypes from 'prop-types';

require("../css/sub-nav.scss");

export default class SubNav extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            current: this.props.defaultItem
        };

        this.changeItem = this.changeItem.bind(this);
    }

    getCurComponent() {
        var com = this.props.items[this.state.current].component;
        return  React.createElement(com);
    }

    changeItem(e) {
        var k = e.currentTarget.id;
        this.setState(() => {
            return{current: k};
        })

    }

    getNavList() {
        var li = [];
        for (var k in this.props.items) {
            var active = (k === this.state.current) ? "active" : "";
            var item = this.props.items[k];
            // this is how to handle onclick in for loop element
            li.push(<li id={k} className={active}  onClick={this.changeItem.bind(this)}>
                <i className={`fa fa-${item.icon}`}></i>{item.label}
            </li>);
        }

        return <ul>{li}</ul>
    }

    render() {
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
