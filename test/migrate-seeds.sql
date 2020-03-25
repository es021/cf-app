-- cfs
INSERT INTO `cfs` (`name`, `country`, `time`, `is_active`, `cf_order`, `created_at`, `updated_at`) 
VALUES ('SEEDS', '', '20 - 24 April, 2020', '1', '6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- cfs_map
INSERT INTO `cfs_meta` (`ID`, `cf_name`, `meta_key`, `meta_value`) VALUES 
(NULL, 'SEEDS', 'time_str', '10AM - 5PM (MYT)'),
(NULL, 'SEEDS', 'organizations', '[]'), 
(NULL, 'SEEDS', 'can_login', '1'), 
(NULL, 'SEEDS', 'can_register', '1'), 
(NULL, 'SEEDS', 'end', 'Apr 24 2020 17:00:00 GMT +0800 (+08)'), 
(NULL, 'SEEDS', 'start', 'Apr 20 2020 10:00:00 GMT +0800 (+08)'), 
(NULL, 'SEEDS', 'banner', 'SEEDS.jpg'), 
(NULL, 'SEEDS', 'flag', 'null'), 
(NULL, 'SEEDS', 'title', 'Seeds Online Career Fair') 