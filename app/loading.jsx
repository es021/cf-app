import React, {Component} from 'react';
import {render} from 'react-dom';
import {Loader} from './component/loader';

require("./css/app-loading.scss");

class AppLoading extends React.Component {
    render() {
        return(<div>
            <Loader text="Please Hold On" size="2"></Loader>
        </div>);
    }
}

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
    // hide the loading
    app_load.style["opacity"] = "0";
    setTimeout(() => {
        app_load.style["display"] = "none";
    }, 500);
});

render(<AppLoading/>, app_load);