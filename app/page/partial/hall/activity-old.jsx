//Faizul Here

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Loader } from '../../../component/loader';
import obj2arg from "graphql-obj2arg";
import ProfileCard from '../../../component/profile-card.jsx';
import { Prescreen, PrescreenEnum, SessionRequestEnum, EntityRemoved, GroupSessionJoin } from '../../../../config/db-config';
import { ButtonLink } from '../../../component/buttons.jsx';
import { ProfileListItem } from '../../../component/list';
import { Time } from '../../../lib/time';
import { showNotification } from '../../../lib/notification';
import { RootPath } from '../../../../config/app-config';
import { NavLink } from 'react-router-dom';
import { getAuthUser } from '../../../redux/actions/auth-actions';
import { ActivityAPIErr } from '../../../../server/api/activity-api';
import UserPopup, { createUserDocLinkList } from '../popup/user-popup';
import { emitQueueStatus, emitHallActivity } from '../../../socket/socket-client';

import * as layoutActions from '../../../redux/actions/layout-actions';
import * as activityActions from '../../../redux/actions/activity-actions';
import * as hallAction from '../../../redux/actions/hall-actions';

import { openSIAddForm, isNormalSI } from '../activity/scheduled-interview';
import Tooltip from '../../../component/tooltip';

import { isRoleRec, isRoleStudent } from '../../../redux/actions/auth-actions';
import { joinVideoCall } from '../session/chat';

import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import * as HallViewHelper from '../../view-helper/hall-view-helper';

// require('../../../css/border-card.scss');

class ActvityList extends React.Component {

