const DB = require("./DB.js");

class LocationExec {
  subQuerySuggestion(param, ref, parent_val){
    if (param.location_suggestion) {
      return ` ${parent_val} IN (select sg.ref_val from location_suggestion sg where 
        sg.suggestion_name = '${param.location_suggestion}' and ref = '${ref}') `;
    }

    return "1=1";
  }
  query(param, type) {
    var limit = DB.prepareLimit(param.page, param.offset);

    let search_ct = param.val ? `ct.val like '%${param.val}%'` : "1=1";
    let search_st = param.val ? `st.val like '%${param.val}%'` : "1=1";
    let search_cn = param.val ? `cn.val like '%${param.val}%'` : "1=1";

    let suggest_ct = this.subQuerySuggestion(param, "city", "ct.val");
    let suggest_st = this.subQuerySuggestion(param, "state", "st.val");
    let suggest_cn = this.subQuerySuggestion(param, "country", "cn.val");

    let country_select = "";
    if(!this.isListMalaysia(type)){
      country_select = `UNION ALL
        select 
        cn.val as val,
        "country" as type,
        null as city_id, null as city,
        null as state_id, null as state,
        cn.ID as country_id, cn.val as country
        from ref_country cn
        where 1=1 
        and ${search_cn}
        and ${suggest_cn}`;
    }
    
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
        and ${suggest_ct}
      
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
        and ${suggest_st}

        ${country_select}

      ) X ${limit}`;
      
    return sql;
  }
  isListMalaysia(type) {
    return type == "list_malaysia";
  }
  isList(type) {
    return type == "list";
  }
  isSingle(type) {
    return type == "single";
  }
  getHelper(type, param, field, extra = {}) {
    var sql = this.query(param, type);
    // // console.log("[LocationExec]", sql);
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
  list_malaysia(param, field, extra = {}) {
    return this.getHelper("list_malaysia", param, field, extra);
  }
  list(param, field, extra = {}) {
    return this.getHelper("list", param, field, extra);
  }
}

LocationExec = new LocationExec();
module.exports = {
  LocationExec
};
