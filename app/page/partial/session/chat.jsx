import React, { PropTypes } from "react";
import { Loader } from "../../../component/loader";
import Form from "../../../component/form";
import * as Navigation from "../../../component/navigation";
import axios from 'axios';

//importing for list
import List, { ProfileListItem } from "../../../component/list";
import {
  getAxiosGraphQLQuery,
  getWpAjaxAxios,
  postAxios
} from "../../../../helper/api-helper";
import { UploadUrl, SiteUrl, IsGruveoEnable, ZoomCheckMeetingExpiredUrl, DailyCoCreateRoomUrl } from "../../../../config/app-config";
import { Time } from "../../../lib/time";
import obj2arg from "graphql-obj2arg";
import * as layoutActions from "../../../redux/actions/layout-actions";
import * as NotificationHelper from "../../../../helper/notification-helper";
import { getCF, getOtherRecs, isRoleRec, getAuthUser } from "../../../redux/actions/auth-actions";
import { ActivityType } from "../../../redux/actions/hall-actions";
import { isCompanyOnline } from "../../../redux/actions/user-actions";
import { addLog } from "../../../redux/actions/other-actions";
import * as hallAction from "../../../redux/actions/hall-actions";

import { LogEnum } from "../../../../config/db-config";
import { connect } from "react-redux";
import { BOTH } from "../../../../config/socket-config";
import {
  emitChatMessage,
  socketOn,
  socketOff,
  emitHallActivity
} from "../../../socket/socket-client";
import { Uploader, uploadFile, FileType } from '../../../component/uploader';
import { lang } from "../../../lib/lang";
import notificationConfig from "../../../../config/notification-config";


export function isGruveoLink(join_url) {
  const isGruveo = join_url.indexOf("video-call?room_code") >= 0;
  return isGruveo;
}

export function isDailyCoLink(join_url) {
  const isDailyCo = join_url.indexOf("daily.co") >= 0;
  return isDailyCo;
}

export function addLogCreateCall({
  isDailyCo,
  isZoom,
  isGruveo,
  pre_screen_id,
  session_id,
  group_session_id,
  url
}) {
  let log = null;
  let param = {};

  if (isGruveo == true) {
    log = LogEnum.EVENT_CALL_GRUVEO;
  } else if (isZoom == true) {
    log = LogEnum.EVENT_CALL_ZOOM;
  } else if (isDailyCo == true) {
    log = LogEnum.EVENT_CALL_DAILY_CO;
  }

  if (typeof pre_screen_id !== "undefined") {
    param.pre_screen_id = pre_screen_id;
  }

  if (typeof session_id !== "undefined") {
    param.session_id = session_id;
  }

  if (typeof group_session_id !== "undefined") {
    param.group_session_id = group_session_id;
  }

  // for gruveo and daily co
  if (typeof url !== "undefined") {
    param.url = url;
  }

  if (log != null) {
    addLog(log, param);
  }
}

// New Gruveo
export function createGruveoLink(id, isGroupSession) {
  isGroupSession =
    typeof isGroupSession === "undefined" ? false : isGroupSession;

  let date = new Date();
  let timestamp = date.getTime();
  let room_code = `sjf${timestamp}${isGroupSession ? "gsid" : "sid"}${id}`;
  let toRet = `${SiteUrl}/video-call?room_code=${room_code}`;
  return toRet;
}

export function joinVideoCall(
  join_url,
  session_id,
  expiredHandler = null,
  group_session_id = null,
  pre_screen_id = null,
  start_url = null
) {
  addLog(LogEnum.EVENT_CLICK_JOIN_VIDEO_CALL, {
    pre_screen_id: pre_screen_id,
    group_session_id: group_session_id,
    session_id: session_id,
    join_url: join_url
  });

  let isJoin = false;
  let windowPopup = null;
  let windowId = join_url;
  let windowParam = `scrollbars=no,resizable=no,status=no,location=no, toolbar=no,menubar=no,
                width=600,height=400,left=100,top=100`;
  if (start_url != null) {
    windowPopup = window.open(start_url, windowId, windowParam);
  } else {
    isJoin = true;
    windowPopup = window.open(join_url, windowId, windowParam);
  }

  if (isGruveoLink(join_url) || isDailyCoLink(join_url)) {
    return;
  }

  // #####################################################
  // start post join action
  layoutActions.loadingBlockLoader("Please Wait..");
  var loaded = 0;
  var toLoad = 1;
  // var toLoad = isJoin ? 2 : 1;
  var hasError = false;
  const closeBlockLoader = () => {
    loaded++;
    if (loaded >= toLoad && !hasError) {
      layoutActions.storeHideBlockLoader();
    }
  };

  // 0. prepare data for zoom_ajax request
  var data = {
    join_url: join_url
  };
  if (pre_screen_id !== null) {
    data.pre_screen_id = pre_screen_id;
  }
  if (session_id !== null) {
    data.session_id = session_id;
  }
  if (group_session_id !== null) {
    data.group_session_id = group_session_id;
  }

  axios.post(ZoomCheckMeetingExpiredUrl, data)
    .then(data => {
      data = data.data;
      if (data.is_waiting && isJoin) {
        windowPopup.close();
        layoutActions.errorBlockLoader(
          "Recruiter is not ready yet. Please try again in a few minutes"
        );
        hasError = true;
      } else if (data.is_expired) {
        windowPopup.close();
        layoutActions.errorBlockLoader("This Video Call Session Has Expired.");
        hasError = true;
        if (expiredHandler != null) {
          expiredHandler();
        }
      } else {
        closeBlockLoader();
      }
    })
    .catch(err => {
      closeBlockLoader();
    });
}