    constructor(props) {
        super(props);
        this.openSIForm = this.openSIForm.bind(this);
        this.cancelQueue = this.cancelQueue.bind(this);
        this.cancelJoinGroupSession = this.cancelJoinGroupSession.bind(this);
        this.updateSessionRequest = this.updateSessionRequest.bind(this);
        this.acceptRejectPrescreen = this.acceptRejectPrescreen.bind(this);
        this.confirmAcceptRejectPrescreen = this.confirmAcceptRejectPrescreen.bind(this);

        this.authUser = getAuthUser();
        this.state = {
            time: Date.now()
        }
        this.interval = null;

        // update every 30 secs
        this.UPDATE_INTERVAL = 30 * 1000;
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState(() => {
                return { time: Date.now() }
            })
        }, this.UPDATE_INTERVAL)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    cancelJoinGroupSession(e) {

        var company_name = e.currentTarget.dataset.company_name;
        var company_id = e.currentTarget.dataset.company_id;

        const id = e.currentTarget.id;
        const confirmCancel = () => {
            layoutActions.loadingBlockLoader("Canceling..");
            activityActions.cancelJoinGroupSession(id).then((res) => {
                hallAction.storeLoadActivity([hallAction.ActivityType.GROUP_SESSION_JOIN]);
                layoutActions.storeHideBlockLoader();

                emitQueueStatus(company_id, this.authUser.ID, "cancelJoinGroupSession");
                emitHallActivity(hallAction.ActivityType.GROUP_SESSION_JOIN, null, company_id);

            }, (err) => {
                layoutActions.errorBlockLoader(err);
            });
        };

        layoutActions.confirmBlockLoader(`Canceling participation for group session with ${company_name}?`
            , confirmCancel);
    }

    getRemoveButton(hasRemove, entity, entity_id) {
        if (!hasRemove) {
            return null;
        }

        const onClickRemove = (e) => {
            let entity = e.currentTarget.dataset.entity;
            let entity_id = e.currentTarget.dataset.entity_id;

            let ins = {};
            ins[EntityRemoved.ENTITY] = entity;
            ins[EntityRemoved.ENTITY_ID] = Number.parseInt(entity_id);
            ins[EntityRemoved.USER_ID] = this.authUser.ID;
            let q = `mutation { add_entity_removed (${obj2arg(ins, { noOuterBraces: true })})
                { ID } }`

            let parentButton = e.currentTarget.parentNode;
            let parentPcBody = parentButton.parentNode;
            let parentCard = parentPcBody.parentNode;
            parentCard.className = parentCard.className += "profile-card-hidden";
            //console.log(parentCard);
            setTimeout(() => {
                parentCard.hidden = true;
            }, 700)
            getAxiosGraphQLQuery(q).then((data) => { });
        }

        return <div onClick={(e) => { onClickRemove(e) }}
            data-entity={entity}
            data-entity_id={entity_id}
            className="btn btn-link btn-delete-card">
            <i className="fa fa-times"></i>
        </div>
    }

    cancelQueue(e) {

        var company_name = e.currentTarget.dataset.company_name;
        var company_id = e.currentTarget.dataset.company_id;

        const id = e.currentTarget.id;
        const confirmCancelQueue = () => {
            layoutActions.loadingBlockLoader("Canceling Queue..");
            activityActions.cancelQueue(id).then((res) => {
                hallAction.storeLoadActivity([hallAction.ActivityType.QUEUE]);
                layoutActions.storeHideBlockLoader();

                emitQueueStatus(company_id, this.authUser.ID, "cancelQueue");
                emitHallActivity(hallAction.ActivityType.QUEUE, null, company_id);

            }, (err) => {
                layoutActions.errorBlockLoader(err);
            });
        };

        layoutActions.confirmBlockLoader(`Canceling Queue for ${company_name}`
            , confirmCancelQueue);
    }

    // open form,
    // once completed update to approve
    openSIForm(sr_id, student_id) {
        openSIAddForm(student_id, this.authUser.rec_company, PrescreenEnum.ST_INTV_REQUEST,
            (d) => {
                this.updateSessionRequest(sr_id, SessionRequestEnum.STATUS_APPROVED);
            }
        );
    }

    updateSessionRequest(id, status) {
        layoutActions.loadingBlockLoader("Updating Session Request Status..");
        activityActions.updateSessionRequest(id, status).then((res) => {

            var toRefresh = [hallAction.ActivityType.SESSION_REQUEST];
            if (status == SessionRequestEnum.STATUS_APPROVED) {
                toRefresh.push(hallAction.ActivityType.PRESCREEN);
            }

            hallAction.storeLoadActivity(toRefresh);
            layoutActions.storeHideBlockLoader();

            //emitQueueStatus(company_id, this.authUser.ID, "cancelQueue");

            var sid = (isRoleStudent()) ? null : res.student_id;
            var cid = (isRoleRec()) ? null : res.company_id;
            emitHallActivity(hallAction.ActivityType.SESSION_REQUEST, sid, cid);

        }, (err) => {
            layoutActions.errorBlockLoader(err);
        });
    }

    // for reject and cancel
    // trigger from card view button
    confirmUpdateSessionRequest(e, status) {
        var other_name = e.currentTarget.dataset.other_name;
        var other_id = e.currentTarget.dataset.other_id;
        var id = e.currentTarget.id;

        const confirmUpdate = () => {
            this.updateSessionRequest(id, status);
        };

        // create confirm message
        var mes = "";
        if (status === SessionRequestEnum.STATUS_CANCELED) {
            mes += "Canceling";
        }
        if (status === SessionRequestEnum.STATUS_REJECTED) {
            mes += "Rejecting";
        }
        if (status === SessionRequestEnum.STATUS_PENDING) {
            mes += "Canceling Rejection ";
        }

        mes += ` Interview Request for ${other_name}`;

        layoutActions.confirmBlockLoader(mes, confirmUpdate);
    }

    startVideoCallPreScreen(e) {
        HallViewHelper.startVideoCall(e, {
            type: HallViewHelper.TYPE_PRIVATE_SESSION,
            user_id: this.authUser.ID,
            bindedSuccessHandler: () => {
                hallAction.storeLoadActivity([hallAction.ActivityType.PRESCREEN]);
            }
        })
    }

    createSession(e) {
        var invalid = activityActions.invalidSession();

        if (invalid !== false) {
            layoutActions.errorBlockLoader(invalid);
            return false;
        }

        var host_id = getAuthUser().ID;
        var participant_id = e.currentTarget.dataset.pid;
        var entity = e.currentTarget.dataset.entity;
        var entity_id = e.currentTarget.dataset.entity_id;

        layoutActions.loadingBlockLoader("Creating Session..");
        activityActions.createSession(host_id, participant_id, entity, entity_id).then((res) => {

            var m = <div>Session Successfully Created<br></br>
                <NavLink
                    onClick={() => layoutActions.storeHideBlockLoader()}
                    to={`${RootPath}/app/session/${res.data.ID}`}>
                    Go To Session
                </NavLink>
            </div>;

            if (entity === hallAction.ActivityType.QUEUE) {
                emitQueueStatus(getAuthUser().rec_company, participant_id, "cancelQueue");
            }

            emitHallActivity([hallAction.ActivityType.SESSION, entity], participant_id, null);

            layoutActions.successBlockLoader(m);
            hallAction.storeLoadActivity([hallAction.ActivityType.SESSION, entity]);

        }, (err) => {
            var m = "";
            switch (err.response.data) {
                case ActivityAPIErr.HAS_SESSION:
                    m = "This student is currently engaged";
                    break;
            }

            layoutActions.errorBlockLoader(m);

        });
    }

    // ##########################
    // for prescreen

    acceptRejectPrescreen(id, user_id, status) {
        layoutActions.loadingBlockLoader("Updating Scheduled Call Status..");

        if (typeof id === "string") {
            id = Number.parseInt(id);
        }
        if (typeof user_id === "string") {
            user_id = Number.parseInt(user_id);
        }

        let upd = {};
        upd[Prescreen.ID] = id;
        upd[Prescreen.UPDATED_BY] = user_id;
        upd[Prescreen.STATUS] = status

        let query = `mutation{edit_prescreen(${obj2arg(upd, {
            noOuterBraces: true
        })}) {ID student_id company_id}}`;

        getAxiosGraphQLQuery(query).then((data) => {
            let res = data.data.data.edit_prescreen;
            var toRefresh = [hallAction.ActivityType.PRESCREEN];
            hallAction.storeLoadActivity(toRefresh);
            layoutActions.storeHideBlockLoader();

            //emitQueueStatus(company_id, this.authUser.ID, "cancelQueue");

            var sid = (isRoleStudent()) ? null : res.student_id;
            var cid = (isRoleRec()) ? null : res.company_id;
            emitHallActivity(hallAction.ActivityType.PRESCREEN, sid, cid);

        }, (err) => {
            layoutActions.errorBlockLoader(err);
        });


    }

    // for reject and cancel
    // trigger from card view button
    confirmAcceptRejectPrescreen(e, status) {
        var other_name = e.currentTarget.dataset.other_name;
        var id = e.currentTarget.id;
        var user_id = this.authUser.ID;

        const confirmUpdate = () => {
            this.acceptRejectPrescreen(id, user_id, status);
        };

        // create confirm message
        var mes = "";
        if (status === PrescreenEnum.STATUS_APPROVED) {
            mes += "Approving";
        }
        if (status === PrescreenEnum.STATUS_REJECTED) {
            mes += "Rejecting";
        }

        mes += ` Scheduled Call with ${other_name} ?`;
        layoutActions.confirmBlockLoader(mes, confirmUpdate);
    }

    getTimeStrNew(unixtime, showTimeOnly) {
        // debug
        //unixtime = (1552804854865/1000) + 500;

        let timeStr = Time.getString(unixtime);

        if (showTimeOnly) {
            return timeStr;
        }

        let passedText = "Waiting For Recruiter"
        let happeningIn = Time.getHapenningIn(unixtime, {
            passedText: isRoleStudent() ? passedText : null,
            startCountMinute: 24 * 60 // 24 hours
        });

        if (happeningIn != null) {
            if (happeningIn != passedText) {
                happeningIn = <span>Starting In {happeningIn}</span>
            }
            happeningIn = <div style={{ marginBottom: "-6px", fontWeight: "bold" }}
                className="text-primary">
                {happeningIn}
            </div>
            return <span>{happeningIn}<br></br>{timeStr}</span>;
        } else {
            return timeStr;
        }

    }

    render() {
        var body = null;
        // console.log("ActivityList",this.props);
        // console.log("ActivityList",this.props);
        // console.log("ActivityList",this.props);
        if (this.props.fetching) {
            body = <Loader isCenter={true} size="2"></Loader>;
        } else {

            body = this.props.list.map((d, i) => {
                var obj = (isRoleRec()) ? d.student : d.company;

                if (typeof obj === "undefined") {
                    return false;
                }

                if (isRoleRec()) {
                    obj.name = obj.first_name + " " + obj.last_name;
                }

                // 1. title
                var title = null;
                if (isRoleRec()) {
                    var params = { id: obj.ID };
                    title = <ButtonLink label={obj.first_name + " " + obj.last_name}
                        onClick={() => layoutActions.storeUpdateFocusCard(obj.first_name + " " + obj.last_name, UserPopup, params)}></ButtonLink>;
                } else if (isRoleStudent()) {
                    title = obj.name;
                }

                // 2. subtitle and body
                var subtitle = null;
                var badge = null;
                var badge_tooltip = null;
                var body = null;
                var crtSession = null;
                var custom_width = "150px";
                var hasRemove = null;
                var removeEntity = null;
                var removeEntityId = null;

                if (isRoleRec()) {

                    //show online status for rec
                    badge = (this.props.online_users[obj.ID] == 1) ? "" : null;
                    badge_tooltip = `User Currently Online`;

                    crtSession = <div data-pid={obj.ID} data-entity_id={d.ID} data-entity={this.props.type}
                        onClick={this.createSession.bind(this)} className="btn btn-sm btn-primary">Create Session</div>;
                }


                switch (this.props.type) {
                    // #############################################################
                    // Active Session Card View

                    case hallAction.ActivityType.SESSION:
                        subtitle = `${Time.getAgo(d.created_at)}`;
                        body = <NavLink to={`${RootPath}/app/session/${d.ID}`}>
                            <div className="btn btn-sm btn-success">Go To Session</div>
                        </NavLink>;
                        break;

                    case hallAction.ActivityType.QUEUE:
                        subtitle = `${Time.getAgo(d.created_at)}`;

                        if (!isRoleRec()) {
                            badge = `${d.queue_num}`;
                            badge_tooltip = `Your queue number`;
                        }

                        body = (isRoleRec()) ? crtSession
                            : <div id={d.ID} data-company_id={obj.ID} data-company_name={obj.name} onClick={this.cancelQueue.bind(this)}
                                className="btn btn-sm btn-danger">Cancel Queue</div>;
                        break;

                    // #############################################################
                    // Panel Interview Card View

                    // case hallAction.ActivityType.ZOOM_INVITE:
                    //     subtitle = <span>Hosted by
                    //     <div className="break-all">
                    //             <Tooltip
                    //                 bottom={"13px"}
                    //                 left={"-22px"}
                    //                 width={"131px"}
                    //                 tooltip={d.recruiter.user_email}
                    //                 content={<b>{d.recruiter.first_name} {d.recruiter.last_name}</b>}>
                    //             </Tooltip>
                    //         </div>
                    //         <br></br>
                    //         {Time.getAgo(d.created_at)}
                    //     </span>;
                    //     body = <div>
                    //         <a onClick={() => joinVideoCall(d.join_url, d.session_id, () => {
                    //             hallAction.storeLoadActivity([hallAction.ActivityType.ZOOM_INVITE]);
                    //         })} className="btn btn-sm btn-blue">Join Interview</a>
                    //     </div>;

                    //     break;

                    // #############################################################
                    // Scheduled Session Card View

                    case hallAction.ActivityType.PRESCREEN:
                        let btnJoinVCall = null;
                        var btnStartVCall = null;
                        var btnEndedVCall = null;
                        var btnAcceptReject = null;

                        if (d.status == PrescreenEnum.STATUS_REJECTED
                            || d.status == PrescreenEnum.STATUS_ENDED) {
                            subtitle = this.getTimeStrNew(d.appointment_time, true);
                        } else {
                            subtitle = this.getTimeStrNew(d.appointment_time, false);
                        }

                        //body = <div style={{ height: "30px" }}></div>;
                        var ps_type = (d.special_type == null || d.special_type == "")
                            ? PrescreenEnum.ST_PRE_SCREEN : d.special_type;

                        if (isNormalSI(ps_type)) {
                            ps_type = "Scheduled Session";
                        }

                        // label for special type
                        // var label_color_type = "";
                        // switch (ps_type) {
                        //     case PrescreenEnum.ST_NEXT_ROUND:
                        //         label_color_type = "success";
                        //         break;
                        //     case PrescreenEnum.ST_PRE_SCREEN:
                        //         label_color_type = "info";
                        //         break;
                        //     default:
                        //         label_color_type = "primary";
                        //         break;
                        // }
                        // let labelType = <div style={{ marginBottom: "7px" }}>
                        //     <label className={`label label-${label_color_type}`}>
                        //         {ps_type}
                        //     </label>
                        // </div>


                        // label for status
                        // New SI Flow
                        var label_color_status = "";
                        var textStatus = "";
                        switch (d.status) {
                            case PrescreenEnum.STATUS_WAIT_CONFIRM:
                                // New Flow
                                if (isRoleStudent()) {
                                    btnAcceptReject = <div>
                                        <div id={d.ID} data-other_id={obj.ID} data-other_name={obj.name}
                                            onClick={(e) => { this.confirmAcceptRejectPrescreen(e, PrescreenEnum.STATUS_APPROVED) }}
                                            className="btn btn-sm btn-success">Accept Interview</div>

                                        <div id={d.ID} data-other_id={obj.ID} data-other_name={obj.name}
                                            onClick={(e) => { this.confirmAcceptRejectPrescreen(e, PrescreenEnum.STATUS_REJECTED) }}
                                            className="btn btn-sm btn-danger">Reject Interview</div>
                                    </div>;
                                }
                                if (isRoleRec()) {
                                    label_color_status = "primary";
                                    textStatus = "Waiting Confirmation";
                                    crtSession = null;
                                }
                                break;
                            case PrescreenEnum.STATUS_REJECTED:
                                label_color_status = "danger";
                                textStatus = "Interview Rejected";
                                crtSession = null;
                                hasRemove = true;
                                removeEntity = Prescreen.TABLE;
                                removeEntityId = d.ID;
                                break;
                            case PrescreenEnum.STATUS_APPROVED:
                                if (isRoleRec()) {
                                    btnStartVCall = <div data-appointment_time={d.appointment_time}
                                        data-participant_id={obj.ID} data-id={d.ID}
                                        onClick={this.startVideoCallPreScreen.bind(this)}
                                        className="btn btn-sm btn-success">
                                        Start Video Call
                                    </div>;
                                    break;
                                }

                                label_color_status = "success";
                                textStatus = "Accepted";
                                break;
                            case PrescreenEnum.STATUS_ENDED:
                                btnEndedVCall = <div className="action btn btn-danger btn-sm"
                                    disabled="disabled">
                                    Ended
                                </div>;
                                crtSession = null;
                                hasRemove = true;
                                removeEntity = Prescreen.TABLE;
                                removeEntityId = d.ID;

                                break;
                            case PrescreenEnum.STATUS_STARTED:
                                let isExpiredHandler = () => {
                                    var mes = <div>
                                        Unable to join.<br></br>This 1-1 session has ended.
                                    </div>;
                                    layoutActions.errorBlockLoader(mes);
                                    let updData = {}
                                    updData[Prescreen.ID] = d.ID;
                                    updData[Prescreen.IS_EXPIRED] = 1;
                                    updData[Prescreen.STATUS] = PrescreenEnum.STATUS_ENDED;
                                    updData[Prescreen.UPDATED_BY] = this.authUser.ID;
                                    var q = `mutation {edit_prescreen (${obj2arg(updData, {
                                        noOuterBraces: true
                                    })}){ID}}`;
                                    getAxiosGraphQLQuery(q).then((res) => {
                                        hallAction.storeLoadActivity([hallAction.ActivityType.PRESCREEN]);
                                    })
                                }
                                var hasStart = false;
                                if (!d.is_expired && d.join_url != "" && d.join_url != null) {
                                    hasStart = true;
                                    subtitle = "Video Call Has Started";
                                } else {
                                    if (d.is_expired) {
                                        subtitle = this.getTimeStrNew(d.appointment_time, true);
                                    } else {
                                        subtitle = this.getTimeStrNew(d.appointment_time, false);
                                    }
                                }
                                if (hasStart && isRoleStudent()) {
                                    // bukak join url
                                    btnJoinVCall = <a onClick={() => joinVideoCall(d.join_url, null, isExpiredHandler, null, d.ID)}
                                        className="btn btn-sm btn-blue">Join Video Call</a>

                                    const openNotificationStart_PS = () => {
                                        // block loader to inform the video call has started
                                        // if time updated is less than bufferMin
                                        var bufferMin = 2;
                                        var diff = Time.getUnixTimestampNow() - Time.convertDBTimeToUnix(d.updated_at);
                                        if (diff <= bufferMin * 60) {
                                            var popupBody = <div>
                                                <br></br>
                                                1-1 session with<br></br><b>{obj.name}</b>
                                                <br></br>has started<br></br><br></br>
                                                {btnJoinVCall}
                                            </div>
                                            var notiId = `pre-screen-${d.ID}`;
                                            showNotification(notiId, popupBody);
                                        }
                                    }
                                    openNotificationStart_PS();
                                }
                                if (hasStart && isRoleRec()) {
                                    // bukak start url
                                    btnJoinVCall = <a onClick={() => joinVideoCall(d.join_url, null,
                                        isExpiredHandler, null, d.ID, d.start_url)}
                                        className="action btn btn-primary btn-sm">
                                        Started
                                    </a>;
                                }


                                break;
                        }
                        let labelStatus = <div style={{ marginBottom: "7px" }}>
                            <label className={`label label-${label_color_status}`}>
                                {textStatus}
                            </label>
                        </div>





                        body = <div>
                            {isRoleRec() ? createUserDocLinkList(obj.doc_links, obj.ID, true, true) : null}
                            {/* labelType */}
                            {btnStartVCall == null ? labelStatus : null}
                            {(isRoleRec()) ? btnStartVCall : null}
                            {(d.status == PrescreenEnum.STATUS_WAIT_CONFIRM) ? btnAcceptReject : null}
                            {(d.status == PrescreenEnum.STATUS_STARTED) ? btnJoinVCall : null}
                            {(d.status == PrescreenEnum.STATUS_ENDED) ? btnEndedVCall : null}
                        </div>;
                        break;


                    // #############################################################
                    // Interview Request Card View
                    // case hallAction.ActivityType.SESSION_REQUEST:
                    //     subtitle = `${Time.getAgo(d.created_at)}`;

                    //     if (d.status === SessionRequestEnum.STATUS_PENDING) {
                    //         /*var pend = <div style={{ marginBottom: "10px" }}>
                    //             <label className={`label label-info`}>Pending</label>
                    //         </div>;*/
                    //         var pend = null;

                    //         if (isRoleRec()) {
                    //             body = <div>
                    //                 {createUserDocLinkList(obj.doc_links, obj.ID, true, true)}
                    //                 <div onClick={() => { this.openSIForm(d.ID, obj.ID) }}
                    //                     className="btn btn-sm btn-success">Schedule Session</div>

                    //                 <div id={d.ID} data-other_id={obj.ID} data-other_name={obj.name}
                    //                     onClick={(e) => { this.confirmUpdateSessionRequest(e, SessionRequestEnum.STATUS_REJECTED) }}
                    //                     className="btn btn-sm btn-danger">Reject Request</div>
                    //             </div>;

                    //         } else {
                    //             body = <div>{pend}
                    //                 <div id={d.ID} data-other_id={obj.ID} data-other_name={obj.name}
                    //                     onClick={(e) => { this.confirmUpdateSessionRequest(e, SessionRequestEnum.STATUS_CANCELED) }}
                    //                     className="btn btn-sm btn-primary">Cancel Request</div>
                    //             </div>;
                    //         }
                    //     }

                    //     // if rec view rejected in not shown
                    //     if (d.status === SessionRequestEnum.STATUS_REJECTED) {
                    //         var rej = <div style={{ marginBottom: "10px" }}>
                    //             <label className={`label label-danger`}>Rejected</label>
                    //         </div>;
                    //         body = <div>{rej}<small className="text-muted">Try again later</small></div>;
                    //         /*
                    //         body = <div>{rej}
                    //             {isRoleRec() ? <div id={d.ID} data-other_id={obj.ID} data-other_name={obj.name}
                    //                 onClick={(e) => { this.confirmUpdateSessionRequest(e, SessionRequestEnum.STATUS_PENDING) }}
                    //                 className="btn btn-sm btn-blue">Cancel Rejection</div> : null}
                    //         </div>
                    //         */
                    //     }
                    //     break;



                    // #############################################################
                    // group session Card View
                    case hallAction.ActivityType.GROUP_SESSION_JOIN:
                        if (isRoleStudent()) {

                            if (d.title != null && d.title != "") {
                                title = <small>{d.title}</small>;
                            } else {
                                title = <small>Group Session with {title}</small>;
                            }
                            title = <b>{title}</b>

                            var hasStart = false;
                            if (!d.is_expired && d.join_url != "" && d.join_url != null) {
                                hasStart = true;
                                subtitle = "Video Call Has Started";
                            } else {
                                if (d.is_canceled || d.is_expired) {
                                    subtitle = this.getTimeStrNew(d.start_time, true);
                                } else {
                                    subtitle = this.getTimeStrNew(d.start_time, false);
                                }
                            }

                            const isExpiredHandler = () => {
                                var mes = <div>
                                    Unable to join.<br></br>This group session has ended.
                                </div>;
                                layoutActions.errorBlockLoader(mes);
                                var q = `mutation {edit_group_session(ID:${d.ID}, is_expired:1){ID}}`;
                                getAxiosGraphQLQuery(q).then((res) => {
                                    hallAction.storeLoadActivity([hallAction.ActivityType.GROUP_SESSION_JOIN]);
                                })
                            }

                            var btnJoin = <a onClick={() => joinVideoCall(d.join_url, null, isExpiredHandler, d.ID)}
                                className="btn btn-sm btn-blue">Join Video Call</a>

                            const openNotificationStart_GS = () => {
                                // block loader to inform the video call has started
                                // if time updated is less than bufferMin
                                var bufferMin = 2;
                                var diff = Time.getUnixTimestampNow() - Time.convertDBTimeToUnix(d.updated_at);
                                if (diff <= bufferMin * 60) {
                                    var popupBody = <div>
                                        <br></br>
                                        Group session with
                                        <br></br><b>{obj.name}</b>
                                        <br></br>has started
                                        <br></br> <br></br>
                                        {btnJoin}
                                    </div>
                                    var notiId = `group-session-${d.ID}`;
                                    showNotification(notiId, popupBody);
                                }
                            }
                            let isGsHasRemove = false;
                            if (d.is_canceled) {
                                body = <button disabled="disabled" className="btn btn-sm btn-danger">Canceled</button>
                                isGsHasRemove = true;
                            }
                            else if (d.is_expired) {
                                body = <button disabled="disabled" className="btn btn-sm btn-danger">Ended</button>
                                isGsHasRemove = true;
                            } else {
                                if (hasStart) {
                                    openNotificationStart_GS();
                                    body = <div>
                                        {btnJoin}
                                    </div>;
                                } else {
                                    body = <div id={d.join_id} data-company_id={obj.ID} data-company_name={obj.name}
                                        onClick={this.cancelJoinGroupSession.bind(this)}
                                        className="btn btn-sm btn-primary">Cancel Session
                                    </div>
                                }

                            }

                            if (isGsHasRemove) {
                                hasRemove = true;
                                removeEntity = GroupSessionJoin.TABLE;
                                removeEntityId = d.join_id;
                            }

                        }

                        break;
                }

                body = <div>
                    {this.getRemoveButton(hasRemove, removeEntity, removeEntityId)}
                    {body}
                </div>

                var img_position = (isRoleRec()) ? obj.img_pos : obj.img_position;
                return <ProfileListItem className="" title={title} list_type="card"
                    img_url={obj.img_url}
                    custom_width={custom_width}
                    img_pos={img_position}
                    img_size={obj.img_size}
                    img_dimension="50px"
                    body={body}
                    badge={badge}
                    badge_tooltip={badge_tooltip}
                    subtitle={subtitle}
                    type="recruiter" key={i}></ProfileListItem>;

            });

            if (this.props.list.length === 0) {
                body = <div className="text-muted"><i>Nothing to show here</i></div>;
            }

        }

        return (<div className={`border-card bc-${this.props.bc_type}`}>
            <h4 className="bc-title"><span className="bc-title-back">{this.props.title}</span>
                <br></br><small>{this.props.subtitle}</small>
            </h4>
            <div className="bc-body">{body}</div>
        </div>);
    }

}

