import React, { PropTypes } from 'react';
import { Loader } from '../../../component/loader';
import Form from '../../../component/form';

//importing for list
import List, { ProfileListItem } from '../../../component/list';
import { getAxiosGraphQLQuery, getWpAjaxAxios } from '../../../../helper/api-helper';
import { SiteUrl, IsGruveoEnable } from '../../../../config/app-config';
import { Time } from '../../../lib/time';
import obj2arg from 'graphql-obj2arg';
import * as layoutActions from '../../../redux/actions/layout-actions';
import { getOtherRecs } from '../../../redux/actions/auth-actions';
import { ActivityType } from '../../../redux/actions/hall-actions';
import { addLog } from "../../../redux/actions/other-actions";
import { LogEnum } from "../../../../config/db-config";
import { connect } from 'react-redux';
import { BOTH } from '../../../../config/socket-config';
import { emitChatMessage, socketOn, emitHallActivity } from '../../../socket/socket-client';

//import { ButtonLink } from '../../../component/buttons.jsx';
//import UserPopup from '../popup/user-popup';
//import { Redirect, NavLink } from 'react-router-dom';


// require("../../../css/chat.scss");

// New Gruveo
export function isGruveoLink(join_url) {
    const isGruveo = join_url.indexOf("video-call?room_code") >= 0;
    return isGruveo;
}

