import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hallAction from '../../../redux/actions/hall-actions';
import PropTypes from 'prop-types';
import {Loader} from '../../../component/loader';
import ProfileCard from '../../../component/profile-card';
import {CompanyEnum}  from '../../../../config/db-config';
import {ButtonLink} from '../../../component/buttons';
import * as layoutActions from '../../../redux/actions/layout-actions';

const sec = "act-sec";
export default class ActivitySection extends React.Component {
    render() {
        return (<div>This is Activity Section</div>);
    }
}



