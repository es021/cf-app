import React from "react";
import PropTypes from "prop-types";
import CompaniesSection from "./partial/hall/companies";
import { getCfCustomMeta } from "../redux/actions/auth-actions";
import { CFSMeta } from "../../config/db-config";

export default class ListCompanies extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let companySingle = getCfCustomMeta(CFSMeta.TEXT_COMPANY_ENTITY_SINGLE, "Company");
    return <div >
      <h1>{companySingle} Profiles</h1>
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
