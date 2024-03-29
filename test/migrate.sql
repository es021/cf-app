
-- DROP TABLE
qr_* at prod

-- NEW TABLE 
qr_* from dev

-- NEW PACKAGE
npm install ip --save

-- ALTER TABLE
ALTER TABLE `wp_cf_users` ADD `rec_company_id` BIGINT(20) UNSIGNED NULL DEFAULT NULL AFTER `ID`, ADD INDEX (`rec_company_id`);

-- migrate data
rec_company_id in table users from meta

-- ##############################################################
-- ##############################################################
-- BELOW THIS LINE DAH MIGRATE KE PRODUCTION
-- BELOW THIS LINE DAH MIGRATE KE PRODUCTION
-- ##############################################################
-- ##############################################################
ALTER TABLE `interested` ADD `application_status` 
VARCHAR(50) NULL DEFAULT NULL AFTER `is_interested`, ADD INDEX (`application_status`);

qr_check_in
qr_img

ALTER TABLE `pre_screens` ADD `cancel_reason` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL AFTER `note`;
-- new table
global_dataset_item
multi_input

qr_check_in
qr_img

feature_event_student : OFF 
feature_event_show_all_for_student : ON

ALTER TABLE `hall_gallery` ADD `click_url` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL AFTER `video_url`;
ALTER TABLE `hall_gallery` ADD `is_open_new_tab` TINYINT(1) NULL DEFAULT NULL AFTER `click_url`;


ALTER TABLE `single_input` CHANGE `val` `val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;


CREATE TABLE `wp_career_fair`.`ref_id_utmiv21` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(50)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_id_utmiv21 (val) VALUES ('TEST1'); 
INSERT INTO wp_career_fair.ref_id_utmiv21 (val) VALUES ('TEST2'); 
INSERT INTO wp_career_fair.ref_id_utmiv21 (val) VALUES ('TEST3'); 

-- UTMIV21

UPDATE cfs_meta SET meta_value = 'OFF' WHERE meta_key = 'feature_student_job_post' and cf_name = 'UTMIV21';
UPDATE cfs_meta SET meta_value = 'OFF' WHERE meta_key = 'feature_recruiter_job_post' and cf_name = 'UTMIV21';
UPDATE cfs_meta SET meta_value = 'OFF' WHERE meta_key = 'feature_event' and cf_name = 'UTMIV21';
INSERT INTO cfs_meta (meta_value,meta_key,cf_name) VALUES 
( 'OFF', 'feature_event_student','UTMIV21' );


ALTER TABLE `messages` ADD `id_message` VARCHAR(100) 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci
NULL AFTER `id_message_number`, ADD INDEX (`id_message`);

UPDATE `messages` SET id_message = SUBSTRING_INDEX(id_message_number, ":", 2)


CREATE TABLE `wp_career_fair`.`group_call` 
( `ID` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , 
`company_id` BIGINT(20) UNSIGNED NOT NULL , 
`appointment_time` BIGINT(20) UNSIGNED NOT NULL , 
`url` VARCHAR(500) NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
`updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
`created_by` BIGINT(20) UNSIGNED NOT NULL , 
`updated_by` BIGINT(20) UNSIGNED NULL , 
PRIMARY KEY (`id`), INDEX (`company_id`)) ENGINE = InnoDB;

ALTER TABLE `group_call` ADD `name` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL AFTER `company_id`;
ALTER TABLE `group_call` ADD `is_canceled` TINYINT(1) NOT NULL DEFAULT '0' AFTER `url`, ADD INDEX (`is_canceled`);

CREATE TABLE `wp_career_fair`.`group_call_user` 
( `ID` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , 
`group_call_id` BIGINT(20) UNSIGNED NOT NULL , 
`user_id` BIGINT(20) UNSIGNED NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
`updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
`created_by` BIGINT(20) UNSIGNED NOT NULL , 
`updated_by` BIGINT(20) UNSIGNED NULL , 
PRIMARY KEY (`ID`), 
INDEX (`group_call_id`), INDEX (`user_id`)) ENGINE = InnoDB;

ALTER TABLE `group_call_user` ADD `is_removed` TINYINT(1) 
NOT NULL DEFAULT '0' AFTER `user_id`, ADD INDEX (`is_removed`);

ALTER TABLE `wp_career_fair`.`group_call_user` ADD UNIQUE (`group_call_id`, `user_id`, `is_removed`);

-- cf_company_time_pick
-- cf_company_time_pick
CREATE TABLE `wp_career_fair`.`cf_company_time_pick` 
( `ID` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , 
`cf` VARCHAR(50) NOT NULL , 
`company_id` BIGINT(20) NOT NULL , 
`available_time` TEXT NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
`updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
 PRIMARY KEY (`ID`), UNIQUE (`cf`, `company_id`)) ENGINE = InnoDB;

