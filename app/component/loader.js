import React, {Component} from 'react';
import PropTypes from 'prop-types';

export class Loader extends React.Component {
    render() {
        var fa_size = "";
        if (this.props.size) {
            fa_size = `fa-${this.props.size}x`;
        }

        return (<div className="loader">
            <i className={`fa fa-spinner fa-pulse ${fa_size}`}></i>
            {(this.props.text) ? <div><small>{this.props.text}</small></div> : null}
        </div>);
    }
}

Loader.propTypes = {
    size: PropTypes.oneOf(['2', '3']),
    text: PropTypes.string
};