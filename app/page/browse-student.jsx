import React, { PropTypes } from "react";
import { BrowseStudentFilter, createFilterStr } from "./partial/browse-student/browse-student-filter";
import { BrowseStudentList } from "./partial/browse-student/browse-student-list";
import { graphql } from "../../helper/api-helper";
import { isRoleRec, getAuthUser, getCF, getCompanyCf } from "../redux/actions/auth-actions";
import { Loader } from "../component/loader";
import { _GET } from "../lib/util";


export class BrowseStudent extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeFilter = this.onChangeFilter.bind(this);

    this.isRec = isRoleRec();
    this.company_id = this.isRec ? getAuthUser().rec_company : null;
    this.company_cf = getCompanyCf(["TEST"]);

    this.defaultFilterState = this.getDefaultFilterState();

    let disabledFilter = null;
    disabledFilter = {
      cf: (v) => {
        if (this.isRec) {
          // disabled kalau takde dlm list company_cf
          let toDisabled = this.company_cf.indexOf(v) <= -1
          return toDisabled;
        } else {
          return false;
        }
      }
    }

    this.state = {
      filterStr: createFilterStr(this.defaultFilterState, this.company_cf),
      filterState: this.defaultFilterState,
      disabledFilter: disabledFilter,
      loading: false,
      privs: [],
      companyName: ""
    };
  }

  getDefaultFilterState() {
    let r = {};

    let currentCf = getCF();
    if (_GET("filter_cf")) {
      r["cf"] = [_GET("filter_cf")];
    } else {
      r["cf"] = this.company_cf.indexOf(currentCf) >= 0 ? [currentCf] : this.company_cf
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

  getQueryParam({
    page,
    offset,
    filterStr,
    isRec,
    company_id
  }) {
    let toRet = ""
    if (isRec) {
      toRet = `company_id : ${company_id}`;
    }

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
          {/* <div className="col-lg-1"></div> */}
          <div className="col-lg-4">
            <BrowseStudentFilter
              filterStr={this.state.filterStr}
              isRec={this.isRec}
              disabledFilter={this.state.disabledFilter}
              filterState={this.state.filterState}
              defaultFilterState={this.defaultFilterState}
              getQueryParam={this.getQueryParam}
              onChange={this.onChangeFilter}></BrowseStudentFilter>
          </div>
          <div className="col-lg-8">
            <BrowseStudentList
              company_id={this.company_id}
              isRec={this.isRec}
              privs={this.state.privs}
              company_cf={this.company_cf}
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