ALTER TABLE `group_call` ADD `cf` VARCHAR(50) NOT NULL DEFAULT '' AFTER `company_id`, ADD INDEX (`cf`);

ALTER TABLE `resume_drops` ADD `cf` VARCHAR(50) NOT NULL DEFAULT '' AFTER `ID`, ADD INDEX (`cf`);


-- REF
-- utmiv21.sql


-- UTMIV21
-- UTMIV21
-- UTMIV21

-- feature_student_list_iv_only : OFF
-- feature_student_list_resume_drop_only : ON
-- feature_event : ON
-- text_event_webinar : <EMPTY>
-- feature_group_call : ON
-- text_my_interview : My Private Call
-- text_schedule_call : Schedule Private Call
-- feature_recruiter_job_post : ON
-- feature_student_job_post : ON
-- feature_drop_resume : ON
-- feature_chat : ON
-- limit_drop_resume : 4

ALTER TABLE `pivot_student_filter` ADD `is_active` TINYINT NOT NULL DEFAULT '1' AFTER `ID`, ADD INDEX (`is_active`);

CREATE TABLE `company_emails` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `email` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` bigint(20) NOT NULL,
  `updated_by` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `company_emails`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `email` (`email`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`);

ALTER TABLE `company_emails`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `notifications` ADD `user_role` VARCHAR(50) 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL 
AFTER `user_id`, ADD INDEX (`user_role`);

