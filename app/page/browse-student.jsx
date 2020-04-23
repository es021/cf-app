import React, { PropTypes } from "react";
import { BrowseStudentFilter, createFilterStr } from "./partial/browse-student/browse-student-filter";
import { BrowseStudentList } from "./partial/browse-student/browse-student-list";
import { graphql } from "../../helper/api-helper";
import { CompanyEnum } from "../../config/db-config";
import { AppRoot } from "../../config/app-config";
import { isRoleRec, getAuthUser, getCF, getCompanyCf, isRoleAdmin } from "../redux/actions/auth-actions";
import { Loader } from "../component/loader";
import { _GET } from "../lib/util";
import EmptyState from "../component/empty-state";
import { Redirect } from "react-router";

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

  isPageStudentListJobPost() {
    return this.props.match.path.indexOf("student-list-job-post") >= 0;
  }
  isPageInterestedStudent() {
    return this.props.match.path.indexOf("interested-student") >= 0;
  }
  getDefaultFilterState(company_cf) {
    let r = {};

    let currentCf = getCF();
    if (_GET("filter_cf")) {
      r["cf"] = [_GET("filter_cf")];
    } else {
      r["cf"] = company_cf.indexOf(currentCf) >= 0 ? [currentCf] : company_cf
    }

    if (_GET("interested_only") == "1" || this.isPageInterestedStudent()) {
      r["interested_only"] = ["1"];
    }

    if (_GET("like_job_post_only") == "1" || this.isPageStudentListJobPost()) {
      r["like_job_post_only"] = ["1"];
    }

    return r;
  }

  onChangeFilter(filterState) {
    this.setState(() => {
      let filterStr = createFilterStr(filterState, this.company_cf, { isPageStudentListJobPost: this.isPageStudentListJobPost() })
      return {
        filterStr: filterStr,
        filterState: filterState
      }
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
        let filterStr = createFilterStr(defaultFilterState, companyCF, { isPageStudentListJobPost: this.isPageStudentListJobPost() });
        return {
          filterStr: filterStr,
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
    company_id,
    noBracket
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
      if (noBracket) {
        return toRet;
      } else {
        return `(${toRet})`;
      }
    }
  }


  render() {
    let title = "Student Listing"
    // if(this.isPageStudentListJobPost()){
    //   title = ""
    // }

    document.setTitle(title);

    let v = null;
    if (this.state.loading) {
      v = <Loader></Loader>
    } else {
      if (!this.isPageStudentListJobPost() && CompanyEnum.hasPriv(this.state.privs, CompanyEnum.PRIV.JOB_POSTING_ONLY)) {
        // redirect to student list job post
        return <Redirect to={`/app/student-list-job-post`}></Redirect>
        // v = <EmptyState body={<div className="text-muted">Sorry. It seems that you have no access<br></br>to all student profiles yet.</div>}></EmptyState>
      } else {
        v = <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 text-left">
              <h1>
                <b>{title}{" "}{isRoleAdmin() ? " - " + this.state.companyName : ""}</b>
              </h1>
            </div>
          </div>
          <div className="row">
            {/* <div className="col-lg-1"></div> */}
            <div className="col-lg-4">
              <BrowseStudentFilter
                isPageStudentListJobPost={this.isPageStudentListJobPost()}
                isPageInterestedStudent={this.isPageInterestedStudent()}
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
                isPageStudentListJobPost={this.isPageStudentListJobPost()}
                isPageInterestedStudent={this.isPageInterestedStudent()}
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
    }


    return (
      <div className="browse-student">
        {v}
      </div>

    );
  }
}

