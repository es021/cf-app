import React, { PropTypes } from "react";
import { NavLink } from "react-router-dom";
import GeneralFormPage from "../../../component/general-form";
import { ButtonExport } from "../../../component/buttons.jsx";

import * as layoutActions from "../../../redux/actions/layout-actions";
import {
  isComingSoon,
  isRoleRec,
  isRoleStudent,
  getCF
} from "../../../redux/actions/auth-actions";
import UserPopup from "../popup/user-popup";
//importing for list
import List, { CustomList, ProfileListWide } from "../../../component/list";
import { getImageObj } from "../../../component/profile-card.jsx";
import { Loader } from "../../../component/loader";
import { getAxiosGraphQLQuery } from "../../../../helper/api-helper";
import { Time } from "../../../lib/time";
import { createUserTitle } from "../../users";
import {
  openSIFormNew,
  openSIFormAnytime
} from "../../partial/activity/scheduled-interview";
import { createUserDocLinkList } from "../popup/user-popup";
import { openFeedbackBlockRec } from "../analytics/feedback";
import {
  CompanyEnum,
  UserEnum,
  PrescreenEnum
} from "../../../../config/db-config";
import {
  Month,
  Year,
  Country,
  getMonthLabel
} from "../../../../config/data-config";

import Tooltip from "../../../component/tooltip";

export class StudentListingCard extends React.Component {
  constructor(props) {
    super(props);
    this.openSIForm = this.openSIForm.bind(this);
    this.toggleShowMore = this.toggleShowMore.bind(this);
    this.state = {
      isShowMore: false
    };
  }

  openSIForm(student_id) {
    openSIFormAnytime(student_id, this.props.company_id);
    //openSIFormNew(student_id, this.props.company_id);
  }

  toggleShowMore() {
    this.setState(prevState => {
      return {
        isShowMore: !prevState.isShowMore
      };
    });
  }

  notSpecifiedView(entity) {
    return (
      <div className="text-muted">
        <i>{entity} Not Specifed</i>
      </div>
    );
  }

