import React, { Component } from "react";
import PropTypes from "prop-types";
import { Loader } from "../../../component/loader";
import { getAxiosGraphQLQuery, graphql } from "../../../../helper/api-helper";
import {
  DocLinkEnum,
  UserEnum,
  LogEnum,
  PrescreenEnum
} from "../../../../config/db-config";
import { getMonthLabel } from "../../../../config/data-config";
import { ImgConfig, RootPath, IsOnVideoResume, AppPath } from "../../../../config/app-config";
import { CompanyEnum } from "../../../../config/db-config";
import ProfileCard from "../../../component/profile-card.jsx";
import PageSection from "../../../component/page-section";
import { CustomList, createIconLink } from "../../../component/list";
import * as layoutActions from "../../../redux/actions/layout-actions";
import {
  isRoleRec,
  getAuthUser,
  isRoleAdmin,
  getCF
} from "../../../redux/actions/auth-actions";
import CompanyPopup from "./company-popup";
import { addLog } from "../../../redux/actions/other-actions";
import { openSIAddForm } from "../activity/scheduled-interview";
import { Gallery } from "../../../component/gallery";
import { NavLink } from "react-router-dom";
import { openSIFormAnytime } from "../../partial/activity/scheduled-interview";
import { isCustomUserInfoOff, Single, Multi } from "../../../../config/registration-config";
import lang from "../../../lib/lang";
export function createUserMajorList(major) {
  var r = null;

  try {
    r = "";
    major = JSON.parse(major);
    major.map((d, i) => {
      if (i > 0) {
        r += ", ";
      }
      r += d;
    });
  } catch (err) {
    r = major;
  }

  return r;
}

export function createVideoDropbox(url, width = "100%", height = "200") {
  return (
    <video style={{ background: "black" }} width={width} height={height} controls>
      <source src={url} type="video/mp4" />
    </video>
  );
}
// isIconOnly will only consider label with label style set in DocLinkEnum
export function createUserDocLinkList(
  doc_links,
  student_id,
  alignCenter = true,
  isIconOnly = false,
  isSimple = false,
  isSmall = false
) {
  //document and link
  var ret = null;
  const onClickDocLink = () => {
    addLog(LogEnum.EVENT_CLICK_USER_DOC, student_id);
  };

  var dl = [];
  var doc_link = null;

  if (isIconOnly) {
    doc_links.map((d, i) => {
      if (d == null) return;

      var style = DocLinkEnum.LABEL_STYLE[d.label];
      if (style && dl.length < 4) {
        d.icon = style.icon;
        d.color = style.color;
        dl.push(d);
      }
    });
    ret = createIconLink(
      "sm",
      dl,
      alignCenter,
      onClickDocLink,
      lang("No Document Or Links Uploaded")
    );
  } else if (isSimple) {
    ret = doc_links.map((d, i) => {
      if (d == null) return;

      return <a target="_blank" href={`${d.url}`}>{`${d.label} `}</a>;
    });
  } else {
    dl = doc_links.map((d, i) => {
      if (d == null) return;

      var icon = d.type === DocLinkEnum.TYPE_DOC ? "file-text" : "link";
      return (
        <span>
          <i className={`fa left fa-${icon}`}></i>
          <a target="_blank" href={`${d.url}`}>{`${d.label} `}</a>
        </span>
      );
    });
    ret = (
      <CustomList
        className={"label"}
        isSmall={isSmall}
        emptyMessage={<i><small>{lang("No Document Or Links Uploaded")}</small></i>}
        alignCenter={alignCenter}
        items={dl}
        onClick={onClickDocLink}
      ></CustomList>
    );
  }

  return ret;
}

export default class UserPopup extends Component {
  constructor(props) {
    super(props);

    this.authUser = getAuthUser();
    this.isSelfUser = false;
    this.state = {
      data: null,
      loading: true,
      privs: null
    };
  }

  loadCompanyPriv() {
    if (isRoleRec() && !this.props.companyPrivs) {
      this.setState({ loading: true })
      var q = `query {company(ID:${getAuthUser().rec_company}) { priviledge } }`;
      graphql(q).then(res => {
        var privs = res.data.data.company.priviledge;
        this.setState(prevState => {
          if (privs == null) {
            privs = "";
          }
          return {
            privs: privs, loading: false
          };
        });
      });
    } else {
      this.setState({ loading: false })
    }
  }

  addIfValid(studentField, attrList = "") {
    let toRet = studentField + " " + attrList;
    if (!isCustomUserInfoOff(getCF(), studentField)) {
      return toRet;
    }
    return "";
  }