CREATE TABLE `wp_career_fair`.`notifications_read_receipt` 
( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`notification_id` BIGINT(20) NOT NULL , `user_id` BIGINT(20) NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
`updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
PRIMARY KEY (`ID`), 
INDEX (`notification_id`), INDEX (`user_id`)) ENGINE = InnoDB;

ALTER TABLE `notifications` DROP `is_read`;

ALTER TABLE `notifications` CHANGE `img_entity` `img_entity` 
VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL;

ALTER TABLE `notifications` CHANGE `img_id` `img_id` BIGINT(20) NULL;


CREATE TABLE `wp_career_fair`.`announcements` 
( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`cf` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`title` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`body` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
`created_by` BIGINT(20) NOT NULL , 
PRIMARY KEY (`ID`), 
INDEX (`cf`), 
INDEX (`created_by`)
) ENGINE = InnoDB;


CREATE TABLE `wp_career_fair`.`user_note` 
( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`user_id` BIGINT(20) NOT NULL , 
`company_id` BIGINT(20) NOT NULL , 
`note` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL ,
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
`updated_at` TIMESTAMP on update CURRENT_TIMESTAMP 
NOT NULL DEFAULT CURRENT_TIMESTAMP , 
`created_by` BIGINT(20) NOT NULL , 
`updated_by` BIGINT(20) NULL , 
PRIMARY KEY (`ID`), INDEX (`user_id`), 
INDEX (`company_id`), INDEX (`created_by`), 
INDEX (`updated_by`)) ENGINE = InnoDB;

-- drop column text at table notifications

npm install twilio
-- secret
TWILIO_NO: "",
TWILIO_SID : "",
TWILIO_TOKEN : "",

ALTER TABLE `interested` ADD `recruiter_id` BIGINT(20) UNSIGNED NULL AFTER `updated_at`;
ALTER TABLE `wp_career_fair`.`interested` ADD INDEX (`recruiter_id`);
ALTER TABLE `wp_career_fair`.`interested` DROP INDEX `user_id`, ADD UNIQUE `user_id` (`user_id`, `entity`, `entity_id`, `recruiter_id`) USING BTREE;

a.split("\n").map((d)=>{
  return `INSERT INTO ref_taylors21_programme (val) VALUES ('${d.trim()}');`
}).join("\n");

ALTER TABLE `messages` ADD `created_by` BIGINT(20) UNSIGNED NULL AFTER `created_at`, 
ADD INDEX (`created_by`);


select * FROM cf_map  where cf = 'OEJF21' 
and entity = 'user'
and entity_id IN 
(SELECT u.ID FROM wp_cf_users u where u.user_email like 'test%')

ALTER TABLE `pre_screens` ADD `recruiter_id` BIGINT(20) NULL DEFAULT NULL AFTER `company_id`, ADD INDEX (`recruiter_id`);
oejf21.sql

usm21.sql

ALTER TABLE `vacancies` ADD `specialization` VARCHAR(700) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL AFTER `application_url`, ADD INDEX (`specialization`); 

CREATE TABLE `hall_lobby` (
  `ID` bigint(20) NOT NULL,
  `cf` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `item_order` int(11) NOT NULL DEFAULT '0',
  `is_active` smallint(1) NOT NULL DEFAULT '1',
  `title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `color` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` bigint(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `hall_lobby`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `item_order` (`item_order`),
  ADD KEY `is_active` (`is_active`),
  ADD KEY `cf` (`cf`);

ALTER TABLE `hall_lobby`
  MODIFY `ID` bigint(20) NOT NULL AUTO_INCREMENT;

-- ref
utm21.sql

ALTER TABLE `zoom_meetings` ADD `chat_user_id` BIGINT NULL DEFAULT NULL AFTER `pre_screen_id`, ADD INDEX (`chat_user_id`); 
ALTER TABLE `zoom_meetings` CHANGE `zoom_meeting_id` `zoom_meeting_id` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL; 


-- IMPORT FIELD STUDY MAIN
INSERT IGNORE INTO single_input (entity, entity_id, key_input, val)
SELECT m.entity, m.entity_id, 'field_study_main', m.val FROM multi_field_study m, 
(
  SELECT MIN(ID) as id FROM `multi_field_study` where entity = 'user'     
  group by entity_id, entity
)X
where X.id = m.ID

-- IMPORT FIELD STUDY MAIN
INSERT IGNORE INTO single_input (entity, entity_id, key_input, val)
SELECT m.entity, m.entity_id, 'field_study_secondary', m.val FROM multi_field_study m, 
(
  SELECT MIN(ID) as id FROM `multi_field_study` 
  where entity = 'user' 
  and ID NOT IN 
    (SELECT MIN(ID) FROM `multi_field_study` where entity = 'user' group by entity_id, entity) 
  group by entity_id, entity
)X
where X.id = m.ID



ALTER TABLE `pre_screens`  ADD `cf` VARCHAR(50) NULL  AFTER `company_id`;
ALTER TABLE `pre_screens` ADD `reschedule_time` BIGINT(20) UNSIGNED NULL DEFAULT NULL AFTER `appointment_time`; 

CREATE TABLE `is_seen` (
  `ID` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `type` varchar(100) NOT NULL,
  `entity_id` bigint(20) NOT NULL,
  `is_seen` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
ALTER TABLE `is_seen`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `type` (`type`,`entity_id`,`user_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `entity_id` (`entity_id`),
  ADD KEY `type_2` (`type`) USING BTREE;
ALTER TABLE `is_seen`
  MODIFY `ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;


local_or_oversea work_experience_year -- new table tag
CREATE TABLE `wp_career_fair`.`tag` (
  `ID` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `entity_id` BIGINT(20) NOT NULL,
  `label` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  UNIQUE (`entity`, `entity_id`, `label`)
) ENGINE = InnoDB;
-- new ref
monash_school sunway_faculty
ALTER TABLE `events`
ADD `url_rsvp` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL
AFTER `location`;
ALTER TABLE `events`
ADD `url_join` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL
AFTER `location`;
ALTER TABLE `events`
ADD `url_recorded` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL
AFTER `location`;
-- Add auto_expired_at untuk zoom_meetings
ALTER TABLE `zoom_meetings`
ADD `auto_expired_at` BIGINT(20) UNSIGNED NULL COMMENT 'time at which this meeting is make auto ENDED (expired) by cron job'
AFTER `is_expired`;
-- Add PIC untuk note
ALTER TABLE `pre_screens`
ADD `note` TEXT NULL DEFAULT NULL
AFTER `pic`;
-- Add PIC untuk interview
ALTER TABLE `pre_screens`
ADD `pic` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL
AFTER `status`;
-- Add  PIC untuk event
ALTER TABLE `events`
ADD `pic` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL
AFTER `title`;
CREATE TABLE `wp_career_fair`.`events` (
  `ID` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `company_id` BIGINT(20) NOT NULL,
  `type` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `title` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `description` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL,
  `location` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL,
  `start_time` BIGINT(20) NOT NULL,
  `end_time` BIGINT(20) NOT NULL,
  `created_by` BIGINT(20) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` BIGINT(20) NULL,
  `updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  INDEX (`company_id`)
) ENGINE = InnoDB;
ALTER TABLE `wp_career_fair`.`single_input`
ADD INDEX (`val`, `key_input`);
INSERT INTO `cfs_meta` (`ID`, `cf_name`, `meta_key`, `meta_value`)
VALUES (NULL, 'MDEC', 'mail_chimp_list', 'local') -- disabled student from old vicaf
update wp_cf_users
set user_email = CONCAT('DELETED_', user_email)
where ID IN (
    SELECT DISTINCT m.entity_id
    from cf_map m
    WHERE 1 = 1
      and m.cf IN (
        'EUR',
        'USA',
        'NZL',
        'MAS',
        'UK',
        'USA19',
        'CHN',
        'TEST',
        'ANE'
      )
      and m.cf NOT IN('GWINTER')
      and m.entity = 'user'
      and user_email not like '%test%'
      and (
        select m.meta_value
        from wp_cf_usermeta m
        where m.meta_key = 'wp_cf_capabilities'
          and m.entity_id = m.user_id
      ) like '%student%'
  ) --clearing test data
update cf_map
set cf = 'MDEC_TEST'
where cf = 'MDEC'
  and entity_id IN (2279, 136, 225, 302, 328, 2247)
  and entity = 'user'
update interested
set is_interested = 0
where user_id in (2279, 136, 225, 302, 328, 2247)
ALTER TABLE `pre_screens`
ADD `is_onsite_call` SMALLINT NOT NULL DEFAULT '0'
AFTER `is_expired`;
-- new table video
CREATE TABLE `wp_career_fair`.`video` (
  `ID` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `entity` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `entity_id` BIGINT(20) NOT NULL,
  `meta_key` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `url` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  INDEX (`entity`),
  INDEX (`entity_id`),
  INDEX (`meta_key`),
  INDEX (`created_at`)
) ENGINE = InnoDB;
-- new table interested
CREATE TABLE `wp_career_fair`.`interested` (
  `ID` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT(20) NOT NULL,
  `entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `entity_id` BIGINT(20) NOT NULL,
  `is_interested` TINYINT NOT NULL DEFAULT '1',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  UNIQUE (`user_id`, `entity`, `entity_id`)
) ENGINE = InnoDB;
-- add location column  in vacancies  latin1_swedish_ci 
ALTER TABLE `vacancies`
ADD `location` VARCHAR(700) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL
AFTER `title`;
ALTER TABLE `vacancies` DROP `ref_city`;
ALTER TABLE `vacancies` DROP `ref_state`;
ALTER TABLE `vacancies` DROP `ref_country`;
-- to migrate from wp_cf_usermeta to single_input 
insert INTO single_input (entity, entity_id, key_input, val) (
    select "user",
      m.user_id,
      "first_name",
      m.meta_value
    from wp_cf_usermeta m
    where m.meta_key = "first_name"
  ) ON DUPLICATE KEY
