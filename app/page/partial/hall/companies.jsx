import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as hallAction from "../../../redux/actions/hall-actions";
import PropTypes from "prop-types";
import { getAxiosGraphQLQuery, graphql } from "../../../../helper/api-helper";

import { Loader } from "../../../component/loader";
import ProfileCard from "../../../component/profile-card.jsx";
import { NavLink } from 'react-router-dom';
import {
  BANNER_WIDTH,
  BANNER_HEIGHT
} from "../../../component/profile-card-img";
import { CompanyEnum } from "../../../../config/db-config";
import { AppPath } from "../../../../config/app-config";
import { ButtonLink } from "../../../component/buttons.jsx";
import * as layoutActions from "../../../redux/actions/layout-actions";
import Tooltip from "../../../component/tooltip";

import { BOTH, S2C, C2S } from "../../../../config/socket-config";
import { socketOn } from "../../../socket/socket-client";

import { getAuthUser, isAuthorized, getCF } from "../../../redux/actions/auth-actions";
import { isCompanyOnline } from "../../../redux/actions/user-actions";

import CompanyPopup from "../popup/company-popup";
import List from "../../../component/list";


// require("../../../css/company-sec.scss");

function mapStateToProps(state, ownProps) {
  return {
    traffic: state.hall.traffic,
    online_companies: state.user.online_companies,
    companies: state.hall.companies,
    //onlineCompanies: state.hall.onlineCompanies,
    queueCompanies: state.hall.queueCompanies
  };
}

export const getCompanyCSSClass = function (type) {
  var className = "";
  switch (type) {
    case CompanyEnum.TYPE_SPECIAL:
      className = "blue";
      break;
    case CompanyEnum.TYPE_PLATINUM:
      className = "blue";
      break;
    case CompanyEnum.TYPE_GOLD:
      className = "gold";
      break;
    case CompanyEnum.TYPE_SILVER:
      className = "silver";
      break;
    case CompanyEnum.TYPE_BRONZE:
      className = "bronze";
      break;
  }

  return className;
};

const sec = "com-sec";

//real time with socket need to use redux
class CompanyBooth extends React.Component {
  constructor(props) {
    super(props);
    this.getCount = this.getCount.bind(this);
    this.ID = this.props.company.ID;
  }

  // update by socket
  loadOnlineRec() {
    //socket.on("rec_online")
    // check if ID is equal to this ID
  }

  getCount() {
    var countItem = [
      //     {
      //     count: this.props.onlineRec,
      //     label: "Recruiters Online"
      // }
      /*, {
                //count: (this.props.traffic !== null) ? this.props.traffic.active_queues_count : 0,
                count: this.props.countQueue,
                label: "Students Queueing"
            }*/
      /*, {
                count: (this.props.traffic !== null) ? this.props.traffic.active_prescreens_count : 0,
                label: "Students PreScreen"
            }*/
      // , {
      // count: this.props.company.vacancies_count,
      // //label: "Open Vacancy"
      // // EUR FIX
      // label: "Job Details"
      //    }
    ];

    countItem = countItem.map((d, i) => {
      var style = {};
      if (d.count > 0) {
        style = {
          color: "green",
          opacity: "1"
        };
      }
      return (
        <li key={i} style={style}>
          <div className={`${sec}-count`}>{d.count}</div>
          <div className={`${sec}-label`}>{d.label}</div>
        </li>
      );
    });

    var counts = <ul className={`${sec}-status`}>{countItem}</ul>;

    return counts;
  }

