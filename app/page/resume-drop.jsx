import React, { Component } from "react";
import { getAuthUser, getCF, getCfCustomMeta, isCfFeatureOn } from "../redux/actions/auth-actions";
import {
  storeHideFocusCard,
  storeUpdateFocusCard
} from "../redux/actions/layout-actions";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { ResumeDrop, UserEnum, CFSMeta } from "../../config/db-config";
import Form, { toggleSubmit, checkDiff } from "../component/form";
import { Loader } from "../component/loader";
import PropTypes from "prop-types";
import { createIconList } from "../component/list";
import { RootPath } from "../../config/app-config";
import { NavLink } from "react-router-dom";
import obj2arg from "graphql-obj2arg";
import { Time } from "../lib/time";
import CompanyPopup from "./partial/popup/company-popup";

//import ValidationStudentAction from '../component/validation-student-action';
//import { hasResume, hasCV } from '../component/doc-link-form.jsx';

import { feedbackStudent } from "./partial/analytics/feedback";

export default class ResumeDropPage extends React.Component {
  constructor(props) {
    super(props);
    this.formOnSubmit = this.formOnSubmit.bind(this);
    this.state = {
      isEdit: false,
      error: null,
      disableSubmit: false,
      success: null,
      loading: true,
      data: {
        resume_drop: null,
        company: null,
        doc_links: null,
        resume_drops_limit: null
      }
    };
  }

  getFormItems(isEdit) {
    let items = [
      {
        name: ResumeDrop.DOC_LINKS,
        type: "checkbox",
        // EUR CHANGES
        label: isEdit ? "Documents Submitted" : "Documents To Be Submitted",
        required: true,
        disabled: true,
        sublabel: (
          <NavLink
            onClick={() => {
              storeHideFocusCard();
            }}
            to={`${RootPath}/app/edit-profile/doc-link`}
          >
            Add More Documents
          </NavLink>
        ),
        data: null
      }
    ];

    return items;
  }

  componentWillMount() {
    if (this.props.match) {
      this.company_id = this.props.match.params.company_id;
    } else {
      this.company_id = this.props.company_id;
    }

    this.company_id = Number.parseInt(this.company_id);
    this.defaultValues = {};
    this.isEdit = false;

    this.formItems = this.getFormItems(false);
    this.formItemsEdit = this.getFormItems(true);

    this.loadData();
  }

  loadData() {
    var data = {
      resume_drop: null,
      resume_drops_limit: null,
      resume_drops_limit_by_cf: null,
      company: null,
      doc_links: null
    };

    var loaded = 0;
    var toLoad = 4;

    var user_id = getAuthUser().ID;

    const finishLoad = () => {
      loaded++;
      console.log("loaded", loaded, toLoad, data);
      if (loaded >= toLoad) {
        this.setState(() => {
          return { data: data, loading: false };
        });
      }
    };

    // load company info
    var query = `query{company(ID:${this.company_id}){
            message_drop_resume name}}`;
    getAxiosGraphQLQuery(query).then(res => {
      data.company = res.data.data.company;
      finishLoad();
    });

    //load if there is any resume_drops_limit
    var query = `query{resume_drops_limit_by_cf(user_id:${user_id}, cf:"${getCF()}") {current limit_drop is_over_limit} }`;
    getAxiosGraphQLQuery(query).then(res => {
      data.resume_drops_limit_by_cf = res.data.data.resume_drops_limit_by_cf;
      finishLoad();
    });

    var query = `query{resume_drops_limit(user_id:${user_id})}`;
    getAxiosGraphQLQuery(query).then(res => {
      data.resume_drops_limit = res.data.data.resume_drops_limit;
      finishLoad();
    });



    // load document
    var query = `query{user(ID:${user_id}){ doc_links{ID label url} }}`;
    getAxiosGraphQLQuery(query).then(res => {
      var userData = res.data.data.user;
      var dl = userData.doc_links;
      data.doc_links = dl;
      // if (hasResume(dl) || hasCV(dl)) {
      //     data.doc_links = dl;
      // } else {
      //     data.doc_links = null;
      // }
      finishLoad();
    });

    // load existing resume drop
    var query = `query{resume_drop(student_id:${user_id}, company_id:${this.company_id
      }){
                    ID doc_links{ID label url} message updated_at}}`;

    getAxiosGraphQLQuery(query).then(res => {
      data.resume_drop = res.data.data.resume_drop;
      if (data.resume_drop !== null) {
        this.isEdit = true;
      }
      finishLoad();
    });
  }

