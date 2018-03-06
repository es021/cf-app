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

const USER_SELECT = `user {
    ID
    first_name
    last_name
    img_url
    img_pos
    img_size
  }`;

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
        this.offset = 2;

        this.state = {
            extraData: []
        }

        this.isInit = true;
    }

    componentWillMount() {

        //render comment
        this.commentItem = this.renderForumItem(this.props.data, this.props.id, false, (this.props.i === 0));
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

    renderForumItem(d, i, is_reply = false, is_first = false) {
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
            key={i}>
        </ForumItem>;
    }

    // render replies
    renderList(d, i, isExtraData = false) {
        var item = [];
        item.push(this.renderForumItem(d, this.props.id + "_rep_" + d.ID, true));
        return item;
    }

    render() {
        return <List type="append-bottom"
            appendText="Load More Reply"
            showEmpty={false}
            getDataFromRes={this.getDataFromRes}
            loadData={this.loadData}
            extraData={this.commentItem}
            offset={this.offset}
            renderList={this.renderList}>
        </List>;
    }
}

ForumCommentItem.propTypes = {
    id: PropTypes.number.isRequired,
    i: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired
};

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
        this.offset = 2;

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

    render() {
        return <div>
            <h2>Forum for {this.forum_id}</h2>
            <List type="append-bottom"
                appendText="Load More"
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
                extraData={this.state.extraData}
                offset={this.offset}
                renderList={this.renderList}>
            </List>
        </div>;
    }
}

ForumPage.propTypes = {
    forum_id: PropTypes.string
};
