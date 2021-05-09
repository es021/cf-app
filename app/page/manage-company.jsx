import React, { Component } from "react";
import Form, {
  toggleSubmit,
  checkDiff,
  getDataCareerFair
} from "../component/form";
import { Uploader, FileType, uploadFile } from '../component/uploader';
import * as layoutActions from "../redux/actions/layout-actions";

import {
  Company,
  CompanyEnum,
} from "../../config/db-config";
import { ButtonLink } from "../component/buttons.jsx";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import obj2arg from "graphql-obj2arg";
import {
  getAuthUser,
  isRoleOrganizer,
  isRoleAdmin,
} from "../redux/actions/auth-actions";
import { Loader } from "../component/loader";
import ProfileCard, { getStyleBannerObj } from "../component/profile-card.jsx";
import SubNav from "../component/sub-nav";
import DocLinkPage from "../component/doc-link-form.jsx";
import PropTypes from "prop-types";
import { RootPath, AppPath, UploadUrl } from "../../config/app-config";
import Restricted from "./partial/static/restricted";
import { SessionsList } from "./partial/activity/session";
import { ResumeDrop } from "./partial/activity/resume-drop";

import { StudentListing } from "./partial/activity/student-listing.jsx";
import { ScheduledInterview } from "./partial/activity/scheduled-interview";
import ManageTag from "./tag";
import { lang } from "../lib/lang";
import ManageVacancy from "./manage-vacancy";

const PageUrl = `${RootPath}/app/manage-company/vacancy`;


//###################################################################################################
//###################################################################################################

class CompanyDocLink extends React.Component {
  render() {
    return (
      <DocLinkPage entity="company" id={this.props.company_id}></DocLinkPage>
    );
  }
}
CompanyDocLink.PropTypes = {
  company_id: PropTypes.number.isRequired
};

//###################################################################################################
//###################################################################################################

class AboutSubPage extends React.Component {
  constructor(props) {
    super(props);
    this.formOnSubmit = this.formOnSubmit.bind(this);

    this.uploaderOnChange = this.uploaderOnChange.bind(this);
    this.uploaderOnError = this.uploaderOnError.bind(this);
    this.uploaderOnSuccess = this.uploaderOnSuccess.bind(this);
    this.submitEditBanner = this.submitEditBanner.bind(this);

    this.state = {
      error: null,
      disableSubmit: false,
      init: true,
      data: null,

      new_banner_error: null,
      new_banner_file: null,
      new_banner_data: null,
      success: null
    };
  }

  getDataPriv() {
    let dataPriv = [
      { key: "0", label: "No Privilege" },
      {
        key: CompanyEnum.PRIV.ACCESS_ALL_STUDENT,
        label: "Access ALL Student Resume"
      },
      {
        key: CompanyEnum.PRIV.ACCESS_RS_PRE_EVENT,
        label: "Access Resume Drop BEFORE Event"
      },
      {
        key: CompanyEnum.PRIV.ACCESS_RS_DURING_EVENT,
        label: "Access Resume Drop DURING Event"
      },
      {
        key: CompanyEnum.PRIV.SCHEDULE_PRIVATE_SESSION,
        label: "Schedule 1-1 Session"
      }
    ];

    let allKeys = dataPriv.map((d, i) => {
      return d.key;
    });
    for (var i in CompanyEnum.PRIV) {
      if (allKeys.indexOf(CompanyEnum.PRIV[i]) <= -1) {
        dataPriv.push({
          key: CompanyEnum.PRIV[i],
          label: CompanyEnum.PRIV[i]
        });
      }
    }

    return dataPriv;
  }

  getBanner() {
    var data = this.state.data;
    var style = getStyleBannerObj(
      this.state.new_banner_data ? this.state.new_banner_data : data.banner_url,
      data.banner_size,
      data.banner_position,
      null,
      null
    );
    style.backgroundPosition = "center center";
    style.backgroundSize = "cover";
    style.height = "100%"

    let styleContainer = {
      margin: '10px 0px',
      display: "inline-block",
      width: "100%"
    };
    return [
      <div style={{
        ...styleContainer,
        height: "200px"
      }}>
        <div className="banner" style={style}></div>
      </div>,
    ];
  }