  render() {
    var onClick = () => {
      this.props.history.push(`/app/company/${this.props.company.ID}`);
      //layoutActions.storeUpdateFocusCard(this.props.company.name, CompanyPopup, { isPreEvent: this.props.isPreEvent, id: this.props.company.ID });
    };

    var pcTitle = this.props.company.name;
    var pcSubtitle = this.props.company.tagline;
    var pcBody = null;
    var badge = null;
    var badge_tooltip = null;

    // if (!this.props.isPreEvent) {
    //   // pcBody = <span>
    //   //     {this.getCount()}
    //   // </span>
    //   badge = this.props.onlineRec > 0 ? "" : null;
    //   badge_tooltip = `Company Currently Online`;
    // }

    let header = <div style={{ marginTop: "30px" }} />;
    //var className = getCompanyCSSClass(this.props.company.type);
    var className = "";

    let isShowOnlineBar = isCompanyOnline(this.props.online_companies, this.props.company.ID);

    return (

      <ProfileCard
        to={`${AppPath}/company/${this.props.company.ID}`}
        //onClick={onClick}
        className={className}
        type="company"
        header={header}
        title={pcTitle}
        subtitle={pcSubtitle}
        badge={badge}
        badge_tooltip={badge_tooltip}
        custom_width={BANNER_WIDTH / 2.5 + "px"}
        banner_height={BANNER_HEIGHT / 2.5 + "px"}
        addBanner={true}
        isShowOnlineBar={isShowOnlineBar}
        banner_url={this.props.company.banner_url}
        banner_pos={this.props.company.banner_position}
        banner_size={this.props.company.banner_size}
        img_url={this.props.company.img_url}
        img_pos={this.props.company.img_position}
        img_size={this.props.company.img_size}
        body={pcBody}
      />
      //</NavLink>
    );
  }
}

CompanyBooth.propTypes = {
  company: PropTypes.object.isRequired,
  traffic: PropTypes.object,
  onlineRec: PropTypes.number.isRequired,
  countQueue: PropTypes.number.isRequired,
  isPreEvent: PropTypes.bool
};

CompanyBooth.defaultProps = {
  isPreEvent: false
};

CompanyBooth = connect(
  mapStateToProps
  // mapDispatchToProps
)(CompanyBooth);

class CompaniesSection extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.renderList = this.renderList.bind(this);

    this.page = 1;
    this.traffic = {};
  }

  componentWillMount() {
    //this.props.loadCompanies(this.props.limitLoad);
    // socketOn(S2C.ONLINE_COMPANY, data => {
    //   this.props.setNonAxios("onlineCompanies", data);
    // });

    this.getMainQueryParam = (page, offset) => {
      let paging_param = "";
      if (page && offset) {
        paging_param = `page:${page}, offset:${offset}`
      }
      
      // , ignore_priv:"::${CompanyEnum.PRIV.JOB_POSTING_ONLY}::"
      return ` cf:"${getCF()}", ${paging_param}, order_by: "priority desc" `
    }

    this.loadCount = () => {
      var query = `query{
        companies_count(${this.getMainQueryParam()})
       }`;

      return getAxiosGraphQLQuery(query);
    };

    this.getCountFromRes = (res) => {
      return res.data.data.companies_count
    }
  }

  getDataFromRes(res) {
    return res.data.data.companies;
  }

  loadData(page, offset) {
    return graphql(`query{
      companies(${this.getMainQueryParam(page, offset)}) {
                ID
                img_url
                img_size
                img_position
                banner_url
                banner_size
                banner_position
                name
                tagline
                type  
            }
      }`);
  }

  renderList(d, i) {
    return (
      <CompanyBooth
        {...this.props}
        isPreEvent={this.props.isPreEvent}
        key={i}
        company={d}
        traffic={[]}
      />
    );
  }
  render() {

    return (
      <div>
        <div className={sec}>
          <List
            loadCount={this.loadCount}
            getCountFromRes={this.getCountFromRes}
            type="list"
            listClass="flex-wrap-center"
            pageClass="text-right"
            getDataFromRes={this.getDataFromRes}
            loadData={this.loadData}
            renderList={this.renderList}
            hideLoadMore={this.props.limitLoad ? true : false}
            offset={this.props.limitLoad ? this.props.limitLoad : this.props.offset}
          /></div>
      </div>
    );
  }
}



// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       loadTraffic: hallAction.loadTraffic,
//       loadCompanies: hallAction.loadCompanies,
//       setNonAxios: hallAction.setNonAxios
//     },
//     dispatch
//   );
// }

CompaniesSection.propTypes = {
  isPreEvent: PropTypes.bool,
  limitLoad: PropTypes.number,
  offset: PropTypes.number
};

CompaniesSection.defaultProps = {
  isPreEvent: false,
  limitLoad: null,
  offset: 6
};

export default connect(
  mapStateToProps
  // mapDispatchToProps
)(CompaniesSection);
