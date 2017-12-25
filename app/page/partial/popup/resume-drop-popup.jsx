import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResumeDropPage from '../../resume-drop';

export default class ResumeDropPopup extends Component {
    render() {
        return <ResumeDropPage company_id={this.props.company_id}></ResumeDropPage>;
    }
};

ResumeDropPopup.propTypes = {
    company_id: PropTypes.number.isRequired
};