  formOnSubmit(d) {
    toggleSubmit(this, { error: null, success: null });

    if (!d[ResumeDrop.DOC_LINKS]) {
      toggleSubmit(this, { error: "Please Select A Document", success: null });
      return;
    }

    var doc_links = JSON.stringify(
      d[ResumeDrop.DOC_LINKS].map((d, i) => Number.parseInt(d))
    );
    var query = null;

    //edit
    if (this.isEdit) {
      var original = this.defaultValues;
      d[ResumeDrop.DOC_LINKS] = doc_links;
      original[ResumeDrop.DOC_LINKS] = JSON.stringify(
        original[ResumeDrop.DOC_LINKS]
      );

      var update = checkDiff(this, this.defaultValues, d);
      if (update === false) {
        return;
      }
      update[ResumeDrop.ID] = this.state.data.resume_drop.ID;

      query = `mutation{edit_resume_drop(${obj2arg(update, {
        noOuterBraces: true
      })}) {
            ID doc_links{ID label url} message updated_at}}`;
    }
    // create new
    else {
      var ins = d;
      ins[ResumeDrop.DOC_LINKS] = doc_links;
      ins[ResumeDrop.CF] = getCF();
      ins[ResumeDrop.STUDENT_ID] = getAuthUser().ID;
      ins[ResumeDrop.COMPANY_ID] = this.company_id;
      query = `mutation{add_resume_drop(${obj2arg(ins, {
        noOuterBraces: true
      })}) {
            ID doc_links{ID label url} message updated_at}}`;
    }

    getAxiosGraphQLQuery(query).then(
      res => {
        var data = this.state.data;
        data.resume_drop = this.isEdit
          ? res.data.data.edit_resume_drop
          : res.data.data.add_resume_drop;

        var m =
          "Successfully " + (this.isEdit ? "Edit" : "Added New") + " Record";

        this.isEdit = true;

        toggleSubmit(this, { error: null, data: data, success: m });
      },
      err => {
        toggleSubmit(this, { error: err.response.data });
      }
    );
  }
  getLimitByCfView() {
    let limitByCf = this.state.data.resume_drops_limit_by_cf;
    if (limitByCf.limit_drop) {
      return <div style={{ padding: '20px 20px' }}>
        <i>
          ** You have <b>{limitByCf.limit_drop - limitByCf.current}</b> resume drop quota left **
        </i>
      </div>
    }

    return null;
  }
  getWhatsNextView() {
    var actData = [
      {
        icon: "file-text",
        color: "#007BB4",
        text: (
          <span>
            <b>{this.state.data.company.name}</b> will review your resume
          </span>
        )
      },
      {
        icon: "envelope",
        color: "#007BB4",
        text: (
          <span>
            You will be <b>notified through email</b> if you are selected for
            1-1 session
          </span>
        )
      }
    ];

    let defaultMes = createIconList("sm", actData, "400px", {
      customTextWidth: "350px",
      customIconDimension: "40px",
      customIconFont: "initial"
    });

    const onClickGotIt = () => {
      storeHideFocusCard();
      //storeUpdateFocusCard(this.state.data.company.name, CompanyPopup, { id: this.props.company_id });
    };

    let customMes = this.state.data.company.message_drop_resume;
    let mes =
      customMes !== null && customMes != "" ? (
        <p
          style={{
            textAlign: "center",
            padding: "10px",
            paddingBottom: "20px"
          }}
        >
          {customMes}
        </p>
      ) : (
        defaultMes
      );
    let v = (
      <div>
        <h4 className="text-primary">Whats Next?</h4>
        {mes}
        <button onClick={onClickGotIt} className="btn btn-primary">
          Got It!
        </button>
      </div>
    );

    return v;
  }

