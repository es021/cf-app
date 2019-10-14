if (process.env.NODE_ENV === "production" && false) {
  console.log = function(mes) {
    return;
  };
}

export function openNewTab(url) {
  var win = window.open(url, "_blank");
  win.focus();
}

export function getDangerousHtml(str) {
  let toSet = str;
  if (typeof str === "string") {
    if (str.indexOf("<script>") >= 0) {
      toSet = str;
      toSet = toSet.replaceAll("<script>", "");
      toSet = toSet.replaceAll("</script>", "");
    }
  }

  return {
    __html: toSet
  };
}

export function getWindowWidth() {
  var width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  return width;
}

export function smoothScrollTo(idToGo) {
  const OFFSET = -100;
  let elToGo = document.getElementById(idToGo);
  if (elToGo) {
    let yCoordinate = elToGo.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: yCoordinate + OFFSET,
      behavior: "smooth"
    });
  }
}

export function focusOnInput(id) {
  let el = document.getElementById(id);
  let input = el.getElementsByTagName("input");
  if (input.length > 0) {
    input[0].focus();
  }
}

export function scrollToY(element, to, duration) {
  if (duration <= 0) return;
  var difference = to - element.scrollTop;
  var perTick = (difference / duration) * 10;

  setTimeout(function() {
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop === to) return;
    scrollToY(element, to, duration - 10);
  }, 10);
}

export function scrollToX(element, to, duration) {
  if (duration <= 0) return;
  var difference = to - element.scrollLeft;
  var perTick = (difference / duration) * 10;

  setTimeout(function() {
    element.scrollLeft = element.scrollLeft + perTick;
    if (element.scrollLeft === to) return;
    scrollToX(element, to, duration - 10);
  }, 10);
}

export function getParamUrl(url, parameterName) {
  var result = null;
  var tmp = [];
  var search = "";
  url = url.split("?");
  search = url[1];
  var items = search.split("&");
  for (var index = 0; index < items.length; index++) {
    tmp = items[index].split("=");
    if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
  }
  return result;
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

String.prototype.parseJson = function() {
  try {
    return JSON.parse(this);
  } catch (err) {
    return null;
  }
};

String.prototype.containText = function(text) {
  return this.toUpperCase().indexOf(text.toUpperCase()) >= 0;
};

String.prototype.endsWith = function(text) {
  var last4 = this.substring(this.length - text.length);
  return last4.toUpperCase() == text.toUpperCase();
};

String.prototype.replaceAll = function(
  search,
  replacement,
  ignoreCase = false
) {
  var i = ignoreCase ? "i" : "";
  var target = this;
  return target.replace(new RegExp(search, `${i}g`), replacement);
};

String.prototype.insertSubstring = function(substring, position) {
  var target = this;
  return [target.slice(0, position), substring, target.slice(position)].join(
    ""
  );
};

String.prototype.capitalizeAll = function() {
  let arr = this.split(" ");

  let toRet = "";
  for (var i in arr) {
    if (i > 0) {
      toRet += " ";
    }
    toRet += arr[i].capitalize();
  }
  return toRet;
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.focusSubstring = function(substring) {
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
};

import { getCF } from "../redux/actions/auth-actions";
document.setTitle = function(title) {
  document.title = `${getCF()} | ${title}`;
};

// #############################################################

console.error = function(err, err2, err3, err4, err5) {
  let discardArr = ["Warning:"];

  for (var i in discardArr) {
    if (err.indexOf(discardArr[i]) == 0) {
      //console.log("discard error logging");
      return;
    }
  }

  let otherErrs = [err2, err3, err4, err5];

  let color = "color: #FE0505";
  console.log("%c" + err, color);
  err = err.toString();

  for (var i in otherErrs) {
    if (typeof otherErrs[i] !== "undefined") {
      console.log("%c" + otherErrs[i], color);
      err += " " + otherErrs[i].toString();
    }
  }
};
