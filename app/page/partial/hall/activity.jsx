import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {Loader} from '../../../component/loader';
import ProfileCard from '../../../component/profile-card';
import {CompanyEnum, UserEnum}  from '../../../../config/db-config';
import {ButtonLink} from '../../../component/buttons';
import {ProfileListItem} from '../../../component/list';
import {Time} from '../../../lib/time';
import {RootPath} from '../../../../config/app-config';
import {NavLink} from 'react-router-dom';
import {getAuthUser} from '../../../redux/actions/auth-actions';

import {ActivityAPIErr} from '../../../../server/api/activity-api';

import UserPopup from '../popup/user-popup';

import * as layoutActions from '../../../redux/actions/layout-actions';
import * as activityActions from '../../../redux/actions/activity-actions';
import * as hallAction from '../../../redux/actions/hall-actions';

import {isRoleRec} from '../../../redux/actions/auth-actions';

class ActvityList extends React.Component {

    constructor(props) {
        super(props);

        this.cancelQueue = this.cancelQueue.bind(this);
        
    }

    cancelQueue(e) {
        layoutActions.loadingBlockLoader("Canceling Queue..");
        activityActions.cancelQueue(e.currentTarget.id).then((res) => {
            layoutActions.successBlockLoader("Queue Canceled");
            hallAction.storeLoadActivity([hallAction.ActivityType.QUEUE]);
        }, (err) => {
            layoutActions.errorBlockLoader(err);
        });
    }

    //TODO
    createSession(e) {
        var invalid = activityActions.invalidSession();
        
        if(invalid !== false){
            layoutActions.errorBlockLoader(invalid);
            return false;
        }

        var host_id = getAuthUser().ID;
        var participant_id = e.currentTarget.dataset.pid;
        var entity = e.currentTarget.dataset.entity;
        var entity_id = e.currentTarget.dataset.entity_id;
        
        layoutActions.loadingBlockLoader("Creating Session..");
        activityActions.createSession(host_id, participant_id, entity, entity_id).then((res) => {
            console.log("success");
            console.log(res.data);
            
            var m = <div>Session Successfully Created<br></br>
                <NavLink to={`${RootPath}/app/session/${res.data.ID}`}>
                    Go To Session
                </NavLink>
            </div>;
            
            layoutActions.successBlockLoader(m);
            hallAction.storeLoadActivity([hallAction.ActivityType.SESSION, entity]);
            
        }, (err) => {
            var m = "";
            switch(err.response.data){
               case ActivityAPIErr.HAS_SESSION:
                    m = "This student is currently engaged";
                    break;
            }
            
            layoutActions.errorBlockLoader(m);
            
        });
    } 

    render() {
        var body = null;
        if (this.props.fetching) {
            body = <Loader size="2"></Loader>;
        } else {

            body = this.props.list.map((d, i) => {

                var obj = (isRoleRec()) ? d.student : d.company;

                // 1. title
                var title = null;
                if (isRoleRec()) {
                    var params = {id: obj.ID};
                    title = <ButtonLink label={obj.first_name + " " + obj.last_name}
                            onClick={() => layoutActions.storeUpdateFocusCard(obj.first_name + " " + obj.last_name, UserPopup, params)}></ButtonLink>;
                } else {
                    title = obj.name;
                }

                // 2. subtitle and body
                var subtitle = null;
                var badge = null;
                var badge_tooltip = null;
                var body = null;
                var crtSession = null;

                if (isRoleRec()) {
                    crtSession = <div data-pid={obj.ID} data-entity_id={d.ID} data-entity={this.props.type} 
                     onClick={this.createSession.bind(this)} className="btn btn-sm btn-primary">Create Session</div>;
                }


                switch (this.props.type) {
                    case hallAction.ActivityType.SESSION:
                        subtitle = `${Time.getAgo(d.created_at)}`;
                        body = <NavLink to={`${RootPath}/app/session/${d.ID}`}>
                            <div className="btn btn-sm btn-success">Go To Session</div>
                        </NavLink>;
                        break;

                    case hallAction.ActivityType.QUEUE:
                        subtitle = `${Time.getAgo(d.created_at)}`;
                        subtitle = `${Time.getAgo(d.created_at)}`;

                        if (!isRoleRec()) {
                            badge = `${d.queue_num}`;
                            badge_tooltip = `Your queue number`;
                        }

                        body = (isRoleRec()) ? crtSession
                                : <div id={d.ID} onClick={(e) => this.cancelQueue(e)} 
                                     className="btn btn-sm btn-danger">Cancel Queue</div>;
                        break;

                    case hallAction.ActivityType.PRESCREEN:
                        subtitle = `${Time.getString(d.appointment_time)}`;
                        //body = <div style={{height:"30px"}}></div>;
                        body = (isRoleRec()) ? crtSession : <div></div>;
                        break;
                }

                var img_position = (isRoleRec()) ? obj.img_pos : obj.img_position;
                return <ProfileListItem className="" title={title} list_type="card"
                                 img_url={obj.img_url}
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
                body = <div className="text-muted">Nothing to show here</div>;
            }

        }

        var style = {
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "center",
            marginBottom: "15px"
        };

        return (<div><h3>{this.props.title}</h3>
            <div style={style}>{body}</div>
        </div>);
    }

}

ActvityList.propTypes = {
    type: PropTypes.oneOf([hallAction.ActivityType.SESSION, hallAction.ActivityType.QUEUE, hallAction.ActivityType.PRESCREEN]).isRequired,
    title: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    fetching: PropTypes.bool.isRequired
};

const sec = "act-sec";
class ActivitySection extends React.Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
    }

    componentWillMount() {
        //this.props.loadActivity([hallAction.ActivityType.SESSION]);
        this.props.loadActivity();
    }

    refresh(type) {
        this.props.loadActivity(type);
    }

    render() {
        console.log("FROM ACTIVITY SECTION");
        console.log(this.props.activity);
        var d = this.props.activity;
        var title_s = <a onClick={() => this.refresh(hallAction.ActivityType.SESSION)}>Active Session</a>;
        var title_q = <a onClick={() => this.refresh(hallAction.ActivityType.QUEUE)}>Queuing</a>;
        var title_p = <a onClick={() => this.refresh(hallAction.ActivityType.PRESCREEN)}>Pre-Screen</a>;

        var size_s = (isRoleRec()) ? "12" : "3";
        var size_q = (isRoleRec()) ? "12" : "6";
        var size_p = (isRoleRec()) ? "12" : "3";

        var s = <div className={`col-sm-${size_s} no-padding`}><ActvityList fetching={d.fetching.sessions} 
                         type={hallAction.ActivityType.SESSION}
                         title={title_s} list={d.sessions}></ActvityList></div>;

        var q = <div className={`col-sm-${size_q} no-padding`}><ActvityList fetching={d.fetching.queues} 
                 type={hallAction.ActivityType.QUEUE}
                 title={title_q} list={d.queues}></ActvityList></div>;

        var p = <div className={`col-sm-${size_p} no-padding`}><ActvityList fetching={d.fetching.prescreens} 
                 type={hallAction.ActivityType.PRESCREEN}
                 title={title_p} list={d.prescreens}></ActvityList></div>;

        return (isRoleRec()) ? <div className="row">{s}{p}{q}</div> : <div className="row">{s}{q}{p}</div>;
    }
}

// TODO status online
function mapStateToProps(state, ownProps) {
    return {
        activity: state.hall.activity
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loadActivity: hallAction.loadActivity
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivitySection);


