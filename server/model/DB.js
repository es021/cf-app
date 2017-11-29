var Mysql = require("promise-mysql");

var DB = function (env) {
    var config = {};
    if (env === "DEV") {
        config = {
            connectionLimit: 100,
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'wp_career_fair'
        };
    } else if (env === "PROD") {
        config = {
            connectionLimit: 100,
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'wp_career_fair'
        };
    }

    this.con = Mysql.createPool(config);
//    var obj = this;
//    (function () {
//        // An anonymous function wrapper helps you keep oldSomeFunction private
//        var realQueryFunction = obj.con.query;
//
//        obj.con.query = function () {
//            console.log("intercepted!");
//            return realQueryFunction();
//        };
//    })();

    /*this.query('SELECT * FROM wp_cf_users').then(function (rows) {
     console.log(rows);
     });*/

    /*
     this.con.connect(function (err) {
     if (err) {
     throw err;
     } else {
     console.log("DB Connected");
     }
     });
     */
};

DB.prototype.query = function (query) {
    return this.con.query(query);
};

DB.prototype.escStr = function (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\" + char; // prepends a backslash to backslash, percent,
                // and double/single quotes
        }
    });
};

DB.prototype.getByID = function (table, ID) {
    var sql = `select * from ${table} where ID = ${ID}`;

    return this.query(sql).then(function (res) {
        return res[0];
    });
};

// only works with table with primary key of is ID
DB.prototype.insert = function (table, data) {
    var DB = this;
    var key = "(";
    var val = "(";
    for (var k in data) {
        key += `${k},`;
        val += `'${data[k]}',`;
    }
    key = key.substring(-1, key.length - 1) + ')';
    val = val.substring(-1, val.length - 1) + ')';

    var sql = `INSERT INTO ${table} ${key} VALUES ${val}`;
    return this.query(sql).then(function (res) {
        return DB.getByID(table, res.insertId);
    });
};

// only works with table with primary key of is ID
DB.prototype.update = function (table, data) {
    var DB = this;
    var ID = data.ID;

    var key_val = "";

    for (var k in data) {
        if (k !== "ID") {
            key_val += `${k} = '${data[k]}',`;
        }
    }
    key_val = key_val.substring(-1, key_val.length - 1);

    var sql = `UPDATE ${table} SET ${key_val} WHERE ID = ${ID}`;
    console.log(sql);
    return this.query(sql).then(function (res) {
        return DB.getByID(table, ID);
    });
};


DB.prototype.prepareLimit = function (page, offset) {
    var start = (page - 1) * offset;
    var limit = (typeof page !== "undefined" && typeof offset !== "undefined")
            ? `LIMIT ${start},${offset}` : "";
    return limit;
};

module.exports = new DB("DEV");
//module.exports = new DB("PROD");
//helper function


//function dbSuccessHandler(res) {
//    console.log(res[0]);
//    console.log();
//
//    for (var i in res) {
//
//    }
//    return res[0];
//}
//
//function dbErrorHandler(err) {
//    console.log(err);
//    return err;
//
//}



//DB.prototype.query = function (sql, success, error) {
//    this.query(sql, function (err, res) {
//        if (err) {
//            error(err);
//        } else {
//            console.log(res);
//            success(res);
//        }
//    });
//};
