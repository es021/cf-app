//Faizul Here

import React from "react";
import PropTypes from "prop-types";
import { Loader } from "../../../component/loader";
import * as hallAction from "../../../redux/actions/hall-actions";
import { getAxiosGraphQLQuery } from "../../../../helper/api-helper";
import { ActvityList } from "../hall/activity";

export class ActivitySingle extends React.Component {
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
        let entity = null;
        switch (this.props.type) {
            case hallAction.ActivityType.PRESCREEN:
                entity = "prescreen";
                break;
        }
        if (entity == null) {
            this.setState(prevState => {
                return { loading: false };
            });
        } else {
            let q = ` query {${entity} (ID:${this.props.id
                }){ ${hallAction.getActivityQueryAttr(this.props.type)} } }`;
            getAxiosGraphQLQuery(q).then(res => {
                this.setState(prevState => {
                    return { data: res.data.data[entity], loading: false };
                });
            });
        }
    }
    render() {
        let v = null;
        if (this.state.loading) {
            v = <Loader size="2" />;
        } else {
            let list = [this.state.data];
            for (let i in list) {
                list[i]._type = hallAction.ActivityType.PRESCREEN;
            }

            v = (
                // <ActvityList
                //     bc_type="vertical"
                //     online_users={{}}
                //     fetching={false}
                //     type={this.props.type}
                //     title={null}
                //     subtitle={null}
                //     list={list}
                // />
                <ActvityList
                    onDoneAction={() => {
                        this.loadData();
                    }}
                    view_type={this.props.type}
                    isFullWidth={true}
                    limitLoad={1}
                    noBorderCard={true}
                    bc_type="vertical"
                    fetching={false}
                    type={null}
                    title={""}
                    subtitle={""}
                    list={list}
                />
            );
        }
        return <div className="notification-activity-single">{v}</div>;
    }
}
ActivitySingle.propTypes = {
    type: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired
};