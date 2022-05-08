const { getAxiosGraphQLQuery } = require('../../helper/api-helper');
const axios = require('axios');
const obj2arg = require('graphql-obj2arg');
const DB = require('../model/DB.js');

class MetaAPI {
    add(key, value, source) {
        var query = `mutation{add_meta(meta_key:"${key}",meta_value:"${value}",source:"${source}"){ ID }}`;
        return getAxiosGraphQLQuery(query).then((res) => {
            return res.data.data.add_meta;
        }, (err) => {
            return err;
        });
    }
}
MetaAPI = new MetaAPI();

class CfsApi {
    getAllCf() {
        var query = `query{ cfs(is_active :1) { ID name country time }}`;
        return getAxiosGraphQLQuery(query).then((res) => {
            return res.data.data.cfs;
        }, (err) => {
            return err;
        });
    }
    create(param) {
        let cf = param.cf;
        let sql = `INSERT INTO cfs 
        (name,country,time,is_active,is_load,cf_order) 
        VALUES (?, '', '18 - 22 July, 2020','1', '1', '8')`

        sql = DB.prepare(sql, [cf]);
        return DB.query(sql).then(res => {
            return res;
        }).catch(err => {
            return JSON.stringify(err);
        })
    }
}
CfsApi = new CfsApi();

class LogApi {
    addEventLog(param) {
        return DB.insert("event_logs", {
            action: param.action,
            user_id: param.user_id,
            event_id: param.event_id,
            company_id: param.company_id,
        });
    }
    add(event, data = null, user_id = null) {
        var param = { event: event };
        if (data != null) {
            param["data"] = "" + data;
        }
        if (user_id != null) {
            param["user_id"] = user_id;
        }

        var query = `mutation{add_log(${obj2arg(param, { noOuterBraces: true })}){ ID }}`;
        return getAxiosGraphQLQuery(query).then((res) => {
            return res.data.data.add_log;
        }, (err) => {
            return err;
        });
    }
}
LogApi = new LogApi();

module.exports = { MetaAPI, LogApi, CfsApi };
