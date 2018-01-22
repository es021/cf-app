import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Restricted extends React.Component {
    render() {
        return <div>
            <h3>{this.props.title}</h3>
            <div>{this.props.message}</div>
        </div>;
    }
}

Restricted.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string
};

Restricted.defaultProps = {
    title: "You Seems To Be Lost",
    message: "Sorry. You are not allowed here"
};


