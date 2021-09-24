import React, { Component } from 'react';
import { Loader } from '../../../component/loader';
import PropTypes from 'prop-types';
import TimePicker from '../time-picker/time-picker';
import { lang } from '../../../lib/lang';
import { postRequest, getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import { SiteUrl } from '../../../../config/app-config';
import { getAuthUser, getCF } from '../../../redux/actions/auth-actions';
import * as layoutActions from "../../../redux/actions/layout-actions";
import obj2arg from 'graphql-obj2arg';


export default class GroupCallCreate extends React.Component {
    constructor(props) {
        super(props);
        this.titleInputElement = {};
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

    createGroupCall(title, unixtimestamp) {
        console.log("title", title)
        console.log("unixtimestamp", unixtimestamp)

        if (!title) {
            layoutActions.errorBlockLoader("Please enter the group call title");
            return
        }
        if (!unixtimestamp) {
            layoutActions.errorBlockLoader("Please select a time for the group call");
            return
        }

        layoutActions.loadingBlockLoader();
        let createParam = {
            company_id: this.props.company_id,
            name: title,
            cf : getCF(),
            appointment_time: unixtimestamp,
            created_by: getAuthUser().ID,
        }
        let q = `mutation{
            add_group_call(${obj2arg(createParam, { noOuterBraces: true })}){
                ID
            }
        }`
        getAxiosGraphQLQuery(q).then((res) => {
            layoutActions.storeHideBlockLoader();
            layoutActions.successBlockLoader("Group call successfully created");
            layoutActions.storeHideFocusCard();

            if (this.props.onDone) {
                this.props.onDone();
            }
        });
    }

    render() {
        var view = null;
        if (this.state.loading) {
            view = <Loader size="2" text="Loading Availability.."></Loader>;
        } else {
            view = [
                <div style={{ padding: '10px 50px' }}>
                    <h3><b>Enter Group Call Title</b></h3>
                    <input
                        className={"form-control input-sm"}
                        type={"text"}
                        placeholder={"Group Call 1"}
                        ref={v => (this.titleInputElement = v)}
                    />
                </div>,
                <br></br>,
                <h3><b>Select Time</b></h3>,
                <TimePicker
                    onSubmit={(unixtimestamp) => {
                        this.createGroupCall(this.titleInputElement.value, unixtimestamp[0])
                    }}
                    canOnlySelectOne={true}
                    submitText={"Create"}
                    defaultTimestamps={this.state.data.available_time}
                />]
        }

        return <div style={{ paddingTop: '20px' }}>
            {view}
        </div>;
    }
}

GroupCallCreate.propTypes = {
    company_id: PropTypes.number,
    onDone: PropTypes.func,
};

GroupCallCreate.defaultProps = {
};