  componentWillMount() {
    this.company_id = this.props.company_id;

    var query = `query {
            company(ID:${this.company_id}) {
              ID
              name
              cf
              type
              tagline
              description
              more_info
              img_url
              img_position
              img_size
              banner_url
              banner_position
              banner_size
              priviledge
              status
              message_drop_resume
              group_url
              rec_privacy
              accept_prescreen
              sponsor_only
          }}`;

    getAxiosGraphQLQuery(query).then(res => {
      this.setState(() => {
        var com = res.data.data.company;
        com[Company.PRIVILEDGE] = CompanyEnum.parsePrivs(
          com[Company.PRIVILEDGE]
        );
        return { data: res.data.data.company, init: false };
      });
    });

    this.formItems = [];

    // for admin
    if (isRoleAdmin() || isRoleOrganizer()) {
      var dataCF = getDataCareerFair();
      dataCF.push({ key: "NONE", label: "No Career Fair" });

      this.formItems.push(
        ...[
          { header: "Admin Only" },
          {
            label: "Name",
            name: Company.NAME,
            type: "text",
            placeholder: "Company Name",
            required: true
          },
          {
            label: "Priviledge",
            name: Company.PRIVILEDGE,
            type: "checkbox",
            data: this.getDataPriv()
          },
          {
            label: "Type",
            name: Company.TYPE,
            type: "select",
            data: [
              {
                key: CompanyEnum.TYPE_NORMAL,
                label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_NORMAL)
              },
              {
                key: CompanyEnum.TYPE_GOLD,
                label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_GOLD)
              },
              {
                key: CompanyEnum.TYPE_SILVER,
                label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_SILVER)
              },
              {
                key: CompanyEnum.TYPE_BRONZE,
                label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_BRONZE)
              },
              {
                key: CompanyEnum.TYPE_PLATINUM,
                label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_PLATINUM)
              },
              {
                key: CompanyEnum.TYPE_SPECIAL,
                label: CompanyEnum.getTypeStr(CompanyEnum.TYPE_SPECIAL)
              }
            ],
            required: true
          },
          {
            label: "Career Fair",
            name: Company.CF,
            type: "checkbox",
            data: dataCF
          },
          {
            label: "Status",
            name: Company.STATUS,
            type: "select",
            data: [
              CompanyEnum.STS_OPEN,
              CompanyEnum.STS_CLOSED,
              CompanyEnum.STS_PS,
              CompanyEnum.STS_RD,
              CompanyEnum.STS_GS
            ],
            required: true
          },
          {
            label: "Group Session Url",
            sublabel: `Please make sure status has been set to '${CompanyEnum.STS_GS}'`,
            name: Company.GROUP_URL,
            type: "text",
            placeholder: "Enter Zoom Url Here"
          },
          {
            label: "Is Sponsor Only?",
            sublabel: "Sponsor only company will have NO booth in job fair",
            name: Company.SPONSOR_ONLY,
            type: "radio",
            required: true,
            data: [{ key: 1, label: "Yes" }, { key: 0, label: "No" }]
          },
          {
            label: "Accept Prescreen?",
            name: Company.ACCEPT_PRESCREEN,
            type: "radio",
            required: true,
            data: [{ key: 1, label: "Yes" }, { key: 0, label: "No" }]
          }
        ]
      );
    }

    this.formItems.push(
      ...[
        { header: "Basic Information" },
        {
          label: "Tagline",
          name: Company.TAGLINE,
          type: "text",
          placeholder: "Company Tagline"
        },
        {
          label: "Description",
          name: Company.DESCRIPTION,
          type: "textarea",
          rows: 6,
          placeholder: "Tell more about your company"
        },
        {
          label: "Additional Information",
          name: Company.MORE_INFO,
          type: "textarea",
          rows: 6,
          placeholder:
            "Anything you might want the student to know about the company. Upcoming events, benefits. culture, etc."
        },
        { header: "Advanced Settings" },
        {
          label: "Custom Message After Drop Resume",
          name: Company.MESSAGE_DROP_RESUME,
          type: "textarea",
          rows: 6,
          placeholder:
            "Write down custom message for students after they drop their resume"
        },
        {
          label: "Recruiter Information",
          name: Company.REC_PRIVACY,
          type: "radio",
          required: true,
          data: [
            { key: CompanyEnum.REC_PRIVACY_PUBLIC, label: "Public" },
            { key: CompanyEnum.REC_PRIVACY_PRIVATE, label: "Private" }
          ]
        }
      ]
    );
  }

  //return string if there is error
  filterForm(d) {
    return 0;
  }

  formOnSubmit(d) {
    var err = this.filterForm(d);
    if (err === 0) {
      toggleSubmit(this, { error: null, success: null });
      var update = checkDiff(
        this,
        this.state.data,
        d,
        [],
        [Company.PRIVILEDGE]
      );
      if (update === false) {
        return;
      }

      // fix priviledge
      update[Company.PRIVILEDGE] = JSON.stringify(update[Company.PRIVILEDGE]);

      update[Company.ID] = this.company_id;
      if (typeof update[Company.TYPE] !== "undefined") {
        update[Company.TYPE] = Number.parseInt(update[Company.TYPE]);
      }

      var edit_query = `mutation{edit_company(${obj2arg(update, {
        noOuterBraces: true
      })}) {ID}}`;
      getAxiosGraphQLQuery(edit_query).then(
        res => {
          var newData = Object.assign(this.state.data, d);
          toggleSubmit(this, {
            data: newData,
            error: null,
            success: "Your Change Has Been Saved!"
          });
        },
        err => {
          toggleSubmit(this, { error: err.response.data });
        }
      );
    } else {
      //console.log("Err", err);
      this.setState(() => {
        return { error: err };
      });
    }
  }

  uploaderOnChange(file) {
    console.log("uploaderOnChange");
    toggleSubmit(this, { new_banner_error: null, new_banner_file: null, new_banner_data: null, });
  }

  uploaderOnError(err) {
    console.log("uploaderOnError");
    toggleSubmit(this, { new_banner_error: err, new_banner_file: null, new_banner_data: null, });
  }

  uploaderOnSuccess(file) {
    toggleSubmit(this, { new_banner_error: null });
    var reader = new FileReader();
    reader.onload = (e) => {
      this.setState(() => {
        return { new_banner_data: e.target.result, new_banner_file: file, new_banner_error: null };
      });
    }
    reader.readAsDataURL(file);
  }


  submitEditBanner(event) {
    event.preventDefault();
    if (this.state.new_banner_file !== null) {
      var fileName = `banner-${this.company_id}`;
      layoutActions.loadingBlockLoader();
      uploadFile(this.state.new_banner_file, FileType.IMG, fileName).then((res) => {
        let banner_url = res.data.url;
        console.log("banner_url", banner_url);
        if (banner_url !== null) {
          let update = {}
          update["ID"] = this.company_id;
          update["banner_url"] = `${UploadUrl}/${banner_url}`;
          update["banner_position"] = "center center";
          update["banner_size"] = "cover";
          let edit_query = `mutation{
            edit_company(${obj2arg(update, { noOuterBraces: true })}) {
                banner_url
                banner_position
                banner_size
            }}`;
          getAxiosGraphQLQuery(edit_query).then((res) => {
            layoutActions.storeHideBlockLoader();
            layoutActions.successBlockLoader(<div>
              <br></br>
              <b>Banner successfully updated.</b>
            </div>)
          }, (err) => {
            layoutActions.storeHideBlockLoader();
            layoutActions.errorBlockLoader(<div>
              <br></br>
              <b>{err.response.data}</b>
            </div>)
          });
        }
      });
    }
  }

  render() {
    var content = null;
    if (this.state.init) {
      content = <Loader size="2" text="Loading Company Information"></Loader>;
    } else {
      content = (
        <div>
          {/* <ProfileCard
            type="banner"
            customStyleParent={{ margin: "auto" }}
            custom_width={BANNER_WIDTH + "px"}
            id={this.state.data.ID}
            add_img_ops={true}
            img_url={this.state.data.banner_url}
            img_pos={this.state.data.banner_position}
            img_size={this.state.data.banner_size}
          ></ProfileCard> */}

          <div style={{ marginTop: "" }}>
            <ProfileCard
              type="company"
              img_dimension={"130px"}
              id={this.state.data.ID}
              add_img_ops={true}
              title={<h3>{this.state.data.name}</h3>}
              subtitle={""}
              img_url={this.state.data.img_url}
              img_pos={this.state.data.img_position}
              img_size={this.state.data.img_size}
            ></ProfileCard>
            <div>
              <form>
                <div className="form-header">Banner</div>
                <Uploader label={lang("Upload A New Banner")} name="banner"
                  type={FileType.IMG} onSuccess={this.uploaderOnSuccess}
                  onChange={this.uploaderOnChange} onError={this.uploaderOnError}></Uploader>
                <div style={{ color: 'red' }}>{this.state.new_banner_error}</div>
                <div>
                  {this.getBanner()}
                  {!this.state.new_banner_file ? null :
                    <div className="text-center"><button className="btn btn-primary btn-sm" onClick={this.submitEditBanner}>Update Banner</button></div>
                  }
                  <br />
                  <br />
                </div>
              </form>
            </div>
            <Form
              className="form-row"
              items={this.formItems}
              onSubmit={this.formOnSubmit}
              submitText="Save Changes"
              defaultValues={this.state.data}
              disableSubmit={this.state.disableSubmit}
              error={this.state.error}
              success={this.state.success}
            ></Form>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h3>Edit Company</h3>
        {content}
      </div>
    );
  }
}

