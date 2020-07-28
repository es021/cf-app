import React from "react";
import PropTypes from "prop-types";
import { CustomList, createIconLink } from "../component/list";
import { ButtonArrowAction, ButtonAction } from "../component/buttons.jsx";
import { NavLink } from "react-router-dom";
import { getGroupSessionQueryFilter } from "./partial/hall/live-session";
import PageSection from "../component/page-section";
import { GroupSessionView } from "./partial/hall/group-session";
import CompaniesSection from "./partial/hall/companies";
import ForumPage from "./forum";
import {
  openLiveSession, createNewLiveSessionPopup,
  __IS_GROUP_SESSION_NOW, __IS_GROUP_SESSION_ENDED, __IS_GROUP_SESSION_UPCOMING
} from "./partial/hall/live-session"

import SponsorList from "./partial/static/sponsor-list";
import { WebinarHall } from "../page/auditorium.jsx";
import ActivitySection from "./partial/hall/activity";
import { RootPath, ImageUrl, AppPath } from "../../config/app-config";
import { CFSMeta } from "../../config/db-config";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { Time } from "../lib/time";

import {
  isRoleRec,
  isRoleStudent,
  isRoleAdmin,
  getCFObj,
  getAuthUser,
  isComingSoon,
  isRoleOrganizer,
  isCfFeatureOff,
  getCfCustomMeta
} from "../redux/actions/auth-actions";
import { HallGalleryView } from "./partial/hall/hall-gallery";
import { setBodyFullWidth, unsetBodyFullWidth } from "../../helper/general-helper";
import Timer from "../component/timer";
import { getCFTimeDetail } from "./coming-soon";
import ListRow from "../component/list-row";
import { VacancyList } from "./partial/company/vacancy";
import { EventList } from "./event-list";
import lang from "../lib/lang";

// require("../css/hall.scss");

export default class HallPage extends React.Component {
  constructor(props) {
    super(props);
    // this.getHighlight = this.getHighlight.bind(this);
    this.CFDetail = getCFObj();
    this.title = this.CFDetail.title;
    // this.title = <div dangerouslySetInnerHTML={{__html : this.title}}></div>


    this.authUser = getAuthUser();

    this.state = {
      next_live_session_time: null,
    }
  }

  isRecCurrentEvent() {
    // rec akan nampak apa yang student nampak
    return this.props.location.pathname.indexOf("rec-current-event") >= 0;
  }
  componentWillMount() {
    // this.body = document.getElementsByTagName("body")[0];
    // this.body.className += " body-full-width ";
    setBodyFullWidth();
  }


  componentDidMount() {
    if (isRoleRec()) {
      let company_id = getAuthUser().rec_company;
      let q = `query { group_sessions(${getGroupSessionQueryFilter(company_id)} ) 
        {ID start_time} } `;

      getAxiosGraphQLQuery(q).then(res => {
        this.setState((prevState) => {
          let gs = res.data.data.group_sessions;
          let smallest = null;
          for (var i in gs) {
            let start_time = gs[i].start_time;
            if (__IS_GROUP_SESSION_NOW(start_time) || __IS_GROUP_SESSION_UPCOMING(start_time)) {
              if (smallest == null || start_time < smallest) {
                smallest = start_time;
              }
            }
          }

          return { next_live_session_time: smallest };
        });
      });
    }
  }

  componentWillUnmount() {
    unsetBodyFullWidth();
  }

  // getHighlight() {
  //   var v = null;

  //   if (isRoleRec()) {
  //     var vData = [
  //       {
  //         label: "Student Listing & Resume Drop",
  //         url: `${RootPath}/app/my-activity/student-listing`,
  //         icon: "users"
  //       }
  //     ];

  //     var views = vData.map((d, i) => {
  //       return (
  //         <span>
  //           <i className={`fa left fa-${d.icon}`} />
  //           <NavLink to={`${d.url}`}>{`${d.label}`}</NavLink>
  //         </span>
  //       );
  //     });

