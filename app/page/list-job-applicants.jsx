import React from "react";
import PropTypes from "prop-types";
import { InterestedUserList } from "../component/interested";
import { Loader } from "../component/loader";
import { graphql } from "../../helper/api-helper";

export default class ListJobApplicants extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.match) {
      this.vacancyId = this.props.match.params.id;
    }

    this.state = {
      loading: false,
      data: null
    }
  }
  componentDidMount() {
    this.load();
  }
  load() {
    this.setState({ loading: true });
    let q = `query{
      vacancy(ID:${this.vacancyId}){
        title
      }
    }`;
    graphql(q).then((res) => {
      this.setState({ data: res.data.data.vacancy, loading: false });
    })
  }
  render() {
    let v = null;
    let title = this.state.data ? this.state.data.title : null;
    if (this.state.loading) {
      v = <Loader text="Loading job post information..."></Loader>
    } else {
      document.setTitle(`${title} - Applicants`);
      v = <InterestedUserList
        export_action={"list_job_applicants"}
        export_title={title}
        entity={"vacancies"}
        title={<div></div>}
        entity_id={this.vacancyId}
      />
    }
    return <div>
      <div className="text-center">
        <h3><small>List of Applicants</small><br></br>
          {title}
        </h3>
      </div>
      <div style={{ maxWidth: "900px", margin: "auto" }}>
        {v}
      </div>
    </div>
  }
}

ListJobApplicants.propTypes = {

};

ListJobApplicants.defaultProps = {
};
