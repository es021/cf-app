import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Time } from '../lib/time';

// require('../css/timer.scss');

export default class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.getItem = this.getItem.bind(this);
        this.getSeparator = this.getSeparator.bind(this);
        this.startCountdown = this.startCountdown.bind(this);
        this.state = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            done: false
        };
    }

    componentWillMount() {
        if (this.props.end == null) {
            return;
        }
        this.endUnix = Time.convertDBTimeToUnix(this.props.end);
        this.timer = setInterval(this.startCountdown, 1000);
    }

    componentWillUnmount() {
        if (this.props.end == null) {
            return;
        }
        clearInterval(this.timer);
    }

    startCountdown() {
        var now = Time.getUnixTimestampNow();
        var distance = (this.endUnix - now) * 1000;

        if (distance < 0) {
            clearInterval(this.timer);

            this.setState(() => {
                return {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    done: true
                };
            });
        } else {
            //Less than 5 hours, will use .closer styling
            if (distance < 17999352) {
                //dom.addClass("closer");
            }

            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            this.setState(() => {
                return {
                    days: days,
                    hours: hours,
                    minutes: minutes,
                    seconds: seconds
                };
            });
        }
    }

    getItem(value, label) {

        if (value < 10) {
            value = "0" + value;
        }

        return <div className="timer_item">
            <div className="timer_value">{value}</div>
            <div className="timer_label">{label}</div>
        </div>;
    }

    getSeparator(separator) {
        return <div className="seperator">{separator}</div>;
    }

    render() {
        if (this.props.end == null) {
            return null;
        }
        var view = null;
        if (this.state.done) {
            view = this.props.doneMes;
        } else {
            view = <div id={`timer`} className={`text-center ${this.props.type}`}>
                <div className="timer_title">{this.props.title}</div>
                <div className="timer_time">
                    {this.getItem(this.state.days, "DAYS")}
                    {this.getSeparator(":")}
                    {this.getItem(this.state.hours, "HOURS")}
                    {this.getSeparator(":")}
                    {this.getItem(this.state.minutes, "MINUTES")}
                    {this.getSeparator(":")}
                    {this.getItem(this.state.seconds, "SECONDS")}
                </div>
            </div>;
        }
        return (<div className="timer">
            {view}
        </div>);
    }
}

Timer.propTypes = {
    end: PropTypes.any.isRequired,
    showDate: PropTypes.bool,
    title: PropTypes.string,
    type: PropTypes.string,
    doneMes: PropTypes.any,
};

Timer.defaultProps = {
    doneMes: null,
    showDate: true,
    type: ""
};