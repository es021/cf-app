import React, { Component } from "react";
import PropTypes from "prop-types";
import obj2arg from "graphql-obj2arg";
import PageSection from "../../../component/page-section";
import { NavLink } from "react-router-dom";
import { getAxiosGraphQLQuery } from "../../../../helper/api-helper";
import ProfileCard from "../../../component/profile-card.jsx";
import List, { SimpleListItem, ProfileListItem } from "../../../component/list";
import { Loader } from "../../../component/loader";
import {
  getAuthUser,
  isRoleRec,
  isRoleStudent,
  isRoleAdmin
} from "../../../redux/actions/auth-actions";
import {
  DocLinkEnum,
  CompanyEnum,
  LogEnum
} from "../../../../config/db-config";
import { CustomList, createIconLink } from "../../../component/list";
import * as activityActions from "../../../redux/actions/activity-actions";
import * as layoutActions from "../../../redux/actions/layout-actions";
import * as hallAction from "../../../redux/actions/hall-actions";
import {
  emitQueueStatus,
  emitHallActivity
} from "../../../socket/socket-client";
import { RootPath, ImgConfig, AppPath } from "../../../../config/app-config";
import VacancyPopup from "./vacancy-popup";
import ResumeDropPopup from "./resume-drop-popup";
import { addLog } from "../../../redux/actions/other-actions";
import { feedbackStudent } from "../analytics/feedback";
import { GroupSessionView } from "../hall/group-session";
import { Gallery, isGalleryIframe } from "../../../component/gallery";
import ValidationStudentAction, { ValidationSource } from "../../../component/validation-student-action";
import ActionBox from "../../../component/action-box";

// #################################################################
// #################################################################

class VacancyList extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
  }

  loadData(page, offset) {
    return getAxiosGraphQLQuery(`
        query{
            vacancies(company_id:${
              this.props.company_id
            }, page:${page}, offset:${offset}){
                ID
                title
                type
                description
            }
        }`);
  }

  componentWillMount() {
    this.offset = 5;
  }

  renderList(d, i) {
    var param = { id: d.ID };
    var title = (
      <a
        onClick={() =>
          layoutActions.storeUpdateFocusCard(d.title, VacancyPopup, param)
        }
      >
        {d.title}
      </a>
    );
    return (
      <SimpleListItem
        title={title}
        subtitle={d.type}
        body={d.description}
        key={i}
      />
    );
  }

  getDataFromRes(res) {
    return res.data.data.vacancies;
  }

  render() {
    return (
      <List
        type="list"
        pageClass="text-center"
        getDataFromRes={this.getDataFromRes}
        loadData={this.loadData}
        offset={this.offset}
        renderList={this.renderList}
      />
    );
  }
}

VacancyList.propTypes = {
  company_id: PropTypes.number.isRequired
};

// #####################################################################
// #####################################################################
// #####################################################################

