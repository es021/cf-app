import React, { PropTypes } from 'react';
import SubNav from '../component/sub-nav';
import AdminDatapoint from './admin-datapoint';
import AdminDataset from './admin-dataset';
import AdminPreviewProfile from './admin-preview-profile';
import AdminPreviewRegistration from './admin-preview-registration';


// create sub page here
export default class AdminDatapointDataset extends React.Component {

    componentWillMount() {
        this.item = {
            "dataset": {
                label: "Dataset",
                component: AdminDataset,
                icon: "list"
            }
            , "datapoint": {
                label: "Participant Datapoint",
                component: AdminDatapoint,
                icon: "wpforms"
            }
            , "preview_registration": {
                label: "Registration Preview",
                component: AdminPreviewRegistration,
                icon: "sign-in"
            }
            , "preview_profile": {
                label: "Profile Setup Preview",
                component: AdminPreviewProfile,
                icon: "user"
            }
        };
    }

    render() {
        var title = this.item[this.props.match.params.current].label;
        document.setTitle(title);
        return <SubNav route="dataset-datapoint" items={this.item} defaultItem={this.props.match.params.current}></SubNav>;
    }
}