export function addLogCreateCall({ isZoom, isGruveo, pre_screen_id, session_id, group_session_id, url }) {
    let log = null;
    let param = {};

    if (isGruveo == true) {
        log = LogEnum.EVENT_CALL_GRUVEO;
    } else if (isZoom == true) {
        log = LogEnum.EVENT_CALL_ZOOM;
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

    // for gruveo
    if (typeof url !== "undefined") {
        param.url = url;
    }

    if (log != null) {
        addLog(log, param);
    }

}

// New Gruveo
export function createGruveoLink(id, isGroupSession) {
    isGroupSession = typeof isGroupSession === "undefined" ? false : isGroupSession;

    let date = new Date();
    let timestamp = date.getTime();
    let room_code = `sjf${timestamp}${isGroupSession ? "gsid" : "sid"}${id}`;
    let toRet = `${SiteUrl}/video-call?room_code=${room_code}`;
    return toRet;
}

export function joinVideoCall(join_url, session_id, expiredHandler = null, group_session_id = null, pre_screen_id = null, start_url = null) {
    let isJoin = false;
    let windowPopup = null;
    let windowId = "zoom_" + Date.now();
    let windowParam = `scrollbars=no,resizable=no,status=no,location=no, toolbar=no,menubar=no,
                width=600,height=400,left=100,top=100`;
    if (start_url != null) {
        windowPopup = window.open(start_url, windowId, windowParam);
    } else {
        isJoin = true;
        windowPopup = window.open(join_url, windowId, windowParam);
    }
    if (isGruveoLink(join_url)) {
        return;
    }

    // #####################################################
    // start post join action
    layoutActions.loadingBlockLoader("Please Wait..");
    var loaded = 0;
    var toLoad = isJoin ? 2 : 1;
    var hasError = false;
    const closeBlockLoader = () => {
        loaded++;
        if (loaded >= toLoad && !hasError) {
            layoutActions.storeHideBlockLoader();
        }
    }

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

    // 1. check if expired
    const successInterceptorExpired = (data) => {
        if (data == 1) {
            windowPopup.close();
            layoutActions.errorBlockLoader("This Video Call Session Has Expired.");
            hasError = true;
            if (expiredHandler != null) {
                expiredHandler();
            }
        } else {
            closeBlockLoader()
        }
    };
    getWpAjaxAxios("wzs21_zoom_ajax", {
        query: "is_meeting_expired", ...data
    }, successInterceptorExpired, true);


    // 2. check if recruiter not ready
    if (isJoin) {
        const successInterceptorStatus = (data) => {
            let recNotReady = false;
            if (data.status == 0 && typeof data.error === "undefined") {
                recNotReady = true;
            }
            if (recNotReady) {
                windowPopup.close();
                layoutActions.errorBlockLoader("Recruiter is not ready yet. Please try again in a few minutes");
                hasError = true;
            } else {
                closeBlockLoader()
            }
        };
        getWpAjaxAxios("wzs21_zoom_ajax", {
            query: "get_meeting_status", ...data
        }, successInterceptorStatus, true);
    }
}

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
            if (this.props.other_id == data.from_id) {
                this.addChatToView(data.from_id, data.message, data.created_at);
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
                                onClick={() => { joinVideoCall(mesData.data.join_url, this.props.session_id) }}>Join Now</div>
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

        // todos
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
        // todos
        var query = `mutation{add_message(${obj2arg(ins, { noOuterBraces: true })})
        {id_message_number}}`;
        getAxiosGraphQLQuery(query);

        // add to socket
        // todos
        emitChatMessage(this.props.self_id, this.props.other_id, mes, Time.getUnixTimestampNow());

        // empty value
        this.chatInput.value = "";

        this.addChatToView(this.props.self_id, mes, Time.getUnixTimestampNow());
    }


    inviteForPanelInterview(recs, zoom_meeting_id, join_url) {
        // this.props.session_id;
        console.log(recs);
        for (var i in recs) {
            var key = recs[i].split("::");
            var user_id = Number.parseInt(key[0]);
            var user_email = key[1];

            // 1. send email to rec id
            console.log("send invitaion email to", user_email);

            // 2. add to tabel zoom_invites
            var add = {
                user_id: user_id,
                zoom_meeting_id: zoom_meeting_id,
                join_url: join_url,
                session_id: this.props.session_id,
                host_id: this.props.self_id,
                participant_id: this.props.other_id
            };

            var add_query = `mutation{add_zoom_invite(${obj2arg(add, { noOuterBraces: true })}) 
                {ID}}`;

            getAxiosGraphQLQuery(add_query).then((res) => {
                emitHallActivity(ActivityType.ZOOM_INVITE, user_id);
            });
        }
    }

    getStartVideoCallFormWithInvite(zoom_data) {
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

        var onSubmit = (data) => {
            if (this.props.can_do_multiple) {
                this.inviteForPanelInterview(data.recs, zoom_data.id, zoom_data.join_url);
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

    /**
     * 
     * @param {join_url, start_url} videoCallData 
     */
    getStartVideoCallForm(videoCallData) {
        var onSubmit = (data) => {
            layoutActions.storeHideBlockLoader();
            this.sendChat(this.createMessageJSON(this.JSON_ZOOM, { join_url: videoCallData.join_url }));
            window.open(videoCallData.start_url);
        };

        var items = [];
        return <Form
            items={items}
            onSubmit={onSubmit}
            btnColorClass="blue"
            submitText="Start Video Call">
        </Form>;
    }

    createVideoCall() {
        addLogCreateCall({ isZoom: true, session_id: this.props.session_id });

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

    // New Gruveo
    createVideoCallGruveo() {
        if (this.props.disableChat) {
            layoutActions.errorBlockLoader("Session Has Expired. Unable To Create Video Call Session");
            return;
        }

        let url = createGruveoLink(this.props.session_id);
        addLogCreateCall({ isGruveo: true, session_id: this.props.session_id, url: url });

        layoutActions.loadingBlockLoader("Creating Video Call Session. Please Do Not Close Window.");

        var data = {
            start_url: url,
            join_url: url,
        }
        var body = <div>
            <h4 className="text-primary">Successfully Created Video Call Session</h4>
            {this.getStartVideoCallForm(data)}
        </div>;
        layoutActions.customBlockLoader(body, null, null, null);

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

        // New Gruveo
        if (this.props.isRec) {
            // Remove Gruveo
            if (IsGruveoEnable) {
                action.push(<a onClick={() => this.createVideoCallGruveo()} className="action-item">
                    <i className="fa fa-video-camera left"></i><small>Call With Chrome</small>
                </a>);
                action.push(<small>{"   |   "}</small>)
                action.push(<a onClick={() => this.createVideoCall()} className="action-item">
                    <small>Call With Zoom</small>
                </a>);
            } else {
                action.push(<a onClick={() => this.createVideoCall()} className="action-item">
                    <i className="fa fa-video-camera left"></i><small>Start Video Call</small>
                </a>);
            }


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
                placeholder={`Ask New Question..`}
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
    is_company_chat : PropTypes.bool,
    is_company_self : PropTypes.bool,
    is_company_other : PropTypes.bool,
    can_do_multiple: PropTypes.bool,
    self_id: PropTypes.number.isRequired,
    isRec: PropTypes.bool.isRequired,
    session_id: PropTypes.number.isRequired,
    disableChat: PropTypes.bool.isRequired,
    other_id: PropTypes.number.isRequired,
    other_data: PropTypes.object.isRequired
};

Chat.defaultProps = {
    is_company_chat : false,
    is_company_self : false,
    is_company_other : false,
    can_do_multiple: false
};

function mapStateToProps(state, ownProps) {
    return {
        online_users: state.user.online_users
    };
}

export default connect(mapStateToProps, null)(Chat);