  render() {
    var i = this.props.index;
    var d = this.props.data;
    var search = this.props.search;

    var title = createUserTitle(d.student, search.search_student, true);

    // create uni view
    let uniView = this.notSpecifiedView("University");
    if (d.student.university != null && d.student.university != "") {
      uniView = <b>{d.student.university}</b>;
    }

    // create place view
    // let placeView = null;
    // if (d.student.study_place != null && d.student.study_place != "") {
    //   placeView = <small>, {d.student.study_place}</small>;
    // }
    let placeView = null;
    if (d.student.country_study != null && d.student.country_study != "") {
      placeView = <small>, {d.student.country_study}</small>;
    }

    // create major view
    // let majors = null;
    // let majorView = this.notSpecifiedView("Major");
    // try {
    //   majors = JSON.parse(d.student.major);
    // } catch (err) {
    //   majors = null;
    // }
    // if (Array.isArray(majors)) {
    //   majorView = majors.map((d, i) => {
    //     if (i % 2 == 0) {
    //       return <span>{d}</span>;
    //     } else {
    //       return <span>, {d}</span>;
    //     }
    //   });

    //   if (majors.length > 0) {
    //     majorView = (
    //       <i>
    //         <br />
    //         {majorView}
    //       </i>
    //     );
    //   }
    // }
    let fieldStudyView = this.notSpecifiedView("Major");
    let field_study = d.student.field_study;
    if (Array.isArray(field_study)) {
      fieldStudyView = field_study.map((d, i) => {
        if (i % 2 == 0) {
          return <span>{d.val}</span>;
        } else {
          return <span>, {d.val}</span>;
        }
      });

      if (field_study.length > 0) {
        fieldStudyView = (
          <i>
            <br />
            {fieldStudyView}
          </i>
        );
      }
    }

    var labelView = null;
    let lookingForView = [];
    var hasLookFor =
      Array.isArray(d.student.looking_for_position) &&
      d.student.looking_for_position.length >= 0;
    if (hasLookFor) {
      for (var i in d.student.looking_for_position) {
        let lfp = d.student.looking_for_position[i];
        lfp = lfp.val;
        var labelType = "";
        switch (lfp) {
          case UserEnum.LOOK_FOR_FULL_TIME:
            labelType = "success";
            break;
          case UserEnum.LOOK_FOR_PART_TIME:
            labelType = "danger";
            break;
          case UserEnum.LOOK_FOR_INTERN:
            labelType = "warning";
            break;
        }

        lookingForView.push(
          <Tooltip
            bottom="19px"
            left="-19px"
            width="114px"
            alignCenter={true}
            content={
              <label
                style={{ marginRight: "5px" }}
                className={`label label-${labelType}`}
              >
                {lfp}
              </label>
            }
            tooltip="Looking For"
          />
        );
      }

      labelView = (
        <div style={{ fontSize: "16px", margin: "6px 0px" }}>
          {lookingForView}
        </div>
      );
    }

    var scheduledView = null;
    if (d.student.prescreens_for_student_listing.length > 0) {
      // find index yang tak DONE lagi
      let baIndex = 0;
      for (var ba in d.student.prescreens_for_student_listing) {
        baIndex = ba;
        let tempObj = d.student.prescreens_for_student_listing[ba];
        let psStatus = tempObj.status != null ? tempObj.status : null;
        if (psStatus != null && psStatus != PrescreenEnum.STATUS_DONE) {
          break;
        }
      }

      // find yang tak DONE lagi
      let tempObj = d.student.prescreens_for_student_listing[baIndex];
      let psStatus = tempObj.status != null ? tempObj.status : null;
      scheduledView = (
        <div style={{ marginBottom: "8px", marginTop: "0px" }}>
          <label className={`label label-success label-custom`}>
            {psStatus == PrescreenEnum.STATUS_STARTED
              ? "Session Created on "
              : "Scheduled Interview on "}
            <b>{Time.getString(tempObj.appointment_time)}</b>
          </label>
        </div>
      );
    }
    // var scheduledView = null;
    // if (d.student.booked_at.length > 0) {

    //   // find index yang tak DONE lagi
    //   let baIndex = 0;
    //   for (var ba in d.student.booked_at) {
    //     baIndex = ba;
    //     let tempObj = d.student.booked_at[ba];
    //     let psStatus = (tempObj.prescreen != null) ? tempObj.prescreen.status : null;
    //     if (psStatus != null && psStatus != PrescreenEnum.STATUS_DONE) {
    //       break;
    //     }
    //   }

    //   // find yang tak DONE lagi
    //   let tempObj = d.student.booked_at[baIndex];
    //   let psStatus = (tempObj.prescreen != null) ? tempObj.prescreen.status : null;
    //   scheduledView = <div style={{ marginBottom: "8px", marginTop: "0px" }}>
    //     <label
    //       className={`label label-success label-custom`}>
    //       {psStatus == PrescreenEnum.STATUS_DONE ? "Session Created on " : "Scheduled Interview on "}
    //       <b>{Time.getString(tempObj.timestamp)}</b>
    //     </label>
    //   </div>
    // }

    // title = (
    //   <div>
    //     {title} {lookingForView}
    //   </div>
    // );

    let studentInfo = (
      <div style={{ lineHeight: "17px" }}>
        {scheduledView}
        {labelView}
        {uniView}
        {placeView}
        {fieldStudyView}
      </div>
    );

    var styleToggler = { marginLeft: "-12px", marginBottom: "-10px" };
    var description = null;
    if (d.student.description !== null && d.student.description != "") {
      if (!this.state.isShowMore) {
        description = (
          <div style={styleToggler}>
            <a onClick={this.toggleShowMore} className="btn btn-link">
              See More About This Student ...
            </a>
          </div>
        );
      } else {
        description = (
          <p style={{ marginTop: "7px" }}>
            <b>
              <u>About {d.student.first_name}</u>
            </b>
            <br />
            <small>{d.student.description}</small>
            <br />
            <div style={styleToggler}>
              <a onClick={this.toggleShowMore} className="btn btn-link">
                See Less
              </a>
            </div>
          </p>
        );
      }
    }

    var details = (
      <div>
        {studentInfo}
        <div style={{ marginTop: "8px" }}>
          {createUserDocLinkList(
            d.student.doc_links,
            d.student_id,
            false,
            false,
            false,
            true
          )}
        </div>
        {description}
      </div>
    );

    //var imgObj = getImageObj(d.student);

    var canSchedule = CompanyEnum.hasPriv(
      this.props.privs,
      CompanyEnum.PRIV.SCHEDULE_PRIVATE_SESSION
    );
    const actionHandler = () => {
      if (canSchedule) {
        this.openSIForm(d.student.ID);
      } else {
        // EUR FIX
        // See Availability
        layoutActions.errorBlockLoader(
          "Opps.. It seems that you don't have privilege to see student's availability yet."
        );
      }
    };

    // EUR FIX
    // Schedule For Call -> See Availability
    // img_url={imgObj.img_url}
    // img_pos={imgObj.img_pos}
    // img_size={imgObj.img_size}
    // img_dimension={"80px"}
    var item = (
      <ProfileListWide
        is_no_image={true}
        title={title}
        body={details}
        action_text={
          <small>
            <i className="fa fa-video-camera left" />
            Schedule Call
          </small>
        }
        action_handler={actionHandler}
        action_disabled={false}
        type={this.props.isRec ? "student" : "company"}
        key={i}
      />
    );

    return item;
  }
}

