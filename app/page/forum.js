import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ForumComment, ForumReply, UserEnum, PrescreenEnum } from '../../config/db-config';
import List from '../component/list';
import { createImageElement } from '../component/profile-card';
import Tooltip from '../component/tooltip';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { Time } from '../lib/time';
import { getAuthUser, getCF, isRoleOrganizer, isRoleAdmin, isRoleStudent } from '../redux/actions/auth-actions';
import obj2arg from 'graphql-obj2arg';
import * as layoutActions from '../redux/actions/layout-actions';
import { createUserTitle } from './users';
import CompanyPopup from './partial/popup/company-popup';
import { Loader } from '../component/loader';
import { openSIAddForm } from './partial/activity/scheduled-interview';

require('../css/forum.scss');

const OFFSET_COMMENT = 10;
const OFFSET_REPLY = 2;

const USER_SELECT = `user{
    ID
    first_name
    role
    last_name
    img_url
    img_pos
    img_size }`;


//##########################################################################################
// ## Helper Function Start

const addNewForumItem = function (type, entity_id, content, is_owner, success) {
    var ins = {
        user_id: getAuthUser().ID,
        content: content,
        is_owner: (is_owner) ? 1 : 0
    };

    if (type == "comment") {
        ins["forum_id"] = entity_id;
    } else if (type == "reply") {
        ins["comment_id"] = (typeof entity_id != "number") ? Number.parseInt(entity_id) : entity_id;
    }

    var query = `mutation{ add_forum_${type} (${obj2arg(ins, { noOuterBraces: true })}) {
        ID content is_owner created_at } }`;

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

const renderForumItem = function (d, is_reply = false, toogleAddReply = null, onCommentDeleted = null, isForumOwner = false) {
    var user_title = (d.user.role === UserEnum.ROLE_STUDENT)
        ? createUserTitle(d.user)
        : d.user.first_name + " " + d.user.last_name;

    return <ForumItem
        isForumOwner={isForumOwner}
        onCommentDeleted={onCommentDeleted}
        toogleAddReply={toogleAddReply}
        raw_data={d}
        id={d.ID}
        user_title={user_title}
        img_url={d.user.img_url}
        img_pos={d.user.img_pos}
        user_id={d.user.ID}
        is_reply={is_reply}
        img_size={d.user.img_size}
        timestamp={Time.getAgo(d.created_at)}
        content={d.content}
        key={`${is_reply ? "reply" : "comment"}::${d.ID}`}>
    </ForumItem>;
};

//##########################################################################################

class ForumTextarea extends React.Component {
    constructor(props) {
        super(props);
        this.wordLimit = 450;
        this.state = {
            count: 0
        }
    }

    setWordCount(count) {
        this.setState(() => {
            return { count: count };
        })
    }

    getWordLeft() {
        return this.wordLimit - this.state.count;
    }

    isWordExceed() {
        return this.getWordLeft() < 0;
    }

    render() {
        var limit = <div className={`frm-txt-count ${this.isWordExceed() ? "text-red" : ""}`}>
            {this.getWordLeft()}
        </div>;

        return (<div className={`forum-textarea-${this.props.type}`}>
            <textarea ref={(v) => this.props.parentClass.textarea = v}
                className="form-control input-sm"
                onKeyUp={(ev) => {
                    this.setWordCount(this.props.parentClass.textarea.value.length);
                }}
                rows={(this.props.type == "comment") ? "4" : "3"}
                placeholder={(this.props.type == "comment") ? "Add New Question or Comment." : "Add New Reply."}
                name={this.props.name}>
            </textarea>
            <button ref={(v) => this.props.parentClass.submit_btn = v}
                className="btn btn-sm btn-blue"
                onClick={() => {
                    var v = this.props.parentClass.textarea.value;
                    if (v === "" || v === null
                        || this.isWordExceed()) {
                        this.props.parentClass.textarea.focus();
                        return;
                    }
                    this.setWordCount(0);
                    this.props.onSubmit();
                }}>Submit</button>
            {limit}
        </div>);
    }
}

ForumTextarea.propTypes = {
    parentClass: PropTypes.any.isRequired,
    type: PropTypes.oneOf(["comment", "reply"]).isRequired,
    name: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired
};

const renderTextAreaForumItem = function (type, name, parentClass, onSubmit) {
    return <ForumTextarea type={type} name={name} parentClass={parentClass} onSubmit={onSubmit}></ForumTextarea>;
};

import { openEditPopup, openDeletePopup } from '../component/general-form';

//##########################################################################################
// This class to create forum item element
// whether it is comment or reply
class ForumItem extends React.Component {
    constructor(props) {
        super(props);
        this.isMine = this.props.user_id == getAuthUser().ID;
        this.openEditPopup = this.openEditPopup.bind(this);
        this.openDeletePopup = this.openDeletePopup.bind(this);

        this.entity = (this.props.is_reply) ? "forum_reply" : "forum_comment";
        this.entity_singular = (this.props.is_reply) ? "Reply" : "Comment";

        this.state = {
            showReply: false,
            content: this.props.content,
            deleted: false
        };

        this.authUser = getAuthUser();

        this.role = this.props.raw_data.user.role;

    }

    openEditPopup() {

        var formItems = [
            { "header": "Editing Comment" },
            {
                name: "content",
                type: "textarea",
                required: true
            }
        ];

        var formDefault = { content: this.state.content };

        var willSubmit = (d) => {
            d.ID = this.props.id;
            return d;
        }

        var onSuccess = (d) => {
            this.setState((prevState) => {
                return { content: d.content };
            });
        }

        openEditPopup(this.props.id, this.entity, this.entity_singular, formItems, formDefault, willSubmit, onSuccess);
    }

    openDeletePopup() {
        var onSuccess = (d) => {
            // if the item is comment,
            // then run the parents' handler for delete
            if (!this.props.is_reply && this.props.onCommentDeleted) {
                this.props.onCommentDeleted();
            }
            // for reply, just set deleted to true
            else {
                this.setState((prevState) => {
                    return { deleted: true };
                });
            }
        }

        openDeletePopup(this.props.id, this.entity, onSuccess);
    }

    render() {
        if (this.state.deleted) {
            return null;
        }

        var img_dimension = (this.props.is_reply) ? "30px" : "45px";
        var imgView = createImageElement(this.props.img_url, this.props.img_pos
            , this.props.img_size, img_dimension, "frm-image");

        var className = `forum ${this.props.is_reply ? "frm-reply" : ""}`;

        //createAction
        var action = [<span className="frm-action">{this.props.timestamp}</span>];
        if (this.isMine) {
            action.push(<a onClick={this.openEditPopup} className="frm-action">Edit</a>);
            action.push(<a onClick={this.openDeletePopup} className="frm-action">Delete</a>);
        }
        if (!this.props.is_reply) {
            action.push(<a className="frm-action"
                onClick={() => {
                    this.setState((prevState) => { return { showReply: !prevState.showReply }; })
                    this.props.toogleAddReply();
                }}>
                {(this.state.showReply) ? "Hide Reply" : "Reply"}
            </a>);
        }

        // schedule for interview action
        if (this.props.isForumOwner && this.role === UserEnum.ROLE_STUDENT) {
            action.push(<a className="frm-action"
                onClick={() => {
                    openSIAddForm(this.props.user_id, this.authUser.rec_company, PrescreenEnum.ST_FORUM);
                }}>
                Schedule For Interview
            </a>);
        }

        // add forum owner highlights
        // in db
        var owner = (this.props.raw_data.is_owner)
            ? <Tooltip
                bottom="19px"
                left="-65px"
                width="140px"
                alignCenter={true}
                content={<i style={{ color: "#23527c" }} className="fa left fa-shield"></i>}
                tooltip="Company's Recruiter">
            </Tooltip>
            : null;

        return <div key={this.props.key}
            className={className}>
            {imgView}
            <div className="frm-body">
                <div className="frm-title">
                    {owner}
                    {this.props.user_title}
                </div>
                <p className="frm-content">{this.state.content}</p>
                <div className="frm-timestamp">{action}</div>
            </div>
        </div>;
    }
}

ForumItem.propTypes = {
    isForumOwner: PropTypes.bool.isRequired,
    onCommentDeleted: PropTypes.func,
    toogleAddReply: PropTypes.func,
    raw_data: PropTypes.object.isRequired,
    user_title: PropTypes.any.isRequired,
    id: PropTypes.any.isRequired,
    user_id: PropTypes.any.isRequired,
    subtitle: PropTypes.any.isRequired,
    content: PropTypes.string.isRequired,
    img_url: PropTypes.any.isRequired,
    img_pos: PropTypes.any.isRequired,
    img_size: PropTypes.any.isRequired,
    is_reply: PropTypes.bool.isRequired,
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
        this.toogleTextarea = this.toogleTextarea.bind(this);
        this.onCommentDeleted = this.onCommentDeleted.bind(this);
        this.offset = OFFSET_REPLY;

        // in state preItem,
        // texarea is at index no 1
        this.TEXTAREA_INDEX = 1;

        this.commentItem = renderForumItem(this.props.data, false, this.toogleTextarea, this.onCommentDeleted, this.props.isForumOwner);
        this.textareaItem = renderTextAreaForumItem("reply", `reply::${this.props.id}`, this, () => {
            this.submit_btn.disabled = true
            addNewForumItem("reply"
                , this.props.id
                , this.textarea.value
                , this.props.isForumOwner
                , (res) => {
                    this.submit_btn.disabled = false;
                    this.textarea.value = "";
                    // prepend new reply
                    var newReply = renderForumItem(res, true, null, null, this.props.isForumOwner);
                    this.setState((prevState) => {
                        var preItem = prevState.preItem;
                        preItem.push(newReply);
                        return { preItem: preItem }
                    });
                });
        });

        this.state = {
            preItem: [this.commentItem],
            showTextarea: false,
            commentDeleted: false
        }
        this.isInit = true;
    }


    onCommentDeleted() {
        this.setState(() => {
            return { commentDeleted: true };
        })
    }

    toogleTextarea() {
        this.setState((prevState) => {

            var showTextarea = !prevState.showTextarea;
            if (showTextarea) {
                prevState.preItem[this.TEXTAREA_INDEX] = this.textareaItem;
            } else {
                prevState.preItem[this.TEXTAREA_INDEX] = null;
            }

            return { showTextarea: showTextarea, preItem: prevState.preItem };
        });
    }

    // ##############################################################
    // function for list
    loadData(page, offset) {
        var query = `query{forum_replies(comment_id: "${this.props.id}",page:${page},offset:${offset}) {
            ID comment_id is_owner content
            created_at ${USER_SELECT} }}`;
        return getAxiosGraphQLQuery(query);
    }

    getDataFromRes(res) {
        return res.data.data.forum_replies;
    }

    // render replies
    renderList(d, i, isExtraData = false) {
        var item = [];
        item.push(renderForumItem(d, true, null, null, this.props.isForumOwner));
        return item;
    }

    render() {
        if (this.state.commentDeleted) {
            return null;
        }

        return <List
            totalCount={this.props.data.replies_count}
            divClass="forum-comment"
            type="append-bottom"
            appendText="Load More Reply"
            showEmpty={false}
            getDataFromRes={this.getDataFromRes}
            loadData={this.loadData}
            extraData={this.state.preItem}
            offset={this.offset}
            renderList={this.renderList}>
        </List>;
    }
}

