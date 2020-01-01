import React from "react";
import PropTypes from "prop-types";
import { WebinarHall } from "../page/auditorium.jsx";

export default class ListEventsWebinars extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="hall-page">
      <h1>Events & Webinars</h1>
      <WebinarHall noBorderCard={true}  />
    </div >
  }
}

ListEventsWebinars.propTypes = {
};

ListEventsWebinars.defaultProps = {
};
