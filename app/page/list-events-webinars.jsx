import React from "react";
import PropTypes from "prop-types";
import { WebinarHall } from "../page/auditorium.jsx";
import { CFSMeta } from "../../config/db-config.js";
import { getCfCustomMeta } from "../redux/actions/auth-actions.jsx";

export default class ListEventsWebinars extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="hall-page">
      <h1>{getCfCustomMeta(CFSMeta.TEXT_EVENT_WEBINAR, `Events & Webinars`)}</h1>
      <WebinarHall noBorderCard={true} />
    </div >
  }
}

ListEventsWebinars.propTypes = {
};

ListEventsWebinars.defaultProps = {
};
