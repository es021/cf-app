var Time = function () {};

Time.prototype.getDateDay = function (unixtimestamp) {
    if (unixtimestamp <= 0 || unixtimestamp === null || unixtimestamp === "") {
        return "";
    }

    if (unixtimestamp === "now") {
        unixtimestamp = this.getUnixTimestampNow();
    }

    var date = new Date(unixtimestamp * 1000);
    var m = date.getMonth() + 1;
    var d = date.getDate();

    if (m < 10) {
        m = "0" + m;
    }

    if (d < 10) {
        d = "0" + d;
    }

    return `${date.getFullYear()}-${m}-${d}`;
}

Time.prototype.getDateDayStr = function (unixtimestamp) {
    if (unixtimestamp <= 0 || unixtimestamp === null || unixtimestamp === "") {
        return "";
    }

    if (unixtimestamp === "now") {
        unixtimestamp = this.getUnixTimestampNow();
    }

    var date = new Date(unixtimestamp * 1000);
    var arr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return arr[date.getDay()];
}

Time.prototype.getDateTime = function (unixtimestamp, format12H) {

    format12H = (typeof format12H === "undefined") ? false : format12H;


    if (unixtimestamp <= 0 || unixtimestamp === null || unixtimestamp === "") {
        return "";
    }

    if (unixtimestamp === "now") {
        unixtimestamp = this.getUnixTimestampNow();
    }

    var date = new Date(unixtimestamp * 1000);
    var h = date.getHours();
    var m = date.getMinutes();


    var pm_am = "";
    if (format12H) {
        if (h >= 12) {
            pm_am = "PM";
            if (h >= 13) {
                h -= 12;
            }
        } else {
            pm_am = "AM";
        }
    }

    if (h < 10) {
        h = "0" + h;
    }

    if (m < 10) {
        m = "0" + m;
    }

    if (format12H) {
        return `${h}:${m} ${pm_am}`;
    } else {
        return `${h}:${m}`;
    }

}

// timezone : MYT, EST
Time.prototype.getStringWithTimezone = function (unixtimestamp, timezone) {
    //Time.getStringWithTimezone("now", "MYT")

    var TZ = {
        MYT: +8,
        EST: -5,
        EDT: -4
    }

    if (unixtimestamp <= 0 || unixtimestamp === null || unixtimestamp === "") {
        return "";
    }

    if (unixtimestamp === "now") {
        unixtimestamp = this.getUnixTimestampNow();
    }

    if (typeof unixtimestamp === "string") {
        if (Number.isNaN(Number.parseInt(unixtimestamp))) {
            unixtimestamp = this.convertDBTimeToUnix(unixtimestamp);
        }
    }

    var d = new Date();
    var defaultOffset = d.getTimezoneOffset() / 60;
    var offset = defaultOffset + TZ[timezone];
    unixtimestamp = unixtimestamp + (offset * 60 * 60);

    var r = `${this.getString(unixtimestamp)} (${timezone})`;
    //console.log(r);

    return r;
}


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

Time.prototype.getPeriodString = function (start, end, dates) {
    if (typeof dates !== "undefined") {
        var month = Time.getString(start, false, false, false, false, false, true); // month only
        var year = Time.getString(start, false, false, false, false, false, false, true); // month only

        var r = month;
        for (var i in dates) {
            var d = dates[i];
            if (i == 0) { // first
                r += " " + d;
            } else if (i == dates.length - 1) { //last
                r += " and " + d;
            } else { // middle
                r += ", " + d;
            }
        }

        r += ", " + year;
        return r;

    } else {
        var startStr = Time.getString(start, false, false, false, true); // day n month only
        var endStr = Time.getString(end, false, false, true, false); // with year
        return `${startStr} - ${endStr}`;
    }
}

Time.prototype.getUnixTimestampNow = function () {
    var date = new Date();
    return Math.round(date.getTime() / 1000);
};


