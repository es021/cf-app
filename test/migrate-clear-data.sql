-- clear event data

-- clear user map
delete
FROM cf_map  
where 1=1
and cf = "CIMB"
and entity = "user"

-- clear interview list
delete from pre_screens WHERE
company_id in (
    SELECT c.ID
    FROM 
    `companies` c, cf_map m 
    where 1=1
    and m.cf = "CIMB"
    and m.entity = "company"
    and m.entity_id = c.ID
)

-- clear chat list
delete
from message_count
where 1=1
and 
(REPLACE(SUBSTRING_INDEX(id, ":", 1), "company", "")) IN 
(
    SELECT c.ID
    FROM 
    `companies` c, cf_map m 
    where 1=1
    and m.cf = "CIMB"
    and m.entity = "company"
    and m.entity_id = c.ID
);
delete from messages
where 1=1
and 
(REPLACE(SUBSTRING_INDEX(id_message_number, ":", 1), "company", "")) IN 
(
    SELECT c.ID
    FROM 
    `companies` c, cf_map m 
    where 1=1
    and m.cf = "CIMB"
    and m.entity = "company"
    and m.entity_id = c.ID
);


