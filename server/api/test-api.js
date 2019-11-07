const DB = require("../model/DB.js");

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

// create table with single
class TestAPI {
  newDB(param) {
    var TABLE = param.table;
    var TABLE_CAPITALIZE = TABLE.capitalize();
    var TYPE = `${TABLE_CAPITALIZE}Type`;
    var EXEC = `${TABLE_CAPITALIZE}Exec`;

    const _root = () => {
      let imp = `const { ${EXEC} } = require("../model/${TABLE}-query.js");`;
      let list = `
            fields["${TABLE}s"] = {
                type: new GraphQLList(${TYPE}),
                args: {

                    // TO ADD
                    page: __.Int,
                    offset: __.Int
                },
                resolve(parentValue, arg, context, info) {
                return ${EXEC}.list(arg, graphqlFields(info));
                }
            };
            `;
      let single = `
            fields["${TABLE}"] = {
                type: ${TYPE},
                args: {
                    // TO ADD
                },
                resolve(parentValue, arg, context, info) {
                    return ${EXEC}.single(arg, graphqlFields(info));
                }
            };
            `;

      return `
        // ROOT #################################################################

        ${imp}
        ${list}
        ${single}
        `;
    };

    const _field = (res, discard = [], forDb = false) => {
      let fields = "";
      for (var i in res) {
        let r = res[i];
        let col = r.Field;
        if (discard.indexOf(col) >= 0) {
          continue;
        }
        let type = r.Type;
        let typeJs = null;
        if (type.indexOf("int") >= 0) {
          typeJs = "Int";
        } else if (type.indexOf("char") >= 0) {
          typeJs = "String";
        } else if (type.indexOf("time") >= 0) {
          typeJs = "String";
        }

        if (forDb) {
          fields += `\t\t${col.toUpperCase()} : "${col}",\n`;
        } else {
          fields += `\t\t\t${col} : __.${typeJs},\n`;
        }
      }

      fields = fields.substr(0, fields.length - 2);
      return fields;
    };

    const _fieldDB = (res, discard = []) => {
      return _field(res, discard, true);
    };

    const _mutation = res => {
      let fields = _field(res, ["ID"]);
      return `
          // MUTATION #################################################################

          /* ${TABLE}  ******************/

            fields["add_${TABLE}"] = {
                type: ${TYPE},
                args: {
                    ${fields}
                },
                resolve(parentValue, arg, context, info) {
                    return DB.insert(${TABLE_CAPITALIZE}.TABLE, arg).then(function(res) {
                        return res;
                    });
                }
            };

            
          fields["edit_${TABLE}"] = {
                type: ${TYPE},
                args: {
                    ${fields}
                },
                resolve(parentValue, arg, context, info) {
                    try {
                        return DB.update(${TABLE_CAPITALIZE}.TABLE, arg).then(function(res) {
                            return res;
                        });
                    } catch (err) {
                        return {};
                    }
                }
            };


            fields["delete_${TABLE}"] = {
                type: GraphQLInt,
                args: {
                    ID: __.IntNonNull
                },
                resolve(parentValue, arg, context, info) {
                    return DB.delete(${TABLE_CAPITALIZE}.TABLE, arg.ID);
                }
            };
        
        `;
    };
    const _allType = res => {
      let fields = _field(res);
      return `
        // ALL TYPE #################################################################

        const ${TYPE} = new GraphQLObjectType({
                name: "${TABLE_CAPITALIZE}",
                fields: () => ({
                ${fields}
                })
            });
        `;
    };
    const _dbConfig = res => {
      let fields = _fieldDB(res);

      return `
        // DB CONFIG #################################################################

        const ${TABLE_CAPITALIZE} = {
            TABLE: "${TABLE}",
            ${fields}
        }
        `;
    };

    console.log("param", param);
    let table = param.table;
    return DB.query(`SHOW COLUMNS FROM ${table}`).then(res => {
      //   console.log(_allType(table, res));
      //   console.log(_root(table));
      //   console.log(_mutation(table, res));
      return `
      <pre>${_dbConfig(res)}</pre>
      <hr>
      <pre>${_allType(res)}</pre>
      <hr>
      <pre>${_root(res)}</pre>
      <hr>
      <pre>${_mutation(res)}</pre>
      `;
    });
  }
}
TestAPI = new TestAPI();
module.exports = { TestAPI };
