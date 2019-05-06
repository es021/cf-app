const getUnixTimestampNow = function () {
    var date = new Date();
    return Math.round(date.getTime() / 1000);
};

const setBodyFullWidth = function(){
    let body = document.getElementsByTagName("body")[0];
    body.className += " body-full-width ";
}

module.exports = {
    getUnixTimestampNow,
    setBodyFullWidth
};