  //     v = <CustomList className="label" alignCenter={true} items={views} />;
  //   }
  //   return v;
  // }

  // getSponsor(backgroundColor) {

  //   ///marginTop: "25px", marginBottom: "25px"
  //   return (
  //     <div style={{ backgroundColor: backgroundColor, }} className="sponsor-section">
  //       <SponsorList
  //         //ignore_types={[CompanyEnum.TYPE_BRONZE]}
  //         title={false}
  //         part_com={false}
  //         type="hall-page"
  //         sponsor_size="85px"
  //       />
  //     </div>
  //   );
  // }
  // getInterview(backgroundColor) {
  //   return <div className="col-md-12 no-padding">
  //     <ListRow title="My Interviews"
  //       backgroundColor={backgroundColor}
  //       items={<ActivitySection limitLoad={5} />}
  //       see_more_text="See More Interviews"
  //       see_more_onclick={() => {
  //         // console.log(`${AppPath}/list-interviews`)
  //         window.location = `${AppPath}/list-interviews`;
  //       }}
  //     ></ListRow>
  //   </div >
  // }
  // getActivityAndWebinar() {
  //   return (
  //     <div className="activity-section main-width main-width-lg">
  //       <div className={`col-md-6 no-padding my-activity`}>
  //         <ActivitySection />
  //       </div>
  //       <div className={`col-md-6 no-padding`}>
  //         <WebinarHall />
  //       </div>
  //     </div>
  //   );
  // }
  // getEventAndWebinar() {
  //   return <div style={{ marginTop: "25px" }} className="col-md-12 no-padding">
  //     <ListRow title="Events & Webinars"
  //       backgroundColor={null}
  //       items={<WebinarHall noBorderCard={true} limitLoad={4} />}
  //       see_more_text="See More Events & Webinars"
  //       see_more_to={`${AppPath}/list-events-webinars`}
  //     ></ListRow>
  //   </div >
  // }

  // getRecruiterAction() {
  //   /**
  //    * 2 When Are you live?
  //     - kalau ada : Next Live at xxxxx
  //     - kalau takde : Click here to set your live session
  //     // this.state.next_live_session_time
  //   */
  //   let nextSessionStr = "Click here to set your live session";
  //   if (this.state.next_live_session_time != null &&
  //     this.state.next_live_session_time > 0) {
  //     nextSessionStr = `Next Live @ ${Time.getString(this.state.next_live_session_time)}`
  //   }

  //   return <div className="title-sectaion">
  //     <div className="main-width">
  //       <ButtonAction
  //         style={{ width: "350px" }}
  //         btnClass="btn-lg btn-success"
  //         // to={`${RootPath}/app/my-activity/student-listing`}
  //         to={`${RootPath}/app/browse-student`}
  //         icon="users"
  //         iconSize="3x"
  //         mainText={"All Students"}
  //         // subText={`See who's interested in ${this.authUser.company.name}`}
  //         subText={`Browse all students`}
  //       />

  //       <ButtonAction
  //         style={{ width: "350px" }}
  //         btnClass="btn-lg btn-blue"
  //         // to={`${RootPath}/app/my-activity/student-listing`}
  //         to={`${RootPath}/app/browse-student?interested_only=1`}
  //         icon="user"
  //         iconSize="3x"
  //         mainText={"Interested Students"}
  //         // subText={`See who's interested in ${this.authUser.company.name}`}
  //         subText={`Browse students interested in you`}
  //       />

  //       {/* <ButtonAction
  //         style={{ width: "350px" }}
  //         btnClass="btn-lg btn-danger"
  //         onClick={() => { openLiveSession(this.authUser.rec_company); }}
  //         icon="podcast"
  //         iconSize="3x"
  //         mainText={"Go Live"}
  //         subButtonText={nextSessionStr}
  //         subButtonOnClick={() => {
  //           console.log("check when");
  //           createNewLiveSessionPopup(this.authUser.rec_company, () => {
  //             console.log("yey")
  //           })
  //         }}
  //       /> */}


  //     </div >
  //   </div >
  // }

