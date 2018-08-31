//Faizul Here

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Loader } from '../../../component/loader';
import { GeneralForm } from '../../../component/general-form';
import ProfileCard from '../../../component/profile-card';
import { CompanyEnum, UserEnum, PrescreenEnum, SessionRequestEnum, GroupSession, GroupSessionJoin } from '../../../../config/db-config';
import { ButtonLink } from '../../../component/buttons';
import { ProfileListItem } from '../../../component/list';
import { RootPath } from '../../../../config/app-config';
import { NavLink } from 'react-router-dom';
import { getAuthUser } from '../../../redux/actions/auth-actions';
import { ActivityAPIErr } from '../../../../server/api/activity-api';
import { emitQueueStatus, emitHallActivity } from '../../../socket/socket-client';

import * as activityActions from '../../../redux/actions/activity-actions';
import * as hallAction from '../../../redux/actions/hall-actions';

import { openSIAddForm, isNormalSI } from '../activity/scheduled-interview';
import Tooltip from '../../../component/tooltip';

import { isRoleRec, isRoleStudent } from '../../../redux/actions/auth-actions';
import { joinVideoCall } from '../session/chat';

import * as layoutActions from '../../../redux/actions/layout-actions';
import UserPopup, { createUserDocLinkList } from '../popup/user-popup';
import { Time } from '../../../lib/time';
import { getAxiosGraphQLQuery, getWpAjaxAxios } from '../../../../helper/api-helper';
import { createImageElement } from '../../../component/profile-card';
import AvailabilityView from '../../availability';
import obj2arg from 'graphql-obj2arg';


require("../../../css/group-session.scss");
const LIMIT_JOIN = 5;

class NewGroupSessionPopup extends React.Component {
    constructor(props) {
        super(props);
        this.authUser = getAuthUser();

        this.state = {
            select_timestamp: -1,
            loadingSubmit: false
        }
    }
    componentWillMount() {
        this.countDataAv = {};
        for (var i in this.props.data) {
            var d = this.props.data[i];
            if (typeof this.countDataAv[d.start_time] === "undefined") {
                this.countDataAv[d.start_time] = 0;
            }
            this.countDataAv[d.start_time]++;
        }
    }
    onSelectTime(id, timestamp) {
        this.setState((prevState) => {
            return { select_timestamp: timestamp };
        })
    }
    submitOnClick() {
        this.setState((prevState) => {
            return { loadingSubmit: true }
        });

        this.createGs()
    }
    createGs() {
        var d = {};
        d[GroupSession.COMPANY_ID] = this.props.company_id;
        d[GroupSession.START_TIME] = Number.parseInt(this.state.select_timestamp);
        d[GroupSession.LIMIT_JOIN] = LIMIT_JOIN;
        d[GroupSession.CREATED_BY] = this.authUser.ID;

        var query = `mutation{ add_group_session 
            (${obj2arg(d, { noOuterBraces: true })}){ID}
        }`

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState((prevState) => {
                return { loadingSubmit: false };
            });
            // close popup terus
            layoutActions.storeHideFocusCard();
            this.successAddHandler();
        });
    }
    successAddHandler() {
        var mes = <div>
            Successfully scheduled a group session on <u>{Time.getString(this.state.select_timestamp)}</u>
        </div>;
        layoutActions.successBlockLoader(mes);
        this.props.finishAdd();
    }
    render() {
        return <div>
            <AvailabilityView
                select_timestamp={this.state.select_timestamp}
                for_general={true}
                select_for="Group Session"
                count_data={this.countDataAv}
                onSelect={(id, timestamp) => { this.onSelectTime(id, timestamp) }}>
            </AvailabilityView>
            <br></br>
            <button onClick={() => { this.submitOnClick() }}
                disabled={this.state.select_timestamp == -1 || this.state.loadingSubmit}
                className="btn btn-primary btn-lg">
                {
                    this.state.loadingSubmit ?
                        <i className="fa fa-spinner fa-pulse left"></i> : null
                }
                Schedule Group Session
            </button>
        </div>;
    }
}

NewGroupSessionPopup.propTypes = {
    data: PropTypes.array.isRequired,
    finishAdd: PropTypes.func.isRequired,
    company_id: PropTypes.number.isRequired
}

