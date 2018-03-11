import React, { Component } from 'react';
import { ButtonLink } from './buttons';
import { Loader } from './loader';
import PropTypes from 'prop-types';
import Tooltip from './tooltip';

require("../css/list.scss");

export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.page = 0;
        this.load = this.load.bind(this);
        this.isAppendType = this.isAppendType.bind(this);
        this.showLoadMore = this.showLoadMore.bind(this);
        this.renderDataContent = this.renderDataContent.bind(this);

        this.state = {
            listItem: null,
            fetching: true,
            fetching_append: false,
            totalFetched: 0,
            fetchCount: 0,
            empty: false
        }

        this.NEXT = "Next";
        this.PREV = "Prev";
    }

    componentWillMount() {
        this.load(this.NEXT);
    }

    componentDidUpdate() {
        if (this.props.componentDidUpdate) {
            this.props.componentDidUpdate();
        }
    }

    isAppendType() {
        return (this.props.type.indexOf("append") >= 0);
    }

    load(type) {
        // set new page
        if (type == this.NEXT) {
            this.page++;
        }

        if (type == this.PREV) {
            if (this.page == 1) {
                return false;
            }

            this.page--;
        }

        // set fetching to true if not append type
        if (!this.isAppendType()) {
            this.setState(() => {
                return {
                    fetching: true,
                }
            });
        } else {
            this.setState(() => {
                return {
                    fetching_append: true,
                }
            });
        }

        // fetch data start
        this.props.loadData(this.page, this.props.offset).then((res) => {
            var data = this.props.getDataFromRes(res);

            var listItem = null;
            var empty = false;
            try {

                //empty list
                if (data.length <= 0) {
                    var empty = (this.props.showEmpty)
                        ? <span className="text-muted text-center">Nothing To Show Here</span>
                        : null;

                    if (this.props.customEmpty) {
                        empty = this.props.customEmpty;
                    }

                    if (!this.isAppendType()) {
                        listItem = empty;
                    } else {
                        if (this.state.listItem != null) {
                            listItem = this.state.listItem;
                        } else {
                            listItem = empty;
                        }
                    }
                    empty = true;
                }
                //success
                else {
                    // need to reverse?
                    if (this.isAppendType()) {
                        this.setState((prevState) => {
                            var listItem = prevState.listItem;
                            if (listItem == null) {
                                listItem = [];
                            }

                            data.map((d, i) => {
                                if (this.props.type == "append-top") {

                                    //for chat, render list can return array
                                    var newItem = this.props.renderList(d, i);
                                    if (Array.isArray(newItem)) {
                                        newItem.map((_d, i) => {
                                            listItem.unshift(_d);
                                        });
                                    } else {
                                        listItem.unshift(newItem);
                                    }

                                } else if (this.props.type == "append-bottom") {
                                    listItem.push(this.props.renderList(d, i));
                                }
                            });

                            return {
                                listItem: listItem
                                , fetching: false
                                , fetching_append: false
                                , totalFetched: prevState.totalFetched + data.length
                                , fetchCount: data.length
                                , empty: empty
                            }
                        });

                        return;

                    } else {
                        listItem = data.map((d, i) => {
                            return this.props.renderList(d, i)
                        });
                    }
                }

            }
            // error render
            catch (err) {
                listItem = `[Error While Rendering List] ${err}`;
            }

            this.setState((prevState) => {
                return {
                    listItem: listItem, fetching: false
                    , fetching_append: false
                    , fetchCount: data.length
                    , totalFetched: prevState.totalFetched + data.length
                    , empty: empty
                }
            });

        }
            // error fetching
            , (err) => {
                var listItem = `[Error While Fetching List Data] ${err}`;
                this.setState(() => {
                    return { listItem: listItem, fetching: false, fetching_append: false }
                });
            });
    }

    renderDataContent() {
        var dataContent = null;

        if (this.state.empty) {
            return this.state.listItem;
        }

        if (this.props.type == "table") {
            dataContent = (this.state.empty) ? this.state.listItem :
                <div className=" table-responsive">
                    <table ref={this.props.listRef} className={`${this.props.listClass} table table-striped table-bordered table-hover table-condensed text-left`}>
                        {this.props.tableHeader}
                        <tbody>
                            {this.state.listItem}
                        </tbody>
                    </table>
                </div>;
        } else {
            dataContent = this.state.listItem;
        }

        return dataContent;
    }

    showLoadMore() {
        if (this.props.totalCount !== null) {
            if (this.state.totalFetched >= this.props.totalCount) {
                return false;
            } else {
                return true;
            }
        }

        if (this.state.fetchCount >= this.props.offset) {
            return true;
        }

        return false;
    }

    render() {
        var loading = (this.props.customLoading) ? this.props.customLoading :
            <Loader isCenter={true} size="2" text="Loading.."></Loader>;

        var topView = null;
        var bottomView = null;

        // for append type
        var fetchBtn = null;
        var extraTop = null;
        var extraBottom = null;

        if (this.props.type == 'list' || this.props.type == 'table') {
            var paging = <div className={this.props.pageClass} style={{ marginBottom: "10px" }}>
                Page <b>{this.page}</b>
                <br></br>
                {(this.page > 1) ?
                    <small style={{ marginRight: "6px" }}>
                        <ButtonLink onClick={() => this.load(this.PREV)} label="<< Prev"></ButtonLink>
                    </small>
                    : null
                }
                {(this.state.fetchCount >= this.props.offset) ?
                    <small style={{ marginLeft: "6px" }}>
                        <ButtonLink onClick={() => this.load(this.NEXT)} label="Next >>"></ButtonLink>
                    </small>
                    : null
                }
            </div>;
            //topView = (this.props.offset >= 10 && this.state.fetchCount >= 10) ? paging : null;
            topView = paging;
            bottomView = paging;

        }
        // For append type
        else if (this.isAppendType()) {

            if (this.state.fetching_append) {
                fetchBtn = <Loader isCenter={true} size="2"></Loader>;
            } else {
                fetchBtn = (this.showLoadMore()) ?
                    <small style={{ marginLeft: "6px" }}>
                        <ButtonLink onClick={() => this.load(this.NEXT)} label={this.props.appendText}></ButtonLink>
                    </small> : null;
            }

            if (this.props.type == "append-top") {
                topView = fetchBtn;
                extraBottom = this.props.extraData;
            } else if (this.props.type == "append-bottom") {
                bottomView = fetchBtn;
                extraTop = this.props.extraData;
            }
        }


        var content = <div className={`${this.props.divClass}`}>
            {topView}
            <ul className={`${this.props.listClass}`} ref={this.props.listRef}>
                {extraTop}
                {this.renderDataContent()}
                {extraBottom}
            </ul>
            {bottomView}
        </div>;
        return (this.state.fetching) ? loading : content;
    }
}

