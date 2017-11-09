console.log("aaa");

typeof Object.assign !== "function" &&

(function() {

    /**
     * Return main instance of value.
     * @param {...} value
     * @returns 
     */
    function getMainInstance(value) {
        // get instance in this format: [object Instance]
        var ic = Object.prototype.toString.call(value);
        // returns string between '[object ' and ']'
        return ic.substring(ic.indexOf(" ") + 1, ic.lastIndexOf("]")).toLowerCase();
    }


    Object.assign = function(target) {

        /* check if target isn't a object */
        if (typeof target !== "object") target = {};

        /* last target path */
        var lastPath = target;

        /* list containing target paths */
        var locations = [];

        /* consume specific array/object */
        function consume(source) {
            /* iterate each property to copy */
            for (var i in source) {
                var instance = getMainInstance(source[i]);
                if (instance === "object" || instance === "array") {
                    lastPath =
                    lastPath[i] =
                    locations[locations.length] = (instance === "array" ? [] : {})

                    consume(source[i]);

                } else {
                    lastPath[i] = source[i];
                }
            }

            var len = locations.length;
            lastPath = locations[--len] || target;

        }

        for (var i = 1, source; source = arguments[i]; i++) {
            if (typeof source === "object") consume(source);
        }

        return target;
    };

})();