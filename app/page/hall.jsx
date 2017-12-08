import React from 'react';
import PropTypes from 'prop-types';
import PageSection from '../component/page-section';

import ActivitySection from './partial/hall/activity';
import CompaniesSection from './partial/hall/companies';
import ServicesSection from './partial/hall/services';

export default class HallPage extends React.Component {
    render() {
        document.setTitle("Hall");
        return(<div>
            <PageSection title="Welcome To Virtual Career Fair 2017" body={ActivitySection}></PageSection>
            <PageSection title="Companies" body={CompaniesSection}></PageSection>
            <PageSection title="Services" body={ServicesSection}></PageSection>
        </div>);
    }
}



