import React from "react";
import PropTypes from "prop-types";
import { VacancyList } from "./company";

export default class ListJobPosts extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div >
      <h1>Job Posts</h1>
      <VacancyList offset={9} isListAll={true} listClass="flex-wrap-center text-left"/>
    </div >
  }
}

ListJobPosts.propTypes = {
  isPreEvent: PropTypes.bool
};

ListJobPosts.defaultProps = {
  isPreEvent: false
};
