import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import {
  Prescreen,
  PrescreenEnum,
  Availability,
  NotificationsEnum,
  CFSMeta
} from "../../../../config/db-config";
import { getAxiosGraphQLQuery } from "../../../../helper/api-helper";
import {
  getAuthUser,
  isRoleAdmin,
  getCFObj,
  getCfCustomMeta
} from "../../../redux/actions/auth-actions";
import * as layoutActions from "../../../redux/actions/layout-actions";
import { ActivityType } from "../../../redux/actions/hall-actions";
import { addNotification } from "../../../page/notifications.jsx";
import PropTypes from "prop-types";
import { RootPath } from "../../../../config/app-config";
import { Time } from "../../../lib/time";
import { emitHallActivity } from "../../../socket/socket-client";
import { Loader } from "../../../component/loader";
import AvailabilityView from "../../availability";
import ProfileCard from "../../../component/profile-card.jsx";
import obj2arg from "graphql-obj2arg";

// included in my-activity for recruiter
// add as form only in past session in my-activity
export default class ScheduledInterviewNew extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = getAuthUser();

    this.state = {
      loaded: 0,
      company: [],
      student: [],
      loading: true,
      loadingSubmit: false,
      select_id: -1,
      select_timestamp: 0
    };
  }

  componentWillMount() {
    this.loaded = 0;
    this.toLoad = 2;

    // load user
    var query = `query{ user(ID:${this.props.student_id}) 
            {ID first_name last_name img_url img_pos img_size} }`;
    getAxiosGraphQLQuery(query).then(res => {
      this.loaded++;
      this.setState(() => {
        return {
          student: res.data.data.user,
          loading: this.loaded < this.toLoad
        };
      });
    });

    // load company
    var query = `query{ company(ID:${this.props.company_id}) 
            {name} }`;
    getAxiosGraphQLQuery(query).then(res => {
      this.loaded++;
      this.setState(() => {
        return {
          company: res.data.data.company,
          loading: this.loaded < this.toLoad
        };
      });
    });
  }
  submitOnClick() {
    this.setState(prevState => {
      return { loadingSubmit: true };
    });

    this.createPrescreen();
  }
  // Create Scheduled Interview 1
  createPrescreen() {
    var d = {};
    d[Prescreen.STUDENT_ID] = this.props.student_id;
    d[Prescreen.COMPANY_ID] = this.props.company_id;
    d[Prescreen.UPDATED_BY] = getAuthUser().ID;

    // New SI Flow
    d[Prescreen.STATUS] = PrescreenEnum.STATUS_WAIT_CONFIRM;
    //d[Prescreen.STATUS] = PrescreenEnum.STATUS_APPROVED;

    d[Prescreen.SPECIAL_TYPE] = PrescreenEnum.ST_NEW;
    d[Prescreen.APPNMENT_TIME] = Number.parseInt(this.state.select_timestamp);

    var query = `mutation{ add_prescreen 
            (${obj2arg(d, { noOuterBraces: true })}){ID}
        }`;

    getAxiosGraphQLQuery(query).then(res => {
      var psId = res.data.data.add_prescreen.ID;

      // 1. update availability
      this.setState(() => {
        this.updateAvailability(psId);
      });

      let notiParam = {};
      notiParam[Prescreen.ID] = psId;
      notiParam[Prescreen.APPNMENT_TIME] = d[Prescreen.APPNMENT_TIME];
      addNotification({
        user_id: this.props.student_id,
        text: `<b>${this.state.company.name
          }</b> has scheduled a private session with you`,
        param: notiParam,
        type: NotificationsEnum.TYPE_CREATE_PRIVATE_SESSION,
        img_entity: NotificationsEnum.IMG_ENTITY_COMPANY,
        img_id: this.props.company_id
      });
    });
  }
  updateAvailability(psId) {
    var d = {};
    d[Availability.ID] = Number.parseInt(this.state.select_id);
    d[Availability.IS_BOOKED] = 1;
    d[Availability.COMPANY_ID] = this.props.company_id;
    d[Availability.PRESCREEN_ID] = psId;

    var query = `mutation{ edit_availability 
            (${obj2arg(d, { noOuterBraces: true })}){ID}
        }`;

    getAxiosGraphQLQuery(query).then(res => {
      this.setState(prevState => {
        return { loadingSubmit: false };
      });

      // close popup terus
      layoutActions.storeHideFocusCard();
      this.successAddHandler();
    });
  }

  successAddHandler() {
    var link = isRoleAdmin()
      ? `${RootPath}/app/manage-company/${this.props.company_id
      }/scheduled-interview`
      : `${RootPath}/app/my-activity/scheduled-session`;

    var mes = (
      <div>
        Successfully scheduled a call with
        <br />
        <b>
          {this.state.student.first_name} {this.state.student.last_name}
        </b>
        <br />
        on <u>{Time.getString(this.state.select_timestamp)}</u>
        <br />
        <br />
        {/* the link to scheduled iv dah takde */}
        {/* <NavLink onClick={() => { layoutActions.storeHideBlockLoader() }}
                    to={link}>
                    Manage Scheduled Call</NavLink> */}
      </div>
    );

    layoutActions.successBlockLoader(mes);

    // after success add scheduled interview
    // emit to student only
    // emit to reload scheduled interview
    emitHallActivity(ActivityType.PRESCREEN, this.props.student_id);
  }

  onSelectTime(id, timestamp) {
    this.setState(prevState => {
      return { select_id: id, select_timestamp: timestamp };
    });
  }

  render() {
    var view = <Loader size="2" text="Loading.." />;
    if (!this.state.loading) {
      var student = this.state.student;
      view = (
        <div>
          <ProfileCard
            type="student"
            title={student.first_name}
            subtitle={student.last_name}
            img_url={student.img_url}
            img_pos={student.img_pos}
            img_size={student.img_size}
            body={null}
          />

          <AvailabilityView
            user_id={this.props.student_id}
            select_id={this.state.select_id}
            book_only={true}
            onSelect={(id, timestamp) => {
              this.onSelectTime(id, timestamp);
            }}
          />
          <br />
          <button
            onClick={() => {
              this.submitOnClick();
            }}
            disabled={this.state.select_id == -1 || this.state.loadingSubmit}
            className="btn btn-success btn-lg"
          >
            {this.state.loadingSubmit ? (
              <i className="fa fa-spinner fa-pulse left" />
            ) : null}
            {getCfCustomMeta(CFSMeta.TEXT_SCHEDULE_CALL, `Schedule Call`)}
          </button>
        </div>
      );
    }

    return <div>{view}</div>;
  }
}

ScheduledInterviewNew.PropTypes = {
  company_id: PropTypes.number.isRequired,
  student_id: PropTypes.number.isRequired
};
