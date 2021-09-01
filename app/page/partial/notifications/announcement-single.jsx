//Faizul Here

import React from "react";
import PropTypes from "prop-types";
import { Loader } from "../../../component/loader";
import * as hallAction from "../../../redux/actions/hall-actions";
import { getAxiosGraphQLQuery } from "../../../../helper/api-helper";
import PageSection from "../../../component/page-section";
import { Time } from "../../../lib/time"

export class AnnouncementSingle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: {}
        };
    }
    componentWillMount() {
        this.loadData();
    }
    loadData() {

        let q = ` query {
            announcement
            (ID:${this.props.id})
            { ID title body created_at } 
        }`;
        getAxiosGraphQLQuery(q).then(res => {
            this.setState(prevState => {
                return { data: res.data.data.announcement, loading: false };
            });
        });
    }
    render() {
        let v = null;
        if (this.state.loading) {
            v = <Loader size="2" />;
        } else {

            v = (
                <PageSection
                    className="left"
                    title={this.state.data.title}
                    body={
                        <div>
                            <div className="text-muted" style={{marginBottom:'30px'}}>
                                <i>
                                    posted on {Time.getString(this.state.data.created_at)}
                                </i>
                            </div>
                            <p>
                                {this.state.data.body}
                            </p>
                        </div>
                    }
                ></PageSection>
            );
        }
        return <div style={{padding:'10px 20px'}}>{v}</div>;
    }
}
AnnouncementSingle.propTypes = {
    id: PropTypes.number.isRequired
};