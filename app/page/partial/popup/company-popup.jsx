import React, { Component } from 'react';
import {loadUser} from '../../../redux/actions/user-actions';
import PropTypes from 'prop-types';
import PageSection from '../../../component/page-section';
import {NavLink} from 'react-router-dom';
import {getAxiosGraphQLQuery} from '../../../../helper/api-helper';
import ProfileCard from '../../../component/profile-card';
import {SimpleListItem, ProfileListItem} from '../../../component/list';
import {Loader} from '../../../component/loader';
import {getAuthUser} from '../../../redux/actions/auth-actions';

import * as activityActions from '../../../redux/actions/activity-actions';
import * as layoutActions from '../../../redux/actions/layout-actions';
import * as hallAction from '../../../redux/actions/hall-actions';

import VacancyPopup from './vacancy-popup';
import ResumeDropPopup from './resume-drop-popup';


export default class CompanyPopup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            loading: true,
        }

        this.startQueue = this.startQueue.bind(this);
    }

    componentWillMount() {
        var id = null;

        if (this.props.match) {
            id = this.props.match.params.id
        } else {
            id = this.props.id;
        }

        var query = `query {
              company(ID:${id}) {
                ID
                name
                tagline
                description
                img_url
                img_position
                img_size
                recruiters{
                    first_name
                    last_name
                    rec_position
                    img_url img_pos img_size
                }
                vacancies{
                    ID
                    title
                    type
                    description
                }
            }}`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState(() => {
                return {data: res.data.data.company, loading: false}
            })
        });
    }

    startQueue() {
        var stu_id = getAuthUser().ID;
        var com_id = this.props.id;

        var invalid = activityActions.invalidQueue(com_id);
        if (invalid !== false) {
            layoutActions.errorBlockLoader(invalid);
            return false;
        }

        layoutActions.loadingBlockLoader("Start Queuing");

        activityActions.startQueue(stu_id, com_id).then((res) => {
            var mes = <div>
                Successfully joined queue for 
                <br></br><b>{this.state.data.name}</b>
                <br></br>Your queue number is <b>{res.queue_num}</b>
            </div>;

            layoutActions.successBlockLoader(mes);
            hallAction.storeLoadActivity([hallAction.ActivityType.QUEUE]);
        }, (err) => {
            layoutActions.errorBlockLoader(err);
        });
    }

    getVacancies(list) {
        if (list.length === 0) {
            return <div className="text-muted">Nothing To Show Here</div>;
        }

        var view = list.map((d, i) => {
            var param = {id: d.ID};
            var title = <a 
                onClick={() => layoutActions.storeUpdateFocusCard(d.title, VacancyPopup, param)} 
                >{d.title}</a>;

            return <SimpleListItem title={title} subtitle={d.type} body={d.description} key={i}></SimpleListItem>;
        });

        return <div>{view}</div>;
    }

    getRecs(list) {
        if (list.length === 0) {
            return <div className="text-muted">Nothing To Show Here</div>;
        }

        var view = list.map((d, i) => {
            var name = <div className="text-muted">Name Not Available</div>;
            if (d.first_name != "" && d.last_name != "") {
                name = <span>{d.first_name}<small> {d.last_name}</small></span>;
            }

            if (d.rec_position == null) {
                d.rec_position = <div className="text-muted">Position Not Available</div>;
            }

            return <ProfileListItem title={name} 
                             img_url={d.img_url}
                             img_pos={d.img_pos}
                             img_size={d.img_size}
                             subtitle={d.rec_position} 
                             type="recruiter" key={i}></ProfileListItem>;
        });

        return <div>{view}</div>;
    }

    render() {
        var id = null;
        var data = this.state.data;
        var view = null;

        if (this.state.loading) {
            view = <Loader size='3' text='Loading Company Information...'></Loader>
        } else {

            const about = <p>{data.description}</p>;
            const vacancies = this.getVacancies(data.vacancies);
            const recs = this.getRecs(data.recruiters);

            var pcBody = <div>
                <div>
                    <PageSection className="left" title="About" body={about}></PageSection>
                    <PageSection className="left" title="Vacancies" body={vacancies}></PageSection>
                    <PageSection className="left" title="Recruiters" body={recs}></PageSection>
                </div>
                <div className="btn-group btn-group-justified">
                    <div className="btn btn-lg btn-primary" onClick={this.startQueue}>
                        <i className="fa fa-sign-in left"></i>
                        Queue Now</div>
          
                    <a target="_blank"
                              onClick={() => layoutActions.storeUpdateFocusCard(`Resume Drop - ${data.name}`
                              , ResumeDropPopup, {company_id:data.ID})} 
                              className="btn btn-lg btn-default">
                        <i className="fa fa-download left"></i>    
                        Drop Resume</a>
            
                </div>
                <br></br>
                <a onClick={layoutActions.storeHideFocusCard}>Close</a>
            </div>;
         
            view = <div>
                <ProfileCard type="company"
                             title={data.name} subtitle={data.tagline}
                             img_url={data.img_url} img_pos={data.img_position} img_size={data.img_size}
                             body={pcBody}></ProfileCard>
            </div>;
        }

        return (view);
    }
};


CompanyPopup.propTypes = {
    id: PropTypes.number
};