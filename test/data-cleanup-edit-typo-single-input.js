a = `2861	France
2104	-
2096	-
2011	-
1682	-
1576	-
1237	-
757	-
731	-
700	-
698	-
495	-
136	-
118	-
3161	-
3143	-
3006	-
2882	-
2881	-
1600	-
1212	-
1049	-
978	-
858	-
740	-
2910	Australia
2864	Australia
3281	China
3261	China
3250	China
3075	France
3009	France
2955	France
2937	France
2941	Germany
2918	Germany
3066	Hungary
2961	Japan
3090	Korea, Republic of
3048	Korea, Republic of
3046	Korea, Republic of
3043	Korea, Republic of
3018	Korea, Republic of
2994	New Zealand
2952	New Zealand
2845	New Zealand
2843	New Zealand
3129	Singapore
3312	United Kingdom
3296	United Kingdom
3287	United Kingdom
3204	United Kingdom
3150	United Kingdom
3134	United Kingdom
3094	United Kingdom
3061	United Kingdom
2871	United Kingdom
3209	United States
3041	United States
2997	United States
2907	United States
2889	United States
3021	Australia
2945	Australia
2846	New Zealand`;

a = a.split("\n");

idComma = ``;
key_input = "country_study";
sql = "";
for(var _a of a){
    _a = _a.split("\t");
    
    let id = _a[0];
    id = id.trim();
    let val = _a[1];
    val = val.trim();
    
    console.log(_a);
    sql += `UPDATE single_input SET val = "${val}" WHERE entity_id = "${id}" and key_input = "${key_input}" and entity = "user"; \n`;

    idComma += `${id},`;
}

idComma = idComma.substring(0, idComma.length - 1);


sqlSel = `SELECT * from single_input WHERE key_input = "${key_input}" and entity_id IN (${idComma})`;


console.log(sqlSel)
console.log(sql)


// buang like by test account
// delete from interested where user_id IN (select u.ID from wp_cf_users u where u.user_email like '%test%') 