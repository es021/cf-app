import React, { PropTypes } from "react";
import { ButtonLink, ButtonExport } from "../component/buttons.jsx";
import GeneralFormPage from "../component/general-form";
import { getCF } from "../redux/actions/auth-actions";

//importing for list
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { Time } from "../lib/time";


class AdminStudentPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    document.setTitle("All Students");
    return (
      <div>
        <h3>All Students</h3>
        <ButtonExport
          text="Download All Student Data"
          action="all_student"
        ></ButtonExport>
      </div>
    );
  }
}

export default AdminStudentPage;