class GroupSessionClass extends React.Component {
    constructor(props) {
        super(props);
        this.authUser = getAuthUser();
        this.img_dimension = "30px";
        this.state = {
            data: [],
            loading: true
        }
    }
    componentWillMount() {
        this.loadData()
    }
    loadData() {
        this.setState((prevState) => {
            return { loading: true };
        })

        var q = `query { group_sessions(company_id:${this.props.company_id}, discard_expired:true, discard_canceled:true)
        { ID
          start_time 
          is_expired
          join_url
          start_url
          joiners{
                user{
                  ID
                  first_name
                  last_name
                  img_url
                  img_pos
                  img_size
                }
            } 
        created_at created_by} } `;

        getAxiosGraphQLQuery(q).then((res) => {
            this.setState((prevState) => {
                return { data: res.data.data.group_sessions, loading: false }
            });
        });
    }
    createView(data) {
        var list = data.map((d, i) => {

            var joiners = d.joiners.map((dj, di) => {
                dj = dj.user;
                var imgView = createImageElement(dj.img_url, dj.img_pos
                    , dj.img_size, this.img_dimension, "");

                var studentName = null;
                var onClickJoiner = () => { };
                if (this.props.forRec) {
                    studentName = dj.first_name + " " + dj.last_name;
                    onClickJoiner = () => layoutActions.storeUpdateFocusCard(studentName, UserPopup, { id: dj.ID });
                }

                return <div className="join-item"
                    onClick={onClickJoiner}>
                    <Tooltip
                        bottom="37px"
                        left="-71px"
                        width="140px"
                        debug={false}
                        alignCenter={true}
                        content={imgView}
                        tooltip={studentName}>
                    </Tooltip>

                </div>
            });

            var joinersId = d.joiners.map((dj, di) => {
                dj = dj.user;
                return dj.ID;
            });

            if (d.joiners.length <= 0) {
                joiners = <small className="text-muted">No Participant Yet</small>;
            }

            var action = null;
            if (d.is_expired) {
                action = <div className="action btn btn-danger btn-sm" disabled="disabled">
                    Ended
                </div>;
            }
            else if (this.props.forRec) {
                if (d.join_url != null) {
                    const isExpiredHandler = () => {
                        var mes = <div>
                            This group session has ended.
                            </div>;
                        layoutActions.errorBlockLoader(mes);
                        var q = `mutation {edit_group_session(ID:${d.ID}, is_expired:1){ID}}`;
                        getAxiosGraphQLQuery(q).then((res) => {
                            this.loadData();
                        })
                    }
                    action = <a onClick={() => joinVideoCall(d.join_url, null, isExpiredHandler, d.ID)}
                        className="action btn btn-primary btn-sm" href={d.start_url} target="_blank">
                        Started
                    </a>;
                } else {
                    action = <div className="action btn btn-success btn-sm" data-id={d.ID}
                        data-joiners={JSON.stringify(joinersId)}
                        data-start_time={d.start_time}
                        onClick={(e) => { this.startVideoCall(e) }}>
                        Start Video Call
                    </div>
                }
            } else {
                action = <div className="action btn btn-success btn-sm" data-id={d.ID}
                    onClick={(e) => { this.joinGroupSession(e) }}>
                    Join Group Session
                </div>;
            }

            var deleteBtn = null;
            if (this.props.forRec) {
                deleteBtn = <div data-joiners={JSON.stringify(joinersId)}
                    data-id={d.ID} onClick={(e) => { this.deleteGroupSession(e) }} className="btn btn-link delete">
                    <i className="fa fa-times"></i>
                </div>;
            }

            return <div className="gs-company">
                <div className="header">
                    <div>
                        <div className="time">
                            <i className="fa fa-calendar left"></i>
                            <b>{Time.getDateDayStr(d.start_time)}</b>
                            {" - "}
                            {Time.getDate(d.start_time)}
                        </div>
                        <div className="time">
                            <i className="fa fa-clock-o left"></i>
                            {Time.getStringShort(d.start_time)}
                        </div>
                        {deleteBtn}
                    </div>
                </div>
                <div className="joiner">{joiners}</div>
                {action}
            </div>;
        });

        return <div className="group-session">
            {this.props.forRec ? this.createAddNewGs() : null}
            {list}
            {this.props.forStudent && list.length == 0 ?
                <small className="text-muted">
                    This company does not have any group sessions yet.
                    <br></br>Check again later.
                </small>
                : null}
        </div>
    }
    deleteGroupSession(e) {
        var id = e.currentTarget.dataset.id;
        var joiners = e.currentTarget.dataset.joiners;
        joiners = JSON.parse(joiners);

        layoutActions.confirmBlockLoader("Cancel This Group Session?", () => {
            layoutActions.loadingBlockLoader("Canceling...");
            var q = `mutation { edit_group_session (ID:${id}, is_canceled:1) { ID } } `;
            getAxiosGraphQLQuery(q).then((res) => {
                // emit to joiners to reload group session dorang
                for (var i in joiners) {
                    emitHallActivity(hallAction.ActivityType.GROUP_SESSION_JOIN, joiners[i], null);
                }
                this.loadData();
                layoutActions.storeHideBlockLoader();
            });
        });
    }
    joinGroupSession(e) {
        var id = e.currentTarget.dataset.id;
        var d = {};
        d[GroupSessionJoin.USER_ID] = this.props.user_id;
        d[GroupSessionJoin.GROUP_SESSION_ID] = Number.parseInt(id);
        console.log(d);

        var err = activityActions.invalidJoinGroupSession(this.props.company_id)
        if (err !== false) {
            layoutActions.errorBlockLoader(err);
            return;
        }


        layoutActions.loadingBlockLoader("Joining... Please Wait");

        // 1. backed validation check if still has space
        var query = `query{group_session (ID:${id}){joiners{ID} limit_join start_time }}`;
        getAxiosGraphQLQuery(query).then((res) => {
            var gs = res.data.data.group_session;
            if (gs.joiners.length >= gs.limit_join) {
                var mes = `Sorry. Only ${gs.limit_join} students are allowed to join in one session. Please choose another session`;
                layoutActions.errorBlockLoader(mes);
                return;
            }

            // 2. add to db
            var query = `mutation { add_group_session_join 
            (${obj2arg(d, { noOuterBraces: true })}){ID}}`;

            getAxiosGraphQLQuery(query).then((res) => {
                console.log(res.data.data.add_group_session_join);
                var mes = <div>Request Complete.<br></br>
                    The group session will start on <u>{Time.getString(gs.start_time)}</u>  (Your local time)</div>;
                hallAction.storeLoadActivity([hallAction.ActivityType.GROUP_SESSION_JOIN]);
                emitHallActivity(hallAction.ActivityType.GROUP_SESSION_JOIN, null, this.props.company_id);
                layoutActions.successBlockLoader(mes);
                layoutActions.storeHideFocusCard();
            });
        });



    }
    startVideoCall(e) {
        var id = e.currentTarget.dataset.id;
        id = Number.parseInt(id);

        var start_time = e.currentTarget.dataset.start_time;
        start_time = Number.parseInt(start_time);

        var joiners = e.currentTarget.dataset.joiners;
        joiners = JSON.parse(joiners);

        const recDoStart = (join_url, start_url) => {
            var updateData = {};
            updateData[GroupSession.ID] = id;
            updateData[GroupSession.JOIN_URL] = join_url;
            updateData[GroupSession.START_URL] = start_url;
            updateData[GroupSession.UPDATED_BY] = this.authUser.ID;

            // update group session with join_url data
            var query = `mutation { edit_group_session 
                (${obj2arg(updateData, { noOuterBraces: true })})
                {ID}
            }`;

            getAxiosGraphQLQuery(query).then((res) => {
                // emit to joiners to reload group session dorang
                for (var i in joiners) {
                    emitHallActivity(hallAction.ActivityType.GROUP_SESSION_JOIN, joiners[i], null);
                }

                layoutActions.storeHideBlockLoader();

                this.loadData();
            })
        }

        const recConfirmCreate = () => {
            layoutActions.loadingBlockLoader("Creating Video Call Session. Please Do Not Close Window.");
            const successInterceptor = (data) => {
                /*
                {"uuid":"bou80/LrR6a0cmDKC4V5aA=="
                ,"id":646923659,"host_id":"-9e--206RFiZFE0hSh-RPQ"
                ,"topic":"Let's start a video call."
                ,"password":"","h323_password":""
                ,"status":0,"option_jbh":false
                ,"option_start_type":"video"
                ,"option_host_video":true,"option_participants_video":true
                ,"option_cn_meeting":false,"option_enforce_login":false
                ,"option_enforce_login_domains":"","option_in_meeting":false
                ,"option_audio":"both","option_alternative_hosts":""
                ,"option_use_pmi":false,"type":1,"start_time":""
                ,"duration":0,"timezone":"America/Los_Angeles"
                ,"start_url":"https://zoom.us/s/646923659?zpk=NcbawuQ7mSE9jfEBdcGMfwxumZzC21eWgm2v6bQ9S6k.AwckNGQwMWY3NWQtNDZhMC00MzU2LTg0M2MtNGVlNWI1MmUzOWY5Fi05ZS0tMjA2UkZpWkZFMGhTaC1SUFEWLTllLS0yMDZSRmlaRkUwaFNoLVJQURJ0ZXN0LnJlY0BnbWFpbC5jb21jAHBTRm01T3I3ZVprU0RGczJCeVRFTlZ5N1k0cE1Zcm5scFF5R3pQZ2RLQjY4LkJnUWdVMDVMU1U1cGNFVmpWeTlESzB0NVVGRm5SbWx3YnpNNFRFNVdWSGxZWjJrQUFBd3pRMEpCZFc5cFdWTXpjejBBAAAWcDF2Skd0YUJRV3k0WC15NzVGRmVtQQIBAQA"
                ,"join_url":"https://zoom.us/j/646923659","created_at":"2018-01-31T02:08:02Z"}
                */

                if (data == null || data == "" || typeof data != "object") {
                    layoutActions.errorBlockLoader("Failed to create video call session. Please check your internet connection");
                    return;
                }

                console.log("success createVideoCall", data);
                var body = <div>
                    <h4 className="text-primary">Successfully Created Video Call Session</h4>
                    <br></br>
                    <a
                        href={data.start_url} target="_blank"
                        className="btn btn-success btn-lg" onClick={() => { recDoStart(data.join_url, data.start_url) }}>
                        Start Video Call
                </a>
                </div>;
                layoutActions.customBlockLoader(body, null, null, null);
            };

            var data = {
                query: "create_meeting",
                host_id: this.authUser.ID,
                group_session_id: id,
            };

            getWpAjaxAxios("wzs21_zoom_ajax", data, successInterceptor, true);
        }


        // open confirmation if time now is less than start time
        if (Time.getUnixTimestampNow() < start_time) {
            var title = <div>It is not the time yet<br></br>
                <small>This session was scheduled on<br></br><u>{Time.getString(start_time)}</u>
                    <br></br>Continue to start video call now?</small>
            </div>;
            layoutActions.confirmBlockLoader(title, () => {
                recConfirmCreate();
            });
        } else {
            recConfirmCreate();
        }

    }
    createAddNewGs() {
        const onClick = () => {
            layoutActions.storeUpdateFocusCard("Schedule New Group Session"
                , NewGroupSessionPopup
                , { data: this.state.data, company_id: this.props.company_id, finishAdd: () => { this.loadData() } }
            );
        }

        return <div className="gs-company add" onClick={onClick}>
            <div><i className="fa fa-plus fa-3x"></i></div>
        </div>
    }
    render() {
        var view = <Loader size="2" text="Loading Group Session..."></Loader>;
        if (!this.state.loading) {
            view = this.createView(this.state.data);
        }

        var header = null;
        if (this.props.forStudent) {
            header = <h2 style={{ marginTop: "10px" }}>
                <small>or<br></br>Join A Group Session</small>
            </h2>;
        }

        if (this.props.forRec) {
            header = <h3 onClick={() => { this.loadData() }}><a className="btn-link">Group Session</a></h3>;
        }

        return <div>
            {header}
            {view}
        </div>;
    }
}

// TODO status online
function mapStateToProps(state, ownProps) {
    return {
        online_users: state.user.online_users
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        //loadActivity: hallAction.loadActivity
    }, dispatch);
}

GroupSessionClass.propTypes = {
    company_id: PropTypes.number.isRequired,
    user_id: PropTypes.number,
    forRec: PropTypes.bool,
    forStudent: PropTypes.bool
}

GroupSessionClass.defaultProps = {
    user_id: null,
    forRec: false,
    forStudent: false,
}

export const GroupSessionView = connect(mapStateToProps, mapDispatchToProps)(GroupSessionClass);

