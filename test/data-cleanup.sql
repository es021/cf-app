-- ######################
-- WHERE IN MALAYSIA xde dlm ref

select 
	X.ID,
	X.val as original_val, 
    X.key_input,
    X.entity_id,
    (CASE WHEN X.match_state IS NOT NULL THEN X.match_state 
    ELSE X.match_city END) as matchs
from(
    SELECT 
    s.ID,
    s.val,
    s.entity_id,
    s.key_input,
    SUBSTRING_INDEX(s.val,',',1),
    (select rr.val from ref_city_state_country rr where rr.val like CONCAT(SUBSTRING_INDEX(s.val,',',1), "%") and rr.type = "city" and s.val != "" limit 0,1 ) as match_city,
    (select rr.val from ref_city_state_country rr where rr.val like CONCAT(SUBSTRING_INDEX(s.val,',',1), "%") and rr.type = "state" and s.val != "" limit 0,1 ) as match_state
    from single_input s
    where s.key_input = "where_in_malaysia"
    and s.val NOT IN(SELECT r.val from ref_city_state_country r)
)X order by matchs


