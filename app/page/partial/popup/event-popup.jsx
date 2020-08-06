import React, { Component } from "react";
import PropTypes from "prop-types";
import { LogEnum } from "../../../../config/db-config";
import { addLog } from "../../../redux/actions/other-actions";
import { getAuthUser } from "../../../redux/actions/auth-actions";
import { graphql } from "../../../../helper/api-helper";
import { Loader } from "../../../component/loader";
import PageSection from "../../../component/page-section";
import { Time } from "../../../lib/time";
import { getCompanyTitle, getEventAction } from "../../view-helper/view-helper";
import lang from "../../../lib/lang";

export default class EventPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            loading: true
        };
    }

    componentWillMount() {
        var logData = {
            id: Number.parseInt(this.props.id),
            location: window.location.pathname
        };
        addLog(
            LogEnum.EVENT_VISIT_EVENT,
            JSON.stringify(logData),
            getAuthUser().ID
        );

        // type
        var query = `query {
                  event(ID:${this.props.id}) {
                    ID
                    is_ended
                    company_id
                    company{ID name img_url img_position img_size}     
                    description
                    title
                    url_recorded
                    url_join
                    url_rsvp
                    start_time
                    end_time
                    location
                    interested { ID is_interested }
                }}`;

        graphql(query).then(res => {
            this.setState(() => {

                return { data: res.data.data.event, loading: false };
            });
        });
    }

    render() {
        var event = this.state.data;
        var view = null;

        if (this.state.loading) {
            view = <Loader size="3" text="Loading Event Information..."></Loader>;
        } else {
            if (this.state.data === null) {
                view = <NotFoundPage {...this.props}></NotFoundPage>;
            } else {
                var non = <div className="text-muted">{lang("Nothing To Show Here")}</div>;

                var info = [
                    // <div>
                    //     <i className="fa fa-hashtag left"></i><b>Event Id : </b>{event.ID}
                    // </div>,
                    !event.start_time ? null : (
                        <div>
                            <i className="fa fa-clock-o left"></i><b>Start :</b>
                            {" "}{[Time.getString(event.start_time), <span className="text-muted">{" "}(local time)</span>]}
                        </div>
                    ),
                    !event.end_time ? null : (
                        <div>
                            <i className="fa fa-clock-o left"></i><b>End :</b>
                            {" "}{[Time.getString(event.end_time), <span className="text-muted">{" "}(local time)</span>]}
                        </div>
                    ),
                    <div>
                        <i className="fa fa-building left"></i>
                        {getCompanyTitle(event.company)}
                    </div>,

                ];

                var desc = event.description ? <p dangerouslySetInnerHTML={{ __html: event.description }}></p> : non;

                view = (
                    <div style={{ padding: "10px 20px" }}>
                        <PageSection
                            className="left"
                            title={event.title}
                            body={
                                <div>
                                    <div style={{ maxWidth: "300px" }}>{getEventAction(event, { isPopup: true })}</div>
                                    <div style={{ height: "20px " }}></div>
                                    {info}
                                </div>
                            }
                        ></PageSection>
                        <PageSection
                            className="left"
                            title="Description"
                            body={desc}
                        ></PageSection>
                    </div>
                );
            }
        }
        return view;
    }
}

EventPopup.propTypes = {
    id: PropTypes.number
};
