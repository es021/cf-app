import React, { Component } from 'react';
import { BOTH } from '../../config/socket-config';
import UserPopup from './partial/popup/user-popup';
import CompanyPopup from './partial/popup/company-popup';
import { socketEmit, socketOn, emitState, isSocketOkay } from '../socket/socket-client';
import * as layoutActions from '../redux/actions/layout-actions';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { Time } from '../lib/time';
import { Loader } from '../component/loader';
import { isRoleRec, getAuthUser } from '../redux/actions/auth-actions';

require("../css/admin.scss");

export class Monitor extends React.Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);

        this.renderHallDetail = this.renderHallDetail.bind(this);
        this.renderAllOnline = this.renderAllOnline.bind(this);
        this.isUserOnline = this.isUserOnline.bind(this);
        this.isCompanyOnline = this.isCompanyOnline.bind(this);
        this.state = {
            loading: true,
            online_company: {},
            queue_detail: {},
            queue: {},
            sessions: [],
            online_clients: []
        };
    }

    componentWillMount() {

        this.LIMITED = isRoleRec();

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

    refresh() {
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

        emitState();
    }

    componentDidMount() {
        this.refresh();
    }

    createIconEmpty(shape, color = "") {
        var className = shape + " " + color;
        return <div className={`icon ${className} small`}
        ><div></div></div>;
    }

    createIcon(id, type, shape = "", tooltip = null, noClick = false) {
        var className = shape + " ";

        if (type == "company") {
            if (this.isCompanyOnline(id)) {
                className += " active ";
            }
            var onClick = (e) => {
                var id = e.currentTarget.dataset.entity_id;
                layoutActions.storeUpdateFocusCard("Company " + id
                    , CompanyPopup
                    , { id: id, displayOnly: true })
            };
        }

        if (type == "user") {
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

        return <div title={tooltip} className={`icon ${className} ${noClick ? "" : "clickable"}`}
            data-entity_id={id} onClick={onClick}><div>{id}</div></div>;

    }

    renderAllOnline() {
        var vs = [];

        for (var id in this.state.online_clients) {
            vs.push(this.createIcon(id, "user", "circle"));
        }

        if (vs.length == 0) {
            return null;
        }

        return <div className="hall-activity">{vs}</div>;
    }

    renderHallDetail() {
        var vs = [];
        var queue = this.state.queue_detail;

        for (var com_id in queue) {

            // set if student clickable 
            var noClick = false;
            if (this.LIMITED) {
                noClick = true;
                // for limited rec, only under queue can be seen
                if (com_id == getAuthUser().rec_company) {
                    noClick = false;
                }
            }

            var com = this.createIcon(com_id, "company", "cornered");
            var sessions = this.state.sessions.map((d, i) => {
                if (d.company_id == com_id) {
                    return this.createIcon(d.participant_id, "user", ""
                        , "Created " + Time.getAgo(d.created_at), noClick);
                }
            });

            var queues = queue[com_id].map((d, i) => {
                return this.createIcon(d, "user", "circle", null, noClick);
            });

            vs.push(
                <div className="icon-container">
                    {com}
                    {sessions}
                    {queues}
                </div>);
        }

        var legends = <div className="hall-activity">
            {this.createIconEmpty("cornered", "blue")}Company Booth {" -- "}
            {this.createIconEmpty("circle")}Student Queuing {" -- "}
            {this.createIconEmpty("square")}Student In Session
        </div>;

        return (<div>{legends}
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

        var onlines = this.LIMITED ? null : this.renderAllOnline();

        var header = (this.state.loading) ?
            <Loader size="3" text="Fetching latest update.."></Loader> :
            <div><a className="btn btn-blue" onClick={() => this.refresh()}>
                Refresh</a>
                <br></br><small>Last Updated {this.lastUpdated}</small>
            </div>;

        // var warning = (isSocketOkay()) ? null
        //     : <div className="alert alert-danger" role="alert">
        //         Socket Server is currently down!</div>;

        var warning = (isSocketOkay()) ? null
            : <div className="alert alert-info" role="info">
                Connecting to real time server.. Please wait..</div>;

        var onlineView = this.LIMITED ? null :
            <div><h2>Online Users</h2>
                {(onlines == null) ? <span className="text-muted">Nothing To Show Here</span> : onlines}
            </div>;

        return (
            <div>
                {warning}
                {header}
                <h2>Career Fair<br></br><small>Live View Activity</small></h2>
                {hall}
                {onlineView}
            </div>
        );
    }
}


