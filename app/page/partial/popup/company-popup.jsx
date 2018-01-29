import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageSection from '../../../component/page-section';
import { NavLink } from 'react-router-dom';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import ProfileCard from '../../../component/profile-card';
import List, { SimpleListItem, ProfileListItem } from '../../../component/list';
import { Loader } from '../../../component/loader';
import { getAuthUser, isRoleRec, isRoleAdmin } from '../../../redux/actions/auth-actions';
import { DocLinkEnum, CompanyEnum } from '../../../../config/db-config';
import { CustomList } from '../../../component/list';

import * as activityActions from '../../../redux/actions/activity-actions';
import * as layoutActions from '../../../redux/actions/layout-actions';
import * as hallAction from '../../../redux/actions/hall-actions';
import { emitQueueStatus, emitHallActivity } from '../../../socket/socket-client';

import VacancyPopup from './vacancy-popup';
import ResumeDropPopup from './resume-drop-popup';


class VacancyList extends React.Component {
    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
    }

    loadData(page, offset) {
        return getAxiosGraphQLQuery(`
        query{
            vacancies(company_id:${this.props.company_id}, page:${page}, offset:${offset}){
                ID
                title
                type
                description
            }
        }`);
    };

    componentWillMount() {
        this.offset = 5;
    }

    renderList(d, i) {

        var param = { id: d.ID };
        var title = <a
            onClick={() => layoutActions.storeUpdateFocusCard(d.title, VacancyPopup, param)}>{d.title}</a>;
        return <SimpleListItem title={title} subtitle={d.type} body={d.description} key={i}></SimpleListItem>;
    }

    getDataFromRes(res) {
        return res.data.data.vacancies;
    }

    render() {
        return (
            <List type="list"
                pageClass="text-center"
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
                offset={this.offset}
                renderList={this.renderList}></List>);

    }
}

VacancyList.propTypes = {
    company_id: PropTypes.number.isRequired
};

export default class CompanyPopup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            loading: true,
        }

        this.isRec = getAuthUser().rec_company == this.props.id || isRoleAdmin();

        this.getRecs = this.getRecs.bind(this);
        this.startQueue = this.startQueue.bind(this);
    }

    componentWillMount() {
        var id = null;

        if (this.props.match) {
            id = this.props.match.params.id
        } else {
            id = this.props.id;
        }

        var rec_query = (this.props.displayOnly) ? "" : `recruiters{
            first_name
            last_name
            rec_position
            img_url img_pos img_size
        }`;

        var query = `query {
              company(ID:${id}) {
                ID
                name
                tagline
                description
                img_url
                img_position
                img_size
                rec_privacy
                doc_links{label url type}
                more_info
                ${rec_query}
                vacancies{
                    ID
                    title
                    type
                    description
                }
            }}`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState(() => {
                return { data: res.data.data.company, loading: false }
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

            emitQueueStatus(com_id, stu_id, "startQueue");
            emitHallActivity(hallAction.ActivityType.QUEUE, null, com_id);

            layoutActions.successBlockLoader(mes);
            hallAction.storeLoadActivity([hallAction.ActivityType.QUEUE]);
        }, (err) => {
            layoutActions.errorBlockLoader(err);
        });
    }

    getVacancies(company_id) {
        return <VacancyList company_id={company_id}></VacancyList>;
    }

    getRecs(list, rec_privacy) {
        if (list == null || typeof list == "undefined") {
            return null;
        }

        if (list.length === 0) {
            return <div className="text-muted">Nothing To Show Here</div>;
        }
        console.log(rec_privacy);
        console.log(this.isRec);
        if (rec_privacy && !this.isRec) {
            return <div className="text-muted">This information is private</div>;
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

        return <div>
            {(!rec_privacy) ? null
                : <div className="text-muted">This information is private to others.<br></br></div>}
            {view}
        </div>;
    }

    render() {
        var id = null;
        var data = this.state.data;
        var view = null;

        if (this.state.loading) {
            view = <Loader size='3' text='Loading Company Information...'></Loader>
        } else {
            const vacancies = this.getVacancies(data.ID);
            const recs = this.getRecs(data.recruiters, data.rec_privacy);

            //document and link
            var dl = data.doc_links.map((d, i) => {
                var icon = (d.type === DocLinkEnum.TYPE_DOC) ? "file-text" : "link";
                return <span><i className={`fa left fa-${icon}`}></i>
                    <a target='_blank' href={`${d.url}`}>{`${d.label} `}</a>
                </span>;
            });

            const doc_link = <CustomList className="label" items={dl}></CustomList>;

            var action = (isRoleRec() || this.props.displayOnly) ? null :
                <div className="btn-group btn-group-justified">
                    <div className="btn btn-lg btn-primary" onClick={this.startQueue}>
                        <i className="fa fa-sign-in left"></i>
                        Queue Now</div>

                    <a target="_blank"
                        onClick={() => layoutActions.storeUpdateFocusCard(`Resume Drop - ${data.name}`
                            , ResumeDropPopup, { company_id: data.ID })}
                        className="btn btn-lg btn-default">
                        <i className="fa fa-download left"></i>
                        Drop Resume</a>
                </div>;

            var pcBody = <div>
                <div>
                    {(data.description == "") ? null : <PageSection canToggle={this.props.displayOnly} className="left" title="About" body={<p>{data.description}</p>}></PageSection>}
                    <PageSection canToggle={this.props.displayOnly} initShow={true} className="left" title="Vacancies" body={vacancies}></PageSection>
                    <PageSection canToggle={this.props.displayOnly} className="left" title="Document & Link" body={doc_link}></PageSection>
                    {(data.more_info == "") ? null : <PageSection canToggle={this.props.displayOnly} className="left" title="Additional Information" body={<p>{data.more_info}</p>}></PageSection>}
                    {(recs === null) ? null : <PageSection canToggle={this.props.displayOnly} className="left" title="Recruiters" body={recs}></PageSection>}
                </div>
                {action}
                <br></br>
                {(this.props.displayOnly) ? null : <a onClick={layoutActions.storeHideFocusCard}>Close</a>}
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
    id: PropTypes.number.isRequired,
    displayOnly: PropTypes.bool // set true in session
};

CompanyPopup.defaultProps = {
    displayOnly: false
};