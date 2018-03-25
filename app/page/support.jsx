import React, { Component } from 'react';
import Chat from './partial/session/chat';
import { SupportUserID } from '../../config/app-config';
import { SupportSession } from '../../config/db-config';
import { getAuthUser } from '../redux/actions/auth-actions';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { Loader } from '../component/loader';
import { createUserTitle } from './users';
import { createImageElement } from '../component/profile-card';
import { Time } from '../lib/time';

import { BOTH } from '../../config/socket-config';
import { socketOn } from '../socket/socket-client';

require('../css/forum.scss');
require('../css/support-chat.scss');

// support chat floating at bottom right page
export class SupportChat extends React.Component {
    constructor(props) {
        super(props);

        this.toogle = this.toogle.bind(this);
        this.getChatBox = this.getChatBox.bind(this);
        this.state = {
            show: false,
            supportUser: false,
        };

        this.self_id = getAuthUser().ID;
        this.hide = this.self_id === SupportUserID;
    }

    getChatBox() {
        if (this.state.supportUser === false) {
            // get support user
            var query = `query{ user(ID:${SupportUserID}) {  
            ID first_name last_name img_url img_pos img_size
            }}`;

            getAxiosGraphQLQuery(query).then((res) => {
                this.setState(() => {
                    var user = res.data.data.user;
                    return { supportUser: user }
                });
            });
            return <div style={{ padding: "10px" }}>
                <Loader text="Initializing chat with support"></Loader>
            </div>;
        } else if (this.state.supportUser === null) {
            return <div style={{ padding: "10px" }}>Support is not available currently</div>;
        
        } else {
            return <div>
                <Chat session_id={null}
                    disableChat={false}
                    other_id={SupportUserID}
                    other_data={this.state.supportUser}
                    self_id={this.self_id}>
                </Chat>
            </div>;
        }
    }

    toogle() {
        this.setState((prevState) => {
            return { show: !prevState.show };
        });
    }

    render() {
        if (this.hide) {
            return null;
        }

        var v = null;
        var className = "";
        if (!this.state.show) {
            className = "sc-open";
            v = <div onClick={this.toogle}
                className="btn btn-success btn-lg">Got Question?</div>;

        } else {
            v = <div>
                 <button className="btn btn-sm btn-danger btn-block"
                    onClick={this.toogle}>Close Chat</button>
                {this.getChatBox()}
            </div>;

        }
        return <div id="support-chat" className={className}>
            {v}
        </div>;
    }
}

// page for support to see all the chat list with users
// has to create another table for list of chats with support

// only limit to one support account
// to prevent from real time conflict

export class SupportPage extends React.Component {
    constructor(props) {
        super(props);
        this.authUser = getAuthUser();
        this.getChatBox = this.getChatBox.bind(this);
        this.getChatList = this.getChatList.bind(this);
        this.changeChat = this.changeChat.bind(this);
        this.loadChatList = this.loadChatList.bind(this);
        this.state = {
            loading: true,
            sessions: [],
            current_user: 0,
            newChat: []
        };
    }

    componentWillMount() {
        this.loadChatList();

        socketOn(BOTH.CHAT_MESSAGE, (data) => {
            var keyId = this.getKey(data.from_id);

            // if not exist?
            // list of newChat
            if (typeof this.state.sessions[keyId] === "undefined") {
                this.setState((prevState) => {
                    var newChat = prevState.newChat;
                    if (newChat.indexOf(data.from_id) <= -1) {
                        newChat.push(data.from_id);
                    }
                    return { newChat: newChat };
                })
                return;
            }

            // update last_message and last message time
            // set is new to true
            this.setState((prevState) => {
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

        var query = `query{ support_sessions {  
            ID
            support_id
            created_at
            last_message_time
            last_message
            user { ID first_name last_name img_url img_pos img_size}
          }}`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState((prevState) => {
                var sessions = res.data.data.support_sessions;
                var data = {};
                var current = 0;

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

                return { sessions: data, loading: false, current_user: current, newChat: [] }
            });
        });
    }

    getKey(user_id) {
        return "u:" + user_id;
    }

    getChatBox() {
        var s = this.state.sessions[this.state.current_user];
        var other_data = s.user;
        var other_id = s.user.ID;
        var self_id = s.support_id;

        return <div key={this.state.current_user}>
            <Chat session_id={null}
                disableChat={false}
                other_id={other_id}
                other_data={other_data}
                self_id={self_id}>
            </Chat>
        </div>;
    }

    changeChat(user_id) {
        var keyId = this.getKey(user_id);
        this.setState((prevState) => {
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
            var imgView = createImageElement(d.user.img_url, d.user.img_pos
                , d.user.img_size, "45px", "frm-image");

            var isNew = (typeof d.isNew !== "undefined") ? d.isNew : false;
            var body = (d.last_message != null) ? d.last_message
                : <small className="text-muted"><i>Nothing To Show Here</i></small>;

            var action = <span>
                {(d.last_message_time !== null) ? Time.getString(d.last_message_time) + " | " : null}
                <a id={d.user.ID} onClick={(ev) => {
                    this.changeChat(ev.currentTarget.id);
                }}><b>Open Chat</b></a>
            </span>;

            view.push(<div key={i} id={d.user.ID}
                className={"forum chat-list"} onClick={(ev) => {
                    this.changeChat(ev.currentTarget.id);
                }}>
                {imgView}
                <div className="frm-body">
                    <div className="frm-title">
                        {title}
                    </div>
                    <p className={`frm-content ${isNew ? "fc-blue" : ""}`}>{body}</p>
                    <div className="frm-timestamp">{Time.getString(d.last_message_time)}</div>
                </div>
            </div>);
        }

        return view;
    }

    render() {
        document.setTitle("Support");
        var view = null;

        if (this.state.loading) {
            view = <Loader text="Loading Chat List"></Loader>;
        } else {
            view = [];
            var newBtn = (this.state.newChat.length == 0) ? null :
                <b><a onClick={this.loadChatList}>{this.state.newChat.length} New Chat</a></b>;

            view.push(<div className="col-md-6 no-padding padding-right">
                <h4>Tech Support
                    <br></br>{newBtn}
                </h4>
                {this.getChatList()}
            </div>);
            view.push(<div className="col-md-6 no-padding">
                {this.getChatBox()}
            </div>);
        }

        return (<div>
            {view}
        </div>);
    }
}


