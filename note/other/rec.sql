SELECT u.* 
, (select SUBSTRING_INDEX(SUBSTRING_INDEX((select m.meta_value from wp_cf_usermeta m where m.user_id = u.ID and m.meta_key = 'wp_cf_capabilities' order by umeta_id desc limit 0,1),'"',2),'"',-1)) as role 
, (select m.meta_value from wp_cf_usermeta m where m.user_id = u.ID and m.meta_key = 'user_status' order by umeta_id desc limit 0,1) as user_status 
, (select m.meta_value from wp_cf_usermeta m where m.user_id = u.ID and m.meta_key = 'rec_company' order by umeta_id desc limit 0,1) as rec_company 
   
FROM wp_cf_users u, wp_cf_usermeta m  WHERE 1=1 
        AND 1=1 
        AND 
        m.user_id = 
        u.ID 
        and m.meta_key = 'rec_company' 
        and m.meta_value = '1801' 
        AND 1=1 AND 1=1
AND 1=1 AND 1=1 
AND 1=1 AND 1=1
order by u.ID desc  