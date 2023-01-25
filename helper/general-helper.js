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


const Toastify = require('toastify-js');
/**
 * position : top-right, top-center, top-left, bottom-right, bottom-center, bottom-left
 * type : success, error, info, warning
 */
function toast({ text, type, duration = 3000, position = "top-right" }) {
    Toastify({
        text: text,
        duration: duration,
        // destination: "https://github.com/apvarun/toastify-js",
        // newWindow: true,
        selector: document.getElementsByClassName("primary-layout")[0],
        close: true,
        gravity: position.indexOf("top") >= 0 ? "top" : "bottom", // `top` or `bottom`
        position: position.indexOf("right") >= 0 ? "right" : position.indexOf("center") >= 0 ? "center" : "left", // `left`, `center` or `right`
        stopOnFocus: false, // Prevents dismissing of toast on hover
        style: {
            background:
                type == "success" ? "linear-gradient(to right, #00b09b, #96c93d)" :
                    type == "error" ? "linear-gradient(to right, rgb(183 26 69), rgb(255 79 79))" :
                        type == "info" ? "linear-gradient(to right, rgb(26 71 183), rgb(79 153 255))" :
                            type == "warning" ? "linear-gradient(to right, rgb(227 119 22), rgb(255 160 73))" :
                                ""
        },
        onClick: function () { } // Callback after click
    }).showToast();
}

function toastSuccess(text) {
    toast({ text: text, type: "success" })
}
function toastError(text) {
    toast({ text: text, type: "error" })
}
function toastInfo(text) {
    toast({ text: text, type: "info" })
}
function toastWarning(text) {
    toast({ text: text, type: "warning" })
}



module.exports = {
    toast,
    toastSuccess,
    toastError,
    toastInfo,
    toastWarning,
    makeSnakeCase,
    generateId,
    getUnixTimestampNow,
    setBodyFullWidth,
    unsetBodyFullWidth
};