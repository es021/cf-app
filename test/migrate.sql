-- new approved status
-- // New SI Flow
UPDATE pre_screens SET status = '2_Approved' WHERE status = 'Approved' 

-- add banner info in companies
ALTER TABLE `companies` ADD `banner_url` VARCHAR(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL AFTER `img_size`, ADD `banner_position` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'center center' AFTER `banner_url`, ADD `banner_size` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL AFTER `banner_position`;


UPDATE wp_cf_usermeta
SET meta_value = REPLACE (meta_value, 'http://seedsjobfairapp.com', 'https://seedsjobfairapp.com/career-fair')
WHERE meta_value like '%http://seedsjobfairapp.com/wp-content%'

UPDATE doc_link
SET url = REPLACE (url, 'http://seedsjobfairapp.com', 'https://seedsjobfairapp.com/career-fair')
WHERE url like '%http://seedsjobfairapp.com/wp-content%'

UPDATE companies
SET img_url = REPLACE (img_url, 'http://seedsjobfairapp.com', 'https://seedsjobfairapp.com/career-fair')
WHERE img_url like '%http://seedsjobfairapp.com%'

