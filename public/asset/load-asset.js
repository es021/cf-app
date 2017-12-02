function LoadAsset() {
    var JS_PATH = "asset/js/";

    var needToLoad = [
        JS_PATH + "vendors.bundle.js"
                , JS_PATH + "main.bundle.js"
            ];

    var app_load = document.getElementById('app-loading');
    var loaded = 0;

    //show loading until the main bundle finish load
    var loadScript = function (url, callback) {
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
    };

    var finishLoad = function () {
        loaded++;
        console.log("finish load", loaded);
        if (loaded >= needToLoad.length) {
            // hide the loading
            app_load.style["opacity"] = "0";
            setTimeout(function () {
                app_load.style["display"] = "none";
            }, 500);
        }
    };

    needToLoad.map(function (d, i) {
        loadScript(d, finishLoad);
    });
}

LoadAsset();
