import React, { Component } from 'react';
import PropTypes from 'prop-types';

require('../css/tooltip.scss');

export default class Tooltip extends React.Component {

    constructor(props) {
        super(props);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.state = {
            show: false
        };
    }

    onMouseEnter() {
        if (this.props.tooltip === null) {
            return;
        }

        this.setState(() => {
            return { show: true };
        });
    }

    onMouseLeave() {
        if (this.props.tooltip === null) {
            return;
        }

        this.setState(() => {
            return { show: false };
        });
    }

    render() {

        var tooltip = (this.state.show)
            ? <div className="my-tt-container" style={{ bottom: this.props.offset }}>
                <div className="my-tt-mes">
                    {this.props.tooltip}
                </div>
                <div className="my-tt-arrow"></div>
            </div>
            : null;

        return <span className="my-tooltip"
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}>
            {this.props.content}
            {tooltip}
        </span>;

    }
}

Tooltip.propTypes = {
    content: PropTypes.any.isRequired,
    tooltip: PropTypes.element.isRequired,
    offset: PropTypes.string
};

Tooltip.defaultProps = {
    offset: "30px"
};