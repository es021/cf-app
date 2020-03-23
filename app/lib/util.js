if (process.env.NODE_ENV === "production" && false) {
  console.log = function(mes) {
    return;
  };
}


export function isMobileDevice(){
  var isMobile = false;
  // device detection
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
      isMobile = true;
  }
  return isMobile;
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

export function smoothScrollTo(idToGo, offset = -100) {
  let elToGo = document.getElementById(idToGo);
  if (elToGo) {
    let yCoordinate = elToGo.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: yCoordinate + offset,
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

export function addClassEl(el, className) {
  if (el) {
    el.className += " " + className;
  }
}

export function removeClassEl(el, className) {
  if (el) {
    let cs = el.className;

    let arr = cs.split(" ");

    let newCs = "";
    for (var i in arr) {
      if (arr[i] !== className) {
        newCs += ` ${arr[i]} `;
      }
    }

    el.className = newCs;
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