  // getTimerComingSoon() {
  //   if (isComingSoon()) {
  //     var doneMes = null;
  //     return <Timer end={this.CFDetail.start} doneMes={doneMes}></Timer>
  //   }

  //   return null
  // }
  getGallery(backgroundColor) {
    return (
      <div className="gallery-section" style={{ backgroundColor: backgroundColor }}>
        <HallGalleryView />
      </div>
    );
  }
  getTitle() {
    return (
      <div className="title-section">
        <div className="container-fluid">
          <div className="row flex-wrap-center-center" style={{ maxWidth: "1400px", margin: "auto" }}>
            <div className="title-section-left col-md-7 flex-wrap-center-center center-on-md-and-less" style={{ justifyContent: "flex-start" }}>
              <div>
                {/* title */}
                Welcome To {this.title}<br></br>
                {/* welcome text */}
                {!this.CFDetail.welcome_text ? null :
                  <small className="text-muted"><span dangerouslySetInnerHTML={{ __html: this.CFDetail.welcome_text }}></span></small>}
              </div>
              {/* {logo} */}
              {/* <div style={{ width: "100%" }}>
                {this.getTimerComingSoon()}
              </div> */}
            </div>
            <div className="title-section-right col-md-5 no-padding" style={{ marginTop: "-10px" }}>
              <b style={{ fontSize: "60%" }} className="text-muted"><i>Next / Upcoming Event</i></b>
              <EventList isListNoMargin={true} limitLoad={1} isFullWidth={true} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  getWelcomeAndSponsor(backgroundColor) {
    return <div style={{ backgroundColor: backgroundColor }} className="welcome-and-sponsor-section">
      <div className="main-width">
        <div className="text-left" style={{ marginBottom: "30px" }}>
          <h2>
            <b>{lang("Welcome")} {getAuthUser().first_name} !</b>
            <br></br>
            {!this.CFDetail.welcome_text ? null :
              <small className="text-muted"><span dangerouslySetInnerHTML={{ __html: this.CFDetail.welcome_text }}></span></small>}
          </h2>
        </div>
        <div className="text-center" style={{ marginBottom: "20px" }}>
          <h3><small>{lang("Current / Upcoming Event")} : </small></h3>
          {/* <EventList isListNoMargin={true} limitLoad={2} listAlign="left" /> */}
          <EventList isListNoMargin={true} limitLoad={2} listAlign="center" />
          <div className="text-right">
            <b>
              <NavLink to={`${AppPath}/list-events`}>
                {lang("See More Events")}{" "}<i className="fa fa-long-arrow-right"></i>
              </NavLink>
            </b>
          </div>
        </div>
        <SponsorList
          title={false}
          part_com={false}
          type="hall-page"
          sponsor_size="85px"
        />
      </div>
    </div>
  }
  getJobPost(backgroundColor) {
    return <div style={{ marginTop: "25px" }} className="col-md-12 no-padding">
      <ListRow title={lang("Job Posts")}
        icon="suitcase"
        backgroundColor={backgroundColor}
        items={<VacancyList limitLoad={4} filterByCf={true} isListAll={true} listClass="flex-wrap-center text-left" />}
        see_more_text={lang("See More Job Posts")}
        see_more_to={`${AppPath}/list-job-posts`}
      ></ListRow>
    </div >
  }
  getEvents(backgroundColor) {
    // for recruiter
    return <div style={{ marginTop: "25px" }} className="col-md-12 no-padding">
      <ListRow title="Events & Webinars"
        icon="calendar"
        backgroundColor={backgroundColor}
        items={<EventList limitLoad={4} isFullWidth={true} />}
        see_more_text={lang("See More Events & Webinars")}
        see_more_to={`${AppPath}/list-events`}
      ></ListRow>
    </div >
  }
  getInterviewAndEvent(backgroundColor) {
    return <div className="container-fluid" style={{ backgroundColor: backgroundColor }}>
      <div className="row main-width">
        <div className="col-md-6">
          <ListRow title="My Interviews"
            icon="video-camera"
            backgroundColor={null}
            containerStyle={{ padding: "20px 0px" }}
            items={<ActivitySection type="row" limitLoad={4} type="row" isFullWidth={true} />}
            see_more_text={lang("See More Interviews")}
            see_more_onclick={() => {
              // console.log(`${AppPath}/list-interviews`)
              window.location = `${AppPath}/list-interviews`;
            }}
          ></ListRow>
        </div>
        <div className="col-md-6">
          <ListRow title="Events & Webinars"
            backgroundColor={null}
            icon="calendar"
            containerStyle={{ padding: "20px 0px" }}
            items={<EventList limitLoad={4} type="row" isFullWidth={true} />}
            see_more_text={lang("See More Events & Webinars")}
            see_more_to={`${AppPath}/list-events`}
          ></ListRow>
        </div>
      </div>

    </div>
  }
  getCompanyBooth(backgroundColor) {
    if (isCfFeatureOff(CFSMeta.FEATURE_COMPANY_BOOTH)) {
      return null;
    }

    let companyEntitySingle = getCfCustomMeta(CFSMeta.TEXT_COMPANY_ENTITY_SINGLE, "Company")
    let companyEntityPlural = getCfCustomMeta(CFSMeta.TEXT_COMPANY_ENTITY_PLURAL, "Companies")

    return <div className="col-md-12 no-padding">
      <ListRow title={`${companyEntitySingle} Profiles`}
        icon="building-o"
        backgroundColor={backgroundColor}
        items={<CompaniesSection {...this.props} limitLoad={3} />}
        see_more_text={lang(`See More ${companyEntityPlural}`)}
        see_more_to={`${AppPath}/list-companies`}
      ></ListRow>
    </div >
  }


  render() {
    document.setTitle("Career Fair");

    let v = null;

    if (isRoleStudent()) {
      v = <div className="hall-page">
        {this.getGallery("#eef0ee")}
        {/* {this.getTitle()}
        {this.getSponsor("#e6e6e6")} */}
        {this.getWelcomeAndSponsor(null)}
        {this.getInterviewAndEvent("#eef0ee")}
        {/* {this.getInterview("#eef0ee")} */}
        {this.getCompanyBooth(null)}
        {/* {this.getEvents("#eef0ee")} */}
        {this.getJobPost("#eef0ee")}
      </div>
    } else if (this.isRecCurrentEvent()) {
      v = <div className="hall-page">
        {this.getGallery("#eef0ee")}
        {this.getWelcomeAndSponsor(null)}
        {this.getCompanyBooth("#eef0ee")}
        {this.getEvents(null)}
        {this.getJobPost("#eef0ee")}
      </div>
    }
    //  else if (isRoleRec()) {
    //   v = <div className="hall-page">
    //     {this.getGallery()}
    //     {this.getTitle()}
    //     {this.getSponsor()}
    //     {this.getRecruiterAction(this.state)}
    //     {this.getInterview("#eef0ee")}
    //     {this.getEvents(null)}
    //   </div>
    // } 
    else if (isRoleAdmin() || isRoleOrganizer()) {
      v = <div className="hall-page">
        {this.getGallery("#eef0ee")}
        {this.getWelcomeAndSponsor(null)}
        {this.getCompanyBooth("#eef0ee")}
        {this.getEvents(null)}
      </div>
    }

    return v;
    // return (
    //   <div className="hall-page">
    //     {this.getGallery()}
    //     {this.getTitle()}
    //     {this.getSponsor()}
    //     {isRoleRec() ? this.getRecruiterAction(this.state) : null}
    //     {isRoleRec() || isRoleStudent() ? this.getActivityAndWebinar() : null}
    //     {/* {isRoleStudent() || isRoleAdmin() ? this.getCompanyBooth() : null} */}
    //     {this.getCompanyBooth()}
    //   </div>
    // );
  }
}

HallPage.propTypes = {
  isPreEvent: PropTypes.bool
};

HallPage.defaultProps = {
  isPreEvent: false
};
