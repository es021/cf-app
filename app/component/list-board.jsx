

import React, { Component } from "react";
import PropTypes from "prop-types";
import List from "../component/list";

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
                // {...this.props}
                // key={this.state.key}
                // extraData={this.state.extraData}
                type="append-bottom"
                listClass="lb-list"
                // listRef={v => (this.dashBody = v)}
                loadData={this.props.loadData}
                getDataFromRes={this.props.getDataFromRes}
                renderList={this.renderList}
                appendText={this.props.appendText}
                // hideLoadMore={this.props.hideLoadMore}
                offset={this.props.offset}
            />

            // <List type="append-bottom"
            // appendText="Load Older Feed"
            // listClass="db_body"
            // componentDidUpdate={this.listComponentDidUpdate}
            // listRef={(v) => this.dashBody = v}
            // getDataFromRes={this.getDataFromRes}
            // loadData={this.loadData}
            // extraData={this.state.extraData}
            // offset={this.offset}
            // renderList={this.renderList}></List>

        }
        return <div className="list-board">
            <div className="lb-title"><i className={`fa fa-${this.props.icon} left`}></i>{this.props.title}</div>
            {list}
        </div>
    }
}
ListBoard.propTypes = {

};

ListBoard.defaultProps = {

};

