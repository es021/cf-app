import React from "react";
import PropTypes from "prop-types";
import ActivitySection from "./partial/hall/activity";

export default class ListInterviews extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div >
      <h1>My Interviews</h1>
      <div style={{ maxWidth: "700px", margin: "auto" }}>
        <ActivitySection type="row" isFullWidth={true} />
      </div>

    </div >
  }
}

ListInterviews.propTypes = {

};

ListInterviews.defaultProps = {
};
