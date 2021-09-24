import React from "react";
import { GroupCallStudentList } from "./partial/group-call/group-call-student-list";

export default class ListStudentGroupCall extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div >
      <h1>{`My Group Call`}</h1>
      <GroupCallStudentList isCenter={true} listClass="flex-wrap-center text-left" />
    </div >
  }
}

ListStudentGroupCall.propTypes = {
};

ListStudentGroupCall.defaultProps = {
};
