import React, { Component } from 'react';
import Chat from './partial/session/chat';
import { SupportSession } from '../../config/db-config';
import { getAuthUser } from '../redux/actions/auth-actions';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { Loader } from '../component/loader';
import { createUserTitle } from './users';
import { createImageElement } from '../component/profile-card';
import { Time } from '../lib/time';

require('../css/forum.scss');

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
        this.state = {
            loading: true,
            sessions: [],
            current_index: 0
        };
    }

    componentWillMount() {
        var query = `query{ support_sessions {  
              ID
              support_id
              created_at
              last_message_time
              last_message
              user { ID first_name last_name img_url img_pos img_size}
            }}`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState(() => {
                var sessions = res.data.data.support_sessions;
                return { sessions: sessions, loading: false }
            });
        });
    }

    getChatBox() {
        var s = this.state.sessions[this.state.current_index];
        var other_data = s.user;
        var other_id = s.user.ID;
        var self_id = s.support_id;

        return <div key={this.state.current_index}>
            <Chat session_id={null}
                disableChat={false}
                other_id={other_id}
                other_data={other_data}
                self_id={self_id}>
            </Chat>
        </div>;
    }

    getChatList() {
        return this.state.sessions.map((d, i) => {
            var title = createUserTitle(d.user);

            var imgView = createImageElement(d.user.img_url, d.user.img_pos
                , d.user.img_size, "45px", "frm-image");

            var body = (d.last_message != null) ? d.last_message
                : <small className="text-muted"><i>Nothing To Show Here</i></small>;

            var action = <span>
                {(d.last_message_time !== null) ? Time.getString(d.last_message_time) + " | " : null}
                <a onClick={() => {
                    this.setState(() => {
                        return { current_index: i };
                    });
                }}><b>Open Chat</b></a>
            </span>;

            return <div key={i}
                className={"forum chat-list"}>
                {imgView}
                <div className="frm-body">
                    <div className="frm-title">
                        {title}
                    </div>
                    <p className="frm-content">{body}</p>
                    <div className="frm-timestamp">{action}</div>
                </div>
            </div>;
        })
    }

    render() {
        document.setTitle("Support");
        var view = null;

        if (this.state.loading) {
            view = <Loader text="Loading Chat List"></Loader>;
        } else {
            view = [];
            view.push(<div className="col-md-6 no-padding padding-right">
                <h4>Tech Support</h4>
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


