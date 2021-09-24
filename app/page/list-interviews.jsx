import React from "react";
import PropTypes from "prop-types";
import ActivitySection from "./partial/hall/activity";
import { getCfCustomMeta } from "../redux/actions/auth-actions";
import { CFSMeta } from "../../config/db-config";

export default class ListInterviews extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let title = getCfCustomMeta(CFSMeta.TEXT_MY_INTERVIEW, `My Interviews`);
    return <div >
      <h1>{title}</h1>
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
