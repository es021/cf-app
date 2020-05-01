import * as layoutActions from "../../redux/actions/layout-actions";
import EventPopup from "../partial/popup/event-popup";
import { NavLink } from "react-router-dom";
import { AppPath, IsNewEventCard } from "../../../config/app-config"
import { EventEnum } from "../../../config/db-config"
import React from "react";
import { isRoleRec, isRoleStudent } from "../../redux/actions/auth-actions";
import { Time } from "../../lib/time";
import { InterestedButton } from "../../component/interested.jsx";

export function animateHide(el, finishHandler) {
  el.className = el.className += " animate-hide";
  el.style.opacity = 0;
  setTimeout(() => {
    el.parentNode.removeChild(el);
    if (finishHandler) {
      finishHandler();
    }
  }, 500);
}

export function getHrefValidUrl(url) {
  if (url.indexOf("http") <= -1) {
    return "//" + url;
  }

  return url;
}

export function getEventTitle(d) {
  return <a className="btn-link text-bold" onClick={() => {
    layoutActions.storeUpdateFocusCard(d.title, EventPopup, {
      id: d.ID,
    });
  }}>{d.title}</a>
}

export function getEventLocation(d) {
  if (IsNewEventCard) {
    return null;
  }
  let notSpecified = <i className="text-muted">Not Speficied</i>;
  let locationIcon = <i className="fa fa-map-marker left" style={{ marginRight: "7px" }}></i>;
  let locationText = <div className="el-location-text">{locationIcon}{d.location}</div>
  let location = <div className="el-location">
    {!d.location
      ? [locationIcon, notSpecified]
      : <span>
        {
          d.type == EventEnum.TYPE_VIRTUAL
            ? <b><a target="_blank" href={d.location}><u>{locationText}</u></a></b> // location jadi url utk virtual
            : locationText // location biasa untuk physical
        }
      </span>
    }
  </div>
  return <small className="text-muted-dark">
    {location}
  </small>
}


export function getEventAction(d, { isPopup, companyName } = {}) {
  let className = "";
  let validActions = []

  // ###########################################################
  // OLD EVENT CARD
  // - with location and interested
  if (!IsNewEventCard) {
    className = "event-action";
    let rsvpButton = (
      <InterestedButton
        customStyle={{
          top: "3px",
          left: "7px",
          width: "max-content",
        }}
        customView={
          ({
            // loading,
            isModeCount,
            isModeAction,
            like_count,
            onClickModeCount,
            is_interested,
            onClickModeAction
          }) => {
            let r = null;

            if (isModeAction) {
              if (d.is_ended) {
                r = <div className="el-ended el-action-item">Event Ended</div>
              } else {
                if (is_interested) {
                  r = <div className="el-rsvped el-action-item" onClick={onClickModeAction}><i className="fa fa-check left"></i>Registered</div>
                } else {
                  r = <div className="el-rsvp el-action-item" onClick={onClickModeAction}><i className="fa fa-plus left"></i>RSVP For Event</div>
                }
              }
            } else if (isModeCount) {
              let mainText = `See RSVP List`;
              r = (
                <button
                  className={`btn btn-sm btn-blue-light btn-round-5 btn-block btn-bold`}
                  onClick={() => { onClickModeCount(null, "RSVP List") }}>
                  <i className="fa left fa-user"></i>{mainText}
                </button>
              );
            }
            return r
          }
        }
        isModeCount={isRoleRec()}
        isModeAction={isRoleStudent()}
        finishHandler={is_interested => {
          if (isRoleRec()) {
            return;
          } else if (isRoleStudent()) {
            if (is_interested == 1) {
              layoutActions.successBlockLoader(
                <div>
                  Successfully RSVP'ed for event
                  <br></br>
                  <b>{d.title}</b>
                  <br></br>
                  with {companyName}
                </div>
              );
            }
          }
        }}
        ID={d.interested.ID}
        is_interested={d.interested.is_interested}
        entity={"event"}
        entity_id={d.ID}
      ></InterestedButton>
    );

    validActions.push(rsvpButton);

  }
  // ###########################################################
  // NEW EVENT CARD
  // - url_rsvp , url_join, url_recorded
  else {
    className = "event-action-new"
    let rsvp = null;
    let join = null;
    let recorded = null;
    let ended = null;
    let breakElement = isPopup ? " " : <br></br>;
    if (d.url_rsvp && !Time.isPast(d.start_time)) {
      rsvp = <div><a target="_blank" className="btn btn-sm btn-blue-light text-bold btn-block btn-round-5" href={d.url_rsvp}>
        <i className="fa fa-plus left"></i>
        RSVP
        </a>
      </div>;
    }
    if (d.url_join && Time.isBetween(d.start_time, d.end_time)) {
      join = <div><a target="_blank" className="btn btn-sm btn-green btn-block text-bold btn-round-5" href={d.url_join}>
        <i className="fa fa-sign-in left"></i>
        Join
        </a>
      </div>;
    }
    if (Time.isPast(d.end_time)) {
      if (d.url_recorded) {
        recorded = <div>
          <a target="_blank" className="btn btn-sm btn-red btn-block text-bold btn-round-5" href={d.url_recorded}>
            <i className="fa fa-play-circle left"></i>
            <div className="show-on-lg-and-more">
              Watch{breakElement}Recorded
            </div>
            <div className="show-on-md-and-less">
              Watch Recorded
            </div>
          </a>
        </div>;
      } else {
        ended = <div>
          <a className="btn btn-sm btn-gray btn-disabled btn-block text-bold btn-round-5">
            <div className="show-on-lg-and-more">
              Event{breakElement}Ended
            </div>
            <div className="show-on-md-and-less">
              Event Ended
            </div>
          </a>
        </div>;
      }
    }

    if (isRoleStudent()) {
      validActions = [
        join, rsvp, recorded, ended
      ]
    } else if (isRoleRec()) {
      validActions = [
        join, recorded, ended
      ]
    }
  }

  return <div className={className}>
    {validActions}
  </div>;
}

export function getCompanyTitle(d) {
  return <NavLink onClick={() => { layoutActions.storeHideFocusCard() }}
    className="btn-link text-bold" to={`${AppPath}/company/${d.ID}`}>{d.name}</NavLink>
}