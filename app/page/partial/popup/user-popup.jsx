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
import { ImgConfig, RootPath } from "../../../../config/app-config";
import { CompanyEnum } from "../../../../config/db-config";
import ProfileCard from "../../../component/profile-card.jsx";
import PageSection from "../../../component/page-section";
import { CustomList, createIconLink } from "../../../component/list";
import * as layoutActions from "../../../redux/actions/layout-actions";
import {
  isRoleRec,
  getAuthUser,
  isRoleAdmin
} from "../../../redux/actions/auth-actions";
import CompanyPopup from "./company-popup";
import { addLog } from "../../../redux/actions/other-actions";
import { openSIAddForm } from "../activity/scheduled-interview";
import { Gallery } from "../../../component/gallery";
import { NavLink } from "react-router-dom";
import { openSIFormAnytime } from "../../partial/activity/scheduled-interview";
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
      "No Document Or Links Uploaded"
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
        emptyMessage={"No Document Or Links Uploaded"}
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
      privs : null
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
            privs: privs, loading : false
          };
        });
      });
    }else{
      this.setState({ loading: false })
    }
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


    this.loadCompanyPriv();

    console.log("UserPage", "componentWillMount");
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
                country_study
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
                skill {val}
                extracurricular {val}
                field_study {val}
                looking_for_position {val}
                interested_role {val}
                interested_job_location {val}
                doc_links{label url type}
                video_resume {ID url}
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
        return { data: res.data.data.user};
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
        <i className="text-muted">Not Specified</i>
      </small>
    );

    var items = [
      {
        label: "Email",
        icon: "envelope",
        value: d.user_email
      }
    ];

    if (d.role === UserEnum.ROLE_RECRUITER) {
      if (d.company !== null) {
        items.push(
          {
            label: "Company",
            icon: "suitcase",
            value: (
              <a
                onClick={() =>
                  layoutActions.storeUpdateFocusCard(
                    d.company.name,
                    CompanyPopup,
                    { id: d.rec_company }
                  )
                }
              >
                {d.company.name}
              </a>
            )
          },
          {
            label: "Position",
            icon: "black-tie",
            value: d.rec_position ? (
              d.rec_position
            ) : (
                <span className="text-muted">Position Not Specified</span>
              )
          }
        );
      } else {
        items.push({
          label: "Company",
          icon: "suitcase",
          value: <span className="text-muted">No Company</span>
        });
      }
    }

    if (d.role === UserEnum.ROLE_STUDENT) {
      items.push({
        label: "Phone Number",
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

      items.push(
        {
          label: "University",
          icon: "university",
          value: this.isValueEmpty(d.university) ? notSpecifed : d.university
        },
        {
          label: "Expected Graduation",
          icon: "calendar",
          value: this.isValueEmpty(d.graduation_month)
            ? notSpecifed
            : `${d.graduation_month} ${d.graduation_year}`
        },
        {
          label: "Working Availability",
          icon: "calendar",
          value: this.isValueEmpty(d.working_availability_month)
            ? notSpecifed
            : `${d.working_availability_month} ${d.working_availability_year}`
        },
        {
          label: "Looking For",
          icon: "search",
          value: this.isValueEmpty(d.looking_for_position)
            ? notSpecifed
            : this.createListForMulti(d.looking_for_position)
        },
        {
          label: "Grade / CGPA",
          icon: "book",
          value: this.isValueEmpty(d.grade) ? notSpecifed : d.grade
        },
        {
          label: "City/State in Malaysia",
          icon: "map-marker",
          value: this.isValueEmpty(d.where_in_malaysia) ? notSpecifed : d.where_in_malaysia
        },
        // {
        //   label: "Work Availability Date",
        //   icon: "suitcase",
        //   value: this.getWorkAvailable(
        //     d.available_month,
        //     d.available_year,
        //     notSpecifed
        //   )
        // }
      );
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
        {label}
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

    const field_study = (
      <CustomList
        alignCenter={false}
        className="label"
        items={user.field_study.map((d, i) => d.val)}
      ></CustomList>
    );

    const interested_role = (
      <CustomList
        alignCenter={false}
        className="label"
        items={user.interested_role.map((d, i) => d.val)}
      ></CustomList>
    );

    const skill = (
      <CustomList
        alignCenter={false}
        className="label"
        items={user.skill.map((d, i) => d.val)}
      ></CustomList>
    );

    const extracurricular = (
      <CustomList
        alignCenter={false}
        className="label"
        items={user.extracurricular.map((d, i) => d.val)}
      ></CustomList>
    );

    const interested_job_location = (
      <CustomList
        alignCenter={false}
        className="label"
        items={user.interested_job_location.map((d, i) => d.val)}
      ></CustomList>
    );

    var pageClassName = this.props.isSessionPage ? "" : "left";
    var leftBody = (
      <div>
        {si_btn}
        <PageSection
          title={this.getTitle("About", "user")}
          className={pageClassName}
          body={basic}
        ></PageSection>

        <PageSection
          alignCenter={false}
          className={pageClassName}
          title={this.getTitle("Field Of Study", "graduation-cap")}
          body={field_study}
        ></PageSection>

        <PageSection
          className={pageClassName}
          title={this.getTitle("Skills", "star")}
          body={skill}
        ></PageSection>

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
        {user.video_resume != null && user.video_resume.url ? (
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

        <PageSection
          className={pageClassName}
          title={this.getTitle("Interested Job Position", "suitcase")}
          body={interested_role}
        ></PageSection>

        <PageSection
          className={pageClassName}
          title={this.getTitle("Interested Job Location", "map-marker")}
          body={interested_job_location}
        ></PageSection>

        <PageSection
          className={pageClassName}
          title={this.getTitle("Organization / Extracurricular Activities", "podcast")}
          body={extracurricular}
        ></PageSection>
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
        style={{ minWidth: "200px" }}
        className="btn btn-blue btn-lg"
        to={`${RootPath}/app/student-chat/${user.ID}`}
        onClick={e => {
          layoutActions.storeHideFocusCard();
        }}
      >
        <i className="fa fa-comments left"></i>Start Chat
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
          "Opps.. It seems that you don't have privilege to schedule private session yet"
        );
      }
    };

    return (
      <a
        style={{ minWidth: "200px" }}
        className="btn btn-success btn-lg"
        onClick={e => {
          actionHandler();
        }}
      >
        <i className="fa fa-video-camera left" />
        Schedule Call
      </a>
    );
  }

  render() {
    var id = null;
    var user = this.state.data;
    var view = null;
    if (this.state.loading) {
      view = <Loader size="3" text="Loading Student Information..."></Loader>;
    } else {
      var userBody =
        this.props.role === UserEnum.ROLE_STUDENT
          ? this.getStudentBody(user)
          : this.getRecruiterBody(user);

      var actionForRec = (
        <div style={{ marginTop: "10px", marginBottom: "18px" }}>
          {this.getStartChat(user)}
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
                  style={{ marginBottom: "-25px" }}
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