Time.prototype.convertDBTimeToUnix = function (db_time) {
    //return Date.parse(db_time) / 1000;

    function stripAll(str, arr) {
        for (var i in arr) {
            str = str.replace(arr[i], "");
        }
        return str;
    }

    function parseMonth(mnth) {
        switch (mnth.toLowerCase()) {
            case 'january':
            case 'jan':
            case 'enero':
                return 1;
            case 'february':
            case 'feb':
            case 'febrero':
                return 2;
            case 'march':
            case 'mar':
            case 'marzo':
                return 3;
            case 'april':
            case 'apr':
            case 'abril':
                return 4;
            case 'may':
            case 'mayo':
                return 5;
            case 'jun':
            case 'june':
            case 'junio':
                return 6;
            case 'jul':
            case 'july':
            case 'julio':
                return 7;
            case 'aug':
            case 'august':
            case 'agosto':
                return 8;
            case 'sep':
            case 'september':
            case 'septiembre':
            case 'setiembre':
                return 9;
            case 'oct':
            case 'october':
            case 'octubre':
                return 10;
            case 'nov':
            case 'november':
            case 'noviembre':
                return 11;
            case 'dec':
            case 'december':
            case 'diciembre':
                return 12;
        }
        return mnth;
    }


    function getUnixFromOffsetHour(unix, offset) {

        try {
            if (offset.indexOf("+") >= 0) {
                var hour = offset.replace("+", "");
                hour = Number.parseInt(hour);
                return unix - (hour * 60 * 60);
            }

            if (offset.indexOf("-") >= 0) {
                var hour = offset.replace("-", "");
                hour = Number.parseInt(hour);
                return unix + (hour * 60 * 60);
            }

        } catch (err) {}

        return unix;
    }

    function dbToTimeUnix(strDate) {
        var mapDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Mon\,', 'Tue\,', 'Wed\,', 'Thu\,', 'Fri\,', 'Sat\,', 'Sun\,', 'Mon ', 'Tue ', 'Wed ', 'Thu ', 'Fri ', 'Sat ', 'Sun ', 'Sun\.', 'Mon\.', 'Tue\.', 'Wed\.', 'Thu\.', 'Fri\.', 'Sat\.', 'Sun\.'];
        strDate = stripAll(strDate, mapDays);
        strDate = strDate.replace(/[\,]/g, '');
        strDate = strDate.replace(/^\s+|\s+$/g, '');
        strDate = strDate.replace(/ +(?= )/g, '');
        strDate = strDate.replace(/^(\d+)\./, '$1');
        var ok = 0;
        var skipDate = 0;
        var content = "";
        var date = "";
        var format = "";
        var yr = 1970;
        var mnth = 1;
        var dy = 1;
        var hr = 0;
        var mn = 0;
        var sec = 0;
        var dmy = 1;
        if (!ok) {
            var dateTimeSplit = strDate.split(" ");
            var dateParts = dateTimeSplit[0].split("-");
            if (dateParts.length == 1) dateParts = dateTimeSplit[0].split(".");
            if (dateParts.length == 1) {
                dmy = 0;
                dateParts = dateTimeSplit[0].split("/");
            }
            if (dateParts.length == 1) {
                dmy = 1;
                if (dateTimeSplit.length > 2) {
                    if (dateTimeSplit[2].split(":").length == 1) {
                        strDate = strDate.replace(dateTimeSplit[0] + ' ' + dateTimeSplit[1] + ' ' + dateTimeSplit[2], dateTimeSplit[0] + '-' + dateTimeSplit[1] + '-' + dateTimeSplit[2]);
                        dateTimeSplit = strDate.split(" ");
                        dateParts = dateTimeSplit[0].split("-");
                    }
                }
            }
            if (dateParts.length == 1) {
                dateParts = dateTimeSplit;
                if (dateTimeSplit.length > 3) timeParts = dateTimeSplit[4];
            }
            if (dateParts.length > 2) {
                if (dateParts[0] > 100) {
                    yr = dateParts[0];
                    mnth = parseMonth(dateParts[1]);
                    dy = dateParts[2];
                    format = "YMD";
                } else {
                    if (dmy) {
                        dy = dateParts[0];
                        mnth = parseMonth(dateParts[1]);
                        yr = dateParts[2];
                        format = "DMY";
                        if ((!parseFloat(mnth)) || (!parseFloat(dy))) {
                            dy = dateParts[1];
                            mnth = parseMonth(dateParts[0]);
                            format = "MDY";
                        }
                    } else {
                        mnth = parseMonth(dateParts[0]);
                        dy = dateParts[1];
                        yr = dateParts[2];
                        format = "MDY";
                        if ((!parseFloat(mnth)) || (!parseFloat(dy))) {
                            dy = dateParts[0];
                            mnth = parseMonth(dateParts[1]);
                            format = "DMY";
                        }
                    }
                }
                ok = 1;
            }
            if (ok && dateTimeSplit[1]) {
                var timeParts = dateTimeSplit[1].split(":");
                if (timeParts.length >= 2) {
                    hr = timeParts[0];
                    mn = timeParts[1];
                }
                if (timeParts.length >= 3) {
                    sec = timeParts[2];
                }
                if ((dateTimeSplit[2] && dateTimeSplit[2].toLowerCase() == "pm") && (parseFloat(hr) < 12))
                    hr = parseFloat(hr) + 12;
                if ((dateTimeSplit[2] && dateTimeSplit[2].toLowerCase() == "am") && (parseFloat(hr) == 12))
                    hr = 0;
            }
        }

        if (!ok) {
            date = new Date(strDate);
            if (date.getFullYear() > 1900) {
                ok = 1;
                skipDate = 1;
            }
        }
        var offsetHourGMT = 0;
        if (ok) {
            if (!skipDate) {
                if (mnth != parseFloat(mnth)) mnth = parseMonth(mnth);
                if (yr < 30) yr = 2000 + parseFloat(yr);
                if (yr < 200) yr = 1900 + parseFloat(yr);
                var usedGMT = 0;
                if (strDate.toUpperCase().indexOf('GMT') >= 0) {
                    date = new Date(Date.UTC(yr, mnth - 1, dy, hr, mn, sec));
                    usedGMT = 1;

                    // format server digital ocean
                    // Wed Mar 27 2019 12:16:54 GMT (+08)
                    var strArr = strDate.split("(");
                    strArr = strArr[1].split(")");
                    offsetHourGMT = strArr[0];

                    // New utk format ->
                    // Wed Mar 27 2019 12:16:54 GMT+0800 (Malay Peninsula Standard Time)
                    if (strDate.toUpperCase().indexOf('GMT+') >= 0 || strDate.toUpperCase().indexOf('GMT-') >= 0) {
                        let strArr2 = strDate.split("GMT");
                        strArr2 = strArr2[1].split(" ");
                        offsetHourGMT = strArr2[0];
                        if (offsetHourGMT.length > 3) {
                            offsetHourGMT = offsetHourGMT.substring(0, 3)
                        }
                    }

                } else {
                    date = new Date(yr, mnth - 1, dy, hr, mn, sec);
                }
            }
        }

        var unix = (date.getTime() / 1000.0);

        return getUnixFromOffsetHour(unix, offsetHourGMT);
    }

    return dbToTimeUnix(db_time);
};


