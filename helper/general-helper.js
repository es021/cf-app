const getUnixTimestampNow = function () {
    var date = new Date();
    return Math.round(date.getTime() / 1000);
};

module.exports = {
    getUnixTimestampNow
};