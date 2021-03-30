import React from "react";
import PropTypes from "prop-types";
import { VacancyList } from "./partial/company/vacancy";
import { lang } from "../lib/lang";
import { AppPath } from "../../config/app-config";
import { NavLink } from "react-router-dom";
import { isCfFeatureOff } from "../redux/actions/auth-actions";
import { CFSMeta } from "../../config/db-config";

export default class ListJobApplied extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var goToAllJobPost = isCfFeatureOff(CFSMeta.FEATURE_STUDENT_JOB_POST)
      ? null
      : <div className="text-left" style={{ fontSize: "17px", marginBottom: "15px" }}>
        <NavLink to={`${AppPath}/list-job-posts`}>
          {lang("Go to All Job Posts")}
          <i className="fa fa-long-arrow-right right"></i>
        </NavLink>
      </div>;

    return <div >
      <h1 className="text-bold text-left">
        <i className="fa fa-check-square-o left"></i>{lang("Jobs Applied")}
      </h1>
      {goToAllJobPost}
      <VacancyList isFullWidth={true} isSearchOnLeft={true} isEnableSearch={true} offset={9}
        showAppliedOnly={true} isListAll={true} listClass="flex-wrap-center text-left" />
    </div >
  }
}

ListJobApplied.propTypes = {
  isPreEvent: PropTypes.bool
};

ListJobApplied.defaultProps = {
  isPreEvent: false
};