UPDATE key_input = "first_name";
insert INTO single_input (entity, entity_id, key_input, val) (
    select "user",
      m.user_id,
      "last_name",
      m.meta_value
    from wp_cf_usermeta m
    where m.meta_key = "last_name"
  ) ON DUPLICATE KEY
UPDATE key_input = "last_name";
insert INTO single_input (entity, entity_id, key_input, val) (
    select "user",
      m.user_id,
      "university",
      m.meta_value
    from wp_cf_usermeta m
    where m.meta_key = "university"
  ) ON DUPLICATE KEY
UPDATE key_input = "university";
-- #################################################
-- ps_daily_co_deleted
CREATE TABLE `wp_career_fair`.`ps_daily_co_deleted` (
  `ID` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `pre_screens_id` BIGINT(20) NOT NULL,
  `room_name` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
) ENGINE = InnoDB;
ALTER TABLE `wp_career_fair`.`ps_daily_co_deleted`
ADD UNIQUE (`pre_screens_id`, `room_name`);
-- ##################################
-- custom company message after resume dropped
ALTER TABLE `companies`
ADD `message_drop_resume` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL
AFTER `group_url`;
-- ##################################
-- Create Reserved company Id to avoid clash in support_session
INSERT INTO `companies` (
    `ID`,
    `name`,
    `tagline`,
    `description`,
    `more_info`,
    `img_url`,
    `img_position`,
    `img_size`,
    `banner_url`,
    `banner_position`,
    `banner_size`,
    `status`,
    `rec_privacy`,
    `sponsor_only`,
    `type`,
    `is_confirmed`,
    `group_url`,
    `accept_prescreen`,
    `priviledge`,
    `created_at`,
    `updated_at`
  )
