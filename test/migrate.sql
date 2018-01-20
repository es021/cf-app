UPDATE wp_cf_usermeta
SET meta_value = REPLACE (meta_value, 'http://seedsjobfair.com', 'https://seedsjobfair.com/career-fair')
WHERE meta_value like '%http://seedsjobfair.com/wp-content%'

UPDATE doc_link
SET url = REPLACE (url, 'http://seedsjobfair.com', 'https://seedsjobfair.com/career-fair')
WHERE url like '%http://seedsjobfair.com/wp-content%'

UPDATE companies
SET img_url = REPLACE (img_url, 'http://seedsjobfair.com', 'https://seedsjobfair.com/career-fair')
WHERE img_url like '%http://seedsjobfair.com%'