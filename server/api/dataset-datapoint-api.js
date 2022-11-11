const DB = require("../model/DB.js");
const { UserQuery } = require("../model/user-query.js");
const { graphql } = require("../../helper/api-helper");
const { Time } = require("../../app/lib/time.js");

class DatasetDatapointApi {
    Main(action, param) {
        switch (action) {
            case "add-dataset-item-bundle":
                return this.addDatasetItemBundle(param);
        }
    }
    addDatasetItemBundle(param) {
        let source = param.source;
        let val = param.val;
        let dataRow = [];
        let arr = val.split("\n");
        for (let a of arr) {
            a = a.trim();
            if (a) {
                dataRow.push({
                    source: source,
                    val: a,
                })
            }
        }
        return DB.insertMulti({
            table: "global_dataset_item",
            dataRow: dataRow,
            isIgnore: true,
        })
    }
}

DatasetDatapointApi = new DatasetDatapointApi();
module.exports = { DatasetDatapointApi };