export default class CompanyPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qsLastSubmitted: Date.now(),
      data: null,
      loading: true,
      isHiddenValidation: true,
      keyValidation: 0
    };

    this.forum_id = "company_" + this.props.id;
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
      id = this.props.match.params.id;
    } else {
      id = this.props.id;
    }

    var logData = {
      id: Number.parseInt(id),
      location: window.location.pathname
    };
    addLog(
      LogEnum.EVENT_VISIT_COMPANY,
      JSON.stringify(logData),
      getAuthUser().ID
    );

    var rec_query = this.props.displayOnly
      ? ""
      : `recruiters{
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

    getAxiosGraphQLQuery(query).then(res => {
      this.setState(prevState => {
        return { data: res.data.data.company, loading: false };
      });
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
    } else {
      layoutActions.loadingBlockLoader("Adding Request");

      // check for feedback
      var query = `query { has_feedback (user_id: ${stu_id}) } `;
      getAxiosGraphQLQuery(query).then(res => {
        var has_feedback = res.data.data.has_feedback;
        var ttl_pending = activityActions.pendingSessionRequestCount(com_id);

        // if no feedback open popup
        if (ttl_pending >= this.FEEDBACK_LIMIT_SR && !has_feedback) {
          //layoutActions.storeUpdate("Feedback", feedbackStudent());
          layoutActions.errorBlockLoader(feedbackStudent(false));
        } else {
          // add session request
          activityActions.addSessionRequest(stu_id, com_id).then(
            res => {
              var mes = (
                <div>
                  Successfully send interview request to
                  <br />
                  <b>{this.state.data.name}</b>
                  <br />
                  The request status will be shown under Interview Request
                </div>
              );

              emitHallActivity(
                hallAction.ActivityType.SESSION_REQUEST,
                null,
                com_id
              );

              layoutActions.successBlockLoader(mes);
              hallAction.storeLoadActivity([
                hallAction.ActivityType.SESSION_REQUEST
              ]);
            },
            err => {
              layoutActions.errorBlockLoader(err);
            }
          );
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

    activityActions.startQueue(stu_id, com_id).then(
      res => {
        var mes = (
          <div>
            Successfully joined queue for
            <br />
            <b>{this.state.data.name}</b>
            <br />
            Your queue number is <b>{res.queue_num}</b>
          </div>
        );

        emitQueueStatus(com_id, stu_id, "startQueue");
        emitHallActivity(hallAction.ActivityType.QUEUE, null, com_id);

        layoutActions.successBlockLoader(mes);
        hallAction.storeLoadActivity([hallAction.ActivityType.QUEUE]);
      },
      err => {
        layoutActions.errorBlockLoader(err);
      }
    );
  }

  getVacancies(company_id) {
    return <VacancyList company_id={company_id} />;
  }

  getRecs(list, rec_privacy) {
    if (list == null || typeof list == "undefined") {
      return null;
    }

    if (list.length === 0) {
      return <div className="text-muted">Nothing To Show Here</div>;
    }
    // console.log(rec_privacy);
    // console.log(this.isRec);
    if (rec_privacy && !this.isRec) {
      return <div className="text-muted">This information is private</div>;
    }

    var view = list.map((d, i) => {
      var name = <div className="text-muted">Name Not Available</div>;
      if (d.first_name != "" && d.last_name != "") {
        name = (
          <span>
            {d.first_name}
            <small> {d.last_name}</small>
          </span>
        );
      }

      if (d.rec_position == null) {
        d.rec_position = (
          <div className="text-muted">Position Not Available</div>
        );
      }

      return (
        <ProfileListItem
          title={name}
          img_url={d.img_url}
          img_pos={d.img_pos}
          img_size={d.img_size}
          subtitle={d.rec_position}
          type="recruiter"
          key={i}
        />
      );
    });

    return (
      <div>
        {!rec_privacy ? null : (
          <div className="text-muted">
            This information is private to others.
            <br />
          </div>
        )}
        {view}
      </div>
    );
  }

  joinGroupSessionOld(data) {
    if (data.group_url == "" || data.group_url == null) {
      layoutActions.errorBlockLoader(
        "Group session has started. Please try again in a few minutes"
      );
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
      //var isIframe = item.type == DocLinkEnum.TYPE_DOC || item.url.containText("youtube");
      var isIframe = isGalleryIframe(item.type, item.url);

      if (isIframe) {
        iframe.push(item);
      } else {
        link.push(item);
      }
    }

    return (
      <div>
        <Gallery company_id={this.props.id} data={link} size="lg" />
        <br />
        <Gallery company_id={this.props.id} data={iframe} size="lg" />
      </div>
    );
  }

  getAskForum() {
    return null;
  }

  getBanner() {
    var data = this.state.data;

    const isInvalid = d => {
      if (typeof d === "undefined" || d == "" || d == null || d == "null") {
        return true;
      }

      return false;
    };

    data.banner_url = isInvalid(data.banner_url)
      ? ImgConfig.DefCompanyBanner
      : data.banner_url;
    var style = {
      backgroundImage: "url(" + data.banner_url + ")",
      backgroundSize: isInvalid(data.banner_size) ? "" : data.banner_size,
      backgroundPosition: isInvalid(data.banner_position)
        ? "center center"
        : data.banner_position
    };

    return <div className="fc-banner" style={style} />;
  }

  openResumeDrop() {
    var data = this.state.data;
    layoutActions.storeUpdateFocusCard(
      `Resume Drop - ${data.name}`,
      ResumeDropPopup,
      { company_id: data.ID }
    );
  }

  getStudentActionBox(data) {
    if (!isRoleStudent() || this.props.displayOnly) {
      return null;
    }

    const qs_successView = (
      <div>
        <h3 className="text-success">Successfully Submitted Your Question</h3>
        See your posted question in
        <br />
        <NavLink
          onClick={e => {
            layoutActions.storeHideBlockLoader();
            layoutActions.storeHideFocusCard();
          }}
          to={AppPath + `/forum/${this.forum_id}`}
        >
          company forum
        </NavLink>
        <br />
        <br />
        <button
          onClick={e => {
            layoutActions.storeHideBlockLoader();
          }}
          className="btn btn-sm btn-blue"
        >
          Got It!
        </button>
      </div>
    );

    const qs_onSubmit = data => {
      layoutActions.loadingBlockLoader("Submitting Your Question...");

      // todos insert to forum
      var ins = {
        user_id: getAuthUser().ID,
        content: data,
        is_owner: 0,
        forum_id: this.forum_id
      };

      let query = `mutation{ add_forum_comment (${obj2arg(ins, {
        noOuterBraces: true
      })}) { ID } }`;
      getAxiosGraphQLQuery(query).then(res => {
        this.setState(prevState => {
          return { qsLastSubmitted: Date.now() };
        });

        layoutActions.customViewBlockLoader(null, qs_successView);
      });
    };

    const btn_onClickResume = () => {
      this.setState(prevState => {
        return {
          isHiddenValidation: false,
          keyValidation: new Date().getTime()
        };
      });
    };

    return (
      <div className="row" style={{ marginTop: "15px" }}>
        <div className={`col-md-6`}>
          <ActionBox
            key={this.state.qsLastSubmitted}
            title="Ask Us A Question"
            isQuestion={true}
            qs_onSubmit={qs_onSubmit}
          />
        </div>
        <div className={`col-md-6`}>
          <ActionBox
            title="Drop Your Resume"
            isButton={true}
            btn_onClick={btn_onClickResume}
          />
        </div>
      </div>
    );
  }
  // getStudentAction(data) {
  //   // tukar action kepada button
  //   const onClickResume = () => {
  //     this.setState(prevState => {
  //       return {
  //         isHiddenValidation: false,
  //         keyValidation: new Date().getTime()
  //       };
  //     });
  //   };
  //   var action =
  //     !isRoleStudent() || this.props.displayOnly ? null : (
  //       <div>
  //         <button className="btn btn-blue btn-block" onClick={onClickResume}>
  //           <i className="fa fa-download left" />
  //           Drop Your Resume
  //         </button>
  //         <NavLink
  //           to={`${RootPath}/app/forum/company_${data.ID}`}
  //           onClick={() => {
  //             layoutActions.storeHideFocusCard();
  //           }}
  //           className="btn btn-primary btn-block"
  //         >
  //           <i className="fa fa-comments left" />
  //           Ask A Question
  //         </NavLink>
  //       </div>
  //     );

  //   return action;
  // }

  render() {
    var id = null;
    var data = this.state.data;
    var view = null;

    if (this.state.loading) {
      view = <Loader size="3" text="Loading Company Information..." />;
    } else {
      const vacancies = this.getVacancies(data.ID);
      const recs = this.getRecs(data.recruiters, data.rec_privacy);
      const doc_link = this.getDocLinks(data.doc_links);
      const askForum = this.getAskForum();

      // ##################################################################################
      // for group session

      var gSession =
        !isRoleStudent() || this.props.displayOnly ? null : (
          <div>
            <GroupSessionView
              forStudent={true}
              company_id={this.props.id}
              user_id={this.authUser.ID}
            />
          </div>
        );

      // ##################################################################################
      // for action

      //var action = this.getStudentAction(data);
      var actionBox = this.getStudentActionBox(data);

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
      var profilePic = (
        <ProfileCard
          type="company"
          img_dimension={"130px"}
          img_url={data.img_url}
          img_pos={data.img_position}
          img_size={data.img_size}
          title={<h3>{data.name}</h3>}
          subtitle={data.tagline}
          body={null}
        />
      );

      // var rightBody = (
      //   <div>
      //     {action}
      //     <hr />
      //     {gSession}
      //   </div>
      // );

      var forumLink = (
        <NavLink
          onClick={e => {
            layoutActions.storeHideBlockLoader();
            layoutActions.storeHideFocusCard();
          }}
          to={AppPath + `/forum/${this.forum_id}`}
        >
          <small>Go To Company Forum</small>
        </NavLink>
      );

      var rightBody = (
        <div>
          {gSession}
          <hr />
          {this.props.displayOnly ? null : forumLink}
        </div>
      );

      var maxHeight = 143;
      var leftBody = (
        <div>
          <div>
            {actionBox}
            {askForum == null ? null : (
              <PageSection
                canToggle={this.props.canToggle}
                className="left"
                title="Ask Us Anything"
                body={askForum}
              />
            )}
            {doc_link == null ? null : (
              <PageSection
                canToggle={this.props.canToggle}
                className="left"
                title="Gallery"
                body={doc_link}
              />
            )}
            {data.description == "" ? null : (
              <PageSection
                maxHeight={maxHeight}
                canToggle={this.props.canToggle}
                className="left"
                title="About"
                body={<p>{data.description}</p>}
              />
            )}
            <PageSection
              canToggle={this.props.canToggle}
              initShow={true}
              className="left"
              title="Job Details"
              body={vacancies}
            />
            {data.more_info == "" ? null : (
              <PageSection
                maxHeight={maxHeight}
                canToggle={this.props.canToggle}
                className="left"
                title="Additional Information"
                body={<p>{data.more_info}</p>}
              />
            )}
            {recs === null ? null : (
              <PageSection
                canToggle={this.props.canToggle}
                className="left"
                title="Recruiters"
                body={recs}
              />
            )}
          </div>
        </div>
      );

      view = this.props.displayOnly ? (
        <div>
          {profilePic}
          {rightBody}
          {leftBody}
        </div>
      ) : (
        <div>
          <ValidationStudentAction
            source={ValidationSource.DROP_RESUME}
            key={this.state.keyValidation}
            isHidden={this.state.isHiddenValidation}
            successHandler={() => this.openResumeDrop()}
          />
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3 com-pop-left">
                <div className="com-pop-pic">{profilePic}</div>
                {rightBody}
              </div>
              <div className="col-md-9">{leftBody}</div>
            </div>
            <div>
              <br />
              <a onClick={layoutActions.storeHideFocusCard}>Close</a>
            </div>
          </div>
          {this.getBanner()}
        </div>
      );
    }

    return view;
  }
}

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
