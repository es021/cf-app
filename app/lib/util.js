if (process.env.NODE_ENV === "production" && false)  {
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

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

document.setTitle = function (title) {
    document.title = `Test | ${title}`;
    //document.title = `VICAF | ${title}`;
};

