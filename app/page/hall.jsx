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
import { CompanyEnum } from "../../config/db-config";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { Time } from "../lib/time";

import {
  isRoleRec,
  isRoleStudent,
  isRoleAdmin,
  getCFObj,
  getAuthUser,
  isComingSoon,
  isRoleOrganizer
} from "../redux/actions/auth-actions";
import { HallGalleryView } from "./partial/hall/hall-gallery";
import { setBodyFullWidth, unsetBodyFullWidth } from "../../helper/general-helper";
import Timer from "../component/timer";
import { getCFTimeDetail } from "./coming-soon";
import ListRow from "../component/list-row";
import { VacancyList } from "./company";

// require("../css/hall.scss");

export default class HallPage extends React.Component {
  constructor(props) {
    super(props);
    this.getHighlight = this.getHighlight.bind(this);
    this.CFDetail = getCFObj();
    this.title = this.CFDetail.title;

    this.authUser = getAuthUser();

    this.state = {
      next_live_session_time: null,
    }
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

  getHighlight() {
    var v = null;

    if (isRoleRec()) {
      var vData = [
        {
          label: "Student Listing & Resume Drop",
          url: `${RootPath}/app/my-activity/student-listing`,
          icon: "users"
        }
      ];

      var views = vData.map((d, i) => {
        return (
          <span>
            <i className={`fa left fa-${d.icon}`} />
            <NavLink to={`${d.url}`}>{`${d.label}`}</NavLink>
          </span>
        );
      });

      v = <CustomList className="label" alignCenter={true} items={views} />;
    }
    return v;
  }
  getGallery() {
    // let imgUrl = `${ImageUrl}/banner/${this.CFDetail.banner}`;
    // var galleryStyle = {
    //   backgroundImage: `url('${imgUrl}')`,
    //   backgroundPosition: this.CFDetail.banner_pos,
    //   backgroundSize: "cover"
    // };
    // return (
    //   <div style={galleryStyle} className="gallery-section">
    //     Gallery
    //   </div>
    // );

    return (
      <div className="gallery-section main-width">
        <HallGalleryView />
      </div>
    );
  }
  getTitle() {
    var logo = null;
    let has = {
      logo: this.CFDetail.logo !== "undefined" && this.CFDetail.logo !== null,
      height:
        this.CFDetail.logo_height_hall !== "undefined" &&
        this.CFDetail.logo_height_hall !== null,
      width:
        this.CFDetail.logo_width_hall !== "undefined" &&
        this.CFDetail.logo_width_hall !== null,
      margin:
        this.CFDetail.logo_margin_hall !== "undefined" &&
        this.CFDetail.logo_margin_hall !== null
    };
    if (has.logo && has.height && has.width && has.margin) {
      let imgUrl = `${ImageUrl}${this.CFDetail.logo}`;
      var logoStyle = {
        backgroundImage: `url('${imgUrl}')`,
        backgroundPosition: this.CFDetail.logo_position,
        backgroundSize: this.CFDetail.logo_size,
        height: this.CFDetail.logo_height_hall,
        width: this.CFDetail.logo_width_hall,
        margin: this.CFDetail.logo_margin_hall
      };
      logo = <div className="title-logo" style={logoStyle} />;
    }

    return (
      <div className="title-section">
        <div>Welcome To {this.title}</div>
        {logo}
        <div style={{ width: "100%" }}>
          {this.getTimerComingSoon()}
        </div>
      </div>
    );
  }
  getSponsor() {
    return (
      <div style={{ marginTop: "25px", marginBottom: "25px" }} className="sponsor-section main-width">
        <SponsorList
          //ignore_types={[CompanyEnum.TYPE_BRONZE]}
          title={false}
          part_com={false}
          type="hall-page"
          sponsor_size="85px"
        />
      </div>
    );
  }

  getActivityAndWebinar() {
    return (
      <div className="activity-section main-width main-width-lg">
        <div className={`col-md-6 no-padding my-activity`}>
          <ActivitySection />
        </div>
        <div className={`col-md-6 no-padding`}>
          <WebinarHall />
        </div>
      </div>
    );
  }
  getJobPost() {
    return <div style={{ marginTop: "25px" }} className="col-md-12 no-padding">
      <ListRow title="Job Posts"
        backgroundColor={"#eef0ee"}
        items={<VacancyList limitLoad={4} filterByCf={false} isListAll={true} listClass="flex-wrap-center text-left" />}
        see_more_text="See More Job Posts"
        see_more_to={`${AppPath}/list-job-posts`}
      ></ListRow>
    </div >
  }
  getEventAndWebinar() {
    return <div style={{ marginTop: "25px" }} className="col-md-12 no-padding">
      <ListRow title="Events & Webinars"
        backgroundColor={null}
        items={<WebinarHall noBorderCard={true} limitLoad={4} />}
        see_more_text="See More Events & Webinars"
        see_more_to={`${AppPath}/list-events-webinars`}
      ></ListRow>
    </div >
  }
  getCompanyBooth() {

    return <div className="col-md-12 no-padding">
      <ListRow title="Company Profiles"
        backgroundColor={"#eef0ee"}
        items={<CompaniesSection {...this.props} limitLoad={3} />}
        see_more_text="See More Companies"
        see_more_to={`${AppPath}/list-companies`}
      ></ListRow>
    </div >

    // return (
    //   <div className="company-section">
    //     <div style={{ marginTop: "25px" }} className="col-md-12 no-padding">
    //       <div className="title-section">
    //         <div>Company Booth</div>
    //       </div>
    //       <div className="main-width main-width-lg">
    //         <CompaniesSection {...this.props} />
    //       </div>
    //     </div>
    //   </div>
    // );
  }

  getRecruiterAction() {
    /**
     * 2 When Are you live?
      - kalau ada : Next Live at xxxxx
      - kalau takde : Click here to set your live session
      // this.state.next_live_session_time
    */
    let nextSessionStr = "Click here to set your live session";
    if (this.state.next_live_session_time != null &&
      this.state.next_live_session_time > 0) {
      nextSessionStr = `Next Live @ ${Time.getString(this.state.next_live_session_time)}`
    }

    return <div className="title-sectaion">
      <div className="main-width">
        <ButtonAction
          style={{ width: "350px" }}
          btnClass="btn-lg btn-success"
          to={`${RootPath}/app/my-activity/student-listing`}
          icon="users"
          iconSize="3x"
          mainText={"All Students"}
          // subText={`See who's interested in ${this.authUser.company.name}`}
          subText={`Browse students' profiles`}
        />
        {/* <ButtonAction
          style={{ width: "350px" }}
          btnClass="btn-lg btn-danger"
          onClick={() => { openLiveSession(this.authUser.rec_company); }}
          icon="podcast"
          iconSize="3x"
          mainText={"Go Live"}
          subButtonText={nextSessionStr}
          subButtonOnClick={() => {
            console.log("check when");
            createNewLiveSessionPopup(this.authUser.rec_company, () => {
              console.log("yey")
            })
          }}
        /> */}


      </div >
    </div >
  }


  getTimerComingSoon() {
    if (isComingSoon()) {
      var doneMes = null;
      return <Timer end={this.CFDetail.start} doneMes={doneMes}></Timer>
    }

    return null
  }

  render() {
    document.setTitle("Career Fair");

    let v = null;

    if (isRoleStudent()) {
      v = <div className="hall-page">
        {this.getGallery()}
        {this.getTitle()}
        {this.getSponsor()}
        {this.getCompanyBooth()}
        {this.getEventAndWebinar()}
        {this.getJobPost()}
        {/* {this.getActivityAndWebinar()} */}
      </div>
    } else if (isRoleRec()) {
      v = <div className="hall-page">
        {this.getGallery()}
        {this.getTitle()}
        {this.getSponsor()}
        {this.getRecruiterAction(this.state)}
        {this.getActivityAndWebinar()}
      </div>
    } else if (isRoleAdmin() || isRoleOrganizer()) {
      v = <div className="hall-page">
        {this.getGallery()}
        {this.getTitle()}
        {this.getSponsor()}
        {this.getCompanyBooth()}
        {this.getEventAndWebinar()}
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
