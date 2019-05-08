import React, { Component } from "react";
import Chat from "./partial/session/chat.jsx";
import { SupportUserID } from "../../config/app-config";
import { SupportSession, LogEnum } from "../../config/db-config";
import { getAuthUser } from "../redux/actions/auth-actions";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { Loader } from "../component/loader";
import { createUserTitle } from "./users";
import { createImageElement } from "../component/profile-card.jsx";
import { Time } from "../lib/time";

import { BOTH } from "../../config/socket-config";
import { socketOn } from "../socket/socket-client";
import { addLog } from "../redux/actions/other-actions.js";

require("../css/forum.scss");
require("../css/support-chat.scss");

// support chat floating at bottom right page
export class CompanyChatForStudent extends React.Component {
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
          <Loader text="Initializing chat with recruiter" />
        </div>
      );
    } else {
      return (
        // CompanyChatForStudent
        <div>
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
    }
  }

  render() {
    return <div id="company-chat">{this.getChatBox()}</div>;
  }
}

// page for support to see all the chat list with users
// has to create another table for list of chats with support

// only limit to one support account
// to prevent from real time conflict

export class CompanyChatForRec extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = getAuthUser();
    this.getChatBox = this.getChatBox.bind(this);
    this.getChatList = this.getChatList.bind(this);
    this.changeChat = this.changeChat.bind(this);
    this.loadChatList = this.loadChatList.bind(this);

    if (this.props.match) {
      this.ID = this.props.match.params.id;
    } else {
      this.ID = this.props.id;
    }

    this.state = {
      loading: true,
      sessions: [],
      current_user: 0,
      newChat: []
    };
  }

  componentWillMount() {
    this.loadChatList();

    socketOn(BOTH.CHAT_MESSAGE, data => {
      var keyId = this.getKey(data.from_id);

      // if not exist?
      // list of newChat
      if (typeof this.state.sessions[keyId] === "undefined") {
        this.setState(prevState => {
          var newChat = prevState.newChat;
          if (newChat.indexOf(data.from_id) <= -1) {
            newChat.push(data.from_id);
          }
          return { newChat: newChat };
        });
        return;
      }

      // update last_message and last message time
      // set is new to true
      this.setState(prevState => {
        var obj = prevState.sessions[keyId];

        if (this.state.current_user != keyId) {
          obj.isNew = true;
        }

        obj.last_message = data.message;
        obj.last_message_time = data.created_at;
        prevState.sessions[keyId] = obj;

        return { sessions: prevState.sessions };
      });
    });
  }

  loadChatList() {
    var query = `query{ support_sessions(support_id:${this.ID}) {  
            ID
            support_id
            created_at
            last_message_time
            last_message
            user { ID first_name last_name img_url img_pos img_size}
          }}`;

    getAxiosGraphQLQuery(query).then(res => {
      this.setState(prevState => {
        var sessions = res.data.data.support_sessions;
        var data = {};
        var current = 0;

        console.log(sessions);

        for (var i in sessions) {
          var d = sessions[i];
          var uid = d.user.ID;
          if (i == 0) {
            current = this.getKey(uid);
          }
          // to restrain order
          data[this.getKey(uid)] = d;
        }

        // if loaded from chat socket trigger
        if (prevState.current_user !== 0) {
          current = prevState.current_user;
        }

        return {
          sessions: data,
          loading: false,
          current_user: current,
          newChat: []
        };
      });
    });
  }

  getKey(user_id) {
    return "u:" + user_id;
  }

  getChatBox() {
    var s = this.state.sessions[this.state.current_user];
    if (typeof s !== "undefined") {
      var other_data = s.user;
      var other_id = s.user.ID;
      var self_id = Number.parseInt(this.ID);

      // CompanyChatForRec
      return (
        <div key={this.state.current_user}>
          <Chat
            is_company_chat={true}
            is_company_self={true}
            is_company_other={false}
            session_id={null}
            disableChat={false}
            other_id={other_id}
            other_data={other_data}
            self_id={self_id}
          />
        </div>
      );
    }

    return <div className="text-muted">Nothing To Show Here</div>;
  }

  changeChat(user_id) {
    var keyId = this.getKey(user_id);
    this.setState(prevState => {
      prevState.sessions[keyId].isNew = false;
      return { current_user: keyId, sessions: prevState.sessions };
    });
  }

  getChatList() {
    var view = [];
    console.log(this.state.sessions);
    for (var i in this.state.sessions) {
      var d = this.state.sessions[i];
      var title = createUserTitle(d.user);
      var imgView = createImageElement(
        d.user.img_url,
        d.user.img_pos,
        d.user.img_size,
        "45px",
        "frm-image"
      );

      var isNew = typeof d.isNew !== "undefined" ? d.isNew : false;
      var body =
        d.last_message != null ? (
          d.last_message
        ) : (
          <small className="text-muted">
            <i>Nothing To Show Here</i>
          </small>
        );

      var action = (
        <span>
          {d.last_message_time !== null
            ? Time.getString(d.last_message_time) + " | "
            : null}
          <a
            id={d.user.ID}
            onClick={ev => {
              this.changeChat(ev.currentTarget.id);
            }}
          >
            <b>Open Chat</b>
          </a>
        </span>
      );

      view.push(
        <div
          key={i}
          id={d.user.ID}
          className={"forum chat-list"}
          onClick={ev => {
            this.changeChat(ev.currentTarget.id);
          }}
        >
          {imgView}
          <div className="frm-body">
            <div className="frm-title">{title}</div>
            <p className={`frm-content ${isNew ? "fc-blue" : ""}`}>{body}</p>
            <div className="frm-timestamp">
              {Time.getString(d.last_message_time)}
            </div>
          </div>
        </div>
      );
    }

    return view;
  }

  render() {
    document.setTitle("Support");
    var view = null;

    if (this.state.loading) {
      view = <Loader text="Loading Chat List" />;
    } else {
      view = [];
      var newBtn =
        this.state.newChat.length == 0 ? null : (
          <b>
            <a onClick={this.loadChatList}>
              {this.state.newChat.length} New Chat
            </a>
          </b>
        );

      view.push(
        <div className="col-md-6 no-padding padding-right">
          <h4>
            Tech Support
            <br />
            {newBtn}
          </h4>
          {this.getChatList()}
        </div>
      );
      view.push(<div className="col-md-6 no-padding">{this.getChatBox()}</div>);
    }

    return <div>{view}</div>;
  }
}
