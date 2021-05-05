const { graphql } = require("../../helper/api-helper");
const DB = require("../model/DB");
function getQueryParam(param) {
    let ret = "";
    // current_cf: "${param.current_cf}",
    //     discard_filter: "${param.discard_filter}"
    for (let k in param) {
        let v = param[k];
        if (typeof v === "string") {
            ret += ` ,${k}:"${param[k]}" `
        } else if (typeof v === "number") {
            ret += ` ,${k}:${param[k]} `
        }
    }

    return ret;
}
// */5 * * * * NODE_ENV=production nvm exec 8.9.1 node /var/www/cf-app/server/cron/update-pivot-student-filter.js
function Main() {
    var toLoad = 0;
    var loaded = 0;
    function finish(success) {
        loaded++;
        console.log(`done ${loaded}/${toLoad}`)
        if (loaded >= toLoad) {
            process.exit()
        }
    }

    DB.query("SELECT param FROM pivot_student_filter").then(res => {
        toLoad = res.length;
        for (let r of res) {
            let param = r.param;
            try {
                param = JSON.parse(param);
                console.log(param);
                let q = `query{ 
                    browse_student_filter( 
                        override_pivot: true
                        ${getQueryParam(param)}
                    ) 
                    { _key _val _total _val_label } 
                }`;
                graphql(q)
                    .then(res => {
                        finish(true);
                    }).err(err => {
                        finish(false);
                    })
            } catch (err) { }
        }
    })
}

Main();