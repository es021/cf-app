const getUnixTimestampNow = function () {
    var date = new Date();
    return Math.round(date.getTime() / 1000);
};

const setBodyFullWidth = function () {
    let body = document.getElementsByTagName("body")[0];
    body.className += " body-full-width ";
}

const unsetBodyFullWidth = function () {
    let body = document.getElementsByTagName("body")[0];
    body.className = body.className.replaceAll("body-full-width", "");
}


module.exports = {
    getUnixTimestampNow,
    setBodyFullWidth,
    unsetBodyFullWidth
};