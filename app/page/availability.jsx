import React, { Component } from 'react';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import obj2arg from 'graphql-obj2arg';
import { Loader } from '../component/loader';
import PropTypes from 'prop-types';
import { Time } from '../lib/time';
import { getCFObj } from '../redux/actions/auth-actions';
import Tooltip from '../component/tooltip';


// min interval
require('../css/availability.scss');

const IS_SET = "is-set";
const IS_BOOKED = "is-booked";
const IS_DEFAULT = "is-default";
const IS_SELECT = "is-select"

export default class AvailabilityView extends React.Component {
    constructor(props) {
        super(props);

        this.INTERVAL_MIN = 30;
        // init to today
        var curDateUnix = Time.getUnixFromDateTimeInput(Time.getDateDay("now"), "00:00");

        var cfObj = getCFObj();
        this.hourStart = this.convertCFTimeStrToInt(cfObj.schedule_time_start);
        this.hourEnd = this.convertCFTimeStrToInt(cfObj.schedule_time_end);

        this.cfStartUnix = Time.convertDBTimeToUnix(cfObj.schedule_time_start);
        this.cfEndUnix = Time.convertDBTimeToUnix(cfObj.schedule_time_end);

        console.log(this.hourStart, this.hourEnd);
        // for next date just add to timestamp
        // and convert back to day date

        this.state = {
            data: [],
            loading: true,
            curDateUnix: curDateUnix
        }
    }

    convertCFTimeStrToInt(cfTime) {
        var ret = Time.convertDBTimeToUnix(cfTime);
        ret = Time.getDateTime(ret);
        ret = this.convertTimeToInt(ret);
        return ret;
    }

    convertTimeToInt(time) {
        var ret = time.replace(":", "");
        ret = Number.parseInt(ret);
        return ret;
    }

