if (process.env.NODE_ENV === "production" && false) {
    console.log = function (mes) {
        return;
    };
}

export function openNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

export function getWindowWidth() {
    var width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
    return width;
}

export function _GET(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

String.prototype.replaceAll = function (search, replacement, ignoreCase = false) {
    var i = (ignoreCase) ? "i" : "";
    var target = this;
    return target.replace(new RegExp(search, `${i}g`), replacement);
};

String.prototype.insertSubstring = function (substring, position) {
    var target = this;
    return [target.slice(0, position), substring, target.slice(position)].join('');
};


String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.focusSubstring = function (substring) {
    if (typeof substring !== "string" || substring == "" || substring == null) {
        return this;
    }
    var target = this;
    var re = new RegExp(substring, `ig`);
    var match = re.exec(target);
    if (match == null) {
        return target;
    }
    var start = match["index"];
    var end = start + substring.length;
    target = target.insertSubstring("</b>", end);
    target = target.insertSubstring("<b>", start);
    return target;
}

import { getCF } from '../redux/actions/auth-actions';
document.setTitle = function (title) {
    document.title = `${getCF()} | ${title}`;
};