class ChatFileUploader extends React.Component {
  constructor(props) {
    super(props);

    this.uploaderOnChange = this.uploaderOnChange.bind(this);
    this.uploaderOnError = this.uploaderOnError.bind(this);
    this.uploaderOnSuccess = this.uploaderOnSuccess.bind(this);

    this.state = {
      error: null,
      currentFile: null,
      fileNameWithoutType: "",
      sending: false,
    }
  }

  onSubmit() {
    if (this.state.currentFile === null) {
      this.setState(() => {
        return { error: lang("Please Select A File First") };
      });
    } else {

      var fileName = this.state.fileNameWithoutType;
      // remove .type from file name


      this.setState({ error: null, sending: true })
      uploadFile(this.state.currentFile, FileType.DOC, fileName).then((res) => {
        if (res.data.url !== null) {
          let fileUrl = `${UploadUrl}/${res.data.url}`;
          this.props.success(fileUrl, this.state.currentFile.name);
          layoutActions.storeHideBlockLoader();
        } else {
          this.setState({ error: lang("Something went wrong. Please try again"), sending: false })
        }
      });
    }
  }

  /* props for Uploader --Start */
  uploaderOnChange(file) {
    console.log("uploaderOnChange");
  }

  uploaderOnError(err) {
    console.log("uploaderOnError", err);
    this.setState(() => {
      return { error: err, currentFile: null };
    });
  }

  uploaderOnSuccess(file, fileNameWithoutType) {
    console.log("uploaderOnSuccess", file);
    this.setState(() => {
      return { error: null, currentFile: file, fileNameWithoutType: fileNameWithoutType };
    });

  }

