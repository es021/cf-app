import React from "react";
import * as hallAction from "../../redux/actions/hall-actions";
import {
  addLogCreateCall,
  createGruveoLink,
  joinVideoCall
} from "../partial/session/chat.jsx";
import axios from 'axios';

import * as layoutActions from "../../redux/actions/layout-actions";
import { Time } from "../../lib/time";
import {
  getAxiosGraphQLQuery,
  getWpAjaxAxios,
  postAxios
} from "../../../helper/api-helper";
import obj2arg from "graphql-obj2arg";
import {
  GroupSession,
  Prescreen,
  PrescreenEnum
} from "../../../config/db-config";
import { emitHallActivity } from "../../socket/socket-client";
import {
  IsGruveoEnable,
  IsDailyCoEnable,
  DailyCoCreateRoomUrl,
  ZoomCreateRoomUrl,
} from "../../../config/app-config";

export const TYPE_GROUP_SESSION = "TYPE_GROUP_SESSION";
export const TYPE_PRIVATE_SESSION = "TYPE_PRIVATE_SESSION";

export function startVideoCall(e, { type, user_id, bindedSuccessHandler }) {
  let id, start_time, to_trigger_ids, to_trigger_entity, fn_recDoStart_getQuery, query_entity;

  switch (type) {
    case TYPE_GROUP_SESSION:
      id = e.currentTarget.dataset.id;
      id = Number.parseInt(id);

      start_time = e.currentTarget.dataset.start_time;
      start_time = Number.parseInt(start_time);

      to_trigger_ids = e.currentTarget.dataset.joiners;
      to_trigger_ids = JSON.parse(to_trigger_ids);

      to_trigger_entity = hallAction.ActivityType.GROUP_SESSION_JOIN;
      query_entity = "edit_group_session"
      fn_recDoStart_getQuery = (join_url, start_url) => {
        let updateData = {};
        updateData[GroupSession.ID] = id;
        updateData[GroupSession.JOIN_URL] = join_url;
        updateData[GroupSession.START_URL] = start_url;
        updateData[GroupSession.UPDATED_BY] = user_id;

        // update group session with join_url data
        let query = `mutation { ${query_entity} 
                    (${obj2arg(updateData, { noOuterBraces: true })})
                    {ID}
                }`;
        return query;
      };
      break;

    case TYPE_PRIVATE_SESSION:
      id = e.currentTarget.dataset.id;
      id = Number.parseInt(id);

      start_time = e.currentTarget.dataset.appointment_time;
      start_time = Number.parseInt(start_time);

      to_trigger_ids = e.currentTarget.dataset.participant_id;
      to_trigger_ids = [to_trigger_ids];

      to_trigger_entity = hallAction.ActivityType.PRESCREEN;

      fn_recDoStart_getQuery = (join_url, start_url) => {
        let updateData = {};
        updateData[Prescreen.ID] = id;
        updateData[Prescreen.STATUS] = PrescreenEnum.STATUS_STARTED;
        updateData[Prescreen.JOIN_URL] = join_url;
        updateData[Prescreen.START_URL] = start_url;
        updateData[Prescreen.UPDATED_BY] = user_id;
        query_entity = "edit_prescreen";
        // update group session with join_url data
        let query = `mutation { ${query_entity} 
                    (${obj2arg(updateData, { noOuterBraces: true })})
                    {ID student_id company_id}
                }`;
        return query;
      };
      break;
  }


  const recDoStart = (join_url, start_url) => {
    let query = fn_recDoStart_getQuery(join_url, start_url);
    getAxiosGraphQLQuery(query).then(res => {
      // emit to joiners to reload group session dorang
      for (var i in to_trigger_ids) {
        emitHallActivity(to_trigger_entity, to_trigger_ids[i], null);
      }
      layoutActions.storeHideBlockLoader();

      // window.open(start_url);
      let pre_screen_id = type == TYPE_PRIVATE_SESSION ? id : undefined;
      let group_session_id = type == TYPE_GROUP_SESSION ? id : undefined;
      joinVideoCall(join_url, null, null, group_session_id, pre_screen_id, start_url);
      console.log("res", res);
      res = res.data.data[query_entity];
      bindedSuccessHandler(id, res);
    });
  };

  const confirmCreateWithGruveo = () => {
    let url = createGruveoLink(id, true);
    addLogCreateCall({
      isGruveo: true,
      pre_screen_id: type == TYPE_PRIVATE_SESSION ? id : undefined,
      group_session_id: type == TYPE_GROUP_SESSION ? id : undefined,
      url: url
    });
    recDoStart(url, url);
    window.open(url);
  };

  const confirmCreateWithDailyCo = () => {
    addLogCreateCall({
      isDailyCo: true,
      pre_screen_id: type == TYPE_PRIVATE_SESSION ? id : undefined,
      group_session_id: type == TYPE_GROUP_SESSION ? id : undefined
    });

    layoutActions.loadingBlockLoader(
      "Creating Video Call Session. Please Do Not Close Window."
    );

    postAxios(DailyCoCreateRoomUrl, {})
      .then(data => {
        data = data.data;
        console.log("DailyCoCreateRoomUrl", data);
        if (data == null || data == "" || typeof data != "object") {
          layoutActions.errorBlockLoader(
            "Failed to create video call session. Please check your internet connection"
          );
          return;
        }

        var body = (
          <div>
            <h4 className="text-primary">
              Successfully Created Video Call Session
            </h4>
            <br />
            <a
              // href={data.url}
              // target="_blank"
              className="btn btn-green btn-round-10 btn-lg"
              onClick={() => {

                recDoStart(data.url, data.url);
              }}
            >
              Start Video Call
            </a>
          </div>
        );
        layoutActions.customBlockLoader(body, null, null, null);
      })
      .catch(err => {
        console.log("DailyCoCreateRoomUrl", err);
        console.log("DailyCoCreateRoomUrl", err.data);
        layoutActions.errorBlockLoader(
          "Failed to create video call session. Please check your internet connection"
        );
        return;
      });
  };

  const confirmCreateWithZoom = () => {
    addLogCreateCall({
      isZoom: true,
      pre_screen_id: type == TYPE_PRIVATE_SESSION ? id : undefined,
      group_session_id: type == TYPE_GROUP_SESSION ? id : undefined
    });

    layoutActions.loadingBlockLoader(
      "Creating Video Call Session. Please Do Not Close Window."
    );

    var postData = {
      host_id: user_id
    };
    if (type == TYPE_GROUP_SESSION) {
      postData.group_session_id = id;
    } else if (type == TYPE_PRIVATE_SESSION) {
      postData.pre_screen_id = id;
    }
    axios.post(ZoomCreateRoomUrl, postData)
      .then(data => {
        data = data.data;
        console.log("ZoomCreateRoomUrl", data);
        if (data == null || data == "" || typeof data != "object") {
          layoutActions.errorBlockLoader(
            "Failed to create video call session. Please check your internet connection"
          );
          return;
        }

        var body = (
          <div>
            <h4 className="text-primary">
              Successfully Created Video Call Session
            </h4>
            <br />
            <a
              href={data.url}
              target="_blank"
              className="btn btn-success btn-lg"
              onClick={() => {
                recDoStart(data.join_url, data.start_url);
              }}
            >
              Start Video Call
            </a>
          </div>
        );
        layoutActions.customBlockLoader(body, null, null, null);
      })
      .catch(err => {
        console.log("ZoomCreateRoomUrl", err);
        console.log("ZoomCreateRoomUrl", err.data);
        layoutActions.errorBlockLoader(
          "Failed to create video call session. Please check your internet connection"
        );
        return;
      });
  };


  // New Gruveo
  // choose between zoom or chrome
  const recConfirmCreate = () => {
    if (IsDailyCoEnable) {
      confirmCreateWithDailyCo();
    } else {
      confirmCreateWithZoom();
    }
  };

  // open confirmation if time now is less than start time
  if (Time.getUnixTimestampNow() < start_time) {
    var title = (
      <div>
        It is not the time yet
        <br />
        <small>
          This session was scheduled on
          <br />
          <u>{Time.getString(start_time)}</u>
          <br />
          Continue to start video call now?
        </small>
      </div>
    );
    layoutActions.confirmBlockLoader(title, () => {
      recConfirmCreate();
    });
  } else {
    recConfirmCreate();
  }
}
