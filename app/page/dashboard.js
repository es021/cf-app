import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dashboard, DashboardEnum } from '../../config/db-config';
import List from '../component/list';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { Time } from '../lib/time';

import GeneralFormPage from '../component/general-form';
import { getAuthUser, getCF, isRoleOrganizer, isRoleAdmin } from '../redux/actions/auth-actions';
import obj2arg from 'graphql-obj2arg';
import { getDataCareerFair } from '../component/form';

require("../css/dashboard.scss");

export class DashboardFeed extends React.Component {
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

DashboardFeed.propTypes = {
    cf: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
};


// ###########################################################################################
// ADMIN DASHBOARD MANAGEMENT PAGE ###########################################################

export default class DashboardPage extends React.Component {
    constructor(props) {
        super(props);
        this.authUser = getAuthUser();
        this.CF = this.authUser.cf;
        console.log(this.CF);
        this.company_id = this.props.company_id;
    }

    componentWillMount() {
        //##########################################
        // List data properties
        this.renderRow = (d) => {
            return [
                <td>{d.ID}</td>
                , <td>{d.cf}</td>
                , <td>{d.type}</td>
                , <td>
                    <b>{d.title}</b>
                    <p dangerouslySetInnerHTML={{ __html: d.content }}></p>
                </td>
                , <td>{Time.getString(d.created_at)}</td>
            ];
        };

        this.tableHeader = <thead>
            <tr>
                <th>ID</th>
                <th>Career Fair</th>
                <th>Sent To</th>
                <th>Announcement</th>
                <th>Sent At</th>
            </tr>
        </thead>;

        this.loadData = (page, offset) => {
            var param = {
                cf: this.CF,
                page: page,
                offset: offset
            };

            var query = `query{dashboards(${obj2arg(param, { noOuterBraces: true })})
            {ID title content cf type created_at}}`;
            return getAxiosGraphQLQuery(query);
        }

        // get actual data from loadData
        // can alter any data here too
        this.getDataFromRes = (res) => {
            return res.data.data.dashboards;
        }

        //##########################################
        // form operation properties

        // if ever needed
        // hook before submit
        this.formWillSubmit = (d, edit) => {
            return d;
        }

        this.getEditFormDefault = (ID) => {
            const query = `query{dashboard(ID:${ID}){ID title content type created_at}}`;
            return getAxiosGraphQLQuery(query).then((res) => {
                var data = res.data.data.dashboard;
                return data;
            });
        }

        // create form add new default
        this.newFormDefault = {};
        this.newFormDefault[Dashboard.CF] = this.CF;
        this.newFormDefault[Dashboard.CREATED_BY] = this.authUser.ID;


        this.getFormItem = (edit) => {
            var ret = [{ header: "Announcement Form" }];

            if (isRoleAdmin()) {
                ret.push({
                    label: "Select Career Fair",
                    name: Dashboard.CF,
                    type: "radio",
                    data: getDataCareerFair("login"),
                    required: true
                });
            } else {
                ret.push({
                    label: "CF",
                    name: Dashboard.CF,
                    type: "text",
                    disabled: true,
                    hidden: true,
                    required: (!edit)
                });
            }

            ret.push(...[
                {
                    label: "Send To",
                    name: Dashboard.TYPE,
                    type: "select",
                    required: true,
                    data: [DashboardEnum.TYPE_STUDENT, DashboardEnum.TYPE_RECRUITER]
                }, {
                    label: "Title",
                    name: Dashboard.TITLE,
                    type: "text",
                    placeholder: "",
                    required: true
                }, {
                    label: "Content",
                    sublabel: <div>To add link use syntax as the following<br></br>
                        {"<a target='_blank' href='https://www.url.com'>Click Here</a>"}
                    </div>,
                    name: Dashboard.CONTENT,
                    type: "textarea",
                    placeholder: "",
                    required: true
                }, {
                    label: "Created By",
                    name: Dashboard.CREATED_BY,
                    type: "number",
                    disabled: true,
                    hidden: true,
                    required: (!edit)
                }
            ]);

            return ret;
        }
    }

    render() {
        return <GeneralFormPage
            dataTitle="Live Feed Management"
            entity="dashboard"
            entity_singular="Announcement"
            addButtonText="Add New Announcement"
            dataOffset={10}
            tableHeader={this.tableHeader}
            newFormDefault={this.newFormDefault}
            getEditFormDefault={this.getEditFormDefault}
            getFormItem={this.getFormItem}
            renderRow={this.renderRow}
            getDataFromRes={this.getDataFromRes}
            loadData={this.loadData}
            formWillSubmit={this.formWillSubmit}
        ></GeneralFormPage>
    }
}