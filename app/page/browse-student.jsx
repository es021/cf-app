import React, { PropTypes } from "react";
import { BrowseStudentFilter } from "./partial/browse-student/browse-student-filter";
import { BrowseStudentList } from "./partial/browse-student/browse-student-list";


export class BrowseStudent extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.state = {
      whereStr: ""
    };
  }

  createSearchStr(searchObj) {
    return JSON.stringify(searchObj);
  }

  onChangeFilter(searchObj) {
    this.setState(() => {
      return { whereStr: this.createSearchStr(searchObj) }
    })
  }

  render() {
    document.setTitle("Browse Student");
    return (
      <div className="browse-student">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <BrowseStudentFilter whereStr={this.state.whereStr} onChange={this.onChangeFilter}></BrowseStudentFilter>
            </div>
            <div className="col-md-9">
              <BrowseStudentList whereStr={this.state.whereStr}></BrowseStudentList>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