  componentWillMount() {
    var id = null;

    if (this.props.match) {
      id = this.props.match.params.id;
    } else {
      id = this.props.id;
    }

    this.id = id;

    if (this.id == this.authUser.ID) {
      this.isSelfUser = true;
    }

    console.log("UserPage", "componentWillMount");
    // 7a. @custom_user_info_by_cf
    var query =
      this.props.role === UserEnum.ROLE_STUDENT
        ? `query {
              user(ID:${id}) {
                ID
                user_email
                img_url
                img_pos
                img_size
                role
                degree_level
                first_name
                last_name
                ${this.addIfValid("country_study")}
                ${this.addIfValid("gender")}
                ${this.addIfValid("work_experience_year")}
                university
                qualification
                graduation_month
                graduation_year
                working_availability_month
                working_availability_year
                grade
                where_in_malaysia
                phone_number
                sponsor
                description
                ${this.addIfValid("local_or_oversea_study")}
                ${this.addIfValid("local_or_oversea_location")}
                ${this.addIfValid("monash_student_id")}
                ${this.addIfValid("monash_school")}
                ${this.addIfValid("sunway_faculty")}
                ${this.addIfValid("skill", "{val}")}
                ${this.addIfValid("extracurricular", "{val}")}
                ${this.addIfValid("field_study", "{val}")}
                ${this.addIfValid("looking_for_position", "{val}")}
                ${this.addIfValid("interested_role", "{val}")}
                ${this.addIfValid("interested_job_location", "{val}")}
                doc_links{label url type}
                ${IsOnVideoResume ? "video_resume {ID url}" : ""}
            }}`
        : `query {
              user(ID:${id}) {
                ID
                user_email
                first_name
                last_name
                description
                role
                img_url
                img_pos
                img_size
                rec_position
                rec_company
                company{name}
            }}`;

    getAxiosGraphQLQuery(query).then(res => {
      this.setState(() => {
        return { data: res.data.data.user };
      });

      this.loadCompanyPriv();
    });
  }

  isValueEmpty(val) {
    if (val == null || val == "") {
      return true;
    }

    if (Array.isArray(val) && val.length <= 0) {
      return true;
    }
    return false;
  }
  createListForMulti(arr) {
    let ret = [];

    for (var i in arr) {
      let v = arr[i].val;
      ret.push(v);
      ret.push(<br></br>);
    }
    return ret;
  }

