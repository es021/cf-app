a = `2798 	Air Itam, Pulau Pinang
2604 	Balakong, Selangor
2822 	Bangi, Selangor
2727 	Banting, Selangor
2754 	Banting, Selangor
2832 	Banting, Selangor
2378 	Bukit Jalil, Kuala Lumpur
2782 	Bukit Jalil, Kuala Lumpur
3252 	Cheras, Kuala Lumpur
2784 	Cyberjaya, Selangor
2430 	Gombak, Selangor
2627 	Gombak, Selangor
2419 	Ipoh, Perak
2574 	Ipoh, Perak
2734 	Ipoh, Perak
2923 	Ipoh, Perak
2953 	Johor Bahru, Johor
2793 	Johor, Malaysia
2962 	Kajang, Selangor
2586 	Kedah, Malaysia
2720 	Kedah, Malaysia
2762 	Kelantan, Malaysia
2683 	Kemaman, Terengganu
2282 	Kepong, Selangor
3189 	Kepong, Selangor
2701 	Klang, Selangor
2841 	Klang, Selangor
2972 	Klang, Selangor
2974 	Klang, Selangor
2351 	Kluang, Johor
2381 	Kluang, Johor
2465 	Kuala Lumpur, Malaysia
2644 	Kuala Lumpur, Malaysia
2825 	Kuala Lumpur, Malaysia
2948 	Kuala Lumpur, Malaysia
3026 	Kuala Lumpur, Malaysia
3121 	Kuala Lumpur, Malaysia
3216 	Kuala Lumpur, Malaysia
3263 	Kuala Lumpur, Malaysia
1220 	Kuala Lumpur, Malaysia
3290 	Kuala Lumpur, Malaysia
2476 	Kuala Selangor, Selangor
2484 	Kuantan, Pahang
2554 	Kuantan, Pahang
3050 	Kuantan, Pahang
2993 	Kuching, Sarawak
2500 	Melaka, Malaysia
2537 	Melaka, Malaysia
2670 	Melaka, Malaysia
2756 	Melaka, Malaysia
2813 	Melaka, Malaysia
1009 	Melaka, Malaysia
3010 	Melaka, Malaysia
2379 	Muar, Johor
2286 	Muar, Johor
2288 	Nilai, Negeri Sembilan
2473 	Nilai, Negeri Sembilan
2682 	Pahang, Malaysia
2903 	Pahang, Malaysia
2408 	Perak, Malaysia
2603 	Perak, Malaysia
3224 	Perak, Malaysia
3141 	Petaling Jaya, Selangor
2879 	Puchong, Selangor
2253 	Pulau Pinang, Malaysia
2687 	Pulau Pinang, Malaysia
1011 	Pulau Pinang, Malaysia
2930 	Pulau Pinang, Malaysia
3012 	Pulau Pinang, Malaysia
3200 	Pulau Pinang, Malaysia
2454 	Puncak Alam, Selangor
3136 	Putrajaya, Malaysia
2438 	Rawang, Selangor
2921 	Rawang, Selangor
3084 	Rawang, Selangor
2869 	Sabah, Malaysia
3259 	Sandakan, Sabah
1392 	Selangor, Malaysia
2848 	Selangor, Malaysia
3115 	Selangor, Malaysia
2700 	Semenyih, Selangor
2724 	Semenyih, Selangor
2666 	Semporna, Sabah
2743 	Sepang, Selangor
2457 	Shah Alam, Selangor
2460 	Shah Alam, Selangor
2525 	Shah Alam, Selangor
2547 	Shah Alam, Selangor
3044 	Sitiawan, Perak
2691 	Sungai Buloh, Selangor
2655 	Sungai Petani, Kedah
2429 	Taiping, Perak
3127 	Taman Salak Selatan, Kuala Lumpur
3099 	Taman Tun Dr Ismail, Kuala Lumpur
2623 	Tampin, Melaka
2536 	Wangsa Maju, Kuala Lumpur`;

a = a.split("\n");

idComma = ``;
key_input = "where_in_malaysia";
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