import React, {Component} from 'react';
import {render} from 'react-dom';

require("./css/app-loading.scss");
const AppLoading = () => (
            <div>Loading</div>
            );

//show loading until the main bundle finish load
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) {  //IE
        script.onreadystatechange = function () {
            if (script.readyState === "loaded" || script.readyState === "complete") {
                script.onreadystatechange = null;
                callback();
            } 
        };
    } else {  //Others
        script.onload = function () {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("body")[0].appendChild(script);
}

const app_load = document.getElementById('app-loading');

var main = "asset/js/main.bundle.js";
loadScript(main, function () {
    console.log('script ready!');
    //hide the loading
    app_load.style["display"] = "none";
});

render(<AppLoading/>, app_load);