const DB = require('./DB.js');
const { Meta } = require('../../config/db-config');
/*
//email subscribe
query{
	metas(meta_key:"subscriber",page:1,offset:10) {
	  meta_key
	  meta_value
	  created_at
	}
}

// organization enquiries
query{
	metas(meta_key:"enquiries",meta_value:"org_name",page:1,offset:10) {
	  meta_key
	  meta_value
	  created_at
	}
}

// company enquiries
query{
	metas(meta_key:"enquiries",meta_value:"comp_name",page:1,offset:10) {
	  meta_key
	  meta_value
	  created_at
	}
}
*/

class MetaExec {
    getQuery(params) {
        var value_where = (typeof params.meta_value === "undefined") ? "1=1"
            : `${Meta.VALUE} like '%${params.meta_value}%'`;

        var key_where = (typeof params.meta_key === "undefined") ? "1=1"
            : `${Meta.KEY} = '${params.meta_key}'`;

        var order_by = "ORDER BY " + ((typeof params.order_by === "undefined")
            ? `${Meta.CREATED_AT} desc` : `${params.order_by}`);

        var limit = DB.prepareLimit(params.page, params.offset);
        
        return `select * from ${Meta.TABLE} where ${value_where} and ${key_where}
            ${order_by} ${limit}`;
    }

    metas(params, field, extra = {}) {
        var sql = this.getQuery(params);
        var toRet = DB.query(sql).then(function (res) {

            if (extra.single && res !== null) {
                return res[0];
            } else {
                return res;
            }

        });
        return toRet;
    }
}

MetaExec = new MetaExec();

module.exports = { MetaExec };


