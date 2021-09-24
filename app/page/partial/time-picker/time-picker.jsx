import React, { Component } from 'react';
import { Loader } from '../../../component/loader';
import PropTypes from 'prop-types';
import { Time } from '../../../lib/time';
import Tooltip from '../../../component/tooltip';
import { getCFObj } from '../../../redux/actions/auth-actions';

const IS_DISABLED = "is-disabled";
const IS_SELECTED = "is-booked";
const IS_DEFAULT = "is-default";

export default class TimePicker extends React.Component {
    constructor(props) {
        super(props);
        this.INTERVAL_MIN = 30;
        this.minHour = 99999;
        this.maxHour = 0;

        // init to today
        var curDateUnix = Time.getUnixFromDateTimeInput(Time.getDateDay("now"), "00:00");
        this.state = {
            data: [],
            selectedUnix: [],

            loading: false,
            curDateUnix: curDateUnix
        }

        this.cfStartUnix = null;
        this.cfEndUnix = null;
        this.validUnix = [];

        this.initScheduleTime();
    }

    componentWillMount() {

        let data = [];
        let selectedUnix = [];

        for (let t of this.props.selectedTimestamps) {
            data.push({ timestamp: t, is_selected: 1, });
            selectedUnix.push(t);
        }

        this.setState({ data: data, selectedUnix: selectedUnix });

        // selectedTimestamps: PropTypes.array,
        //     disabledTimestamps: PropTypes.array,

        // if (this.props.user_id === null) {
        //     this.setState(() => {
        //         return { loading: false };
        //     });

        //     return;
        // }

        // var query = `query{ availabilities(user_id:${this.props.user_id}) 
        //     { ID timestamp is_selected company{ID name} } }`;

        // getAxiosGraphQLQuery(query).then((res) => {
        //     this.setState(() => {
        //         return { data: res.data.data.availabilities, loading: false };
        //     });
        // });
    }

