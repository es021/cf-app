import {
    customBlockLoader
} from '../redux/actions/layout-actions';

import {
    AudioUrl
} from '../../config/app-config';


var hasLocalStorageSupport;

try {
    window.localStorage.setItem("testKey", 'foo');
    window.localStorage.removeItem("testKey");
    hasLocalStorageSupport = true;
} catch (e) {
    console.log(e);
    hasLocalStorageSupport = false;
}

const NOTI_LOCAL_STORAGE = "cf-app-noti";



export function soundNotification() {
    var id = "notification-audio";

    var cur = document.getElementById(id);
    if (cur != null) {
        document.body.removeChild(cur);
    }

    var audio = document.createElement("audio");
    audio.id = id;
    audio.innerHTML = `<source type="audio/mpeg" src="${AudioUrl}/bell.mp3">`;
    document.body.appendChild(audio)

    audio.load();
    audio.play();
}

function getCurrentLocal() {
    var curLs = window.localStorage.getItem(NOTI_LOCAL_STORAGE);
    if (curLs == null) {
        return [];
    }

    var toRet = null;
    try {
        toRet = JSON.parse(curLs);
    } catch (err) {
        toRet = [];
    }

    return toRet;
}

export function showNotification(id, content) {
    var cur = getCurrentLocal();

    // kalau dh ada dalam local storage , return je
    if (cur.indexOf(id) >= 0) {
        return;
    }

    soundNotification();
    customBlockLoader(content);

    cur.push(id);
    window.localStorage.setItem(NOTI_LOCAL_STORAGE, JSON.stringify(cur));
}