import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Loader extends React.Component {
    render() {
        var fa_size = "";
        if (this.props.size) {
            fa_size = `fa-${this.props.size}x`;
        }

        var text_pos = "";
        if (this.props.text_pos) {
            text_pos = this.props.text_pos;
        } else {
            text_pos = "bottom";
        }

        //set text
        var text = null;
        if (this.props.text) {
            text = this.props.text;
            if (text_pos === "bottom") {
                text = <div><small>{text}</small></div>;
            } else if (text_pos === "right") {
                text = <small>{" " + text}</small>;
            }
        }
        
        var style = {};
        if (this.props.isCenter) {
            style = { textAlign: "center", width: "100%" };
        }

        return (<div style={style} className="loader">
            <i className={`fa fa-spinner fa-pulse ${fa_size}`}></i>
            {text}
        </div>);
    }
}

Loader.propTypes = {
    size: PropTypes.oneOf(['2', '3']),
    text: PropTypes.string,
    text_pos: PropTypes.oneOf(['bottom', 'right'])
};