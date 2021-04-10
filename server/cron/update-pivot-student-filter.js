const { graphql } = require("../../helper/api-helper");
const DB = require("../model/DB");

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
                        override_pivot: true,
                        current_cf:"${param.current_cf}", 
                        discard_filter:"${param.discard_filter}" 
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