  getBasicInfo(d) {
    var notSpecifed = (
      <small>
        <i className="text-muted">{lang("Not Specified")}</i>
      </small>
    );

    var items = [
      {
        label: lang("Email"),
        icon: "envelope",
        value: d.user_email
      }
    ];

    if (d.role === UserEnum.ROLE_RECRUITER) {
      if (d.company !== null) {
        items.push(
          {
            label: lang("Company"),
            icon: "suitcase",
            value: (
              <NavLink onClick={() => { layoutActions.storeHideFocusCard() }}
                to={`${AppPath}/company/${d.rec_company}`}>
                {d.company.name}
              </NavLink>
              // <a
              //   onClick={() =>
              //     layoutActions.storeUpdateFocusCard(
              //       d.company.name,
              //       CompanyPopup,
              //       { id: d.rec_company }
              //     )
              //   }
              // >
              //   {d.company.name}
              // </a>
            )
          },
          {
            label: lang("Position"),
            icon: "black-tie",
            value: d.rec_position ? (
              d.rec_position
            ) : (
                <span className="text-muted">{lang("Position Not Specified")}</span>
              )
          }
        );
      } else {
        items.push({
          label: lang("Company"),
          icon: "suitcase",
          value: <span className="text-muted">{lang("No Company")}</span>
        });
      }
    }

    if (d.role === UserEnum.ROLE_STUDENT) {
      items.push({
        label: lang("Phone Number"),
        icon: "phone",
        value: this.isValueEmpty(d.phone_number) ? notSpecifed : d.phone_number
      });

      // field_study --------------------------------
      // items.push({
      //   label: "Field Of Study",
      //   icon: "graduation-cap",
      //   value: this.isValueEmpty(d.field_study)
      //     ? notSpecifed
      //     : this.createListForMulti(d.field_study)
      // });

      // 7b. @custom_user_info_by_cf -display single

      if (!isCustomUserInfoOff(getCF(), Single.monash_student_id)) {
        items.push({
          label: lang("Student ID"),
          icon: "slack",
          value: this.isValueEmpty(d.monash_student_id) ? notSpecifed : d.monash_student_id
        })
      }

      if (!isCustomUserInfoOff(getCF(), Single.local_or_oversea_study)) {
        items.push({
          label: lang("Study Place"),
          icon: "university",
          value: this.isValueEmpty(d.local_or_oversea_study) ? notSpecifed : d.local_or_oversea_study
        })
      }

      if (!isCustomUserInfoOff(getCF(), Single.monash_school)) {
        items.push({
          label: lang("School"),
          icon: "university",
          value: this.isValueEmpty(d.monash_school) ? notSpecifed : d.monash_school
        })
      }

      if (!isCustomUserInfoOff(getCF(), Single.sunway_faculty)) {
        items.push({
          label: lang("Faculty"),
          icon: "university",
          value: this.isValueEmpty(d.sunway_faculty) ? notSpecifed : d.sunway_faculty
        })
      }

      if (!isCustomUserInfoOff(getCF(), Single.university)) {
        items.push({
          label: lang("University"),
          icon: "university",
          value: this.isValueEmpty(d.university) ? notSpecifed : d.university
        });
      }

      if (!isCustomUserInfoOff(getCF(), Single.graduation_month)) {
        items.push({
          label: lang("Expected Graduation"),
          icon: "calendar",
          value: this.isValueEmpty(d.graduation_month)
            ? notSpecifed
            : `${d.graduation_month} ${d.graduation_year}`
        });
      }

      if (!isCustomUserInfoOff(getCF(), Single.working_availability_month)) {
        items.push({
          label: lang("Working Availability"),
          icon: "calendar",
          value: this.isValueEmpty(d.working_availability_month)
            ? notSpecifed
            : `${d.working_availability_month} ${d.working_availability_year}`
        });
      }

      if (!isCustomUserInfoOff(getCF(), Single.local_or_oversea_location)) {
        items.push({
          label: lang("Currently Located"),
          icon: "map-marker",
          value: this.isValueEmpty(d.local_or_oversea_location) ? notSpecifed : d.local_or_oversea_location
        })
      }

      if (!isCustomUserInfoOff(getCF(), Single.gender)) {
        items.push({
          label: lang("Gender"),
          icon: "intersex",
          value: this.isValueEmpty(d.gender) ? notSpecifed : d.gender
        })
      }
      if (!isCustomUserInfoOff(getCF(), Single.work_experience_year)) {
        items.push({
          label: lang("Relevant Working Experience"),
          icon: "suitcase",
          value: this.isValueEmpty(d.work_experience_year) ? notSpecifed : d.work_experience_year
        })
      }

      if (!isCustomUserInfoOff(getCF(), Multi.looking_for_position)) {
        items.push({
          label: lang("Looking For"),
          icon: "search",
          value: this.isValueEmpty(d.looking_for_position)
            ? notSpecifed
            : this.createListForMulti(d.looking_for_position)
        });
      }


      if (!isCustomUserInfoOff(getCF(), Single.grade)) {
        items.push({
          label: lang("Grade / CGPA"),
          icon: "book",
          value: this.isValueEmpty(d.grade) ? notSpecifed : d.grade
        });
      }

      if (!isCustomUserInfoOff(getCF(), Single.where_in_malaysia)) {
        items.push({
          label: lang("City/State In Malaysia"),
          icon: "map-marker",
          value: this.isValueEmpty(d.where_in_malaysia) ? notSpecifed : d.where_in_malaysia
        })
      }
    }

    for (let index in items) {
      try {
        items[index].value = lang(items[index].value);
      } catch (err) { }
    }
    return <CustomList className="icon" items={items}></CustomList>;
  }

  getWorkAvailable(m, y, notSpecifed) {
    if (m) {
      if (m == y) {
        return m;
      } else {
        return `${getMonthLabel(m)} ${y}`;
      }
    } else {
      return notSpecifed;
    }
  }

  getRecruiterBody(user) {
    //about
    const basic = this.getBasicInfo(user);
    var pcBody = (
      <div>
        <PageSection title="About" body={basic}></PageSection>
      </div>
    );

    return pcBody;
  }

  getTitle(label, icon) {
    return (
      <span>
        <i style={{ marginRight: "10px" }} className={`fa fa-${icon} left`}></i>
        {lang(label)}
      </span>
    );
  }

