-- cfs
INSERT INTO `cfs` (`name`, `country`, `time`, `is_active`, `cf_order`, `created_at`, `updated_at`) 
VALUES ('CITRA', '', '20 - 24 April, 2020', '1', '6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- cfs_map
INSERT INTO `cfs_meta` (`ID`, `cf_name`, `meta_key`, `meta_value`) VALUES 
(NULL, 'CITRA', 'time_str', '10AM - 5PM (MYT)'),
(NULL, 'CITRA', 'organizations', '[]'), 
(NULL, 'CITRA', 'can_login', '1'), 
(NULL, 'CITRA', 'can_register', '1'), 
(NULL, 'CITRA', 'end', 'Apr 24 2020 17:00:00 GMT +0800 (+08)'), 
(NULL, 'CITRA', 'start', 'Apr 20 2020 10:00:00 GMT +0800 (+08)'), 
(NULL, 'CITRA', 'banner', 'CITRA.jpg'), 
(NULL, 'CITRA', 'flag', 'null'), 
(NULL, 'CITRA', 'title', 'CITRA Universiti Malaya'),
(NULL, 'CITRA', 'custom_style', '{\"HEADER_ICON_URL\":\"https://seedsjob.com/students\"}');