StudentListingCard.propTypes = {
  company_id: PropTypes.number,
  data: PropTypes.object,
  index: PropTypes.number,
  isRec: PropTypes.bool,
  search: PropTypes.object,
  privs: PropTypes.object
};

export class StudentListing extends React.Component {
  constructor(props) {
    super(props);
    this.getContentBelowFilter = this.getContentBelowFilter.bind(this);
    this.state = {
      search: {},
      loadPriv: true,
      privs: []
    };
  }

  loadPriv() {
    var q = `query {company(ID:${this.props.company_id}) { priviledge name } }`;
    getAxiosGraphQLQuery(q).then(res => {
      var privs = res.data.data.company.priviledge;
      this.privs = privs;
      this.setState(prevState => {
        var companyName = res.data.data.company.name;
        if (privs == null) {
          privs = "";
        }
        console.log("[StudentListing]", privs);
        return {
          loadPriv: false,
          privs: privs,
          companyName: companyName
        };
      });
    });
  }

  componentWillMount() {
    openFeedbackBlockRec();

    this.loadPriv();

    this.offset = 10;
    //##########################################
    //  search
    this.searchParams = "";
    this.search = {};
    this.searchFormItem = null;

    if (this.props.isRec) {
      this.searchFormItem = [];
      this.searchFormItem.push({ header: "Find Student" });
      this.searchFormItem.push({
        label: "By Name Or Email",
        name: "search_student",
        type: "text",
        placeholder: "John Doe"
      });

      this.searchFormItem.push({
        label: "By Field Of Study",
        name: "search_field_study",
        type: "text",
        placeholder: "Software Engineering"
      });

      this.searchFormItem.push({
        label: "By Study Place",
        name: "search_country_study",
        type: "text",
        placeholder: "Malaysia"
      });

      this.searchFormItem.push({
        label: "By Looking For Position",
        name: "search_looking_for",
        type: "select",
        data: [
          "",
          UserEnum.LOOK_FOR_FULL_TIME,
          UserEnum.LOOK_FOR_PART_TIME,
          UserEnum.LOOK_FOR_INTERN
        ]
      });
    }

    this.searchParamGet = (key, val) => {
      return val != "" && typeof val !== "undefined" && val != null
        ? `${key}:"${val}",`
        : "";
    };

    this.searchFormOnSubmit = d => {
      this.search = d;
      this.searchParams = "";

      if (d != null) {
        this.searchParams += this.searchParamGet(
          "search_student",
          d.search_student
        );
        this.searchParams += this.searchParamGet(
          "search_field_study",
          d.search_field_study
        );
        this.searchParams += this.searchParamGet(
          "search_country_study",
          d.search_country_study
        );
        this.searchParams += this.searchParamGet(
          "search_looking_for",
          d.search_looking_for
        );
      }
      console.log("searchFormOnSubmit");
      this.setState(prevState => {
        console.log("setState searchFormOnSubmit", prevState);
        return { search: d };
      });
    };

    this.renderRow = (d, i) => {
      return (
        <StudentListingCard
          company_id={this.props.company_id}
          privs={this.privs}
          // privs={this.state.privs}
          data={d}
          index={i}
          isRec={this.props.isRec}
          search={this.search}
        />
      );
    };

    // TODO
    // prescreens_for_student_listing{status appointment_time}
    // university study_place major available_month available_year
    // ID first_name last_name user_email description looking_for
    // doc_links { type label url }
    this.loadData = (page, offset) => {
      let companyIdInq = this.getCompanyIdQuery();
      var query = `query{
          student_listing(${this.searchParams} company_id:${companyIdInq}, 
          cf:"${this.getCfStr()}", page: ${page}, offset:${offset}) 
          {
            student_id
            created_at
            student{
                prescreens_for_student_listing{status appointment_time}
                university country_study available_month available_year
                ID first_name last_name user_email description 
                doc_links { type label url } field_study{val} looking_for_position{val}
      }}}`;

      return getAxiosGraphQLQuery(query);
    };

    this.getDataFromRes = res => {
      return res.data.data.student_listing;
    };
  }

