import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dashboard, DashboardEnum } from '../../config/db-config';
import List, { ProfileListWide } from '../component/list';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { Time } from '../lib/time';

import GeneralFormPage from '../component/general-form';
import { getAuthUser, getCF, isRoleOrganizer, isRoleAdmin } from '../redux/actions/auth-actions';
import obj2arg from 'graphql-obj2arg';
import { getDataCareerFair } from '../component/form';

import { socketOn, emitLiveFeed } from '../socket/socket-client';
import { BOTH } from '../../config/socket-config';
import * as layoutActions from '../redux/actions/layout-actions';
import CompanyPopup from './partial/popup/company-popup';

require("../css/dashboard.scss");

export class AuditoriumFeed extends React.Component {
    constructor(props) {
        super(props);

        this.loadData = this.loadData.bind(this);
        this.getDataFromRes = this.getDataFromRes.bind(this);
        this.addFeedToView = this.addFeedToView.bind(this);
        this.listComponentDidUpdate = this.listComponentDidUpdate.bind(this);
        this.renderList = this.renderList.bind(this);
        this.offset = 10;

        this.state = {
            extraData: []
        }

        this.hasUpNext = false;
        this.hasNow = false;

        this.isInit = true;
    }

    componentDidMount() {
        socketOn(BOTH.LIVE_FEED, (data) => {
            this.addFeedToView(data);
        });
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
            auditoriums(page:${page},offset:${offset},cf:"${getCF()}",order_by:"start_time asc",now_only:true) {
              ID
              company{ID name img_url img_position img_size}
              type
              title
              link
              moderator
              start_time
              end_time
            }
          }`;

        return getAxiosGraphQLQuery(query);
    }

    getDataFromRes(res) {
        this.hasUpNext = false;
        this.hasNow = false;

        if (this.isInit) {
            this.scrollTo = "top";
            this.isInit = false;
        } else {
            this.scrollTo = "bottom";
        }
        return res.data.data.auditoriums;
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
        console.log(d);
        var timeNow = Time.getUnixTimestampNow();

        // DEBUG for Now
        if (i == 0) {
            d.start_time = timeNow;
            d.end_time = timeNow;
        }

        var item = [];

        if (!this.hasNow && d.start_time >= timeNow && d.end_time <= timeNow) {
            item.push(<h3>Now</h3>);
            this.hasNow = true;
        } else if (!this.hasUpNext) {
            item.push(<h3>Up Next</h3>);
            this.hasUpNext = true;
        }

        var isNew = isExtraData;
        var details = <div>
            {"with "}
            <a onClick={() => layoutActions.storeUpdateFocusCard(d.title
                , CompanyPopup, { id: d.company.ID, displayOnly: true, toggleable: false })}>
                {d.company.name}</a>
            <br></br>
            <small>
                <i className="fa fa-calendar left"></i>
                {Time.getDate(d.start_time)}
                <br></br>
                <i className="fa fa-clock-o left"></i>
                {Time.getStringShort(d.start_time) + " - " + Time.getStringShort(d.end_time)}
                <br></br>
                {d.moderator != null && d.moderator != ""
                    ? <span>Moderator - {d.moderator}</span> : null}
            </small>
        </div>

        item.push(
            <ProfileListWide title={d.title}
                img_url={d.company.img_url}
                img_pos={d.company.img_position}
                img_size={d.company.img_size}
                img_dimension={"80px"}
                body={details}
                action_text="Join Now"
                action_handler={() => { window.open(d.link) }}
                action_disabled={d.link == null || d.link == ""}
                type="company" key={i}>
            </ProfileListWide>);

        return item;
    };
    //<button onClick={() => this.addFeedToView({ ID: "a" })}>Add</button>

    render() {
        return <div>
            <h2>Auditorium<br></br>
                <small>Stay tuned for more webinar session with various companies</small>
            </h2>
            <List type="append-bottom"
                appendText="Load More Event"
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

// ###########################################################################################
// AUDITORIUM MANAGEMENT PAGE ###########################################################

export class AuditoriumManagement extends React.Component {
    constructor(props) {
        super(props);
        this.authUser = getAuthUser();
        this.CF = this.authUser.cf;
        console.log(this.CF);
        this.company_id = this.props.company_id;
    }

    componentWillMount() {

        this.successAddHandler = (d) => {
            emitLiveFeed(d.title, d.content, d.type, d.cf, Time.getUnixTimestampNow());
        };

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
            dataTitle="Auditorium Event Management"
            entity="auditorium"
            entity_singular="Auditorium Event"
            addButtonText="Add New Auditorium Event"
            dataOffset={10}
            tableHeader={this.tableHeader}
            newFormDefault={this.newFormDefault}
            getEditFormDefault={this.getEditFormDefault}
            getFormItem={this.getFormItem}
            renderRow={this.renderRow}
            getDataFromRes={this.getDataFromRes}
            loadData={this.loadData}
            successAddHandler={this.successAddHandler}
            formWillSubmit={this.formWillSubmit}
        ></GeneralFormPage>
    }
}