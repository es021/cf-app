import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from "react-router-dom";

export default class ListRow extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    render() {
        let seemore = null;
        if (this.props.see_more_to) {
            seemore = <NavLink to={this.props.see_more_to}>
                {this.props.see_more_text}{'  '}<i className="fa  fa-long-arrow-right"></i>
            </NavLink>
        } else if (this.props.see_more_onclick) {
            seemore = <a onClick={this.props.see_more_onclick}>
                {this.props.see_more_text}{'  '}<i className="fa  fa-long-arrow-right"></i>
            </a>
        }
        return (<div className="list-row" style={{ backgroundColor: this.props.backgroundColor }}>
            <div className="lr-container" style={this.props.containerStyle}>
                <h3 className="lr-title text-bold">
                    <i className={`fa fa-${this.props.icon} left`}></i>{'  '}
                    {this.props.title}{'  '}
                    <i className="fa  fa-long-arrow-right"></i>
                </h3>
                <div className="lr-body">{this.props.items}</div>
                <div className="lr-footer">
                    <b>
                        {seemore}
                    </b>
                </div>
            </div>
        </div>);
    }
}

ListRow.propsType = {
    backgroundColor: PropTypes.string,
    containerStyle: PropTypes.object,
    items: PropTypes.any,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
    see_more_text: PropTypes.string,
    see_more_to: PropTypes.string,
    see_more_onclick: PropTypes.func,
};

ListRow.defaultProps = {
};

