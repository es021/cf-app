const DB = require('./DB.js');
const {Skill} = require('../../config/db-config');

class SkillQuery {
    getSkill(params) {
        var user_where = (typeof params.user_id === "undefined") ? "1=1" : `${Skill.USER_ID} = ${params.user_id}`;
        var order_by = `ORDER BY ${Skill.ID} desc`;

        return `select * from ${Skill.TABLE} where ${user_where} ${order_by}`;
    }
}

SkillQuery = new SkillQuery();

class SkillExec {
    skills(params, field) {
        var sql = SkillQuery.getSkill(params);
        console.log(sql);   
        var toRet = DB.query(sql).then(function (res) {
            return res;
        });
        return toRet;
    }
}

SkillExec = new SkillExec();

module.exports = {SkillQuery, SkillExec};