ActvityList.propTypes = {
    type: PropTypes.oneOf([hallAction.ActivityType.SESSION, hallAction.ActivityType.QUEUE, hallAction.ActivityType.PRESCREEN]).isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    bc_type: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    fetching: PropTypes.bool.isRequired,
    online_users: PropTypes.object.isRequired
};

ActvityList.defaultProps = {
    subtitle: null
};

// ##################################################################################################################
// ##################################################################################################################
// ##################################################################################################################

export class ActivitySingle extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            data : {},
        }
    }
    componentWillMount() {
        this.loadData();
    }
    loadData(){
        let entity = null;
        switch(this.props.type){
            case hallAction.ActivityType.PRESCREEN : 
                entity = "prescreen";
            break;
        }
        if(entity == null){
            this.setState((prevState)=>{
                return {loading : false};
            })
        }else{
            let q = ` query {${entity} (ID:${this.props.id}){ ${hallAction.getActivityQueryAttr(this.props.type)} } }`;;
            getAxiosGraphQLQuery(q).then((res)=>{
                this.setState((prevState)=>{
                    return {data : res.data.data[entity], loading : false};
                })
            })
        }
    }
    render(){
        let v = null;
        if(this.state.loading){
            v = <Loader size="2"></Loader>
        }else{
            let list = [this.state.data];
            v = <ActvityList
            bc_type="vertical"
            online_users={{}}
            fetching={false}
            type={this.props.type}
            title={null}
            subtitle={null}
            list={list}></ActvityList>
        }
        return v;
    }
}
ActivitySingle.propTypes = {
    type: PropTypes.string.isRequired,
    id : PropTypes.number.isRequired
}

