import React, { Component } from "react";
import PropTypes from "prop-types";
import obj2arg from "graphql-obj2arg";
import PageSection from "../component/page-section";
import { NavLink } from "react-router-dom";
import { getAxiosGraphQLQuery, graphql } from "../../helper/api-helper";
import ProfileCard from "../component/profile-card.jsx";
import { ProfileListItem, CustomList } from "../component/list";
import { Loader } from "../component/loader";
import { getYoutubeIframe } from "../component/gallery";
import {
  getAuthUser,
  isRoleRec,
  isRoleStudent,
  isRoleAdmin,
  doAfterValidateComingSoon,
  isRecruiterCompany,
  isCfFeatureOff,
} from "../redux/actions/auth-actions";
import { LogEnum, DocLinkEnum, CFSMeta } from "../../config/db-config";
import * as activityActions from "../redux/actions/activity-actions";
import * as layoutActions from "../redux/actions/layout-actions";
import * as hallAction from "../redux/actions/hall-actions";
import { emitQueueStatus, emitHallActivity } from "../socket/socket-client";
import { AppPath } from "../../config/app-config";

import { addLog } from "../redux/actions/other-actions";
import { getFeedbackPopupView } from "./partial/analytics/feedback";

import { Gallery, isGalleryIframe } from "../component/gallery";
import ValidationStudentAction, {
  ValidationSource
} from "../component/validation-student-action";
import { BANNER_HEIGHT, BANNER_WIDTH } from "../component/profile-card-img";
import {
  getStyleBannerObj,
} from "../component/profile-card";
import { InterestedButton } from "../component/interested";

import ResumeDropPopup from "./partial/popup/resume-drop-popup";

import {
  setBodyFullWidth,
  unsetBodyFullWidth
} from "../../helper/general-helper";
import { ButtonAction } from "../component/buttons";
import { getDangerousHtml } from "../lib/util";
import { VacancyList } from "./partial/company/vacancy";
import HallRecruiterEvent from "./partial/hall-recruiter/hall-recruiter-event";
import { EventList } from "./event-list";
import HallRecruiterJobPosts from "./partial/hall-recruiter/hall-recruiter-job-posts";