List.propTypes = {
    // general props
    offset: PropTypes.number.isRequired,
    customLoading: PropTypes.element,
    customEmpty: PropTypes.element,
    listClass: PropTypes.string,
    listRef: PropTypes.object,
    totalCount: PropTypes.number, // total count for the list
    key: PropTypes.number, // to force update
    // function
    componentDidUpdate: PropTypes.func, // use in dashboard
    loadData: PropTypes.func.isRequired, // function (page)
    renderList: PropTypes.func.isRequired, // function (data)
    getDataFromRes: PropTypes.func.isRequired, // key for query response
    // type
    // table or list 
    // append-top used in chat
    type: PropTypes.oneOf(["table", "list", "append-top", "append-bottom"]).isRequired,
    // table
    tableHeader: PropTypes.element,
    // append-
    appendText: PropTypes.string,
    extraData: PropTypes.array,
    // page config
    pageClass: PropTypes.string,
    divClass: PropTypes.string,
    showEmpty: PropTypes.bool
};

List.defaultProps = {
    appendText: "Load More",
    extraData: null,
    divClass: "",
    pageClass: "",
    totalCount: null,
    listClass: "",
    listRef: null,
    showEmpty: true
};

/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/

import ProfileCard, { PCType } from './profile-card';
import { Page } from 'react-facebook';

