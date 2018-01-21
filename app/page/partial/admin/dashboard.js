import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dashboard, DashboardEnum } from '../../../../config/db-config';
import List from '../../../component/list';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import { Time } from '../../../lib/time';
require("../../../css/dashboard.scss");

export class DashboardWall extends React.Component {
    constructor(props) {
        super(props);

        this.loadData = this.loadData.bind(this);
        this.getDataFromRes = this.getDataFromRes.bind(this);
        this.addFeedToView = this.addFeedToView.bind(this);
        this.listComponentDidUpdate = this.listComponentDidUpdate.bind(this);
        this.renderList = this.renderList.bind(this);
        this.offset = 2;

        this.state = {
            extraData: []
        }
        this.isInit = true;
    }

    listComponentDidUpdate() {
        //console.log("listComponentDidUpdate")
        //console.log(this.scrollTo);

        if (this.scrollTo == "bottom") {
            //scroll to bottom
            this.dashBody.scrollTop = 99999999;
            //console.log("go bottom");

        }

        if (this.scrollTo == "top") {
            //scroll to top
            this.dashBody.scrollTop = 0;
            //console.log("go top");
        }
        
        //console.log(this.dashBody.scrollTop);
        this.scrollTo == "";
    }

    // ##############################################################
    // function for list
    loadData(page, offset) {
        var query = `query{
            dashboards(cf:"${this.props.cf}",type:"${this.props.type}",page:${page},offset:${offset}){
                ID title content created_at}}`;

        return getAxiosGraphQLQuery(query);
    }

    getDataFromRes(res) {
        if (this.isInit) {
            this.scrollTo = "top";
            this.isInit = false;
        } else {
            this.scrollTo = "bottom";
        }
        return res.data.data.dashboards;
    }

    // from socket trigger
    addFeedToView(d) {
        this.scrollTo = "top";
        var newData = this.renderList(d, 0, true);
        // add to view
        this.setState((prevState) => {
            prevState.extraData.push(newData);
            return { extraData: prevState.extraData };
        });
    }

    renderList(d, i, isExtraData = false) {
        var isNew = isExtraData;
        var item = <div className={`db_item ${(isExtraData) ? "item_new" : ""} `}>
            <div className="db_item_title">{d.title}</div>
            <div className="db_item_time">{Time.getAgo(d.created_at)}</div>
            <p className="db_item_content" dangerouslySetInnerHTML={{ __html: d.content }}></p>
        </div>;

        return item;
    };
    //<button onClick={() => this.addFeedToView({ ID: "a" })}>Add</button>

    render() {
        return <div className="dashboard">
            <List type="append-bottom"
                appendText="Load Older Feed"
                listClass="db_body"
                componentDidUpdate={this.listComponentDidUpdate}
                listRef={(v) => this.dashBody = v}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
                extraData={this.state.extraData}
                offset={this.offset}
                renderList={this.renderList}></List>
        </div>;
    }
}

DashboardWall.propTypes = {
    cf: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
};