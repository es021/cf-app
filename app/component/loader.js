import React, {Component} from 'react';
import PropTypes from 'prop-types';

export class Loader extends React.Component {
    render() {
        var fa_size = "";
        if (this.props.size) {
            fa_size = `fa-${this.props.size}x`;
        }

        //set text
        var text = null;
        if (this.props.text) {
            text = this.props.text;
            if (this.props.text_pos === "bottom") {
                text = <div><small>{text}</small></div>;
            } else if (this.props.text_pos === "right") {
                text = <small>{" "+text}</small>;
            }
        }

        return (<div className="loader">
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