import React, { Component } from 'react';
import { Loader } from '../../../component/loader';
import PropTypes from 'prop-types';
import TimePicker from '../time-picker/time-picker';
import { lang } from '../../../lib/lang';
import { postRequest } from '../../../../helper/api-helper';
import { SiteUrl } from '../../../../config/app-config';
import { getCF } from '../../../redux/actions/auth-actions';
import * as layoutActions from "../../../redux/actions/layout-actions";


export default class ManageCompanyAvailableTime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
        }
    }

    componentWillMount() {

        postRequest(SiteUrl + "/time-picker/get-available-time",
            { cf: getCF(), company_id: this.props.company_id }
        ).then(res => {
            this.setState({ data: res.data, loading: false });
        }).catch(err => {
            this.setState({ loading: false });
            layoutActions.errorBlockLoader(err.response.data);
        })

    }

    saveAvailableTime(selectedTime) {
        layoutActions.loadingBlockLoader();
        postRequest(SiteUrl + "/time-picker/set-available-time",
            {
                cf: getCF(),
                company_id: this.props.company_id,
                available_time: JSON.stringify(selectedTime),
            }
        ).then(res => {
            layoutActions.storeHideBlockLoader();
            layoutActions.successBlockLoader("Company available time successfully updated")
        }, (err) => {
            layoutActions.storeHideBlockLoader();
            layoutActions.errorBlockLoader(err.response.data);
        });
    }

    render() {
        var view = null;
        if (this.state.loading) {
            view = <Loader size="2" text="Loading Availability.."></Loader>;
        } else {
            view = <TimePicker
                onSubmit={(selectedTime) => {
                    console.log("selectedTime", selectedTime)
                    this.saveAvailableTime(selectedTime)
                }}
                submitText={"Save"}
                selectedTimestamps={this.state.data.available_time}
                title={lang("Set Company Available Time")}
            />
        }

        return <div style={{ paddingTop: '20px' }}>
            {view}
        </div>;
    }
}

ManageCompanyAvailableTime.propTypes = {
    company_id: PropTypes.number,
};

ManageCompanyAvailableTime.defaultProps = {
};


