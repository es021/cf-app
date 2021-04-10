const { graphql } = require("../../helper/api-helper");
const DB = require("../model/DB");

function Main() {
    DB.query("SELECT param FROM pivot_student_filter").then(res => {
        for (let r of res) {
            let param = r.param;
            try {
                param = JSON.parse(param);
                console.log(param);

                let q = `query{ 
                    browse_student_filter( 
                        override_pivot: true,
                        current_cf:"TEST", 
                        discard_filter:"::interested_job_location::::university::" 
                    ) 
                    { _key _val _total _val_label } 
                }`;
                graphql(q)
                    .then(res => {
                        console.log(res.data.data);
                    })
            } catch (err) { }
        }
    })
}

Main();