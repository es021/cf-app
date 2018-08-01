//Faizul Here

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Loader } from '../../../component/loader';
import ProfileCard from '../../../component/profile-card';
import { CompanyEnum, UserEnum, PrescreenEnum, SessionRequestEnum } from '../../../../config/db-config';
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

require("../../../css/group-session.scss");



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
        var q = `query { group_sessions(company_id:${this.authUser.rec_company})
        { start_time 
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

                var onClickJoiner = () => layoutActions.storeUpdateFocusCard(dj.first_name + " " + dj.last_name, UserPopup, { id: dj.ID });

                return <div className="join-item"
                    onClick={onClickJoiner}>{imgView}</div>
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
                <div className="action btn btn-success btn-sm">Start Session</div>

            </div>;
        });

        return <div className="group-session">
            <div className="gs-company add">
                <div><i className="fa fa-plus fa-3x"></i></div>
            </div>
            {list}
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

