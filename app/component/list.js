import React, { Component } from 'react';
import {ButtonLink} from '../component/buttons';
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
            var data = res.data.data[this.props.dataKey];
            var listItem = null;
            var empty = false;
            try {

                //empty list
                if (data.length <= 0) {
                    listItem = `Nothing To Show Here`
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
                return {listItem: listItem, fetching: false, empty: empty}
            });

        }
        // error fetching
        , (err) => {
            var listItem = `[Error While Fetching List Data] ${err}`;
            this.setState(() => {
                return {listItem: listItem, fetching: false}
            });
        });
    }

    render() {

        var loading = (this.props.customLoading) ? this.props.customLoading : <div>Loading..</div>;

        var paging = <div>
            Page <b>{this.page}</b>
            <br></br>
            {(this.page > 1) ?
                            <ButtonLink onClick={() => this.load(this.PREV)} label="Prev"></ButtonLink>
                                : null
            }
        
            {(!this.state.empty) ?
                            <ButtonLink onClick={() => this.load(this.NEXT)} label="Next"></ButtonLink>
                                : null
            }
            <br></br>
        </div>;

        var content = <div>
            <ul className={`${this.props.listClass}`}>
                {this.state.listItem}
            </ul>
            {paging}
        </div>;

        return (this.state.fetching) ? loading : content;
    }
}

List.propTypes = {
    loadData: PropTypes.func.isRequired, // function (page)
    renderList: PropTypes.func.isRequired, // function (data)
    offset: PropTypes.number.isRequired,
    dataKey: PropTypes.string.isRequired, // key for query response
    customLoading: PropTypes.element,
    listClass: PropTypes.string
};

/*******************************************************************************************/
import ProfileCard, {PCType} from './profile-card';

export class ProfileListItem extends Component {
    render() {
        var className = "profile-li";
        if (this.props.body) {
            className += "-with-body";
        }
        var img_dimension = (this.props.img_dimension) ? this.props.img_dimension : "75px"; 
        return <ProfileCard {...this.props} img_dimension={img_dimension} 
            className={className}></ProfileCard>;
    }
}

ProfileListItem.propTypes = {
    title: PropTypes.any.isRequired,
    subtitle: PropTypes.string.isRequired,
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

        var body = (this.props.body) ? <div className="sili-body">{this.props.body}</div> : null;

        return (<div className="simple-li">
            <div className="sili-title">{this.props.title}</div>
            <div className="sili-subtitle">{this.props.subtitle}</div>
            {body}
        </div>);
    }
}

SimpleListItem.propTypes = {
    title: PropTypes.any.isRequired,
    subtitle: PropTypes.string.isRequired,
    body: PropTypes.any
};


export class CustomList extends Component {

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