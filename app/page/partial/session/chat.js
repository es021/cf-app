import React, { PropTypes } from 'react';
import { Loader } from '../../../component/loader';

//importing for list
import List, { ProfileListItem } from '../../../component/list';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import { Redirect, NavLink } from 'react-router-dom';
import { RootPath } from '../../../../config/app-config';
import { Time } from '../../../lib/time';
import obj2arg from 'graphql-obj2arg';

import * as layoutActions from '../../../redux/actions/layout-actions';
import { ButtonLink } from '../../../component/buttons';
import UserPopup from '../popup/user-popup';

import { connect } from 'react-redux';
import { BOTH } from '../../../../config/socket-config';
import { emitChatMessage, socketOn } from '../../../socket/socket-client';

require("../../../css/chat.scss");

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.parseMessage = this.parseMessage.bind(this);
        this.createMessageJSON = this.createMessageJSON.bind(this);
        this.parseMessageJSON = this.parseMessageJSON.bind(this);
        this.parseMessageHTML = this.parseMessageHTML.bind(this);

        this.renderList = this.renderList.bind(this);
        this.getChatInput = this.getChatInput.bind(this);
        this.getChatHeader = this.getChatHeader.bind(this);
        this.addChatToView = this.addChatToView.bind(this);
        this.sendChat = this.sendChat.bind(this);

        this.state = {
            extraData: []
        }

        this.currentDateList = null;
        this.currentDateExtra = null;

        this.MESSAGE_JSON = "MESSAGE_JSON";
        this.MESSAGE_HTML = "MESSAGE_HTML"
    }

    componentWillMount() {
        this.offset = 10;

        socketOn(BOTH.CHAT_MESSAGE, (data) => {
            this.addChatToView(data.from_id, data.message, data.created_at);
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
        if (message.indexOf(this.MESSAGE_HTML) >= 0
            || message.indexOf(`onclick="chatActionTrigger`) >= 0) {
            return <div dangerouslySetInnerHTML={{ __html: message }}></div>;
        } else {
            return false;
        }
    }

    parseMessageJSON(message) {
        if (message.indexOf(this.MESSAGE_JSON) >= 0) {
            var mesData = message.replace(this.MESSAGE_JSON, "");
            try {
                mesData = JSON.parse(mesData);
                //console.log(mesData);
                // do something with mesData
                return "PARSED HEHE : " + message;

            } catch (err) {
                return false;
            }

        } else {
            return false;
        }
    }

    createMessageJSON(type, data) {
        var am = {
            type: type,
            data: data
        }
        return this.MESSAGE_JSON + this.JSON.stringify(am);
    }

    // ##############################################################
    // function for list
    loadData(page, offset) {
        var query = `query{
            messages(user_1:${this.props.self_id},user_2:${this.props.other_id},page:${page},offset:${offset}){
                id_message_number message from_user_id created_at}}`;

        return getAxiosGraphQLQuery(query);
    }

    getDataFromRes(res) {
        return res.data.data.messages;
    }

    addChatToView(from, message, created_at) {
        var mesObj = { from_user_id: from, message: message, created_at: created_at };
        var newData = this.renderList(mesObj, 0, true);

        // add to view
        this.setState((prevState) => {
            prevState.extraData.push(newData);
            return { extraData: prevState.extraData };
        });
    }

    componentDidUpdate() {
        //scroll to bottom
        this.chatBox.scrollTop = 99999999;
    }

    sendChat() {

        if (this.props.disableChat) {
            return;
        }

        var mes = this.chatInput.value;

        if (mes == "" || mes == null) {
            return;
        }

        // post to server -- db and socket
        var ins = {
            sender_id: this.props.self_id,
            receiver_id: this.props.other_id,
            message: mes
        }

        // add to db
        var query = `mutation{add_message(${obj2arg(ins, { noOuterBraces: true })})
        {id_message_number}}`;
        getAxiosGraphQLQuery(query);

        // todo add to socket
        emitChatMessage(this.props.self_id, this.props.other_id, mes, Time.getUnixTimestampNow());

        // empty value
        this.chatInput.value = "";

        this.addChatToView(this.props.self_id, mes, Time.getUnixTimestampNow());
    }

    createVideoCall() {
        alert("video call");
    }

    getChatHeader() {
        var d = this.props.other_data;

        // info -------
        var label = <span>{d.first_name + " "}<small>{d.last_name}</small></span>;
        var title = (!this.props.isRec) ? label
            : <ButtonLink
                onClick={() => layoutActions.storeUpdateFocusCard(d.first_name + " " + d.last_name, UserPopup, { id: d.ID })}
                label={label}>
            </ButtonLink>;

        var status = (this.props.online_users[d.ID] == 1) ? "Online" : "Offline";

        var info = <ProfileListItem title={title}
            img_url={d.img_url}
            img_pos={d.img_pos}
            img_size={d.img_size}
            subtitle={status}
            img_dimension={"50px"}
            type="student"></ProfileListItem>;

        // action -------
        var action = [];
        if (this.props.isRec) {
            action.push(<a title="Start Video Call" onClick={() => this.createVideoCall()} className="action-item">
                <i className="fa fa-video-camera left"></i>
            </a>);
        }

        return (<div className="chat-header">
            <div className="ch-info">
                {info}
            </div>
            <div className="ch-action">{action}</div>
        </div>)
    }

    getChatInput() {
        return (<div className="chat-input">
            <textarea ref={(v) => this.chatInput = v}
                rows="3"
                onKeyPress={(ev) => {
                    console.log(ev.ctrlKey);
                    if (ev.key == "Enter" && !ev.ctrlKey) {
                        this.sendChat();
                        ev.preventDefault();
                    }

                    if (ev.key == "Enter" && ev.ctrlKey && this.chatInput.value != "") {
                        console.log(this.chatInput.value);
                        ev.persist();
                        this.chatInput.value += "\n";
                        ev.preventDefault();
                    }
                }}
                placeholder={`Start Typing. Press [Ctrl+Enter] For New Line`}
                name="message"></textarea>
            <button disabled={this.props.disableChat} className="btn btn-blue" onClick={() => this.sendChat()} >Send</button>
        </div>);
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
            dateItem = <div className="chat-item special-item">
                {toCreateDate}
            </div>;
        }
        // create date Item finish -----------------------

        var itemClass = (d.from_user_id == this.props.self_id) ? "self-item" : "other-item";
        var chatItem = <div className={`chat-item ${itemClass}`}>
            <p className="message">
                {this.parseMessage(d.message)}
            </p>
            <div className="timestamp">
                {date} - {Time.getStringShort(d.created_at)}
            </div>
        </div>;

        if (dateItem == null) {
            return chatItem;
        } else {
            return [dateItem, chatItem];
        }
    };

    render() {

        return (<div id="chat">
            {this.getChatHeader()}
            <div className="chat-box" ref={(v) => this.chatBox = v}>
                <List type="append-top"
                    appendText="Load Previous"
                    getDataFromRes={this.getDataFromRes}
                    loadData={this.loadData}
                    extraData={this.state.extraData}
                    offset={this.offset}

                    renderList={this.renderList}></List>
            </div>
            {this.getChatInput()}
        </div>);
    }
}

Chat.propTypes = {
    self_id: PropTypes.number.isRequired,
    isRec: PropTypes.bool.isRequired,
    disableChat: PropTypes.bool.isRequired,
    other_id: PropTypes.number.isRequired,
    other_data: PropTypes.object.isRequired
}

function mapStateToProps(state, ownProps) {
    return {
        online_users: state.user.online_users
    };
}

export default connect(mapStateToProps, null)(Chat);
