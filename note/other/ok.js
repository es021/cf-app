a = `3346	23rd August
3423	23rd August
3405	23rd August`

a = a.split("\n")
sql = "";
for(let b of a){
    b = b.split("\t")
    sql += `INSERT INTO tag (entity_id, label, entity) VALUES (${b[0].trim()}, '${b[1].trim()}', 'company');\n`
}
console.log(sql)