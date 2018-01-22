var Mysql = require("mysql");
const { Secret } = require('../../secret/secret.js');

var DB = function (env) {
    var config = {};
    if (env === "development") {
        config = {
            connectionLimit: 100,
            host: Secret.DB_HOST,
            user: Secret.DB_USER,
            password: Secret.DB_PASS_DEV,
            database: Secret.DB_DATABASE
        };
    } else if (env === "production") {
        config = {
            connectionLimit: 100,
            host: Secret.DB_HOST,
            user: Secret.DB_USER,
            password: Secret.DB_PASS_PROD,
            database: Secret.DB_DATABASE
        };
    }

    this.con = Mysql.createConnection(config);

    this.con.connect(function (err) {
        if (err) {
            throw err;
        } else {
            console.log("DB Connected");
        } 
    });
};

DB.prototype.query = function (sql, obj, eventEmit, eventData) {
    this.con.query(sql, function (err, res) {
        if (err) {
            obj.dbErrorHandler(err);
        } else {
            obj.dbSuccessHandler(res, eventEmit, eventData, obj);
        }
    });
};

module.exports = new DB(process.env.NODE_ENV);

