import React from "react";
import PropTypes from "prop-types";
import { CustomList, createIconLink } from "../component/list";
import { NavLink } from "react-router-dom";

import PageSection from "../component/page-section";
import { GroupSessionView } from "./partial/hall/group-session";
import CompaniesSection from "./partial/hall/companies";
import ForumPage from "./forum";

import SponsorList from "./partial/static/sponsor-list";
import { WebinarHall } from "../page/auditorium.jsx";
import ActivitySection from "./partial/hall/activity";
import { RootPath, ImageUrl } from "../../config/app-config";
import { CompanyEnum } from "../../config/db-config";
import {
  isRoleRec,
  isRoleStudent,
  getCFObj,
  getAuthUser
} from "../redux/actions/auth-actions";
import { HallGalleryView } from "./partial/hall/hall-gallery";

require("../css/hall.scss");

export default class HallPage extends React.Component {
  constructor(props) {
    super(props);
    this.getHighlight = this.getHighlight.bind(this);
    this.CFDetail = getCFObj();
    this.title = this.CFDetail.title;

    this.authUser = getAuthUser();
  }

  componentWillMount() {
    this.body = document.getElementsByTagName("body")[0];
    this.body.className += " body-hall-page ";
  }

  componentWillUnmount() {
    this.body.className = "";
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
      </div>
    );
  }
  getSponsor() {
    return (
      <div className="sponsor-section main-width">
        <SponsorList
        ignore_types={[CompanyEnum.TYPE_BRONZE]}
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
      <div className="activity-section container">
        <div className={`col-lg-6 no-padding`}>
          <ActivitySection />
        </div>
        <div className={`col-lg-6 no-padding`}>
          <WebinarHall />
        </div>
      </div>
    );
  }
  render() {
    document.setTitle("Career Fair");

    return (
      <div className="hall-page">
        {this.getGallery()}
        {this.getTitle()}
        {this.getSponsor()}
        {this.getActivityAndWebinar()}
      </div>
    );

    // var gSesion = null;
    // if (isRoleRec()) {
    //     gSesion = <GroupSessionView forRec={true} company_id={this.authUser.rec_company}></GroupSessionView>;
    //     gSesion = <PageSection showOverflow={true} title="" body={gSesion}></PageSection>;
    // }

    // var companyBooth = null;
    // if (isRoleStudent()) {
    //     companyBooth = <PageSection showOverflow={true} title={null} body={CompaniesSection}></PageSection>;
    // }

    // var midView = null;
    // if (isRoleRec()) {

    //     var forum = <ForumPage isHomePage={true} forum_id={`company_${getAuthUser().company_id}`}></ForumPage>;
    //     midView = <div className="container-fluid" >
    //         <div className="row" >
    //             <div className="col-md-6" style={{ marginTop: "20px" }}>
    //                 <PageSection showOverflow={true} title={null} body={ActivitySection}></PageSection>
    //             </div>
    //             <div className="col-md-6">
    //                 <PageSection showOverflow={true} title="" body={forum}></PageSection>
    //             </div>
    //         </div>
    //     </div>
    // } else {
    //     midView = <PageSection showOverflow={true} title={null} body={ActivitySection}></PageSection>;
    // }

    // let titlePage = isRoleRec() ?
    //     <h2>Welcome To {this.title}</h2>:
    //     <h4>Welcome To {this.title}</h4>;
    // return (<div>
    //     {this.props.isPreEvent ? <div className="line"></div>
    //         : titlePage}
    //     {gSesion}
    //     {companyBooth}
    //     {midView}
    // </div>);
  }
}

HallPage.propTypes = {
  isPreEvent: PropTypes.bool
};

HallPage.defaultProps = {
  isPreEvent: false
};
