import React from "react";
import PropTypes from "prop-types";
import { VacancyList } from "./partial/company/vacancy";
import { lang } from "../lib/lang";
import { AppPath } from "../../config/app-config";
import { CFSMeta } from "../../config/db-config";
import { NavLink } from "react-router-dom";
import { getCfCustomMeta, isRoleStudent } from "../redux/actions/auth-actions";
export default class ListJobPosts extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div >
      <h1 className="text-bold text-left">
        <i className="fa fa-suitcase left"></i>{lang(`${getCfCustomMeta(CFSMeta.TEXT_JOB_POST, "Job Posts")}`)}
      </h1>
      {isRoleStudent()
        ? <div className="text-left" style={{ fontSize: "17px", marginBottom: "15px" }}>
          <NavLink to={`${AppPath}/list-job-applied`}>
            {lang(`Go to ${getCfCustomMeta(CFSMeta.TEXT_JOB_POST, "Jobs")} Applied`)}
            <i className="fa fa-long-arrow-right right"></i>
          </NavLink>
        </div>
        : <div style={{ padding: '20px 0px' }}></div>
      }
      <VacancyList isFullWidth={true} isSearchOnLeft={true} isEnableSearch={true} offset={9}
        filterByCf={true} isListAll={true} listClass="flex-wrap-center text-left" />
    </div >
  }
}

ListJobPosts.propTypes = {
  isPreEvent: PropTypes.bool
};

ListJobPosts.defaultProps = {
  isPreEvent: false
};
