import React, { Component } from 'react';
import { ButtonLink } from './buttons';
import { Loader } from './loader';
import PropTypes from 'prop-types';

require("../css/list.scss");

export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.page = 0;
        this.load = this.load.bind(this);

        this.state = {
            listItem: null,
            fetching: true,
            fetchCount: 0,
            empty: false
        }

        this.NEXT = "Next";
        this.PREV = "Prev";
    }

    componentWillMount() {
        this.load(this.NEXT);
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

        // set fetching to true
        this.setState(() => {
            return {
                fetching: true,
            }
        });

        // fetch data start
        this.props.loadData(this.page, this.props.offset).then((res) => {
            var data = this.props.getDataFromRes(res);
            var listItem = null;
            var empty = false;
            try {

                //empty list
                if (data.length <= 0) {
                    listItem = <span className="text-muted text-center">Nothing To Show Here</span>;
                    empty = true;
                }
                //success
                else {
                    listItem = data.map((d, i) => {
                        return this.props.renderList(d, i)
                    });
                }

            }
            // error render
            catch (err) {
                listItem = `[Error While Rendering List] ${err}`;
            }

            this.setState(() => {
                return { listItem: listItem, fetching: false, fetchCount: data.length, empty: empty }
            });

        }
            // error fetching
            , (err) => {
                var listItem = `[Error While Fetching List Data] ${err}`;
                this.setState(() => {
                    return { listItem: listItem, fetching: false }
                });
            });
    }

    render() {
        var loading = (this.props.customLoading) ? this.props.customLoading : <Loader size="2" text="Loading.."></Loader>;

        var paging = <div style={{marginBottom:"10px"}}>
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

        var dataContent = null;
        if (this.props.type == "table") {
            dataContent = (this.state.empty) ? this.state.listItem :
                <table className={`${this.props.listClass} table table-responsive table-striped table-bordered table-hover table-condensed text-left`}>
                    {this.props.tableHeader}
                    <tbody>
                        {this.state.listItem}
                    </tbody>
                </table>;
        } else {
            dataContent = <ul className={`${this.props.listClass}`}>
                {this.state.listItem}
            </ul>;
        }

        var content = <div>
            {(this.props.offset >= 10 && this.state.fetchCount >= 10) ? paging : null}
            {dataContent}
            {paging}
        </div>;

        return (this.state.fetching) ? loading : content;
    }
}

List.propTypes = {
    loadData: PropTypes.func.isRequired, // function (page)
    renderList: PropTypes.func.isRequired, // function (data)
    offset: PropTypes.number.isRequired,
    getDataFromRes: PropTypes.func.isRequired, // key for query response
    customLoading: PropTypes.element,
    listClass: PropTypes.string,
    tableHeader: PropTypes.element,
    key: PropTypes.number,
    type: PropTypes.oneOf(["table", "list"]).isRequired // table or list
};

/*******************************************************************************************/
import ProfileCard, { PCType } from './profile-card';

export class ProfileListItem extends Component {
    render() {
        var className = "profile-li";
        if (this.props.list_type) {
            className += "-" + this.props.list_type;
        }
        var img_dimension = (this.props.img_dimension) ? this.props.img_dimension : "75px";
        return <ProfileCard {...this.props} img_dimension={img_dimension}
            className={className}></ProfileCard>;
    }
}

ProfileListItem.propTypes = {
    list_type: PropTypes.oneOf(["card"]),
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

        return (<div className={`simple-li ${typeClass}`}>
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
        var labels = ["primary", "default", "success", "danger"];
        var index = i % labels.length;
        var liClassName = `label label-${labels[index]}`;
        console.log(d);
        return <li onClick={this.props.onClick} className={liClassName} key={i}>{d}</li>;

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
            return <div className="text-muted">Nothing To Show Here</div>;
        }

        var view = this.props.items.map((d, i) => {
            switch (this.props.className) {
                case "empty":
                    return <li onClick={this.props.onClick} key={i}>{d}</li>;
                    break;
                case "table":
                    return this.getTableLi(d, i);
                    break;
                case "label":
                    return this.getLabelLi(d, i);
                    break;
                case "icon":
                    return this.getIconLi(d, i);
                    break;
            }
        });

        return (<ul
            className={`custom-list-${this.props.className} ${(this.props.ux) ? "li-ux" : ""}`}>
            {view}</ul>);
    }
}

CustomList.propTypes = {
    items: PropTypes.array.isRequired,
    className: PropTypes.oneOf(["empty", "icon", "label"]),
    onClick: PropTypes.func,
    ux: PropTypes.bool // added class "li-ux" if true then is user interactive, on hover on active
};