VALUES (
    '681',
    'ReservedForSupportId',
    NULL,
    NULL,
    NULL,
    NULL,
    'center center',
    NULL,
    NULL,
    'center center',
    NULL,
    'Open',
    '0',
    '0',
    '4',
    '0',
    NULL,
    '0',
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );
-- ##################################
-- Company Chat ( Support Session Table )
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
CREATE TABLE `support_sessions` (
  `ID` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `support_id` bigint(20) NOT NULL,
  `message_count_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = latin1;
--
-- Dumping data for table `support_sessions`
--
INSERT INTO `support_sessions` (
    `ID`,
    `user_id`,
    `support_id`,
    `message_count_id`,
    `created_at`
  )
VALUES (
    1,
    1449,
    681,
    'user681:user1449',
    '2019-02-05 03:12:02'
  ),
  (
    2,
    1265,
    681,
    'user681:user1265',
    '2019-02-12 00:23:33'
  ),
  (
    3,
    1480,
    681,
    'user681:user1480',
    '2019-02-17 21:30:12'
  ),
  (
    4,
    1315,
    681,
    'user681:user1315',
    '2019-02-18 01:40:34'
  ),
  (
    5,
    1310,
    681,
    'user681:user1310',
    '2019-02-18 15:15:29'
  ),
  (
    6,
    317,
    681,
    'user317:user681',
    '2019-03-30 15:16:56'
  ),
  (
    7,
    1827,
    681,
    'user681:user1827',
    '2019-04-05 13:54:19'
  ),
  (
    8,
    840,
    681,
    'user681:user840',
    '2019-04-16 01:27:59'
  ),
  (
    9,
    1889,
    681,
    'user681:user1889',
    '2019-04-16 15:43:24'
  ),
  (
    10,
    386,
    681,
    'user386:user681',
    '2019-04-16 21:05:29'
  ),
  (
    11,
    225,
    681,
    'user225:user681',
    '2019-04-20 02:19:38'
  );
--
-- Indexes for table `support_sessions`
--
ALTER TABLE `support_sessions`
ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `user_id` (`user_id`, `support_id`) USING BTREE;
ALTER TABLE `support_sessions`
MODIFY `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 12;
-- ##################################
-- ANE 
ALTER TABLE `cfs`
ADD `is_load` TINYINT(1) NOT NULL DEFAULT '1'
AFTER `is_active`;
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
) ENGINE = InnoDB DEFAULT CHARSET = latin1;
INSERT INTO `hall_gallery` (
    `ID`,
    `cf`,
    `item_order`,
    `is_active`,
    `title`,
    `description`,
    `type`,
    `img_url`,
    `img_pos`,
    `img_size`,
    `video_url`,
    `created_by`,
    `created_at`,
    `updated_by`,
    `updated_at`
  )
VALUES (
    1,
    'EUR',
    5,
    1,
    'Europe Virtual Career Fair',
    'Part of the journey is the end',
    'image',
    'http://localhost:4000/asset/image/banner/EUR.jpg',
    'center center',
    'cover',
    NULL,
    136,
    '2019-04-27 03:23:00',
    NULL,
    '2019-04-27 04:25:17'
  ),
  (
    2,
    'EUR',
    2,
    1,
    'Avenger Endgame',
    'Whatever it takes',
    'image',
    'http://localhost:4000/asset/image/banner/USA.jpg',
    'center center',
    'cover',
    NULL,
    136,
    '2019-04-27 03:23:13',
    NULL,
    '2019-04-27 04:25:33'
  ),
  (
    3,
    'EUR',
    1,
    1,
    'Gambar 3',
    'Lorem ipsume blablabla\r\nAvengerss',
    'image',
    'http://localhost:4000/asset/image/banner/CHN.jpg',
    'center center',
    'cover',
    NULL,
    136,
    '2019-04-27 03:23:18',
    NULL,
    '2019-04-27 03:39:55'
  ),
  (
    4,
    'EUR',
    3,
    1,
    'Gambar 4',
    'Lorem ipsume blablabla\r\nAvengerss',
    'image',
    'http://localhost:4000/asset/image/banner/NZL.jpg',
    'center center',
    'cover',
    NULL,
    136,
    '2019-04-27 03:23:20',
    NULL,
    '2019-04-27 03:39:58'
  ),
  (
    5,
    'EUR',
    4,
    0,
    'Gambar 5',
    'Lorem ipsume blablabla\r\nAvengerss',
    'image',
    'http://localhost:4000/asset/image/banner/UK.jpg',
    'center center',
    'cover',
    NULL,
    136,
    '2019-04-27 03:23:23',
    NULL,
    '2019-05-01 06:59:17'
  ),
  (
    7,
    'EUR',
    0,
    1,
    'Video Youtube',
    NULL,
    'video',
    NULL,
    NULL,
    NULL,
    'https://youtu.be/RNMTDv-w9MU',
    136,
    '2019-05-01 06:58:47',
    NULL,
    '2019-05-01 06:58:47'
  );