  getStudentBody(user) {
    //about
    const basic = this.getBasicInfo(user);

    //schedule interview jenis lama for pre screen maybe
    // only admin can access
    var si_btn = isRoleAdmin() ? (
      <div>
        <a
          className="btn btn-blue"
          onClick={() => {
            openSIAddForm(
              this.props.id,
              this.props.company_id,
              PrescreenEnum.ST_PROFILE
            );
          }}
        >
          <i className="fa fa-comments left"></i>
          Schedule For Session
        </a>
      </div>
    ) : null;

    var doc_link = createUserDocLinkList(user.doc_links, this.id, false);

    // 7c. @custom_user_info_by_cf - disply multi

    const field_study = !isCustomUserInfoOff(getCF(), "field_study") ? (
      <CustomList
        alignCenter={false}
        className="label"
        items={user.field_study.map((d, i) => d.val)}
      ></CustomList>
    ) : null;

    const interested_role = !isCustomUserInfoOff(getCF(), "interested_role") ? (
      <CustomList
        alignCenter={false}
        className="label"
        items={user.interested_role.map((d, i) => d.val)}
      ></CustomList>
    ) : null;

    const skill = !isCustomUserInfoOff(getCF(), "skill") ? (
      <CustomList
        alignCenter={false}
        className="label"
        items={user.skill.map((d, i) => d.val)}
      ></CustomList>
    ) : null;

    const extracurricular = !isCustomUserInfoOff(getCF(), "extracurricular") ? (
      <CustomList
        alignCenter={false}
        className="label"
        items={user.extracurricular.map((d, i) => d.val)}
      ></CustomList>
    ) : null;

    const interested_job_location = !isCustomUserInfoOff(getCF(), "interested_job_location") ? (
      <CustomList
        alignCenter={false}
        className="label"
        items={user.interested_job_location.map((d, i) => d.val)}
      ></CustomList>
    ) : null;

    var pageClassName = this.props.isSessionPage ? "" : "left";
    var leftBody = (
      <div>
        {si_btn}
        <PageSection
          title={this.getTitle("About", "user")}
          className={pageClassName}
          body={basic}
        ></PageSection>

        {!isCustomUserInfoOff(getCF(), "field_study") ?
          <PageSection
            alignCenter={false}
            className={pageClassName}
            title={this.getTitle("Field Of Study", "graduation-cap")}
            body={field_study}
          ></PageSection> : null}



        {!isCustomUserInfoOff(getCF(), "extracurricular") ?
          <PageSection
            className={pageClassName}
            title={this.getTitle("Organization / Extracurricular Activities", "podcast")}
            body={extracurricular}
          ></PageSection> : null}

        {user.description != "" && user.description != null ? (
          <PageSection
            maxHeight={143}
            className={pageClassName}
            title={this.getTitle("More Info", "info-circle")}
            body={<p>{user.description}</p>}
          ></PageSection>
        ) : null}
      </div>
    );
    var rightBody = (
      <div>
        {(IsOnVideoResume && user.video_resume != null && user.video_resume.url) ? (
          <PageSection
            className={pageClassName}
            title={this.getTitle("Video Resume", "youtube-play")}
            body={createVideoDropbox(user.video_resume.url)}
          ></PageSection>
        ) : null}

        <PageSection
          className={pageClassName}
          title={this.getTitle("Attachments", "file-text")}
          body={doc_link}
        ></PageSection>

        {!isCustomUserInfoOff(getCF(), "skill") ?
          <PageSection
            className={pageClassName}
            title={this.getTitle("Skills", "star")}
            body={skill}
          ></PageSection> : null}

        {!isCustomUserInfoOff(getCF(), "interested_role") ?
          <PageSection
            className={pageClassName}
            title={this.getTitle("Interested Job Position", "suitcase")}
            body={interested_role}
          ></PageSection> : null}

        {!isCustomUserInfoOff(getCF(), "interested_job_location") ?
          <PageSection
            className={pageClassName}
            title={this.getTitle("Interested Job Location", "map-marker")}
            body={interested_job_location}
          ></PageSection> : null}
      </div>
    );

    if (this.props.isSessionPage) {
      return (
        <div>
          {leftBody}
          {rightBody}
        </div>
      );
    } else {
      return {
        left: leftBody,
        right: rightBody
      };
    }
  }

  getBanner() {
    var data = this.state.data;
    data.banner_url = "";
    data.banner_position = "";
    data.banner_url = "";

    const isInvalid = d => {
      if (typeof d === "undefined" || d == "" || d == null || d == "null") {
        return true;
      }

      return false;
    };

    data.banner_url = isInvalid(data.banner_url)
      ? ImgConfig.DefUserBanner
      : data.banner_url;
    var style = {
      backgroundImage: "url(" + data.banner_url + ")",
      backgroundSize: isInvalid(data.banner_size) ? "" : data.banner_size,
      backgroundPosition: isInvalid(data.banner_position)
        ? "center center"
        : data.banner_position
    };

    return <div className="fc-banner" style={style}></div>;
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
      var isIframe =
        item.type == DocLinkEnum.TYPE_DOC || item.url.containText("youtube");

      if (isIframe) {
        iframe.push(item);
      } else {
        link.push(item);
      }
    }

