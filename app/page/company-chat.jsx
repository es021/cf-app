// import { SupportSession, LogEnum } from "../../config/db-config";
// import { addLog } from "../redux/actions/other-actions.js";

import React, { Component } from "react";
import Chat from "./partial/session/chat.jsx";
import { SupportUserID, RootPath } from "../../config/app-config";

import {
  getAuthUser,
  isRoleStudent,
  isRoleRec
} from "../redux/actions/auth-actions";
import { NavLink } from "react-router-dom";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { Loader } from "../component/loader";
import CompaniesSection from "./partial/hall/companies";
import { createUserTitle } from "./users";
import { createImageElement } from "../component/profile-card.jsx";
import { Time } from "../lib/time";

import { BOTH } from "../../config/socket-config";
import { socketOn } from "../socket/socket-client";
import EmptyState from "../component/empty-state.jsx";
import { createCompanyTitle } from "./admin-company.jsx";
import { isCompanyOnline } from "../redux/actions/user-actions";
import { connect } from "react-redux";
import { lang } from "../lib/lang.js";


export class StudentChatStarter extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.match) {
      this.ID = this.props.match.params.id;
    } else {
      this.ID = this.props.id;
    }

    this.getChatBox = this.getChatBox.bind(this);
    this.state = {
      user: false,
      loading: true
    };

    this.self_company_id = getAuthUser().rec_company;
  }

  componentWillMount() {
    var query = `query{ user(ID:${this.ID}) {  
        ID first_name last_name img_url img_size img_pos
    }}`;

    getAxiosGraphQLQuery(query).then(res => {
      this.setState(() => {
        var user = res.data.data.user;
        return { user: user, loading: false };
      });
    });
  }

  getChatBox() {
    if (this.state.loading) {
      return (
        <div style={{ padding: "10px" }}>
          <Loader text={lang("Initializing chat with student")} />
        </div>
      );
    } else {
      let view = [];
      view.push(
        <div className="col-sm-6 ">
          <Chat
            is_company_chat={true}
            is_company_self={true}
            is_company_other={false}
            session_id={null}
            disableChat={false}
            other_id={Number.parseInt(this.ID)}
            other_data={this.state.user}
            self_id={this.self_company_id}
          />
        </div>
      );

      view.push(
        <div className="col-sm-6 text-left">
          <h4>{lang("While you're waiting...")}</h4>
          <ul style={{ paddingLeft: "40px" }} className="normal text-muted">
            <li>
              {lang("You can start other conversation with different student at")}{" "}
              <NavLink
                target="_blank"
                // to={`${RootPath}/app/my-activity/student-listing`}
                to={`${RootPath}/app/browse-student`}
              >
                {lang("Student Listing")}
              </NavLink>{" "}{lang("page")}
            </li>
            <li>
              {lang("This conversation will be saved in")}{" "}
              <NavLink target="_blank" to={`${RootPath}/app/my-inbox`}>
                {lang("your inbox.")}
              </NavLink>
            </li>
          </ul>
        </div>
      );

      return view;
    }
  }

  render() {
    document.setTitle(lang(`Chat With ${this.state.user.first_name}`));
    return <div className="company-chat-student">{this.getChatBox()}</div>;
  }
}

// require("../css/forum.scss");
// require("../css/support-chat.scss");
// require("../css/company-chat.scss");

// Link from
export class CompanyChatStarter extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.match) {
      this.ID = this.props.match.params.id;
    } else {
      this.ID = this.props.id;
    }

    this.getChatBox = this.getChatBox.bind(this);
    this.state = {
      company: false,
      loading: true
    };

    this.self_id = getAuthUser().ID;
  }

  componentWillMount() {
    var query = `query{ company(ID:${this.ID}) {  
        ID name img_url img_size img_position
    }}`;

    getAxiosGraphQLQuery(query).then(res => {
      this.setState(() => {
        var company = res.data.data.company;
        company.first_name = company.name;
        return { company: company, loading: false };
      });
    });
  }

  getChatBox() {
    if (this.state.loading) {
      return (
        <div style={{ padding: "10px" }}>
          <Loader text={lang("Initializing chat with recruiter")} />
        </div>
      );
    } else {
      let view = [];
      view.push(
        <div className="col-sm-6 ">
          <Chat
            is_company_chat={true}
            is_company_self={false}
            is_company_other={true}
            session_id={null}
            disableChat={false}
            other_id={Number.parseInt(this.ID)}
            other_data={this.state.company}
            self_id={this.self_id}
          />
        </div>
      );

      view.push(
        <div className="col-sm-6 text-left">
          <h4>{lang("While you're waiting...")}</h4>
          <ul style={{ paddingLeft: "40px" }} className="normal text-muted">
            <li>
              {lang("Remember to research about")}{" "}
              <NavLink
                target="_blank"
                to={`${RootPath}/app/company/${this.ID}`}
              >
                {this.state.company.first_name}
              </NavLink>
            </li>
            <li>{lang("Waiting time may vary, so be patient with response time.")}</li>
            <li>
              {lang("This conversation will be saved in")}{" "}
              <NavLink target="_blank" to={`${RootPath}/app/my-inbox`}>
                {lang("your inbox.")}
              </NavLink>
            </li>
          </ul>
        </div>
      );

      return view;
    }
  }

  render() {
    document.setTitle(`Chat With ${this.state.company.first_name}`);
    return <div className="company-chat-student">{this.getChatBox()}</div>;
  }
}

