SELECT X.* FROM (select 
c.name as company, 

'Individual Call' as type,
p.ID as call_id,

CONCAT( (select s.val from single_input s where s.entity = "user" 
and s.entity_id = u.ID and s.key_input = "first_name"), " ", 
(select s.val from single_input s where s.entity = "user" and s.entity_id = u.ID 
and s.key_input = "last_name") ) as student_name, 

-- matrix no
(select s.val from single_input s where s.entity = "user" and s.entity_id = u.ID 
and s.key_input = "id_utm") as matrix_no,

u.user_email as student_email, 
convert_tz(from_unixtime(p.appointment_time), '+00:00', '+08:00') as interview_time, 
p.status as interview_status 

from pre_screens p, companies c, wp_cf_users u 

where p.company_id = c.ID 

and p.student_id = u.ID 

and u.ID IN (select m.entity_id from cf_map m 
where m.entity = "user" and m.entity_id = u.ID and m.cf = "UTMIV21" ) 

and c.ID IN (select m.entity_id from cf_map m where m.entity = "company" 
and m.entity_id = c.ID and m.cf = "UTMIV21" ) 


UNION ALL

select 
c.name as company, 

'Group Call' as type,
g.ID as call_id,

CONCAT( (select s.val from single_input s where s.entity = "user" 
and s.entity_id = u.ID and s.key_input = "first_name"), " ", 
(select s.val from single_input s where s.entity = "user" and s.entity_id = u.ID 
and s.key_input = "last_name") ) as student_name, 

-- matrix no
(select s.val from single_input s where s.entity = "user" and s.entity_id = u.ID 
and s.key_input = "id_utm") as matrix_no,

u.user_email as student_email, 
convert_tz(from_unixtime(g.appointment_time), '+00:00', '+08:00') as interview_time, 
(CASE 
WHEN g.is_canceled = 1 THEN 'Canceled'
WHEN g.url IS NOT NULL THEN 'Has Link'
ELSE '' END
)
as interview_status 

from group_call_user gcu, group_call g, companies c, wp_cf_users u 

where  1=1
AND g.ID = gcu.group_call_id
AND g.cf = 'UTMIV21'
AND gcu.user_id = u.ID
AND g.company_id = c.ID 
) as X

order by X.company, X.type desc, X.interview_time