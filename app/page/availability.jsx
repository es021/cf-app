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
const IS_SELECT = "is-select";
const IS_EMPTY = "is-empty";

export default class AvailabilityView extends React.Component {
    constructor(props) {
        super(props);
        this.INTERVAL_MIN = 30;
        this.minHour = 99999;
        this.maxHour = 0;

        // init to today
        var curDateUnix = Time.getUnixFromDateTimeInput(Time.getDateDay("now"), "00:00");
        this.state = {
            data: [],
            loading: true,
            curDateUnix: curDateUnix
        }


        this.cfStartUnix = null;
        this.cfEndUnix = null;
        this.validUnix = [];

        this.initScheduleTime();
    }
    initScheduleTime() {
        if (!this.isFeatureAvailable()) {
            return;
        }

        var schObj = getCFObj().schedule;
        var timezone = schObj.timezone;
        var data = schObj.data;
        var startStr = data[0].date + " " + data[0].start + " " + timezone;
        var endStr = data[data.length - 1].date + " " + data[data.length - 1].end + " " + timezone;


        for (var i in data) {
            var startStr = data[i].date + " " + data[i].start + " " + timezone;
            var endStr = data[i].date + " " + data[i].end + " " + timezone;

            var startUnix = Time.convertDBTimeToUnix(startStr);
            var endUnix = Time.convertDBTimeToUnix(endStr);

            // set valid unix
            this.validUnix.push(
                { start: startUnix, end: endUnix }
            );

            // set cf start unix
            if (this.cfStartUnix == null || startUnix < this.cfStartUnix) {
                this.cfStartUnix = startUnix;
            }

            // set cf end unix
            if (this.cfEndUnix == null || endUnix > this.cfEndUnix) {
                this.cfEndUnix = endUnix;
            }
        }
    }
    isFeatureAvailable() {
        var cfObj = getCFObj();
        return typeof cfObj.schedule !== "undefined" && cfObj.schedule !== null;
    }
    componentWillMount() {
        if (!this.isFeatureAvailable() || this.props.user_id === null) {
            this.setState(() => {
                return { loading: false };
            });

            return;
        }

        var query = `query{ availabilities(user_id:${this.props.user_id}) 
            { ID timestamp is_booked company{ID name} } }`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState(() => {
                return { data: res.data.data.availabilities, loading: false };
            });
        });


    }

    convertCFTimeStrToInt(cfTime) {
        var ret = Time.convertDBTimeToUnix(cfTime);
        return this.convertUnixToInt(ret);
    }
    convertUnixToInt(unix) {
        var ret = Time.getDateTime(unix);
        ret = this.convertTimeToInt(ret);
        return ret;
    }
    convertTimeToInt(time) {
        var ret = time.replace(":", "");
        ret = Number.parseInt(ret);
        return ret;
    }
    // set the min and mix hour in this timezone
    addToMinMaxHour(unix) {
        var hourInt = this.convertUnixToInt(unix);
        if (hourInt < this.minHour) {
            this.minHour = hourInt;
        }
        if (hourInt > this.maxHour) {
            this.maxHour = hourInt;
        }
    }
    isTimestampValid(unix) {
        // check from this.validUnix
        for (var i in this.validUnix) {
            var start = this.validUnix[i].start;
            var end = this.validUnix[i].end;
            if (unix >= start && unix < end) {
                return true;
            }
        }

        return false;

        // time = this.convertTimeToInt(time);

        // this.hourStart = this.convertCFTimeStrToInt(cfObj.schedule_time_start);
        // this.hourEnd = this.convertCFTimeStrToInt(cfObj.schedule_time_end);
        // return false;
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
        // for general purpose select
        else if (this.props.for_general) {
            if (isDefault) {
                this.props.onSelect(id, timestamp);
            }
        }
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
            var count = (this.props.count_data[cur] !== "undefined") ? this.props.count_data[cur] : null;
            
            if (this.isTimestampValid(cur)) {
                if (typeof mappedData[cur] !== "undefined") {
                    raw = mappedData[cur];
                    is_set = true;
                    is_booked = raw.is_booked;
                    index = raw.index;
                    ID = raw.ID;
                }

                var timeStr = Time.getDateTime(cur, true);
                r[curDay].push({
                    index: index,
                    ID: ID,
                    is_set: is_set,
                    is_booked: is_booked,
                    timestamp: cur,
                    time: timeStr,
                    dayStr: dayStr,
                    raw: raw,
                    count: count
                });
                this.addToMinMaxHour(cur);
            } else {
                //r[curDay].push(this.getEmptyItem(dayStr));
            }

            cur += this.INTERVAL_MIN * 60;
        }

        // add empty hour according to min and max
        for (var day in r) {
            var items = r[day];
            var firstUnix = items[0].timestamp;
            var diff = this.convertUnixToInt(firstUnix) - this.minHour;

            if (diff > 0) {
                var emptyCount = diff / this.INTERVAL_MIN * 60 / 100;
                for (var i = 0; i < emptyCount; i++) {
                    r[day].unshift(this.getEmptyItem(items[0].dayStr));
                }
            }

            var lastUnix = items[items.length - 1].timestamp;
            var diff = this.maxHour - this.convertUnixToInt(lastUnix);

            if (diff > 0) {
                var emptyCount = diff / this.INTERVAL_MIN * 60 / 100;
                for (var i = 0; i < emptyCount; i++) {
                    r[day].push(this.getEmptyItem(items[0].dayStr));
                }
            }

        }

        return r;
    }
    getEmptyItem(dayStr) {
        return {
            is_empty: true,
            dayStr: dayStr,
            time: "N/A"
        };
    }
    getPlaceholderView(data) {
        var r = this.getPlaceholderData(data);

        console.log("minmax", this.minHour, this.maxHour);
        console.log("this.props.select_timestamp", this.props.select_timestamp);

        var view = [];
        for (var day in r) {
            var dayData = r[day];
            var dayStr = null;
            var list = dayData.map((d, i) => {

                var cls = "av-li";
                if (d.is_empty === true) {
                    cls += " " + IS_EMPTY;
                } else if (this.props.select_id == d.ID) {
                    cls += " " + IS_SELECT;
                } else if (this.props.select_timestamp == d.timestamp) {
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
                    className={cls}>
                    {d.time}
                    {d.count == null ? null :
                        <div className="av-li-count">{d.count}</div>
                    }
                </li>;

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

        var clsName = "";
        if (this.props.set_only) {
            clsName = "set-only";
        } else if (this.props.book_only) {
            clsName = "book-only";
        } else if (this.props.for_general) {
            clsName = "for-general";
        }

        return <div className={`availability ${clsName}`}>{view}</div>;

        //return <div className="availability">{view}</div>;
    }
    render() {
        var view = null;
        var errMes = null;
        if (this.state.loading) {
            view = <Loader size="2" text="Loading Availability.."></Loader>;
        } else {
            if (this.isFeatureAvailable()) {
                view = this.getPlaceholderView(this.state.data);
                if (this.props.user_id !== null && (!Array.isArray(this.state.data) || this.state.data.length <= 0)) {
                    errMes = <span>
                        It seems that this student had not set his/her availability.
                        <br></br>Please continue with other student
                    </span>;
                }
            } else {
                view = <span>This feature does not available for {getCFObj().title}</span>
            }

        }

        return <div>
            {this.props.set_only ?
                <h3 class="text-muted">Availability<br></br>
                    <small>Set Your Availability For Scheduled Call</small>
                    {this.props.for_sign_up ? <small><br></br>** This can be changed later **</small> : null}
                </h3>
                :
                <div>
                    <h4 class="text-muted">Select A Time For {this.props.select_for}</h4>
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
    user_id: PropTypes.number,
    set_only: PropTypes.bool,
    book_only: PropTypes.bool,
    for_general: PropTypes.bool,
    select_id: PropTypes.number,
    select_timestamp: PropTypes.number,
    select_for: PropTypes.string,
    for_sign_up: PropTypes.bool,
    onSelect: PropTypes.func,

    // for create group session recruiter
    // {timestamp : count}
    count_data: PropTypes.object,
};

AvailabilityView.defaultProps = {
    count_data: [],
    user_id: null,
    for_sign_up: false,
    select_id: -1,
    select_timestamp: -1,
    select_for: "Scheduled Call"
};