    return (
      <div>
        <Gallery student_id={this.props.id} data={link} size="lg"></Gallery>
        <br></br>
        <Gallery student_id={this.props.id} data={iframe} size="lg"></Gallery>
      </div>
    );
  }

  getStartChat(user) {
    if (!isRoleRec()) {
      return null;
    }
    return (
      <NavLink
        style={{ minWidth: "200px", margin: "7px" }}
        className="btn btn-blue btn-lg btn-round-10 "
        to={`${RootPath}/app/student-chat/${user.ID}`}
        onClick={e => {
          layoutActions.storeHideFocusCard();
        }}
      >
        <i className="fa fa-comments left"></i>{lang("Start Chat")}
      </NavLink>
    );
  }
  getScheduleCall(user) {
    if (!isRoleRec()) {
      return null;
    }

    let companyPriv = this.props.companyPrivs ? this.props.companyPrivs : this.state.privs;
    var canSchedule = CompanyEnum.hasPriv(
      companyPriv,
      CompanyEnum.PRIV.SCHEDULE_PRIVATE_SESSION
    );

    const actionHandler = () => {
      if (canSchedule) {
        let company_id = getAuthUser().rec_company;
        openSIFormAnytime(this.props.id, company_id);
      } else {
        // EUR FIX
        // See Availability
        layoutActions.errorBlockLoader(
          lang("Opps.. It seems that you don't have privilege to schedule private session yet")
        );
      }
    };

    return (
      <a
        style={{ minWidth: "200px", margin: "7px" }}
        className="btn btn-success btn-lg btn-round-10 "
        onClick={e => {
          actionHandler();
        }}
      >
        <i className="fa fa-video-camera left" />
        {lang("Schedule Call")}
      </a>
    );
  }

  render() {
    var id = null;
    var user = this.state.data;
    var view = null;
    if (this.state.loading) {
      view = <Loader size="3" text={lang("Loading Student Information...")}></Loader>;
    } else {
      var userBody =
        this.props.role === UserEnum.ROLE_STUDENT
          ? this.getStudentBody(user)
          : this.getRecruiterBody(user);

      var actionForRec = (
        <div style={{ marginTop: "10px", marginBottom: "18px" }}>
          {this.getStartChat(user)}
          {/* <span style={{ padding: "0px 5px" }}></span> */}
          {this.getScheduleCall(user)}
        </div>
      );

      var profilePic = (
        <div>
          <ProfileCard
            type="student"
            title={
              <h3>
                {user.first_name}
                <br></br>
                <small>{user.last_name}</small>
              </h3>
            }
            img_url={user.img_url}
            img_pos={user.img_pos}
            img_size={user.img_size}
            body={actionForRec}
          ></ProfileCard>
        </div>
      );

      if (
        this.props.role === UserEnum.ROLE_STUDENT &&
        !this.props.isSessionPage
      ) {
        view = (
          <div>
            {this.getBanner()}
            <div className="container-fluid">
              <div className="row">
                <div
                  className="col-md-12 com-pop-left"
                  style={{
                    // borderBottom: "1px solid gray",
                    marginBottom: "10px",
                    // paddingBottom: "10px"
                  }}
                >
                  <div
                    className="com-pop-pic"
                    style={{ textAlign: "center", marginTop: "-65px" }}
                  >
                    {profilePic}
                  </div>
                </div>
                <div className="col-md-6">{userBody.left}</div>
                <div className="col-md-6">{userBody.right}</div>
              </div>
            </div>
          </div>
        );
      } else {
        view = (
          <div>
            <ProfileCard
              type="student"
              title={user.first_name}
              subtitle={user.last_name}
              img_url={user.img_url}
              img_pos={user.img_pos}
              img_size={user.img_size}
              body={userBody}
            ></ProfileCard>
          </div>
        );
      }
    }

    return view;
  }
}

UserPopup.propTypes = {
  id: PropTypes.number.isRequired,
  role: PropTypes.string,
  companyPrivs: PropTypes.object,
  company_id: PropTypes.number,
  isSessionPage: PropTypes.bool
};

UserPopup.defaultProps = {
  role: UserEnum.ROLE_STUDENT,
  isSessionPage: false
};
