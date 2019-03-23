class EntityRemovedQuery {
    getNotIn(discard_removed, entity, entity_id, user_id) {
        var toRet = (typeof discard_removed === "undefined" || !discard_removed) ? "1=1" :
            `${entity_id} NOT IN (SELECT enrm.entity_id FROM entity_removed enrm 
            WHERE enrm.entity = '${entity}' 
            AND enrm.entity_id = ${entity_id}
            AND enrm.user_id = '${user_id}' )`;

        return toRet;
    }
}
EntityRemovedQuery = new EntityRemovedQuery();

module.exports = {
    EntityRemovedQuery
};