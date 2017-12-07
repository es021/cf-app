import React from 'react';
import PropTypes from 'prop-types';
require('../css/page-sec.scss');

const sec = "page-sec";

export default class PageSection extends React.Component {
    render() {
        console.log();

        var body = this.props.body;
        if (typeof body === "function") {
            body = React.createElement(body, {});
        }
        return(<div className={`${sec}`}>
            <h3 className={`${sec}-title`}>{this.props.title}</h3>
            <div className={`${sec}-body`}>
                {body}
            </div>
            <div className="line"></div>
        </div>);
    }
}

PageSection.propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.element.isRequired
};

//                