export class ProfileListItem extends Component {
    render() {
        var className = "profile-li";
        if (this.props.list_type) {
            className += "-" + this.props.list_type;
        }

        className += " " + this.props.list_type_extra;

        var img_dimension = (this.props.img_dimension) ? this.props.img_dimension : "75px";
        return <ProfileCard {
            ...this.props} img_dimension={img_dimension}
            className={className}></ProfileCard>;
    }
}

ProfileListItem.propTypes = {
    list_type: PropTypes.oneOf(["card"]),
    list_type_extra: PropTypes.string,
    title: PropTypes.any.isRequired,
    subtitle: PropTypes.string.isRequired,
    badge: PropTypes.string,
    badge_tooltip: PropTypes.string,
    img_url: PropTypes.string,
    img_pos: PropTypes.string,
    img_size: PropTypes.string,
    img_dimension: PropTypes.string,
    type: PropTypes.oneOf([PCType.STUDENT, PCType.RECRUITER, PCType.COMPANY]).isRequired,
    body: PropTypes.any
};

ProfileListItem.defaultProps = {
    list_type_extra: ""
};

export class ProfileListWide extends Component {
    render() {
        var img_dimension = (this.props.img_dimension) ? this.props.img_dimension : "75px";

        var imgView = <ProfileCard {
            ...this.props} title={null} body={null} subtitle={null} img_dimension={img_dimension}
            className={className}></ProfileCard>;

        var className = "card-wide";
        return <div className={className}>
            <div className="card-container container-fluid">
                <div className={`${className}-item col-md-2`}>
                    {imgView}
                </div>
                <div className={`${className}-item col-md-${(this.props.action_disabled) ? "10" : "8"}`}>
                    <div className="item-main">
                        <h4>{this.props.title}</h4>
                        <div>{this.props.body}</div>
                    </div>
                </div>
                {(this.props.action_disabled) ? null
                    : <div className={`item-action`}>
                        <a className={`btn btn-blue`}
                            onClick={() => this.props.action_handler()}>{this.props.action_text}</a>
                    </div>
                }
            </div>
        </div>;
    }
}

ProfileListWide.propTypes = {
    title: PropTypes.any.isRequired,
    subtitle: PropTypes.string.isRequired,
    img_url: PropTypes.string,
    img_pos: PropTypes.string,
    img_size: PropTypes.string,
    img_dimension: PropTypes.string,
    action_text: PropTypes.string,
    action_handler: PropTypes.func,
    action_disabled: PropTypes.bool,
    type: PropTypes.oneOf([PCType.STUDENT, PCType.RECRUITER, PCType.COMPANY]).isRequired,
    body: PropTypes.any
};

/*******************************************************************************************/

export class SimpleListItem extends Component {
    render() {

        var body = (this.props.body) ? <p className="sili-body">{this.props.body}</p> : null;
        var onDelete = (!this.props.onDelete) ? null :
            <a className="sili-operation" id={this.props.onDelete.id}
                label={this.props.onDelete.label}
                onClick={this.props.onDelete.onClick}
            >Delete</a>;

        var onEdit = (!this.props.onEdit) ? null :
            <a className="sili-operation" id={this.props.onEdit.id}
                label={this.props.onEdit.label}
                onClick={this.props.onEdit.onClick}
            >Edit</a>;

        var typeClass = "";
        if (this.props.type) {
            typeClass = "simple-li-card";
        }

        return (<div className={
            `simple-li ${typeClass}`}>
            <div className="sili-title">{this.props.title}</div>
            <div className="sili-subtitle">{this.props.subtitle}{onEdit}{onDelete}</div>

            {body}
        </div>);
    }
}

SimpleListItem.propTypes = {
    title: PropTypes.any.isRequired,
    subtitle: PropTypes.string.isRequired,
    body: PropTypes.any,
    onDelete: PropTypes.obj,
    onEdit: PropTypes.obj,
    type: PropTypes.oneOf(["card"])
};


export class CustomList extends Component {
    getTableLi(d, i) {
        return <tr onClick={this.props.onClick} className={liClassName} key={i}>{d}</tr>;
    }

