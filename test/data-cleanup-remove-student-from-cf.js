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

a = a.split("\n");

idComma = ``;
key_input = "country_study";
sql = "";
for(var _a of a){
    _a = _a.split("\t");
    
    let id = _a[0];
    let val = _a[1];

    console.log(_a);
    sql += `DELETE from cf_map WHERE entity_id = "${id}" and key_input = "${key_input}" and entity = "user"; \n`;

    idComma += `${id},`;
}

idComma = idComma.substring(0, idComma.length - 1);


sqlSel = `SELECT * from single_input WHERE key_input = "${key_input}" and entity_id IN (${idComma})`;


console.log(sqlSel)
console.log(sql)


// buang like by test account
// delete from interested where user_id IN (select u.ID from wp_cf_users u where u.user_email like '%test%') 