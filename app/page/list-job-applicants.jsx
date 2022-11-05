import React from "react";
import PropTypes from "prop-types";
import { InterestedUserList } from "../component/interested";
import { Loader } from "../component/loader";
import { graphql } from "../../helper/api-helper";
import { getCF, isCfFeatureOn, isRoleOrganizer } from "../redux/actions/auth-actions";
import * as layoutActions from "../redux/actions/layout-actions";
import Form from "../component/form";
import { CFSMeta } from "../../config/db-config";

export default class ListJobApplicants extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.match) {
      this.vacancyId = this.props.match.params.id;
    }

    this.IsFeatureOnUpdateStatus = isCfFeatureOn(CFSMeta.FEATURE_UPDATE_JOB_APPLICATION_STATUS);

    this.state = {
      loading: false,
      data: null,
      renderKey: 0,
    }
  }

  componentDidMount() {
    this.load();
  }

  load() {
    this.setState({ loading: true });
    let q = `query{
      vacancy(ID:${this.vacancyId}){
        title
      }
    }`;
    graphql(q).then((res) => {
      this.setState({ data: res.data.data.vacancy, loading: false });
    })
  }
  openUpdateStatusPopup(d, postUpdate) {
    layoutActions.customViewBlockLoader(`Application Status for ${d.user.first_name}`,
      <div>
        <br></br>
        <i
          onClick={() => {
            layoutActions.storeHideBlockLoader();
          }}
          className="fa fa-close float-top-right clickable"
          style={{ color: 'red', fontSize: '20px' }}>
        </i>
        <Form className="form-row"
          items={[{
            label: "Status of Application",
            name: "status",
            type: "select",
            sublabel: `Please select the status of this applicant’s job application to your company`,
            onChange: (e) => { },
            data: [
              "",
              "Not suitable",
              "KIV",
              "Proceed for Interview",
              "Conditional Offer",
              "Hired",
            ],
            required: true
          }]}
          onSubmit={(formData) => {
            // console.log("submit", d);
            layoutActions.loadingBlockLoader("Updating...");
            graphql(`
              mutation{
                edit_interested(ID : ${d.ID}, application_status : "${formData.status}"){
                  ID
                }
              }
            `).then((res) => {
              layoutActions.storeHideBlockLoader();
              this.setState((prevState) => {
                return { renderKey: prevState.renderKey + 1 };
              })
              if (postUpdate) {
                postUpdate();
              }
            });
          }}
          btnColorClass="success"
          submitText='Save'
          defaultValues={{ status: d.application_status }}
          disableSubmit={false}
          error={null}
          errorPosition="top"
          emptyOnSuccess={true}
          success={false}>
        </Form>
      </div>,
      true);
  }
  render() {
    let v = null;
    let title = this.state.data ? this.state.data.title : null;
    if (this.state.loading) {
      v = <Loader text="Loading job post information..."></Loader>
    } else {
      document.setTitle(`${title} - Applicants`);
      v = <InterestedUserList
        renderKey={this.state.renderKey}
        getFooter={(d) => {
          return this.IsFeatureOnUpdateStatus
            ? <div
              style={{ marginTop: "4px" }}>
              <label
                onClick={() => {
                  this.openUpdateStatusPopup(d);
                  setTimeout(() => {
                    layoutActions.storeHideFocusCard();
                  }, 100);
                }}
                className={`label label-default clickable`}
              >
                {d.application_status}
              </label>
            </div>
            : null
        }}
        onClosePopup={(d, i) => {
          if (!this.IsFeatureOnUpdateStatus || d.application_status) {
            return true;
          }
          this.openUpdateStatusPopup(d, () => {
            layoutActions.storeHideFocusCard();
          });
        }}
        export_action={"list_job_applicants"}
        export_title={title}
        user_cf={isRoleOrganizer() ? getCF() : null}
        entity={"vacancies"}
        title={< div ></div >}
        entity_id={this.vacancyId}
      />
    }
    return <div>
      <div className="text-center">
        <h3><small>List of Applicants</small><br></br>
          {title}
        </h3>
      </div>
      <div style={{ maxWidth: "900px", margin: "auto" }}>
        {v}
      </div>
    </div>
  }
}

ListJobApplicants.propTypes = {

};

ListJobApplicants.defaultProps = {
};
