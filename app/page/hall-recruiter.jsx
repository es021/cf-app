import React from "react";
import PropTypes from "prop-types";
import HallRecruiterEvent from "./partial/hall-recruiter/hall-recruiter-event";
import HallRecruiterInterview from "./partial/hall-recruiter/hall-recruiter-interview";
import HallRecruiterJobPosts from "./partial/hall-recruiter/hall-recruiter-job-posts";
import { RootPath } from "../../config/app-config";

import {
  getCFObj,
  getAuthUser
} from "../redux/actions/auth-actions";
import { ButtonAction } from "../component/buttons";
import InputEditable from "../component/input-editable";
import obj2arg from "graphql-obj2arg";

// require("../css/hall.scss");''

export function getPicElement(d, mutation_edit, entity) {
  let pic = <InputEditable
    editTitle={`Edit ${entity}`}
    val={d.pic}
    data={{ ID: d.ID }}
    formItems={(fixedName) => {
      return [
        {
          name: fixedName,
          type: "text",
          placeholder: "John Doe, Sarah Hopper",
        }
      ]
    }}
    render={(val, loading, openEditPopup) => {
      let notAssigned = <span className="text-muted"><i>No {entity} Assigned</i></span>;
      let editing = <span className="text-muted"><i>Assigning {entity}. Please Wait.</i></span>;
      let editIcon = <a><i onClick={openEditPopup} className="fa fa-pencil right btn-link"></i></a>;

      return <div className="text-muted-dark">
        <small>
          <i className="fa fa-user-circle left"></i><b>{entity}</b>{" : "}
          {loading ? editing : <span>{!val ? notAssigned : val}{editIcon}</span>
          }
        </small>
      </div >
    }}
    query={(data, newVal) => {
      let upd = {
        ID: data.ID,
        pic: newVal,
        updated_by: getAuthUser().ID
      }
      return `mutation { ${mutation_edit}(${obj2arg(upd, { noOuterBraces: true })}) { ID pic } }`
    }}
  />

  return pic;
}

export default class HallRecruiterPage extends React.Component {
  constructor(props) {
    super(props);
    this.CFDetail = getCFObj();
    this.title = this.CFDetail.title;
    this.authUser = getAuthUser();
    this.company_id = this.authUser.rec_company
    this.state = {
    }
  }


  // componentWillMount() {
  //   setBodyFullWidth();
  // }

  // componentWillUnmount() {
  //   unsetBodyFullWidth();
  // }
  getRecruiterAction() {
    return <div className="title-sectaion">
      <div className="main-width">
        <ButtonAction
          style={{ width: "350px" }}
          btnClass="btn-lg btn-success"
          // to={`${RootPath}/app/my-activity/student-listing`}
          to={`${RootPath}/app/browse-student`}
          icon="users"
          iconSize="3x"
          mainText={"All Students"}
          // subText={`See who's interested in ${this.authUser.company.name}`}
          subText={`Browse all students`}
        />

        <ButtonAction
          style={{ width: "350px" }}
          btnClass="btn-lg btn-blue"
          // to={`${RootPath}/app/my-activity/student-listing`}
          to={`${RootPath}/app/browse-student?interested_only=1`}
          icon="user"
          iconSize="3x"
          mainText={"Interested Students"}
          // subText={`See who's interested in ${this.authUser.company.name}`}
          subText={`Browse students interested in you`}
        />
      </div >
    </div >
  }

  render() {
    document.setTitle("Recruiter Home Page");
    let v = null;
    v = <div className="hall-page">
      <h2>Welcome {this.authUser.company.name} !</h2>
      {this.getRecruiterAction()}
      <br></br>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <HallRecruiterInterview></HallRecruiterInterview>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <HallRecruiterJobPosts company_id={this.company_id}></HallRecruiterJobPosts>
          </div>
          <div className="col-md-6">
            <HallRecruiterEvent company_id={this.company_id}></HallRecruiterEvent>
          </div>
        </div>
        {/* <div className="row">
          <div className="col-md-12">
            <HallRecruiterEvent company_id={this.company_id}></HallRecruiterEvent>
          </div>
        </div> */}
      </div>
      {/* <DashboardFeed cf="USA19" type="recruiter"></DashboardFeed> */}
    </div>

    return v;
  }
}

HallRecruiterPage.propTypes = {
  isPreEvent: PropTypes.bool
};

HallRecruiterPage.defaultProps = {
  isPreEvent: false
};
