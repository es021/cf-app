import React, { PropTypes } from 'react';
import { Loader } from '../../../component/loader';
import Form from '../../../component/form';

//importing for list
import List, { ProfileListItem } from '../../../component/list';
import { getAxiosGraphQLQuery, getWpAjaxAxios } from '../../../../helper/api-helper';
import { Redirect, NavLink } from 'react-router-dom';
import { RootPath } from '../../../../config/app-config';
import { Time } from '../../../lib/time';
import obj2arg from 'graphql-obj2arg';

import * as layoutActions from '../../../redux/actions/layout-actions';
import { getOtherRecs } from '../../../redux/actions/auth-actions';
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
        this.createVideoCall = this.createVideoCall.bind(this);
        this.getStartVideoCallForm = this.getStartVideoCallForm.bind(this);
        this.joinVideoCall = this.joinVideoCall.bind(this);
        this.inviteForPanelInterview = this.inviteForPanelInterview.bind(this);

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

        this.JSON_ZOOM = "ZOOM";
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
                console.log("parseMessageJSON", mesData);
                if (mesData.type == this.JSON_ZOOM) {
                    // console.log(mesData);
                    // do something with mesData
                    return <div>
                        <small>[AUTO MESSAGE]</small>
                        <br></br>I have created a video call session.
                        <div style={{ margin: "7px 0" }}>
                            <div className={`${this.props.isRec ? "btn-blue" : "btn-default"} btn btn-block btn-sm`}
                                onClick={() => { this.joinVideoCall(mesData.data.join_url) }}>Join Now</div>
                        </div>
                    </div>;
                } else {
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
        }
        return this.MESSAGE_JSON + JSON.stringify(am);
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

    joinVideoCall(join_url) {
        window.open(join_url);

        if (this.props.disableChat) {
            layoutActions.errorBlockLoader("Session Has Expired. Unable To Join Video Call Session");
            return;
        }

        layoutActions.loadingBlockLoader("Please Wait..");

        //check if expired
        const successInterceptor = (data) => {
            if (data == 1) {
                layoutActions.errorBlockLoader("This Video Call Session Has Expired.");
            } else {
                layoutActions.storeHideBlockLoader();
            }
        };

        var data = {
            query: "is_meeting_expired",
            join_url: join_url,
            session_id: this.props.session_id
        };

        getWpAjaxAxios("wzs21_zoom_ajax", data, successInterceptor, true);
    }

    inviteForPanelInterview(recs, join_url) {
        // this.props.session_id;
        //send email to rec id

        for (var i in recs) {
            var key = recs[i].split("::");
            var user_id = key[0];
            var user_email = key[1];
            
            // add to tabel panel interview
            var add = {
                user_id: user_id,
                session_id: this.props.session_id,
                join_url: join_url
            };

            console.log("send invitaion email to", user_email);

            console.log("add to table panel interview", add);
        }
    }

    getStartVideoCallForm(zoom_data) {
        var listRecs = [];
        getOtherRecs().map((d, i) => {
            if (this.props.self_id == d.ID) {
                return false;
            }
            listRecs.push({ key: `${d.ID}::${d.user_email}`, label: d.user_email });
        })

        var items = (this.props.can_do_multiple && listRecs.length > 0) ?
            [{
                label: "Invite other recruiters to join (optional)",
                type: "checkbox",
                name: "recs",
                data: listRecs
            }] : [];

        var onSubmit = (recs) => {
            if (this.props.can_do_multiple) {
                this.inviteForPanelInterview(recs, zoom_data.join_url);
            }

            layoutActions.storeHideBlockLoader();
            this.sendChat(this.createMessageJSON(this.JSON_ZOOM, { join_url: zoom_data.join_url }));
            window.open(zoom_data.start_url);
        };

        return <Form
            items={items}
            onSubmit={onSubmit}
            btnColorClass="blue"
            submitText="Start Video Call">
        </Form>;
    }

    createVideoCall() {
        if (this.props.disableChat) {
            layoutActions.errorBlockLoader("Session Has Expired. Unable To Create Video Call Session");
            return;
        }

        layoutActions.loadingBlockLoader("Creating Video Call Session. Please Do Not Close Window.");

        const successInterceptor = (data) => {
            /*
            {"uuid":"bou80/LrR6a0cmDKC4V5aA=="
            ,"id":646923659,"host_id":"-9e--206RFiZFE0hSh-RPQ"
            ,"topic":"Let's start a video call."
            ,"password":"","h323_password":""
            ,"status":0,"option_jbh":false
            ,"option_start_type":"video"
            ,"option_host_video":true,"option_participants_video":true
            ,"option_cn_meeting":false,"option_enforce_login":false
            ,"option_enforce_login_domains":"","option_in_meeting":false
            ,"option_audio":"both","option_alternative_hosts":""
            ,"option_use_pmi":false,"type":1,"start_time":""
            ,"duration":0,"timezone":"America/Los_Angeles"
            ,"start_url":"https://zoom.us/s/646923659?zpk=NcbawuQ7mSE9jfEBdcGMfwxumZzC21eWgm2v6bQ9S6k.AwckNGQwMWY3NWQtNDZhMC00MzU2LTg0M2MtNGVlNWI1MmUzOWY5Fi05ZS0tMjA2UkZpWkZFMGhTaC1SUFEWLTllLS0yMDZSRmlaRkUwaFNoLVJQURJ0ZXN0LnJlY0BnbWFpbC5jb21jAHBTRm01T3I3ZVprU0RGczJCeVRFTlZ5N1k0cE1Zcm5scFF5R3pQZ2RLQjY4LkJnUWdVMDVMU1U1cGNFVmpWeTlESzB0NVVGRm5SbWx3YnpNNFRFNVdWSGxZWjJrQUFBd3pRMEpCZFc5cFdWTXpjejBBAAAWcDF2Skd0YUJRV3k0WC15NzVGRmVtQQIBAQA"
            ,"join_url":"https://zoom.us/j/646923659","created_at":"2018-01-31T02:08:02Z"}
            */

            if (data == null || data == "" || typeof data != "object") {
                layoutActions.errorBlockLoader("Failed to create video call session. Please check your internet connection");
                return;
            }

            console.log("success createVideoCall", data);
            var body = <div>
                <h4 className="text-primary">Successfully Created Video Call Session</h4>
                {this.getStartVideoCallForm(data)}
            </div>;
            layoutActions.customBlockLoader(body, null, null, null);
            // layoutActions.customBlockLoader("Successfully Created Video Call Session"
            //     , "Start Video Call", () => {

            //         if (this.props.can_do_multiple) {

            //         }

            //         this.sendChat(this.createMessageJSON(this.JSON_ZOOM, { join_url: data.join_url }));
            //         window.open(data.start_url);
            //     }, null);
        };

        var data = {
            query: "create_meeting",
            host_id: this.props.self_id,
            session_id: this.props.session_id,
        };

        getWpAjaxAxios("wzs21_zoom_ajax", data, successInterceptor, true);
    }

    getChatHeader() {
        var d = this.props.other_data;

        // info -------
        var label = <span>{d.first_name + " "}<small>{d.last_name}</small></span>;
        var title = label;
        /*
        var title = (!this.props.isRec) ? label
            : <ButtonLink
                onClick={() => layoutActions.storeUpdateFocusCard(d.first_name + " " + d.last_name, UserPopup, { id: d.ID })}
                label={label}>
            </ButtonLink>;*/

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
    can_do_multiple: PropTypes.bool,
    self_id: PropTypes.number.isRequired,
    isRec: PropTypes.bool.isRequired,
    session_id: PropTypes.number.isRequired,
    disableChat: PropTypes.bool.isRequired,
    other_id: PropTypes.number.isRequired,
    other_data: PropTypes.object.isRequired
};

Chat.defaultProps = {
    can_do_multiple: false
};

function mapStateToProps(state, ownProps) {
    return {
        online_users: state.user.online_users
    };
}

export default connect(mapStateToProps, null)(Chat);
