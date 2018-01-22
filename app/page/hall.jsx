import React from 'react';
import PropTypes from 'prop-types';
import PageSection from '../component/page-section';

import ActivitySection from './partial/hall/activity';
import CompaniesSection from './partial/hall/companies';

import { UserEnum } from '../../config/db-config';
import { isRoleRec, getCFObj } from '../redux/actions/auth-actions';

export default class HallPage extends React.Component {
    constructor(props) {
        super(props);
        this.title = getCFObj().title;
    }
    render() {
        document.setTitle("Career Fair");
        return (<div>
            <PageSection title={`Welcome To ${this.title}`} body={ActivitySection}></PageSection>
            {(isRoleRec()) ? null : <PageSection title="Companies" body={CompaniesSection}></PageSection>}
        </div>);
    }
}



