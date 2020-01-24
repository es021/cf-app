import React, { PropTypes } from "react";
import { BrowseStudentFilter, createFilterStr } from "./partial/browse-student/browse-student-filter";
import { BrowseStudentList } from "./partial/browse-student/browse-student-list";
import { graphql } from "../../helper/api-helper";
import { isRoleRec, getAuthUser } from "../redux/actions/auth-actions";
import { Loader } from "../component/loader";


export class BrowseStudent extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeFilter = this.onChangeFilter.bind(this);

    let defaultFilterState = null;
    // defaultFilterState = {
    //   cf: ["EUR"],
    //   graduation_month_to: ["December"],
    //   graduation_year_to: ["2019"],
    // }

    let disabledFilter = null;
    disabledFilter = {
      // cf: ["EUR"]
    }

    this.state = {
      filterStr: createFilterStr(defaultFilterState),
      filterState: defaultFilterState,
      disabledFilter: disabledFilter,
      loading: false,
      privs: [],
      companyName: ""
    };

    this.isRec = isRoleRec();
    this.company_id = getAuthUser().rec_company;
  }

  onChangeFilter(filterState) {
    this.setState(() => {
      return { filterStr: createFilterStr(filterState), filterState: filterState }
    })
  }


  componentWillMount() {
    this.loadPriv();
  }

  loadPriv() {
    if (this.isRec) {
      this.setState({ loading: true })
      var q = `query {company(ID:${this.company_id}) { priviledge name } }`;
      graphql(q).then(res => {
        var privs = res.data.data.company.priviledge;
        this.privs = privs;
        this.setState(prevState => {
          var companyName = res.data.data.company.name;
          if (privs == null) {
            privs = "";
          }
          // console.log("[StudentListing]", privs);
          return {
            loading: false,
            privs: privs,
            companyName: companyName
          };
        });
      });
    }

  }




  render() {
    document.setTitle("Browse Student");

    let v = null;
    if (this.state.loading) {
      v = <Loader></Loader>
    } else {


      v = <div className="container-fluid">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="col-lg-3">
            <BrowseStudentFilter
              filterStr={this.state.filterStr}
              disabledFilter={this.state.disabledFilter}
              defaultFilterState={this.state.filterState}
              onChange={this.onChangeFilter}></BrowseStudentFilter>
          </div>
          <div className="col-lg-7">
            <BrowseStudentList
              company_id={this.company_id}
              isRec={this.isRec}
              privs={this.state.privs}
              filterState={this.state.filterState}
              filterStr={this.state.filterStr}></BrowseStudentList>
          </div>
          <div className="col-lg-1"></div>
        </div>
      </div>
    }


    return (
      <div className="browse-student">
        {v}
      </div>

    );
  }
}

