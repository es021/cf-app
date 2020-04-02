-- cfs
INSERT INTO `cfs` (`ID`, `name`, `country`, `time`, `is_active`, `is_load`, `cf_order`, `created_at`, `updated_at`) 
VALUES (NULL, 'CIMB', 'CIMB', '15, April 2020', '1', '1', '5', '2019-03-31 18:04:51', '2019-05-25 11:25:00');

-- cfs_map
INSERT INTO `cfs_meta` (`ID`, `cf_name`, `meta_key`, `meta_value`) VALUES 
(NULL, 'CIMB', 'title', 'CIMB Virtual Campus & Career Tour'), 
(NULL, 'CIMB', 'flag', 'null'), 
(NULL, 'CIMB', 'banner', 'CIMB.jpg'), 
(NULL, 'CIMB', 'start', 'March 26 2020 10:00:00 GMT +0800 (+08)'), 
(NULL, 'CIMB', 'end', 'March 31 2020 17:00:00 GMT +0800 (+08)'), 
(NULL, 'CIMB', 'time_str', '10AM - 5PM (MYT)'), 
(NULL, 'CIMB', 'can_register', '1'), 
(NULL, 'CIMB', 'can_login', '1'), 
(NULL, 'CIMB', 'custom_style', '{\"HEADER_ICON\":\"cimb_icon.png\",\"HEADER_DESC\":\"Powered By Seeds\"}'), 
(NULL, 'CIMB', 'custom_feature', ''),
(NULL, 'CIMB', 'organizations', '[{\"label\":\"In Collaboration With\",\"icon_size\":\"150\",\"data\":[{\"name\":\"United Kingdom and Eire (Ireland) Council for Malaysian Students\",\"logo\":\"UKEC.png\",\"shortname\":\"UKEC\"}]}]');

