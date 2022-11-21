import React, { PropTypes } from 'react';
import { ButtonLink } from '../component/buttons.jsx';
import GeneralFormPage from '../component/general-form';
import * as layoutActions from '../redux/actions/layout-actions';
import UserPopup from './partial/popup/user-popup';

//importing for list
import List from '../component/list';
import { getAxiosGraphQLQuery, graphql, graphqlAttr, postRequest } from '../../helper/api-helper';
import { User, UserMeta, CFS, CFSMeta } from '../../config/db-config';
import { Time } from '../lib/time';
import { createUserTitle } from './users';
import { createCompanyTitle } from './admin-company';
import Form, { toggleSubmit } from '../component/form.js';
import { SiteUrl, AppPath } from '../../config/app-config.js';
import { NavLink } from 'react-router-dom';
import { getAuthUser, getCF, isRoleAdmin, isRoleOrganizer } from '../redux/actions/auth-actions.jsx';
import AdminDatasetItemList from './admin-dataset-item-list.jsx';
import SignUpPage from './sign-up.jsx';
import ManageUserProfile from './partial/user/manage-user-profile.jsx';


export default class AdminPreviewProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillMount() {
    }
    render() {
        document.setTitle("Profile Set Up Preview");
        return (<div style={{ paddingTop: "10px" }}>
            <h2 className="text-left">Profile Setup Preview</h2>
            <br></br>
            <ManageUserProfile isPreview={true} user_id={getAuthUser().ID} isEdit={true} />
        </div>);

    }
}

