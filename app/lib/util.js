export function openNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

export function getWindowWidth() {
    var width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
    return width;
}


/*
 export function getWindowHeight() {
 var height = window.innerHeight
 || document.documentElement.clientHeight
 || document.body.clientHeight;
 return height;
 }
 */
