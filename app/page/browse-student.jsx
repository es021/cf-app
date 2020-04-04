import React, { PropTypes } from "react";
import { BrowseStudentFilter, createFilterStr } from "./partial/browse-student/browse-student-filter";
import { BrowseStudentList } from "./partial/browse-student/browse-student-list";
import { graphql } from "../../helper/api-helper";
import { isRoleRec, getAuthUser, getCF, getCompanyCf, isRoleAdmin } from "../redux/actions/auth-actions";
import { Loader } from "../component/loader";
import { _GET } from "../lib/util";


export class BrowseStudent extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeFilter = this.onChangeFilter.bind(this);

    // set company id
    this.company_id = null;
    if (isRoleRec()) {
      this.company_id = getAuthUser().rec_company
    } else if (isRoleAdmin()) {
      if (this.props.match) {
        this.company_id = this.props.match.params.id;
      }
    }


    this.state = {
      filterStr: "",
      defaultFilterState: {},
      filterState: {},
      disabledFilter: {},
      loading: false,
      privs: [],
      companyCF: [],
      companyName: ""
    };
  }

  getDefaultFilterState(company_cf) {
    let r = {};

    let currentCf = getCF();
    if (_GET("filter_cf")) {
      r["cf"] = [_GET("filter_cf")];
    } else {
      r["cf"] = company_cf.indexOf(currentCf) >= 0 ? [currentCf] : company_cf
    }

    if (_GET("interested_only") == "1" || this.props.match.path.indexOf("interested-student") >= 0) {
      r["interested_only"] = ["1"];
    }

    return r;
  }

  onChangeFilter(filterState) {
    this.setState(() => {
      return { filterStr: createFilterStr(filterState, this.company_cf), filterState: filterState }
    })
  }


  componentWillMount() {
    this.loadCompanyInfo();
  }

  loadCompanyInfo() {
    this.setState({ loading: true })
    var q = `query {company(ID:${this.company_id}) { priviledge name cf } }`;
    graphql(q).then(res => {
      var companyCF = res.data.data.company.cf;
      console.log("companyCF", companyCF)
      console.log("companyCF", companyCF)
      console.log("companyCF", companyCF)
      var privs = res.data.data.company.priviledge;
      this.privs = privs;
      this.setState(prevState => {
        var companyName = res.data.data.company.name;
        if (privs == null) {
          privs = "";
        }


        let defaultFilterState = this.getDefaultFilterState(companyCF);
        let disabledFilter = null;
        disabledFilter = {
          cf: (v) => {
            let toDisabled = companyCF.indexOf(v) <= -1
            return toDisabled;
          }
        }

        console.log("defaultFilterState", defaultFilterState)
        console.log("defaultFilterState", defaultFilterState)
        console.log("defaultFilterState", defaultFilterState)
        console.log("defaultFilterState", defaultFilterState)
        return {
          filterStr: createFilterStr(defaultFilterState, companyCF),
          defaultFilterState: defaultFilterState,
          filterState: defaultFilterState,
          disabledFilter: disabledFilter,
          companyCF: companyCF,
          loading: false,
          privs: privs,
          companyName: companyName
        };
      });
    });
  }

  getQueryParam({
    page,
    offset,
    filterStr,
    company_id
  }) {
    let toRet = ""
    toRet = `company_id : ${company_id}`;

    if (filterStr) {
      if (toRet != "") {
        toRet += ", ";
      }
      toRet += `${filterStr}`;
    }

    if (page && offset) {
      if (toRet != "") {
        toRet += ", ";
      }
      toRet += `, page: ${page}, offset:${offset}`;
    }

    if (toRet.trim() == "") {
      return "";
    } else {
      return `(${toRet})`;
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
          <div className="col-lg-12 text-left">
            <h1>
              <b>Student Listing {isRoleAdmin() ? " - " + this.state.companyName : ""}</b>
            </h1>
          </div>
        </div>
        <div className="row">
          {/* <div className="col-lg-1"></div> */}
          <div className="col-lg-4">
            <BrowseStudentFilter
              company_id={this.company_id}
              filterStr={this.state.filterStr}
              disabledFilter={this.state.disabledFilter}
              filterState={this.state.filterState}
              defaultFilterState={this.state.defaultFilterState}
              getQueryParam={this.getQueryParam}
              onChange={this.onChangeFilter}></BrowseStudentFilter>
          </div>
          <div className="col-lg-8">
            <BrowseStudentList
              company_id={this.company_id}
              company_name={this.state.companyName}
              privs={this.state.privs}
              company_cf={this.state.companyCF}
              disabledFilter={this.state.disabledFilter}
              filterState={this.state.filterState}
              getQueryParam={this.getQueryParam}
              filterStr={this.state.filterStr}></BrowseStudentList>
          </div>
          {/* <div className="col-lg-1"></div> */}
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

