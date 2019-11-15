import React, { Component } from "react";
import PropTypes from "prop-types";
import obj2arg from "graphql-obj2arg";
import PageSection from "../component/page-section";
import { NavLink } from "react-router-dom";
import { getAxiosGraphQLQuery, graphql } from "../../helper/api-helper";
import ProfileCard from "../component/profile-card.jsx";
import { EmptyCard } from "../component/card.jsx";
import List, { SimpleListItem, ProfileListItem } from "../component/list";
import { Loader } from "../component/loader";
import {
  getAuthUser,
  isRoleRec,
  isRoleStudent,
  isRoleAdmin,
  doAfterValidateComingSoon
} from "../redux/actions/auth-actions";
import { DocLinkEnum, CompanyEnum, LogEnum } from "../../config/db-config";
//import { CustomList, createIconLink } from "../component/list";
import * as activityActions from "../redux/actions/activity-actions";
import * as layoutActions from "../redux/actions/layout-actions";
import * as hallAction from "../redux/actions/hall-actions";
import { emitQueueStatus, emitHallActivity } from "../socket/socket-client";
import { RootPath, ImgConfig, AppPath } from "../../config/app-config";

import { addLog } from "../redux/actions/other-actions";
import { getFeedbackPopupView } from "./partial/analytics/feedback";
//import { GroupSessionView } from "./partial/hall/group-session";
import { LiveSessionView, openLiveSession } from "./partial/hall/live-session";

import { Gallery, isGalleryIframe } from "../component/gallery";
import ValidationStudentAction, {
  ValidationSource
} from "../component/validation-student-action";
import { BANNER_HEIGHT, BANNER_WIDTH } from "../component/profile-card-img";
import {
  PCType,
  getStyleBannerObj,
  createImageElement
} from "../component/profile-card";
import ActionBox from "../component/action-box";
import { InterestedButton } from "../component/interested";

import VacancyPopup from "./partial/popup/vacancy-popup";
import ResumeDropPopup from "./partial/popup/resume-drop-popup";

import {
  setBodyFullWidth,
  unsetBodyFullWidth
} from "../../helper/general-helper";
import { ButtonAction } from "../component/buttons";
import { getDangerousHtml } from "../lib/util";

// #################################################################
// #################################################################
// require("../css/company-page.scss");

