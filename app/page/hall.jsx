import React from 'react';
import PropTypes from 'prop-types';
import PageSection from '../component/page-section';

import ActivitySection from './partial/hall/activity';
import CompaniesSection from './partial/hall/companies';

import {UserEnum} from '../../config/db-config';
import {isRoleRec} from '../redux/actions/auth-actions';

export default class HallPage extends React.Component {
    render() {
        document.setTitle("Job Fair");
        return(<div>
            <PageSection title="Welcome To Virtual Career Fair 2017" body={ActivitySection}></PageSection>
            {(isRoleRec()) ? null : <PageSection title="Companies" body={CompaniesSection}></PageSection>}
        </div>);
    }
}



