

import React, { Component } from "react";
import { AppPath } from "../../config/app-config";
import PropTypes from "prop-types";
import List from "../component/list";
import { NavLink } from "react-router-dom";
export default class ListBoard extends React.Component {
    constructor(props) {
        super(props);
        this.renderList = this.renderList.bind(this);

        this.state = {
        };
    }

    renderList(d, i) {
        return <div className="lb-list-item">
            {this.props.renderList(d, i)}
        </div>
    }

    render() {
        let list = null;
        if (this.props.customList) {
            list = <ul className="lb-list">
                {this.props.customList}
            </ul>
        } else {
            list = <List
                {...this.props}
                // key={this.state.key}
                // extraData={this.state.extraData}
                // type="append-bottom"
                isHidePagingTop={true}
                pageClass={"lb-paging"}
                type="list"
                listClass="lb-list"
                // listRef={v => (this.dashBody = v)}
                loadData={this.props.loadData}
                getDataFromRes={this.props.getDataFromRes}
                renderList={this.renderList}
                appendText={this.props.appendText}
                // hideLoadMore={this.props.hideLoadMore}
                offset={this.props.offset}
            />

        }
        let action = !this.props.action_text
            ? null
            : <div>
                <NavLink className="lb-action btn-link" to={AppPath + "/" + this.props.action_to}>
                    <i className={`fa fa-${this.props.action_icon} left`}></i>
                    {this.props.action_text}
                </NavLink>
            </div>

        return <div className="list-board">

            <div className="lb-title">
                <i className={`fa fa-${this.props.icon} left`}></i>
                {this.props.title}
                {action}
            </div>
            {list}
        </div>
    }
}
ListBoard.propTypes = {

};

ListBoard.defaultProps = {

};