AboutSubPage.PropTypes = {
  company_id: PropTypes.number.isRequired
};

// For Recruiter ------------------------------------------------------/

export default class ManageCompanyPage extends React.Component {
  componentWillMount() {
    this.key = 1;
  }

  getSubNavItem() {
    this.sub_page = this.props.match.params.current
      ? this.props.match.params.current
      : "about";
    this.company_id = Number.parseInt(this.props.match.params.id);
    var item = {
      about: {
        label: "Edit Company",
        component: AboutSubPage,
        props: { company_id: this.company_id },
        icon: "building"
      },
      vacancy: {
        label: "Manage Job Post",
        component: ManageVacancy,
        props: { company_id: this.company_id },
        // routeOnly: isRoleRec(),
        icon: "suitcase"
      },
      "tag": {
        label: "Manage Tags",
        component: ManageTag,
        props: { entity: "company", entity_id: this.company_id },
        icon: "slack"
      },
      "doc-link": {
        label: "Manage Document & Link",
        component: CompanyDocLink,
        props: { company_id: this.company_id },
        icon: "file-text"
      },
      view: {
        label: "View Company",
        onClick: () => {
          this.props.history.push(`${AppPath}/company/${this.company_id}`);
          // layoutActions.storeUpdateFocusCard("My Company", CompanyPopup, {
          //     id: this.company_id
          // });
        },
        component: null,
        icon: "eye"
      },
    };

    if (isRoleAdmin()) {
      item["student-listing"] = {
        label: "Student Listing",
        component: StudentListing,
        props: {
          title: "Student Listing",
          company_id: this.company_id
        },
        icon: "users"
      };
      //.. kita tak payah guna ni sebab kita boleh guna priviledge ACCESS_ALL_STUDENT untuk contol kat page student listing
      item["all-student"] = {
        label: "All Student",
        component: StudentListing,
        props: {
          title: "All Student",
          company_id: this.company_id,
          isAllStudent: true
        },
        icon: "address-book-o"
      };
      item["session"] = {
        label: "Past Sessions",
        component: SessionsList,
        props: {
          company_id: this.company_id,
          student_id: this.student_id,
          isRec: true
        },
        icon: "comments"
      };
      item["resume-drop"] = {
        label: "Resume Drop",
        component: ResumeDrop,
        props: {
          company_id: this.company_id,
          student_id: this.student_id,
          isRec: true
        },
        icon: "download"
      };
      item["pre-screen"] = {
        label: "Pre-Screen",
        component: ScheduledInterview,
        props: { company_id: this.company_id, prescreen_only: true },
        icon: "filter"
      };
      item["scheduled-interview"] = {
        label: "Scheduled Interview",
        component: ScheduledInterview,
        props: { company_id: this.company_id },
        icon: "clock-o"
      };
    }

    var title = item[this.sub_page].label;
    document.setTitle(title);

    return item;
  }

  render() {
    if (this.company_id !== this.props.match.params.id) {
      this.key++;
    }

    // updated prop in here
    var item = this.getSubNavItem();

    if (
      !isRoleAdmin() &&
      !isRoleOrganizer() &&
      this.company_id != getAuthUser().rec_company
    ) {
      return (
        <Restricted
          title="Restricted Page"
          message="You Are Not Allowed Here"
        ></Restricted>
      );
    }

    return (
      <div key={this.key}>
        <SubNav
          route={`manage-company/${this.company_id}`}
          items={item}
          defaultItem={this.sub_page}
        ></SubNav>
      </div>
    );
  }
}