Time.prototype.getHapenningIn = function (unixtimestamp, {
    passedText,
    startCountMinute
}) {
    if (typeof unixtimestamp === "string") {
        unixtimestamp = this.convertDBTimeToUnix(unixtimestamp);
    }

    startCountMinute = typeof startCountMinute === "undefined" ? 0 : startCountMinute;

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var msStartCount = startCountMinute * msPerMinute;

    var current = new Date();

    var next = new Date(unixtimestamp * 1000);
    var timeLeft = next - current;

    if (msStartCount > 0) {
        if (timeLeft > msStartCount) {
            return null;
        }
    }

    if (timeLeft <= 0) {
        return passedText;
    }

    if (timeLeft < msPerMinute) {
        return Math.round(timeLeft / 1000) + ' seconds';
    } else if (timeLeft < msPerHour) {
        return Math.round(timeLeft / msPerMinute) + ' minutes';
    } else if (timeLeft < msPerDay) {
        return Math.round(timeLeft / msPerHour) + ' hours';
    } else if (timeLeft < msPerMonth) {
        return Math.round(timeLeft / msPerDay) + ' days';
    } else if (timeLeft < msPerYear) {
        return Math.round(timeLeft / msPerMonth) + ' months';
    } else {
        return Math.round(timeLeft / msPerYear) + ' years';
    }
}

Time.prototype.getAgo = function (unixtimestamp) {
    if (typeof unixtimestamp === "string") {
        unixtimestamp = this.convertDBTimeToUnix(unixtimestamp);
    }

    console.log("unixtimestamp", unixtimestamp);

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

Time.prototype.getStringShort = function (unixtimestamp, getSecond) {
    return this.getString(unixtimestamp, false, true, false, false, getSecond);
};

Time.prototype.getDate = function (unixtimestamp) {
    return this.getString(unixtimestamp, false, false, true);
};
// mysql UNIX_TIMESTAMP(column)
Time.prototype.getString = function (unixtimestamp, include_timezone = false, isShort = false, dateOnly = false, dateMonthOnly = false, getSecond = false, monthOnly = false, yearOnly = false) {

    if (unixtimestamp <= 0 || unixtimestamp === null || unixtimestamp === "") {
        return "";
    }

    if (unixtimestamp === "now") {
        unixtimestamp = this.getUnixTimestampNow();
    }
    //console.log(unixtimestamp);

    if (typeof unixtimestamp === "string") {
        if (Number.isNaN(Number.parseInt(unixtimestamp))) {
            unixtimestamp = this.convertDBTimeToUnix(unixtimestamp);
            //console.log(unixtimestamp);
        }
    }

    include_timezone = (typeof include_timezone === "undefined") ? false : include_timezone;
    var newDate = new Date(unixtimestamp * 1000);

    var hour = newDate.getHours();
    var minute = newDate.getMinutes();
    var seconds = newDate.getSeconds();

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

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    //console.log(newDate.getTimezoneOffset());
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var toReturn = "";
    //month start with zero

    if (!isShort) {
        toReturn += months[newDate.getMonth()];
        toReturn += " ";
        toReturn += newDate.getDate();

        if (yearOnly) {
            return newDate.getFullYear();
        }

        if (monthOnly) {
            return months[newDate.getMonth()];
        }

        if (dateMonthOnly) {
            return toReturn;
        }


        toReturn += ", ";
        toReturn += newDate.getFullYear();

        if (dateOnly) {
            return toReturn;
        }

        toReturn += " ";
    }

    toReturn += hour;
    toReturn += ":";
    toReturn += minute;

    if (getSecond) {
        toReturn += ":";
        toReturn += seconds;
    }

    toReturn += " " + pm_am;

    if (include_timezone) {
        toReturn += "<br><small>" + this.getTimezone(newDate) + "</small>";
    }

    return toReturn;
};

Time.prototype.getTimezone = function (date = null) {
    if (date === null) {
        date = new Date();
    }

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

//export var Time = new Time();
var Time = new Time();
module.exports = {
    Time
};