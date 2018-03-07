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
import CompanyPopup from './partial/popup/company-popup';

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


//##########################################################################################
// ## Helper Function Start

const addNewForumItem = function (type, entity_id, content, success) {
    var ins = {
        user_id: getAuthUser().ID,
        content: content
    };

    if (type == "comment") {
        ins["forum_id"] = entity_id;
    } else if (type == "reply") {
        ins["comment_id"] = (typeof entity_id != "number") ? Number.parseInt(entity_id) : entity_id;
    }

    var query = `mutation{ add_forum_${type} (${obj2arg(ins, { noOuterBraces: true })}) {
        ID content created_at } }`;

    getAxiosGraphQLQuery(query).then((res) => {
        var r = res.data.data[`add_forum_${type}`];

        var authUser = getAuthUser();
        r.user = {
            ID: authUser.ID,
            img_pos: authUser.img_pos,
            img_size: authUser.img_size,
            img_url: authUser.img_url,
            first_name: authUser.first_name,
            last_name: authUser.last_name
        };

        success(r);
    });
}

const renderForumItem = function (d, is_reply = false, is_first = false) {
    return <ForumItem
        raw_data={d}
        user_title={createUserTitle(d.user)}
        img_url={d.user.img_url}
        img_pos={d.user.img_pos}
        user_id={d.user.ID}
        is_reply={is_reply}
        is_first={is_first}
        img_size={d.user.img_size}
        timestamp={Time.getAgo(d.created_at)}
        content={d.content}
        key={`${is_reply ? "reply" : "comment"}::${d.ID}`}>
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

        <button ref={(v) => parentClass.submit_btn = v}
            className="btn btn-blue"
            onClick={() => onSubmit()}>
            Add
        </button>
    </div>);
};

// ## Helper Function ENd
//##########################################################################################

// This class to create forum item element
// whether it is comment or reply
class ForumItem extends React.Component {
    constructor(props) {
        super(props);
        this.isMine = this.props.user_id == getAuthUser().ID;
    }

    render() {
        var img_dimension = (this.props.is_reply) ? "30px" : "45px";
        var imgView = createImageElement(this.props.img_url, this.props.img_pos
            , this.props.img_size, img_dimension, "frm-image");

        var className = `forum ${this.props.is_reply ? "frm-reply" : ""} ${this.props.is_first ? "frm-first" : ""}`;

        var action = (this.isMine)
            ? <div className="frm-timestamp">
                <a>Edit</a>{" "}<a>Delete</a>
            </div>
            : null;

        return <div key={this.props.key}
            className={className}>
            {imgView}
            <div className="frm-body">
                <div className="frm-title">{this.props.user_title}</div>
                <div className="frm-timestamp">
                    {this.props.timestamp}
                </div>
                {action}
                <p>{this.props.content}</p>
            </div>
        </div>;
    }
}

ForumItem.propTypes = {
    raw_data: PropTypes.object.isRequired,
    user_title: PropTypes.any.isRequired,
    user_id: PropTypes.any.isRequired,
    subtitle: PropTypes.any.isRequired,
    content: PropTypes.string.isRequired,
    img_url: PropTypes.any.isRequired,
    img_pos: PropTypes.any.isRequired,
    img_size: PropTypes.any.isRequired,
    is_reply: PropTypes.bool.isRequired,
    is_first: PropTypes.bool.isRequired,
    key: PropTypes.string.isRequired
};


//####################################################################
// ForumCommentItem
// this class will generate 
// a new list of replies under it
class ForumCommentItem extends React.Component {
    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.getDataFromRes = this.getDataFromRes.bind(this);
        this.renderList = this.renderList.bind(this);
        this.getInitalPreItem = this.getInitalPreItem.bind(this);
        this.offset = OFFSET_REPLY;


        this.commentItem = renderForumItem(this.props.data, false, (this.props.i === 0));
        this.textareaItem = renderTextAreaForumItem("reply", `reply::${this.props.id}`, this, () => {
            this.submit_btn.disabled = true
            addNewForumItem("reply"
                , this.props.id
                , this.textarea.value
                , (res) => {
                    this.submit_btn.disabled = false;
                    this.textarea.value = "";
                    // prepend new reply
                    var newReply = renderForumItem(res, true);
                    this.setState((prevState) => {
                        var preItem = prevState.preItem;
                        preItem.push(newReply);
                        return { preItem: preItem }
                    });

                });
        });

        this.state = {
            preItem: [this.commentItem],
            showTextarea: false
        }
        this.isInit = true;
    }

    toogleTextarea() {
        this.setState((prevState) => {
            var showTextarea = !prevState.showTextarea;
            var preItem = [this.commentItem];
            if(showTextarea){
                preItem.push(this.textareaItem);
            }

            return { showTextarea: showTextarea, preItem:preItem };
        });
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
        return getAxiosGraphQLQuery(query);
    }

    getDataFromRes(res) {
        return res.data.data.forum_replies;
    }

    // render replies
    renderList(d, i, isExtraData = false) {
        var item = [];
        item.push(renderForumItem(d, true));
        return item;
    }

    render() {
        return <div>
            <List
                totalCount={this.props.data.replies_count}
                divClass="forum-list-reply"
                type="append-bottom"
                appendText="Load More Reply"
                showEmpty={false}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
                extraData={this.state.preItem}
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

//####################################################################
// ForumPage
// this class will generate 
// list of ForumCommentItem
export default class ForumPage extends React.Component {
    constructor(props) {
        super(props);

        this.forum_id = (this.props.match.params.forum_id) ? this.props.match.params.forum_id
            : this.props.forum_id;

        this.loadData = this.loadData.bind(this);
        this.getDataFromRes = this.getDataFromRes.bind(this);
        this.addFeedToView = this.addFeedToView.bind(this);
        this.renderList = this.renderList.bind(this);
        this.getInitalPreItem = this.getInitalPreItem.bind(this);

        this.offset = OFFSET_COMMENT;

        this.state = {
            preItem: this.getInitalPreItem()
        }

        this.isInit = true;
    }

    componentWillMount() {
        this.customEmpty = <div className="text-center">
            <h4 className="text-muted">No Question Posted Yet</h4>
        </div>;
    }

    getInitalPreItem() {
        var preItem = [];
        //new comment
        preItem.push(
            renderTextAreaForumItem("comment", "comment", this, () => {
                this.submit_btn.disabled = true
                addNewForumItem("comment"
                    , this.forum_id
                    , this.textarea.value
                    , (res) => {
                        this.submit_btn.disabled = false;
                        this.textarea.value = "";

                        // prepend new comment
                        var newComment = renderForumItem(res);
                        this.setState((prevState) => {
                            var preItem = prevState.preItem;
                            preItem.push(newComment);
                            return { preItem: preItem }
                        });

                    });
            })
        );

        return preItem;
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

    render() {
        var forum = <List type="append-bottom"
            customEmpty={this.customEmpty}
            divClass="forum-list"
            appendText="Load More Comment"
            getDataFromRes={this.getDataFromRes}
            loadData={this.loadData}
            extraData={this.state.preItem}
            offset={this.offset}
            renderList={this.renderList}>
        </List>;
        return this.renderView(forum);
    }
}

ForumPage.propTypes = {
    forum_id: PropTypes.string
};
