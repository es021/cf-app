import React, { Component } from 'react';
import { BOTH } from '../../config/socket-config';
import UserPopup from './partial/popup/user-popup';
import CompanyPopup from './partial/popup/company-popup';
import { socketEmit, socketOn, emitState, isSocketOkay } from '../socket/socket-client';
import * as layoutActions from '../redux/actions/layout-actions';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { Time } from '../lib/time';
import { Loader } from '../component/loader';
import Tooltip from '../component/tooltip';
import { isRoleRec, getAuthUser, isRoleStudent, getCF } from '../redux/actions/auth-actions';
import { getStyleImageObj } from '../component/profile-card';

require("../css/overview.scss");

export class Overview extends React.Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);

        this.renderHallDetail = this.renderHallDetail.bind(this);
        this.renderAllOnline = this.renderAllOnline.bind(this);
        this.isUserOnline = this.isUserOnline.bind(this);
        this.isCompanyOnline = this.isCompanyOnline.bind(this);
        this.createLegends = this.createLegends.bind(this);
        this.state = {
            loading: true,
            online_company: {},
            data: [],
            online_clients: []

            // queue_detail: {},
            // queue: {},
            // sessions: [],
            // requests: [],
        };

        this.color = {
            online: "#449d44",
            you: "#22537c"
        }

        this.CF = getCF();
    }

    componentWillMount() {

        this.FOR_REC = isRoleRec();
        this.FOR_STUDENT = isRoleStudent();

        this.LEGENDS = this.createLegends();


        socketOn(BOTH.STATE, (data) => {
            this.setState((prevState) => {
                for (var i in data) {
                    prevState[i] = data[i];
                }

                prevState.loading = false;
                return prevState;
            });
        });
    }


    createLegends() {

        var shape = <div className="legends hall-activity">
            <div className="legend-item">{this.createIconEmpty("cornered")}Active Session</div>
            <div className="legend-item">{this.createIconEmpty("square")}Scheduled Session</div>
            <div className="legend-item">{this.createIconEmpty("circle")}Session Request</div>
        </div>;
        var color = <div className="legends hall-activity">
            <div className="legend-item">{this.createIconEmpty("circle", this.color.online)}Online</div>
            <div className="legend-item">{this.createIconEmpty("circle")}Offline</div>
            <div className="legend-item">{this.createIconEmpty("circle", this.color.you)}You</div>
        </div>;

        return <div className="table-responsive">
            <table className="table-fit table table-bordered table-condensed">
                <tbody>
                    <tr>
                        <td><b>Shape Indicator</b></td>
                        <td>{shape}</td>
                    </tr>
                    <tr>
                        <td><b>Color Indicator</b></td>
                        <td>{color}</td>
                    </tr>
                </tbody>
            </table>
        </div>;
    }


    refresh() {
        this.setState(() => {
            return { loading: true };
        })

        this.lastUpdated = Time.getStringShort(Time.getUnixTimestampNow(), true);

        var query = `query{ 
              companies(order_by:"type" cf:"${this.CF}"){
              ID type name img_url img_size img_position
              active_sessions{
                participant_id
                created_at
              }
              active_prescreens {
                student_id
                special_type
                appointment_time
              }
              pending_requests{
                status
                student_id
                created_at
            }}}`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState((prevState) => {
                return { data: res.data.data.companies };
            })
        });

        emitState(["online_company", "online_clients"]);
    }

    /*
    refreshOLD() {
        this.setState(() => {
            return { loading: true };
        })

        this.lastUpdated = Time.getStringShort(Time.getUnixTimestampNow(), true);

        //load session
        var query = `query{
            sessions(status:"Active") {
              host_id
              participant_id
              company_id
              created_at
            }
           }`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState((prevState) => {
                return { sessions: res.data.data.sessions };
            })
        });

        //load request
        var query = `query{session_requests(order_by:"created_at asc", status:"Pending"){
            ID company_id
            student_id
            created_at }}`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState((prevState) => {
                return { requests: res.data.data.session_requests };
            })
        });

        //emitState();
    }
    */

    componentDidMount() {
        this.refresh();
    }

    createIconEmpty(shape, color = "") {
        var style = { backgroundColor: color };
        var className = shape;
        return <div style={style} className={`icon ${className} small`}><div></div></div>;
    }

    createIcon(id, type, shape = "", tooltip = null, noClick = false, style = {}) {
        var className = shape + " ";
        var label = id;

        if (type == "company") {
            if (this.isCompanyOnline(id)) {
                className += " active ";
            }
            var onClick = (e) => {
                var id = e.currentTarget.dataset.entity_id;
                id = Number.parseInt(id);
                layoutActions.storeUpdateFocusCard("Company " + id
                    , CompanyPopup
                    , { id: id, displayOnly: true })
            };
        }

        if (type == "user") {

            if (id == getAuthUser().ID) {
                style["backgroundColor"] = this.color.you;
                style["fontSize"] = "75%";
                label = <b>YOU</b>;
            }

            if (this.isUserOnline(id)) {
                className += " active";
            }

            var onClick = (e) => {
                var id = e.currentTarget.dataset.entity_id;
                layoutActions.storeUpdateFocusCard("User " + id
                    , UserPopup
                    , { id: id })
            };
        }

        if (noClick) {
            onClick = null;
        }

        return <div style={style}
            title={tooltip} className={`icon ${className} ${noClick ? "" : "clickable"}`}
            data-entity_id={id} onClick={onClick}><div>
                {shape == "company" ? null : label}
            </div></div>;

    }

    renderAllOnline() {
        var vs = [];

        for (var id in this.state.online_clients) {
            vs.push(this.createIcon(id, "user", "circle"));
        }

        if (vs.length == 0) {
            return null;
        }

        return <div style={{ flexWrap: "wrap" }} className="hall-activity">{vs}</div>;
    }

    createIconCompany(comData) {
        var style = getStyleImageObj("company", comData.img_url, comData.img_size, comData.img_position, "40px");
        style.backgroundRepeat = "no-repeat";
        style.backgroundColor = "white";
        var v = this.createIcon(comData.ID, "company", "company", null, false, style);
        return v;
    }

    renderHallDetail() {
        var vs = [];
        for (var i in this.state.data) {
            var d = this.state.data[i];
            var com_id = d.ID;

            // set if student clickable 
            var noClick = false;
            if (this.FOR_REC) {
                noClick = true;
                // for limited rec, only under queue can be seen
                if (com_id == getAuthUser().rec_company) {
                    noClick = false;
                }
            }

            if (this.FOR_STUDENT) {
                noClick = true;
            }

            // company
            var com = <Tooltip
                bottom="45px"
                left="-26px"
                width="99px"
                content={this.createIconCompany(d)}
                tooltip={d.name}>
            </Tooltip>;

            // active sessions
            var sessions = d.active_sessions.map((d, i) => {
                var c = this.createIcon(d.participant_id, "user", "cornered"
                    , null, noClick);

                return <Tooltip
                    bottom="33px"
                    left="-17px"
                    width="70px"
                    content={c}
                    tooltip={Time.getAgo(d.created_at)}>
                </Tooltip>
            });

            // scheduled sessions
            var si = d.active_prescreens.map((d, i) => {
                var c = this.createIcon(d.student_id, "user", ""
                    , null, noClick);

                return <Tooltip
                    bottom="33px"
                    left="-54px"
                    width="144px"
                    content={c}
                    tooltip={<span>{d.special_type}<br></br>{Time.getString(d.appointment_time)}</span>}>
                </Tooltip>
            });

            // pending session request
            var sr = d.pending_requests.map((d, i) => {
                var c = this.createIcon(d.student_id, "user", "circle"
                    , null, noClick);

                return <Tooltip
                    bottom="33px"
                    left="-17px"
                    width="70px"
                    content={c}
                    tooltip={<span>{Time.getAgo(d.created_at)}</span>}>
                </Tooltip>
            });

            vs.push(
                <div className="icon-container">
                    {com}
                    {sessions}
                    {si}
                    {sr}
                </div>);
        }

        return (<div>{this.LEGENDS}
            <div className="hall-activity">
                {vs}
            </div>
        </div>);
    }


    isUserOnline(id) {
        return typeof this.state.online_clients[id] !== "undefined"
    }

    isCompanyOnline(id) {
        if (typeof this.state.online_company[id] === "undefined") {
            return false;
        }

        if (Object.keys(this.state.online_company[id]).length <= 0) {
            return false;
        }

        return true;
    }

    render() {
        document.setTitle("Monitor");
        var hall = this.renderHallDetail();

        var onlines = (this.FOR_REC || this.FOR_STUDENT) ? null : this.renderAllOnline();

        var refreshBtn = (this.state.loading) ?
            <Loader size="3" text="Fetching latest update.."></Loader> :
            <div><a className="btn btn-sm btn-blue" onClick={() => this.refresh()}>
                <i className="fa fa-refresh left"></i>Refresh <small>( Last Updated {this.lastUpdated} )</small>
            </a></div>;

        var warning = (isSocketOkay()) ? null
            : <div className="alert alert-info" role="info">
                Connecting to real time server.. Please wait..</div>;

        var onlineView = (this.FOR_REC || this.FOR_STUDENT) ? null :
            <div><h2>Online Users</h2>
                {(onlines == null) ? <span className="text-muted">Nothing To Show Here</span> : onlines}
            </div>;

        return (
            <div>
                {warning}
                <h2>Career Fair Overview</h2>
                {refreshBtn}
                {hall}
                {onlineView}
            </div>
        );
    }
}