class VacancyList extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.renderList = this.renderList.bind(this);
    this.authUser = getAuthUser();
  }

  loadData(page, offset) {
    // description
    return getAxiosGraphQLQuery(`
        query{vacancies(
              user_id:${this.authUser.ID}, 
              company_id:${this.props.company_id}, 
              page:${page}, 
              offset:${offset}
              ){
                ID
                title
                type
                location 
                company{ img_url, img_position, img_size }
                interested{ID is_interested}
        }}`);
  }

  componentWillMount() {
    this.offset = 6;
  }

  isRecThisCompany() {
    return (
      (isRoleRec() && this.authUser.rec_company == this.props.company_id) ||
      isRoleAdmin()
    );
  }

  renderList(d, i) {
    let com = d.company;
    let img = createImageElement(
      com.img_url,
      com.img_position,
      d.img_size,
      "50px",
      "",
      PCType.COMPANY
    );

    let isModeCount = this.isRecThisCompany();
    let isModeAction = isRoleStudent();

    let interestedBtn = (
      <InterestedButton
        isModeCount={isModeCount}
        isModeAction={isModeAction}
        ID={d.interested.ID}
        is_interested={d.interested.is_interested}
        entity={"vacancies"}
        entity_id={d.ID}
      ></InterestedButton>
    );

    let body = (
      <div className="vacancy-card">
        {interestedBtn}
        <div className="img">{img}</div>
        <div className="title">{d.title}</div>
        <div className="location">{d.location}</div>
        <div className="type">{d.type ? d.type + " Job" : null}</div>
      </div>
    );

    return (
      <EmptyCard
        borderRadius={"7px"}
        minHeight={"180px"}
        width={"250px"}
        body={body}
        onClick={null}
      ></EmptyCard>
    );
  }

  getDataFromRes(res) {
    return res.data.data.vacancies;
  }

  render() {
    return (
      <List
        isHidePagingTop={true}
        type="list"
        listClass="flex-wrap-start"
        pageClass="text-right"
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

export default class CompanyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //bannerKey: this.getBodyWidth(),
      qsLastSubmitted: Date.now(),
      data: null,
      loading: true,
      isHiddenValidation: true,
      keyValidation: 0
    };

    this.ID = null;
    if (this.props.match) {
      this.ID = this.props.match.params.id;
    } else {
      this.ID = this.props.id;
    }

    this.forum_id = "company_" + this.ID;
    this.authUser = getAuthUser();
    this.isRec = getAuthUser().rec_company == this.ID || isRoleAdmin();
    this.FEEDBACK_LIMIT_SR = 3;

    this.getRecs = this.getRecs.bind(this);
    this.startQueue = this.startQueue.bind(this);
    this.addSessionRequest = this.addSessionRequest.bind(this);
    this.getBtnLike = this.getBtnLike.bind(this);
  }

  isRecThisCompany() {
    return (
      (isRoleRec() && this.authUser.rec_company == this.ID) || isRoleAdmin()
    );
  }
  getBodyWidth() {
    return document.body.clientWidth;
  }

  componentWillUnmount() {
    unsetBodyFullWidth();
  }

  componentWillMount() {
    setBodyFullWidth();

    var logData = {
      id: Number.parseInt(this.ID),
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
              company(ID:${this.ID}, user_id:${this.authUser.ID}) {
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
                interested{ID is_interested}
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
    var com_id = this.ID;

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
          //layoutActions.storeUpdate("Feedback", getFeedbackPopupView());
          layoutActions.errorBlockLoader(getFeedbackPopupView(false));
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
    var com_id = this.ID;

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
        <Gallery company_id={this.ID} data={link} size="lg" />
        <br />
        <Gallery company_id={this.ID} data={iframe} size="lg" />
      </div>
    );
  }

  getAskForum() {
    return null;
  }

  getBanner() {
    // window.addEventListener("resize", event => {
    //   this.setState(prevState => {
    //     let newWidth = this.getBodyWidth();
    //     if (prevState.bannerKey - newWidth >= 100) {
    //       return { bannerKey: newWidth };
    //     }
    //   });
    // });

    var data = this.state.data;

    let width = this.getBodyWidth();
    let height = (width / BANNER_WIDTH) * BANNER_HEIGHT;

    width += "px";
    height += "px";

    var style = getStyleBannerObj(
      data.banner_url,
      data.banner_size,
      data.banner_position,
      width,
      height
    );

    //return <div key={this.state.bannerKey} className="banner" style={style} />;
    return <div className="banner" style={style} />;
  }

  openResumeDrop() {
    var data = this.state.data;
    layoutActions.storeUpdateFocusCard(
      `Resume Drop - ${data.name}`,
      ResumeDropPopup,
      { company_id: data.ID }
    );
  }

  getBtnLike(styleBtnAction) {
    let data = this.state.data;

    const getBtnLikeCustomView = ({
      loading,
      isModeCount,
      isModeAction,
      is_interested,
      like_count,
      onClickModeCount,
      onClickModeAction
    }) => {
      if (isModeAction) {
        return (
          <ButtonAction
            style={styleBtnAction}
            btnClass={`btn-lg btn-${is_interested ? "blue" : "default"}`}
            onClick={onClickModeAction}
            icon={loading ? "spinner fa-pulse" : "thumbs-up"}
            iconSize="2x"
            mainText={
              loading ? null : is_interested ? `Liked` : `Like This Company`
            }
            // subText={`with ${this.state.data.name}`}
            subText={null}
          />
        );
      } else if (isModeCount) {
        let mainText = `Liked By ${like_count} Student${
          like_count > 1 ? "s" : ""
        }`;
        return (
          <ButtonAction
            style={styleBtnAction}
            btnClass={`btn-lg btn-blue`}
            onClick={onClickModeCount}
            icon={loading ? "spinner fa-pulse" : "thumbs-up"}
            iconSize="2x"
            mainText={mainText}
            // subText={`with ${this.state.data.name}`}
            subText={null}
          />
        );
      }
    };

    let isModeCount =
      (isRoleRec() && this.authUser.rec_company == this.ID) || isRoleAdmin();

    let isModeAction = isRoleStudent();

    return (
      <InterestedButton
        customView={getBtnLikeCustomView}
        isModeCount={isModeCount}
        isModeAction={isModeAction}
        ID={data.interested.ID}
        is_interested={data.interested.is_interested}
        entity={"companies"}
        entity_id={this.ID}
      ></InterestedButton>
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

    const btn_onClickChat = () => {
      const doAction = () => {
        this.props.history.push(`${AppPath}/company-chat/${this.ID}`);
      };
      doAfterValidateComingSoon(doAction);
    };

    const styleBtnAction = {
      width: "100%",
      margin: "0px",
      marginBottom: "10px",
      fontSize: "15px"
    };

    // let colSize = "3"
    let colSize = "4"
    return (
      <div className="row" style={{ marginTop: "15px" }}>
        <div className={`col-md-${colSize}`}>{this.getBtnLike(styleBtnAction)}</div>
        {/* <div className={`col-md-${colSize}`}>
          <ButtonAction
            style={styleBtnAction}
            btnClass="btn-lg btn-danger"
            onClick={() => {
              openLiveSession(this.ID);
            }}
            icon="podcast"
            iconSize="2x"
            mainText={"Join Live Session"}
            // subText={`with ${this.state.data.name}`}
            subText={null}
          />
        </div> */}
        <div className={`col-md-${colSize}`}>
          <ButtonAction
            style={styleBtnAction}
            btnClass="btn-lg btn-danger"
            onClick={btn_onClickChat}
            icon="comments"
            iconSize="2x"
            mainText={`Chat With Us`}
            /// ${this.state.data.name}
            subText={null}
          />
        </div>
        <div className={`col-md-${colSize}`}>
          <ButtonAction
            style={styleBtnAction}
            btnClass="btn-lg btn-success"
            onClick={btn_onClickResume}
            icon="download"
            iconSize="2x"
            mainText={"Drop Your Resume"}
            subText={null}
          />
        </div>
      </div>

      /* <ActionBox
            title={
              <div>
                <i className="fa fa-download left" />
                <b>Drop Your Resume</b>
              </div>
            }
            isButton={true}
            btn_onClick={btn_onClickResume}
          /> */
      /* <ActionBox
          {...this.props}
          title={
            <div>
              <i className="fa fa-comments left" />
              <b>Chat With Recruiter</b>
            </div>
          }
          isDoAfterComingSoon={true}
          isNavLink={true}
        /> */
      /* <div className={`col-md-4`}>
        <ActionBox
          key={this.state.qsLastSubmitted}
          title={
            <div>
              <i className="fa fa-bullhorn left" />
              <b>Ask Us A Question</b>
            </div>
          }
          isQuestion={true}
          qs_onSubmit={qs_onSubmit}
        />
      </div> */
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
      document.setTitle(`${data.name}`);

      const vacancies = this.getVacancies(data.ID);
      const recs = this.getRecs(data.recruiters, data.rec_privacy);
      const doc_link = this.getDocLinks(data.doc_links);
      const askForum = this.getAskForum();

      // ##################################################################################
      // for group session

      var gSession =
        !isRoleStudent() || this.props.displayOnly ? null : (
          <div>
            {/* <ButtonAction
              style={{ width: "100%", margin: "0px", marginBottom: "10px" }}
              btnClass="btn-lg btn-blue"
              onClick={() => { openLiveSession(this.ID); }}
              icon="podcast"
              iconSize="2x"
              mainText={"Join Live Session"}
              subText={`with ${this.state.data.name}`}
            /> */}
            <LiveSessionView
              forStudent={true}
              company_id={this.ID}
              user_id={this.authUser.ID}
            />
          </div>
        );

      // ##################################################################################
      // for action

      //var action = this.getStudentAction(data);
      var actionBox = this.getStudentActionBox(data);

      var profilePic = (
        <ProfileCard
          type="company"
          img_dimension={"200px"}
          className={"with-border"}
          img_url={data.img_url}
          img_pos={data.img_position}
          img_size={data.img_size}
          title={<h3>{data.name}</h3>}
          subtitle={data.tagline}
          body={null}
        />
      );

      // var forumLink = (
      //   <NavLink
      //     onClick={e => {
      //       layoutActions.storeHideBlockLoader();
      //       layoutActions.storeHideFocusCard();
      //     }}
      //     to={AppPath + `/forum/${this.forum_id}`}
      //   >
      //     <small>Go To Company Forum</small>
      //   </NavLink>
      // );

      var rightBody = (
        <div>
          {!this.isRecThisCompany() || this.props.displayOnly
            ? null
            : this.getBtnLike({fontSize:"15px", width:"100%"})}
          {/* {this.props.displayOnly ? null : forumLink} */}
          {gSession}
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
                //body={<p>{data.description}</p>}
                body={
                  <p
                    dangerouslySetInnerHTML={getDangerousHtml(data.description)}
                  ></p>
                }
              />
            )}
            <PageSection
              canToggle={this.props.canToggle}
              initShow={true}
              className="left"
              title="Job Opportunity"
              body={vacancies}
            />
            {data.more_info == "" ? null : (
              <PageSection
                maxHeight={maxHeight}
                canToggle={this.props.canToggle}
                className="left"
                title="Additional Information"
                //body={<p>{data.more_info}</p>}
                body={
                  <p
                    dangerouslySetInnerHTML={getDangerousHtml(data.more_info)}
                  ></p>
                }
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
        <div className="company-page">
          {this.getBanner()}
          <ValidationStudentAction
            source={ValidationSource.DROP_RESUME}
            key={this.state.keyValidation}
            isHidden={this.state.isHiddenValidation}
            successHandler={() => this.openResumeDrop()}
          />
          <div className="main-width main-width-lg container-fluid">
            <div className="row">
              <div
                style={{ padding: "20px" }}
                className="col-md-3 com-pop-left"
              >
                <div className="com-pop-pic">{profilePic}</div>
                {rightBody}
              </div>
              <div style={{ padding: "20px" }} className="col-md-9">
                {leftBody}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return view;
  }
}

CompanyPage.propTypes = {
  id: PropTypes.number.isRequired,
  displayOnly: PropTypes.bool, // set true in session
  canToggle: PropTypes.bool, // set true in session
  isPreEvent: PropTypes.bool
};

CompanyPage.defaultProps = {
  displayOnly: false,
  isPreEvent: false
};