// ##################################################################################################################
// ##################################################################################################################
// ##################################################################################################################


const sec = "act-sec";
class ActivitySection extends React.Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
    }

    componentWillMount() {
        this.props.loadActivity();
    }

    refresh(type) {
        this.props.loadActivity(type);
    }

    createTitleWithTooltip(title, tooltip = null) {
        return <span>
            {title}
            {(tooltip != null)
                ? <Tooltip
                    debug={false}
                    bottom="22px"
                    content={<small>{" "}<i className="fa fa-question-circle"></i></small>}
                    tooltip={tooltip}>
                </Tooltip> : null}
        </span>;
    }

    render() {
        var d = this.props.activity;

        // title session
        // var title_s = this.createTitleWithTooltip(
        //     <a onClick={() => this.refresh(hallAction.ActivityType.SESSION)}>Active Session</a>,
        //     (isRoleStudent())
        //         ? "Active one-to-one sessions will be show here. Join/rejoin session whenever it is active"
        //         : "Create sesssion with student from the Scheduled Private Session.")

        // title Zoom invitation
        // var title_zi = (isRoleRec()) ? this.createTitleWithTooltip(
        //     <a onClick={() => this.refresh(hallAction.ActivityType.ZOOM_INVITE)}>Panel Interview Invitation</a>,
        //     null) : null;

        //title queue
        //var title_q = <a onClick={() => this.refresh(hallAction.ActivityType.QUEUE)}>Queuing</a>;

        //title interview request
        // var tt_sr = <ol>
        //     {(isRoleStudent())
        //         ? <li>Visit company booths below to request for interview</li>
        //         : <li>Students will send interview request during Career Fair</li>}
        //     {(d.session_requests && d.session_requests.length > 0)
        //         ? <li>Approved interview request will appear under Scheduled Session</li>
        //         : null}
        // </ol>;

        // var title_sr = this.createTitleWithTooltip(
        //     <a onClick={() => this.refresh(hallAction.ActivityType.SESSION_REQUEST)}>Session Request</a>
        //     , tt_sr)

        // title Scheduled Session
        /*
        var subtitle_p = (isRoleStudent())
            ? null
            : <a><i className="fa fa-plus left"></i>Add New</a>;
        */

        var subtitle_p = null;

        // EUR FIX
        // var tt_p = isRoleStudent() ? "Visit company booth below and learn how to land Scheduled Sessions"
        //     : "You can also schedule sessions with students through Forum, Resume Drop, Pre-Screen and Past Sessions";
        var tt_p = isRoleStudent() ? "Upcoming one-to-one sessions will be shown here. Check your email for confirmation."
            : "You can schedule private sessions with students through Student Listing page";
        var title_p = this.createTitleWithTooltip(
            <a onClick={() => this.refresh(hallAction.ActivityType.PRESCREEN)}
            >
                Private Session{/* Scheduled Private Session */}
            </a>
            , tt_p)

        //var tt_gs = "Visit company booth below and join group session with recruiter.";
        // EUR FIX
        var tt_gs = "Upcoming group session that you signed up for will be shown here.";
        var title_gs = this.createTitleWithTooltip(
            <a onClick={() => this.refresh(hallAction.ActivityType.GROUP_SESSION_JOIN)}>Group Session</a>
            , tt_gs)
        var subtitle_gs = null;


        //var size_s = (isRoleRec()) ? "12" : "12";
        //var size_q = (isRoleRec()) ? "12" : "6";
        //var size_zi = (isRoleRec()) ? "12" : "12";
        //var size_sr = (isRoleRec()) ? "12" : "12";
        var size_p = (isRoleRec()) ? "12" : "12";

        //horizontal
        // var s = <div className={`col-sm-${size_s} no-padding`}>
        //     <ActvityList
        //         bc_type="vertical"
        //         online_users={this.props.online_users}
        //         fetching={d.fetching.sessions}
        //         type={hallAction.ActivityType.SESSION}
        //         title={title_s} list={d.sessions}></ActvityList></div>;

        // zoom invitation
        // var zi = (isRoleRec()) ? <div className={`col-sm-${size_zi} no-padding`}>
        //     <ActvityList
        //         bc_type="vertical"
        //         online_users={this.props.online_users}
        //         fetching={d.fetching.zoom_invites}
        //         type={hallAction.ActivityType.ZOOM_INVITE}
        //         title={title_zi} list={d.zoom_invites}></ActvityList></div> : null;

        /*
        var q = <div className={`col-sm-${size_q} no-padding`}>
                                    <ActvityList online_users={this.props.online_users}
                                        fetching={d.fetching.queues}
                                        type={hallAction.ActivityType.QUEUE}
                                        title={title_q} list={d.queues}></ActvityList></div>;
        */

        // session request
        // var sr = <div className={`col-sm-${size_sr} no-padding`}>
        //     <ActvityList
        //         bc_type={`vertical`}
        //         online_users={this.props.online_users}
        //         fetching={d.fetching.session_requests}
        //         type={hallAction.ActivityType.SESSION_REQUEST}
        //         title={title_sr} list={d.session_requests}></ActvityList></div>;

        //Group Session
        var gs = <div className={`col-sm-${size_p} no-padding`}>
            <ActvityList
                bc_type="vertical"
                online_users={this.props.online_users}
                fetching={d.fetching.group_session_joins}
                type={hallAction.ActivityType.GROUP_SESSION_JOIN}
                title={title_gs}
                subtitle={subtitle_gs}
                list={d.group_session_joins}></ActvityList></div>;

        //Scheduled Session
        var p = <div className={`col-sm-${size_p} no-padding`}>
            <ActvityList
                bc_type="vertical"
                online_users={this.props.online_users}
                fetching={d.fetching.prescreens}
                type={hallAction.ActivityType.PRESCREEN}
                title={title_p}
                subtitle={subtitle_p}
                list={d.prescreens}></ActvityList></div>;

        //{zi}
        /*
        <div className="row">
                <div className={`col-md-12 no-padding`}>
                    {p}
                </div>
                <div className={`col-md-12 no-padding`}>
                    {s}
                </div>
            </div>
        */


        return (isRoleRec()) ?
            <div>
                {p}
                {/* {s} */}
            </div>
            : <div>
                <div className={`col-md-6 no-padding`}>
                    {gs}
                </div>
                <div className={`col-md-6 no-padding`}>
                    {p}
                </div>
                {/* <div className={`col-md-5 no-padding`}>
                    {gs}
                </div>
                <div className={`col-md-4 no-padding`}>
                    {p}
                </div>
                {<div className={`col-md-3 no-padding`}>
                    {s}
                </div>} */}
            </div>;
    }
}

// TODO status online
function mapStateToProps(state, ownProps) {
    return {
        activity: state.hall.activity,
        online_users: state.user.online_users
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loadActivity: hallAction.loadActivity
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivitySection);


