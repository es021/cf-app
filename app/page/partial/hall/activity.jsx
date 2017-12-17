import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hallAction from '../../../redux/actions/hall-actions';
import {getAuthUser} from '../../../redux/actions/auth-actions';
import PropTypes from 'prop-types';
import {Loader} from '../../../component/loader';
import ProfileCard from '../../../component/profile-card';
import {CompanyEnum, UserEnum}  from '../../../../config/db-config';
import {ButtonLink} from '../../../component/buttons';
import {ProfileListItem} from '../../../component/list';

import * as layoutActions from '../../../redux/actions/layout-actions';

const user_role = getAuthUser().role;

class ActvityList extends React.Component {

    render() {
        var body = null;
        if (this.props.fetching) {
            body = <Loader size="2"></Loader>;
        } else {
            body = this.props.list.map((d, i) => {
                var obj = d.company;
                console.log(d);
                var title = (user_role === UserEnum.ROLE_STUDENT) ? obj.name : obj.first_name;

                var subtitle = null;
                var body = null;
                switch (this.props.type) {
                    case hallAction.ActivityType.SESSION:
                        subtitle = "Started a minute ago";
                        body = <div className="btn btn-sm btn-success">Go To Session</div>;
                        break;
                    case hallAction.ActivityType.QUEUE:
                        subtitle = "Queuing since 3 hours ago";
                        body = <div className="btn btn-sm btn-danger">Cancel Queue</div>;

                        break;
                    case hallAction.ActivityType.PRESCREEN:
                        subtitle = "Appointment at bla bla bla";
                        //body = <div style={{height:"30px"}}></div>;
                        body = <div></div>;
                        break;
                }

                var img_position = (user_role === UserEnum.ROLE_STUDENT) ? obj.img_position : obj.img_pos;
                return <ProfileListItem className="" title={title} 
                                 img_url={obj.img_url}
                                 img_pos={img_position}
                                 img_size={obj.img_size}
                                 img_dimension="50px"
                                 body={body}
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
            justifyContent: "center"
        };

        return (<div><h4>{this.props.title}</h4>
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
        return (
                <div className="row">
                    <div className="col-sm-3 no-padding">    
                        <ActvityList fetching={d.fetching.sessions} 
                                     type={hallAction.ActivityType.SESSION}
                                     title={title_s} list={d.sessions}></ActvityList>
                    </div>
                    <div className="col-sm-6 no-padding">    
                        <ActvityList fetching={d.fetching.queues} 
                                     type={hallAction.ActivityType.QUEUE}
                                     title={title_q} list={d.queues}></ActvityList>
                    </div>
                    <div className="col-sm-3 no-padding">    
                        <ActvityList fetching={d.fetching.prescreens} 
                                     type={hallAction.ActivityType.PRESCREEN}
                                     title={title_p} list={d.prescreens}></ActvityList>
                    </div>
                
                </div>);
    }
}

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


