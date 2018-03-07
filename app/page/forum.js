import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ForumComment, ForumReply } from '../../config/db-config';
import List from '../component/list';
import { createImageElement } from '../component/profile-card';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { Time } from '../lib/time';
import { getAuthUser, getCF, isRoleOrganizer, isRoleAdmin } from '../redux/actions/auth-actions';
import obj2arg from 'graphql-obj2arg';
import * as layoutActions from '../redux/actions/layout-actions';
import { createUserTitle } from './users';
require('../css/forum.scss');

const OFFSET_COMMENT = 10;
const OFFSET_REPLY = 2;

const USER_SELECT = `user{
    ID
    first_name
    last_name
    img_url
    img_pos
    img_size }`;

const renderForumItem = function (d, key, is_reply = false, is_first = false) {
    return <ForumItem
        raw_data={d}
        user_title={createUserTitle(d.user)}
        img_url={d.user.img_url}
        img_pos={d.user.img_pos}
        is_reply={is_reply}
        is_first={is_first}
        img_size={d.user.img_size}
        timestamp={Time.getAgo(d.created_at)}
        content={d.content}
        key={key}>
    </ForumItem>;
};

// type == "comment", "reply"
const renderTextAreaForumItem = function (type, name, parentClass, onSubmit) {

    return (<div className={`forum-textarea-${type}`}>
        <textarea ref={(v) => parentClass.textarea = v}
            className="form-control input-sm"
            rows={(type == "comment") ? "3" : "1"}
            onKeyPress={(ev) => {
                //console.log(ev.ctrlKey);
                // if (ev.key == "Enter" && !ev.ctrlKey) {
                //     this.sendChat();
                //     ev.preventDefault();
                // }

                // if (ev.key == "Enter" && ev.ctrlKey && this.chatInput.value != "") {
                //     //console.log(this.chatInput.value);
                //     ev.persist();
                //     this.chatInput.value += "\n";
                //     ev.preventDefault();
                // }
            }}
            placeholder={(type == "comment") ? "Add New Question.." : "Add New Reply.."}
            name={name}></textarea>
        <button className="btn btn-blue" onClick={() => onSubmit()} >Add</button>
    </div>);
};


class ForumItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var img_dimension = (this.props.is_reply) ? "30px" : "45px";
        var imgView = createImageElement(this.props.img_url, this.props.img_pos
            , this.props.img_size, img_dimension, "frm-image");

        var className = `forum ${this.props.is_reply ? "frm-reply" : ""} ${this.props.is_first ? "frm-first" : ""}`;

        return <div key={this.props.key}
            className={className}>
            {imgView}
            <div className="frm-body">
                <div className="frm-title">{this.props.user_title}</div>
                <div className="frm-timestamp">{this.props.timestamp}</div>
                <p>{this.props.content}</p>
            </div>
        </div>;
    }
}

ForumItem.propTypes = {
    raw_data: PropTypes.object.isRequired,
    user_title: PropTypes.any.isRequired,
    subtitle: PropTypes.any.isRequired,
    content: PropTypes.string.isRequired,
    img_url: PropTypes.any.isRequired,
    img_pos: PropTypes.any.isRequired,
    img_size: PropTypes.any.isRequired,
    is_reply: PropTypes.bool.isRequired,
    is_first: PropTypes.bool.isRequired,
    key: PropTypes.string.isRequired
};


// this class will generate new list of replies under it
class ForumCommentItem extends React.Component {
    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.getDataFromRes = this.getDataFromRes.bind(this);
        this.renderList = this.renderList.bind(this);
        this.offset = OFFSET_REPLY;

        this.state = {
            extraData: []
        }

