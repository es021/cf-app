//Faizul Here

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Loader } from '../../../component/loader';
import { GeneralForm } from '../../../component/general-form';
import ProfileCard from '../../../component/profile-card';
import { CompanyEnum, UserEnum, PrescreenEnum, SessionRequestEnum, GroupSession } from '../../../../config/db-config';
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
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
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
        d[GroupSession.COMPANY_ID] = this.authUser.rec_company;
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
    finishAdd: PropTypes.func.isRequired
}

class GroupSessionCompanyClass extends React.Component {
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

        var q = `query { group_sessions(company_id:${this.authUser.rec_company})
        { ID
          start_time 
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

                var studentName = dj.first_name + " " + dj.last_name;
                var onClickJoiner = () => layoutActions.storeUpdateFocusCard(studentName, UserPopup, { id: dj.ID });

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

            if (d.joiners.length <= 0) {
                joiners = <small className="text-muted">No Participant Yet</small>;
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
                    </div>
                </div>
                <div className="joiner">{joiners}</div>
                <div className="action btn btn-success btn-sm" data-id={d.ID}
                    onClick={(e) => { this.startVideoCall(e) }}>
                    Start Video Call
                </div>

            </div>;
        });

        return <div className="group-session">
            {this.createAddNewGs()}
            {list}
        </div>
    }
    startVideoCall(e) {
        var id = e.currentTarget.dataset.id;
        console.log(id);
    }
    createAddNewGs() {
        const onClick = () => {
            layoutActions.storeUpdateFocusCard("Schedule New Group Session"
                , NewGroupSessionPopup
                , { finishAdd: () => { this.loadData() } }
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
        return <div>
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

export const GroupSessionCompany = connect(mapStateToProps, mapDispatchToProps)(GroupSessionCompanyClass);

