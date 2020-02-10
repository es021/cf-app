a = `2848	Australia
2917	Australia
2958	Australia
2972	Australia
3013	Australia
3027	Australia
3089	Australia
2821	China
2828	China
2862	China
3121	China
3122	China
3123	China
3130	China
3133	China
3145	China
3163	China
3164	China
3165	China
3167	China
3169	China
3170	China
3185	China
2920	Germany
2941	Germany
2950	Germany
2953	Germany
2843	New Zealand
2866	New Zealand
2890	New Zealand
3149	New Zealand
2992	South Korea
2993	South Korea
2995	South Korea
2998	South Korea
3005	South Korea
3010	South Korea
3011	South Korea
3030	South Korea
3032	South Korea
3035	South Korea
3037	South Korea
3043	South Korea
3044	South Korea
3050	South Korea
3052	South Korea
3059	South Korea
3090	South Korea
3093	South Korea
3110	South Korea
3042	South Korea
2832	Spain
1392	United Kingdom
2863	United Kingdom
2978	United Kingdom
3076	United Kingdom
3099	United Kingdom
3115	United Kingdom
3134	United Kingdom
3136	United Kingdom
3146	United Kingdom
2808	United States
2841	United States
2875	United States
2895	United States
2923	United States
2924	United States
2927	United States
2939	United States
3100	United States
3107	United States
3181	United States`;

a = a.split("\n");

idComma = ``;
key_input = "country_study";
sql = "";
for(var _a of a){
    _a = _a.split("\t");
    
    let id = _a[0];
    let val = _a[1];

    console.log(_a);
    sql += `UPDATE single_input SET val = "${val}" WHERE entity_id = "${id}" and key_input = "${key_input}" and entity = "user"; \n`;

    idComma += `${id},`;
}

idComma = idComma.substring(0, idComma.length - 1);


sqlSel = `SELECT * from single_input WHERE key_input = "${key_input}" and entity_id IN (${idComma})`;



console.log(sqlSel)
console.log(sql)
