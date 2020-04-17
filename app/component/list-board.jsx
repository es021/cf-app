

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
                pagingLimit={5}
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
            : <NavLink className="btn btn-md btn-round-5 btn-green-outline btn-bold" to={AppPath + "/" + this.props.action_to}>
                <i className={`fa fa-${this.props.action_icon} left`}></i>
                {this.props.action_text}
            </NavLink>
        // lb-action 


        return <div className="list-board" style={{marginBottom : this.props.isNoMarginBottom ? "0px" : ""}}>
            {/* title */}
            {this.props.isNoTitle ? null :
                <div className="lb-title">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-8 no-padding lb-title-text">
                                <i className={`fa fa-${this.props.icon} left`}></i>
                                {this.props.title}
                            </div>
                            <div className="col-md-4 no-padding lb-title-action">
                                {action}
                            </div>
                        </div>
                    </div>
                </div>
            }
            {/* filter */}
            {this.props.filter ? <div className="lb-filter">{this.props.filter}</div> : null}
            {/* list */}
            {list}
        </div>
    }
}
ListBoard.propTypes = {
    isNoTitle: PropTypes.bool,
    isNoMarginBottom: PropTypes.bool,
};

ListBoard.defaultProps = {
    isNoTitle: false,
    isNoMarginBottom: false,
};