export default class CompanyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //bannerKey: this.getBodyWidth(),
      qsLastSubmitted: Date.now(),
      data: null,
      loading: true,
      isHiddenValidation: true,
      keyValidation: 0,
      galleryTranslate: 0,
      galleryCurrentIndex: 1,
    };

    this.SECTION_MAX_HEIGHT = 143;
    this.SECTION_MARGIN_BOTTOM = "60px";
    this.SECTION_TITLE_MARGIN_BOTTOM = "20px";
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
    this.getSubscribeBtn = this.getSubscribeBtn.bind(this);
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
    // unsetBodyFullWidth();
  }

  componentWillMount() {
    // setBodyFullWidth();

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
                tags{label}
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
    var data = this.state.data;
    var style = getStyleBannerObj(
      data.banner_url,
      data.banner_size,
      data.banner_position,
      null,
      null
    );
    style.backgroundPosition = "center center";
    style.backgroundSize = "cover";
    style.height = "100%"
    //return <div key={this.state.bannerKey} className="banner" style={style} />;
    return <div className="banner" style={style}>
      {this.getEditButton()}
    </div>;
  }

  getEditButton() {
    if (this.isRecThisCompany()) {
      return <div className="flex-center" style={{ height: "100%", padding: "15px" }}>
        <div id="company-edit-btn" className="text-right" style={{ width: "100%" }}>
          <NavLink to={`${AppPath}/manage-company/${this.ID}/about`}
            className="btn btn-gray btn-bold btn-round-10 btn-lg">
            <i className="fa fa-edit left"></i>Edit Company Profile
            </NavLink>
        </div>
      </div>
    }

    return null;
  }

  openResumeDrop() {
    var data = this.state.data;
    layoutActions.storeUpdateFocusCard(
      `Resume Drop - ${data.name}`,
      ResumeDropPopup,
      { company_id: data.ID }
    );
  }

  getSubscribeBtn() {
    let data = this.state.data;

    const getSubscribeBtnCustomView = ({
      loading,
      isModeCount,
      isModeAction,
      is_interested,
      like_count,
      onClickModeCount,
      onClickModeAction
    }) => {
      if (isModeAction) {
        let btnColor = is_interested ? "blue" : "grey";
        let btnText = is_interested ? `Subscribed` : `Subscribe`
        let btnIcon = loading ? "spinner fa-pulse" : "thumbs-up"
        return (
          <button className={`btn btn-sm btn-block btn-round-10 btn-${btnColor} btn-bold`}
            onClick={onClickModeAction}>
            <i className={`fa fa-${btnIcon} left`}></i>
            {btnText}
          </button>
        );
      } else if (isModeCount) {
        let mainText = `Liked By ${like_count} Student${
          like_count > 1 ? "s" : ""
          }`;
        return (
          <ButtonAction
            btnClass={`btn-lg btn-blue`}
            onClick={onClickModeCount}
            icon={loading ? "spinner fa-pulse" : "thumbs-up"}
            iconSize="2x"
            mainText={mainText}
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
        customView={getSubscribeBtnCustomView}
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

    return <div className="container-fluid">
      <div className="row" >
        {/* top full */}
        {/* if (isCfFeatureOff(CFSMeta.FEATURE_COMPANY_BOOTH)) {
      return null;
    } */}

        {isCfFeatureOff(CFSMeta.FEATURE_DROP_RESUME) ? null :
          <div className="col-sm-12  no-padding"
            style={{ padding: "5px" }}>
            <button className="btn btn-sm btn-block btn-round-10 btn-green btn-bold"
              onClick={btn_onClickResume}>
              <i className="fa fa-download left"></i>Drop Your Resume
            </button>
          </div>
        }

        {/* bottom left */}
        <div className="col-lg-6 no-padding"
          style={{ padding: "5px" }}>
          {this.getSubscribeBtn()}
        </div>

        {/* bottom right */}
        <div className="col-lg-6 no-padding"
          style={{ padding: "5px" }}>
          <button className="btn btn-sm btn-block btn-round-10 btn-red btn-bold"
            onClick={btn_onClickChat}>
            <i className="fa fa-comments left"></i>Chat With Us
        </button>
        </div>
      </div>
    </div>

  }

  _title_(icon, text) {
    return <h3 className="text-bold"
      style={{ marginBottom: this.SECTION_TITLE_MARGIN_BOTTOM }}>
      <i className={`fa fa-${icon} left`}></i>
      {text}
    </h3>;
  }

  getAboutUs(data) {
    if (!data.description && !data.more_info) {
      return null;
    } else {
      return <div>
        {
          !data.description ? null : (
            <PageSection
              maxHeight={this.SECTION_MAX_HEIGHT}
              canToggle={this.props.canToggle}
              className="left"
              customTitle={this._title_("user", "About Us")}
              body={
                <p
                  dangerouslySetInnerHTML={getDangerousHtml(data.description)}
                ></p>
              }
            />
          )
        }
        {
          !data.more_info ? null : (
            <div className="cp-additional-info">
              <b>Additional Information</b><br></br>
              <p dangerouslySetInnerHTML={getDangerousHtml(data.more_info)}></p>
            </div>
          )
        }
      </div>
    }
  }

  getEvent(data) {
    return <div>
      {this._title_("calendar", "Events & Webinar")}
      {isRecruiterCompany(this.ID)
        ? <HallRecruiterEvent offset={3} isNoTitle={true} isNoMarginBottom={true} company_id={this.ID}></HallRecruiterEvent>
        : <EventList company_id={this.ID} isHidePagingTop={true} customOffset={4} listAlign="center" isFullWidth={true} />
      }
    </div>
  }

  getJobPost(data) {
    return <div>
      {this._title_("suitcase", "Job Post Opportunity")}
      {isRecruiterCompany(this.ID)
        ? <HallRecruiterJobPosts offset={4} isNoTitle={true} isNoMarginBottom={true} company_id={this.ID}></HallRecruiterJobPosts>
        : <VacancyList listClass="flex-wrap-center text-left" offset={4} isHidePagingTop={true} isFullWidth={true} filterByCf={true} isListAll={true} company_id={this.ID} />
        // : <EventList company_id={this.ID} customOffset={4} listAlign="center" isFullWidth={true} />
      }
    </div>
  }
  isUrlYoutube(url) {
    return (url.containText("youtube") && url.containText("?v=")) || url.containText("youtu.be");
  }
  isGallery(d) {
    return d.type == DocLinkEnum.TYPE_DOC || this.isUrlYoutube(d.url);
  }

  slideGallery(direction, width, count) {
    // const maxRight = (width * count * -1) + (width / 2);
    // const totalWidth = document.getElementsByClassName("cp-gallery-container")[0].clientWidth;


    this.setState((prevState) => {

      let trans = prevState.galleryTranslate;
      let currentIndex = prevState.galleryCurrentIndex;
      let offsetMove = width;


      // console.log("maxRight", maxRight);
      // console.log("totalWidth", totalWidth);
      // console.log("currentIndex", currentIndex);

      if (direction == "left" && currentIndex > 1) {
        trans += offsetMove;
        currentIndex -= 1;

      } else if (direction == "right" && currentIndex < count) {
        trans -= offsetMove;
        currentIndex += 1;
      }

      return { galleryTranslate: trans, galleryCurrentIndex: currentIndex };
    })
  }

  getGallery(data) {
    let doc_links = data.doc_links;
    let count = 0;
    let width = 310;

    let list = doc_links.map((d, i) => {
      if (this.isGallery(d)) {
        count++;
        let item = null;
        if (d.type == DocLinkEnum.TYPE_DOC) {
          item = <iframe src={d.url} frameBorder="0" />;
        } else if (this.isUrlYoutube(d.url)) {
          item = getYoutubeIframe(d.url);
        }

        let title = <a className="btn-link" href={d.url} target="_blank">{d.label}</a>

        return <div className="cp-gallery-item">
          {item}
          <div className="cp-gallery-title">
            {title}
          </div>
        </div>
      }
      return null;
    });

    if (count <= 0) {
      return null;
    }

    const arrow = (direction) => {
      let color = null;
      if ((direction == "left" && this.state.galleryCurrentIndex == 1)
        || (direction == "right" && this.state.galleryCurrentIndex == count)) {
        color = "grey";
      }

      return <div className="cp-gallery-arrow" >
        <a onClick={() => { this.slideGallery(direction, width, count) }}>
          <i style={{ color: color }} className={`fa fa-2x fa-chevron-circle-${direction}`}></i>
        </a>
      </div>
    }

    let sliderGallery = (
      <div className="cp-gallery">
        {count > 1 ? arrow("left") : null}
        <div className="cp-gallery-container">
          <div className="cp-gallery-container-inner"
            style={{ transform: this.state.galleryTranslate ? `translateX(${this.state.galleryTranslate}px)` : null }}>
            {list}
          </div>
        </div>
        {count > 1 ? arrow("right") : null}
      </div>
    );
    return <div>
      {this._title_("image", "Gallery")}
      <div className="show-on-lg-and-more">
        {sliderGallery}
      </div>
      <div className="show-on-md-and-less text-center">
        {list}
      </div>
    </div>


  }
  isQuickLink(d) {
    return !this.isGallery(d);
  }
  getTag(data) {
    let tags = data.tags;
    let count = 0;
    let list = tags.map((d, i) => {
      count++;
      return <div className="cp-quick-link-item">
        {d.label}
      </div>
    });

    if (count <= 0) {
      return null;
    }

    return (
      <div className="cp-quick-link">
        <b><i className="fa fa-slack left"></i>Tag</b><br></br>
        {list}
      </div>
    );
  }
  getQuickLink(data) {
    let doc_links = data.doc_links;
    let count = 0;

    let list = doc_links.map((d, i) => {
      if (this.isQuickLink(d)) {
        count++;
        return <a target='_blank' href={`${d.url}`}>
          <div className="cp-quick-link-item">
            {d.label}
          </div>
        </a>
      }
      return null;
    });

    if (count <= 0) {
      return null;
    }

    return (
      <div className="cp-quick-link">
        <b><i className="fa fa-link left"></i>Quick Link</b><br></br>
        {list}
      </div>
    );
  }

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

      // ##################################################################################
      // for action

      //var action = this.getStudentAction(data);
      var actionBox = this.getStudentActionBox(data);

      var profilePic = (
        <ProfileCard
          type="company"
          img_dimension={"150px"}
          className={"with-border"}
          img_url={data.img_url}
          img_pos={data.img_position}
          img_size={data.img_size}
          // title={<h3>{data.name}</h3>}
          // subtitle={data.tagline}
          body={<div>
            <h3><b>{data.name}</b></h3>
            <p className="text-muted text-center">{data.tagline}</p>
          </div>}
        />
      );

      var rightBody = (
        <div>
          {!this.isRecThisCompany()
            ? null
            : this.getSubscribeBtn({ fontSize: "15px", width: "100%" })}
        </div>
      );

      var maxHeight = this.SECTION_MAX_HEIGHT;
      var leftBody = (
        <div>
          <div>
            {actionBox}
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

      view =
        <div className="company-page">
          <ValidationStudentAction
            source={ValidationSource.DROP_RESUME}
            key={this.state.keyValidation}
            isHidden={this.state.isHiddenValidation}
            successHandler={() => this.openResumeDrop()}
          />


          {/* HEADER - banner n logo */}
          <div className="container-fluid cp-header" >
            <div className="row">
              <div className="cp-header-banner-small col-md-9 no-padding show-on-md-and-less">
                {this.getBanner()}
              </div>
              <div className="cp-header-avatar col-md-3 no-padding">
                {profilePic}
                {this.getStudentActionBox(data)}
              </div>
              <div className="cp-header-banner-large col-md-9 no-padding show-on-lg-and-more">
                {this.getBanner()}
              </div>
            </div>
          </div>

          {/* BODY - details */}
          <div className="container-fluid cp-body" >
            <div className="row">
              <div className="col-md-8 no-padding-small" style={{ marginBottom: this.SECTION_MARGIN_BOTTOM }}>
                {this.getAboutUs(data)}
              </div>
              <div className="col-md-4 no-padding-small" style={{ marginBottom: this.SECTION_MARGIN_BOTTOM }}>
                {this.getTag(data)}
                <div style={{ height: "25px" }}></div>
                {this.getQuickLink(data)}
              </div>
              <div className="col-md-8 no-padding-small" style={{ marginBottom: this.SECTION_MARGIN_BOTTOM }}>
                {this.getEvent(data)}
              </div>
              <div className="col-md-8 no-padding-small" style={{ marginBottom: this.SECTION_MARGIN_BOTTOM }}>
                {this.getJobPost(data)}
              </div>
              <div className="col-md-8 no-padding-small" style={{ marginBottom: this.SECTION_MARGIN_BOTTOM }}>
                {this.getGallery(data)}
              </div>
            </div>
          </div>

          {/* {this.getBanner()} */}
          {/* <div className="main-width main-width-lg container-fluid">
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
            </div> */}
        </div>
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