  render() {
    if (!this.props.company_id) {
      document.setTitle(`Resume Drop`);
    }

    var view = null;
    var isFeedback = false;
    if (this.state.loading) {
      view = <Loader text="Loading information..." size="3" />;
    } else {
      var v = null;
      var submitedText = null;

      var no_doc_link =
        typeof this.state.data.doc_links === "undefined" ||
        this.state.data.doc_links === null ||
        this.state.data.doc_links.length === 0;

      console.log("no_doc_link", no_doc_link);
      console.log("this.state.data.doc_links", this.state.data.doc_links);

      console.log(
        "this.state.data.resume_drops_limit",
        this.state.data.resume_drops_limit
      );
      console.log("isEdit", this.isEdit);
      // has limit need to fill feedback

      console.log("isCfFeatureOn(CFSMeta.FEATURE_FEEDBACK)", isCfFeatureOn(CFSMeta.FEATURE_FEEDBACK));

      if (!this.isEdit && this.state.data.resume_drops_limit_by_cf.is_over_limit == 1) {
        return (
          <div style={{ padding: '20px 30px' }}>
            <h3>
              Quota for resume drop reached.
              <br></br>You can only drop to {this.state.data.resume_drops_limit_by_cf.limit_drop} companies
            </h3>
          </div>
        );
      }
      // @open_feedback_by_career_fair
      else if (isCfFeatureOn(CFSMeta.FEATURE_FEEDBACK) && this.state.data.resume_drops_limit !== null && !this.isEdit) {
        // if (this.state.data.resume_drops_limit !== null && !this.isEdit) {
        view = (
          <div>
            <br />
            {feedbackStudent()}
          </div>
        );
        isFeedback = true;
      }
      // no doc
      // else if (no_doc_link) {
      //     v = [];
      //     if (no_doc_link) {
      //         v.push(<div>
      //             It seems that you don't have any<br></br><b>Resume</b> or <b>CV</b> uploaded in your profile yet.
      //             <br></br><br></br>
      //             <NavLink onClick={storeHideFocusCard}
      //                 className="btn btn-primary"
      //                 to={`${RootPath}/app/edit-profile/doc-link`}>Upload Resume Now</NavLink>
      //         </div>);
      //     }

      // }
      else {
        // EUR CHANGES
        // changes to select all by default
        this.defaultValues[
          ResumeDrop.DOC_LINKS
        ] = this.state.data.doc_links.map((d, i) => {
          if (d == null) return;
          return d.ID;
        });

        // already submitted, create for default values
        if (this.isEdit) {
          // this.defaultValues[ResumeDrop.DOC_LINKS] = this.state.data.resume_drop.doc_links.map((d, i) => {
          //     if (d == null) return;
          //     return d.ID
          // });
          this.defaultValues[
            ResumeDrop.MESSAGE
          ] = this.state.data.resume_drop.message;

          submitedText = (
            <h4 className="text-primary">
              {`Resume Successfully Submitted`}
              <br />
              <small>
                On {Time.getString(this.state.data.resume_drop.updated_at)}
              </small>
            </h4>
          );
        }

        // create document checbox
        var docs = this.state.data.doc_links.map((d, i) => {
          if (d == null) return;

          return {
            key: d.ID,
            label: (
              <a href={d.url} target="_blank">
                {d.label}
              </a>
            )
          };
        });
        if (this.formItems[0].data === null) {
          this.formItems[0].data = docs;
        }
        if (this.formItemsEdit[0].data === null) {
          this.formItemsEdit[0].data = docs;
        }

        // create form
        var checkboxForm = (
          <Form
            className="form-row"
            items={this.isEdit ? this.formItemsEdit : this.formItems}
            onSubmit={this.formOnSubmit}
            submitText={this.isEdit ? "Save Change" : "Submit"}
            defaultValues={this.defaultValues}
            disableSubmit={this.state.disableSubmit}
            error={this.state.error}
            hideSubmit={this.isEdit ? true : false}
            success={this.state.success}
          />
        );
      }

      if (!isFeedback) {
        var title = this.props.company_id ? (
          <br />
        ) : (
          <h4>{this.state.data.company.name}</h4>
        );

        if (!this.props.company_id) {
          document.setTitle(`Resume Drop - ${this.state.data.company.name}`);
        }

        if (this.isEdit) {
          view = (
            <div>
              {title}
              {submitedText}
              {checkboxForm}
              <hr />
              {this.getWhatsNextView()}
            </div>
          );
        } else {
          view = (
            <div>
              {title}
              {checkboxForm}
              {this.getLimitByCfView()}
            </div>
          );
        }
      }
    }

    return (
      <div>
        {this.props.company_id ? null : <h3>Resume Drop</h3>}
        {view}
      </div>
    );
  }
}

ResumeDrop.propTypes = {
  company_id: PropTypes.number
};