ForumCommentItem.propTypes = {
    isForumOwner: PropTypes.bool.isRequired,
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

        // set in check forum Validity
        // owner comment/reply will be highlighted
        // can set interview
        this.isForumOwner = false;

        this.loadData = this.loadData.bind(this);
        this.getDataFromRes = this.getDataFromRes.bind(this);
        this.addFeedToView = this.addFeedToView.bind(this);
        this.renderList = this.renderList.bind(this);
        this.getInitalPreItem = this.getInitalPreItem.bind(this);
        this.checkForumValidity = this.checkForumValidity.bind(this);
        this.offset = OFFSET_COMMENT;

        this.state = {
            loading: true,
            preItem: this.getInitalPreItem()
        }

        this.type = null;
        this.params = {};
    }

    componentWillMount() {
        this.customEmpty = <div className="text-center">
            <h4 className="text-muted">No Question Posted Yet</h4>
        </div>;

        this.invalid = <div className="text-center">
            <h4 className="text-muted">Invalid Forum ID</h4>
        </div>;

        if (this.checkForumValidity()) {
            this.checkForumValidityAjax();
        } else {
            this.finishValidate(false);
        }
    }

    finishValidate(valid) {
        if (valid === false) {
            this.type = null;
        }

        this.setState(() => {
            return { loading: false }
        })
    }

    checkForumValidityAjax() {
        switch (this.type) {
            case "company":
                var query = `query{company(ID: ${this.params.company_id}){name} }`;

                getAxiosGraphQLQuery(query).then((res) => {
                    var data = res.data.data.company;
                    if (data == null) {
                        this.type = null;
                    } else {
                        this.params.company_name = data.name;
                    }
                    this.finishValidate();
                });
                break;
        }
    }

    checkForumValidity() {
        // check forum validity
        // and get type and params
        // type null is invalid
        if (this.forum_id.indexOf("company" >= 0)) {
            try {
                var idArr = this.forum_id.split("_");
                var company_id = Number.parseInt(idArr[1]);
                if (Number.isNaN(company_id)) {
                    return false;
                }

                if (idArr[0] !== "company") {
                    return false;
                }

                this.type = "company";
                this.params = {
                    company_id: company_id
                };

                // check isOwner
                if (getAuthUser().rec_company === company_id) {
                    this.isForumOwner = true;
                }

            } catch (err) {
                console.log(err);
                return false;
            }
        }

        return true;
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
                    , this.isForumOwner
                    , (res) => {
                        this.submit_btn.disabled = false;
                        this.textarea.value = "";

                        //prepend new comment
                        var newComment = <ForumCommentItem
                            id={res.ID}
                            isForumOwner={this.isForumOwner}
                            data={res}
                            i={`comment::${res.ID}`}>
                        </ForumCommentItem>;

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
        var query = `query{forum_comments(forum_id: "${this.forum_id}",page:${page},offset:${offset}) {
                        ID forum_id content is_owner created_at
            ${USER_SELECT} replies_count }}`;
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
                isForumOwner={this.isForumOwner}
                id={d.ID} i={i} data={d}>
            </ForumCommentItem>
        );
        return item;
    }
    //<button onClick={() => this.addFeedToView({ ID: "a" })}>Add</button>

    renderView(forum) {
        var v = this.invalid;
        switch (this.type) {
            case 'company':
                v = <div className="container-fluid no-padding">
                    <div className="row">
                        <h3>Forum for {this.params.company_name}
                            <br></br>
                            <small>
                                {(isRoleStudent()) ? "Ask Questions And Be Noticed by Recruiters" : null}
                            </small>
                        </h3>
                    </div>
                    <div className="col-md-4 forum-info">
                        <CompanyPopup id={this.params.company_id} displayOnly={true}></CompanyPopup>
                        <br></br>
                    </div>
                    <div className="col-md-8 no-padding">
                        {forum}
                    </div>
                </div>
                break;
        }

        return v;
    }

    render() {

        if (this.state.loading) {
            return <Loader size="3" text="Loading Forum"></Loader>;
        }

        var forum = <List type="append-bottom"
            customEmpty={this.customEmpty}
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