    initScheduleTime() {
        const timeStart = "08:00:00";
        const timeEnd = "17:30:00";

        let cfStart = getCFObj().start;
        let cfEnd = getCFObj().end;

        let cfStartUnix = Time.convertDBTimeToUnix(cfStart);
        let cfEndUnix = Time.convertDBTimeToUnix(cfEnd);

        let scheduleTimezone = cfStart.split("GMT");
        scheduleTimezone = "GMT " + scheduleTimezone[1];

        let scheduleData = [];
        let kk = 0;
        let cur = cfStartUnix;

        while (cur < cfEndUnix) {
            let ddate = Time.getDate(cur);
            ddate.replace(",", "");
            console.log(cur, ddate)

            scheduleData.push({ "date": ddate, "start": timeStart, "end": timeEnd });
            // add next day
            cur += 24 * 60 * 60;

            kk++
            if (kk > 100) {
                break;
            }
        }

        console.log(cfStartUnix, cfStartUnix);
        console.log(cfStartUnix, cfStartUnix);
        console.log(cfStart, cfEnd);
        console.log(cfStart, cfEnd);


        var schObj = {
            "timezone": scheduleTimezone,
            "data": scheduleData
        };

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
        for (var i in this.validUnix) {
            var start = this.validUnix[i].start;
            var end = this.validUnix[i].end;
            if (unix >= start && unix < end) {
                return true;
            }
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

    onClickLi(e) {
        var index = e.currentTarget.dataset.index;
        var id = e.currentTarget.dataset.id;
        var timestamp = e.currentTarget.dataset.timestamp;
        timestamp = Number.parseInt(timestamp);

        var className = e.currentTarget.className;
        console.log(index, id, timestamp, className);

        var isDefault = className.indexOf(IS_DEFAULT) >= 0;
        var isDisabled = className.indexOf(IS_DISABLED) >= 0;
        var isSelected = className.indexOf(IS_SELECTED) >= 0;

        if (isDisabled) {
            console.log("do nothing")
            return;
        }

        let newSelected = [];
        let newData = [];

        if (!this.props.canOnlySelectOne) {
            newSelected = JSON.parse(JSON.stringify(this.state.selectedUnix));
            newData = JSON.parse(JSON.stringify(this.state.data));
        } else {
            for (let d of this.state.data) {
                if (d.is_selected != 1) {
                    newData.push(d);
                }
            }
        }

        if (isSelected) {
            newSelected.splice(newSelected.indexOf(timestamp), 1);

            let index;
            for (let i in newData) {
                let d = newData[i];
                if (d.timestamp == timestamp) {
                    index = i;
                    break;
                }
            }
            if (index) {
                newData.splice(index, 1);
            }
        }

        if (isDefault) {
            newSelected.push(timestamp);
            newData.push({ timestamp: timestamp, is_selected: 1 })
        }


        this.setState({ data: newData, selectedUnix: newSelected });



        console.log("data", JSON.parse(JSON.stringify(newData)));
        console.log("selectedUnix", JSON.parse(JSON.stringify(newSelected)));


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
            var is_disabled = false;
            var is_selected = false;
            var raw = null;
            var index = null;

            if (this.isTimestampValid(cur)) {
                if (typeof mappedData[cur] !== "undefined") {
                    raw = mappedData[cur];
                    is_disabled = raw.is_disabled;
                    is_selected = raw.is_selected;
                    index = raw.index;
                }

                var timeStr = Time.getDateTime(cur, true);
                r[curDay].push({
                    index: index,
                    is_disabled: is_disabled,
                    is_selected: is_selected,
                    timestamp: cur,
                    time: timeStr,
                    dayStr: dayStr,
                    raw: raw,
                    count: null
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

        // console.log("minmax", this.minHour, this.maxHour);
        // console.log("this.props.select_timestamp", this.props.select_timestamp);

        var view = [];
        for (var day in r) {
            var dayData = r[day];
            var dayStr = null;
            var list = dayData.map((d, i) => {

                var cls = "av-li";
                if (d.is_selected) {
                    cls += " " + IS_SELECTED;
                }
                else if (this.props.defaultTimestamps) {
                    if (this.props.defaultTimestamps.indexOf(d.timestamp) >= 0) {
                        cls += " " + IS_DEFAULT;
                    } else {
                        cls += " " + IS_DISABLED;
                    }
                } else {
                    cls += " " + IS_DEFAULT;
                }

                dayStr = d.dayStr;
                var tooltip = null;

                var debug = tooltip == null ? false : true;
                var content = <li onClick={(e) => { this.onClickLi(e) }}
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
        return <div className={`availability ${clsName}`}>{view}</div>;

        //return <div className="availability">{view}</div>;
    }
    render() {
        var view = null;
        if (this.state.loading) {
            view = <Loader size="2" text="Loading Availability.."></Loader>;
        } else {
            view = this.getPlaceholderView(this.state.data);
        }

        return <div>
            {this.props.title ?
                <div>
                    <h2 class="text-muted" style={{ paddingBottom: '10px' }}>{this.props.title}</h2>
                </div>
                : null
            }
            {view}
            <div style={{ paddingTop: '20px' }}>
                <btn style={{ padding: '10px 30px' }} className="btn btn-green btn-lg"
                    onClick={() => { this.props.onSubmit(JSON.parse(JSON.stringify(this.state.selectedUnix))) }}>
                    {this.props.submitText}
                </btn>
            </div>

        </div>;
    }
}

TimePicker.propTypes = {
    title: PropTypes.string,
    submitText: PropTypes.string,
    onSubmit: PropTypes.func,
    canOnlySelectOne: PropTypes.bool,
    defaultTimestamps: PropTypes.array,
    selectedTimestamps: PropTypes.array,
};

TimePicker.defaultProps = {
    submitText: "Submit",
    canOnlySelectOne: false,
    selectedTimestamps: [],
};


