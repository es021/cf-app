import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as hallAction from "../../../redux/actions/hall-actions";
import PropTypes from "prop-types";
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

import { getAuthUser, isAuthorized } from "../../../redux/actions/auth-actions";
import { isCompanyOnline } from "../../../redux/actions/user-actions";

import CompanyPopup from "../popup/company-popup";

// require("../../../css/company-sec.scss");

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

class CompaniesSection extends React.Component {
  constructor(props) {
    super(props);
    this.page = 1;

    this.refreshTraffic = this.refreshTraffic.bind(this);
    this.traffic = {};
  }

  componentWillMount() {
    this.props.loadCompanies(this.props.limitLoad);

    //this.props.loadTraffic();

    // socketOn(S2C.ONLINE_COMPANY, data => {
    //   this.props.setNonAxios("onlineCompanies", data);
    // });

    // socketOn(BOTH.QUEUE_STATUS, data => {
    //   this.props.setNonAxios("queueCompanies", data);
    // });
  }

  componentDidMount() {
    //  layoutActions.storeUpdateFocusCard("tek Sapot", CompanyPopup, { isPreEvent: this.props.isPreEvent, id: 12 });
  }

  // add socket on here
  refreshTraffic() {
    this.props.loadTraffic();
  }

  render() {
    // to see data structure
    //alert(JSON.stringify(this.props.queueCompanies));
    //alert(JSON.stringify(this.props.onlineCompanies));

    var companies = this.props.companies;
    var traffic = this.props.traffic;

    var loading = <Loader size="3" text="Loading Companies.." />;

    var view = [];
    if (companies.fetching) {
      view = loading;
    } else {
      companies = companies.data.companies ? companies.data.companies : null;

      var comView = companies.map((d, i) => {
        // booth traffic and companies order by need to set the same in order for this to work
        var trf =
          !traffic.fetching || traffic.data.companies
            ? traffic.data.companies[i]
            : null;

        //this is from socket
        // var onlineRec = this.props.onlineCompanies[d.ID]
        //   ? Object.keys(this.props.onlineCompanies[d.ID]).length
        //   : 0;

        // var countQueue = this.props.queueCompanies[d.ID]
        //   ? this.props.queueCompanies[d.ID]
        //   : 0;

        return (
          <CompanyBooth
            {...this.props}
            isPreEvent={this.props.isPreEvent}
            key={i}
            // onlineRec={onlineRec}
            // countQueue={countQueue}
            company={d}
            traffic={trf}
          />
        );
      });

      //var btn = <a onClick={this.refreshTraffic}>Refresh Line</a>;

      view = (
        <div>
          <div className={sec}>{comView}</div>
        </div>
      );
    }

    return view;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    traffic: state.hall.traffic,
    online_companies: state.user.online_companies,
    companies: state.hall.companies,
    //onlineCompanies: state.hall.onlineCompanies,
    queueCompanies: state.hall.queueCompanies
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadTraffic: hallAction.loadTraffic,
      loadCompanies: hallAction.loadCompanies,
      setNonAxios: hallAction.setNonAxios
    },
    dispatch
  );
}

CompaniesSection.propTypes = {
  isPreEvent: PropTypes.bool,
  limitLoad : PropTypes.number
};

CompaniesSection.defaultProps = {
  isPreEvent: false,
  limitLoad : null
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompaniesSection);
