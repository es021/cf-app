select 
ss.ID , ss.user_id, ss.support_id, ss.message_count_id, ss.created_at
, mc.updated_at as last_message_time
, m.message as last_message
        , CONCAT(
                (select s.val from single_input s where s.entity_id = m.recruiter_id 
                and s.entity = 'user' 
                and s.key_input = 'first_name'),
                " ",
                (select s.val from single_input s where s.entity_id = m.recruiter_id 
                and s.entity = 'user' 
                and s.key_input = 'last_name')
            ) as last_rec_name
        
, COUNT(mx.id_message_number) as ttl

from support_sessions ss 
INNER JOIN message_count mc on mc.id = ss.message_count_id
INNER JOIN messages m on m.id_message_number = CONCAT(mc.id,':',mc.count)
LEFT OUTER JOIN messages mx on  
                mx.id_message_number like CONCAT(mc.id,':%')
                AND mx.from_user_id != 2046
                AND mx.has_read = 0
                AND mx.created_at > '2021-09-01 00:00:00'
where 1=1 AND ss.support_id = 2046

GROUP BY ss.ID, ss.user_id, ss.support_id, ss.message_count_id, ss.created_at, last_message_time, last_message, last_rec_name
ORDER BY mc.updated_at desc, ss.created_at desc