  getCompanyIdQuery() {
    let toRet = this.props.isAllStudent ? -1 : this.props.company_id;

    let cfs = this.getCfAccessAllStudent();
    if (cfs.length > 0) {
      toRet = -1;
    }

    return toRet;
  }
  getCfAccessAllStudent() {
    let r = [];
    if (CompanyEnum.hasPriv(this.privs, CompanyEnum.PRIV.AAS_MDC)) {
      r.push("MDC");
    }
    if (CompanyEnum.hasPriv(this.privs, CompanyEnum.PRIV.AAS_ANE)) {
      r.push("ANE");
    }
    if (CompanyEnum.hasPriv(this.privs, CompanyEnum.PRIV.AAS_EUR)) {
      r.push("EUR");
    }
    if (CompanyEnum.hasPriv(this.privs, CompanyEnum.PRIV.AAS_NZL)) {
      r.push("NZL");
    }

    if (r.length >= 0) {
      r.push(getCF());
    }
    
    return r;
  }

  getCfStr() {
    let cfs = this.getCfAccessAllStudent();
    let cfStr = "";
    if (Array.isArray(cfs) && cfs.length > 0) {
      cfs.map((d, i) => {
        console.log(d);
        cfStr += (i > 0 ? "," : "") + d;
      });
    } else {
      cfStr = getCF();
    }

    return cfStr;
  }
  getContentBelowFilter() {
    let label = `Export ${this.props.title}`;
    return (
      <ButtonExport
        action="student_listing"
        text={label}
        filter={{
          company_id: this.getCompanyIdQuery(),
          cf: this.getCfStr(),
          for_rec: "1"
        }}
      ></ButtonExport>
    );
  }
  render() {
    var view = null;
    if (this.state.loadPriv) {
      view = <Loader size="2" text="Loading..." />;
    } else {
      var hide = false;
      if (isRoleRec() || isRoleStudent()) {
        if (this.props.isAllStudent) {
          hide = !CompanyEnum.hasPriv(
            this.privs,
            CompanyEnum.PRIV.ACCESS_ALL_STUDENT
          );
        } else {
          if (isComingSoon()) {
            hide = !CompanyEnum.hasPriv(
              this.privs,
              CompanyEnum.PRIV.ACCESS_RS_PRE_EVENT
            );
          } else {
            hide = !CompanyEnum.hasPriv(
              this.privs,
              CompanyEnum.PRIV.ACCESS_RS_DURING_EVENT
            );
          }
        }
      }

      view = hide ? (
        <div>
          <h4>
            <i className="fa fa-3x fa-frown-o" />
            <br />
            <br />
            Opss.. It seems that <b>{this.state.companyName}</b> does not have
            access to this page yet.
          </h4>
        </div>
      ) : (
        <GeneralFormPage
          hasResetFilter={true}
          contentBelowFilter={this.getContentBelowFilter()}
          entity_singular={"Student"}
          dataTitle={this.dataTitle}
          noMutation={true}
          dataOffset={this.offset}
          searchFormItem={this.searchFormItem}
          searchFormOnSubmit={this.searchFormOnSubmit}
          renderRow={this.renderRow}
          getDataFromRes={this.getDataFromRes}
          loadData={this.loadData}
        />
      );
    }

    let title = this.props.title;
    document.setTitle(title);

    return (
      <div>
        <h2>{title}</h2>
        {view}
      </div>
    );
  }
}

StudentListing.propTypes = {
  company_id: PropTypes.number.isRequired,
  isRec: PropTypes.bool,
  isAllStudent: PropTypes.bool,
  title: PropTypes.string
};

StudentListing.defaultProps = {
  isRec: true,
  isAllStudent: false,
  title: null
};
