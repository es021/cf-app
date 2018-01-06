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
            password: 'gundamseed21',
            database: 'wp_career_fair'
        };
    }

    this.con = Mysql.createPool(config);

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

/**** CF *******/
DB.prototype.cfMapSelect = function (entity, entity_id, cf) {
    var cf_where = (typeof cf === "undefined") ? "1=1" : `cf= '${cf}'`;
    return `SELECT cf from cf_map where entity = '${entity}' and entity_id = ${entity_id} and ${cf_where}`;
};

DB.prototype.getCF = function (entity, entity_id) {
    var sql = this.cfMapSelect(entity, entity_id);
    return this.query(sql).then(function (res) {
        var toRet = res.map((d, i) => d.cf);
        return toRet;
    });
};

DB.prototype.updateCF = function (entity, entity_id, cf) {
    var del = `DELETE from cf_map where entity = '${entity}' and entity_id = ${entity_id}`;
    return this.query(del).then((res) => {
        var ins = `INSERT INTO cf_map (entity, entity_id, cf) VALUES `;
        cf.map((_cf, i) => {
            if (i > 0) {
                ins += ",";
            }
            ins += `('${entity}', ${entity_id} ,'${_cf}') `;
        });
        console.log(ins);
        return this.query(ins).then((res) => res);
    });
};
/**** CF *******/

DB.prototype.query = function (query) {
    return this.con.query(query);
};

DB.prototype.escStr = function (str) {
    if (typeof str !== "string") {
        return str;
    }

    return str.replace(
        /[\0\x08\x09\x1a\n\r"'\\\%]/g
        , function (char) {
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
                    return "\\" + char; // prepends a backslash to backslash, percent,
                // and double/single quotes
                case "%":
                    return "%";
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
        val += `'${this.escStr(data[k])}',`;
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
    if (typeof data.cf !== "undefined") {
        var cf = data.cf;
        delete (data["cf"]);
        var entity = null;
        // trigger from manage-company
        switch (table) {
            case 'companies':
                entity = "company";
                break;
        }

        if (entity !== null) {
            this.updateCF(entity, data.ID, cf);
        }
    }

    var DB = this;
    var ID = data.ID;

    if (ID === null || ID == "" || typeof ID === "undefined" || ID <= 0) {
        return;
    }

    var key_val = "";

    for (var k in data) {
        if (k !== "ID") {
            key_val += `${k} = '${this.escStr(data[k])}',`;
        }
    }
    key_val = key_val.substring(-1, key_val.length - 1);

    if (key_val == "") {
        return false;
    }

    var sql = `UPDATE ${table} SET ${key_val} WHERE ID = ${ID}`;
    return this.query(sql).then(function (res) {
        return DB.getByID(table, ID);
    });
};

// only works with table with primary key of is ID
// return affected rows
DB.prototype.delete = function (table, ID) {
    if (ID === null || ID == "" || typeof ID === "undefined" || ID <= 0) {
        return;
    }

    var sql = `DELETE FROM ${table} WHERE ID = ${ID}`;
    console.log(sql);

    return this.query(sql).then(function (res) {
        //console.log("finish delete", res);
        return res.affectedRows;
    });
};

DB.prototype.prepareLimit = function (page, offset) {
    var start = (page - 1) * offset;
    var limit = (typeof page !== "undefined" && typeof offset !== "undefined")
        ? `LIMIT ${start},${offset}` : "";
    return limit;
};

if (process.env.NODE_ENV === "production") {
    module.exports = new DB("PROD");
} else {
    module.exports = new DB("DEV");
}
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
