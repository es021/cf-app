import React from "react";
import PropTypes from "prop-types";
import { VacancyList } from "./partial/company/vacancy";

export default class ListJobPosts extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div >
      <h1 className="text-bold text-left">
        <i className="fa fa-suitcase left"></i>Job Posts
      </h1>
      <VacancyList isFullWidth={true} isSearchOnLeft={true} isEnableSearch={true} offset={9} filterByCf={true} isListAll={true} listClass="flex-wrap-center text-left" />
    </div >
  }
}

ListJobPosts.propTypes = {
  isPreEvent: PropTypes.bool
};

ListJobPosts.defaultProps = {
  isPreEvent: false
};
