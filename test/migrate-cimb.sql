-- cfs
INSERT INTO `cfs` (`ID`, `name`, `country`, `time`, `is_active`, `is_load`, `cf_order`, `created_at`, `updated_at`) 
VALUES (NULL, 'CIMB', 'CIMB', '15, April 2020', '1', '1', '5', '2019-03-31 18:04:51', '2019-05-25 11:25:00');

-- cfs_map
INSERT INTO `cfs_meta` (`ID`, `cf_name`, `meta_key`, `meta_value`) VALUES 
(NULL, 'CIMB', 'title', 'CIMB Virtual Career Fair'), 
(NULL, 'CIMB', 'flag', 'null'), 
(NULL, 'CIMB', 'banner', 'CIMB.jpg'), 
(NULL, 'CIMB', 'schedule_time_start', 'April 15 2020 09:00:00 GMT +0800 (+08)'), 
(NULL, 'CIMB', 'schedule_time_end', 'April 20 2020 21:00:00 GMT +0800 (+08)'), 
(NULL, 'CIMB', 'start', 'April 15 2020 09:00:00 GMT +0800 (+08)'), 
(NULL, 'CIMB', 'end', 'April 20 2020 21:00:00 GMT +0800 (+08)'), 
(NULL, 'CIMB', 'time_str', '9AM - 1PM (MYT)'), 
(NULL, 'CIMB', 'test_start', 'April 15 2018 04:30:00 GMT +0800 (+08)'), 
(NULL, 'CIMB', 'test_end', 'April 20 2018 11:00:00 GMT +0800 (+08)'), 
(NULL, 'CIMB', 'can_register', '1'), 
(NULL, 'CIMB', 'can_login', '1'), 
(NULL, 'CIMB', 'schedule', '{\"timezone\":\"GMT +0800 (+08)\",\"data\":[]}'), 
(NULL, 'CIMB', 'custom_style', '{\"HEADER_ICON\":\"cimb_icon.png\",\"HEADER_ICON_URL\":\"https://seedsjobfair.com/virtual-fairs\",\"HEADER_DESC\":\"Powered By Seeds\"}'), 
(NULL, 'CIMB', 'custom_feature', ''),
(NULL, 'CIMB', 'organizations', '[]');
