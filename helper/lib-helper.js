// non export just extends prototype

String.prototype.replaceAll = function (search, replacement, ignoreCase = false) {
    var i = (ignoreCase) ? "i" : "";
    var target = this;
    return target.replace(new RegExp(search, `${i}g`), replacement);
};

