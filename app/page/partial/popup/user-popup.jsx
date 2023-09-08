import React, { Component } from "react";
import PropTypes from "prop-types";
import { Loader } from "../../../component/loader";
import { getAxiosGraphQLQuery, graphql, postRequest } from "../../../../helper/api-helper";
import {
  DocLinkEnum,
  UserEnum,
  LogEnum,
  PrescreenEnum,
  CFSMeta
} from "../../../../config/db-config";
import { getMonthLabel } from "../../../../config/data-config";
import { ImgConfig, RootPath, IsOnVideoResume, AppPath, UserUrl } from "../../../../config/app-config";
import { CompanyEnum } from "../../../../config/db-config";
import ProfileCard from "../../../component/profile-card.jsx";
import PageSection from "../../../component/page-section";
import { CustomList, createIconLink } from "../../../component/list";
import * as layoutActions from "../../../redux/actions/layout-actions";
import {
  isRoleRec,
  getAuthUser,
  isRoleAdmin,
  getCF,
  getNoMatrixLabel,
  getCfCustomMeta
} from "../../../redux/actions/auth-actions";
import CompanyPopup from "./company-popup";
import { addLog } from "../../../redux/actions/other-actions";
import { openSIAddForm } from "../activity/scheduled-interview";
import { Gallery } from "../../../component/gallery";
import { NavLink } from "react-router-dom";
import { openSIFormAnytime } from "../../partial/activity/scheduled-interview";
import { isCustomUserInfoOff, Single, Multi } from "../../../../config/registration-config";
import { lang } from "../../../lib/lang";
import { cfCustomFunnel } from "../../../../config/cf-custom-config";
import UserFieldHelper from "../../../../helper/user-field-helper";
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
  isSmall = false,
  postOnClick
) {
  //document and link
  var ret = null;
  const onClickDocLink = () => {
    addLog(LogEnum.EVENT_CLICK_USER_DOC, student_id);
    if (postOnClick) {
      postOnClick();
    }
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
    let customKeys = cfCustomFunnel({ action: 'get_keys_for_popup' });
    let additionalCustomCf = "";
    for (var k of customKeys) {
      additionalCustomCf += ` ${this.addIfValid(k, cfCustomFunnel({ action: 'get_attr_by_key', key: k }))} `;
    }

    if (this.props.role === UserEnum.ROLE_STUDENT) {

      postRequest(UserUrl + '/get-detail', {
        user_id: id,
        fieldSingle: UserFieldHelper.getFieldSingle(getCF()),
        fieldMulti: UserFieldHelper.getFieldMulti(getCF()),
        isIncludeDocLink: true,
      }).then(res => {
        console.log("Res", res);
        this.setState(() => {
          return { data: res.data, loading: false };
        });
      })
    } else {
      var query =
        `query {
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
      ret.push(lang(v));
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
      // NEW DYNAMIC HERE
      let popupItems = UserFieldHelper.getPopupItems(getCF(), "single");
      for (let p of popupItems) {
        let k = p.id;
        let v;
        if (this.isValueEmpty(d[k])) {
          v = notSpecifed
        } else {
          v = d[k]
        }
        items.push({
          label: lang(p.label),
          icon: p.icon,
          value: v
        })
      }
    }
    for (let index in items) {
      try {
        items[index].value = lang(items[index].value);
      } catch (err) { }
    }
    return <CustomList className="icon" items={items} renderHtml={true}></CustomList>;
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

    var doc_link = user.doc_links ? createUserDocLinkList(user.doc_links, this.id, false) : null;

    // 7c. @custom_user_info_by_cf - disply multi

    // @limit_field_of_study_2_before_deploy - comment
    // const field_study = !isCustomUserInfoOff(getCF(), "field_study") ? (
    //   <CustomList
    //     alignCenter={false}
    //     className="label"
    //     items={user.field_study.map((d, i) => d.val)}
    //   ></CustomList>
    // ) : null;

    const interested_role = !isCustomUserInfoOff(getCF(), "interested_role") && user.interested_role ? (
      <CustomList
        alignCenter={false}
        className="label"
        items={user.interested_role.map((d, i) => d.val)}
      ></CustomList>
    ) : null;

    const skill = !isCustomUserInfoOff(getCF(), "skill") && user.skill ? (
      <CustomList
        alignCenter={false}
        className="label"
        items={user.skill.map((d, i) => d.val)}
      ></CustomList>
    ) : null;

    const extracurricular = !isCustomUserInfoOff(getCF(), "extracurricular") && user.extracurricular ? (
      <CustomList
        alignCenter={false}
        className="label"
        items={user.extracurricular.map((d, i) => d.val)}
      ></CustomList>
    ) : null;

    const interested_job_location = !isCustomUserInfoOff(getCF(), "interested_job_location") && user.interested_job_location ? (
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

        {
          /** @limit_field_of_study_2_before_deploy - remove*/
          // !isCustomUserInfoOff(getCF(), "field_study") ?
          //   <PageSection
          //     alignCenter={false}
          //     className={pageClassName}
          //     title={this.getTitle("Field Of Study", "graduation-cap")}
          //     body={field_study}
          //   ></PageSection> : null
        }



        {!isCustomUserInfoOff(getCF(), "extracurricular") && extracurricular ?
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

    let multiViewElements = [];
    let popupItem = UserFieldHelper.getPopupItems(getCF(), "multi");
    for (let p of popupItem) {
      if (user[p.id] && Array.isArray(user[p.id])) {
        multiViewElements.push(
          <PageSection
            className={pageClassName}
            title={this.getTitle(p.label, p.icon)}
            body={<CustomList
              alignCenter={false}
              className="label"
              items={user[p.id].map((d, i) => d.val)}
            />}
          />
        )
      }
    }

    var rightBody = (
      <div>
        {(IsOnVideoResume && user.video_resume != null && user.video_resume.url) ? (
          <PageSection
            className={pageClassName}
            title={this.getTitle("Video Resume", "youtube-play")}
            body={createVideoDropbox(user.video_resume.url)}
          ></PageSection>
        ) : null}
        {doc_link ?
          <PageSection
            className={pageClassName}
            title={this.getTitle("Attachments", "file-text")}
            body={doc_link}
          ></PageSection> : null}
        {multiViewElements}
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

  getCustomViewMulti(d, pageClassName) {
    let ret = []
    let customKey = cfCustomFunnel({ action: "get_keys_for_popup" });
    for (let k of customKey) {
      let discard_popup_on = cfCustomFunnel({ action: "get_discard_popup_on_by_key", key: k });
      if (discard_popup_on) {
        if (discard_popup_on(d)) {
          continue;
        }
      }
      if (cfCustomFunnel({ action: "is_single", key: k })) {
        continue
      }
      if (!isCustomUserInfoOff(getCF(), k)) {
        let list = <CustomList
          alignCenter={false}
          className="label"
          items={d[k].map((d, i) => d.val)}
        ></CustomList>
        ret.push(<PageSection
          className={pageClassName}
          title={this.getTitle(
            lang(cfCustomFunnel({ action: "get_label_by_key", key: k })),
            cfCustomFunnel({ action: "get_icon_by_key", key: k })
          )}
          body={list}
        ></PageSection>);
      }
    }

    return ret
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
      height: '150px',
      backgroundImage: "url(" + data.banner_url + ")",
      backgroundSize: isInvalid(data.banner_size) ? "cover" : data.banner_size,
      backgroundRepeat: 'no-repeat',
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
    // return (
    //   <NavLink
    //     style={{ minWidth: "200px", margin: "7px" }}
    //     className="btn btn-blue btn-lg btn-round-10 "
    //     to={`${RootPath}/app/student-chat/${user.ID}`}
    //     onClick={e => {
    //       layoutActions.storeHideFocusCard();
    //     }}
    //   >
    //     <i className="fa fa-comments left"></i>{lang("Start Chat")}
    //   </NavLink>
    // );
    return (
      <a
        style={{ minWidth: "200px", margin: "7px" }}
        className="btn btn-blue btn-lg btn-round-10 "
        href={`${RootPath}/app/student-chat/${user.ID}`}
        target="_blank"
        onClick={e => {
          layoutActions.storeHideFocusCard();
        }}
      >
        <i className="fa fa-comments left"></i>{lang("Start Chat")}
      </a>
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
        {lang(getCfCustomMeta(CFSMeta.TEXT_SCHEDULE_CALL, `Schedule Call`))}
      </a>
    );
  }

  render() {

    const isStudent = this.props.role == UserEnum.ROLE_STUDENT;
    const isRecruiter = this.props.role == UserEnum.ROLE_RECRUITER;

    var id = null;
    var user = this.state.data;
    var view = null;
    if (this.state.loading) {
      view = <Loader size="3" text={lang("Loading Student Information...")}></Loader>;
    } else {
      var userBody = isStudent
        ? this.getStudentBody(user)
        : this.getRecruiterBody(user);

      var actionForRec = isStudent ? (
        <div style={{ marginTop: "10px", marginBottom: "18px" }}>
          {this.getStartChat(user)}
          {/* <span style={{ padding: "0px 5px" }}></span> */}
          {this.getScheduleCall(user)}
        </div>
      ) : null;

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
        (isStudent || isRecruiter) &&
        !this.props.isSessionPage
      ) {
        view = (
          <div className={this.props.isOnPage ? 'border border-solid border-slate-300 rounded-xl overflow-hidden mx-3 mt-10 my-6' : null}>
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
                {isStudent ?
                  [
                    <div className={`col-md-6 ${this.props.isOnPage ? 'px-10' : ''}`}>{userBody.left}</div>,
                    <div className={`col-md-6 ${this.props.isOnPage ? 'px-10' : ''}`}>{userBody.right}</div>
                  ]
                  : <div className={`col-md-12 ${this.props.isOnPage ? 'px-10 pb-10' : ''}`}>{userBody}</div>}
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
  isSessionPage: PropTypes.bool,
  isOnPage: PropTypes.bool,
};

UserPopup.defaultProps = {
  role: UserEnum.ROLE_STUDENT,
  isSessionPage: false,
  isOnPage: false,
};
