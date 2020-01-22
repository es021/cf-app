import React, { PropTypes } from "react";
import { BrowseStudentFilter, createFilterStr } from "./partial/browse-student/browse-student-filter";
import { BrowseStudentList } from "./partial/browse-student/browse-student-list";


export class BrowseStudent extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.state = {
      whereStr: ""
    };
  }



  onChangeFilter(filterState) {
    this.setState(() => {
      return { filterStr: createFilterStr(filterState) }
    })
  }

  render() {
    document.setTitle("Browse Student");
    return (
      <div className="browse-student">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <BrowseStudentFilter
                filterStr={this.state.filterStr}
                defaultFilterState={{
                  cf: ["EUR"],
                  graduation_month_to: ["December"],
                  graduation_year_to: ["2019"],
                }}
                onChange={this.onChangeFilter}></BrowseStudentFilter>
            </div>
            <div className="col-md-9">
              <BrowseStudentList filterStr={this.state.filterStr}></BrowseStudentList>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

