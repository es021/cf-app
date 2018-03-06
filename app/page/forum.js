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

class ForumItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var img_dimension = (this.props.is_reply) ? "30px" : "45px";
        var imgView = createImageElement(this.props.img_url, this.props.img_pos
            , this.props.img_size, img_dimension, "frm-image");

        return <div key={this.props.key}
            className={`forum ${this.props.is_reply ? "frm-reply" : ""}`}>
            {imgView}
            <div className="frm-body">
                <div className="frm-title">
                    {this.props.user_title}
                    <span className="frm-timestamp">{this.props.timestamp}</span>
                </div>
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
    key: PropTypes.string.isRequired
};

export default class ForumPage extends React.Component {
    constructor(props) {
        super(props);

        this.forum_id = (this.props.match.params.forum_id) ? this.props.match.params.forum_id
            : this.props.forum_id;

        this.loadData = this.loadData.bind(this);
        this.getDataFromRes = this.getDataFromRes.bind(this);
        this.addFeedToView = this.addFeedToView.bind(this);
        //this.listComponentDidUpdate = this.listComponentDidUpdate.bind(this);
        this.renderList = this.renderList.bind(this);
        this.offset = 10;

        this.state = {
            extraData: []
        }

        this.isInit = true;
    }

    componentDidMount() {

    }

    // listComponentDidUpdate() {
    //     //console.log("listComponentDidUpdate")
    //     //console.log(this.scrollTo);

    //     if (this.scrollTo == "bottom") {
    //         //scroll to bottom
    //         this.dashBody.scrollTop = 99999999;
    //         //console.log("go bottom");

    //     }

    //     if (this.scrollTo == "top") {
    //         //scroll to top
    //         this.dashBody.scrollTop = 0;
    //         //console.log("go top");
    //     }

    //     //console.log(this.dashBody.scrollTop);
    //     this.scrollTo == "";
    // }

    // ##############################################################
    // function for list
    loadData(page, offset) {
        var user_sel = `user {
            ID
            first_name
            last_name
            img_url
            img_pos
            img_size
          }`;
        var query = `query{forum_comments(forum_id:"${this.forum_id}",page:${page},offset:${offset}) {
            ID
            forum_id
            content
            created_at
            ${user_sel}
            replies {
                ID
                comment_id
                content
                created_at
                ${user_sel} }
            }}`;

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

    renderForumItem(d, i, is_reply = false) {
        return <ForumItem
            raw_data={d}
            user_title={createUserTitle(d.user)}
            img_url={d.user.img_url}
            img_pos={d.user.img_pos}
            is_reply={is_reply}
            img_size={d.user.img_size}
            timestamp={Time.getAgo(d.created_at)}
            content={d.content}
            key={i} >
        </ForumItem>;
    }

    renderList(d, i, isExtraData = false) {
        var item = [];
        item.push(this.renderForumItem(d, i));
        for (var j in d.replies) {
            item.push(this.renderForumItem(d.replies[i], i + "_rep_" + j, true));
        }
        return item;
    };
    //<button onClick={() => this.addFeedToView({ ID: "a" })}>Add</button>

    render() {
        return <div>
            <h2>Forum for {this.forum_id}</h2>
            <List type="append-bottom"
                appendText="Load More"
                listClass="db_body"
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
