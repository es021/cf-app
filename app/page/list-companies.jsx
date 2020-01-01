import React from "react";
import PropTypes from "prop-types";
import CompaniesSection from "./partial/hall/companies";

export default class ListCompanies extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div >
      <h1>Company Profiles</h1>
      <CompaniesSection {...this.props} />
    </div >
  }
}

ListCompanies.propTypes = {
  isPreEvent: PropTypes.bool
};

ListCompanies.defaultProps = {
  isPreEvent: false
};
