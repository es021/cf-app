import React, { PropTypes } from "react";
import { NavLink } from "react-router-dom";
import GeneralFormPage from "../../../component/general-form";
import * as layoutActions from "../../../redux/actions/layout-actions";
import {
  isComingSoon,
  isRoleRec,
  isRoleStudent
} from "../../../redux/actions/auth-actions";
import UserPopup from "../popup/user-popup";
//importing for list
import List, { CustomList, ProfileListWide } from "../../../component/list";
import { getImageObj } from "../../../component/profile-card";
import { Loader } from "../../../component/loader";
import { getAxiosGraphQLQuery } from "../../../../helper/api-helper";
import { Time } from "../../../lib/time";
import { createUserTitle } from "../../users";
import { openSIFormNew } from "../../partial/activity/scheduled-interview";
import { createUserDocLinkList } from "../popup/user-popup";
import { openFeedbackBlockRec } from "../analytics/feedback";
import { CompanyEnum, UserEnum } from "../../../../config/db-config";
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
    openSIFormNew(student_id, this.props.company_id);
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
    let placeView = null;
    if (d.student.study_place != null && d.student.study_place != "") {
      placeView = <small>, {d.student.study_place}</small>;
    }

    // create major view
    let majors = null;
    let majorView = this.notSpecifiedView("Major");
    try {
      majors = JSON.parse(d.student.major);
    } catch (err) {
      majors = null;
    }
    if (Array.isArray(majors)) {
      majorView = majors.map((d, i) => {
        if (i % 2 == 0) {
          return <span>{d}</span>;
        } else {
          return <span>, {d}</span>;
        }
      });

      if (majors.length > 0) {
        majorView = (
          <i>
            <br />
            {majorView}
          </i>
        );
      }
    }

    var labelView = null;
    var hasLookFor =
      d.student.looking_for != null && d.student.looking_for != "";
    var hasAvailable =
      d.student.available_month != null && d.student.available_month != "";
    if (hasLookFor || hasAvailable) {
      var lookingForView = null;
      var availableView = null;

      if (hasLookFor) {
        var labelType =
          d.student.looking_for == UserEnum.LOOK_FOR_FULL_TIME
            ? "success"
            : "danger";

        lookingForView = (
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
                {d.student.looking_for}
              </label>
            }
            tooltip="Looking For"
          />
        );
      }

      if (hasAvailable) {
        // availableView = (
        //   <Tooltip
        //     bottom="19px"
        //     left="-5px"
        //     width="114px"
        //     alignCenter={true}
        //     content={
        //       <label className={`label label-default`}>
        //         {d.student.available_month + " " + d.student.available_year}
        //       </label>
        //     }
        //     tooltip="Work Availability"
        //   />
        // );

        availableView = <label className={`label label-default`}>
          Availability : {d.student.available_month + " " + d.student.available_year}
        </label>;
      }

      labelView = (
        <div style={{ fontSize: "16px", margin: "6px 0px" }}>
          {lookingForView}
          {availableView}
        </div>
      );
    }

    // title = (
    //   <div>
    //     {title} {lookingForView}
    //   </div>
    // );

    let studentInfo = (
      <div style={{ lineHeight: "17px" }}>
        {labelView}
        {uniView}
        {placeView}
        {majorView}
      </div>
    );

    var styleToggler = { marginLeft: "-12px", marginBottom: "-10px" };
    var description = null;
    if (d.student.description !== null && d.student.description != "") {
      if (!this.state.isShowMore) {
        description = (
          <div style={styleToggler}>
            <a onClick={this.toggleShowMore} className="btn btn-link">
              See More
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
          {createUserDocLinkList(d.student.doc_links, d.student_id, false)}
        </div>
        {description}
      </div>
    );

    //var imgObj = getImageObj(d.student);

    var canSchedule = CompanyEnum.hasPriv(
      this.state.privs,
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
            <i className="fa fa-clock-o left" />
            See Availability
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
  data: PropTypes.object,
  index: PropTypes.number,
  isRec: PropTypes.bool,
  search: PropTypes.object
};

export class StudentListing extends React.Component {
  constructor(props) {
    super(props);
    //this.openSIForm = this.openSIForm.bind(this);

    this.state = {
      loadPriv: true,
      privs: []
    };
  }

  loadPriv() {
    var q = `query {company(ID:${this.props.company_id}) { priviledge name } }`;
    getAxiosGraphQLQuery(q).then(res => {
      this.setState(prevState => {
        var privs = res.data.data.company.priviledge;
        var companyName = res.data.data.company.name;
        if (privs == null) {
          privs = "";
        }
        return { loadPriv: false, privs: privs, companyName: companyName };
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
      this.searchFormItem.push({ header: "Enter Your Search Query" });
      this.searchFormItem.push({
        label: "Find Student",
        name: "search_student",
        type: "text",
        placeholder: "Type student name or email"
      });
    }

    this.searchFormOnSubmit = d => {
      this.search = d;
      this.searchParams = "";
      if (d != null) {
        this.searchParams +=
          d.search_student != "" ? `search_student:"${d.search_student}",` : "";
      }
    };

    this.renderRow = (d, i) => {
      return (
        <StudentListingCard
          data={d}
          index={i}
          isRec={this.props.isRec}
          search={this.search}
        />
      );

      //   var title = createUserTitle(d.student, this.search.search_student, true);

      //   // create uni view
      //   let uniView = this.notSpecifiedView("University");
      //   if (d.student.university != null && d.student.university != "") {
      //     uniView = <b>{d.student.university}</b>;
      //   }

      //   // create place view
      //   let placeView = null;
      //   if (d.student.study_place != null && d.student.study_place != "") {
      //     placeView = <small>, {d.student.study_place}</small>;
      //   }

      //   // create major view
      //   let majors = null;
      //   let majorView = this.notSpecifiedView("Major");
      //   try {
      //     majors = JSON.parse(d.student.major);
      //   } catch (err) {
      //     majors = null;
      //   }
      //   if (Array.isArray(majors)) {
      //     majorView = majors.map((d, i) => {
      //       if (i % 2 == 0) {
      //         return <span>{d}</span>;
      //       } else {
      //         return <span>, {d}</span>;
      //       }
      //     });

      //     if (majors.length > 0) {
      //       majorView = (
      //         <i>
      //           <br />
      //           {majorView}
      //         </i>
      //       );
      //     }
      //   }

      //   let studentInfo = (
      //     <div style={{ lineHeight: "17px" }}>
      //       {uniView}
      //       {placeView}
      //       {majorView}
      //     </div>
      //   );

      //   var description =
      //     d.student.description !== null && d.student.description != "" ? (
      //       <p style={{ marginTop: "7px" }}>
      //         <b>
      //           <u>About {d.student.first_name}</u>
      //         </b>
      //         <br />
      //         <small>{d.student.description}</small>
      //         <br />
      //         <div style={{ marginLeft: "-12px" }}>
      //           <a className="btn btn-link">See Less</a>
      //         </div>
      //       </p>
      //     ) : null;

      //   var details = (
      //     <div>
      //       {studentInfo}
      //       <div style={{ marginTop: "8px" }}>
      //         {createUserDocLinkList(d.student.doc_links, d.student_id, false)}
      //       </div>
      //       {description}
      //     </div>
      //   );

      //   //var imgObj = getImageObj(d.student);

      //   var canSchedule = CompanyEnum.hasPriv(
      //     this.state.privs,
      //     CompanyEnum.PRIV.SCHEDULE_PRIVATE_SESSION
      //   );
      //   const actionHandler = () => {
      //     if (canSchedule) {
      //       this.openSIForm(d.student.ID);
      //     } else {
      //       // EUR FIX
      //       // See Availability
      //       layoutActions.errorBlockLoader(
      //         "Opps.. It seems that you don't have privilege to see student's availability yet."
      //       );
      //     }
      //   };

      //   // EUR FIX
      //   // Schedule For Call -> See Availability
      //   // img_url={imgObj.img_url}
      //   // img_pos={imgObj.img_pos}
      //   // img_size={imgObj.img_size}
      //   // img_dimension={"80px"}
      //   var item = (
      //     <ProfileListWide
      //       is_no_image={true}
      //       title={title}
      //       body={details}
      //       action_text={
      //         <small>
      //           <i className="fa fa-clock-o left" />
      //           See Availability
      //         </small>
      //       }
      //       action_handler={actionHandler}
      //       action_disabled={false}
      //       type={this.props.isRec ? "student" : "company"}
      //       key={i}
      //     />
      //   );

      //   return item;
    };

    this.loadData = (page, offset) => {
      var query = `query{
                student_listing(${this.searchParams} company_id:${
        this.props.company_id
        }, page: ${page}, offset:${offset}) {
                    student_id
                    created_at
                    student{
                        university study_place major available_month available_year
                        ID first_name last_name user_email description looking_for
                        doc_links { type label url }
            }}}`;
      // img_url img_pos img_size

      return getAxiosGraphQLQuery(query);
    };

    this.getDataFromRes = res => {
      return res.data.data.student_listing;
    };
  }

  render() {
    var view = null;
    if (this.state.loadPriv) {
      view = <Loader size="2" text="Loading..." />;
    } else {
      var hide = false;

      if (isRoleRec() || isRoleStudent()) {
        if (isComingSoon()) {
          hide = !CompanyEnum.hasPriv(
            this.state.privs,
            CompanyEnum.PRIV.ACCESS_RS_PRE_EVENT
          );
        } else {
          hide = !CompanyEnum.hasPriv(
            this.state.privs,
            CompanyEnum.PRIV.ACCESS_RS_DURING_EVENT
          );
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

    //        {isComingSoon() ? "isComingSoon()" : "not isComingSoon()"}
    //        {this.state.loadPriv} |  {this.state.privs}

    document.setTitle("Student Listing");
    return (
      <div>
        <h2>Student Listing</h2>
        {view}
      </div>
    );
  }
}

StudentListing.propTypes = {
  company_id: PropTypes.number.isRequired,
  isRec: PropTypes.bool
};

StudentListing.defaultProps = {
  isRec: true
};
