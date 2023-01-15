const DB = require("../model/DB.js");
const { UserQuery } = require("../model/user-query.js");
const { graphql } = require("../../helper/api-helper");
const { Time } = require("../../app/lib/time.js");
const { GlobalDatasetExec } = require("../model/global-dataset-query.js");

class DatasetDatapointApi {
    Main(action, param) {
        switch (action) {
            case "add-dataset-item-bundle":
                return this.addDatasetItemBundle(param);
            case "duplicate-dataset":
                return this.duplicateDataset(param);
        }
    }
    duplicateDataset(param) {
        let cf = param.cf;
        let from_source = param.from_source;
        let created_by = param.created_by;
        let name = param.name;
        let new_source = GlobalDatasetExec.generateSourceFromName(name, cf);

        return DB.insert("global_dataset", {
            cf: cf,
            name: name,
            source: new_source,
            created_by: created_by
        }).then(res => {
            let sqlInsert = `
                INSERT INTO global_dataset_item (source, val) 
                SELECT ? as source, val FROM global_dataset_item WHERE source = ?
            `
            sqlInsert = DB.prepare(sqlInsert, [new_source, from_source]);
            return DB.query(sqlInsert);
        })


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
