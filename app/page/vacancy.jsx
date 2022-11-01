import React, { Component } from "react";
import PropTypes from "prop-types";
import { Loader } from "../component/loader";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { DocLinkEnum, LogEnum } from "../../config/db-config";
import ProfileCard from "../component/profile-card.jsx";
import PageSection from "../component/page-section";
import { CustomList } from "../component/list";
import NotFoundPage from "./not-found";
//import FacebookProvider, { Page, ShareButton } from 'react-facebook';
import { AppConfig, RootPath, SiteUrl } from "../../config/app-config";
import { NavLink } from "react-router-dom";
import { addLog } from "../redux/actions/other-actions";
import { getAuthUser, getCF, isRoleStudent } from "../redux/actions/auth-actions";
import { InterestedButton } from "../component/interested";
import { getHrefValidUrl, getCompanyTitle } from "./view-helper/view-helper";
import { lang } from "../lib/lang";
import { addVacancyInfoIfNeeded, isVacancyInfoNeeded } from "../../config/vacancy-config";

function applyOnClick(obj, onClickModeAction) {
  console.log("obj", obj);
  let url = obj.application_url;
  if (url) {
    url = getHrefValidUrl(url);
    window.open(url, "_blank");
  }
  if (onClickModeAction) {
    onClickModeAction();
  }
}

export function getApplyButton(objVacancy, type) {
  if (!isRoleStudent()) {
    return null;
  }
  let d = objVacancy;
  return <InterestedButton
    customStyle={{
      top: "3px",
      left: "7px",
      width: "max-content",
    }}
    customView={
      ({
        loading,
        is_interested,
        onClickModeAction
      }) => {
        let r = null;
        if (loading) {
          r = <div className="action-item action-loading"><i className="fa fa-spinner fa-pulse left"></i>{lang("Loading")}</div>
        } else if (is_interested) {
          r = <div className="action-item action-done" onClick={onClickModeAction}><i className="fa fa-check left"></i>{lang("Applied")}</div>
        } else {
          r = <div className="action-item action-not-done"
            onClick={() => { applyOnClick(objVacancy, onClickModeAction); }}>
            <i className="fa fa-plus left"></i>{lang("Apply")}
          </div>
        }
        return <div className={`vacancy-action type-${type}`}>{r}</div>
      }
    }
    isModeCount={false}
    isModeAction={true}
    is_interested={d.interested.is_interested}
    ID={d.interested.ID}
    entity={"vacancies"}
    entity_id={d.ID}
  ></InterestedButton>
}
export default class VacancyPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      loading: true
    };
  }

  componentWillMount() {
    var id = null;

    if (this.props.match) {
      id = this.props.match.params.id;
    } else {
      id = this.props.id;
    }

    var logData = {
      id: Number.parseInt(id),
      location: window.location.pathname
    };
    addLog(
      LogEnum.EVENT_VISIT_VACANCY,
      JSON.stringify(logData),
      getAuthUser().ID
    );
    // @custom_vacancy_info
    var query = `query {
              vacancy(ID:${id}, user_id:${getAuthUser().ID}) {
                ID
                company_id
                location
                company {ID name}
                title
                description
                requirement
                open_position
                type
                application_url
                ${addVacancyInfoIfNeeded(getCF(), "specialization")} 
                updated_at
                interested{ID is_interested}
            }}`;

    getAxiosGraphQLQuery(query).then(res => {
      this.setState(() => {
        return { data: res.data.data.vacancy, loading: false };
      });
    });
  }

  render() {
    var id = null;
    var vacan = this.state.data;
    var view = null;

    if (!this.props.isPopup) {
      document.setTitle("Vacancy");
    }

    if (this.state.loading) {
      view = <Loader size="3" text={lang("Loading Vacancy Information...")}></Loader>;
    } else {
      if (this.state.data === null) {
        view = <NotFoundPage {...this.props}></NotFoundPage>;
      } else {
        // let isModeCount = this.props.isRecThisCompany;
        // let isModeAction = isRoleStudent();
        // let interestedBtn = (
        //   <InterestedButton
        //     customStyle={{
        //       position: "initial",
        //       //   top: "3px",
        //       //   left: "20px",
        //       //   width: "max-content"
        //     }}
        //     isModeCount={isModeCount}
        //     isModeAction={isModeAction}
        //     ID={vacan.interested.ID}
        //     is_interested={vacan.interested.is_interested}
        //     entity={"vacancies"}
        //     entity_id={vacan.ID}
        //     tooltipObj={{
        //       arrowPosition: "left",
        //       left: "41px",
        //       bottom: "-2px",
        //       width: "97px",
        //       tooltip: "Show Interest",
        //       debug: false
        //     }}
        //   ></InterestedButton>
        // );

        if (!this.props.isPopup) {
          document.setTitle(lang("Vacancy") + " - " + vacan.title);
        }

        var non = <div className="text-muted">{lang("Nothing To Show Here")}</div>;

        // @custom_vacancy_info
        var items = [
          isVacancyInfoNeeded(getCF(), "specialization") && vacan.specialization != null ?
            <span>
              <i className="fa fa-hashtag left"></i>
              {vacan.specialization}
            </span>
            : null,
          !vacan.type ? null : (
            <span>
              <i className="fa fa-star left"></i>
              {vacan.type}
            </span>
          ),
          !vacan.open_position ? null : (
            <span>
              <i className="fa fa-suitcase left"></i>
              {vacan.open_position} Open Position{vacan.open_position > 1 ? 's' : ''}
            </span>
          ),
          !vacan.location ? null : (
            <span>
              <i className="fa fa-map-marker left"></i>
              {vacan.location}
            </span>
          ),
          <span>
            <i className="fa fa-building left"></i>
            {getCompanyTitle(vacan.company)}
          </span>,
          !vacan.application_url ? null : (
            <span>
              <i className="fa fa-link left"></i>
              <a target="_blank" href={getHrefValidUrl(vacan.application_url)}>
                {vacan.application_url}
              </a>
            </span>
          )
        ];

        //var share_url = `${SiteUrl}/auth/vacancy/${vacan.ID}`;
        //var share_url = window.location.href;
        //console.log(share_url);

        var about = (
          <div>
            <CustomList className="empty" items={items}></CustomList>
            {/* <FacebookProvider appId={AppConfig.FbAppId}>
                        <ShareButton iconClassName="fa fa-facebook left" className="btn btn-blue btn-sm"
                            href={share_url}>Share</ShareButton>
                    </FacebookProvider> */}
          </div>
        );

        var desc =
          vacan.description !== null ? <p dangerouslySetInnerHTML={{ __html: vacan.description }}></p> : non;
        var req = vacan.requirement !== null ? <p dangerouslySetInnerHTML={{ __html: vacan.requirement }}></p> : non;

        view = (
          <div>
            <PageSection
              className="left"
              title={vacan.title}
              body={
                <div>
                  {" "}
                  {getApplyButton(vacan, "button")}
                  <div style={{ height: "10px" }}></div>
                  {about}
                </div>
              }
            ></PageSection>
            <PageSection
              className="left"
              title={lang("Description")}
              body={desc}
            ></PageSection>
            <PageSection
              className="left"
              title={lang("Requirement")}
              body={req}
            ></PageSection>
          </div>
        );
      }
    }

    return view;
  }
}

VacancyPage.propTypes = {
  id: PropTypes.number,
  isPopup: PropTypes.bool,
  isRecThisCompany: PropTypes.bool
};
