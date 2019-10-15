const DB = require("./DB.js");

class LocationExec {
  query(param) {
    var limit = DB.prepareLimit(param.page, param.offset);

    let search_ct = param.val
      ? `ct.val like '%${param.val}%'`
      : "1=1";
    let search_st = param.val
      ? `st.val like '%${param.val}%'`
      : "1=1";
    let search_cn = param.val
      ? `cn.val like '%${param.val}%'`
      : "1=1";

      console.log(param.location_suggestion)
      console.log(param.location_suggestion)
      console.log(param.location_suggestion)
      console.log(param.location_suggestion)

    var sql = `
	select * from (
		select 
		concat(ct.val, ", ", st.val) as val,
		"city" as type,
		ct.ID as city_id, ct.val as city,
		st.ID as state_id, st.val as state,
		cn.ID as country_id, cn.val as country
		from ref_city ct, ref_state st, ref_country cn
		where 1=1 
		and ct.state_id = st.ID
		and ct.country_id = cn.ID
		and ${search_ct}
	
	UNION ALL
		select 
		concat(st.val, ", ", cn.val) as val,
		"state" as type,
		null as city_id, null as city,
		st.ID as state_id, st.val as state,
		cn.ID as country_id, cn.val as country
		from ref_state st, ref_country cn
		where 1=1 
		and st.country_id = cn.ID
		and ${search_st}
	
	UNION ALL
		select 
		cn.val as val,
		"country" as type,
		null as city_id, null as city,
		null as state_id, null as state,
		cn.ID as country_id, cn.val as country
		from ref_country cn
		where 1=1 
		and ${search_cn}
	) X 
	${limit}`;
    return sql;
  }
  isSingle(type) {
    return type == "single";
  }
  getHelper(type, param, field, extra = {}) {
    var sql = this.query(param, extra);
    console.log("[LocationExec]", sql);
    var toRet = DB.query(sql).then(res => {
      for (var i in res) {
      }
      if (this.isSingle(type)) {
        return res[0];
      } else {
        return res;
      }
    });
    return toRet;
  }
  single(param, field) {
    return this.getHelper("single", param, field);
  }
  list(param, field, extra = {}) {
    return this.getHelper("list", param, field, extra);
  }
}

LocationExec = new LocationExec();
module.exports = {
  LocationExec
};
