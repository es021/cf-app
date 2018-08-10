import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageSection from '../../../component/page-section';
import { NavLink } from 'react-router-dom';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import ProfileCard from '../../../component/profile-card';
import List, { SimpleListItem, ProfileListItem } from '../../../component/list';
import { Loader } from '../../../component/loader';
import { getAuthUser, isRoleRec, isRoleStudent, isRoleAdmin } from '../../../redux/actions/auth-actions';
import { DocLinkEnum, CompanyEnum, LogEnum } from '../../../../config/db-config';
import { CustomList, createIconLink } from '../../../component/list';

import * as activityActions from '../../../redux/actions/activity-actions';
import * as layoutActions from '../../../redux/actions/layout-actions';
import * as hallAction from '../../../redux/actions/hall-actions';
import { emitQueueStatus, emitHallActivity } from '../../../socket/socket-client';
import { RootPath } from '../../../../config/app-config';

import VacancyPopup from './vacancy-popup';
import ResumeDropPopup from './resume-drop-popup';

import { addLog } from '../../../redux/actions/other-actions';

import { getFeedbackPopupView } from '../analytics/feedback';

import { GroupSessionView } from '../hall/group-session';

// indicator for company group session
export const isCompanyGsOpen = function (company) {
    return company.status == CompanyEnum.STS_GS && company.group_url != "";
}

export const isCompanyGsStarted = function (status, group_url) {
    return company.status == CompanyEnum.STS_GS && company.group_url == "";
}

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
            loading: true
        }

        this.authUser = getAuthUser();
        this.isRec = getAuthUser().rec_company == this.props.id || isRoleAdmin();
        this.FEEDBACK_LIMIT_SR = 3;

        this.getRecs = this.getRecs.bind(this);
        this.startQueue = this.startQueue.bind(this);
        this.addSessionRequest = this.addSessionRequest.bind(this);
    }

    componentWillMount() {

        var id = null;

        if (this.props.match) {
            id = this.props.match.params.id
        } else {
            id = this.props.id;
        }

        var logData = {
            id: Number.parseInt(id),
            location: window.location.pathname
        };
        addLog(LogEnum.EVENT_VISIT_COMPANY, JSON.stringify(logData), getAuthUser().ID);

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
                status
                group_url
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
            this.setState((prevState) => {
                return { data: res.data.data.company, loading: false }
            })
        });
    }

    addSessionRequest() {
        var stu_id = this.authUser.ID;
        var com_id = this.props.id;

        // first filter
        var invalid = activityActions.invalidSessionRequest(com_id);
        if (invalid !== false) {
            layoutActions.errorBlockLoader(invalid);
            return false;
        }
        else {
            layoutActions.loadingBlockLoader("Adding Request");

            // check for feedback
            var query = `query { has_feedback (user_id: ${stu_id}) } `;
            getAxiosGraphQLQuery(query).then((res) => {

                var has_feedback = res.data.data.has_feedback;
                var ttl_pending = activityActions.pendingSessionRequestCount(com_id);

                // if no feedback open popup
                if (ttl_pending >= this.FEEDBACK_LIMIT_SR && (!has_feedback)) {
                    //layoutActions.storeUpdate("Feedback", getFeedbackPopupView());
                    layoutActions.errorBlockLoader(getFeedbackPopupView(false));

                } else {
                    // add session request
                    activityActions.addSessionRequest(stu_id, com_id).then((res) => {
                        var mes = <div>
                            Successfully send interview request to
                    <br></br><b>{this.state.data.name}</b>
                            <br></br>The request status will be shown under Interview Request</div>;

                        emitHallActivity(hallAction.ActivityType.SESSION_REQUEST, null, com_id);

                        layoutActions.successBlockLoader(mes);
                        hallAction.storeLoadActivity([hallAction.ActivityType.SESSION_REQUEST]);
                    }, (err) => {
                        layoutActions.errorBlockLoader(err);
                    });
                }
            });
        }
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


    joinGroupSessionOld(data) {
        if (data.group_url == "" || data.group_url == null) {
            layoutActions.errorBlockLoader("Group session has started. Please try again in a few minutes");
        } else {
            window.open(data.group_url, "_blank");
        }
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

            //<div className="btn btn-lg btn-primary" onClick={this.startQueue}>
            //<i className="fa fa-sign-in left"></i>
            //Queue Now</div>

            // var action = (!isRoleStudent() || this.props.displayOnly) ? null :
            //     <div className="btn-group btn-group-justified">
            //         <div className="btn btn-lg btn-blue" onClick={this.addSessionRequest}>
            //             <i className="fa fa-sign-in left"></i>
            //             Request For Interview</div>
            //         <a target="_blank"
            //             onClick={() => layoutActions.storeUpdateFocusCard(`Resume Drop - ${data.name}`
            //                 , ResumeDropPopup, { company_id: data.ID })}
            //             className="btn btn-lg btn-default">
            //             <i className="fa fa-download left"></i>
            //             Drop Resume</a>
            //     </div>;

            // ##################################################################################
            // for group session

            var gSession = (!isRoleStudent() || this.props.displayOnly) ? null :
                <div>
                    <h2 style={{ marginTop: "10px" }}>
                        <small>or<br></br>Join A Group Session</small>
                    </h2>
                    <GroupSessionView forStudent={true} company_id={this.props.id} user_id={this.authUser.ID}></GroupSessionView>
                </div>;

            // ##################################################################################
            // for action

            var actData = [
                // data.status == CompanyEnum.STS_GS
                //     ? {
                //         label: "Join Group Session"
                //         , onClick: () => this.joinGroupSession(data)
                //         , icon: "users"
                //         , color: "#449d44"
                //     } :
                //     {
                //         label: "Request For Private Session"
                //         , onClick: this.addSessionRequest
                //         , icon: "sign-in"
                //         , color: "#c62323"
                //     }
                , {
                    label: "Ask Questions In Company Forum"
                    , url: `${RootPath}/app/forum/company_${data.ID}`
                    , icon: "comments"
                    , color: "#007BB4"
                }, {
                    label: "Drop Your Resume"
                    , onClick: () => layoutActions.storeUpdateFocusCard(`Resume Drop - ${data.name}`
                        , ResumeDropPopup, { company_id: data.ID })
                    , icon: "download"
                    , color: "#efa30b"
                }
            ];

            var action = (!isRoleStudent() || this.props.displayOnly) ? null :
                <div>
                    <h2 style={{ marginTop: "0" }}>
                        <small>Check These Out!</small>
                    </h2>
                    {createIconLink("lg", actData, true)}
                </div>;

            // ##################################################################################
            // create body

            var pcBody = <div>
                <div>
                    {(data.description == "") ? null : <PageSection canToggle={this.props.canToggle} className="left" title="About" body={<p>{data.description}</p>}></PageSection>}
                    <PageSection canToggle={this.props.canToggle} initShow={true} className="left" title="Job Opportunities" body={vacancies}></PageSection>
                    <PageSection canToggle={this.props.canToggle} className="left" title="Document & Link" body={doc_link}></PageSection>
                    {(data.more_info == "") ? null : <PageSection canToggle={this.props.canToggle} className="left" title="Additional Information" body={<p>{data.more_info}</p>}></PageSection>}
                    {(recs === null) ? null : <PageSection canToggle={this.props.canToggle} className="left" title="Recruiters" body={recs}></PageSection>}
                </div>
                {action}
                {gSession}
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
    displayOnly: PropTypes.bool, // set true in session
    canToggle: PropTypes.bool // set true in session
};

CompanyPopup.defaultProps = {
    displayOnly: false
};