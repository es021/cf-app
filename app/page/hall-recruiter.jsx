import React from "react";
import PropTypes from "prop-types";
import HallRecruiterInterview from "./partial/hall-recruiter/hall-recruiter-interview";
import HallRecruiterJobPosts from "./partial/hall-recruiter/hall-recruiter-job-posts";


import {
  getCFObj,
  getAuthUser
} from "../redux/actions/auth-actions";
import { setBodyFullWidth, unsetBodyFullWidth } from "../../helper/general-helper";
import { DashboardFeed } from "./dashboard";


// require("../css/hall.scss");

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

  render() {
    document.setTitle("Recruiter Home Page");
    let v = null;
    v = <div className="hall-page">
      <h2>Recruiter Home Page</h2>
      <HallRecruiterJobPosts company_id={this.company_id}></HallRecruiterJobPosts>
      <HallRecruiterInterview></HallRecruiterInterview>

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
