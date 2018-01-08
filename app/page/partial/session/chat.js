import React, { PropTypes } from 'react';
import { Loader } from '../../../component/loader';

//importing for list
import List from '../../../component/list';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import { Redirect, NavLink } from 'react-router-dom';
import { RootPath } from '../../../../config/app-config';
import { Time } from '../../../lib/time';

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.parseMessage = this.parseMessage.bind(this);
        this.createMessageJSON = this.createMessageJSON.bind(this);
        this.parseMessageJSON = this.parseMessageJSON.bind(this);
        this.parseMessageHTML = this.parseMessageHTML.bind(this);

        this.renderList = this.renderList.bind(this);

        this.MESSAGE_JSON = "MESSAGE_JSON";
        this.MESSAGE_HTML = "MESSAGE_HTML"
    }

    componentWillMount() {
        this.offset = 10;
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
                console.log(mesData);
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

    renderList(d, i) {
        return <div className="text-left">
            <small><b>{d.from_user_id}</b> @ {Time.getString(d.created_at)}</small> 
            : {this.parseMessage(d.message)}
        </div>;
    };


    render() {
        return (<div><h4>Chat</h4>
            <List type="append-top"
                appendText="Load Previous"
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
                offset={this.offset}
                renderList={this.renderList}></List>
        </div>);
    }
}

Chat.propTypes = {
    self_id: PropTypes.number.isRequired,
    other_id: PropTypes.number.isRequired
}
