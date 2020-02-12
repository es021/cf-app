a = `225
2826
2838
2869
2887
2903
2980
2983
2984
2985
2986
2996
3003
3067
3068
3069
3071
3074
3077
3086
3105
3139
3142
3179
3180
3182
3184
3194
3197`;

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