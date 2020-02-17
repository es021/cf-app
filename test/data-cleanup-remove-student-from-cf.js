a = `241
243
249`;

CF = "GWINTER";

a = a.split("\n");
idComma = ``;
sql = "";
for(var _a of a){
    _a = _a.split("\t");
    let id = _a[0];

    console.log(_a);
    sql += `DELETE from cf_map 
        WHERE cf = "${CF}" 
        AND entity_id = "${id}" 
        AND entity = "user"; \n`;
    idComma += `${id},`;
}
idComma = idComma.substring(0, idComma.length - 1);
sqlSel = `SELECT * from cf_map 
    WHERE cf = "${CF}" 
    AND entity_id IN (${idComma}) 
    AND entity = "user"`;


console.log(sqlSel)
console.log(sql)


// buang like by test account
// delete from interested where user_id IN (select u.ID from wp_cf_users u where u.user_email like '%test%') 