
-- ###############################
-- POST USA19

-- add logo_height_sm and log_width_sm
SELECT * FROM `cfs_meta` where meta_key like '%logo%'

-- ###############################
-- 03/04/2019

ALTER TABLE `notifications` ADD `param` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL AFTER `type`; 

-- ###############################
-- 02/04/2019

ALTER TABLE `pre_screens` CHANGE `join_url` `join_url` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL;
ALTER TABLE `pre_screens` CHANGE `start_url` `start_url` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL;
ALTER TABLE `pre_screens` CHANGE `is_expired` `is_expired` SMALLINT(1) NOT NULL DEFAULT '0';

-- ###############################
-- copy cf meta
INSERT INTO cfs_meta (cf_name, meta_key, meta_value) 
SELECT 'CHN', meta_key, meta_value FROM cfs_meta 
where cf_name = 'USA19' 

-- ###############################
-- change request
ALTER TABLE `pre_screens` ADD `join_url` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL AFTER `appointment_time`, ADD `start_url` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL AFTER `join_url`, ADD `is_expired` SMALLINT(1) NOT NULL AFTER `start_url`;
ALTER TABLE `zoom_meetings` ADD `pre_screen_id` BIGINT(20) NOT NULL AFTER `group_session_id`, ADD INDEX (`pre_screen_id`);
ALTER TABLE `zoom_meetings` CHANGE `pre_screen_id` `pre_screen_id` BIGINT(20) NULL; 
ALTER TABLE `wp_career_fair`.`zoom_meetings` ADD INDEX (`group_session_id`); 

-- ###############################
-- New CF China
INSERT INTO `cfs` (`ID`, `name`, `country`, `time`, `is_active`, `cf_order`, `created_at`, `updated_at`) VALUES ('7', 'CHN', 'CHINA', '17-18, May 2019', '1', '6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

-- ###############################
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


-- ###############################
-- npm

npm install eslint-plugin-jsx --save-dev
npm install crypto --save-dev
npm install base64-stream --save-dev

--npm install base-64 --save-dev