    componentWillMount() {
        var query = `query{ availabilities(user_id:${this.props.user_id}) 
             { ID timestamp is_booked company{ID name} } }`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState(() => {
                return { data: res.data.data.availabilities, loading: false };
            });
        });
    }

    isHourTimeValid(time) {
        time = this.convertTimeToInt(time);

        if (time >= this.hourStart && time < this.hourEnd) {
            return true;
        }

        return false;
    }
    mapDataAsTimestamp(data) {
        var ret = {};
        for (var i in data) {
            var key = data[i].timestamp + ""
            ret[key] = data[i];
            ret[key]["index"] = i;
        }

        return ret;
    }
    getPlaceholderData(data) {
        var startUnix = this.cfStartUnix;
        var endUnix = this.cfEndUnix;

        var mappedData = this.mapDataAsTimestamp(data);
        var r = {};
        var cur = startUnix;
        while (cur < endUnix) {
            var curDay = Time.getDateDay(cur);
            if (typeof r[curDay] === "undefined") {
                r[curDay] = [];
            }

            // create data for placeholder
            var time = Time.getDateTime(cur);
            var dayStr = Time.getDateDayStr(cur);
            var is_set = false;
            var is_booked = false;
            var ID = null;
            var raw = null;
            var index = null;

            if (typeof mappedData[cur] !== "undefined") {
                raw = mappedData[cur];
                is_set = true;
                is_booked = raw.is_booked;
                index = raw.index;
                ID = raw.ID;
            }

            if (this.isHourTimeValid(time)) {
                var timeStr = Time.getDateTime(cur, true);
                r[curDay].push({
                    index: index,
                    ID: ID,
                    is_set: is_set,
                    is_booked: is_booked,
                    timestamp: cur,
                    time: timeStr,
                    dayStr: dayStr,
                    raw: raw
                });
            }
            cur += this.INTERVAL_MIN * 60;
        }

        return r;
    }
    dbCreateAv(timestamp, handler) {
        var query = `mutation{add_availability(user_id:${this.props.user_id},timestamp:${timestamp}) { ID } }`;
        getAxiosGraphQLQuery(query).then((res) => {
            handler(res.data.data.add_availability);
        });
    }
    dbDeleteAv(ID, handler) {
        var query = `mutation{ delete_availability(ID:${ID})}`;
        getAxiosGraphQLQuery(query).then((res) => {
            handler(res);
        });
    }
    // dbUpdateAv(company_id, handler) {
    //     var query = `query{ availabilities(user_id:${this.props.user_id}) 
    //     { ID timestamp is_booked company{ID name} } }`;

    //     getAxiosGraphQLQuery(query).then((res) => {
    //         handler(res);
    //     });
    // }

    onClickLi(e) {
        var index = e.currentTarget.dataset.index;
        var id = e.currentTarget.dataset.id;
        var timestamp = e.currentTarget.dataset.timestamp;
        var className = e.currentTarget.className;
        //console.log(index, id, timestamp, className);


        var isDefault = className.indexOf(IS_DEFAULT) >= 0;
        var isSet = className.indexOf(IS_SET) >= 0;
        var isBooked = className.indexOf(IS_BOOKED) >= 0;

        // for edit profile
        if (this.props.set_only) {
            // set to is set
            if (isDefault) {
                console.log("do set from default to is set")
                this.dbCreateAv(timestamp, (res) => {
                    this.setState((prevState) => {
                        var newData = { ID: res.ID, timestamp: timestamp };
                        prevState.data.push(newData);
                        return { data: prevState.data };
                    })
                })
            }
            // reset to default
            else if (isSet) {
                console.log("do set from is set to default")
                this.dbDeleteAv(id, (res) => {
                    this.setState((prevState) => {
                        prevState.data.splice(index, 1);
                        return { data: prevState.data };
                    })
                })
            }
        }

        // for schedule
        else if (this.props.book_only) {
            // set to is book
            if (isSet) {
                console.log("do set from is set to booked")
                this.props.onSelect(id, timestamp);
            }
        }

    }
    getPlaceholderView(data) {
        var r = this.getPlaceholderData(data);
        var view = [];
        for (var day in r) {
            var dayData = r[day];
            var dayStr = null;
            var list = dayData.map((d, i) => {

                var cls = "av-li";
                if (this.props.select_id == d.ID) {
                    cls += " " + IS_SELECT;
                } else if (d.is_booked) {
                    cls += " " + IS_BOOKED;
                } else if (d.is_set) {
                    cls += " " + IS_SET;
                } else {
                    cls += " " + IS_DEFAULT;
                }

                dayStr = d.dayStr;
                var tooltip = null;

                // for student is set only
                // show tooltip in booked
                if (d.is_booked && this.props.set_only) {
                    if (d.raw !== null && d.raw.company) {
                        tooltip = `Scheduled Call with ${d.raw.company.name}`;
                    }
                }

                var debug = tooltip == null ? false : true;

                var content = <li onClick={(e) => { this.onClickLi(e) }}
                    data-id={d.ID}
                    data-timestamp={d.timestamp}
                    data-index={d.index}
                    className={cls}>{d.time}</li>;

                return <Tooltip
                    bottom="35px"
                    left="-68px"
                    width="140px"
                    alignCenter={true}
                    debug={false}
                    content={content}
                    tooltip={tooltip}>
                </Tooltip>

                //return <li data-id={d.ID} data-timestamp={d.timestamp} className={cls}>{d.time}</li>
            })

            view.push(
                <div className="av-group">
                    <div className="av-day">{dayStr}</div>
                    <div className="av-date">{day}</div>
                    <ul>{list}</ul>
                </div>
            );
        }

        // debug
        //return [<div className="availability set-only">{view}</div>
        //    , <div className="availability book-only">{view}</div>];

        var clsName = this.props.set_only ? "set-only" : "book-only";
        return <div className={`availability ${clsName}`}>{view}</div>;

        //return <div className="availability">{view}</div>;
    }

    render() {
        var view = null;
        var errMes = null;
        if (this.state.loading) {
            view = <Loader size="2" text="Loading Availability.."></Loader>;
        } else {
            view = this.getPlaceholderView(this.state.data);
            if (!Array.isArray(this.state.data) || this.state.data.length <= 0) {
                var errMes = <span>
                    It seems that this student had not set his/her availability.
                    <br></br>Please continue with other student
                </span>;
            }
        }

        return <div>
            {this.props.set_only ? 
                <h3 class="text-muted">Availability<br></br>
                    <small>Set Your Availability For Scheduled Call</small>
                </h3>
                :
                <div> 
                    <h4 class="text-muted">Select A Time For Scheduled Call</h4>
                    {errMes !== null ? 
                        <div className="form-error alert alert-danger">
                            {errMes} 
                        </div>
                    : null}
                </div>
            }
            {view}
        </div>;
    }
}

AvailabilityView.propTypes = {
    user_id: PropTypes.number.isRequired,
    set_only: PropTypes.bool,
    book_only: PropTypes.bool,
    select_id: PropTypes.number,
    selectBookHandler: PropTypes.func
};

AvailabilityView.defaultProps = {
    select_id: -1
};