// page for support to see all the chat list with users
// has to create another table for list of chats with support

// only limit to one support account
// to prevent from real time conflict

class CompanyChatInbox extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = getAuthUser();
    this.handleScroll = this.handleScroll.bind(this);
    this.getChatBox = this.getChatBox.bind(this);
    this.getChatList = this.getChatList.bind(this);
    this.changeChat = this.changeChat.bind(this);
    this.loadChatList = this.loadChatList.bind(this);

    this.isChangeChat = false;
    this.chatListBody = null;

    this.authUser = getAuthUser();
    if (isRoleStudent()) {
      this.userId = this.authUser.ID;
    } else if (isRoleRec()) {
      this.companyId = this.authUser.rec_company;
    }

    this.smallestOrderKey = null;
    this.biggestOrderKey = null;

    this.state = {
      noMore: false,
      loadingBottom: false,
      loadingTop: false,
      loading: true,
      sessions: {},
      current_user: null,
      newChat: [],

    };
  }

  componentWillMount() {
    this.loadChatList({});

    socketOn(BOTH.CHAT_MESSAGE, data => {
      var keyId = this.getKey(data.from_id);

      // if not exist?
      // list of newChat
      if (typeof this.state.sessions[keyId] === "undefined") {
        // this.setState(prevState => {
        //   var newChat = prevState.newChat;
        //   if (newChat.indexOf(data.from_id) <= -1) {
        //     newChat.push(data.from_id);
        //   }
        //   return { newChat: newChat };
        // });
        this.loadChatList({ newer: true });
        return;
      }

      // update last_message and last message time
      // set is new to true
      this.setState(prevState => {
        var obj = prevState.sessions[keyId];

        // if (this.state.current_user != keyId) {
        //   obj.isNew = true;
        // }

        obj.last_message = data.message;
        obj.last_message_time = data.created_at;
        if (prevState.current_user != keyId) {
          if (!obj.total_unread) {
            obj.total_unread = 0;
          }
          obj.total_unread++;
          obj.isNew = true;
        }

        prevState.sessions[keyId] = obj;

        return { sessions: prevState.sessions };
      });
    });
  }

  handleScroll(e) {
    let myDiv = e.currentTarget;
    let OFFSET = 20;
    // console.log("myDiv.offsetHeight + myDiv.scrollTop", myDiv.offsetHeight + myDiv.scrollTop);
    // console.log("myDiv.scrollHeight", myDiv.scrollHeight);
    if (myDiv.offsetHeight + myDiv.scrollTop >= (myDiv.scrollHeight - OFFSET)) {
      this.loadChatList({ older: true });
      // console.log("botom")
      // console.log("botom")
    }
  }

  getEntityObj(data) {
    let entity = {};
    try {
      if (data.support_id == SupportUserID) {
        entity = {
          _type: "user",
          ID: data.support.ID,
          first_name: data.support.first_name,
          last_name: data.support.last_name,
          img_url: data.support.img_url,
          img_pos: data.support.img_pos,
          img_size: data.support.img_size
        };
      } else if (isRoleRec()) {
        entity = {
          _type: "user",
          ID: data.user.ID,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          img_url: data.user.img_url,
          img_pos: data.user.img_pos,
          img_size: data.user.img_size
        };
      } else if (isRoleStudent()) {
        entity = {
          _type: "company",
          ID: data.company.ID,
          first_name: data.company.name,
          name: data.company.name, // needed to create company title link
          last_name: "",
          img_url: data.company.img_url,
          img_pos: data.company.img_pos,
          img_size: data.company.img_size
        };
      }
    } catch (err) {
      console.error("Error here");
    }
    return {
      ...data,
      entity: entity
    };
  }

  loadChatList({ newer, older }) {
    if (newer && this.state.loadingTop) {
      return
    }
    if (older && (this.state.loadingBottom || this.state.noMore)) {
      return
    }

    const OFFSET = 8;

    let param = ` offset:${OFFSET} `;
    let field = "";
    let fieldUser = `user { ID first_name last_name img_url img_pos img_size}`;
    let fieldSupport = `support { ID first_name last_name img_url img_pos img_size}`;
    let fieldCompany = `company { ID name img_url img_pos img_size}`;

    if (isRoleStudent()) {
      param += ` user_id:${this.userId} `;
      field = `${fieldUser} ${fieldCompany}`;
    } else if (isRoleRec()) {
      param += ` support_id:${this.companyId} `;
      field = `${fieldUser}`;
    }

    if (newer) {
      param += ` bigger_than_key:"${this.biggestOrderKey}" `
    }
    if (older) {
      param += ` smaller_than_key:"${this.smallestOrderKey}" `
    }


    var query = `query{ support_sessions( ${param} ) {  
            ID
            order_key
            user_id
            support_id
            created_at
            last_message_time
            last_message
            last_rec_name
            total_unread
            ${field} ${fieldSupport}
          }}`;


    let preLoadState = {}
    if (newer) {
      preLoadState.loadingTop = true;
    }
    if (older) {
      preLoadState.loadingBottom = true;
    }
    this.setState(preLoadState);

    getAxiosGraphQLQuery(query).then(res => {
      this.setState(prevState => {
        var sessions = res.data.data.support_sessions;
        console.log("sessions", sessions);
        var totalResponse = sessions.length;
        var data = prevState.sessions;
        var current = null;

        for (var i in sessions) {
          var d = sessions[i];
          d = this.getEntityObj(d);
          var uid = d.entity.ID;
          if (uid) {
            // init to the first one in list
            // taknak initialize
            if (i == 0 && false) {
              current = this.getKey(uid);
            }
            // to restrain order
            data[this.getKey(uid)] = d;
          }
        }

        // if loaded from chat socket trigger
        if (prevState.current_user !== 0) {
          current = prevState.current_user;
        }

        let toRet = {
          sessions: data,
          loading: false,
          current_user: current,
          newChat: []
        };
        if (totalResponse < OFFSET) {
          toRet.noMore = true;
        }
        if (newer) {
          toRet.loadingTop = false;
        }
        if (older) {
          toRet.loadingBottom = false;
        }
        return toRet;
      });
    });
  }

  getKey(user_id) {
    return "chat:" + user_id;
  }

  getChatBox() {
    var s = this.state.sessions[this.state.current_user];
    if (typeof s !== "undefined") {
      var other_data = s.entity;
      var other_id = s.entity.ID;
      var self_id = isRoleRec() ? this.companyId : this.userId;
      let is_company_self = isRoleRec();
      let is_company_other = isRoleStudent();

      // CompanyChatForRec
      return (
        <div key={this.state.current_user}>
          <Chat
            is_hide_header={true}
            is_company_chat={other_id != SupportUserID}
            is_company_self={is_company_self}
            is_company_other={is_company_other}
            session_id={null}
            disableChat={false}
            other_id={other_id}
            other_data={other_data}
            self_id={self_id}
          />
        </div>
      );
    } else {
      return <div className="chat-box-empty">{lang("Select Chat From Inbox")}</div>;
    }

  }

  changeChat(user_id) {
    this.isChangeChat = true;
    var keyId = this.getKey(user_id);
    this.setState(prevState => {
      prevState.sessions[keyId].isNew = false;
      prevState.sessions[keyId].total_unread = 0;
      return { current_user: keyId, sessions: prevState.sessions };
    });
  }

  getCurrentChatObj() {
    if (this.state.current_user === null) {
      return null;
    }

    return this.state.sessions[this.state.current_user];
  }

  getEntityKey(d) {
    let dataTemp = this.getEntityObj(d);
    return this.getKey(dataTemp.entity.ID);
  }

  getOrderArr() {


    let toRet = [];
    let objectOrder = {};
    for (var key in this.state.sessions) {

      var d = this.state.sessions[key];
      let orderKey =
        "order" +
        Time.convertDBTimeToUnix(d.last_message_time) +
        "::" +
        d.support_id;

      objectOrder[orderKey] = d;
    }

    let keys = Object.keys(objectOrder);
    keys.sort();

    // sort desc
    for (var i = keys.length - 1; i >= 0; i--) {
      let d = objectOrder[keys[i]];
      let chatKey = this.getEntityKey(d);
      toRet.push(chatKey);
    }


    /// set biggest and smallest order key
    let smallestOrderKey = null;
    let biggestOrderKey = null;
    try {
      smallestOrderKey = toRet[toRet.length - 1]
      smallestOrderKey = this.state.sessions[smallestOrderKey]["order_key"];
    } catch (err) {
      smallestOrderKey = null;
    }
    try {
      biggestOrderKey = toRet[0]
      biggestOrderKey = this.state.sessions[biggestOrderKey]["order_key"];
    } catch (err) {
      biggestOrderKey = null;
    }
    console.log("smallestOrderKey", smallestOrderKey)
    console.log("biggestOrderKey", biggestOrderKey)
    this.smallestOrderKey = smallestOrderKey;
    this.biggestOrderKey = biggestOrderKey;


    return toRet;
  }

  getImageIcon(d) {
    let isOnline = false;
    if (d.entity._type == "company") {
      isOnline = isCompanyOnline(this.props.online_companies, d.entity.ID);
    } else {
      isOnline = this.props.online_users[d.entity.ID] == 1;
    }

    // console.log("this.props.online_users",this.props.online_users);
    // console.log("this.props.online_companies",this.props.online_companies);
    // console.log("isOnline",isOnline,d.entity);

    var imgView = createImageElement(
      d.entity.img_url,
      d.entity.img_pos,
      d.entity.img_size,
      "45px",
      "frm-image",
      undefined,
      undefined,
      isOnline
    );

    return imgView;
  }

  getChatList() {
    var view = [];

    // order by last message time
    let orderArr = this.getOrderArr();

    //for (var i in this.state.sessions) {
    for (var i in orderArr) {
      let key = orderArr[i];
      var d = this.state.sessions[key];
      var title =
        d.entity._type == "user"
          ? createUserTitle(d.entity)
          : createCompanyTitle(d.entity);

      // let isOnline = false;
      // if (d.entity._type == "company") {
      //   isOnline = isCompanyOnline(this.props.online_companies, d.entity.ID);
      // } else {
      //   isOnline = this.props.online_users[d.entity.ID] == 1;
      // }

      // // console.log("this.props.online_users",this.props.online_users);
      // // console.log("this.props.online_companies",this.props.online_companies);
      // // console.log("isOnline",isOnline,d.entity);

      // var imgView = createImageElement(
      //   d.entity.img_url,
      //   d.entity.img_pos,
      //   d.entity.img_size,
      //   "45px",
      //   "frm-image",
      //   undefined,
      //   undefined,
      //   isOnline
      // );

      var imgView = this.getImageIcon(d);

      var isCurrent = this.state.current_user === key;
      var isNew = typeof d.isNew !== "undefined" ? d.isNew : false;
      if (d.total_unread > 0) {
        isNew = true;
      }
      var body =
        d.last_message != null ? (
          d.last_message
        ) : (
          <small className="text-muted">
            <i>{lang("Nothing To Show Here")}</i>
          </small>
        );

      try {
        if (body.indexOf(`MESSAGE_JSON{"type":"FILE"`) >= 0) {
          body = <div style={{ fontWeight: "bold", color: "gray" }}>
            <i className="fa fa-file left" style={{ color: "gray" }}></i>
            {"  "}{lang("File Attachment")}
          </div>
        }
        else if (body.indexOf(`MESSAGE_JSON{"type":"ZOOM"`) >= 0) {
          body = <div style={{ fontWeight: "bold", color: "gray" }}>
            <i className="fa fa-video-camera left" style={{ color: "gray" }}></i>
            {"  "}{lang("Video Call")}
          </div>
        }
      } catch (err) { }


      let countUnread =
        d.total_unread <= 0 ? null : (
          <div className="frm-count">{d.total_unread}</div>
        );

      let lastSenderName = null;
      if (d.last_rec_name && isRoleRec()) {
        lastSenderName = d.last_rec_name.trim();
      }


      view.push(
        <div
          key={key}
          id={d.entity.ID}
          className={`forum chat-list ${isCurrent ? "selected" : ""}`}
          onClick={ev => {
            this.changeChat(ev.currentTarget.id);
          }}
        >
          {countUnread}
          {imgView}
          <div className={`frm-body`}>
            {/* DEBUG */}
            {/* {d.order_key} */}
            <div className="frm-title">{title}</div>
            <p className={`frm-content ${isNew ? "fc-blue" : ""}`}>{body}</p>
            <div className="frm-timestamp">
              {lastSenderName ? <span>{lastSenderName} &middot; </span> : null}{Time.getString(d.last_message_time)}
            </div>
          </div>
        </div>
      );
    }

    return view;
  }

  getEmptyState() {
    let view = null;
    // Empty State For Company Chat
    let emptyStateBody = [
      <div className="text-muted">
        {lang("It looks like you have nothing in your inbox.")}
      </div>
    ];

    if (isRoleStudent()) {
      emptyStateBody.push(
        <div>
          <div className="text-muted">
            {lang("Start a chat with one of the companies below.")}
          </div>
          <br />
          <br />
          <CompaniesSection {...this.props} />
        </div>
      );
    } else if (isRoleRec()) {
      emptyStateBody.push(
        <div className="text-muted">{lang("Come back again another time.")}</div>
      );
    }
    view = <EmptyState body={emptyStateBody} />;

    return view;
  }

  componentDidUpdate() {
    if (!this.isChangeChat && this.chatListBody != null) {
      this.chatListBody.scrollTop = 0;
    }

    this.isChangeChat = false;
  }

  render() {
    document.setTitle("Inbox");
    var view = null;

    if (this.state.loading) {
      view = <Loader text={lang("Loading Chat List")} />;
    } else {
      view = [];
      // var newBtn =
      //   this.state.newChat.length == 0 ? null : (
      //     <b>
      //       <a onClick={() => { this.loadChatList({ newer: true }) }}>
      //         {this.state.newChat.length} {lang("New Chat")}
      //       </a>
      //     </b>
      //   );

      if (Object.keys(this.state.sessions).length <= 0) {
        view = this.getEmptyState();
      } else {

        let avatar = null;

        try {
          let d = this.getCurrentChatObj();
          let imgIcon = this.getImageIcon(d);
          avatar = [
            imgIcon,
            <div className="flex-center">
              <div>
                {d.entity.first_name + " " + d.entity.last_name}
              </div>
            </div>
          ];
        } catch (err) { }



        view.push(
          <div id="chat-list" className="container-fluid">
            <div className="row">

              {/* DEBUG -============================= */}
              {/* <div>
                DEBUG
                noMore : {this.state.noMore ? "true" : "false"}<br></br>
                loadingTop : {this.state.loadingTop ? "true" : "false"}<br></br>
                loadingBottom : {this.state.loadingBottom ? "true" : "false"}<br></br>
                <a onClick={() => { this.loadChatList({ newer: true }) }}>
                  {lang("Newer Chat")}
                </a>
                {" | "}
                <a onClick={() => { this.loadChatList({ older: true }) }}>
                  {lang("Older Chat")}
                </a>
              </div> */}
              {/* DEBUG -============================= */}

              {/* <div className="cl-header col-md-12 no-padding">
                <div className="clh-title">
                  <div className="clh-title-left">Inbox</div>
                  <div className="clh-title-right">{avatar}</div>
                </div>
                {newBtn}
              </div> */}
              <div className="col-md-4 no-padding cl-column" ref={v => (this.chatListBody = v)}>
                <div className="cl-header">
                  <div className="clh-title">
                    {lang("Inbox")}
                  </div>
                </div>
                <div className="cl-list" onScroll={this.handleScroll}>
                  {this.getChatList()}
                  {this.state.loadingBottom ? <Loader></Loader> : null}
                </div>
              </div>
              <div className="col-md-8 no-padding cl-column">
                <div className="cl-header">
                  <div className="clh-title">
                    {avatar}
                  </div>
                </div>
                <div className="cl-chat">
                  {this.getChatBox()}
                </div>
              </div>
            </div>
          </div>
        );

        // view.push(
        //   <div className="col-sm-6">
        //     <div id="chat-list">
        //       <div className="cl-header">
        //         <div className="clh-title">
        //           Inbox
        //         </div>
        //         {newBtn}
        //       </div>
        //       <div className="cl-body" ref={(v) => this.chatListBody = v} >
        //         {this.getChatList()}
        //       </div>
        //     </div>
        //   </div>
        // );
        // view.push(<div className="col-sm-6 ">{this.getChatBox()}</div>);
      }
    }

    return <div className="company-chat-inbox">{view}</div>;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    online_users: state.user.online_users,
    online_companies: state.user.online_companies
  };
}

export default connect(
  mapStateToProps,
  null
)(CompanyChatInbox);
