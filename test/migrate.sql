-- ##################################
-- ANE 
ALTER TABLE `cfs` ADD `is_load` TINYINT(1) NOT NULL DEFAULT '1' AFTER `is_active`;

-- #######################################
-- HALL GALLERY

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `hall_gallery` (
  `ID` bigint(20) NOT NULL,
  `cf` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `item_order` int(11) NOT NULL DEFAULT '0',
  `is_active` smallint(1) NOT NULL DEFAULT '1',
  `title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci,
  `type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `img_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci,
  `img_pos` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `img_size` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `video_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci,
  `created_by` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` bigint(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `hall_gallery` (`ID`, `cf`, `item_order`, `is_active`, `title`, `description`, `type`, `img_url`, `img_pos`, `img_size`, `video_url`, `created_by`, `created_at`, `updated_by`, `updated_at`) VALUES
(1, 'EUR', 5, 1, 'Europe Virtual Career Fair', 'Part of the journey is the end', 'image', 'http://localhost:4000/asset/image/banner/EUR.jpg', 'center center', 'cover', NULL, 136, '2019-04-27 03:23:00', NULL, '2019-04-27 04:25:17'),
(2, 'EUR', 2, 1, 'Avenger Endgame', 'Whatever it takes', 'image', 'http://localhost:4000/asset/image/banner/USA.jpg', 'center center', 'cover', NULL, 136, '2019-04-27 03:23:13', NULL, '2019-04-27 04:25:33'),
(3, 'EUR', 1, 1, 'Gambar 3', 'Lorem ipsume blablabla\r\nAvengerss', 'image', 'http://localhost:4000/asset/image/banner/CHN.jpg', 'center center', 'cover', NULL, 136, '2019-04-27 03:23:18', NULL, '2019-04-27 03:39:55'),
(4, 'EUR', 3, 1, 'Gambar 4', 'Lorem ipsume blablabla\r\nAvengerss', 'image', 'http://localhost:4000/asset/image/banner/NZL.jpg', 'center center', 'cover', NULL, 136, '2019-04-27 03:23:20', NULL, '2019-04-27 03:39:58'),
(5, 'EUR', 4, 0, 'Gambar 5', 'Lorem ipsume blablabla\r\nAvengerss', 'image', 'http://localhost:4000/asset/image/banner/UK.jpg', 'center center', 'cover', NULL, 136, '2019-04-27 03:23:23', NULL, '2019-05-01 06:59:17'),
(7, 'EUR', 0, 1, 'Video Youtube', NULL, 'video', NULL, NULL, NULL, 'https://youtu.be/RNMTDv-w9MU', 136, '2019-05-01 06:58:47', NULL, '2019-05-01 06:58:47');

ALTER TABLE `hall_gallery`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `item_order` (`item_order`),
  ADD KEY `is_active` (`is_active`),
  ADD KEY `cf` (`cf`);

ALTER TABLE `hall_gallery`
  MODIFY `ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

-- ###############################
-- POST USA19

-- add logo_height_sm and log_width_sm
INSERT INTO `cfs_meta`(`cf_name`, `meta_key`, `meta_value`) 
VALUES 
("EUR","logo_height_hall","68px"),
("EUR","logo_width_hall","120px"),
("EUR","logo_margin_hall","-11px 0px -6px 0px")








-- DONE MIGRATED ---------------------------------------------------------------------------
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
SELECT 'ANE', meta_key, meta_value FROM cfs_meta 
where cf_name = 'USA19' 

-- ###############################
-- change request
ALTER TABLE `pre_screens` ADD `join_url` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL AFTER `appointment_time`, ADD `start_url` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL AFTER `join_url`, ADD `is_expired` SMALLINT(1) NOT NULL AFTER `start_url`;
ALTER TABLE `zoom_meetings` ADD `pre_screen_id` BIGINT(20) NOT NULL AFTER `group_session_id`, ADD INDEX (`pre_screen_id`);
ALTER TABLE `zoom_meetings` CHANGE `pre_screen_id` `pre_screen_id` BIGINT(20) NULL; 
ALTER TABLE `wp_career_fair`.`zoom_meetings` ADD INDEX (`group_session_id`); 

-- ###############################
-- New CF China
INSERT INTO `cfs` (`ID`, `name`, `country`, `time`, `is_active`, `cf_order`, `created_at`, `updated_at`) 
VALUES ('7', 'CHN', 'CHINA', '17-18, May 2019', '1', '6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

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
