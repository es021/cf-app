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
import { RootPath, ImgConfig } from '../../../../config/app-config';
import VacancyPopup from './vacancy-popup';
import ResumeDropPopup from './resume-drop-popup';
import { addLog } from '../../../redux/actions/other-actions';
import { getFeedbackPopupView } from '../analytics/feedback';
import { GroupSessionView } from '../hall/group-session';
import { Gallery } from '../../../component/gallery';

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
                status
                group_url
                img_url
                img_position
                img_size
                banner_url
                banner_position
                banner_size
                rec_privacy
                doc_links{ID label url type}
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

    getDocLinks(doc_links) {
        if (doc_links.length <= 0) {
            return null;
        }

        var iframe = [];
        var link = [];

        // separate document and link
        for (var i in doc_links) {

            var item = doc_links[i];
            var isIframe = item.type == DocLinkEnum.TYPE_DOC || item.url.containText("youtube");

            if (isIframe) {
                iframe.push(item);
            } else {
                link.push(item);
            }
        }


        return <div>
            <Gallery data={link} size="lg"></Gallery>
            <br></br>
            <Gallery data={iframe} size="lg"></Gallery>
        </div>
    }

    getBanner() {
        var data = this.state.data;

        const isInvalid = (d) => {
            if (typeof d === "undefined" || d == "" || d == null || d == "null") {
                return true;
            }

            return false;
        }

        data.banner_url = isInvalid(data.banner_url) ? ImgConfig.DefCompanyBanner : data.banner_url;
        var style = {
            backgroundImage: "url(" + data.banner_url + ")",
            backgroundSize: isInvalid(data.banner_size) ? "" : data.banner_size,
            backgroundPosition: isInvalid(data.banner_position) ? "center center" : data.banner_position,
        };

        return <div className="fc-banner" style={style}></div>;
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
            const doc_link = this.getDocLinks(data.doc_links);

            // ##################################################################################
            // for group session

            var gSession = (!isRoleStudent() || this.props.displayOnly) ? null :
                <div>
                    <GroupSessionView forStudent={true} company_id={this.props.id} user_id={this.authUser.ID}></GroupSessionView>
                </div>;

            // ##################################################################################
            // for action

            var actData = [
                {
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

            // var pcBody = <div>
            //     <div>
            //         {(data.description == "") ? null : <PageSection canToggle={this.props.canToggle} className="left" title="About" body={<p>{data.description}</p>}></PageSection>}
            //         <PageSection canToggle={this.props.canToggle} initShow={true} className="left" title="Job Opportunities" body={vacancies}></PageSection>
            //         <PageSection canToggle={this.props.canToggle} className="left" title="Document & Link" body={doc_link}></PageSection>
            //         {(data.more_info == "") ? null : <PageSection canToggle={this.props.canToggle} className="left" title="Additional Information" body={<p>{data.more_info}</p>}></PageSection>}
            //         {(recs === null) ? null : <PageSection canToggle={this.props.canToggle} className="left" title="Recruiters" body={recs}></PageSection>}
            //     </div>
            //     {action}
            //     {gSession}
            //     {(this.props.displayOnly) ? null :
            //         <div>
            //             <br></br>
            //             <a onClick={layoutActions.storeHideFocusCard}>Close</a>
            //         </div>
            //     }
            // </div>;

            // view = <div>
            //     <ProfileCard type="company"
            //         title={data.name} subtitle={data.tagline}
            //         img_url={data.img_url} img_pos={data.img_position} img_size={data.img_size}
            //         body={pcBody}></ProfileCard>
            // </div>;

            //
            var profilePic = <ProfileCard type="company"
                img_dimension={"130px"}
                img_url={data.img_url} img_pos={data.img_position} img_size={data.img_size}
                title={<h3>{data.name}</h3>} subtitle={data.tagline}
                body={null}></ProfileCard>;

            var rightBody = <div>
                {action}
                {gSession}
            </div>

            var maxHeight = 143;
            var leftBody = <div>
                <div>
                    {(doc_link == null) ? null : <PageSection canToggle={this.props.canToggle} className="left" title="Gallery" body={doc_link}></PageSection>}
                    {(data.description == "") ? null : <PageSection maxHeight={maxHeight} canToggle={this.props.canToggle} className="left" title="About" body={<p>{data.description}</p>}></PageSection>}
                    <PageSection canToggle={this.props.canToggle} initShow={true} className="left" title="Job Opportunities" body={vacancies}></PageSection>
                    {(data.more_info == "") ? null : <PageSection maxHeight={maxHeight} canToggle={this.props.canToggle} className="left" title="Additional Information" body={<p>{data.more_info}</p>}></PageSection>}
                    {(recs === null) ? null : <PageSection canToggle={this.props.canToggle} className="left" title="Recruiters" body={recs}></PageSection>}
                </div>
            </div>;

            view = (this.props.displayOnly)
                ?
                <div>
                    {profilePic}
                    {rightBody}
                    {leftBody}
                </div>
                :
                <div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-3 com-pop-left">
                                <div className="com-pop-pic">{profilePic}</div>
                                {rightBody}
                            </div>
                            <div className="col-md-9">
                                {leftBody}
                            </div>
                        </div>
                        <div>
                            <br></br>
                            <a onClick={layoutActions.storeHideFocusCard}>Close</a>
                        </div>
                    </div>
                    {this.getBanner()}
                </div>;
        }

        return (view);
    }
};


CompanyPopup.propTypes = {
    id: PropTypes.number.isRequired,
    displayOnly: PropTypes.bool, // set true in session
    canToggle: PropTypes.bool, // set true in session
    isPreEvent: PropTypes.bool
};

CompanyPopup.defaultProps = {
    displayOnly: false,
    isPreEvent: false
};