ALTER TABLE `hall_gallery`
ADD PRIMARY KEY (`ID`),
  ADD KEY `item_order` (`item_order`),
  ADD KEY `is_active` (`is_active`),
  ADD KEY `cf` (`cf`);
ALTER TABLE `hall_gallery`
MODIFY `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 8;
COMMIT;
-- ###############################
-- POST USA19
-- add logo_height_sm and log_width_sm
INSERT INTO `cfs_meta`(`cf_name`, `meta_key`, `meta_value`)
VALUES ("EUR", "logo_height_hall", "68px"),
  ("EUR", "logo_width_hall", "120px"),
  ("EUR", "logo_margin_hall", "-11px 0px -6px 0px") -- DONE MIGRATED ---------------------------------------------------------------------------
  -- ###############################
  -- 03/04/2019
ALTER TABLE `notifications`
ADD `param` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL
AFTER `type`;
-- ###############################
-- 02/04/2019
ALTER TABLE `pre_screens` CHANGE `join_url` `join_url` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL;
ALTER TABLE `pre_screens` CHANGE `start_url` `start_url` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL;
ALTER TABLE `pre_screens` CHANGE `is_expired` `is_expired` SMALLINT(1) NOT NULL DEFAULT '0';
-- ###############################
-- copy cf meta
INSERT INTO cfs_meta (cf_name, meta_key, meta_value)
SELECT 'SUNWAYGETHIRED21',
  meta_key,
  meta_value
FROM cfs_meta
where cf_name = 'SUNWAYGRD21' 
-- ###############################
  -- change request
ALTER TABLE `pre_screens`
ADD `join_url` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL
AFTER `appointment_time`,
  ADD `start_url` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL
AFTER `join_url`,
  ADD `is_expired` SMALLINT(1) NOT NULL
AFTER `start_url`;
ALTER TABLE `zoom_meetings`
ADD `pre_screen_id` BIGINT(20) NOT NULL
AFTER `group_session_id`,
  ADD INDEX (`pre_screen_id`);
ALTER TABLE `zoom_meetings` CHANGE `pre_screen_id` `pre_screen_id` BIGINT(20) NULL;
ALTER TABLE `wp_career_fair`.`zoom_meetings`
ADD INDEX (`group_session_id`);
-- ###############################
-- New CF China
INSERT INTO `cfs` (
    `ID`,
    `name`,
    `country`,
    `time`,
    `is_active`,
    `cf_order`,
    `created_at`,
    `updated_at`
  )
VALUES (
    '7',
    'CHN',
    'CHINA',
    '17-18, May 2019',
    '1',
    '6',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ) -- ###############################
  -- new approved status
  -- // New SI Flow
UPDATE pre_screens
SET status = '2_Approved'
WHERE status = 'Approved' -- add banner info in companies
ALTER TABLE `companies`
ADD `banner_url` VARCHAR(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL
AFTER `img_size`,
  ADD `banner_position` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'center center'
AFTER `banner_url`,
  ADD `banner_size` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL
AFTER `banner_position`;
UPDATE wp_cf_usermeta
SET meta_value = REPLACE (
    meta_value,
    'http://seedsjobfairapp.com',
    'https://seedsjobfairapp.com/career-fair'
  )
WHERE meta_value like '%http://seedsjobfairapp.com/wp-content%'
UPDATE doc_link
SET url = REPLACE (
    url,
    'http://seedsjobfairapp.com',
    'https://seedsjobfairapp.com/career-fair'
  )
WHERE url like '%http://seedsjobfairapp.com/wp-content%'
UPDATE companies
SET img_url = REPLACE (
    img_url,
    'http://seedsjobfairapp.com',
    'https://seedsjobfairapp.com/career-fair'
  )
WHERE img_url like '%http://seedsjobfairapp.com%' -- ###############################
  -- npm
  npm install eslint - plugin - jsx --save-dev
  npm install crypto --save-dev
  npm install base64 - stream --save-dev
  --npm install base-64 --save-dev