import React, { PropTypes } from 'react';
import SubNav from '../component/sub-nav';
import AdminDataset from './admin-dataset';


// create sub page here
export default class AdminDatapointDataset extends React.Component {

    componentWillMount() {
        this.item = {
            "dataset": {
                label: "Dataset",
                component: AdminDataset,
                icon: "file-text-o"
            }
            , "datapoint": {
                label: "Datapoint",
                component: AdminDataset,
                icon: "file-text-o"
            }
        };
    }

    render() {
        var title = this.item[this.props.match.params.current].label;
        document.setTitle(title);
        return <SubNav route="dataset-datapoint" items={this.item} defaultItem={this.props.match.params.current}></SubNav>;
    }
}


