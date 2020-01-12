import React from "react";
import PropTypes from "prop-types";
import { EventList } from "./event-list";

export default class ListEvent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div >
      <h1>Events</h1>
      <EventList listClass="flex-wrap-center text-left"/>
    </div >
  }
}

ListEvent.propTypes = {
};

ListEvent.defaultProps = {
};
