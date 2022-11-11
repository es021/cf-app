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
const generateId = function (length = 5) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
const makeSnakeCase = function (str) {
    return str && str.match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(s => s.toLowerCase())
        .join('_');
}



module.exports = {
    makeSnakeCase,
    generateId,
    getUnixTimestampNow,
    setBodyFullWidth,
    unsetBodyFullWidth
};