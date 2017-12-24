var Time = function () {};

Time.prototype.isUnixElapsedHour = function (unixtimestamp, hour) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;

    var current = new Date();
    var previous = new Date(unixtimestamp * 1000);
    var elapsed = current - previous;

    if (elapsed > hour * msPerHour) {
        return true;
    } else {
        return false;
    }
};

Time.prototype.getUnixTimestampNow = function () {
    var date = new Date();
    return Math.round(date.getTime() / 1000);
};

Time.prototype.convertDBTimeToUnix = function (db_time) {
    return Date.parse(db_time) / 1000;
};

Time.prototype.getAgo = function (unixtimestamp) {
    if (typeof unixtimestamp === "string") {
        unixtimestamp = this.convertDBTimeToUnix(unixtimestamp);
    }

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var current = new Date();

    var previous = new Date(unixtimestamp * 1000);
    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        var sec = Math.round(elapsed / 1000);
        if (sec < 10) {
            return "Just now";
        } else {
            return Math.round(elapsed / 1000) + ' seconds ago';
        }
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
};


// mysql UNIX_TIMESTAMP(column)
Time.prototype.getString = function (unixtimestamp, include_timezone) {
    if (unixtimestamp <= 0 || unixtimestamp === null || unixtimestamp === "") {
        return "";
    }

    if (typeof unixtimestamp === "string") {
        unixtimestamp = this.convertDBTimeToUnix(unixtimestamp);
    }


    include_timezone = (typeof include_timezone === "undefined") ? false : include_timezone;

    var newDate = new Date(unixtimestamp * 1000);

    var hour = newDate.getHours();
    var minute = newDate.getMinutes();
    var pm_am = "";

    if (hour >= 12) {
        pm_am = "PM";
        if (hour >= 13) {
            hour -= 12;
        }
    } else {
        pm_am = "AM";
    }

    if (hour < 10) {
        hour = "0" + hour;
    }

    if (minute < 10) {
        minute = "0" + minute;
    }

    //console.log(newDate.getTimezoneOffset());
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var toReturn = "";
    //month start with zero
    toReturn += months[newDate.getMonth()];
    toReturn += " ";
    toReturn += newDate.getDate();
    toReturn += ", ";
    toReturn += newDate.getFullYear();
    toReturn += " ";
    toReturn += hour;
    toReturn += ":";
    toReturn += minute;
    toReturn += " " + pm_am;

    if (include_timezone) {
        toReturn += "<br><small>" + this.getTimezone(newDate) + "</small>";
    }

    return toReturn;
};

Time.prototype.getTimezone = function (date) {
    try {
        return date.toString().split('(')[1].slice(0, -1);
    } catch (err) {
        return "";
    }
};


Time.prototype.getUnixFromDateTimeInput = function (date_input, time_input) {
    var datetime = date_input + "T" + time_input + ":00";
    var d = new Date(datetime);
    return Math.floor(d.getTime() / 1000);
};

Time.prototype.getInputFromUnix = function (unixtimestamp) {
    var r = {};
    var date = new Date(unixtimestamp * 1000);
    var d = date.toString();
    var t = date.toLocaleTimeString();

    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();

    m = (m < 10) ? "0" + m : m;
    d = (d < 10) ? "0" + d : d;

    var h = date.getHours();
    var mm = date.getMinutes();

    mm = (mm < 10) ? "0" + mm : mm;
    h = (h < 10) ? "0" + h : h;

    r.date = y + "-" + m + "-" + d;
    r.time = h + ":" + mm;
    return r;
};

export var Time = new Time();
