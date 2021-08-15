import React from "react";
import PropTypes from "prop-types";
import { EventList } from "./event-list";
import { getCfCustomMeta } from "../redux/actions/auth-actions";
import { CFSMeta } from "../../config/db-config.js";

export default class ListEvent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div >
      <h1>{getCfCustomMeta(CFSMeta.TEXT_EVENT_WEBINAR, `Events & Webinars`)}</h1>
      <EventList listClass="flex-wrap-center text-left" />
    </div >
  }
}

ListEvent.propTypes = {
};

ListEvent.defaultProps = {
};
