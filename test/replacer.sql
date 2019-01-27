SELECT X.*
, (CASE WHEN 
 DATE_FORMAT(X.user_registered, '%Y%m') < '201812'
 THEN 'returning' ELSE 'new' END) as user_type

from(
    SELECT 
    cf_map.cf,
    logs.user_id, 
    wp_cf_users.user_email, 
    wp_cf_users.user_registered,
    MAX(logs.created_at) as last_login

    FROM logs, wp_cf_users, cf_map

    where 1=1
    and cf_map.entity_id = wp_cf_users.ID
    and cf_map.entity = "user"
    and cf_map.cf = "USA"
    and logs.user_id = wp_cf_users.ID
    and logs.event = 'login' 
    and wp_cf_users.user_email not like '%test%' 
    and wp_cf_users.user_email not like 'wzs21@icloud.com'
    group by logs.user_id, wp_cf_users.user_email, wp_cf_users.user_registered
) X

WHERE DATE_FORMAT(X.last_login, '%Y%m') >= '201812'
order by X.user_registered desc