  render() {
    let v = null;
    v = <div style={{ padding: "10px" }}>
      <Uploader label={lang("Upload File")} name="new-file"
        width="230px"
        type={FileType.CUSTOM}
        getValidFormat={() => {
          return FileType.ALL;
        }}
        getMaxSizeInMb={() => {
          return 50;
        }}
        onSuccess={this.uploaderOnSuccess}
        onChange={this.uploaderOnChange}
        onError={this.uploaderOnError}>
      </Uploader>
      {!this.state.error ? null :
        <div style={{
          marginTop: "12px",
          color: "#f20909"
        }}>{this.state.error}</div>
      }
      <button onClick={() => { this.onSubmit() }}
        disabled={this.state.sending}
        className="btn btn-round-10 btn-block btn-blue"
        style={{ marginTop: "22px", marginBottom: "-26px" }}>
        {this.state.sending ? <i className={`fa fa-spinner fa-pulse left`}></i> : null}
        {this.state.sending ? lang(`Sending...`) : lang(`Send File`)}
      </button>
    </div >


    return v;
  }


}

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.onScrollChatBox = this.onScrollChatBox.bind(this);
    this.loadData = this.loadData.bind(this);
    this.parseMessage = this.parseMessage.bind(this);
    this.createMessageJSON = this.createMessageJSON.bind(this);
    this.parseMessageJSON = this.parseMessageJSON.bind(this);
    this.parseMessageHTML = this.parseMessageHTML.bind(this);

    this.renderList = this.renderList.bind(this);
    this.componentDidUpdateList = this.componentDidUpdateList.bind(this);
    this.getChatInput = this.getChatInput.bind(this);
    this.getChatHeader = this.getChatHeader.bind(this);
    this.addChatToView = this.addChatToView.bind(this);
    this.sendChat = this.sendChat.bind(this);

    this.state = {
      extraData: []
    };

    this.updateHasRead = false;
    this.currentDateList = null;
    this.currentDateExtra = null;

    this.MESSAGE_JSON = "MESSAGE_JSON";
    this.MESSAGE_HTML = "MESSAGE_HTML";

    this.JSON_ZOOM = "ZOOM";
    this.JSON_FILE = "FILE";
    this.unmounted = false;
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  componentWillMount() {
    this.offset = 20;

    socketOn(BOTH.CHAT_MESSAGE, data => {
      if (Navigation.isPageMyInbox()) {
        if (this.props.other_id == data.from_id && !this.unmounted) {
          this.addChatToView(
            data.from_id,
            data.message,
            data.created_at,
            0,
            data.id_message_number
          );
        }
      }
    });
  }

  parseMessage(message) {
    var parsed = false;

    if (parsed == false) {
      parsed = this.parseMessageHTML(message);
    }

    if (parsed == false) {
      parsed = this.parseMessageJSON(message);
    }

    if (parsed == false) {
      parsed = message;
    }

    return parsed;
  }

  // to detect html from previous app
  // onclick="chatActionTrigger
  parseMessageHTML(message) {
    if (
      message.indexOf(this.MESSAGE_HTML) >= 0 ||
      message.indexOf(`onclick="chatActionTrigger`) >= 0
    ) {
      return <div dangerouslySetInnerHTML={{ __html: message }} />;
    } else {
      return false;
    }
  }

  parseMessageJSON(message) {
    if (message.indexOf(this.MESSAGE_JSON) >= 0) {
      var mesData = message.replace(this.MESSAGE_JSON, "");
      try {
        mesData = JSON.parse(mesData);
        console.log("parseMessageJSON", mesData);

        // #######################################################
        // message when video call is created (not used)
        if (mesData.type == this.JSON_ZOOM) {
          return (
            <div>
              <small style={{ color: "grey" }}><i>[AUTO MESSAGE]</i></small>
              <br />
              I have created a video call session.{" "}
              <a
                className={"btn-link"}
                onClick={() => {
                  joinVideoCall(mesData.data.join_url, this.props.session_id);
                }}
              >
                <b>Join Now</b>
              </a>
            </div>
          );
        }
        // #######################################################
        // message when file is sent
        else if (mesData.type == this.JSON_FILE) {
          return <a href={mesData.data.file_url} target="_blank" className="chat-file">
            <i className="fa fa-file fa-2x"></i>
            <div className="cf-name">{mesData.data.file_name}</div>
          </a>
        }
        else {
          return JSON.stringify(mesData);
        }
      } catch (err) {
        return false;
      }
    }

    return false;
  }

  createMessageJSON(type, data) {
    var am = {
      type: type,
      data: data
    };
    return this.MESSAGE_JSON + JSON.stringify(am);
  }

  isSelfCompany() {
    return this.props.is_company_self;
  }

  isOtherCompany() {
    return this.props.is_company_other;
  }

  getWhichCompany(selfKey, otherKey) {
    if (this.props.is_company_chat === true) {
      if (this.props.is_company_self) {
        return selfKey;
      }

      if (this.props.is_company_other) {
        return otherKey;
      }
    }

    return "";
  }

  // ##############################################################
  // function for list
  loadData(page, offset) {
    // todos
    var query = `query{
            messages(which_company : "${this.getWhichCompany(
      "user_1",
      "user_2"
    )}",
                user_1:${this.props.self_id}, user_2:${this.props.other_id}, 
                page:${page},offset:${offset}){
                id_message_number message has_read from_user_id created_at
                recruiter { first_name last_name }
              }}`;

    return getAxiosGraphQLQuery(query);
  }

  getDataFromRes(res) {
    return res.data.data.messages;
  }

  addChatToView(
    from,
    message,
    created_at,
    has_read = 1,
    id_message_number = null,
    recruiter = null
  ) {
    var mesObj = {
      from_user_id: from,
      message: message,
      created_at: created_at,
      has_read: has_read,
      id_message_number: id_message_number,
      recruiter: recruiter
    };
    var newData = this.renderList(mesObj, 0, true);

    // add to view
    this.setState(prevState => {
      prevState.extraData.push(newData);
      return { extraData: prevState.extraData };
    });
  }

  onScrollChatBox(e) {
    // let element = e.target
    // if (element.scrollTop == 0) {
    //   console.log("top of scroll");
    //   console.log(this.listComponent);
    //   if (this.listComponent.showLoadMore()) {
    //     this.listComponent.appendButtonOnClick();
    //   }
    // }
  }
  scrollToBottom() {
    if (this.chatBox) {
      this.chatBox.scrollTop = 99999999;
    }
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }

  sendSmsNotificationIfNeeded(id_message_number) {
    // 1. check if message from company
    if (this.props.is_company_self) {
      // 2. check if first message
      let messageCount = id_message_number.split(":");
      messageCount = messageCount[messageCount.length - 1];
      if (messageCount == "1") {
        let company_id = this.props.self_id;
        let user_id = this.props.other_id

        NotificationHelper.sendSmsByUserId(
          user_id,
          notificationConfig.Type.COMPANY_START_CHAT,
          { company_id: company_id, cf: getCF() }
        );
      }
    }
  }
  sendChat(mes = null) {
    if (this.props.disableChat) {
      return;
    }

    if (mes == null) {
      mes = this.chatInput.value;
    }

    if (mes == "" || mes == null) {
      return;
    }

    // post to server -- db and socket
    var ins = {
      sender_id: this.props.self_id,
      receiver_id: this.props.other_id,
      which_company: this.getWhichCompany("sender_id", "receiver_id"),
      message: mes,
      recruiter_id: isRoleRec() ? getAuthUser().ID : null
    };

    // add to db
    // todos
    var query = `mutation{add_message(${obj2arg(ins, {
      noOuterBraces: true
    })}) {id_message_number}}`;
    getAxiosGraphQLQuery(query).then(res => {
      let id_message_number = res.data.data.add_message.id_message_number;
      // add to socket
      // todos

      this.sendSmsNotificationIfNeeded(id_message_number);

      emitChatMessage(
        this.props.self_id,
        this.props.other_id,
        this.props.is_company_other,
        mes,
        Time.getUnixTimestampNow(),
        id_message_number
      );

      // empty value
      this.chatInput.value = "";


      let recruiter = {
        first_name: getAuthUser().first_name,
        last_name: getAuthUser().last_name,
      }
      this.addChatToView(
        this.props.self_id,
        mes,
        Time.getUnixTimestampNow(),
        1,
        id_message_number,
        recruiter
      );
    });
  }


  getChatHeader() {
    if (this.props.is_hide_header) {
      return null;
    }
    var d = this.props.other_data;

    // info -------
    var label = (
      <span>
        {d.first_name + " "}
        <small>{d.last_name}</small>
      </span>
    );
    var title = label;

    var status = null;
    if (this.props.is_company_other) {
      status = isCompanyOnline(this.props.online_companies, this.props.other_id)
        ? "Online"
        : "Offline";
    } else {
      status = this.props.online_users[d.ID] == 1 ? "Online" : "Offline";
    }

    var info = (
      <ProfileListItem
        title={title}
        img_url={d.img_url}
        img_pos={d.img_pos}
        img_size={d.img_size}
        subtitle={status}
        img_dimension={"50px"}
        type="student"
      />
    );

   
    return (
      <div className="chat-header">
        <div className="ch-info">{info}</div>
        {/* <div className="ch-action">{action}</div> */}
      </div>
    );
  }

  // file
  addFileOnClick() {
    let noClose = false;
    layoutActions.customViewBlockLoader(null,
      <ChatFileUploader
        success={(fileUrl, fileName) => {
          this.sendChat(
            this.createMessageJSON(this.JSON_FILE, { file_url: fileUrl, file_name: fileName })
          );
        }}></ChatFileUploader>,
      noClose);
  }
  startVideoOnClick() {
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
              className="btn btn-green btn-round-10 btn-lg"
              onClick={() => {
                this.sendChat(
                  this.createMessageJSON(this.JSON_ZOOM, { join_url: data.url })
                );
                joinVideoCall(data.url, this.props.session_id);
                layoutActions.storeHideBlockLoader();
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
        layoutActions.errorBlockLoader(
          "Failed to create video call session. Please check your internet connection"
        );
        return;
      });
  }

  getChatInput() {
    let addFileButton = <div onClick={(e) => { this.addFileOnClick(e) }}
      className="btn-add-file">
      <i className="fa fa-paperclip fa-2x"></i>
    </div>

    let startVideoButton = isRoleRec() ? <div onClick={(e) => { this.startVideoOnClick(e) }}
      className="btn-add-file">
      <i className="fa fa-video-camera fa-2x"></i>
    </div> : null

    return (
      <div className="chat-input">
        {startVideoButton}
        {addFileButton}
        <textarea
          ref={v => (this.chatInput = v)}
          rows="3"
          onKeyPress={ev => {
            //console.log(ev.ctrlKey);
            if (ev.key == "Enter" && !ev.ctrlKey) {
              this.sendChat();
              ev.preventDefault();
            }

            if (ev.key == "Enter" && ev.ctrlKey && this.chatInput.value != "") {
              //console.log(this.chatInput.value);
              ev.persist();
              this.chatInput.value += "\n";
              ev.preventDefault();
            }
          }}
          placeholder={lang(`Ask New Question..`)}
          name="message"
        />
        <button
          disabled={this.props.disableChat}
          className="btn-send btn btn-blue"
          onClick={() => this.sendChat()}
        >
          {lang("Send")}
        </button>
      </div>
    );
  }

  renderList(d, i, isExtraData = false) {
    // create date item starts --------------------
    var dateItem = null;
    var date = Time.getDate(d.created_at);
    var toCreateDate = null;
    if (!isExtraData && date != this.currentDateList) {
      toCreateDate = this.currentDateList;
      // the first one has to be the default of currentDateExtra
      if (this.currentDateList == null) {
        this.currentDateExtra = date;
      }
      this.currentDateList = date;
    }

    if (isExtraData && date != this.currentDateExtra) {
      toCreateDate = date;
      this.currentDateExtra = date;
    }

    if (toCreateDate !== null) {
      dateItem = <div className="chat-item special-item">{toCreateDate}</div>;
    }
    // create date Item finish -----------------------

    var isMyMessage = d.from_user_id == this.props.self_id;
    var itemClass = isMyMessage ? "self-item" : "other-item";
    var chatItem = (
      <div className={`chat-item ${itemClass}`}>
        <p className="message">
          {this.parseMessage(d.message)}
          {/* <br></br>Has read - {d.has_read}
                <br></br>Id - {d.id_message_number} */}
        </p>
        <div className="timestamp">
          {isMyMessage && isRoleRec() && d.recruiter ? <span>sent by {d.recruiter.first_name} {d.recruiter.last_name} &middot; </span> : null}
          {Time.getString(d.created_at)}</div>
        {/* {date} -  */}
      </div>
    );

    // update has read to 1
    if (d.has_read == 0) {
      if (d.from_user_id != this.props.self_id) {
        this.updateToHasRead(d.id_message_number);
      }
    }

    if (dateItem == null) {
      return chatItem;
    } else {
      return [dateItem, chatItem];
    }
  }

  updateToHasRead(id_message_number) {
    getAxiosGraphQLQuery(`mutation{edit_message
        (id_message_number :"${id_message_number}", has_read:1){
            has_read }}`);

    this.updateHasRead = true;
  }

  componentDidUpdateList(isAppend) {
    if (!isAppend) {
      this.scrollToBottom();
    }

    if (this.updateHasRead) {
      hallAction.storeLoadActivity(hallAction.ActivityType.INBOX_COUNT);
      this.updateHasRead = false;
    }
  }

  render() {
    return (
      <div id="chat">
        {this.getChatHeader()}
        <div className="chat-box" onScroll={this.onScrollChatBox} ref={v => (this.chatBox = v)}>
          <List ref={v => (this.listComponent = v)}
            type="append-top"
            appendText="Load Previous"
            getDataFromRes={this.getDataFromRes}
            loadData={this.loadData}
            extraData={this.state.extraData}
            offset={this.offset}
            componentDidUpdate={this.componentDidUpdateList}
            renderList={this.renderList}
          />
        </div>
        {this.getChatInput()}
      </div>
    );
  }
}

Chat.propTypes = {
  is_company_chat: PropTypes.bool,
  is_company_self: PropTypes.bool,
  is_company_other: PropTypes.bool,
  is_hide_header: PropTypes.bool,
  can_do_multiple: PropTypes.bool,
  self_id: PropTypes.number.isRequired,
  isRec: PropTypes.bool.isRequired,
  session_id: PropTypes.number.isRequired,
  disableChat: PropTypes.bool.isRequired,
  other_id: PropTypes.number.isRequired,
  other_data: PropTypes.object.isRequired
};

Chat.defaultProps = {
  is_hide_header: false,
  is_company_chat: false,
  is_company_self: false,
  is_company_other: false,
  can_do_multiple: false
};

function mapStateToProps(state, ownProps) {
  return {
    online_users: state.user.online_users,
    online_companies: state.user.online_companies
  };
}

export default connect(mapStateToProps, null)(Chat);
