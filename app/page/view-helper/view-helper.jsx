import * as layoutActions from "../../redux/actions/layout-actions";
import EventPopup from "../partial/popup/event-popup";
import { NavLink } from "react-router-dom";
import { AppPath, IsNewEventCard } from "../../../config/app-config"
import { EventEnum } from "../../../config/db-config"
import React from "react";
import { isRoleOrganizer, isRoleRec, isRoleStudent } from "../../redux/actions/auth-actions";
import { Time } from "../../lib/time";
import { InterestedButton } from "../../component/interested.jsx";
import { lang } from "../../lib/lang";
import { addEventLog } from "../../redux/actions/other-actions";

export function topRightCloseButton(onClick) {
  return <i
    onClick={() => {
      onClick();
    }}
    className="fa fa-close float-top-right clickable"
    style={{ color: 'red', fontSize: '20px' }}>
  </i>
}
export function getHtmlView(txt) {
  if (typeof txt === "string") {
    txt = txt.replaceAll("\n", "<br>");
    return <span dangerouslySetInnerHTML={{ __html: txt }}></span>;
  }
  return txt;
}
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


export function getEventAction(d, { isPopup, companyName, isRowLayout = false } = {}) {
  let className = "";
  let validActions = []

  // ###########################################################
  // OLD EVENT CARD
  // - with location and interested
  if (!IsNewEventCard) {
    // className = "event-action";
    // let rsvpButton = (
    //   <InterestedButton
    //     customStyle={{
    //       top: "3px",
    //       left: "7px",
    //       width: "max-content",
    //     }}
    //     customView={
    //       ({
    //         // loading,
    //         isModeCount,
    //         isModeAction,
    //         like_count,
    //         onClickModeCount,
    //         is_interested,
    //         onClickModeAction
    //       }) => {
    //         let r = null;

    //         if (isModeAction) {
    //           if (d.is_ended) {
    //             r = <div className="el-ended el-action-item">Event Ended</div>
    //           } else {
    //             if (is_interested) {
    //               r = <div className="el-rsvped el-action-item" onClick={onClickModeAction}><i className="fa fa-check left"></i>Registered</div>
    //             } else {
    //               r = <div className="el-rsvp el-action-item" onClick={onClickModeAction}><i className="fa fa-plus left"></i>RSVP For Event</div>
    //             }
    //           }
    //         } else if (isModeCount) {
    //           let mainText = `See RSVP List`;
    //           r = (
    //             <button
    //               className={`btn btn-sm btn-blue-light btn-round-5 btn-block btn-bold`}
    //               onClick={() => { onClickModeCount(null, "RSVP List") }}>
    //               <i className="fa left fa-user"></i>{mainText}
    //             </button>
    //           );
    //         }
    //         return r
    //       }
    //     }
    //     isModeCount={isRoleRec()}
    //     isModeAction={isRoleStudent()}
    //     finishHandler={is_interested => {
    //       if (isRoleRec()) {
    //         return;
    //       } else if (isRoleStudent()) {
    //         if (is_interested == 1) {
    //           layoutActions.successBlockLoader(
    //             <div>
    //               {lang("Successfully RSVP'ed for event")}
    //               <br></br>
    //               <b>{d.title}</b>
    //               <br></br>
    //               {lang("with")} {companyName}
    //             </div>
    //           );
    //         }
    //       }
    //     }}
    //     ID={d.interested.ID}
    //     is_interested={d.interested.is_interested}
    //     entity={"event"}
    //     entity_id={d.ID}
    //   ></InterestedButton>
    // );

    // validActions.push(rsvpButton);

  }
  // ###########################################################
  // NEW EVENT CARD
  // - url_rsvp , url_join, url_recorded
  else {
    className = isRowLayout ? "event-action-new-row" : "event-action-new"
    let rsvp = null;
    let join = null;
    let recorded = null;
    let ended = null;

    // get five min before start in unix
    let fiveMinBeforeStart = null;
    try {
      fiveMinBeforeStart = d.start_time - (5 * 60);
    }
    catch (err) {
      fiveMinBeforeStart = d.start_time
    }

    // let breakElement = isPopup ? " " : <br></br>;
    let breakElement = " ";
    if (d.url_rsvp && !Time.isPast(fiveMinBeforeStart)) {
      rsvp = <div><a
        onClick={() => {
          window.open(d.url_rsvp, "_blank")
          addEventLog({
            action: "rsvp",
            event_id: d.ID,
            company_id: d.company_id,
          })
        }}
        className="btn btn-sm btn-blue-light text-bold btn-round-5"
      >
        <i className="fa fa-plus left"></i>
        RSVP
        </a>
      </div>;
    }
    if (d.url_join && Time.isBetween(fiveMinBeforeStart, d.end_time)) {
      join = <div>
        <a
          onClick={() => {
            window.open(d.url_join, "_blank")
            addEventLog({
              action: "join",
              event_id: d.ID,
              company_id: d.company_id,
            })
          }}
          className="btn btn-sm btn-green text-bold btn-round-5"
        >
          <i className="fa fa-sign-in left"></i>
          {lang("Join")}
        </a>
      </div>;
    }
    if (Time.isPast(d.end_time)) {
      if (d.url_recorded) {
        recorded = <div>
          <a
            onClick={() => {
              window.open(d.url_recorded, "_blank")
              addEventLog({
                action: "watch_recorded",
                event_id: d.ID,
                company_id: d.company_id,
              })
            }}
            className="btn btn-sm btn-red text-bold btn-round-5"
          >
            <i className="fa fa-play-circle left"></i>
            <div className="show-on-lg-and-more">
              {lang("Watch")}{breakElement}{lang("Recorded")}
            </div>
            <div className="show-on-md-and-less">
              {lang("Watch")} {lang("Recorded")}
            </div>
          </a>
        </div>;
      } else {
        ended = <div>
          <a className="btn btn-sm btn-gray btn-disabled text-bold btn-round-5">
            <div className="show-on-lg-and-more">
              {lang("Event")}{breakElement}{lang("Ended")}
            </div>
            <div className="show-on-md-and-less">
              {lang("Event")} {lang("Ended")}
            </div>
          </a>
        </div>;
      }
    }

    if (isRoleOrganizer()) {
      validActions = [
        join, rsvp, recorded, ended
      ]
    } else if (isRoleStudent()) {
      validActions = [
        join, rsvp, recorded, ended
      ]
    } else if (isRoleRec()) {
      validActions = [
        join, rsvp, recorded, ended
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