        this.isInit = true;
    }

    componentWillMount() {

        this.preItem = [];

        //render comment as parent;
        this.preItem.push(
            renderForumItem(this.props.data, this.props.id, false, (this.props.i === 0))
        );

        //new reply
        this.preItem.push(
            renderTextAreaForumItem("reply", `reply::${this.props.id}`, this, () => {
                console.log("new reply");
                console.log(this.props.id);
                console.log(this.textarea.value);

                alert(`Add new reply in comment ${this.props.id}. ${this.textarea.value}`);

            })
        );
    }

    // ##############################################################
    // function for list
    loadData(page, offset) {
        var query = `query{forum_replies(comment_id:"${this.props.id}",page:${page},offset:${offset}) {
            ID
            comment_id
            content
            created_at
            ${USER_SELECT}
        }}`;
        console.log(query);
        return getAxiosGraphQLQuery(query);
    }

    getDataFromRes(res) {
        return res.data.data.forum_replies;
    }

    // render replies
    renderList(d, i, isExtraData = false) {
        var item = [];
        item.push(renderForumItem(d, this.props.id + "_rep_" + d.ID, true));
        return item;
    }

    render() {


        return <div>
            <List
                divClass="forum-list-reply"
                type="append-bottom"
                appendText="Load More Reply"
                showEmpty={false}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
                extraData={this.preItem}
                offset={this.offset}
                renderList={this.renderList}>
            </List>
        </div>;
    }
}

ForumCommentItem.propTypes = {
    id: PropTypes.number.isRequired,
    i: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired
};

import CompanyPopup from './partial/popup/company-popup';
import Page from 'react-facebook/dist/Page';

// this class will generate list of comments
export default class ForumPage extends React.Component {
    constructor(props) {
        super(props);

        this.forum_id = (this.props.match.params.forum_id) ? this.props.match.params.forum_id
            : this.props.forum_id;

        this.loadData = this.loadData.bind(this);
        this.getDataFromRes = this.getDataFromRes.bind(this);
        this.addFeedToView = this.addFeedToView.bind(this);
        this.renderList = this.renderList.bind(this);
        this.offset = OFFSET_COMMENT;

        this.state = {
            extraData: []
        }

        this.isInit = true;
    }

    // ##############################################################
    // function for list
    loadData(page, offset) {
        var query = `query{forum_comments(forum_id:"${this.forum_id}",page:${page},offset:${offset}) {
            ID
            forum_id
            content
            created_at
            ${USER_SELECT}
            replies_count }}`;
        return getAxiosGraphQLQuery(query);
    }

    getDataFromRes(res) {
        return res.data.data.forum_comments;
    }

    // from socket trigger
    addFeedToView(d) {
        this.scrollTo = "top";
        var newData = this.renderList(d, 0, true);
        // add to view
        this.setState((prevState) => {
            prevState.extraData.push(newData);
            return { extraData: prevState.extraData };
        });
    }

    renderList(d, i, isExtraData = false) {
        var item = [];
        item.push(
            <ForumCommentItem
                id={d.ID} i={i} data={d}>
            </ForumCommentItem>
        );
        return item;
    }
    //<button onClick={() => this.addFeedToView({ ID: "a" })}>Add</button>

    renderView(forum) {
        var invalid = <div><h3>Invalid Forum Id</h3></div>;
        var v = null;

        if (this.forum_id.indexOf("company" >= 0)) {
            try {
                var company_id = Number.parseInt(this.forum_id.split("_")[1]);
                if (Number.isNaN(company_id)) {
                    return invalid;
                }

                v = <div className="container-fluid no-padding">
                    <div className="row">
                        <h3>Company Forum
                        <br></br>
                            <small>Ask Questions And Be Noticed by Recruiters</small>
                        </h3>
                    </div>
                    <div className="col-md-4 forum-info">
                        <CompanyPopup id={company_id} displayOnly={true}></CompanyPopup>
                    </div>
                    <div className="col-md-8 no-padding">
                        {forum}
                    </div>
                </div>
            } catch (err) {
                return <div>
                    {invalid}
                    {err}
                </div>;
            }
        }

        return v;
    }

    componentWillMount() {
        this.customEmpty = <div className="text-center">
            <h4 className="text-muted">No Question Posted Yet</h4>
        </div>;

        this.newComment = renderTextAreaForumItem("comment", "comment", this, () => {
            console.log("new comment");
            console.log(this.forum_id);
            console.log(this.textarea.value);
            alert(`Add new comment in forum ${this.forum_id}. ${this.textarea.value}`);
        });
    }

    render() {
        var forum = <div>{this.newComment}
            <List type="append-bottom"
                customEmpty={this.customEmpty}
                divClass="forum-list"
                appendText="Load More Comment"
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
                extraData={this.state.extraData}
                offset={this.offset}
                renderList={this.renderList}>
            </List>
        </div>;
        return this.renderView(forum);
    }
}

ForumPage.propTypes = {
    forum_id: PropTypes.string
};