    getLabelLi(d, i) {
        var labels = ["primary", "danger", "success", "default"];
        var index = i % labels.length;
        var liClassName = `label label-${labels[index]}`;
        return <li onClick={this.props.onClick} className={liClassName} key={i}>{d}</li>;

    }

    getIconLinkLi(d, i) {
        var style = {
            background: d.color,
            color: "white",
            fontSize: this.props.il_font,
            width: this.props.il_dimension,
            height: this.props.il_dimension
        };

        var onClick = (d.onClick) ? d.onClick : this.props.onClick;
        var content = <li onClick={onClick} className={`li-${this.props.className}`} key={i}>
            <a href={d.url} target="blank">
                <div style={style} className="icon-circle" >
                    <i className={`fa fa-${d.icon}`}></i>
                </div>
            </a>
        </li>;

        return <Tooltip
            debug={false}
            width={this.props.il_tooltip.width}
            left={this.props.il_tooltip.left}
            bottom={this.props.il_tooltip.bottom}
            content={content}
            tooltip={d.label}>
        </Tooltip>
    }

    getIconLi(d, i) {
        return (<li onClick={this.props.onClick} className={`li-${this.props.className}`} key={i}>

            {(d.label) ? <div className="cli-label">
                {(d.icon) ? <i className={`fa fa-${d.icon}`}></i> : null}
                {d.label}
            </div> : null}
            {(d.value) ? <div className="cli-value">{d.value}</div> : null}
        </li>);
    }

    render() {

        if (this.props.items.length === 0) {
            if (typeof this.props.emptyMessage !== "undefined") {
                return <div className="text-muted">{this.props.emptyMessage}</div>;
            } else {
                return <div className="text-muted">Nothing To Show Here</div>;
            }
        }

        var view = this.props.items.map((d, i) => {
            switch (this.props.className) {
                case "empty":
                    return <li onClick={this.props.onClick} key={i}>{d}</li>;
                    break;
                case "normal":
                    return <li className="normal" onClick={this.props.onClick} key={i}>{d}</li>;
                    break;
                case "table":
                    return this.getTableLi(d, i);
                    break;
                case "label":
                    return this.getLabelLi(d, i);
                    break;
                case "icon-link":
                    return this.getIconLinkLi(d, i);
                    break;
                case "icon":
                    return this.getIconLi(d, i);
                    break;
            }
        });

        var className = "";
        if (this.props.className != "normal") {
            className += `custom-list-${this.props.className} `;
        } else {
            className += this.props.className;
        }

        className += (this.props.ux) ? " li-ux " : "";

        var style = {
            justifyContent: (this.props.alignCenter) ? "center" : "start"
        };

        return (<ul style={style}
            className={className}>
            {view}</ul>);
    }
}

CustomList.propTypes = {
    // specifically for iconLink
    il_dimension: PropTypes.string,
    il_font: PropTypes.string,
    il_tooltip: PropTypes.object,

    alignCenter: PropTypes.bool,
    items: PropTypes.array.isRequired,
    emptyMessage: PropTypes.any,
    className: PropTypes.oneOf(["empty", "normal", "icon", "label", "icon-link"]),
    onClick: PropTypes.func,
    ux: PropTypes.bool // added class "li-ux" if true then is user interactive, on hover on active
};

CustomList.defaultProps = {
    il_dimension: "26px",
    il_font: "initial",
    il_tooltip: {},

    alignCenter: true
};

// to create icon link list
// with different size
export function createIconLink(size, items, alignCenter = true, onClick = null, emptyMessage = undefined) {
    var tooltip = {};
    var dimension = "";
    var font = "";
    switch (size) {
        case "sm":
            dimension = "26px";
            tooltip.width = "90px"
            tooltip.left = "-31px"
            tooltip.bottom = "28px"
            font = "initial"
            break;
        case "lg":
            dimension = "70px";
            tooltip.width = "120px"
            tooltip.left = "-22px"
            tooltip.bottom = "75px"
            font = "35px";
            break;
    }

    return <CustomList className={"icon-link"}
        il_dimension={dimension}
        il_tooltip={tooltip}
        il_font={font}

        alignCenter={alignCenter}
        emptyMessage={emptyMessage}
        onClick={onClick}

        items={items}>
    </CustomList>
}